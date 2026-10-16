/**
 * When the salon can be booked, and what "available" means.
 *
 * ── Why this file exists ────────────────────────────────────────────────────
 * The opening hours used to be declared twice — 09:00–16:00 in half hours in
 * BookingModal, and a different seven-slot list starting 09:00 AM and running
 * to 06:00 PM in the /booking wizard — and neither knew anything about what was
 * already booked. Two customers could take the same slot, a Sunday was
 * bookable, and so was a time five minutes away. This is the single answer to
 * "can this slot be booked", used by both booking surfaces and by the server
 * that has the final say.
 *
 * ── Server-safe ─────────────────────────────────────────────────────────────
 * No React, no imports, no environment access: imported by client components,
 * by the availability route and by the bookings route alike.
 *
 * ── Time zone ───────────────────────────────────────────────────────────────
 * Everything is Africa/Accra. Ghana is UTC+0 and has no daylight saving, so an
 * Accra wall-clock time and a UTC instant are the same thing all year — which
 * is why `slotStart()` can append "Z" and be exactly right. That equivalence is
 * relied on deliberately rather than accidentally: if the business ever opens
 * somewhere with an offset, every conversion to fix is in this file.
 */

export const TIME_ZONE = "Africa/Accra";

/** Days the salon opens. 0 is Sunday — closed. */
export const OPEN_DAYS: readonly number[] = [1, 2, 3, 4, 5, 6];

/** First and last slot, in minutes past midnight. The last slot starts at 16:00. */
export const OPEN_MINUTES = 9 * 60;
export const CLOSE_MINUTES = 16 * 60;
export const SLOT_MINUTES = 30;

/**
 * How many bookings one slot holds — how many clients can be served at once.
 * Raise it when the team grows; nothing else needs to change.
 */
export const SLOT_CAPACITY = 3;

/**
 * How far ahead a booking must be made. Somebody browsing at 09:55 should not
 * be offered the 10:00 slot: staff need warning, and the client needs to travel.
 */
export const LEAD_TIME_MINUTES = 90;

/** How far ahead the calendar goes. Beyond this the diary is not meaningful. */
export const HORIZON_DAYS = 60;

/** Every slot in a full day, as "HH:MM". */
export const SLOT_TIMES: string[] = (() => {
  const slots: string[] = [];
  for (let minutes = OPEN_MINUTES; minutes <= CLOSE_MINUTES; minutes += SLOT_MINUTES) {
    slots.push(
      `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`,
    );
  }
  return slots;
})();

/** "09:30" -> "9:30 AM". The only format shown to a client. */
export function formatSlot(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${String(minutes).padStart(2, "0")} ${period}`;
}

/** A calendar day, "YYYY-MM-DD", in Accra rather than in the viewer's zone. */
export function dateKey(value: Date): string {
  // en-CA formats as YYYY-MM-DD, which is the one thing it is useful for.
  return value.toLocaleDateString("en-CA", { timeZone: TIME_ZONE });
}

export const todayKey = (now: Date = new Date()): string => dateKey(now);

/** Shifts a date key by whole days without going through a Date in local time. */
export function addDays(key: string, days: number): string {
  const [year, month, day] = key.split("-").map(Number);
  const shifted = new Date(Date.UTC(year, month - 1, day + days));
  return shifted.toISOString().slice(0, 10);
}

/** The instant a slot begins. Accra is UTC+0 year-round — see the file note. */
export const slotStart = (key: string, time: string): Date =>
  new Date(`${key}T${time}:00.000Z`);

/** 0–6, Sunday first, for a date key. */
export const weekdayOf = (key: string): number => {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
};

export const isOpenDay = (key: string): boolean => OPEN_DAYS.includes(weekdayOf(key));

export const isValidDateKey = (value: string): boolean =>
  /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00.000Z`));

export const isValidSlotTime = (value: string): boolean => SLOT_TIMES.includes(value);

/**
 * How taken slots are counted, keyed "YYYY-MM-DD HH:MM".
 *
 * A missing key means nothing is booked. Built by /api/availability from the
 * Appointment table; a booking that does not land exactly on the grid (the
 * older wizard wrote times like "06:00 PM" before the two flows were unified)
 * simply matches no key and is not counted.
 */
export type SlotCounts = Record<string, number>;

export const slotKey = (key: string, time: string): string => `${key} ${time}`;

export type SlotState = {
  time: string;
  label: string;
  taken: number;
  remaining: number;
  /** Null when bookable; otherwise why not, in words a client can act on. */
  unavailable: null | "past" | "full";
};

/**
 * The state of every slot on one day.
 *
 * Note it returns all of them, including the unbookable ones. A grid showing
 * "10:00 — fully booked" tells a client something; a grid that silently omits
 * 10:00 just looks like the salon does not open then.
 */
export function daySlots(
  key: string,
  counts: SlotCounts = {},
  now: Date = new Date(),
): SlotState[] {
  const earliest = now.getTime() + LEAD_TIME_MINUTES * 60 * 1000;

  return SLOT_TIMES.map((time) => {
    const taken = counts[slotKey(key, time)] ?? 0;
    const remaining = Math.max(0, SLOT_CAPACITY - taken);

    let unavailable: SlotState["unavailable"] = null;
    if (slotStart(key, time).getTime() < earliest) unavailable = "past";
    else if (remaining === 0) unavailable = "full";

    return { time, label: formatSlot(time), taken, remaining, unavailable };
  });
}

export type DayState = {
  key: string;
  /** Day of the month, for the grid. */
  day: number;
  isOpen: boolean;
  /** True when the salon opens but every slot has gone or passed. */
  isFull: boolean;
  bookableSlots: number;
  isToday: boolean;
  isPast: boolean;
  beyondHorizon: boolean;
  /** The one thing the grid needs: may this day be clicked? */
  selectable: boolean;
};

export function dayState(key: string, counts: SlotCounts = {}, now: Date = new Date()): DayState {
  const today = todayKey(now);
  const isPast = key < today;
  const beyondHorizon = key > addDays(today, HORIZON_DAYS);
  const open = isOpenDay(key);
  const bookableSlots = open && !isPast && !beyondHorizon
    ? daySlots(key, counts, now).filter((slot) => !slot.unavailable).length
    : 0;

  return {
    key,
    day: Number(key.slice(8, 10)),
    isOpen: open,
    isFull: open && !isPast && !beyondHorizon && bookableSlots === 0,
    bookableSlots,
    isToday: key === today,
    isPast,
    beyondHorizon,
    selectable: bookableSlots > 0,
  };
}

/**
 * The server's verdict on one slot, and the only place the rule is enforced.
 *
 * The calendar uses the same function, but a client that never opened the
 * calendar — or that opened it an hour ago — must not be able to take a slot
 * that has since gone. Returns null when the booking may proceed.
 */
export function slotProblem(
  key: string,
  time: string,
  taken: number,
  now: Date = new Date(),
): string | null {
  if (!isValidDateKey(key)) return "That date is not a real date.";
  if (!isValidSlotTime(time)) {
    return `Appointments start on the half hour between ${formatSlot(SLOT_TIMES[0])} and ${formatSlot(
      SLOT_TIMES[SLOT_TIMES.length - 1],
    )}.`;
  }
  if (!isOpenDay(key)) return "The salon is closed that day.";
  if (key > addDays(todayKey(now), HORIZON_DAYS)) {
    return `Bookings open ${HORIZON_DAYS} days ahead. Please choose an earlier date.`;
  }
  if (slotStart(key, time).getTime() < now.getTime() + LEAD_TIME_MINUTES * 60 * 1000) {
    return "That time has passed. Please choose a later slot.";
  }
  if (taken >= SLOT_CAPACITY) return "That slot has just been taken. Please choose another.";

  return null;
}

/**
 * The month grid, padded to whole weeks starting Monday.
 *
 * Returns date keys, with null for the padding cells, so the rendering
 * component owns no date arithmetic at all.
 */
export function monthGrid(year: number, month: number): Array<string | null> {
  const first = new Date(Date.UTC(year, month - 1, 1));
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();

  // getUTCDay() is Sunday-first; the grid is Monday-first.
  const leading = (first.getUTCDay() + 6) % 7;

  const cells: Array<string | null> = Array(leading).fill(null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(`${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`);
  }
  while (cells.length % 7 !== 0) cells.push(null);

  return cells;
}

export const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

/** "Monday, 18 August 2026" — for confirmation lines and receipts. */
export function formatLongDate(key: string): string {
  return slotStart(key, "12:00").toLocaleDateString("en-GB", {
    timeZone: TIME_ZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export const formatMonthLabel = (year: number, month: number): string =>
  new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString("en-GB", {
    timeZone: "UTC",
    month: "long",
    year: "numeric",
  });
