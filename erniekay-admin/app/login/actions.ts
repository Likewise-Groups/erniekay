"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { sql } from "drizzle-orm";

import { displayName, getAdminUser, isAdminRole } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { getDb, users } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { clearRateLimit, clientIp, rateLimit } from "@/lib/rateLimit";
import {
  createSessionToken,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/session";

export type SignInState = { error: string | null };

/** Five attempts per account and twenty per source, each per ten minutes. */
const EMAIL_LIMIT = 5;
const IP_LIMIT = 20;
const WINDOW_SECONDS = 600;

/**
 * The same message for "no such user", "wrong password" and "not an admin".
 *
 * Distinguishing them turns the sign-in form into a way to enumerate which
 * addresses have staff accounts.
 */
const GENERIC_FAILURE = "Email or password is incorrect.";

export async function signIn(
  _previous: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const ip = clientIp(await headers());
  const perIp = rateLimit(`ip:${ip}`, IP_LIMIT, WINDOW_SECONDS);
  const perEmail = rateLimit(`email:${email}`, EMAIL_LIMIT, WINDOW_SECONDS);

  if (!perIp.allowed || !perEmail.allowed) {
    const wait = Math.max(
      perIp.allowed ? 0 : perIp.retryAfterSeconds,
      perEmail.allowed ? 0 : perEmail.retryAfterSeconds,
    );
    return {
      error: `Too many sign-in attempts. Try again in ${Math.ceil(wait / 60)} minute(s).`,
    };
  }

  const db = getDb();
  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      role: users.role,
      firstName: users.firstName,
      lastName: users.lastName,
      passwordHash: users.passwordHash,
    })
    .from(users)
    // Emails were stored as typed, so a staff member who registered as
    // "Ama@…" must still be able to sign in as "ama@…".
    .where(sql`lower(${users.email}) = ${email}`)
    .limit(1);

  // Verify even when there is no such user, against a hash that cannot match.
  // Returning early instead would answer "unknown email" measurably faster than
  // "wrong password", which is the enumeration the generic message prevents.
  const ok = await verifyPassword(password, user?.passwordHash ?? null);

  if (!user || !ok || !isAdminRole(user.role)) {
    await recordAudit(
      { id: user?.id ?? null, email },
      {
        entity: "auth",
        entityId: user?.id ?? null,
        action: "sign-in failed",
        detail: !user
          ? "no such account"
          : !ok
            ? "wrong password"
            : `role ${user.role} is not permitted`,
      },
    );
    return { error: GENERIC_FAILURE };
  }

  clearRateLimit(`email:${email}`);

  const { token, expiresAt } = await createSessionToken(user);
  (await cookies()).set(SESSION_COOKIE, token, sessionCookieOptions(expiresAt));

  await recordAudit(user, {
    entity: "auth",
    entityId: user.id,
    action: "signed in",
    detail: displayName(user),
  });

  // Only relative paths, and never back to /login. An attacker-supplied `next`
  // is otherwise an open redirect straight off the sign-in page.
  const destination = /^\/(?!\/|login\b)[\w\-/?=&.]*$/.test(next) ? next : "/";
  redirect(destination);
}

export async function signOut(): Promise<void> {
  const user = await getAdminUser();

  if (user) {
    await recordAudit(user, { entity: "auth", entityId: user.id, action: "signed out" });
  }

  // Cleared with the same attributes it was set with — a cookie deleted with a
  // different path or sameSite is not the same cookie and simply stays.
  (await cookies()).set(SESSION_COOKIE, "", { ...sessionCookieOptions(), maxAge: 0 });

  redirect("/login");
}
