import { desc, or, sql, type SQL, and } from "drizzle-orm";

import { Card, EmptyRow, PageHeader, Pagination, Table, Td, Th } from "@/components/ui";
import { requireAdmin } from "@/lib/auth";
import { bridalInquiries, getDb } from "@/lib/db";
import { formatDateTime, parseSelectedServices, truncate } from "@/lib/format";

export const metadata = { title: "Bridal enquiries · Erniekay Admin" };
export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;

/**
 * Bridal enquiries, newest first.
 *
 * Read-only, and deliberately so: BridalInquiry has no status column and no
 * assignee, because the follow-up genuinely happens over WhatsApp and on the
 * phone. Adding a workflow here would create a second place to record something
 * that is actually tracked elsewhere, and it would be wrong within a week.
 * What this page owes staff is the enquiry in full, quickly, with the contact
 * details one tap away.
 *
 * Note the public site does not yet submit this form — the server action
 * exists but the form is not wired to it — so this list can legitimately be
 * empty on a live deployment.
 */
export default async function BridalPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const db = getDb();

  const page = Math.max(1, Number(params.page) || 1);
  const search = params.q?.trim() ?? "";

  const filters: SQL[] = [];
  if (search) {
    const pattern = `%${search.replace(/[%_]/g, (char) => `\\${char}`)}%`;
    const term = or(
      sql`${bridalInquiries.fullName} ILIKE ${pattern}`,
      sql`${bridalInquiries.email} ILIKE ${pattern}`,
      sql`${bridalInquiries.phone} ILIKE ${pattern}`,
      sql`${bridalInquiries.venue} ILIKE ${pattern}`,
    );
    if (term) filters.push(term);
  }

  const rows = await db
    .select()
    .from(bridalInquiries)
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(desc(bridalInquiries.createdAt))
    .limit(PAGE_SIZE + 1)
    .offset((page - 1) * PAGE_SIZE);

  const hasMore = rows.length > PAGE_SIZE;
  const visible = rows.slice(0, PAGE_SIZE);

  return (
    <>
      <PageHeader
        title="Bridal enquiries"
        description="Submissions from the bridal page. Follow-up happens off-system."
        actions={
          <form action="/bridal" className="flex gap-2">
            <input
              type="search"
              name="q"
              defaultValue={search}
              placeholder="Name, email, venue"
              aria-label="Search enquiries"
              className="w-56 rounded-xl border border-brand/10 bg-white px-3.5 py-2 text-sm outline-none transition-all duration-200 placeholder:text-brand-ink/30 focus:border-gold/40 focus:ring-2 focus:ring-gold/10"
            />
            <button
              type="submit"
              className="rounded-xl border border-brand/10 bg-white px-3.5 py-2 text-sm font-semibold text-brand transition-all duration-200 hover:bg-cream hover:border-brand/20"
            >
              Search
            </button>
          </form>
        }
      />

      <Card>
        <Table>
          <thead>
            <tr>
              <Th>Received</Th>
              <Th>Bride</Th>
              <Th>Wedding</Th>
              <Th>Package</Th>
              <Th>Details</Th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <EmptyRow colSpan={5}>
                {search ? "No enquiries match that search." : "No bridal enquiries yet."}
              </EmptyRow>
            ) : (
              visible.map((row) => {
                const selection = parseSelectedServices(row.selectedServices);

                return (
                  <tr key={row.id} className="align-top transition-colors duration-150 hover:bg-cream/60">
                    <Td className="whitespace-nowrap">{formatDateTime(row.createdAt)}</Td>
                    <Td>
                      <span className="block font-medium text-slate-800">{row.fullName}</span>
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
                      {row.socialHandle ? (
                        <span className="block text-xs text-slate-500">{row.socialHandle}</span>
                      ) : null}
                    </Td>
                    <Td>
                      {/* weddingDate is free text on the public form — whatever
                          the bride typed is shown verbatim rather than guessed at. */}
                      <span className="block">{row.weddingDate}</span>
                      <span className="block text-xs text-slate-500">{row.venue}</span>
                      {row.prepLocation ? (
                        <span className="block text-xs text-slate-500">
                          prep: {row.prepLocation}
                        </span>
                      ) : null}
                    </Td>
                    <Td>
                      <span className="block">{row.package ?? "—"}</span>
                      {selection.length ? (
                        <span className="block text-xs text-slate-500">
                          {truncate(selection.join(", "), 60)}
                        </span>
                      ) : null}
                      {row.groomService ? (
                        <span className="mt-1 inline-block rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600">
                          groom included
                        </span>
                      ) : null}
                    </Td>
                    <Td className="text-xs text-slate-600">
                      {row.bridalPartySize ? <span className="block">party: {row.bridalPartySize}</span> : null}
                      {row.totalGuests ? <span className="block">guests: {row.totalGuests}</span> : null}
                      {row.extraMakeupCount ? (
                        <span className="block">extra makeup: {row.extraMakeupCount}</span>
                      ) : null}
                      {row.aesthetic ? (
                        <span className="block text-slate-500">{truncate(row.aesthetic, 80)}</span>
                      ) : null}
                    </Td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>

        <Pagination
          basePath="/bridal"
          page={page}
          hasMore={hasMore}
          params={{ q: search || undefined }}
        />
      </Card>
    </>
  );
}
