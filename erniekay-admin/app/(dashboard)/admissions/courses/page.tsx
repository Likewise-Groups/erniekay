import Link from "next/link";
import { asc, sql } from "drizzle-orm";

import { Card, EmptyRow, Notice, PageHeader, Table, Td, Th } from "@/components/ui";
import { requireAdmin } from "@/lib/auth";
import { admissionsApplications, courses, enrollments, getDb } from "@/lib/db";
import { formatMoney, truncate } from "@/lib/format";

import CourseForm from "./CourseForm";
import { deleteCourse } from "./actions";

export const metadata = { title: "Programmes · Erniekay Admin" };
export const dynamic = "force-dynamic";

const NOTICES: Record<string, { tone: "success" | "error"; message: string }> = {
  created: { tone: "success", message: "Programme added." },
  updated: { tone: "success", message: "Programme saved." },
  deleted: { tone: "success", message: "Programme removed." },
  unchanged: { tone: "success", message: "Nothing to change." },
  "slug-taken": { tone: "error", message: "Another programme already uses that web address." },
  missing: { tone: "error", message: "That programme no longer exists." },
};

/**
 * The academy prospectus.
 *
 * Sits under /admissions rather than in the sidebar because a programme only
 * exists to be applied to: the people editing this are the same people working
 * the applications queue, and they get here from it. The counts in each row are
 * the link back — a programme with applications against it is one that cannot
 * be removed, and the row says so before the button is pressed.
 */
export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string; edit?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const db = getDb();

  const rows = await db
    .select({
      id: courses.id,
      title: courses.title,
      slug: courses.slug,
      description: courses.description,
      price: courses.price,
      durationWeeks: courses.durationWeeks,
      level: courses.level,
      applications: sql<number>`(
        SELECT COUNT(*)::int FROM ${admissionsApplications}
        WHERE ${admissionsApplications.programId} = ${courses.id}
      )`,
      enrolled: sql<number>`(
        SELECT COUNT(*)::int FROM ${enrollments}
        WHERE ${enrollments.courseId} = ${courses.id}
      )`,
    })
    .from(courses)
    .orderBy(asc(courses.title));

  const editing = params.edit ? rows.find((row) => row.id === params.edit) : undefined;

  // Anything that is not a known key is a validation message the action passed
  // through verbatim — the alternative is a lookup table that has to be kept in
  // step with every rule in readCourse().
  const notice = params.notice;
  const banner = notice
    ? (NOTICES[notice] ??
      (notice.startsWith("in-use-")
        ? {
            tone: "error" as const,
            message: `That programme still has ${notice.slice(7)} application(s) or enrolment(s) against it. Those records would lose their meaning, so it cannot be removed.`,
          }
        : { tone: "error" as const, message: notice }))
    : undefined;

  return (
    <>
      <PageHeader
        title="Programmes"
        description="The academy prospectus. Applications point at these, so what is here is what an applicant can choose."
        actions={
          <Link
            href="/admissions"
            className="rounded-xl border border-brand/10 bg-white px-3.5 py-2 text-sm font-semibold text-brand transition-all duration-200 hover:bg-cream"
          >
            ← Applications
          </Link>
        }
      />

      {banner ? <Notice tone={banner.tone}>{banner.message}</Notice> : null}

      <Card title={editing ? `Edit “${editing.title}”` : "Add a programme"} className="mb-6">
        {/* Keyed so switching between rows resets the fields rather than
            leaving the previous programme's values in the inputs. */}
        <CourseForm
          key={editing?.id ?? "new"}
          course={editing}
          onCancelHref={editing ? "/admissions/courses" : undefined}
        />
      </Card>

      <Card>
        <Table>
          <thead>
            <tr>
              <Th>Programme</Th>
              <Th className="text-right">Price</Th>
              <Th className="text-right">Weeks</Th>
              <Th className="text-right">Applications</Th>
              <Th />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <EmptyRow colSpan={5}>
                No programmes yet. Add one above — until then an applicant has nothing to choose.
              </EmptyRow>
            ) : (
              rows.map((row) => {
                const references = row.applications + row.enrolled;

                return (
                  <tr key={row.id} className="align-top transition-colors duration-150 hover:bg-cream/60">
                    <Td>
                      <span className="block font-medium text-slate-800">{row.title}</span>
                      <span className="block font-mono text-xs text-slate-400">{row.slug}</span>
                      {row.level ? (
                        <span className="mt-1 inline-block rounded-full bg-brand-ink/5 px-2 py-0.5 text-xs text-brand-ink/60">
                          {row.level}
                        </span>
                      ) : null}
                      {row.description ? (
                        <span className="mt-1 block max-w-md text-xs text-slate-500">
                          {truncate(row.description, 120)}
                        </span>
                      ) : null}
                    </Td>
                    <Td className="whitespace-nowrap text-right">
                      {formatMoney(row.price, "GHS")}
                    </Td>
                    <Td className="text-right">{row.durationWeeks}</Td>
                    <Td className="text-right">
                      {row.applications ? (
                        <Link
                          href="/admissions"
                          className="font-medium text-brand hover:underline decoration-gold/30"
                        >
                          {row.applications}
                        </Link>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                      {row.enrolled ? (
                        <span className="block text-xs text-slate-500">
                          {row.enrolled} enrolled
                        </span>
                      ) : null}
                    </Td>
                    <Td>
                      <div className="flex justify-end gap-1.5">
                        <Link
                          href={`/admissions/courses?edit=${row.id}`}
                          className="rounded-xl border border-brand/10 bg-white px-2.5 py-1 text-xs font-semibold text-brand transition-all duration-200 hover:bg-cream"
                        >
                          Edit
                        </Link>

                        {references === 0 ? (
                          <form action={deleteCourse}>
                            <input type="hidden" name="id" value={row.id} />
                            <button
                              type="submit"
                              className="rounded-xl border border-rose-500/20 px-2.5 py-1 text-xs font-semibold text-rose-700 transition-all duration-200 hover:bg-rose-500/5"
                            >
                              Delete
                            </button>
                          </form>
                        ) : (
                          <span
                            title={`${references} record(s) reference this programme`}
                            className="rounded-xl border border-transparent px-2.5 py-1 text-xs text-slate-400"
                          >
                            In use
                          </span>
                        )}
                      </div>
                    </Td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
      </Card>
    </>
  );
}
