import Link from "next/link";
import { notFound } from "next/navigation";
import { desc, eq, isNull, and } from "drizzle-orm";

import { Card, Field, Notice, PageHeader, StatusBadge, Table, Td, Th } from "@/components/ui";
import { requireAdmin } from "@/lib/auth";
import { adminAudit, appointments, getDb, payments, services, users } from "@/lib/db";
import {
  formatDateTime,
  formatMoney,
  formatRelative,
  fullName,
  parseSelectedServices,
} from "@/lib/format";
import { APPOINTMENT_STATUSES } from "@/lib/status";

import { attachPayment, updateAppointmentNotes, updateAppointmentStatus } from "../actions";

export const dynamic = "force-dynamic";

const NOTICES: Record<string, { tone: "success" | "error"; message: string }> = {
  updated: { tone: "success", message: "Saved." },
  unchanged: { tone: "success", message: "Nothing to change." },
  linked: { tone: "success", message: "Payment linked to this booking." },
  invalid: { tone: "error", message: "That change was not understood." },
  "no-payment": { tone: "error", message: "No payment found with that reference." },
  "already-linked": {
    tone: "error",
    message: "That payment is already attached to another booking.",
  },
  missing: { tone: "error", message: "That booking no longer exists." },
};

/**
 * One booking, everything known about it, and the three things staff can do:
 * move its status, leave a note, and attach a payment that arrived without one.
 */
export default async function AppointmentDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ notice?: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const { notice } = await searchParams;
  const db = getDb();

  const [booking] = await db
    .select({
      id: appointments.id,
      appointmentDate: appointments.appointmentDate,
      status: appointments.status,
      notes: appointments.notes,
      selectedServices: appointments.selectedServices,
      amountDue: appointments.amountDue,
      currency: appointments.currency,
      createdAt: appointments.createdAt,
      updatedAt: appointments.updatedAt,
      serviceName: services.name,
      serviceCategory: services.category,
      clientId: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
      phone: users.phone,
    })
    .from(appointments)
    .leftJoin(users, eq(appointments.userId, users.id))
    .leftJoin(services, eq(appointments.serviceId, services.id))
    .where(eq(appointments.id, id))
    .limit(1);

  if (!booking) notFound();

  const [linkedPayments, unlinkedPayments, history] = await Promise.all([
    db
      .select({
        id: payments.id,
        referenceId: payments.referenceId,
        amount: payments.amount,
        currency: payments.currency,
        status: payments.status,
        mode: payments.mode,
        payerPhone: payments.payerPhone,
        createdAt: payments.createdAt,
      })
      .from(payments)
      .where(eq(payments.appointmentId, id))
      .orderBy(desc(payments.createdAt)),

    // Candidates for reconciliation. Only successful, only unattached — a
    // pending prompt is not evidence of anything and should not be offered.
    db
      .select({
        id: payments.id,
        referenceId: payments.referenceId,
        amount: payments.amount,
        currency: payments.currency,
        customerName: payments.customerName,
        payerPhone: payments.payerPhone,
        createdAt: payments.createdAt,
      })
      .from(payments)
      .where(and(isNull(payments.appointmentId), eq(payments.status, "SUCCESSFUL")))
      .orderBy(desc(payments.createdAt))
      .limit(25),

    db
      .select({
        id: adminAudit.id,
        actorEmail: adminAudit.actorEmail,
        action: adminAudit.action,
        detail: adminAudit.detail,
        createdAt: adminAudit.createdAt,
      })
      .from(adminAudit)
      .where(and(eq(adminAudit.entity, "appointment"), eq(adminAudit.entityId, id)))
      .orderBy(desc(adminAudit.createdAt))
      .limit(10),
  ]);

  const paid = linkedPayments
    .filter((payment) => payment.status === "SUCCESSFUL")
    .reduce((total, payment) => total + payment.amount, 0);
  const outstanding = Math.max(0, booking.amountDue - paid);
  const selection = parseSelectedServices(booking.selectedServices);
  const banner = notice ? NOTICES[notice] : undefined;

  return (
    <>
      <PageHeader
        title={fullName(booking.firstName, booking.lastName, booking.email ?? "Booking")}
        description={`${formatDateTime(booking.appointmentDate)} · booked ${formatDateTime(booking.createdAt)}`}
        actions={
          <Link
            href="/appointments"
            className="rounded-xl border border-brand/10 bg-white px-4 py-2 text-sm font-semibold text-brand transition-all duration-200 hover:bg-cream hover:border-brand/20 hover:shadow-sm"
          >
            ← All appointments
          </Link>
        }
      />

      {banner ? <Notice tone={banner.tone}>{banner.message}</Notice> : null}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card title="Booking">
            <dl className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-2 sm:divide-y-0">
              <Field label="Status">
                <StatusBadge status={booking.status} />
              </Field>
              <Field label="Appointment">{formatDateTime(booking.appointmentDate)}</Field>
              <Field label="Service">
                {booking.serviceName ?? "—"}
                {booking.serviceCategory ? (
                  <span className="text-slate-500"> · {booking.serviceCategory}</span>
                ) : null}
              </Field>
              <Field label="Selected">
                {selection.length ? (
                  <ul className="list-inside list-disc space-y-0.5">
                    {selection.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  "—"
                )}
              </Field>
              <Field label="Amount due">{formatMoney(booking.amountDue, booking.currency)}</Field>
              <Field label="Paid">
                <span className={outstanding > 0.005 ? "text-gold font-semibold" : "text-emerald-600 font-semibold"}>
                  {formatMoney(paid, booking.currency)}
                </span>
                {outstanding > 0.005 ? (
                  <span className="text-brand-ink/40">
                    {" "}
                    · {formatMoney(outstanding, booking.currency)} outstanding
                  </span>
                ) : null}
              </Field>
              <Field label="Client">
                {fullName(booking.firstName, booking.lastName, "—")}
                <span className="mt-1 block text-xs text-brand-ink/40">
                  {booking.email ?? "—"}
                  {booking.phone ? ` · ${booking.phone}` : ""}
                </span>
              </Field>
              <Field label="Last updated">{formatDateTime(booking.updatedAt)}</Field>
            </dl>
          </Card>

          <Card title="Payments against this booking">
            <Table>
              <thead>
                <tr>
                  <Th>Reference</Th>
                  <Th className="text-right">Amount</Th>
                  <Th>Status</Th>
                  <Th>Received</Th>
                </tr>
              </thead>
              <tbody>
                {linkedPayments.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center text-sm text-brand-ink/40">
                      No payment has been attached to this booking.
                    </td>
                  </tr>
                ) : (
                  linkedPayments.map((payment) => (
                    <tr key={payment.id}>
                      <Td>
                        <span className="font-mono text-xs">{payment.referenceId}</span>
                        {payment.mode === "live" ? null : (
                          <span className="ml-1.5 rounded bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-600">
                            {payment.mode}
                          </span>
                        )}
                        {payment.payerPhone ? (
                          <span className="block text-xs text-brand-ink/40">{payment.payerPhone}</span>
                        ) : null}
                      </Td>
                      <Td className="whitespace-nowrap text-right">
                        {formatMoney(payment.amount, payment.currency)}
                      </Td>
                      <Td>
                        <StatusBadge status={payment.status} />
                      </Td>
                      <Td className="whitespace-nowrap">{formatDateTime(payment.createdAt)}</Td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Card>

          <Card title="Notes">
            <form action={updateAppointmentNotes} className="space-y-4 p-5">
              <input type="hidden" name="id" value={booking.id} />
              <textarea
                name="notes"
                rows={4}
                defaultValue={booking.notes ?? ""}
                placeholder="Anything the stylist should know, or what was agreed on the phone."
                className="w-full rounded-xl border border-brand/10 bg-white px-3.5 py-3 text-sm outline-none transition-all duration-200 placeholder:text-brand-ink/30 focus:border-gold/40 focus:ring-2 focus:ring-gold/10"
              />
              <button
                type="submit"
                className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-brand-soft hover:shadow-md"
              >
                Save notes
              </button>
            </form>
          </Card>
        </div>

        <div className="space-y-4">
          <Card title="Change status">
            <form action={updateAppointmentStatus} className="space-y-4 p-5">
              <input type="hidden" name="id" value={booking.id} />
              <select
                name="status"
                defaultValue={booking.status}
                aria-label="Appointment status"
                className="w-full rounded-xl border border-brand/10 bg-white px-3.5 py-2.5 text-sm outline-none transition-all duration-200 focus:border-gold/40 focus:ring-2 focus:ring-gold/10"
              >
                {/* The current value is listed even if it is not one of ours —
                    a row written before this vocabulary existed must still be
                    selectable rather than silently rewritten on save. */}
                {[
                  ...APPOINTMENT_STATUSES,
                  ...((APPOINTMENT_STATUSES as readonly string[]).includes(booking.status)
                    ? []
                    : [booking.status]),
                ].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>

              {outstanding > 0.005 ? (
                <p className="text-xs text-gold font-semibold">
                  {formatMoney(outstanding, booking.currency)} is still outstanding. Confirming now
                  records that you did so by hand.
                </p>
              ) : null}

              <button
                type="submit"
                className="w-full rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-brand-soft hover:shadow-md"
              >
                Update status
              </button>
            </form>
          </Card>

          <Card title="Attach a payment">
            <form action={attachPayment} className="space-y-4 p-5">
              <input type="hidden" name="appointmentId" value={booking.id} />
              <p className="text-xs text-brand-ink/40">
                For money that reached MoMo without being tied to this booking. Paste the
                reference, or pick one that is currently unattached.
              </p>
              <input
                name="referenceId"
                list="unlinked-payments"
                required
                placeholder="MoMo reference id"
                className="w-full rounded-xl border border-brand/10 bg-white px-3.5 py-2.5 font-mono text-xs outline-none transition-all duration-200 focus:border-gold/40 focus:ring-2 focus:ring-gold/10"
              />
              <datalist id="unlinked-payments">
                {unlinkedPayments.map((payment) => (
                  <option key={payment.id} value={payment.referenceId}>
                    {`${formatMoney(payment.amount, payment.currency)} · ${
                      payment.customerName || payment.payerPhone || "unknown payer"
                    } · ${formatDateTime(payment.createdAt)}`}
                  </option>
                ))}
              </datalist>
              <button
                type="submit"
                className="w-full rounded-xl border border-brand/10 bg-white px-4 py-2.5 text-sm font-semibold text-brand transition-all duration-200 hover:bg-cream hover:border-brand/20 hover:shadow-sm"
              >
                Link payment
              </button>
              {unlinkedPayments.length === 0 ? (
                <p className="text-xs text-brand-ink/35">
                  No unattached successful payments right now.
                </p>
              ) : null}
            </form>
          </Card>

          <Card title="History">
            <ul className="divide-y divide-slate-100 text-sm">
              {history.length === 0 ? (
                <li className="px-4 py-6 text-center text-xs text-slate-500">
                  No staff changes recorded.
                </li>
              ) : (
                history.map((entry) => (
                  <li key={entry.id} className="px-5 py-3.5 transition-colors duration-150 hover:bg-cream/40">
                    <p className="text-brand-ink/80 font-medium">{entry.action}</p>
                    {entry.detail ? (
                      <p className="text-xs text-brand-ink/40 mt-1">{entry.detail}</p>
                    ) : null}
                    <p className="mt-1 text-xs text-brand-ink/30">
                      {entry.actorEmail} · {formatRelative(entry.createdAt)}
                    </p>
                  </li>
                ))
              )}
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}
