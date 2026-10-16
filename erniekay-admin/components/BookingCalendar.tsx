import Link from "next/link";

import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";

/**
 * A month of the diary, at a glance.
 *
 * ── Why the overview needs this and the lists do not ────────────────────────
 * "Next appointments" answers what is coming. It cannot answer "how busy is
 * the 14th" or "which week is empty" — questions about shape rather than
 * sequence, which is what someone deciding whether to take a walk-in or run a
 * promotion is actually asking. A table of 300 rows never shows shape.
 *
 * ── Server-rendered, navigated by URL ───────────────────────────────────────
 * No client JavaScript: the month is a query parameter, so the arrows are
 * links, a particular month can be shared or bookmarked, and the counts are
 * whatever was true when the page was rendered rather than whenever a fetch
 * last resolved.
 */

export type DayBookings = {
  /** "YYYY-MM-DD" */
  date: string;
  count: number;
  pending: number;
};

/** Sunday first, matching how the salon's own week is written down. */
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

const monthLabel = (year: number, month: number) =>
  new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString("en-GB", {
    timeZone: "UTC",
    month: "long",
    year: "numeric",
  });

const pad = (value: number) => String(value).padStart(2, "0");

/**
 * Whole weeks, padded with the neighbouring months' days.
 *
 * The cell count is computed rather than discovered by looping until the month
 * ends: leading blanks plus days, rounded up to whole weeks. `Date.UTC` with a
 * day number outside the month rolls over correctly, which is what makes the
 * padding a single expression instead of three cases.
 */
function grid(year: number, month: number): Array<{ date: string; inMonth: boolean; day: number }> {
  const leading = new Date(Date.UTC(year, month - 1, 1)).getUTCDay(); // Sunday-first.
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const cellCount = Math.ceil((leading + daysInMonth) / 7) * 7;

  return Array.from({ length: cellCount }, (_, index) => {
    const cursor = new Date(Date.UTC(year, month - 1, 1 - leading + index));

    return {
      date: `${cursor.getUTCFullYear()}-${pad(cursor.getUTCMonth() + 1)}-${pad(cursor.getUTCDate())}`,
      inMonth: cursor.getUTCMonth() === month - 1,
      day: cursor.getUTCDate(),
    };
  });
}

export default function BookingCalendar({
  year,
  month,
  days,
  today,
}: {
  year: number;
  month: number;
  days: DayBookings[];
  /** "YYYY-MM-DD" in the salon's timezone, so "today" is not the server's idea of it. */
  today: string;
}) {
  const byDate = new Map(days.map((day) => [day.date, day]));
  const cells = grid(year, month);

  const step = (delta: number) => {
    const target = new Date(Date.UTC(year, month - 1 + delta, 1));
    return `/?month=${target.getUTCFullYear()}-${pad(target.getUTCMonth() + 1)}`;
  };

  const monthTotal = days.reduce((total, day) => total + day.count, 0);

  return (
    <section className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-brand/5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand/5 px-5 py-4">
        <div>
          <h2 className="font-heading text-base font-bold text-brand-ink">Booking calendar</h2>
          <p className="mt-0.5 text-xs text-brand-ink/50">
            {monthTotal
              ? `${monthTotal} appointment${monthTotal === 1 ? "" : "s"} this month`
              : "Nothing booked this month"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-brand-ink">{monthLabel(year, month)}</span>
          <div className="flex gap-1">
            <Link
              href={step(-1)}
              aria-label="Previous month"
              className="rounded-lg p-1.5 text-brand-ink/50 transition-colors hover:bg-cream hover:text-brand"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Link>
            <Link
              href={step(1)}
              aria-label="Next month"
              className="rounded-lg p-1.5 text-brand-ink/50 transition-colors hover:bg-cream hover:text-brand"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <div className="grid grid-cols-7 gap-px overflow-hidden rounded-xl bg-brand/10 ring-1 ring-brand/10">
          {WEEKDAYS.map((label) => (
            <div
              key={label}
              className="bg-cream/70 px-1 py-2 text-center text-[0.65rem] font-bold uppercase tracking-wider text-brand-ink/45"
            >
              {label}
            </div>
          ))}

          {cells.map((cell) => {
            const booked = byDate.get(cell.date);
            const isToday = cell.date === today;

            return (
              <div
                key={cell.date}
                className={`min-h-20 bg-white p-1.5 sm:min-h-24 sm:p-2 ${
                  cell.inMonth ? "" : "bg-cream/40"
                }`}
              >
                <span
                  className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-xs ${
                    isToday
                      ? "bg-brand font-bold text-white"
                      : cell.inMonth
                        ? "font-medium text-brand-ink"
                        : "text-brand-ink/25"
                  }`}
                >
                  {cell.day}
                </span>

                {booked ? (
                  <Link
                    // The appointments list filters by client, not by date, so
                    // this links to the day's bookings the only way it can:
                    // the full list, scrolled to nothing in particular. Better
                    // than a dead cell, and honest about what it does.
                    href="/appointments"
                    className={`mt-1 block rounded-lg border px-1.5 py-1 text-[0.65rem] font-semibold leading-tight transition-colors ${
                      booked.pending
                        ? "border-gold/40 bg-gold/10 text-amber-800 hover:bg-gold/20"
                        : "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                    }`}
                  >
                    {booked.count} booking{booked.count === 1 ? "" : "s"}
                    {booked.pending ? (
                      <span className="block font-normal opacity-80">
                        {booked.pending} pending
                      </span>
                    ) : null}
                  </Link>
                ) : null}
              </div>
            );
          })}
        </div>

        <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.65rem] text-brand-ink/45">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm border border-gold/40 bg-gold/20" /> Has pending
            bookings
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm border border-emerald-200 bg-emerald-50" /> All
            settled
          </span>
        </p>
      </div>
    </section>
  );
}
