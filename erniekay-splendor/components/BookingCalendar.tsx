"use client";

import { useEffect, useMemo, useState } from "react";

import {
  addDays,
  dayState,
  daySlots,
  formatLongDate,
  formatMonthLabel,
  HORIZON_DAYS,
  monthGrid,
  SLOT_CAPACITY,
  todayKey,
  WEEKDAY_LABELS,
  type SlotCounts,
} from "@/lib/availability";

/**
 * Pick a date and a time, seeing what is actually free.
 *
 * ── Why a month grid and not a date input ───────────────────────────────────
 * `<input type="date">` renders the operating system's picker, which has no way
 * to know the salon is shut on Sundays or that Saturday is full. A client would
 * choose a date, then discover at the time step that nothing on it is
 * available. The whole point of a calendar here is that the closed and the full
 * days are visibly closed and full before anything is chosen.
 *
 * ── Degrades open ───────────────────────────────────────────────────────────
 * If availability cannot be fetched, every future slot is shown as free rather
 * than the calendar refusing to work. The bookings endpoint enforces capacity
 * for real, so the failure mode is a clear message at submit — not a salon that
 * cannot take bookings because one query timed out.
 */

export type BookingSelection = { date: string; time: string };

/** A stable identity for "nothing loaded yet"; see the useMemo below. */
const EMPTY_COUNTS: SlotCounts = {};

type Props = {
  value: BookingSelection;
  onChange: (value: BookingSelection) => void;
  /** Shown under the grid; the two surfaces word it differently. */
  hint?: string;
};

export default function BookingCalendar({ value, onChange, hint }: Props) {
  const today = useMemo(() => todayKey(), []);
  const [cursor, setCursor] = useState(() => {
    const key = value.date && value.date >= today ? value.date : today;
    return { year: Number(key.slice(0, 4)), month: Number(key.slice(5, 7)) };
  });
  /**
   * Availability, tagged with the month it describes.
   *
   * Tagged rather than kept in a bare `counts` state with a separate `loading`
   * flag, for two reasons: "still loading" becomes a derived value (the stored
   * month is not the month on screen) rather than a second thing to keep in
   * step, and a slow response for August can no longer land after the client
   * has paged on to September and overwrite it.
   */
  const [loaded, setLoaded] = useState<{ month: string; counts: SlotCounts } | null>(null);

  /**
   * Re-read the clock on every render pass that matters rather than once on
   * mount: the modal can sit open for a long while, and a lead time measured
   * from when the page loaded would slowly start offering slots that have gone.
   */
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

  const monthCells = useMemo(() => monthGrid(cursor.year, cursor.month), [cursor]);
  const monthStart = `${cursor.year}-${String(cursor.month).padStart(2, "0")}-01`;

  useEffect(() => {
    let cancelled = false;

    (async () => {
      let counts: SlotCounts = {};
      try {
        const response = await fetch(
          `/api/availability?from=${monthStart}&to=${addDays(monthStart, 31)}`,
          { cache: "no-store" },
        );
        const data = await response.json();
        counts = data?.counts ?? {};
      } catch {
        // See the note at the top: an availability outage must not stop anyone
        // booking. An empty map shows every future slot as free, and the
        // bookings endpoint still refuses one that has actually gone.
      }
      if (!cancelled) setLoaded({ month: monthStart, counts });
    })();

    return () => {
      cancelled = true;
    };
  }, [monthStart]);

  // Memoised so the fallback `{}` is not a fresh object on every render, which
  // would invalidate every hook below it.
  const counts = useMemo(
    () => (loaded?.month === monthStart ? loaded.counts : EMPTY_COUNTS),
    [loaded, monthStart],
  );
  const loading = loaded?.month !== monthStart;

  const days = useMemo(
    () => monthCells.map((key) => (key ? dayState(key, counts, now) : null)),
    [monthCells, counts, now],
  );

  const slots = useMemo(
    () => (value.date ? daySlots(value.date, counts, now) : []),
    [value.date, counts, now],
  );

  // A day that was selectable when it was picked can fill up while the modal is
  // open. Clearing the time keeps the summary from showing a slot that has gone.
  useEffect(() => {
    if (!value.time || !value.date) return;
    const chosen = daySlots(value.date, counts, now).find((slot) => slot.time === value.time);
    if (chosen?.unavailable) onChange({ date: value.date, time: "" });
  }, [counts, now, value.date, value.time, onChange]);

  const horizonEnd = addDays(today, HORIZON_DAYS);
  const canGoBack = monthStart > today.slice(0, 8) + "01";
  const canGoForward = monthStart < horizonEnd.slice(0, 8) + "01";

  const step = (delta: number) =>
    setCursor((current) => {
      const month = current.month + delta;
      if (month < 1) return { year: current.year - 1, month: 12 };
      if (month > 12) return { year: current.year + 1, month: 1 };
      return { ...current, month };
    });

  return (
    <div className="border border-outline-variant">
      <div className="flex items-center justify-between border-b border-outline-variant px-4 py-3">
        <button
          type="button"
          onClick={() => step(-1)}
          disabled={!canGoBack}
          aria-label="Previous month"
          className="flex h-8 w-8 items-center justify-center border border-outline-variant text-royal-navy transition-colors hover:bg-alabaster-white disabled:cursor-not-allowed disabled:opacity-30"
        >
          <span className="material-symbols-outlined text-[18px]">chevron_left</span>
        </button>

        <span className="font-body-bold text-royal-navy" aria-live="polite">
          {formatMonthLabel(cursor.year, cursor.month)}
        </span>

        <button
          type="button"
          onClick={() => step(1)}
          disabled={!canGoForward}
          aria-label="Next month"
          className="flex h-8 w-8 items-center justify-center border border-outline-variant text-royal-navy transition-colors hover:bg-alabaster-white disabled:cursor-not-allowed disabled:opacity-30"
        >
          <span className="material-symbols-outlined text-[18px]">chevron_right</span>
        </button>
      </div>

      <div className="px-4 pb-4 pt-3">
        <div className="grid grid-cols-7 gap-1">
          {WEEKDAY_LABELS.map((label) => (
            <div
              key={label}
              className="pb-1 text-center text-[10px] font-bold uppercase tracking-[0.1em] text-warm-slate"
            >
              {label}
            </div>
          ))}

          {days.map((day, index) => {
            if (!day) return <div key={`pad-${index}`} />;

            const selected = value.date === day.key;
            // Closed, full and past look different from each other on purpose:
            // "we never open Sundays" and "Saturday has gone" are different
            // answers, and a client deciding when to come needs both.
            const title = !day.isOpen
              ? "Closed"
              : day.isPast
                ? "Past"
                : day.beyondHorizon
                  ? "Not open for booking yet"
                  : day.isFull
                    ? "Fully booked"
                    : `${day.bookableSlots} slot${day.bookableSlots === 1 ? "" : "s"} free`;

            return (
              <button
                key={day.key}
                type="button"
                onClick={() => onChange({ date: day.key, time: "" })}
                disabled={!day.selectable}
                aria-label={`${formatLongDate(day.key)} — ${title}`}
                aria-pressed={selected}
                title={title}
                className={`relative flex aspect-square flex-col items-center justify-center border text-sm transition-colors ${
                  selected
                    ? "border-majestic-gold bg-royal-navy font-bold text-majestic-gold"
                    : day.selectable
                      ? "border-transparent text-royal-navy hover:border-royal-navy/40 hover:bg-alabaster-white"
                      : "cursor-not-allowed border-transparent text-outline"
                } ${day.isToday && !selected ? "ring-1 ring-inset ring-champagne-taupe" : ""}`}
              >
                <span className={day.isPast || !day.isOpen ? "line-through decoration-1" : ""}>
                  {day.day}
                </span>

                {/* One dot per remaining-capacity band, so "nearly full" reads
                    at a glance without a number on every cell. */}
                {day.selectable ? (
                  <span
                    className={`mt-0.5 h-1 w-1 rounded-full ${
                      selected
                        ? "bg-majestic-gold"
                        : day.bookableSlots <= 2
                          ? "bg-crimson/60"
                          : "bg-premium-green/60"
                    }`}
                  />
                ) : day.isFull ? (
                  <span className="mt-0.5 text-[8px] font-bold uppercase tracking-wide text-crimson/70">
                    Full
                  </span>
                ) : (
                  <span className="mt-0.5 h-1 w-1" />
                )}
              </button>
            );
          })}
        </div>

        <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-warm-slate">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-premium-green/60" /> Good availability
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-crimson/60" /> Almost full
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-outline line-through">00</span> Closed or gone
          </span>
          {loading ? <span className="ml-auto italic">Checking availability…</span> : null}
        </p>
      </div>

      {value.date ? (
        <div className="border-t border-outline-variant px-4 py-4">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.12em] text-royal-navy">
            {formatLongDate(value.date)}
          </p>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {slots.map((slot) => {
              const selected = value.time === slot.time;

              return (
                <button
                  key={slot.time}
                  type="button"
                  onClick={() => onChange({ date: value.date, time: slot.time })}
                  disabled={Boolean(slot.unavailable)}
                  aria-pressed={selected}
                  className={`border px-2 py-2.5 text-center text-[13px] transition-colors ${
                    selected
                      ? "border-majestic-gold bg-royal-navy font-semibold text-majestic-gold"
                      : slot.unavailable
                        ? "cursor-not-allowed border-outline-variant/60 text-outline"
                        : "border-outline-variant text-royal-navy hover:border-royal-navy"
                  }`}
                >
                  <span className={slot.unavailable === "full" ? "line-through" : ""}>
                    {slot.label}
                  </span>
                  <span className="mt-0.5 block text-[9px] uppercase tracking-wide opacity-70">
                    {slot.unavailable === "full"
                      ? "Fully booked"
                      : slot.unavailable === "past"
                        ? "Passed"
                        : `${slot.remaining} of ${SLOT_CAPACITY} left`}
                  </span>
                </button>
              );
            })}
          </div>

          {slots.every((slot) => slot.unavailable) ? (
            <p className="mt-3 text-xs text-crimson">
              Nothing left on this day — please choose another date.
            </p>
          ) : null}
        </div>
      ) : (
        <p className="border-t border-outline-variant px-4 py-4 text-xs text-warm-slate">
          {hint ?? "Choose a date to see the times available."}
        </p>
      )}
    </div>
  );
}
