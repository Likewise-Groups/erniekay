import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { getDb, users } from "./db";
import { readSessionToken, SESSION_COOKIE } from "./session";

/**
 * Who is signed in, resolved from the cookie AND the database on every request.
 *
 * The database read is the point. The cookie proves identity; the role that
 * decides what may be done is read fresh, so demoting or deleting a staff
 * account takes effect on their next request rather than whenever their token
 * happens to expire.
 */

export const ADMIN_ROLES = ["ADMIN", "STAFF"] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

export type AdminUser = {
  id: string;
  email: string;
  role: AdminRole;
  firstName: string | null;
  lastName: string | null;
};

export const isAdminRole = (role: string | null | undefined): role is AdminRole =>
  ADMIN_ROLES.includes(role as AdminRole);

/** The name to show in the UI and record in the audit trail. */
export const displayName = (user: {
  firstName: string | null;
  lastName: string | null;
  email: string;
}): string => [user.firstName, user.lastName].filter(Boolean).join(" ").trim() || user.email;

/**
 * Returns the signed-in admin, or null. Never redirects — use it for the pages
 * that must render either way (the sign-in screen, the root layout's header).
 */
export async function getAdminUser(): Promise<AdminUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const payload = await readSessionToken(token);
  if (!payload) return null;

  const [row] = await getDb()
    .select({
      id: users.id,
      email: users.email,
      role: users.role,
      firstName: users.firstName,
      lastName: users.lastName,
    })
    .from(users)
    .where(eq(users.id, payload.uid))
    .limit(1);

  if (!row || !isAdminRole(row.role)) return null;

  return { ...row, role: row.role };
}

/**
 * The gate. Every page, server action and route handler behind the sign-in
 * calls this first.
 *
 * Not delegated to middleware on purpose: middleware can only check the
 * cookie's signature, and a layout check does not cover server actions or route
 * handlers at all — those are separately addressable endpoints, so an action
 * that trusted its layout would be callable by anyone with the URL.
 */
export async function requireAdmin(): Promise<AdminUser> {
  const user = await getAdminUser();
  if (!user) redirect("/login");
  return user;
}

/**
 * Same gate for route handlers, which must answer with a status rather than a
 * redirect — a 302 to an HTML sign-in page in response to `fetch()` is a
 * confusing thing to debug on the client.
 */
export async function requireAdminApi(): Promise<AdminUser | Response> {
  const user = await getAdminUser();
  if (!user) {
    return Response.json({ error: "Not signed in." }, { status: 401 });
  }
  return user;
}
