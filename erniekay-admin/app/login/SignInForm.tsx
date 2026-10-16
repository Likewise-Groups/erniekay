"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { signIn, type SignInState } from "./actions";

const initialState: SignInState = { error: null };

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-gold to-gold-soft px-4 py-3 text-sm font-bold text-brand transition-all duration-300 hover:shadow-lg hover:shadow-gold/20 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {/* Shimmer effect on hover */}
      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      <span className="relative">{pending ? "Signing in…" : "Sign in"}</span>
    </button>
  );
}

/**
 * The sign-in form.
 *
 * A client component only so the error can be shown without a full navigation
 * and the button can disable itself while the request is in flight — the
 * password check is deliberately slow (PBKDF2), so a form that looked inert for
 * a second would get double-submitted.
 */
export default function SignInForm({ next }: { next?: string }) {
  const [state, formAction] = useActionState(signIn, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="next" value={next ?? ""} />

      <div>
        <label htmlFor="email" className="mb-2 block text-xs font-semibold uppercase tracking-widest text-white/50">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          autoFocus
          className="w-full rounded-xl border border-white/[0.1] bg-white/[0.06] px-4 py-3 text-sm text-white outline-none transition-all duration-200 placeholder:text-white/20 focus:border-gold/50 focus:ring-2 focus:ring-gold/20"
          placeholder="you@erniekay.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block text-xs font-semibold uppercase tracking-widest text-white/50">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-xl border border-white/[0.1] bg-white/[0.06] px-4 py-3 text-sm text-white outline-none transition-all duration-200 placeholder:text-white/20 focus:border-gold/50 focus:ring-2 focus:ring-gold/20"
          placeholder="••••••••"
        />
      </div>

      {state.error ? (
        <p
          role="alert"
          className="flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300"
        >
          <span className="shrink-0 text-xs">✕</span>
          {state.error}
        </p>
      ) : null}

      <SubmitButton />
    </form>
  );
}
