/**
 * The status vocabularies, in one place.
 *
 * ── Which of these the admin owns ───────────────────────────────────────────
 * Appointment.status and Payment.status are written by the public app too, so
 * the values here must match what it writes: PENDING/CONFIRMED for a booking,
 * PENDING/SUCCESSFUL/FAILED for a payment. CANCELLED and COMPLETED exist only
 * because a booking has a life after it is confirmed and only staff can say so.
 *
 * AdmissionsApplication.status is different: the public app only ever writes
 * "Submitted" (and "Draft" is the column default), so the review states below
 * are the admin's own vocabulary. They are capitalised to match the two values
 * already in the database rather than the SCREAMING_CASE used elsewhere — the
 * column holds free text and consistency with existing rows wins.
 */

export const APPOINTMENT_STATUSES = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"] as const;
export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];

export const PAYMENT_STATUSES = ["PENDING", "SUCCESSFUL", "FAILED"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const ADMISSION_STATUSES = [
  "Draft",
  "Submitted",
  "Reviewing",
  "Accepted",
  "Rejected",
] as const;
export type AdmissionStatus = (typeof ADMISSION_STATUSES)[number];

export const isAppointmentStatus = (value: string): value is AppointmentStatus =>
  (APPOINTMENT_STATUSES as readonly string[]).includes(value);

export const isAdmissionStatus = (value: string): value is AdmissionStatus =>
  (ADMISSION_STATUSES as readonly string[]).includes(value);

/**
 * Badge colours.
 *
 * Keyed by the raw string rather than the union, because these tables render
 * whatever is in the column — including a value written before this list
 * existed. Anything unrecognised falls back to neutral instead of rendering
 * unstyled.
 */
const TONES: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-800 ring-amber-200",
  CONFIRMED: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  COMPLETED: "bg-slate-100 text-slate-700 ring-slate-300",
  CANCELLED: "bg-rose-50 text-rose-800 ring-rose-200",
  SUCCESSFUL: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  FAILED: "bg-rose-50 text-rose-800 ring-rose-200",
  Draft: "bg-slate-100 text-slate-700 ring-slate-300",
  Submitted: "bg-sky-50 text-sky-800 ring-sky-200",
  Reviewing: "bg-amber-50 text-amber-800 ring-amber-200",
  Accepted: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  Rejected: "bg-rose-50 text-rose-800 ring-rose-200",
};

const NEUTRAL = "bg-slate-100 text-slate-700 ring-slate-300";

export const statusTone = (status: string | null | undefined): string =>
  (status && TONES[status]) || NEUTRAL;
