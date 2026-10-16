/**
 * A small in-process rate limiter, used only by sign-in.
 *
 * ── Why in memory is enough here ────────────────────────────────────────────
 * The public app rate-limits payment endpoints, where the attacker is anonymous
 * and the traffic is real. This is a staff sign-in on a single Node instance:
 * the job is to make online password guessing slow, and a counter in the
 * process does that. If this app is ever scaled to several instances the limit
 * becomes per-instance — note it and move the counter to Postgres then, rather
 * than pretending it is distributed now.
 *
 * Two keys are limited independently: the email being tried (so one account
 * cannot be ground down) and the client IP (so one source cannot sweep many
 * accounts).
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Bounded so a flood of distinct keys cannot grow the map without limit.
const MAX_BUCKETS = 5_000;

export type RateLimitResult = { allowed: true } | { allowed: false; retryAfterSeconds: number };

export function rateLimit(key: string, limit: number, windowSeconds: number): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    if (buckets.size >= MAX_BUCKETS) {
      for (const [candidate, bucket] of buckets) {
        if (bucket.resetAt <= now) buckets.delete(candidate);
      }
      // Still full: every bucket is live, which means we are under a spray
      // attack. Refusing is the safe answer.
      if (buckets.size >= MAX_BUCKETS) return { allowed: false, retryAfterSeconds: windowSeconds };
    }

    buckets.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return { allowed: true };
  }

  if (existing.count >= limit) {
    return { allowed: false, retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000) };
  }

  existing.count += 1;
  return { allowed: true };
}

/** Called after a successful sign-in so a staff member's typo does not stack up. */
export const clearRateLimit = (key: string): void => void buckets.delete(key);

/**
 * Best-effort client IP.
 *
 * Behind a proxy the socket address is the proxy's, so the forwarded headers
 * are read first. They are trivially spoofable by a direct client, which is
 * fine for this use: a forged value only splits an attacker's own bucket, and
 * the per-email limit is the one that actually protects an account.
 */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers.get("cf-connecting-ip") || headers.get("x-real-ip") || "unknown";
}
