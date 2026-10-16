/**
 * The admin session cookie: a signed, self-contained token.
 *
 * Format:  <base64url(JSON payload)>.<base64url(HMAC-SHA256)>
 *
 * ── Why no session table ────────────────────────────────────────────────────
 * A stateless token keeps sign-in to a single database read and needs no
 * cleanup job. The cost is that a token cannot be revoked individually; the
 * revocation lever is ADMIN_SESSION_SECRET, and rotating it signs everyone out
 * at once. That is the right trade for a handful of staff accounts. Role
 * changes do take effect immediately regardless, because every request
 * re-reads the user's role from the database (see requireAdmin in auth.ts) —
 * the token only proves *who* is asking, never *what they may do*.
 *
 * ── Why HMAC and not JWT ────────────────────────────────────────────────────
 * No library, no `alg: none` class of mistake, and nothing here is read by
 * another system. The payload is signed, not encrypted: it holds an id, an
 * email and an expiry, none of which are secret. It must never carry anything
 * that is.
 */

export const SESSION_COOKIE = "ek_admin_session";

const DEFAULT_SESSION_HOURS = 12;

export type SessionPayload = {
  /** User.id */
  uid: string;
  email: string;
  /** Expiry, epoch seconds. */
  exp: number;
};

const encoder = new TextEncoder();

const toBase64Url = (bytes: Uint8Array): string =>
  btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

const fromBase64Url = (value: string): Uint8Array => {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded.padEnd(Math.ceil(padded.length / 4) * 4, "="));
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
};

function secret(): string {
  const value = process.env.ADMIN_SESSION_SECRET;

  // A short or missing secret is a deployment mistake that would otherwise
  // surface as "sessions work but anyone can forge one", so it fails loudly.
  if (!value || value.length < 32) {
    throw new Error(
      "ADMIN_SESSION_SECRET must be set to at least 32 characters. " +
        'Generate one with: node -e "console.log(require(\'crypto\').randomBytes(48).toString(\'base64url\'))"',
    );
  }

  return value;
}

async function signingKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export function sessionHours(): number {
  const raw = Number(process.env.ADMIN_SESSION_HOURS);
  return Number.isFinite(raw) && raw > 0 && raw <= 720 ? raw : DEFAULT_SESSION_HOURS;
}

export async function createSessionToken(user: { id: string; email: string }): Promise<{
  token: string;
  expiresAt: Date;
}> {
  const expiresAt = new Date(Date.now() + sessionHours() * 60 * 60 * 1000);
  const payload: SessionPayload = {
    uid: user.id,
    email: user.email,
    exp: Math.floor(expiresAt.getTime() / 1000),
  };

  const body = toBase64Url(encoder.encode(JSON.stringify(payload)));
  const signature = await crypto.subtle.sign(
    "HMAC",
    await signingKey(),
    encoder.encode(body),
  );

  return { token: `${body}.${toBase64Url(new Uint8Array(signature))}`, expiresAt };
}

/**
 * Verifies a token and returns its payload, or null.
 *
 * Every failure — bad shape, bad signature, expired, unparseable — returns
 * null. The caller's only correct response to any of them is the same: treat
 * the request as signed out.
 */
export async function readSessionToken(
  token: string | undefined | null,
): Promise<SessionPayload | null> {
  if (!token) return null;

  const [body, signature] = token.split(".");
  if (!body || !signature) return null;

  try {
    const valid = await crypto.subtle.verify(
      "HMAC",
      await signingKey(),
      fromBase64Url(signature) as BufferSource,
      encoder.encode(body),
    );
    if (!valid) return null;

    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(body))) as SessionPayload;

    if (typeof payload?.uid !== "string" || typeof payload?.email !== "string") return null;
    if (typeof payload?.exp !== "number" || payload.exp * 1000 <= Date.now()) return null;

    return payload;
  } catch {
    return null;
  }
}

/** Cookie attributes, shared by sign-in and sign-out so they cannot drift apart. */
export function sessionCookieOptions(expiresAt?: Date) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    // The admin is served over TLS everywhere except `next dev` on localhost,
    // where a secure cookie would simply never be stored.
    secure: process.env.NODE_ENV === "production",
    path: "/",
    ...(expiresAt ? { expires: expiresAt } : {}),
  };
}
