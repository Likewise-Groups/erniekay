"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { count, eq, ne, and } from "drizzle-orm";

import { recordAudit } from "@/lib/audit";
import { requireAdmin } from "@/lib/auth";
import { admissionsApplications, courses, enrollments, getDb } from "@/lib/db";

/**
 * The academy prospectus, as data.
 *
 * Until now nothing could write to the Course table at all: applications point
 * at a programme by id, so a programme could only be added with SQL. These are
 * the three writes that fix that.
 *
 * Course has no `status` column, so there is no "archive" — which is why
 * deletion is guarded rather than offered freely. See deleteCourse.
 */

function back(notice: string, id?: string): never {
  revalidatePath("/admissions/courses");
  revalidatePath("/admissions");
  const query = new URLSearchParams({ notice });
  if (id) query.set("edit", id);
  redirect(`/admissions/courses?${query.toString()}`);
}

/**
 * URL-safe, lowercase, no runs of dashes.
 *
 * Course.slug is uniquely indexed and is what a course page would be addressed
 * by, so it is derived rather than typed when the field is left blank —
 * a human typing "Bridal Artistry " once produces a slug nobody can link to.
 */
// Not exported: every export of a "use server" module must be an async
// function, and this one is neither.
function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

type CourseInput = {
  title: string;
  slug: string;
  description: string | null;
  price: number;
  durationWeeks: number;
  level: string | null;
};

/** Returns the parsed course, or a message explaining what is wrong with it. */
function readCourse(formData: FormData): CourseInput | string {
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return "A programme needs a title.";
  if (title.length > 160) return "That title is too long.";

  const slug = slugify(String(formData.get("slug") ?? "").trim() || title);
  if (!slug) return "That title produces an empty web address — add some letters or numbers.";

  const price = Number(formData.get("price"));
  if (!Number.isFinite(price) || price < 0) return "Price must be a number, and not negative.";

  const durationWeeks = Number(formData.get("durationWeeks"));
  if (!Number.isInteger(durationWeeks) || durationWeeks < 1 || durationWeeks > 520) {
    return "Duration must be a whole number of weeks between 1 and 520.";
  }

  return {
    title,
    slug,
    description: String(formData.get("description") ?? "").trim().slice(0, 2000) || null,
    price,
    durationWeeks,
    level: String(formData.get("level") ?? "").trim().slice(0, 80) || null,
  };
}

export async function createCourse(formData: FormData): Promise<void> {
  const admin = await requireAdmin();

  const input = readCourse(formData);
  // The message goes through as-is: URLSearchParams encodes it, and Next
  // decodes searchParams before the page sees them.
  if (typeof input === "string") back(input);

  const db = getDb();

  // Checked before inserting so the operator gets "that web address is taken"
  // rather than a unique-constraint error page.
  const [clash] = await db
    .select({ id: courses.id })
    .from(courses)
    .where(eq(courses.slug, input.slug))
    .limit(1);
  if (clash) back("slug-taken");

  const [created] = await db.insert(courses).values(input).returning({ id: courses.id });

  await recordAudit(admin, {
    entity: "course",
    entityId: created.id,
    action: "programme created",
    detail: `${input.title} (${input.slug}), GHS ${input.price}, ${input.durationWeeks} weeks`,
  });

  back("created");
}

export async function updateCourse(formData: FormData): Promise<void> {
  const admin = await requireAdmin();

  const id = String(formData.get("id") ?? "");
  if (!id) back("missing");

  const input = readCourse(formData);
  if (typeof input === "string") back(input, id);

  const db = getDb();

  const [before] = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
  if (!before) back("missing");

  const [clash] = await db
    .select({ id: courses.id })
    .from(courses)
    .where(and(eq(courses.slug, input.slug), ne(courses.id, id)))
    .limit(1);
  if (clash) back("slug-taken", id);

  await db.update(courses).set(input).where(eq(courses.id, id));

  // Only what actually changed, so the trail reads as a history rather than a
  // dump of the row on every save.
  const changes = (Object.keys(input) as Array<keyof CourseInput>)
    .filter((key) => (before[key] ?? null) !== (input[key] ?? null))
    .map((key) => `${key}: ${before[key] ?? "—"} -> ${input[key] ?? "—"}`);

  if (changes.length) {
    await recordAudit(admin, {
      entity: "course",
      entityId: id,
      action: "programme edited",
      detail: `${input.title}: ${changes.join("; ")}`.slice(0, 1000),
    });
  }

  back(changes.length ? "updated" : "unchanged");
}

/**
 * Removes a programme, unless anything points at it.
 *
 * AdmissionsApplication.programId and Enrollment.courseId are both foreign keys
 * with no ON DELETE behaviour, so the database would refuse this anyway — but
 * it would refuse it as a 500. Counting first turns that into "3 applications
 * reference this programme", which tells the operator what to do next. It also
 * protects the history: an accepted applicant whose programme vanished is a
 * record nobody can interpret later.
 */
export async function deleteCourse(formData: FormData): Promise<void> {
  const admin = await requireAdmin();

  const id = String(formData.get("id") ?? "");
  if (!id) back("missing");

  const db = getDb();

  const [course] = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
  if (!course) back("missing");

  const [[applications], [enrolled]] = await Promise.all([
    db
      .select({ value: count() })
      .from(admissionsApplications)
      .where(eq(admissionsApplications.programId, id)),
    db.select({ value: count() }).from(enrollments).where(eq(enrollments.courseId, id)),
  ]);

  const references = (applications?.value ?? 0) + (enrolled?.value ?? 0);
  if (references > 0) back(`in-use-${references}`);

  await db.delete(courses).where(eq(courses.id, id));

  await recordAudit(admin, {
    entity: "course",
    entityId: id,
    action: "programme deleted",
    detail: `${course.title} (${course.slug})`,
  });

  back("deleted");
}
