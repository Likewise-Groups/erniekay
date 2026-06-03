"use client";

import { useState } from "react";
import Image from "next/image";

export default function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section className="bg-royal-navy py-[112px]">
      <div className="max-w-[1280px] mx-auto px-6 md:px-[64px] grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

        {/* Copy + form */}
        <div>
          <h2 className="font-[family-name:var(--font-eb-garamond)] text-[40px] md:text-[48px] leading-[48px] md:leading-[56px] tracking-[-0.01em] font-semibold text-white mb-6">
            Join The Ritual
          </h2>
          <p className="font-[family-name:var(--font-montserrat)] text-[16px] leading-[26px] text-on-primary-container mb-8">
            Receive exclusive access to new clinical launches, editorial styling guides, and bridal
            trend reports curated by Erniekay.
          </p>

          {submitted ? (
            <div className="flex items-center gap-3 py-4 border-b border-majestic-gold">
              <span className="material-symbols-outlined text-majestic-gold">check_circle</span>
              <p className="font-[family-name:var(--font-montserrat)] text-[14px] leading-[22px] text-majestic-gold font-semibold">
                You&apos;re on the list. Welcome to the ritual.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-4"
            >
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email Address"
                required
                className="flex-grow bg-transparent border-b border-champagne-taupe text-white py-3 focus:outline-none focus:border-majestic-gold transition-colors font-[family-name:var(--font-montserrat)] text-[16px] leading-[26px] placeholder:text-white/40"
              />
              <button
                type="submit"
                id="newsletter-subscribe"
                className="bg-majestic-gold text-royal-navy px-8 py-3 font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold hover:bg-white transition-colors active:scale-[0.98] shrink-0"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>

        {/* Editorial quote image */}
        <div className="relative h-[260px] md:h-[300px] border border-majestic-gold/20 flex items-center justify-center overflow-hidden">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6h5lcTuMzIiZe3vTj6srDrYevbci34CXyGjqLMrhyJAshLSpm7tWgrQb3j2oiP-aT68Q0ev6hgxSS7g1Kqsx5IrCe55QOlLVoJac7Ernh6Z3K7V_FuFxV82G7-J6LkKfM-dJ8uFrasUQKgpcICLW_zEBQsMX5ic5srm8m9CQd5ARfUoYuALfOW-veAOOE9JpFmv4mM3Q4KP-u-lcuNLKo-EwuHK85v-BRND5ghhECvB_UaUJQ8Ce_0-v6OwjRFLWVhlvroNLqRKo"
            alt="Close-up of luxurious beauty products being applied with warm editorial lighting"
            fill
            className="object-cover opacity-60"
            unoptimized
          />
          <div className="relative z-10 text-center p-8">
            <p className="font-[family-name:var(--font-eb-garamond)] text-[22px] md:text-[26px] leading-[32px] font-semibold text-majestic-gold italic">
              &ldquo;Beauty is a ritual, not a routine.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
