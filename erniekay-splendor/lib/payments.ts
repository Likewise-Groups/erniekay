import { and, eq, isNull, or } from "drizzle-orm";

import { appointments, type Db, payments } from "./db";

export type PaymentStatus = "PENDING" | "SUCCESSFUL" | "FAILED";

export const VALID_PAYMENT_STATUSES = new Set<PaymentStatus>([
  "PENDING",
  "SUCCESSFUL",
  "FAILED",
]);

export type ApplyResult =
  | { outcome: "unknown-reference" }
  | { outcome: "applied"; appointmentId: string | null; confirmed: boolean; reason?: string };

/**
 * The single place a payment result is written to the database.
 *
 * Both the MTN callback and the status-polling endpoint land here. They
 * previously each carried their own copy of this logic and had already
 * diverged; a payment state machine with two implementations is one that will
 * disagree with itself.
 *
 * The invariant it enforces: an appointment is CONFIRMED only when a payment
 * that actually covers it has succeeded.
 */
export async function applyPaymentStatus(
  db: Db,
  referenceId: string,
  status: PaymentStatus,
  rawCallback?: unknown,
): Promise<ApplyResult> {
  const [payment] = await db
    .update(payments)
    .set({
      status,
      ...(rawCallback === undefined ? {} : { rawCallback: JSON.stringify(rawCallback) }),
      updatedAt: new Date(),
    })
    .where(eq(payments.referenceId, referenceId))
    .returning({
      appointmentId: payments.appointmentId,
      amount: payments.amount,
      currency: payments.currency,
      mode: payments.mode,
    });

  if (!payment) return { outcome: "unknown-reference" };
  if (!payment.appointmentId) {
    return { outcome: "applied", appointmentId: null, confirmed: false, reason: "unlinked" };
  }

  // Only ever promote to CONFIRMED. Writing PENDING on a non-success would let
  // a later failed retry silently un-confirm a booking that was already paid —
  // several payments can legitimately point at one appointment.
  if (status !== "SUCCESSFUL") {
    return {
      outcome: "applied",
      appointmentId: payment.appointmentId,
      confirmed: false,
      reason: `status ${status}`,
    };
  }

  const [appointment] = await db
    .select({
      amountDue: appointments.amountDue,
      currency: appointments.currency,
      status: appointments.status,
    })
    .from(appointments)
    .where(eq(appointments.id, payment.appointmentId))
    .limit(1);

  if (!appointment) {
    return {
      outcome: "applied",
      appointmentId: payment.appointmentId,
      confirmed: false,
      reason: "appointment missing",
    };
  }

  // A sandbox payment auto-approves with no handset involved. It must never
  // confirm a booking taken in live mode.
  const runtimeMode =
    (process.env.MTN_MOMO_TARGET_ENVIRONMENT || "production") === "sandbox" ? "sandbox" : "live";

  const reasons: string[] = [];

  if (payment.mode !== runtimeMode) reasons.push(`mode ${payment.mode} != ${runtimeMode}`);

  // Currency is only meaningful for a live collection. MoMo's sandbox coerces
  // every request to EUR regardless of what was asked for, so a sandbox payment
  // never matches a GHS booking and comparing them would block every sandbox
  // confirmation. The mode check above is what stops a sandbox payment leaking
  // into live; within sandbox, no real money exists to protect.
  if (payment.mode === "live" && payment.currency !== appointment.currency) {
    reasons.push(`currency ${payment.currency} != ${appointment.currency}`);
  }

  // Amount is always enforced — sandbox relabels the currency but keeps the
  // figure, so an underpayment is still detectable there.
  if (Number(payment.amount) < Number(appointment.amountDue)) {
    reasons.push(`amount ${payment.amount} < due ${appointment.amountDue}`);
  }

  if (reasons.length) {
    console.warn(
      `Refusing to confirm appointment ${payment.appointmentId} from payment ${referenceId}: ${reasons.join("; ")}`,
    );
    return {
      outcome: "applied",
      appointmentId: payment.appointmentId,
      confirmed: false,
      reason: reasons.join("; "),
    };
  }

  await db
    .update(appointments)
    .set({ status: "CONFIRMED", updatedAt: new Date() })
    .where(eq(appointments.id, payment.appointmentId));

  return { outcome: "applied", appointmentId: payment.appointmentId, confirmed: true };
}

/**
 * True when the appointment already has a payment that covers it, so a second
 * collection must not be started. Deliberately ignores amount/mode gates — any
 * SUCCESSFUL payment against the appointment is enough to stop a double charge.
 */
export async function hasSettledPayment(db: Db, appointmentId: string): Promise<boolean> {
  const [row] = await db
    .select({ id: payments.id })
    .from(payments)
    .where(and(eq(payments.appointmentId, appointmentId), eq(payments.status, "SUCCESSFUL")))
    .limit(1);

  return Boolean(row);
}

/** Payments still in flight for an appointment — used to avoid duplicate prompts. */
export async function hasPendingPayment(db: Db, appointmentId: string): Promise<boolean> {
  const [row] = await db
    .select({ id: payments.id })
    .from(payments)
    .where(
      and(
        eq(payments.appointmentId, appointmentId),
        or(eq(payments.status, "PENDING"), eq(payments.status, "INITIATED")),
      ),
    )
    .limit(1);

  return Boolean(row);
}

/** Exported for the reconciliation queries in scripts/db-check.mts. */
export const unlinkedSuccessfulPaymentsFilter = and(
  eq(payments.status, "SUCCESSFUL"),
  isNull(payments.appointmentId),
);
