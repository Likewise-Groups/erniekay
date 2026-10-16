/**
 * Display helpers shared by every list and detail view.
 *
 * ── Time zone ───────────────────────────────────────────────────────────────
 * Everything is rendered in Africa/Accra, explicitly. The salon is in Accra and
 * staff reason about appointment times in local terms; without a fixed zone the
 * same booking would read differently on a laptop that is set to UTC, and the
 * server rendering it would disagree with the browser. Ghana has no daylight
 * saving, so this is also stable year-round.
 */
const TIME_ZONE = "Africa/Accra";

const dateTimeFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: TIME_ZONE,
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: TIME_ZONE,
  weekday: "short",
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const timeFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export const formatDateTime = (value: Date | null | undefined): string =>
  value ? dateTimeFormat.format(value) : "—";

export const formatDate = (value: Date | null | undefined): string =>
  value ? dateFormat.format(value) : "—";

export const formatTime = (value: Date | null | undefined): string =>
  value ? timeFormat.format(value) : "—";

/**
 * Money, always with its currency.
 *
 * Bookings are priced in GHS but Receipt defaults to USD, so a bare number on
 * screen would be genuinely ambiguous.
 */
export function formatMoney(
  amount: number | null | undefined,
  currency: string | null | undefined = "GHS",
): string {
  if (amount === null || amount === undefined) return "—";

  const code = (currency || "GHS").toUpperCase();

  try {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: code,
      minimumFractionDigits: 2,
    }).format(amount);
  } catch {
    // An unrecognised currency code must not take the page down.
    return `${code} ${amount.toFixed(2)}`;
  }
}

/** "3 minutes ago" — for the audit trail, where recency matters more than the clock. */
export function formatRelative(value: Date | null | undefined): string {
  if (!value) return "—";

  const seconds = Math.round((Date.now() - value.getTime()) / 1000);
  const relative = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const steps: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ["second", 60],
    ["minute", 60],
    ["hour", 24],
    ["day", 30],
    ["month", 12],
  ];

  let amount = seconds;
  for (const [unit, size] of steps) {
    if (Math.abs(amount) < size) return relative.format(-Math.round(amount), unit);
    amount /= size;
  }

  return relative.format(-Math.round(amount), "year");
}

/**
 * The booking intent, as stored by the public site.
 *
 * Appointment.selectedServices is a canonical JSON array written by the public
 * app. It is parsed defensively — a malformed value is a display problem, not a
 * reason to fail the page that shows the booking.
 */
export function parseSelectedServices(raw: string | null | undefined): string[] {
  if (!raw?.trim()) return [];

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.map((item) => String(item)).filter(Boolean);
    if (typeof parsed === "string") return [parsed];
    return [];
  } catch {
    // Older rows may hold a plain comma-separated string.
    return raw.split(",").map((part) => part.trim()).filter(Boolean);
  }
}

export const fullName = (
  first: string | null | undefined,
  last: string | null | undefined,
  fallback = "—",
): string => [first, last].filter(Boolean).join(" ").trim() || fallback;

/** Truncates for table cells, keeping whole characters. */
export const truncate = (value: string, length = 60): string =>
  value.length <= length ? value : `${value.slice(0, length - 1)}…`;
