import { and, count, gte, lt, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

import {
  addDays,
  HORIZON_DAYS,
  isValidDateKey,
  slotStart,
  SLOT_CAPACITY,
  todayKey,
  type SlotCounts,
} from "@/lib/availability";
import { getDb } from "@/lib/db";
import { appointments } from "@/lib/schema";

/**
 * How many bookings already sit on each slot in a date range.
 *
 * GET /api/availability?from=2026-08-01&to=2026-08-31
 *
 * Returns counts, not verdicts. Whether a slot is bookable also depends on the
 * clock — the lead time makes 10:00 unavailable at 09:30 — and the client
 * already has that rule in lib/availability.ts. Sending counts keeps one
 * implementation of "is this bookable" rather than two that can disagree.
 *
 * Public and unauthenticated, like the booking endpoint it serves. It reveals
 * how busy the salon is on a given day and nothing else: no names, no contact
 * details, no booking ids.
 */

// Availability that is a minute stale is availability that double-books.
export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  try {
    const params = new URL(request.url).searchParams;
    const today = todayKey();

    const from = params.get("from") ?? today;
    const to = params.get("to") ?? addDays(today, 45);

    if (!isValidDateKey(from) || !isValidDateKey(to) || to < from) {
      return NextResponse.json({ error: "Invalid date range." }, { status: 400 });
    }

    // Bounded so one request cannot ask the database to group a decade of
    // bookings; a calendar only ever shows a month at a time.
    if (to > addDays(from, HORIZON_DAYS + 62)) {
      return NextResponse.json({ error: "Date range is too wide." }, { status: 400 });
    }

    const db = getDb();

    // Grouped in Postgres rather than fetched and counted here: the rows
    // themselves carry client data this endpoint must not hand out, and the
    // answer is a few dozen integers either way.
    const day = sql<string>`to_char(${appointments.appointmentDate}, 'YYYY-MM-DD')`;
    const time = sql<string>`to_char(${appointments.appointmentDate}, 'HH24:MI')`;

    const rows = await db
      .select({ day, time, taken: count() })
      .from(appointments)
      .where(
        and(
          gte(appointments.appointmentDate, slotStart(from, "00:00")),
          // Exclusive upper bound on the day after `to`, so the whole of `to` is in.
          lt(appointments.appointmentDate, slotStart(addDays(to, 1), "00:00")),
          // CANCELLED frees the slot again; COMPLETED still occupied it.
          sql`${appointments.status} IN ('PENDING', 'CONFIRMED', 'COMPLETED')`,
        ),
      )
      .groupBy(day, time);

    const counts: SlotCounts = {};
    for (const row of rows) counts[`${row.day} ${row.time}`] = Number(row.taken);

    return NextResponse.json({ from, to, capacity: SLOT_CAPACITY, counts });
  } catch (error) {
    console.error(
      "Availability lookup failed:",
      error instanceof Error ? `${error.name}: ${error.message}` : error,
    );

    // Degrade open, not closed. An empty count map makes every future slot look
    // free, which is the same state the site was in before this existed — and
    // the bookings endpoint re-checks capacity anyway, so the worst case is a
    // clear "that slot has just been taken" at submit rather than a calendar
    // that refuses to let anyone book during a database hiccup.
    return NextResponse.json(
      { from: null, to: null, capacity: SLOT_CAPACITY, counts: {}, degraded: true },
      { status: 200 },
    );
  }
}
