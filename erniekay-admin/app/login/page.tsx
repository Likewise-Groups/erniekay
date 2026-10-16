import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getAdminUser } from "@/lib/auth";

import SignInForm from "./SignInForm";

export const metadata: Metadata = { title: "Sign in · Erniekay Admin" };

// Reads the session cookie, so it can never be prerendered at build time.
export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  // Someone who is already signed in should not be looking at a sign-in form.
  if (await getAdminUser()) redirect("/");

  const { next } = await searchParams;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      {/* Animated gradient backdrop */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(135deg, #0d1336 0%, #1a2255 35%, #0d1336 65%, #070a1e 100%)",
          backgroundSize: "200% 200%",
          animation: "gradientShift 12s ease infinite",
        }}
      />

      {/* Decorative glow orbs */}
      <div className="absolute left-1/4 top-1/4 -z-10 h-72 w-72 rounded-full bg-gold/[0.06] blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-96 w-96 rounded-full bg-brand-soft/30 blur-3xl" />

      <div className="page-enter w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-heading text-2xl font-bold tracking-tight text-white">
            Erniekay Splendor
          </h1>
          <p className="mt-2 text-sm text-white/40">Staff administration</p>
          <div className="mx-auto mt-4 h-0.5 w-12 rounded-full bg-gradient-to-r from-gold to-gold-soft" />
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.06] p-7 shadow-2xl backdrop-blur-xl">
          <SignInForm next={next} />
        </div>

        <p className="mt-6 text-center text-xs text-white/25">
          Accounts are created by an administrator with{" "}
          <code className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-gold/50">
            npm run admin:create
          </code>
          .
        </p>
      </div>
    </main>
  );
}
