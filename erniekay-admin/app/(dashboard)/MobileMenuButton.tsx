"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";

import Nav from "@/components/Nav";
import { ExternalIcon, SignOutIcon } from "@/components/icons";

import { signOut } from "../login/actions";

/**
 * Mobile hamburger + slide-in drawer.
 *
 * Client component so we can toggle the drawer open/closed and trap focus.
 * The sign-out action is imported directly since this is already a client
 * component anyway.
 */
export default function MobileMenuButton({
  user,
  siteUrl,
}: {
  user: { email: string; role: string; firstName?: string | null; lastName?: string | null };
  siteUrl?: string;
}) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  /* Close on Escape */
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, close]);

  /* Lock body scroll when open */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  const displayName =
    user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.email;
  const initials = (displayName[0] ?? "A").toUpperCase();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-white/80 transition hover:bg-white/10 hover:text-white"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 5h14M3 10h14M3 15h14" />
        </svg>
      </button>

      {/* Backdrop */}
      {open ? (
        <div
          className="fixed inset-0 z-50 bg-brand-ink/60 backdrop-blur-sm"
          onClick={close}
          aria-hidden
        />
      ) : null}

      {/* Drawer */}
      <div
        className={`fixed left-0 top-0 z-50 flex h-full w-72 flex-col bg-gradient-to-b from-brand via-brand to-brand-ink p-5 shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={close}
          aria-label="Close menu"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg text-white/50 transition hover:bg-white/10 hover:text-white"
        >
          ✕
        </button>

        <div className="mb-6">
          <Link href="/" onClick={close} className="block">
            <span className="block font-heading text-base font-bold text-white">
              Erniekay Splendor
            </span>
            <span className="block text-[0.6rem] font-semibold uppercase tracking-widest text-gold/50">
              Administration
            </span>
          </Link>
          <div className="mt-3 h-px bg-gradient-to-r from-gold/30 via-gold/10 to-transparent" />
        </div>

        <Nav onClose={close} />

        <div className="mt-auto space-y-3">
          <div className="h-px bg-gradient-to-r from-white/[0.08] via-white/[0.04] to-transparent" />

          {siteUrl ? (
            <a
              href={siteUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs text-white/50 transition hover:bg-white/[0.06] hover:text-white/80"
            >
              <ExternalIcon className="h-4 w-4 shrink-0" />
              <span>View public site</span>
            </a>
          ) : null}

          <div className="rounded-xl bg-white/[0.06] px-3.5 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/20 text-xs font-bold text-gold">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-white/80">
                  {displayName}
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
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2.5 text-xs font-semibold text-white/50 transition hover:border-white/[0.15] hover:bg-white/[0.08] hover:text-white/80"
            >
              <SignOutIcon className="h-4 w-4 shrink-0" />
              Sign out
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
