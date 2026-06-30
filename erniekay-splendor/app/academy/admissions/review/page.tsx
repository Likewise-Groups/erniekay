"use client";

import Link from "next/link";
import AdmissionsTopNav from "@/components/academy/AdmissionsTopNav";
import AdmissionsSideNav from "@/components/academy/AdmissionsSideNav";
import Footer from "@/components/Footer";
import { submitAdmission } from "@/app/actions/admissions";

export default function AdmissionsReviewPage() {
  return (
    <div className="flex flex-col min-h-screen bg-alabaster-white">
      <AdmissionsTopNav />

      <div className="flex flex-grow">
        <AdmissionsSideNav currentStep="review" />

        <main className="flex-grow bg-alabaster-white px-margin-mobile md:px-margin-desktop py-12">
          <section className="max-w-[900px]">
            <h1 className="font-display-lg text-display-lg text-royal-navy mb-4">
              Review Your Application
            </h1>
            <p className="font-body-base text-body-base text-on-surface-variant leading-relaxed mb-12">
              Please review your information before submitting. You can go back
              to any section to make changes.
            </p>

            <div className="space-y-8">
              {/* Program Selection Section */}
              <div className="border border-outline-variant p-8 bg-white">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-headline-md text-headline-md text-royal-navy">
                    Selected Program
                  </h3>
                  <Link
                    href="/academy/admissions/selection"
                    className="text-royal-navy hover:text-majestic-gold font-label-caps text-label-caps transition-colors"
                  >
                    Edit
                  </Link>
                </div>
                <p className="text-on-surface-variant">
                  Bespoke Bridal Mastery - DIPLOMA LEVEL V (16 Weeks)
                </p>
              </div>

              {/* Personal Information Section */}
              <div className="border border-outline-variant p-8 bg-white">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-headline-md text-headline-md text-royal-navy">
                    Personal Information
                  </h3>
                  <Link
                    href="/academy/admissions/personal"
                    className="text-royal-navy hover:text-majestic-gold font-label-caps text-label-caps transition-colors"
                  >
                    Edit
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-4 text-on-surface-variant">
                  <div>
                    <p className="font-label-caps text-label-caps text-royal-navy mb-1">
                      First Name
                    </p>
                    <p>John</p>
                  </div>
                  <div>
                    <p className="font-label-caps text-label-caps text-royal-navy mb-1">
                      Last Name
                    </p>
                    <p>Doe</p>
                  </div>
                  <div>
                    <p className="font-label-caps text-label-caps text-royal-navy mb-1">
                      Email
                    </p>
                    <p>john@example.com</p>
                  </div>
                  <div>
                    <p className="font-label-caps text-label-caps text-royal-navy mb-1">
                      Phone
                    </p>
                    <p>+1 (555) 000-0000</p>
                  </div>
                </div>
              </div>

              {/* Professional Background Section */}
              <div className="border border-outline-variant p-8 bg-white">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-headline-md text-headline-md text-royal-navy">
                    Professional Background
                  </h3>
                  <Link
                    href="/academy/admissions/professional"
                    className="text-royal-navy hover:text-majestic-gold font-label-caps text-label-caps transition-colors"
                  >
                    Edit
                  </Link>
                </div>
                <div className="space-y-4 text-on-surface-variant">
                  <div>
                    <p className="font-label-caps text-label-caps text-royal-navy mb-1">
                      Current Role
                    </p>
                    <p>Professional Makeup Artist</p>
                  </div>
                  <div>
                    <p className="font-label-caps text-label-caps text-royal-navy mb-1">
                      Experience
                    </p>
                    <p>5+ years</p>
                  </div>
                  <div>
                    <p className="font-label-caps text-label-caps text-royal-navy mb-1">
                      Specialization
                    </p>
                    <p>Makeup</p>
                  </div>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="border border-outline-variant p-8 bg-white">
                <label className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    className="mt-1 w-5 h-5 border-outline-variant text-royal-navy focus:ring-majestic-gold"
                  />
                  <div>
                    <p className="font-body-base text-body-base text-on-surface-variant">
                      I have reviewed all information and agree to the academy's{" "}
                      <Link
                        href="#"
                        className="text-royal-navy hover:underline"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="#"
                        className="text-royal-navy hover:underline"
                      >
                        Privacy Policy
                      </Link>
                      .
                    </p>
                  </div>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-outline-variant pt-8 flex justify-between">
                <Link
                  href="/academy/admissions/professional"
                  className="flex items-center gap-2 text-on-surface-variant font-label-caps text-label-caps hover:text-royal-navy transition-all"
                >
                  <span className="material-symbols-outlined">
                    arrow_back
                  </span>
                  Back to Professional
                </Link>
                <button
                  onClick={async () => {
                    const res = await submitAdmission({
                      programId: "bridal-mastery",
                      firstName: "John",
                      lastName: "Doe",
                      email: "john@example.com",
                      phone: "+1 (555) 000-0000",
                      experience: "5+ years",
                    });
                    if (res.success) {
                      alert("Application submitted successfully!");
                    } else {
                      alert(res.error);
                    }
                  }}
                  className="bg-royal-navy text-white px-8 py-4 font-label-caps text-label-caps hover:opacity-90 active:scale-95 transition-all"
                >
                  Submit Application
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
}
