/**
 * The Erniekay School of Beauty Arts site. The academy used to live here under
 * /academy; it is now its own app (the erniekay-academy repo).
 *
 * Unset until the academy has an address: every academy link on this site is
 * hidden rather than pointing somewhere broken. Set NEXT_PUBLIC_ACADEMY_URL
 * (no trailing slash) and the links, and the redirect from old /academy URLs in
 * next.config.ts, come back. NEXT_PUBLIC_ so it is inlined for client components.
 */
export const ACADEMY_URL = process.env.NEXT_PUBLIC_ACADEMY_URL?.trim().replace(/\/+$/, "") || null;

/** Drops links whose `href` is null, i.e. academy links while ACADEMY_URL is unset. */
export const withHref = <T extends { href: string | null }>(links: T[]) =>
  links.filter((link): link is T & { href: string } => link.href !== null);
