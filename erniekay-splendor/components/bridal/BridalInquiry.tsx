"use client";

import { useState } from "react";

const PACKAGES = ["Civil Elegance", "Traditional Splendor", "The White Wedding"] as const;
type Package = (typeof PACKAGES)[number];

const PARTY_SIZES = [
  "Bride Only",
  "Bride + 2-4 others",
  "Bride + 5-8 others",
  "Large Party (9+)",
];

const steps = [
  {
    n: 1,
    title: "Wedding Details",
    subtitle: "Share the logistics of your celebration.",
    active: true,
  },
  {
    n: 2,
    title: "Styling Preferences",
    subtitle: "Define your aesthetic and inspirations.",
    active: false,
  },
  {
    n: 3,
    title: "Consultation",
    subtitle: "Secure your date with our lead artist.",
    active: false,
  },
];

export default function BridalInquiry() {
  const [selectedPkg, setSelectedPkg] = useState<Package>("Civil Elegance");

  return (
    <section className="py-[112px] bg-primary text-white overflow-hidden relative">
      {/* Decorative grid lines */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="grid grid-cols-12 h-full">
          {Array.from({ length: 11 }).map((_, i) => (
            <div key={i} className="col-span-1 border-r border-white" />
          ))}
          <div className="col-span-1" />
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 md:px-[64px] relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">

          {/* Left — step tracker */}
          <div className="lg:w-1/3">
            <h2 className="font-[family-name:var(--font-eb-garamond)] text-[36px] md:text-[42px] leading-tight font-semibold mb-6">
              Begin Your Journey
            </h2>
            <p className="font-[family-name:var(--font-montserrat)] text-[16px] leading-[26px] text-on-primary-container mb-8">
              Personalized service starts with understanding your vision. Complete our detailed
              inquiry for a bespoke proposal.
            </p>

            <div className="space-y-10 md:space-y-12">
              {steps.map((step) => (
                <div key={step.n} className="flex items-start gap-6">
                  <div
                    className={`w-10 h-10 rounded-full border flex items-center justify-center font-[family-name:var(--font-montserrat)] font-semibold flex-shrink-0 transition-colors ${
                      step.active
                        ? "border-majestic-gold text-majestic-gold"
                        : "border-white/20 text-white/40"
                    }`}
                  >
                    {step.n}
                  </div>
                  <div>
                    <h4
                      className={`font-[family-name:var(--font-montserrat)] text-[16px] leading-[26px] font-semibold ${
                        step.active ? "text-white" : "text-white/40"
                      }`}
                    >
                      {step.title}
                    </h4>
                    <p className="font-[family-name:var(--font-montserrat)] text-[14px] leading-[22px] text-on-primary-container">
                      {step.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div className="lg:w-2/3 bg-white p-8 md:p-12 text-primary">
            <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
              {/* Grid inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                <div className="flex flex-col gap-2">
                  <label className="font-[family-name:var(--font-montserrat)] text-[11px] leading-[16px] tracking-[0.15em] uppercase font-bold text-champagne-taupe">
                    Full Name
                  </label>
                  <input
                    className="line-input"
                    type="text"
                    placeholder="Alexandra Smith"
                    id="inquiry-name"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-[family-name:var(--font-montserrat)] text-[11px] leading-[16px] tracking-[0.15em] uppercase font-bold text-champagne-taupe">
                    Wedding Date
                  </label>
                  <input className="line-input" type="date" id="inquiry-date" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-[family-name:var(--font-montserrat)] text-[11px] leading-[16px] tracking-[0.15em] uppercase font-bold text-champagne-taupe">
                    Location
                  </label>
                  <input
                    className="line-input"
                    type="text"
                    placeholder="City, Venue"
                    id="inquiry-location"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-[family-name:var(--font-montserrat)] text-[11px] leading-[16px] tracking-[0.15em] uppercase font-bold text-champagne-taupe">
                    Bridal Party Size
                  </label>
                  <select className="line-input" id="inquiry-party-size">
                    {PARTY_SIZES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Package preference */}
              <div className="flex flex-col gap-2">
                <label className="font-[family-name:var(--font-montserrat)] text-[11px] leading-[16px] tracking-[0.15em] uppercase font-bold text-champagne-taupe">
                  Package Preference
                </label>
                <div className="flex flex-wrap gap-4 pt-4">
                  {PACKAGES.map((pkg) => (
                    <button
                      key={pkg}
                      type="button"
                      id={`pkg-select-${pkg.toLowerCase().replace(/\s+/g, "-")}`}
                      onClick={() => setSelectedPkg(pkg)}
                      className={`px-6 py-2 font-[family-name:var(--font-montserrat)] text-[10px] leading-[16px] tracking-[0.15em] uppercase font-bold transition-all active:scale-95 ${
                        selectedPkg === pkg
                          ? "border border-majestic-gold text-majestic-gold"
                          : "border border-outline text-on-surface-variant hover:border-royal-navy"
                      }`}
                    >
                      {pkg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer row */}
              <div className="pt-8 border-t border-outline-variant flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <p className="font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] text-on-surface-variant italic">
                  Next: Styling Preferences
                </p>
                <button
                  type="submit"
                  id="inquiry-submit"
                  className="bg-royal-navy text-white font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold px-10 md:px-12 py-4 flex items-center gap-4 hover:bg-majestic-gold hover:text-royal-navy transition-all active:scale-95"
                >
                  Continue Step 2
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
