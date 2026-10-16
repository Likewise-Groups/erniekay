import Link from "next/link";
import { and, count, desc, eq, gte, isNull, lt, sql, sum } from "drizzle-orm";

import BookingCalendar, { type DayBookings } from "@/components/BookingCalendar";
import { ArrowRightIcon, CardIcon } from "@/components/icons";
import { Card, PageHeader, Stat, StatusBadge, Table, Td, Th, EmptyRow } from "@/components/ui";
import { requireAdmin } from "@/lib/auth";
import { admissionsApplications, appointments, getDb, payments, users } from "@/lib/db";
import { formatDateTime, formatMoney, formatTime, fullName } from "@/lib/format";

export const metadata = { title: "Overview · Erniekay Admin" };
export const dynamic = "force-dynamic";

/**
 * The morning screen: what needs a person today, and what is stuck.
 *
 * Two things here are not just counts and are the reason this page exists:
 *
 *   • **Unlinked successful payments.** A payment can succeed while the
 *     appointment it belongs to was never linked — the public app writes the
 *     Payment row before the booking is bound to it. Money received against no
 *     booking is the one failure mode nobody notices on their own, so it is
 *     surfaced first and links straight into reconciliation.
 *
 *   • **Confirmed but unpaid.** The mirror image: a booking marked confirmed
 *     with an amount due and no successful payment behind it.
 */
export default async function OverviewPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  await requireAdmin();
  const db = getDb();
  const params = await searchParams;

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);
  const startOfMonth = new Date(startOfToday.getFullYear(), startOfToday.getMonth(), 1);

  /**
   * Which month the calendar shows. `?month=YYYY-MM`, defaulting to this one.
   * Anything unparseable falls back rather than erroring — a mistyped URL
   * should show the current month, not a stack trace.
   */
  const requested = /^(\d{4})-(\d{2})$/.exec(params.month ?? "");
  const calendarYear = requested ? Number(requested[1]) : startOfToday.getFullYear();
  const calendarMonth =
    requested && Number(requested[2]) >= 1 && Number(requested[2]) <= 12
      ? Number(requested[2])
      : startOfToday.getMonth() + 1;

  const calendarStart = new Date(calendarYear, calendarMonth - 1, 1);
  const calendarEnd = new Date(calendarYear, calendarMonth, 1);

  // One round trip for the whole page. These are independent aggregates over
  // small tables; running them in parallel keeps the dashboard at the cost of
  // the slowest rather than the sum.
  const [
    pendingAppointments,
    todaysAppointments,
    unlinkedPaid,
    confirmedUnpaid,
    monthRevenue,
    openAdmissions,
    totalReceived,
    clientsServed,
    calendarDays,
    upcoming,
    recentPayments,
  ] = await Promise.all([
    db
      .select({ value: count() })
      .from(appointments)
      .where(eq(appointments.status, "PENDING")),

    db
      .select({ value: count() })
      .from(appointments)
      .where(
        and(
          gte(appointments.appointmentDate, startOfToday),
          lt(appointments.appointmentDate, startOfTomorrow),
        ),
      ),

    db
      .select({ value: count() })
      .from(payments)
      .where(and(eq(payments.status, "SUCCESSFUL"), isNull(payments.appointmentId))),

    db
      .select({ value: count() })
      .from(appointments)
      .where(
        and(
          eq(appointments.status, "CONFIRMED"),
          gte(appointments.amountDue, 0.01),
          // No successful payment points at this booking.
          sql`NOT EXISTS (
            SELECT 1 FROM ${payments}
            WHERE ${payments.appointmentId} = ${appointments.id}
              AND ${payments.status} = 'SUCCESSFUL'
          )`,
        ),
      ),

    db
      .select({ total: sum(payments.amount) })
      .from(payments)
      .where(
        and(
          eq(payments.status, "SUCCESSFUL"),
          // Sandbox transactions are not income.
          eq(payments.mode, "live"),
          gte(payments.createdAt, startOfMonth),
        ),
      ),

    db
      .select({ value: count() })
      .from(admissionsApplications)
      .where(sql`${admissionsApplications.status} IN ('Submitted', 'Reviewing')`),

    // All-time takings, as distinct from this month's. Live only: a sandbox
    // transaction is not money, and this figure is the one someone would quote.
    db
      .select({ total: sum(payments.amount) })
      .from(payments)
      .where(and(eq(payments.status, "SUCCESSFUL"), eq(payments.mode, "live"))),

    // Distinct clients who have actually booked, not every User row — the
    // public app creates a User for anyone who submits a booking, so counting
    // the table would count nobody the salon has served.
    db
      .select({ value: sql<number>`COUNT(DISTINCT ${appointments.userId})::int` })
      .from(appointments),

    // Per-day counts for the calendar month, grouped in Postgres.
    db
      .select({
        date: sql<string>`to_char(${appointments.appointmentDate}, 'YYYY-MM-DD')`,
        count: count(),
        pending: sql<number>`COUNT(*) FILTER (WHERE ${appointments.status} = 'PENDING')::int`,
      })
      .from(appointments)
      .where(
        and(
          gte(appointments.appointmentDate, calendarStart),
          lt(appointments.appointmentDate, calendarEnd),
        ),
      )
      .groupBy(sql`to_char(${appointments.appointmentDate}, 'YYYY-MM-DD')`),

    db
      .select({
        id: appointments.id,
        appointmentDate: appointments.appointmentDate,
        status: appointments.status,
        amountDue: appointments.amountDue,
        currency: appointments.currency,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        phone: users.phone,
      })
      .from(appointments)
      .leftJoin(users, eq(appointments.userId, users.id))
      .where(gte(appointments.appointmentDate, startOfToday))
      .orderBy(appointments.appointmentDate)
      .limit(8),

    db
      .select({
        id: payments.id,
        referenceId: payments.referenceId,
        amount: payments.amount,
        currency: payments.currency,
        status: payments.status,
        customerName: payments.customerName,
        appointmentId: payments.appointmentId,
        createdAt: payments.createdAt,
      })
      .from(payments)
      .orderBy(desc(payments.createdAt))
      .limit(6),
  ]);

  // sum() returns a numeric as a string (or null when nothing matched).
  const revenue = Number(monthRevenue[0]?.total ?? 0);
  const received = Number(totalReceived[0]?.total ?? 0);
  const needsAttention = (unlinkedPaid[0]?.value ?? 0) + (confirmedUnpaid[0]?.value ?? 0);

  const days: DayBookings[] = calendarDays.map((row) => ({
    date: row.date,
    count: Number(row.count),
    pending: Number(row.pending),
  }));

  // The salon's today, formatted the same way the grouped dates are, so the
  // calendar highlights the right cell regardless of the server's timezone.
  const todayKey = new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Accra" });

  return (
    <>
      <PageHeader
        title="Overview"
        description={
          needsAttention
            ? `${needsAttention} item${needsAttention === 1 ? "" : "s"} need reconciling.`
            : "Bookings, payments and enquiries at a glance."
        }
      />

      <div className="stagger-fade mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Stat
          label="Pending bookings"
          value={pendingAppointments[0]?.value ?? 0}
          hint="Awaiting payment or confirmation"
          href="/appointments?status=PENDING"
          accent
        />
        <Stat
          label="Today"
          value={todaysAppointments[0]?.value ?? 0}
          hint="Appointments scheduled today"
          href="/appointments"
        />
        <Stat
          label="Paid, unlinked"
          value={unlinkedPaid[0]?.value ?? 0}
          hint="Successful payments with no booking"
          href="/payments?view=unlinked"
        />
        <Stat
          label="Revenue this month"
          value={formatMoney(revenue, "GHS")}
          hint="Successful live payments"
          href="/payments?status=SUCCESSFUL"
        />
        <Stat
          label="Payment received"
          value={formatMoney(received, "GHS")}
          hint="Total confirmed revenue, all time"
          href="/payments?status=SUCCESSFUL"
        />
        <Stat
          label="Clients served"
          value={clientsServed[0]?.value ?? 0}
          hint="Unique clients with a booking"
          href="/appointments"
        />
      </div>

      {confirmedUnpaid[0]?.value ? (
        <div className="mb-8 flex items-center gap-3 rounded-2xl border-l-4 border-l-gold bg-gold/[0.06] px-5 py-4 text-sm text-brand-ink/80 ring-1 ring-gold/10">
          <span className="text-lg">⚠️</span>
          <p>
            <strong className="font-semibold">{confirmedUnpaid[0].value}</strong> confirmed booking
            {confirmedUnpaid[0].value === 1 ? " has" : "s have"} an amount due but no successful
            payment attached.{" "}
            <Link href="/appointments?view=unpaid" className="font-semibold text-brand underline decoration-gold/30 underline-offset-2 hover:decoration-gold">
              Review them
            </Link>
            .
          </p>
        </div>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-3">
        <Card title="Next appointments" className="lg:col-span-2">
          <Table>
            <thead>
              <tr>
                <Th>When</Th>
                <Th>Client</Th>
                <Th>Amount</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {upcoming.length === 0 ? (
                <EmptyRow colSpan={4}>Nothing scheduled from today onwards.</EmptyRow>
              ) : (
                upcoming.map((row) => (
                  <tr key={row.id} className="transition-colors duration-150 hover:bg-cream/60">
                    <Td className="whitespace-nowrap">
                      <Link
                        href={`/appointments/${row.id}`}
                        className="font-medium text-brand hover:text-brand-soft hover:underline decoration-gold/30 underline-offset-2"
                      >
                        {formatDateTime(row.appointmentDate)}
                      </Link>
                    </Td>
                    <Td>
                      <span className="block font-medium text-brand-ink/80">
                        {fullName(row.firstName, row.lastName, row.email ?? "—")}
                      </span>
                      <span className="block text-xs text-brand-ink/40">{row.phone ?? row.email}</span>
                    </Td>
                    <Td className="whitespace-nowrap">
                      {formatMoney(row.amountDue, row.currency)}
                    </Td>
                    <Td>
                      <StatusBadge status={row.status} />
                    </Td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card>

        <Card title="Latest payments">
          <ul className="divide-y divide-cream-dark/50">
            {recentPayments.length === 0 ? (
              <li className="flex flex-col items-center justify-center px-5 py-14 text-center text-sm text-brand-ink/40">
                <span className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-brand/5">
                  <CardIcon className="h-8 w-8 text-brand/20" />
                </span>
                No payments yet.
              </li>
            ) : (
              recentPayments.map((payment) => (
                <li key={payment.id} className="px-5 py-3.5 transition-colors duration-150 hover:bg-cream/40">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-sm font-semibold text-brand-ink/80">
                      {formatMoney(payment.amount, payment.currency)}
                    </span>
                    <StatusBadge status={payment.status} />
                  </div>
                  <p className="mt-1 truncate text-xs text-brand-ink/40">
                    {payment.customerName || payment.referenceId}
                  </p>
                  <p className="mt-0.5 text-xs text-brand-ink/30">
                    {formatTime(payment.createdAt)}
                    {payment.appointmentId ? null : (
                      <span className="ml-2 font-semibold text-gold">· unlinked</span>
                    )}
                  </p>
                </li>
              ))
            )}
          </ul>
          <div className="border-t border-cream-dark/50">
            <Link
              href="/payments"
              className="flex items-center justify-between px-5 py-3.5 text-xs font-semibold text-brand transition-colors hover:bg-cream/60"
            >
              All payments
              <ArrowRightIcon className="h-4 w-4 text-brand-ink/30" />
            </Link>
          </div>
        </Card>
      </div>

      <BookingCalendar
        year={calendarYear}
        month={calendarMonth}
        days={days}
        today={todayKey}
      />

      {openAdmissions[0]?.value ? (
        <p className="mt-8 text-sm text-brand-ink/50">
          <Link href="/admissions?status=Submitted" className="font-semibold text-brand hover:underline decoration-gold/30 underline-offset-2">
            {openAdmissions[0].value} academy application
            {openAdmissions[0].value === 1 ? "" : "s"}
          </Link>{" "}
          awaiting review.
        </p>
      ) : null}
    </>
  );
}
