import Link from "next/link";
import { and, count, desc, eq, isNull, or, sql, sum, type SQL } from "drizzle-orm";

import {
  Card,
  EmptyRow,
  FilterTabs,
  Notice,
  PageHeader,
  Pagination,
  Stat,
  StatusBadge,
  Table,
  Td,
  Th,
} from "@/components/ui";
import { requireAdmin } from "@/lib/auth";
import { appointments, getDb, payments, users } from "@/lib/db";
import { formatDateTime, formatMoney, fullName } from "@/lib/format";
import { PAYMENT_STATUSES } from "@/lib/status";

import ReconcileForm from "./ReconcileForm";

export const metadata = { title: "Payments · Erniekay Admin" };
export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;

const NOTICES: Record<string, { tone: "success" | "error"; message: string }> = {
  linked: { tone: "success", message: "Payment linked." },
  unchanged: { tone: "success", message: "That payment was already on this booking." },
  invalid: { tone: "error", message: "Choose a payment and a booking." },
  missing: { tone: "error", message: "That booking no longer exists." },
  "no-payment": { tone: "error", message: "No payment found with that reference." },
  "already-linked": { tone: "error", message: "That payment is attached to another booking." },
};

/**
 * Every MoMo collection attempt.
 *
 * Read-only with one exception: `view=unlinked` lists successful payments that
 * belong to no booking, each with an inline control to attach it to one. That
 * is the reconciliation path, and it is the reason this page is not just a log.
 *
 * Nothing here can change a payment's *status*. What MTN reported is a matter
 * of record — the public app's applyPaymentStatus() is the only writer — and a
 * staff member who could edit it would be editing the evidence.
 */
export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; view?: string; q?: string; page?: string; notice?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const db = getDb();

  const page = Math.max(1, Number(params.page) || 1);
  const status = params.status ?? "";
  const unlinkedOnly = params.view === "unlinked";
  const search = params.q?.trim() ?? "";

  const filters: SQL[] = [];
  if (status) filters.push(eq(payments.status, status));
  if (unlinkedOnly) {
    filters.push(isNull(payments.appointmentId));
    filters.push(eq(payments.status, "SUCCESSFUL"));
  }
  if (search) {
    const pattern = `%${search.replace(/[%_]/g, (char) => `\\${char}`)}%`;
    const term = or(
      sql`${payments.referenceId} ILIKE ${pattern}`,
      sql`${payments.customerName} ILIKE ${pattern}`,
      sql`${payments.payerPhone} ILIKE ${pattern}`,
    );
    if (term) filters.push(term);
  }

  const where = filters.length ? and(...filters) : undefined;

  const [rows, statusCounts, unlinkedTotal, openBookings] = await Promise.all([
    db
      .select({
        id: payments.id,
        referenceId: payments.referenceId,
        amount: payments.amount,
        currency: payments.currency,
        status: payments.status,
        mode: payments.mode,
        provider: payments.provider,
        customerName: payments.customerName,
        serviceName: payments.serviceName,
        payerPhone: payments.payerPhone,
        createdAt: payments.createdAt,
        appointmentId: payments.appointmentId,
        appointmentDate: appointments.appointmentDate,
        clientFirst: users.firstName,
        clientLast: users.lastName,
      })
      .from(payments)
      .leftJoin(appointments, eq(payments.appointmentId, appointments.id))
      .leftJoin(users, eq(appointments.userId, users.id))
      .where(where)
      .orderBy(desc(payments.createdAt))
      .limit(PAGE_SIZE + 1)
      .offset((page - 1) * PAGE_SIZE),

    db.select({ status: payments.status, value: count() }).from(payments).groupBy(payments.status),

    db
      .select({ value: count(), total: sum(payments.amount) })
      .from(payments)
      .where(and(isNull(payments.appointmentId), eq(payments.status, "SUCCESSFUL"))),

    // Offered as link targets. Pending bookings with something owed are what an
    // orphaned payment almost always belongs to.
    unlinkedOnly
      ? db
          .select({
            id: appointments.id,
            appointmentDate: appointments.appointmentDate,
            amountDue: appointments.amountDue,
            currency: appointments.currency,
            status: appointments.status,
            firstName: users.firstName,
            lastName: users.lastName,
            phone: users.phone,
          })
          .from(appointments)
          .leftJoin(users, eq(appointments.userId, users.id))
          .where(sql`${appointments.status} IN ('PENDING', 'CONFIRMED')`)
          .orderBy(desc(appointments.appointmentDate))
          .limit(100)
      : Promise.resolve([]),
  ]);

  const hasMore = rows.length > PAGE_SIZE;
  const visible = rows.slice(0, PAGE_SIZE);
  const countFor = (value: string) => statusCounts.find((row) => row.status === value)?.value ?? 0;
  const total = statusCounts.reduce((sumSoFar, row) => sumSoFar + row.value, 0);
  const banner = params.notice ? NOTICES[params.notice] : undefined;
  const orphanCount = unlinkedTotal[0]?.value ?? 0;

  return (
    <>
      <PageHeader
        title="Payments"
        description="MTN MoMo collection attempts, as recorded by the public site."
      />

      {banner ? <Notice tone={banner.tone}>{banner.message}</Notice> : null}

      {orphanCount > 0 && !unlinkedOnly ? (
        <div className="mb-5 flex items-center gap-3 rounded-2xl border-l-4 border-l-gold bg-gold/[0.06] px-5 py-4 text-sm text-brand-ink/80 ring-1 ring-gold/10">
          <span className="text-lg">⚠️</span>
          <p>
            <strong className="font-semibold">{orphanCount}</strong> successful payment
            {orphanCount === 1 ? "" : "s"} totalling{" "}
            {formatMoney(Number(unlinkedTotal[0]?.total ?? 0), "GHS")} belong to no booking.{" "}
            <Link href="/payments?view=unlinked" className="font-semibold text-brand underline decoration-gold/30 underline-offset-2 hover:decoration-gold">
              Reconcile them
            </Link>
            .
          </p>
        </div>
      ) : null}

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <FilterTabs
          basePath="/payments"
          current={unlinkedOnly ? undefined : status}
          extraParams={{ q: search || undefined }}
          options={[
            { value: "", label: "All", count: total },
            ...PAYMENT_STATUSES.map((value) => ({
              value,
              label: value.charAt(0) + value.slice(1).toLowerCase(),
              count: countFor(value),
            })),
          ]}
        />

        <div className="flex items-center gap-2">
          <Link
            href={unlinkedOnly ? "/payments" : "/payments?view=unlinked"}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold ring-1 transition-all duration-200 ${
              unlinkedOnly
                ? "bg-gold text-brand ring-gold shadow-sm shadow-gold/20"
                : "bg-white text-brand-ink/60 ring-brand/10 hover:bg-cream hover:text-brand"
            }`}
          >
            Unlinked {orphanCount ? orphanCount : ""}
          </Link>

            <form action="/payments" className="flex gap-2">
              <input
                type="search"
                name="q"
                defaultValue={search}
                placeholder="Reference, name or phone"
                aria-label="Search payments"
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
      </div>

      {unlinkedOnly ? (
        <div className="mb-4 grid gap-3 sm:grid-cols-3">
          <Stat label="Unattached payments" value={orphanCount} />
          <Stat
            label="Value"
            value={formatMoney(Number(unlinkedTotal[0]?.total ?? 0), "GHS")}
            hint="Received against no booking"
          />
          <Stat label="Open bookings" value={openBookings.length} hint="Available to link to" />
        </div>
      ) : null}

      <Card>
        <Table>
          <thead>
            <tr>
              <Th>Received</Th>
              <Th>Reference</Th>
              <Th>Payer</Th>
              <Th className="text-right">Amount</Th>
              <Th>Status</Th>
              <Th>{unlinkedOnly ? "Attach to booking" : "Booking"}</Th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <EmptyRow colSpan={6}>
                {unlinkedOnly
                  ? "Every successful payment is attached to a booking."
                  : "No payments match this filter."}
              </EmptyRow>
            ) : (
              visible.map((row) => (
                <tr key={row.id} className="transition-colors duration-150 hover:bg-cream/60">
                  <Td className="whitespace-nowrap">{formatDateTime(row.createdAt)}</Td>
                  <Td>
                    <span className="font-mono text-xs">{row.referenceId}</span>
                    <span className="block text-xs text-brand-ink/35">
                      {row.provider}
                      {row.mode === "live" ? "" : ` · ${row.mode}`}
                    </span>
                  </Td>
                  <Td>
                    <span className="block">{row.customerName || "—"}</span>
                    <span className="block text-xs text-brand-ink/40">{row.payerPhone || "—"}</span>
                  </Td>
                  <Td className="whitespace-nowrap text-right">
                    {formatMoney(row.amount, row.currency)}
                  </Td>
                  <Td>
                    <StatusBadge status={row.status} />
                  </Td>
                  <Td>
                    {row.appointmentId ? (
                      <Link
                        href={`/appointments/${row.appointmentId}`}
                        className="text-brand hover:text-brand-soft hover:underline decoration-gold/30 underline-offset-2"
                      >
                        {fullName(row.clientFirst, row.clientLast, "View booking")}
                        <span className="block text-xs text-brand-ink/40">
                          {formatDateTime(row.appointmentDate)}
                        </span>
                      </Link>
                    ) : unlinkedOnly ? (
                      <ReconcileForm
                        referenceId={row.referenceId}
                        bookings={openBookings.map((booking) => ({
                          id: booking.id,
                          label: `${fullName(booking.firstName, booking.lastName, booking.phone ?? "Unnamed")} · ${formatDateTime(
                            booking.appointmentDate,
                          )} · ${formatMoney(booking.amountDue, booking.currency)} · ${booking.status}`,
                        }))}
                      />
                    ) : (
                      <span className="text-xs font-semibold text-gold">unlinked</span>
                    )}
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </Table>

        <Pagination
          basePath="/payments"
          page={page}
          hasMore={hasMore}
          params={{ status: status || undefined, q: search || undefined, view: params.view }}
        />
      </Card>
    </>
  );
}
