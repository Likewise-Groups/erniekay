import Link from "next/link";
import { and, count, desc, eq, or, sql, type SQL } from "drizzle-orm";

import {
  Card,
  EmptyRow,
  FilterTabs,
  Notice,
  PageHeader,
  Pagination,
  StatusBadge,
  Table,
  Td,
  Th,
} from "@/components/ui";
import { requireAdmin } from "@/lib/auth";
import { admissionsApplications, courses, getDb } from "@/lib/db";
import { formatDateTime } from "@/lib/format";
import { ADMISSION_STATUSES } from "@/lib/status";

import { updateAdmissionStatus } from "./actions";

export const metadata = { title: "Admissions · Erniekay Admin" };
export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;

const NOTICES: Record<string, { tone: "success" | "error"; message: string }> = {
  updated: { tone: "success", message: "Application updated." },
  unchanged: { tone: "success", message: "Nothing to change." },
  invalid: { tone: "error", message: "That status is not one we use." },
  missing: { tone: "error", message: "That application no longer exists." },
};

/**
 * Academy applications, with the review decision made inline.
 *
 * No detail page: an application is eight fields, all of which fit in a row.
 * A separate page per applicant would be a click between reading and deciding,
 * on the one screen where staff work through a queue.
 */
export default async function AdmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; page?: string; notice?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const db = getDb();

  const page = Math.max(1, Number(params.page) || 1);
  const status = params.status ?? "";
  const search = params.q?.trim() ?? "";

  const filters: SQL[] = [];
  if (status) filters.push(eq(admissionsApplications.status, status));
  if (search) {
    const pattern = `%${search.replace(/[%_]/g, (char) => `\\${char}`)}%`;
    const term = or(
      sql`${admissionsApplications.firstName} ILIKE ${pattern}`,
      sql`${admissionsApplications.lastName} ILIKE ${pattern}`,
      sql`${admissionsApplications.email} ILIKE ${pattern}`,
      sql`${admissionsApplications.phone} ILIKE ${pattern}`,
    );
    if (term) filters.push(term);
  }

  const [rows, statusCounts, programmes] = await Promise.all([
    db
      .select({
        id: admissionsApplications.id,
        firstName: admissionsApplications.firstName,
        lastName: admissionsApplications.lastName,
        email: admissionsApplications.email,
        phone: admissionsApplications.phone,
        status: admissionsApplications.status,
        experience: admissionsApplications.experience,
        portfolioUrl: admissionsApplications.portfolioUrl,
        createdAt: admissionsApplications.createdAt,
        courseTitle: courses.title,
        courseLevel: courses.level,
      })
      .from(admissionsApplications)
      .leftJoin(courses, eq(admissionsApplications.programId, courses.id))
      .where(filters.length ? and(...filters) : undefined)
      .orderBy(desc(admissionsApplications.createdAt))
      .limit(PAGE_SIZE + 1)
      .offset((page - 1) * PAGE_SIZE),

    db
      .select({ status: admissionsApplications.status, value: count() })
      .from(admissionsApplications)
      .groupBy(admissionsApplications.status),

    // Shown on the Programmes button: zero is worth surfacing, because an
    // empty prospectus means applicants have nothing to apply to.
    db.select({ value: count() }).from(courses),
  ]);

  const courseCount = programmes[0]?.value ?? 0;

  const hasMore = rows.length > PAGE_SIZE;
  const visible = rows.slice(0, PAGE_SIZE);
  const countFor = (value: string) => statusCounts.find((row) => row.status === value)?.value ?? 0;
  const total = statusCounts.reduce((sumSoFar, row) => sumSoFar + row.value, 0);
  const banner = params.notice ? NOTICES[params.notice] : undefined;

  // Preserved across the status change so the operator lands back on the
  // filtered queue they were working through, not at the top of "All".
  const returnQuery = new URLSearchParams({
    ...(status ? { status } : {}),
    ...(search ? { q: search } : {}),
    ...(page > 1 ? { page: String(page) } : {}),
  }).toString();

  return (
    <>
      <PageHeader
        title="Admissions"
        description="Academy applications submitted from the public site."
        actions={
          <>
            <Link
              href="/admissions/courses"
              className="rounded-xl border border-brand/10 bg-white px-3.5 py-2 text-sm font-semibold text-brand transition-all duration-200 hover:bg-cream hover:border-brand/20"
            >
              Programmes{courseCount ? ` (${courseCount})` : ""}
            </Link>
            <Link
              href="/media#academy.hero"
              className="rounded-xl border border-brand/10 bg-white px-3.5 py-2 text-sm font-semibold text-brand transition-all duration-200 hover:bg-cream hover:border-brand/20"
            >
              Academy media
            </Link>
          </>
        }
      />

      {banner ? <Notice tone={banner.tone}>{banner.message}</Notice> : null}

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <FilterTabs
          basePath="/admissions"
          current={status}
          extraParams={{ q: search || undefined }}
          options={[
            { value: "", label: "All", count: total },
            ...ADMISSION_STATUSES.map((value) => ({
              value,
              label: value,
              count: countFor(value),
            })),
          ]}
        />

        <form action="/admissions" className="flex gap-2">
          {status ? <input type="hidden" name="status" value={status} /> : null}
          <input
            type="search"
            name="q"
            defaultValue={search}
            placeholder="Name, email or phone"
            aria-label="Search applications"
            className="w-56 rounded-xl border border-brand/10 bg-white px-3.5 py-2 text-sm outline-none transition-all duration-200 placeholder:text-brand-ink/30 focus:border-gold/40 focus:ring-2 focus:ring-gold/10"
          />
          <button
            type="submit"
            className="rounded-xl border border-brand/10 bg-white px-3.5 py-2 text-sm font-semibold text-brand transition-all duration-200 hover:bg-cream hover:border-brand/20"
          >
            Search
          </button>
        </form>
      </div>

      <Card>
        <Table>
          <thead>
            <tr>
              <Th>Applied</Th>
              <Th>Applicant</Th>
              <Th>Programme</Th>
              <Th>Background</Th>
              <Th>Status</Th>
              <Th>Decision</Th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <EmptyRow colSpan={6}>
                {status || search ? "No applications match this filter." : "No applications yet."}
              </EmptyRow>
            ) : (
              visible.map((row) => (
                <tr key={row.id} className="align-top transition-colors duration-150 hover:bg-cream/60">
                  <Td className="whitespace-nowrap">{formatDateTime(row.createdAt)}</Td>
                  <Td>
                    <span className="block font-medium text-slate-800">
                      {row.firstName} {row.lastName}
                    </span>
                    <a
                      href={`mailto:${row.email}`}
                      className="block text-xs text-brand hover:text-brand-soft hover:underline decoration-gold/30"
                    >
                      {row.email}
                    </a>
                    <a
                      href={`tel:${row.phone.replace(/\s+/g, "")}`}
                      className="block text-xs text-brand hover:text-brand-soft hover:underline decoration-gold/30"
                    >
                      {row.phone}
                    </a>
                  </Td>
                  <Td>
                    <span className="block">{row.courseTitle ?? "—"}</span>
                    {row.courseLevel ? (
                      <span className="block text-xs text-slate-500">{row.courseLevel}</span>
                    ) : null}
                  </Td>
                  <Td className="max-w-xs text-xs text-slate-600">
                    {row.experience ? <span className="block">{row.experience}</span> : "—"}
                    {row.portfolioUrl ? (
                      <a
                        href={row.portfolioUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 block break-all text-brand hover:text-brand-soft hover:underline decoration-gold/30"
                      >
                        portfolio ↗
                      </a>
                    ) : null}
                  </Td>
                  <Td>
                    <StatusBadge status={row.status} />
                  </Td>
                  <Td>
                    <form action={updateAdmissionStatus} className="flex flex-col gap-1.5">
                      <input type="hidden" name="id" value={row.id} />
                      <input type="hidden" name="returnQuery" value={returnQuery} />
                      <select
                        name="status"
                        defaultValue={row.status}
                        aria-label={`Status for ${row.firstName} ${row.lastName}`}
                        className="rounded-xl border border-brand/10 bg-white px-3 py-1.5 text-xs outline-none transition-all duration-200 focus:border-gold/40 focus:ring-2 focus:ring-gold/10"
                      >
                        {[
                          ...ADMISSION_STATUSES,
                          ...((ADMISSION_STATUSES as readonly string[]).includes(row.status)
                            ? []
                            : [row.status]),
                        ].map((value) => (
                          <option key={value} value={value}>
                            {value}
                          </option>
                        ))}
                      </select>
                      <button
                        type="submit"
                        className="self-start rounded-xl bg-brand px-3 py-1.5 text-xs font-semibold text-white transition-all duration-200 hover:bg-brand-soft hover:shadow-sm"
                      >
                        Save
                      </button>
                    </form>
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </Table>

        <Pagination
          basePath="/admissions"
          page={page}
          hasMore={hasMore}
          params={{ status: status || undefined, q: search || undefined }}
        />
      </Card>
    </>
  );
}
