"use client";

import { useState } from "react";
import Link from "next/link";
import AdmissionsTopNav from "@/components/academy/AdmissionsTopNav";
import AdmissionsSideNav from "@/components/academy/AdmissionsSideNav";
import ProgramCard, { ProgramOption } from "@/components/academy/ProgramCard";
import BespokeInquireCard from "@/components/academy/BespokeInquireCard";
import Footer from "@/components/Footer";

const PROGRAM_OPTIONS: ProgramOption[] = [
  {
    id: "editorial-makeup",
    level: "MASTERCLASS LEVEL IV",
    title: "Editorial & Runway Artistry",
    duration: 12,
    certification: "Elite Certification",
    highlights: [
      "High-Definition Skin Finishes",
      "Avant-Garde Editorial Concepting",
      "Backstage Workflow & Lighting Dynamics",
    ],
    facultyLead: {
      name: "Prof. Julianna Vane",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAiWPdhC65Gf7RB1v53ItowkvLXdMNgeeXwlmJe6b_8u1QcVH3UIIDqOohR4OFwh8XoNWjfja2v0zbdOSsIrBRVVbDb6kO_wMlcWTkztP7RUKwQihX9D_iCyr3vreOY4od-ODO_MgX2v8SIdoXlhysPv3pBzSMwYRkWiQTjaKzV2SdGnZpMJ-eOV9XOBd5ftMfRNMHkYS14IbnbZgyQVmM59WfPMSWUsPh1limeXhOXpL-x8yDvbHhDt8mJ1HZEqfo8ahnMGZ6lQwA",
      imageAlt:
        "A professional portrait of a female faculty lead with elegant styling, wearing a structured navy blazer in a high-end photography studio setting.",
    },
    isFeatured: false,
  },
  {
    id: "bridal-mastery",
    level: "DIPLOMA LEVEL V",
    title: "Bespoke Bridal Mastery",
    duration: 16,
    certification: "Global Accreditation",
    highlights: [
      "Cultural Bridal Rituals & Aesthetics",
      "Long-Wear Technical Application",
      "Luxury Client Management & Branding",
    ],
    facultyLead: {
      name: "Marcus Aurelius Thorne",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAo1F4fl8SY7jQzXFlaFZf7qUViOLuclav_TMHwPbeC-YZ2ocR8L8KWdxzVHjlwS6GcsHeKhKFftgBe79ds7qODmOziZ8xKyHijM9Gkht952-Ivs5Ad1lg-YHco5pGSwbJ37vnnlvsyTZDEsXcGPLqWTQ4s1TfEbvj4he_D70N9fv8GiijLIgEc2nZcKQ7xgi4SxWL8PzwP4gVtstQylN8z7Pwn3rBPvnmh7wVaFfmjkGR_HtgQy5VrC2dfvVYjZoeeQOzUPHafT6E",
      imageAlt:
        "A focused studio portrait of a male beauty industry expert and educator with a clean, professional aesthetic.",
    },
    isFeatured: true,
    badge: "MOST PRESTIGIOUS",
  },
  {
    id: "salon-management",
    level: "EXECUTIVE LEVEL VI",
    title: "Salon Business & Management",
    duration: 24,
    certification: "Executive MBA Credit",
    highlights: [
      "Fiscal Strategy & Inventory Logistics",
      "High-Performance Team Leadership",
      "Digital Marketing for Luxury Spaces",
    ],
    facultyLead: {
      name: "Helena Blackwell",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDe8aNc2LfAwcobFvKe8J0YtDlPuug5nkALrGp-aPvbot5wNaPrSHJF8JamXNWLKFa6p8eQbuzX10X0GT_1KEPWyGDZ-3A1iO1jyo0Ouuj1HQ-qerRcErVMRWHesD_IIFN6AbmfGBa0tcm_mZ8Y-8KJXarJGNagX0n1Jn4SXz8INuTQ167TUgFaQcDtWz2Z7iW-1GzFXK4Bbds2-aRWS36oOu9OUJHsOHb9eAg_VD2ySqWEi0P2VBUN-TO9__g7sjl_k_ueLyXsBm0",
      imageAlt:
        "A portrait of a sophisticated female executive in a minimalist architectural office setting.",
    },
    isFeatured: false,
  },
];

export default function AdmissionsSelectionPage() {
  const [selectedProgram, setSelectedProgram] = useState<string>(
    "bridal-mastery"
  );
  const [showInquireModal, setShowInquireModal] = useState(false);

  const handleInquire = () => {
    setShowInquireModal(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-alabaster-white">
      <AdmissionsTopNav />

      <div className="flex flex-grow">
        <AdmissionsSideNav currentStep="selection" />

        <main className="flex-grow bg-alabaster-white px-margin-mobile md:px-margin-desktop py-12">
          {/* Header Section */}
          <section className="max-w-[900px] mb-12">
            <h1 className="font-display-lg text-display-lg text-royal-navy mb-4">
              Choose Your Path to Mastery
            </h1>
            <p className="font-body-base text-body-base text-on-surface-variant leading-relaxed">
              Select the specialization that aligns with your professional
              aspirations. Each curriculum is designed by industry titans to
              transform technical skill into artistic excellence.
            </p>
          </section>

          {/* Program Selection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {PROGRAM_OPTIONS.map((program) => (
              <ProgramCard
                key={program.id}
                program={program}
                isSelected={selectedProgram === program.id}
                onSelect={setSelectedProgram}
              />
            ))}

            {/* Custom Inquire Card */}
            <BespokeInquireCard onInquire={handleInquire} />
          </div>

          {/* Action Area */}
          <div className="flex justify-between items-center border-t border-outline-variant pt-12">
            <button className="flex items-center gap-2 text-on-surface-variant font-label-caps text-label-caps hover:text-royal-navy transition-all">
              <span className="material-symbols-outlined">arrow_back</span>
              Back to Overview
            </button>
            <div className="flex gap-4">
              <Link
                href="/academy/admissions/personal"
                className="bg-royal-navy text-white px-8 py-4 font-label-caps text-label-caps hover:opacity-90 active:scale-95 transition-all inline-block"
              >
                Continue to Personal Info
              </Link>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />

      {/* Inquire Modal */}
      {showInquireModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl max-w-md w-full mx-4">
            <h2 className="font-headline-md text-headline-md text-royal-navy mb-4">
              Bespoke Curriculum Inquiry
            </h2>
            <p className="text-on-surface-variant mb-6">
              A member of our academic board will contact you within 24 hours to
              discuss your unique program requirements.
            </p>
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Your email"
                className="w-full border border-outline-variant p-3 font-body-base focus:outline-none focus:border-royal-navy"
              />
              <textarea
                placeholder="Tell us about your vision..."
                rows={4}
                className="w-full border border-outline-variant p-3 font-body-base focus:outline-none focus:border-royal-navy"
              />
              <div className="flex gap-4">
                <button
                  onClick={() => setShowInquireModal(false)}
                  className="flex-1 border border-royal-navy text-royal-navy py-3 font-label-caps text-label-caps hover:bg-royal-navy hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowInquireModal(false);
                    alert("Inquiry submitted! We'll be in touch soon.");
                  }}
                  className="flex-1 bg-royal-navy text-white py-3 font-label-caps text-label-caps hover:opacity-90 transition-all"
                >
                  Submit Inquiry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
