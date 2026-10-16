import Link from "next/link";
import { and, desc, eq, sql, type SQL } from "drizzle-orm";

import {
  Card,
  EmptyRow,
  FilterTabs,
  PageHeader,
  Pagination,
  Table,
  Td,
  Th,
} from "@/components/ui";
import { requireAdmin } from "@/lib/auth";
import { adminAudit, getDb } from "@/lib/db";
import { formatDateTime, formatRelative } from "@/lib/format";

export const metadata = { title: "Activity log · Erniekay Admin" };
export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

const ENTITIES = [
  { value: "appointment", label: "Appointments" },
  { value: "payment", label: "Payments" },
  { value: "media", label: "Media" },
  { value: "admission", label: "Admissions" },
  { value: "auth", label: "Sign-ins" },
] as const;

/**
 * Who did what, newest first.
 *
 * Append-only by construction — nothing in this application updates or deletes
 * an AdminAudit row, and `actorId` is not a foreign key, so removing a staff
 * account leaves the record of their actions intact.
 *
 * Failed sign-ins are in here too. A run of them against one address is the
 * only signal this application gives that someone is trying to get in.
 */
export default async function AuditPage({
  searchParams,
}: {
  searchParams: Promise<{ entity?: string; actor?: string; page?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const db = getDb();

  const page = Math.max(1, Number(params.page) || 1);
  const entity = params.entity ?? "";
  const actor = params.actor?.trim() ?? "";

  const filters: SQL[] = [];
  if (entity) filters.push(eq(adminAudit.entity, entity));
  if (actor) filters.push(sql`${adminAudit.actorEmail} ILIKE ${`%${actor.replace(/[%_]/g, (c) => `\\${c}`)}%`}`);

  const rows = await db
    .select()
    .from(adminAudit)
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(desc(adminAudit.createdAt))
    .limit(PAGE_SIZE + 1)
    .offset((page - 1) * PAGE_SIZE);

  const hasMore = rows.length > PAGE_SIZE;
  const visible = rows.slice(0, PAGE_SIZE);

  /** Only the entities that have their own page are worth linking to. */
  const entityHref = (row: (typeof visible)[number]) => {
    if (!row.entityId) return null;
    if (row.entity === "appointment") return `/appointments/${row.entityId}`;
    // Slot ids are the anchors MediaSlotCard renders, so this scrolls to the
    // exact picture that changed rather than the top of a very long page.
    if (row.entity === "media") return `/media#${row.entityId}`;
    return null;
  };

  return (
    <>
      <PageHeader
        title="Activity log"
        description="Every change staff have made, and every sign-in attempt."
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <FilterTabs
          basePath="/audit"
          param="entity"
          current={entity}
          extraParams={{ actor: actor || undefined }}
          options={[{ value: "", label: "Everything" }, ...ENTITIES.map((item) => ({ ...item }))]}
        />

        <form action="/audit" className="flex gap-2">
          {entity ? <input type="hidden" name="entity" value={entity} /> : null}
          <input
            type="search"
            name="actor"
            defaultValue={actor}
            placeholder="Filter by staff email"
            aria-label="Filter by staff email"
            className="w-56 rounded-xl border border-brand/10 bg-white px-3.5 py-2 text-sm outline-none transition-all duration-200 placeholder:text-brand-ink/30 focus:border-gold/40 focus:ring-2 focus:ring-gold/10"
          />
          <button
            type="submit"
            className="rounded-xl border border-brand/10 bg-white px-3.5 py-2 text-sm font-semibold text-brand transition-all duration-200 hover:bg-cream hover:border-brand/20"
          >
            Filter
          </button>
        </form>
      </div>

      <Card>
        <Table>
          <thead>
            <tr>
              <Th>When</Th>
              <Th>Who</Th>
              <Th>What</Th>
              <Th>Detail</Th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <EmptyRow colSpan={4}>Nothing recorded for this filter.</EmptyRow>
            ) : (
              visible.map((row) => {
                const href = entityHref(row);

                return (
                  <tr
                    key={row.id}
                    className={`transition-colors duration-150 ${
                      row.action.startsWith("sign-in failed") ? "bg-rose-500/5 hover:bg-rose-500/10" : "hover:bg-cream/60"
                    }`}
                  >
                    <Td className="whitespace-nowrap">
                      <span className="block">{formatDateTime(row.createdAt)}</span>
                      <span className="block text-xs text-brand-ink/35">
                        {formatRelative(row.createdAt)}
                      </span>
                    </Td>
                    <Td className="whitespace-nowrap">{row.actorEmail}</Td>
                    <Td>
                      <span className="block text-brand-ink/80 font-medium">{row.action}</span>
                      <span className="block text-xs text-brand-ink/40 mt-0.5">
                        {href ? (
                          <Link href={href} className="text-brand hover:text-brand-soft hover:underline decoration-gold/30 underline-offset-2">
                            {row.entity} ↗
                          </Link>
                        ) : (
                          row.entity
                        )}
                      </span>
                    </Td>
                    <Td className="text-brand-ink/60">{row.detail ?? "—"}</Td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>

        <Pagination
          basePath="/audit"
          page={page}
          hasMore={hasMore}
          params={{ entity: entity || undefined, actor: actor || undefined }}
        />
      </Card>
    </>
  );
}
