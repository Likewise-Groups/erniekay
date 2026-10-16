import Link from "next/link";

import Nav from "@/components/Nav";
import { ExternalIcon, SignOutIcon } from "@/components/icons";
import { displayName, requireAdmin } from "@/lib/auth";

import { signOut } from "../login/actions";
import MobileMenuButton from "./MobileMenuButton";

/**
 * The shell every signed-in page renders inside.
 *
 * `requireAdmin()` here redirects an unauthenticated visitor once, rather than
 * each page repeating it — but it is NOT the security boundary. Layouts do not
 * run for server actions or route handlers, so each of those calls
 * `requireAdmin()` itself. This is the redirect, not the gate.
 */
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const initials =
    (displayName(user)?.[0] ?? user.email?.[0] ?? "A").toUpperCase();

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* ── Desktop sidebar ───────────────────────────────────────────────── */}
      <aside className="hidden bg-gradient-to-b from-brand via-brand to-brand-ink lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64 lg:shrink-0 lg:flex-col">
        <div className="flex flex-1 flex-col gap-5 p-5">
          {/* Brand */}
          <div className="mb-1">
            <Link href="/" className="group block">
              <span className="block font-heading text-base font-bold tracking-tight text-white transition-colors group-hover:text-gold">
                Erniekay Splendor
              </span>
              <span className="block text-[0.65rem] font-semibold uppercase tracking-widest text-gold/50">
                Administration
              </span>
            </Link>
            <div className="mt-3 h-px bg-gradient-to-r from-gold/30 via-gold/10 to-transparent" />
          </div>

          <Nav />

          {/* Bottom section */}
          <div className="mt-auto space-y-3">
            <div className="h-px bg-gradient-to-r from-white/[0.08] via-white/[0.04] to-transparent" />

            {siteUrl ? (
              <a
                href={siteUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs text-white/50 transition-all duration-200 hover:bg-white/[0.06] hover:text-white/80"
              >
                <ExternalIcon className="h-4 w-4 shrink-0" />
                <span>View public site</span>
              </a>
            ) : null}

            {/* User profile card */}
            <div className="rounded-xl bg-white/[0.06] px-3.5 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/20 text-xs font-bold text-gold">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-white/80" title={user.email}>
                    {displayName(user)}
                  </p>
                  <p className="text-[0.6rem] font-medium uppercase tracking-widest text-white/30">
                    {user.role}
                  </p>
                </div>
              </div>
            </div>

            <form action={signOut}>
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2.5 text-xs font-semibold text-white/50 transition-all duration-200 hover:border-white/[0.15] hover:bg-white/[0.08] hover:text-white/80"
              >
                <SignOutIcon className="h-4 w-4 shrink-0" />
                Sign out
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* ── Mobile top bar ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-brand/10 bg-brand px-4 py-3 lg:hidden">
        <Link href="/" className="block">
          <span className="block font-heading text-sm font-bold text-white">
            Erniekay Splendor
          </span>
          <span className="block text-[0.55rem] font-semibold uppercase tracking-widest text-gold/50">
            Admin
          </span>
        </Link>
        <MobileMenuButton user={user} siteUrl={siteUrl} />
      </header>

      <main className="min-w-0 flex-1 px-4 py-8 lg:px-10">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
