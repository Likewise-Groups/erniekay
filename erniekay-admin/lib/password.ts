/**
 * Password hashing for admin accounts.
 *
 * PBKDF2-SHA256 over Web Crypto rather than bcrypt/argon2: those are native
 * addons, and this app has to hash in three places — the Next server, the
 * `admin:create` script, and (for verification) anywhere a session is
 * established. Web Crypto is present in all of them with no dependency and no
 * build step. PBKDF2 is weaker per-guess than argon2id, which is acceptable
 * for a handful of staff accounts behind a rate-limited sign-in, and the
 * stored format carries its parameters so it can be upgraded later without
 * invalidating existing hashes.
 *
 * Stored format:  pbkdf2$sha256$<iterations>$<salt-b64url>$<hash-b64url>
 */

const ALGORITHM = "pbkdf2";
const DIGEST = "sha256";
const ITERATIONS = 210_000; // OWASP 2023 guidance for PBKDF2-HMAC-SHA256.
const SALT_BYTES = 16;
const KEY_BITS = 256;

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

async function derive(
  password: string,
  salt: Uint8Array,
  iterations: number,
): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );

  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: salt as BufferSource, iterations, hash: "SHA-256" },
    key,
    KEY_BITS,
  );

  return new Uint8Array(bits);
}

/** Constant-time comparison — a length-sensitive `===` leaks the hash by timing. */
function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a[i] ^ b[i];
  return diff === 0;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const hash = await derive(password, salt, ITERATIONS);
  return [ALGORITHM, DIGEST, ITERATIONS, toBase64Url(salt), toBase64Url(hash)].join("$");
}

/**
 * Checks a password against a stored hash.
 *
 * Returns false — never throws — for a malformed or foreign hash (a leftover
 * bcrypt string from the Prisma era, say). Nothing has ever written to
 * User.passwordHash in production, so there is no legacy format to support;
 * such an account simply cannot sign in until `admin:create` resets it.
 */
export async function verifyPassword(
  password: string,
  stored: string | null | undefined,
): Promise<boolean> {
  if (!stored) return false;

  const parts = stored.split("$");
  if (parts.length !== 5) return false;

  const [algorithm, digest, iterationsRaw, saltRaw, hashRaw] = parts;
  if (algorithm !== ALGORITHM || digest !== DIGEST) return false;

  const iterations = Number(iterationsRaw);
  if (!Number.isInteger(iterations) || iterations < 1 || iterations > 5_000_000) return false;

  try {
    const expected = fromBase64Url(hashRaw);
    const actual = await derive(password, fromBase64Url(saltRaw), iterations);
    return timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

/**
 * The rule enforced at both ends: `admin:create` and any future change-password
 * screen. Length only — composition rules push people toward "Password1!".
 */
export function passwordProblem(password: string): string | null {
  if (password.length < 12) return "Password must be at least 12 characters.";
  if (password.length > 200) return "Password must be at most 200 characters.";
  return null;
}
