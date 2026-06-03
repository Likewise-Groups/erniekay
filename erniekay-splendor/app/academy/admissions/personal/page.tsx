"use client";

import Link from "next/link";
import AdmissionsTopNav from "@/components/academy/AdmissionsTopNav";
import AdmissionsSideNav from "@/components/academy/AdmissionsSideNav";
import Footer from "@/components/Footer";

export default function AdmissionsPersonalPage() {
  return (
    <div className="flex flex-col min-h-screen bg-alabaster-white">
      <AdmissionsTopNav />

      <div className="flex flex-grow">
        <AdmissionsSideNav currentStep="personal" />

        <main className="flex-grow bg-alabaster-white px-margin-mobile md:px-margin-desktop py-12">
          <section className="max-w-[900px]">
            <h1 className="font-display-lg text-display-lg text-royal-navy mb-4">
              Personal Information
            </h1>
            <p className="font-body-base text-body-base text-on-surface-variant leading-relaxed mb-12">
              Tell us about yourself. This information helps our admissions
              team understand your background and goals.
            </p>

            <form className="space-y-8 max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-label-caps text-label-caps text-royal-navy mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full border border-outline-variant p-3 font-body-base focus:outline-none focus:border-royal-navy"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label className="block font-label-caps text-label-caps text-royal-navy mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full border border-outline-variant p-3 font-body-base focus:outline-none focus:border-royal-navy"
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div>
                <label className="block font-label-caps text-label-caps text-royal-navy mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full border border-outline-variant p-3 font-body-base focus:outline-none focus:border-royal-navy"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block font-label-caps text-label-caps text-royal-navy mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="w-full border border-outline-variant p-3 font-body-base focus:outline-none focus:border-royal-navy"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div>
                <label className="block font-label-caps text-label-caps text-royal-navy mb-2">
                  Location
                </label>
                <input
                  type="text"
                  className="w-full border border-outline-variant p-3 font-body-base focus:outline-none focus:border-royal-navy"
                  placeholder="City, Country"
                />
              </div>

              <div className="border-t border-outline-variant pt-8 flex justify-between">
                <Link
                  href="/academy/admissions/selection"
                  className="flex items-center gap-2 text-on-surface-variant font-label-caps text-label-caps hover:text-royal-navy transition-all"
                >
                  <span className="material-symbols-outlined">
                    arrow_back
                  </span>
                  Back to Selection
                </Link>
                <Link
                  href="/academy/admissions/professional"
                  className="bg-royal-navy text-white px-8 py-4 font-label-caps text-label-caps hover:opacity-90 active:scale-95 transition-all"
                >
                  Continue to Professional
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
