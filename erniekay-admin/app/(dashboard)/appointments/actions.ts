"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, eq, sql } from "drizzle-orm";

import { recordAudit } from "@/lib/audit";
import { requireAdmin } from "@/lib/auth";
import { appointments, getDb, payments } from "@/lib/db";
import { formatMoney } from "@/lib/format";
import { isAppointmentStatus } from "@/lib/status";

/**
 * The writes staff make against a booking.
 *
 * Each one re-checks the session itself. A server action is a separately
 * addressable endpoint — the dashboard layout's `requireAdmin()` never runs for
 * it, so trusting the layout would leave these callable by anyone who knows the
 * action id.
 */

// Typed `never` so the compiler knows the checks that call it are terminal —
// otherwise every `if (!row) back(...)` would need an extra `return`.
function backToAppointment(id: string, notice: string): never {
  revalidatePath("/appointments");
  revalidatePath(`/appointments/${id}`);
  redirect(`/appointments/${id}?notice=${notice}`);
}

export async function updateAppointmentStatus(formData: FormData): Promise<void> {
  const admin = await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!id || !isAppointmentStatus(status)) {
    redirect(`/appointments/${id}?notice=invalid`);
  }

  const db = getDb();

  // Read the previous status and what has actually been paid in the same
  // breath: the audit line should say what changed, and confirming a booking
  // that no money covers is worth recording as exactly that.
  const [before] = await db
    .select({
      status: appointments.status,
      amountDue: appointments.amountDue,
      currency: appointments.currency,
      paid: sql<string | null>`(
        SELECT SUM(${payments.amount}) FROM ${payments}
        WHERE ${payments.appointmentId} = ${appointments.id}
          AND ${payments.status} = 'SUCCESSFUL'
      )`,
    })
    .from(appointments)
    .where(eq(appointments.id, id))
    .limit(1);

  if (!before) redirect("/appointments?notice=missing");

  if (before.status === status) {
    backToAppointment(id, "unchanged");
  }

  await db
    .update(appointments)
    .set({ status, updatedAt: new Date() })
    .where(eq(appointments.id, id));

  const paid = Number(before.paid ?? 0);
  const unbacked =
    status === "CONFIRMED" && before.amountDue > 0 && paid + 0.005 < before.amountDue;

  await recordAudit(admin, {
    entity: "appointment",
    entityId: id,
    action: "status changed",
    detail:
      `${before.status} -> ${status}` +
      (unbacked
        ? ` (confirmed by hand: ${formatMoney(paid, before.currency)} received of ${formatMoney(
            before.amountDue,
            before.currency,
          )})`
        : ""),
  });

  backToAppointment(id, "updated");
}

export async function updateAppointmentNotes(formData: FormData): Promise<void> {
  const admin = await requireAdmin();

  const id = String(formData.get("id") ?? "");
  // Long enough for a phone conversation, short enough not to be a document.
  const notes = String(formData.get("notes") ?? "").trim().slice(0, 2000);

  if (!id) redirect("/appointments?notice=missing");

  const db = getDb();
  const [before] = await db
    .select({ notes: appointments.notes })
    .from(appointments)
    .where(eq(appointments.id, id))
    .limit(1);

  if (!before) redirect("/appointments?notice=missing");
  if ((before.notes ?? "") === notes) backToAppointment(id, "unchanged");

  await db
    .update(appointments)
    .set({ notes: notes || null, updatedAt: new Date() })
    .where(eq(appointments.id, id));

  await recordAudit(admin, {
    entity: "appointment",
    entityId: id,
    action: "notes edited",
    // The note itself is not copied into the trail: it can hold whatever a
    // client said on the phone, and the audit log is read by more people than
    // the booking is.
    detail: notes ? `${notes.length} characters` : "cleared",
  });

  backToAppointment(id, "updated");
}

/**
 * Binds a payment that MTN confirmed to the booking it belongs to.
 *
 * The public app writes the Payment row before the booking exists, so a
 * successful payment can end up with `appointmentId = null` — money received
 * against nothing. This is how a person repairs that.
 *
 * Two rules are enforced rather than trusted to the operator:
 *   • only a payment that is not already attached elsewhere can be moved, so
 *     linking cannot silently steal a payment from another booking;
 *   • attaching a SUCCESSFUL payment confirms the booking, which is the same
 *     rule applyPaymentStatus() applies in the public app.
 */
export async function attachPayment(formData: FormData): Promise<void> {
  const admin = await requireAdmin();

  const appointmentId = String(formData.get("appointmentId") ?? "");
  const reference = String(formData.get("referenceId") ?? "").trim();
  const returnTo = String(formData.get("returnTo") ?? "");

  function back(notice: string): never {
    revalidatePath("/payments");
    revalidatePath("/appointments");
    if (appointmentId) revalidatePath(`/appointments/${appointmentId}`);
    redirect(
      returnTo === "payments"
        ? `/payments?notice=${notice}`
        : `/appointments/${appointmentId}?notice=${notice}`,
    );
  }

  if (!appointmentId || !reference) back("invalid");

  const db = getDb();

  const [booking] = await db
    .select({ id: appointments.id, status: appointments.status })
    .from(appointments)
    .where(eq(appointments.id, appointmentId))
    .limit(1);

  if (!booking) back("missing");

  // Matches by reference id or the row's own id — the reference is what staff
  // can read off a MoMo statement, the id is what the payments table links with.
  const [payment] = await db
    .select({
      id: payments.id,
      referenceId: payments.referenceId,
      appointmentId: payments.appointmentId,
      status: payments.status,
      amount: payments.amount,
      currency: payments.currency,
      mode: payments.mode,
    })
    .from(payments)
    .where(sql`${payments.referenceId} = ${reference} OR ${payments.id} = ${reference}`)
    .limit(1);

  if (!payment) back("no-payment");
  if (payment.appointmentId && payment.appointmentId !== appointmentId) back("already-linked");
  if (payment.appointmentId === appointmentId) back("unchanged");

  try {
    await db.transaction(async (tx) => {
      // The null check is repeated in the UPDATE, not just read above: two staff
      // members reconciling the same payment at once must not both succeed.
      const linked = await tx
        .update(payments)
        .set({ appointmentId, updatedAt: new Date() })
        .where(and(eq(payments.id, payment.id), sql`${payments.appointmentId} IS NULL`))
        .returning({ id: payments.id });

      if (!linked.length) throw new Error("already-linked");

      if (payment.status === "SUCCESSFUL") {
        await tx
          .update(appointments)
          .set({ status: "CONFIRMED", updatedAt: new Date() })
          .where(eq(appointments.id, appointmentId));
      }

      await recordAudit(
        admin,
        {
          // Filed against the appointment, not the payment: the appointment
          // detail page shows its own history, and "a payment was attached" is
          // a fact about the booking. The payment's reference is in the detail.
          entity: "appointment",
          entityId: appointmentId,
          action: "payment linked",
          detail:
            `${payment.referenceId} (${formatMoney(payment.amount, payment.currency)}, ` +
            `${payment.status}${payment.mode === "live" ? "" : `, ${payment.mode}`})` +
            (payment.status === "SUCCESSFUL" && booking.status !== "CONFIRMED"
              ? `; ${booking.status} -> CONFIRMED`
              : ""),
        },
        // Inside the transaction: if the link rolls back, the trail must not
        // claim it happened.
        tx,
      );
    });
  } catch (error) {
    // The only expected failure is losing the race for an unlinked payment.
    if (error instanceof Error && error.message === "already-linked") back("already-linked");
    throw error;
  }

  back("linked");
}
