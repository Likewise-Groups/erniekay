"use client";

import Link from "next/link";
import AdmissionsTopNav from "@/components/academy/AdmissionsTopNav";
import AdmissionsSideNav from "@/components/academy/AdmissionsSideNav";
import Footer from "@/components/Footer";

export default function AdmissionsProfessionalPage() {
  return (
    <div className="flex flex-col min-h-screen bg-alabaster-white">
      <AdmissionsTopNav />

      <div className="flex flex-grow">
        <AdmissionsSideNav currentStep="professional" />

        <main className="flex-grow bg-alabaster-white px-margin-mobile md:px-margin-desktop py-12">
          <section className="max-w-[900px]">
            <h1 className="font-display-lg text-display-lg text-royal-navy mb-4">
              Professional Background
            </h1>
            <p className="font-body-base text-body-base text-on-surface-variant leading-relaxed mb-12">
              Share your professional experience and what brought you to this
              academy. We want to understand your journey and aspirations.
            </p>

            <form className="space-y-8 max-w-2xl">
              <div>
                <label className="block font-label-caps text-label-caps text-royal-navy mb-2">
                  Current Role / Position
                </label>
                <input
                  type="text"
                  className="w-full border border-outline-variant p-3 font-body-base focus:outline-none focus:border-royal-navy"
                  placeholder="e.g., Makeup Artist, Beauty Entrepreneur"
                />
              </div>

              <div>
                <label className="block font-label-caps text-label-caps text-royal-navy mb-2">
                  Years of Experience in Beauty Industry
                </label>
                <select className="w-full border border-outline-variant p-3 font-body-base focus:outline-none focus:border-royal-navy">
                  <option>Select experience level</option>
                  <option>0-1 year</option>
                  <option>1-3 years</option>
                  <option>3-5 years</option>
                  <option>5+ years</option>
                </select>
              </div>

              <div>
                <label className="block font-label-caps text-label-caps text-royal-navy mb-2">
                  Primary Specialization
                </label>
                <select className="w-full border border-outline-variant p-3 font-body-base focus:outline-none focus:border-royal-navy">
                  <option>Select specialization</option>
                  <option>Hair</option>
                  <option>Makeup</option>
                  <option>Skincare</option>
                  <option>Nails</option>
                  <option>Mixed Services</option>
                </select>
              </div>

              <div>
                <label className="block font-label-caps text-label-caps text-royal-navy mb-2">
                  What motivated you to apply?
                </label>
                <textarea
                  rows={5}
                  className="w-full border border-outline-variant p-3 font-body-base focus:outline-none focus:border-royal-navy"
                  placeholder="Tell us about your motivation and goals..."
                />
              </div>

              <div>
                <label className="block font-label-caps text-label-caps text-royal-navy mb-2">
                  Portfolio or Work Examples (URL)
                </label>
                <input
                  type="url"
                  className="w-full border border-outline-variant p-3 font-body-base focus:outline-none focus:border-royal-navy"
                  placeholder="https://yourportfolio.com"
                />
              </div>

              <div className="border-t border-outline-variant pt-8 flex justify-between">
                <Link
                  href="/academy/admissions/personal"
                  className="flex items-center gap-2 text-on-surface-variant font-label-caps text-label-caps hover:text-royal-navy transition-all"
                >
                  <span className="material-symbols-outlined">
                    arrow_back
                  </span>
                  Back to Personal
                </Link>
                <Link
                  href="/academy/admissions/review"
                  className="bg-royal-navy text-white px-8 py-4 font-label-caps text-label-caps hover:opacity-90 active:scale-95 transition-all"
                >
                  Continue to Review
                </Link>
              </div>
            </form>
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
}
