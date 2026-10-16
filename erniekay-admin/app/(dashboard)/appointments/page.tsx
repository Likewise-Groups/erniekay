import Link from "next/link";
import { and, count, desc, eq, gte, or, sql, type SQL } from "drizzle-orm";

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
import { appointments, getDb, payments, services, users } from "@/lib/db";
import { formatDateTime, formatMoney, fullName, parseSelectedServices, truncate } from "@/lib/format";
import { APPOINTMENT_STATUSES } from "@/lib/status";

export const metadata = { title: "Appointments · Erniekay Admin" };
export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;

/**
 * Every booking, newest appointment first.
 *
 * Filters live in the URL so a filtered view can be linked to. Two of them are
 * not statuses:
 *
 *   • `view=unpaid` — confirmed, has an amount due, and no successful payment.
 *     This is the list the overview banner points at.
 *   • `q` — a substring of the client's name, email or phone. Staff take
 *     bookings over the phone and are given a name, never an id.
 */
export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; view?: string; q?: string; page?: string; notice?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const db = getDb();

  const page = Math.max(1, Number(params.page) || 1);
  const search = params.q?.trim() ?? "";
  const status = params.status ?? "";
  const unpaidOnly = params.view === "unpaid";

  const noSuccessfulPayment = sql`NOT EXISTS (
    SELECT 1 FROM ${payments}
    WHERE ${payments.appointmentId} = ${appointments.id}
      AND ${payments.status} = 'SUCCESSFUL'
  )`;

  const filters: SQL[] = [];
  if (status) filters.push(eq(appointments.status, status));
  if (unpaidOnly) {
    filters.push(eq(appointments.status, "CONFIRMED"));
    filters.push(gte(appointments.amountDue, 0.01));
    filters.push(noSuccessfulPayment);
  }
  if (search) {
    // ILIKE over three columns. These tables are small (thousands of rows at
    // most) and the alternative — a trigram index and a tsvector — is more
    // machinery than the query deserves.
    const pattern = `%${search.replace(/[%_]/g, (char) => `\\${char}`)}%`;
    const term = or(
      sql`${users.firstName} ILIKE ${pattern}`,
      sql`${users.lastName} ILIKE ${pattern}`,
      sql`${users.email} ILIKE ${pattern}`,
      sql`${users.phone} ILIKE ${pattern}`,
    );
    if (term) filters.push(term);
  }

  const where = filters.length ? and(...filters) : undefined;

  const [rows, statusCounts] = await Promise.all([
    db
      .select({
        id: appointments.id,
        appointmentDate: appointments.appointmentDate,
        status: appointments.status,
        amountDue: appointments.amountDue,
        currency: appointments.currency,
        selectedServices: appointments.selectedServices,
        createdAt: appointments.createdAt,
        serviceName: services.name,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        phone: users.phone,
        // Whether money actually landed, rather than what the status claims.
        paidAmount: sql<string | null>`(
          SELECT SUM(${payments.amount}) FROM ${payments}
          WHERE ${payments.appointmentId} = ${appointments.id}
            AND ${payments.status} = 'SUCCESSFUL'
        )`,
      })
      .from(appointments)
      .leftJoin(users, eq(appointments.userId, users.id))
      .leftJoin(services, eq(appointments.serviceId, services.id))
      .where(where)
      .orderBy(desc(appointments.appointmentDate))
      // One row beyond the page, to know whether "Next" should be live without
      // a second COUNT over the same predicate.
      .limit(PAGE_SIZE + 1)
      .offset((page - 1) * PAGE_SIZE),

    db
      .select({ status: appointments.status, value: count() })
      .from(appointments)
      .groupBy(appointments.status),
  ]);

  const hasMore = rows.length > PAGE_SIZE;
  const visible = rows.slice(0, PAGE_SIZE);
  const countFor = (value: string) =>
    statusCounts.find((row) => row.status === value)?.value ?? 0;
  const total = statusCounts.reduce((sum, row) => sum + row.value, 0);

  return (
    <>
      <PageHeader
        title="Appointments"
        description="Bookings taken on the site and by hand."
      />

      {params.notice === "updated" ? <Notice tone="success">Appointment updated.</Notice> : null}

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <FilterTabs
          basePath="/appointments"
          current={unpaidOnly ? undefined : status}
          extraParams={{ q: search || undefined }}
          options={[
            { value: "", label: "All", count: total },
            ...APPOINTMENT_STATUSES.map((value) => ({
              value,
              label: value.charAt(0) + value.slice(1).toLowerCase(),
              count: countFor(value),
            })),
          ]}
        />

        {/* GET, so the search lands in the URL and stays shareable. */}
        <form action="/appointments" className="flex gap-2">
          {status ? <input type="hidden" name="status" value={status} /> : null}
          <input
            type="search"
            name="q"
            defaultValue={search}
            placeholder="Name, email or phone"
            aria-label="Search bookings"
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

      {unpaidOnly ? (
        <Notice tone="error">
          Showing confirmed bookings with an amount due and no successful payment.{" "}
          <Link href="/appointments" className="font-semibold underline">
            Clear filter
          </Link>
        </Notice>
      ) : null}

      <Card>
        <Table>
          <thead>
            <tr>
              <Th>Appointment</Th>
              <Th>Client</Th>
              <Th>Service</Th>
              <Th className="text-right">Due</Th>
              <Th className="text-right">Paid</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <EmptyRow colSpan={6}>
                {search || status || unpaidOnly
                  ? "No bookings match this filter."
                  : "No bookings yet."}
              </EmptyRow>
            ) : (
              visible.map((row) => {
                const selection = parseSelectedServices(row.selectedServices);
                const paid = Number(row.paidAmount ?? 0);

                return (
                  <tr key={row.id} className="transition-colors duration-150 hover:bg-cream/60">
                    <Td className="whitespace-nowrap">
                      <Link
                        href={`/appointments/${row.id}`}
                        className="font-medium text-brand hover:text-brand-soft hover:underline decoration-gold/30 underline-offset-2"
                      >
                        {formatDateTime(row.appointmentDate)}
                      </Link>
                      <span className="block text-xs text-brand-ink/35">
                        booked {formatDateTime(row.createdAt)}
                      </span>
                    </Td>
                    <Td>
                      <span className="block font-medium text-brand-ink/80">
                        {fullName(row.firstName, row.lastName, row.email ?? "—")}
                      </span>
                      <span className="block text-xs text-brand-ink/40">
                        {row.phone ?? row.email ?? "—"}
                      </span>
                    </Td>
                    <Td>
                      <span className="block">{row.serviceName ?? "—"}</span>
                      {selection.length ? (
                        <span className="block text-xs text-brand-ink/40">
                          {truncate(selection.join(", "), 48)}
                        </span>
                      ) : null}
                    </Td>
                    <Td className="whitespace-nowrap text-right">
                      {formatMoney(row.amountDue, row.currency)}
                    </Td>
                    <Td
                      className={`whitespace-nowrap text-right ${
                        paid > 0 && paid + 0.005 < row.amountDue ? "text-gold font-semibold" : ""
                      }`}
                    >
                      {paid > 0 ? formatMoney(paid, row.currency) : "—"}
                    </Td>
                    <Td>
                      <StatusBadge status={row.status} />
                    </Td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>

        <Pagination
          basePath="/appointments"
          page={page}
          hasMore={hasMore}
          params={{ status: status || undefined, q: search || undefined, view: params.view }}
        />
      </Card>
    </>
  );
}
