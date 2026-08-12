import { and, eq, gte, sql, type AnyColumn } from "drizzle-orm";

import { type Db, payments } from "./db";

/**
 * Rate limiting for the unauthenticated payment endpoint.
 *
 * Counted against the Payment table rather than a Cloudflare binding, for three
 * reasons: it is strongly consistent (Cloudflare's rate-limit binding is
 * per-colo and its window is capped at 10 or 60 seconds, so it cannot express
 * "3 prompts per phone per 10 minutes"); it works identically under `next dev`,
 * so it is testable; and the rows double as the audit trail that lets someone
 * see what an abuser actually did.
 *
 * The cost is one indexed COUNT per payment attempt. Both lookups are covered
 * by indexes added in migration 0002.
 */

export type RateLimitRule = {
  /** Human-readable, used in logs and the client-facing message. */
  label: string;
  windowMinutes: number;
  max: number;
};

/**
 * Per destination phone. The tight one: a real customer retries a failed prompt
 * two or three times, they do not start twenty collections in ten minutes.
 */
export const PHONE_RULE: RateLimitRule = { label: "phone", windowMinutes: 10, max: 5 };

/**
 * Per source IP. Looser, because a salon, hotel or campus can legitimately share
 * one address, and mobile carriers CGNAT large numbers of users behind few IPs.
 */
export const IP_RULE: RateLimitRule = { label: "ip", windowMinutes: 10, max: 15 };

export type RateLimitVerdict =
  | { allowed: true }
  | { allowed: false; rule: RateLimitRule; retryAfterSeconds: number };

const since = (windowMinutes: number) => new Date(Date.now() - windowMinutes * 60_000);

async function countSince(db: Db, column: AnyColumn, value: string, windowMinutes: number) {
  const [row] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(payments)
    .where(and(eq(column, value), gte(payments.createdAt, since(windowMinutes))));

  return row?.n ?? 0;
}

/**
 * Checks both rules. Returns the first breach so the caller can report which.
 *
 * `clientIp` may be null when the request did not arrive through Cloudflare
 * (local dev); the IP rule is skipped rather than failing open loudly, since the
 * phone rule still applies and is the one that limits real-world harm.
 */
export async function checkPaymentRateLimit(
  db: Db,
  msisdn: string,
  clientIp: string | null,
): Promise<RateLimitVerdict> {
  const phoneCount = await countSince(db, payments.payerPhone, msisdn, PHONE_RULE.windowMinutes);
  if (phoneCount >= PHONE_RULE.max) {
    return {
      allowed: false,
      rule: PHONE_RULE,
      retryAfterSeconds: PHONE_RULE.windowMinutes * 60,
    };
  }

  if (clientIp) {
    const ipCount = await countSince(db, payments.clientIp, clientIp, IP_RULE.windowMinutes);
    if (ipCount >= IP_RULE.max) {
      return { allowed: false, rule: IP_RULE, retryAfterSeconds: IP_RULE.windowMinutes * 60 };
    }
  }

  return { allowed: true };
}

/**
 * The caller's IP as Cloudflare reports it.
 *
 * CF-Connecting-IP is set by Cloudflare and cannot be spoofed by the client on a
 * Workers deployment. X-Forwarded-For is NOT trusted here — it is attacker
 * controlled, and honouring it would let anyone evade the IP limit by setting a
 * header.
 */
export const clientIpOf = (req: Request): string | null =>
  req.headers.get("cf-connecting-ip") || null;

export const userAgentOf = (req: Request): string | null =>
  req.headers.get("user-agent")?.slice(0, 512) || null;
