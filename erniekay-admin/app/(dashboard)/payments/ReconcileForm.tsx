"use client";

import { useState } from "react";

import { attachPayment } from "../appointments/actions";

/**
 * Inline "attach this payment to that booking", one per unlinked row.
 *
 * A client component for one reason: the submit button stays disabled until a
 * booking is chosen. Attaching a payment to the wrong booking confirms it and
 * has to be unpicked by hand, so the control should not be pressable while it
 * would mean nothing.
 *
 * It posts to the same `attachPayment` action the appointment detail page uses
 * — one implementation of the rule, two places to reach it — with `returnTo`
 * telling it which page to come back to.
 */
export default function ReconcileForm({
  referenceId,
  bookings,
}: {
  referenceId: string;
  bookings: Array<{ id: string; label: string }>;
}) {
  const [appointmentId, setAppointmentId] = useState("");

  if (bookings.length === 0) {
    return <span className="text-xs text-slate-500">No open bookings to attach to.</span>;
  }

  return (
    <form action={attachPayment} className="flex min-w-[18rem] flex-col gap-1.5">
      <input type="hidden" name="referenceId" value={referenceId} />
      <input type="hidden" name="returnTo" value="payments" />

      <select
        name="appointmentId"
        value={appointmentId}
        onChange={(event) => setAppointmentId(event.target.value)}
        aria-label={`Booking to attach payment ${referenceId} to`}
        className="w-full rounded-xl border border-brand/10 bg-white px-3 py-1.5 text-xs outline-none transition-all duration-200 focus:border-gold/40 focus:ring-2 focus:ring-gold/10"
      >
        <option value="">Choose a booking…</option>
        {bookings.map((booking) => (
          <option key={booking.id} value={booking.id}>
            {booking.label}
          </option>
        ))}
      </select>

      <button
        type="submit"
        disabled={!appointmentId}
        className="self-start rounded-xl bg-brand px-3 py-1.5 text-xs font-semibold text-white transition-all duration-200 hover:bg-brand-soft disabled:cursor-not-allowed disabled:bg-brand-ink/5 disabled:text-brand-ink/25"
      >
        Attach
      </button>
    </form>
  );
}
