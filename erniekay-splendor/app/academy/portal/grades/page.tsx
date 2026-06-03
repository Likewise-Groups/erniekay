"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface GradeItem {
  code: string;
  name: string;
  instructor: string;
  semester: string;
  grade: string;
  credits: string;
  status: "Distinction" | "Pass";
}

const gradesData: GradeItem[] = [
  {
    code: "EKS-401",
    name: "Advanced Color Correction",
    instructor: "Dr. Elena K. Splendor",
    semester: "Fall 2024",
    grade: "A+",
    credits: "4.0 CR",
    status: "Distinction",
  },
  {
    code: "EKS-322",
    name: "Skin Biology & Chemistry",
    instructor: "Prof. Julian Vane",
    semester: "Fall 2024",
    grade: "A",
    credits: "3.5 CR",
    status: "Pass",
  },
  {
    code: "EKS-205",
    name: "Editorial Hair Design",
    instructor: "Dean Marcus Thorne",
    semester: "Spring 2024",
    grade: "A-",
    credits: "3.0 CR",
    status: "Distinction",
  },
  {
    code: "EKS-210",
    name: "Chemistry of Skincare",
    instructor: "Dr. S. Harrison",
    semester: "Spring 2024",
    grade: "A+",
    credits: "4.0 CR",
    status: "Distinction",
  },
];

const certsData = [
  {
    id: "cert-1",
    title: "Master Bridal Stylist",
    date: "OCT 2023",
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuDBj2kOZxL4KCXbrikfjKU7gNvIy24Hrh4dhEZucG24D9wslw5opZ1T1V7APbwRkYULDnmdfHg3NaG0NwsqMms0ZWSCa52u2LvuCnZP7RFNueHg7UGmoD7w8GV8-wYV5_VnuRXoDCzWkFP7JhsE7YLJhMSGkXQLrnncfiqXZSDVwR03QXgKH2Sx2GA7pi89q4LRhbjmaAlB8HHKVu5vyCJmbZCZ5RR296wVGOT0jp99FFGmrxKzpKi6CNFIkmZefvLI67U_zvKfRRc",
    alt: "Premium, gold-embossed academic certificate sitting on a dark navy velvet surface.",
  },
  {
    id: "cert-2",
    title: "Advanced Airbrush Art",
    date: "JAN 2024",
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuD5YyHiNbkhwYHNYXFiiH1pWfz0fU8A10KBL_VqcgNoWM3CcsPqGa2EI6oUy0bCpEvwqk48mHXyWhtAUkAQ3d9yxMQmHzY_GFGHUbj1rTUK7-4fSwnifoA0OYkfwk8JqTtIW9kE1cKT35pcEhKEOH8tCK77Ae0X6810RR8oJcCxWmAgrNRru-f23S1bqmv3doarZIaMOJwKyJgtMdCsxMwdtHHTXfpCO41kIRjiglhQkXs3TdzV7dg7GbUefIYAa4ef2NQ7ePBNeIM",
    alt: "Elegant gold digital badge icon displayed on a sleek, dark glass screen.",
  },
  {
    id: "cert-3",
    title: "Luxury Business Ethics",
    date: "MAR 2024",
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuDyLUyDEzMtl6yOTf2jVUc6xCp3F_e5r5bH22zq_iaw2jRlxZpdD-GebEhfVpgAzgxNcRATmpd4Ef2rWnN9wy0LUrf4rR1iMDzIjI7M190ZRDlpoyVnQaZJ966ZhcSlyIqaSh6feXZgEixPgl0t0QBBwWaLtHwRgkthvCQt3_oW5k_KOvuDFzqN_OfxC_a7qNHty9B0v_JGeko5QcYfqCIH-tC7x0OM243Ji0X57Kn0MS9uIajoA0IsAthBc7sotjxGF-2toaM_JO0",
    alt: "Overhead view of a luxury embossed envelope and gold fountain pen.",
  },
];

export default function GradesPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sidebarLinks = [
    { label: "Dashboard", href: "/academy/portal/dashboard", icon: "dashboard" },
    { label: "Course Catalog", href: "/academy/portal/courses", icon: "auto_stories" },
    { label: "Schedule", href: "#", icon: "calendar_month" },
    { label: "Grades", href: "/academy/portal/grades", icon: "grade", active: true },
    { label: "Profile", href: "/academy/portal/profile", icon: "person" },
  ];

  const handleRequestTranscript = () => {
    alert("Official academic transcript request submitted. Our admissions registrar will reach out to you shortly.");
  };

  return (
    <div className="bg-alabaster-white text-on-surface font-[family-name:var(--font-montserrat)] min-h-screen">
      
      {/* ── DESKTOP SideNavBar Shell ── */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-royal-navy hidden md:flex flex-col py-8 px-6 border-r border-majestic-gold/20 z-50 text-white">
        {/* Brand Header */}
        <div className="mb-12">
          <h1 className="font-[family-name:var(--font-eb-garamond)] text-[28px] font-semibold text-majestic-gold mb-1 leading-none">
            Beauty Academy
          </h1>
          <p className="font-[family-name:var(--font-montserrat)] text-[10px] text-majestic-gold/60 tracking-[0.2em] uppercase font-bold mt-1">
            ELITE PROFESSIONAL TRAINING
          </p>
        </div>
        {/* Navigation Tabs */}
        <nav className="flex-grow space-y-4">
          {sidebarLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`flex items-center gap-4 py-3 px-4 font-[family-name:var(--font-montserrat)] text-[12px] uppercase font-bold tracking-wider transition-all duration-200 ${
                link.active
                  ? "text-majestic-gold border-r-2 border-majestic-gold bg-primary-container/50"
                  : "text-on-primary/70 hover:bg-primary-container hover:text-majestic-gold"
              }`}
            >
              <span className="material-symbols-outlined text-xl">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
        {/* CTA & Footer */}
        <div className="mt-auto space-y-6">
          <button className="w-full bg-majestic-gold text-royal-navy py-4 px-4 font-[family-name:var(--font-montserrat)] text-[11px] font-bold tracking-widest hover:brightness-110 transition-all uppercase">
            ENROLL IN NEW COURSE
          </button>
          <div className="space-y-3 pt-6 border-t border-majestic-gold/10 text-on-primary/50 text-[10px] font-bold">
            <a className="flex items-center gap-4 px-4 hover:text-majestic-gold" href="#">
              <span className="material-symbols-outlined text-lg">settings</span>
              <span>SETTINGS</span>
            </a>
            <a className="flex items-center gap-4 px-4 hover:text-majestic-gold" href="#">
              <span className="material-symbols-outlined text-lg">help_center</span>
              <span>SUPPORT</span>
            </a>
          </div>
        </div>
      </aside>

      {/* ── MOBILE Top AppBar ── */}
      <header className="fixed top-0 left-0 w-full z-50 bg-surface border-b border-champagne-taupe/30 flex justify-between items-center h-16 px-6 block md:hidden">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-majestic-gold relative">
            <Image
              alt="Student Profile Photo"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHzwHg-dkEmF6qfzhS2JNHGwBKpl1OG2TzL5yXsF4tOC671P0H_YqtbEfaMFJJv8pjFPEp49YmzXNWEjs3fEVd5Wz03tzf7kpo0nYNe_eio35nhtKlAcjfjacWbqHoy5a5z-Urr0QpTTHIr2xg04XIfNSd8zwsIR1iE1b5MNe_D3TeH7ObPfOrYQPGhU_2ObhaGnDc-0GUg41vBbk9v-mPxUw8SWNgkuaWKiXLeFHg5bj28GGw0IW8YYze298qfeYE4qI4aQddhNs"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <span className="font-[family-name:var(--font-eb-garamond)] text-[20px] font-semibold text-royal-navy uppercase tracking-widest leading-none">
            Elite Academy
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="material-symbols-outlined text-royal-navy active:opacity-80 transition-opacity"
        >
          menu
        </button>
      </header>

      {/* ── MOBILE SideNavBar Drawer Menu Overlay ── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-midnight-ink/80 backdrop-blur-sm">
          <div className="relative w-64 bg-royal-navy text-white flex flex-col p-6 h-full transition-transform duration-300">
            <div className="flex justify-between items-center mb-8">
              <h1 className="font-[family-name:var(--font-eb-garamond)] text-[22px] font-semibold text-majestic-gold">
                Elite Academy
              </h1>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-white hover:text-majestic-gold"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <nav className="flex-grow space-y-2">
              {sidebarLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-4 py-3 px-4 font-[family-name:var(--font-montserrat)] text-[12px] uppercase font-bold tracking-wider transition-all duration-200 ${
                    link.active
                      ? "text-majestic-gold bg-primary-container"
                      : "text-alabaster-white/70 hover:bg-primary-container"
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}
            </nav>
            <div className="border-t border-white/10 pt-4 space-y-4">
              <button className="w-full bg-majestic-gold text-royal-navy py-4 px-4 font-[family-name:var(--font-montserrat)] text-[11px] font-bold tracking-widest hover:brightness-110 transition-all uppercase">
                ENROLL IN NEW COURSE
              </button>
              <Link
                href="/academy/portal"
                className="flex items-center gap-4 py-3 px-4 cursor-pointer text-alabaster-white/70 hover:bg-primary-container"
              >
                <span className="material-symbols-outlined text-xl">logout</span>
                <span className="font-[family-name:var(--font-montserrat)] text-[12px] uppercase font-bold tracking-wider">
                  Logout
                </span>
              </Link>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* ── DESKTOP Canvas Layout (md+) ── */}
      <main className="ml-64 min-h-screen hidden md:flex flex-col">
        {/* Header Section */}
        <header className="bg-surface-container-lowest px-[64px] py-20 border-b border-surface-variant">
          <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <span className="font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold text-majestic-gold mb-4 block">
                Academic Transcript
              </span>
              <h1 className="font-[family-name:var(--font-eb-garamond)] text-[48px] leading-[56px] font-semibold text-royal-navy mb-4">
                Academic Standing
              </h1>
              <div className="flex items-center gap-6">
                <div className="flex flex-col">
                  <span className="font-[family-name:var(--font-montserrat)] text-warm-slate text-[10px] uppercase font-bold">
                    Current GPA
                  </span>
                  <span className="font-[family-name:var(--font-eb-garamond)] text-[28px] font-bold text-royal-navy mt-1">
                    3.92 / 4.0
                  </span>
                </div>
                <div className="w-[1px] h-10 bg-surface-variant"></div>
                <div className="flex flex-col">
                  <span className="font-[family-name:var(--font-montserrat)] text-warm-slate text-[10px] uppercase font-bold">
                    Total Credits
                  </span>
                  <span className="font-[family-name:var(--font-eb-garamond)] text-[28px] font-bold text-royal-navy mt-1">
                    142 Earned
                  </span>
                </div>
              </div>
            </div>
            <div>
              <button
                onClick={handleRequestTranscript}
                className="px-6 py-3 border border-royal-navy text-royal-navy font-[family-name:var(--font-montserrat)] text-[12px] font-bold uppercase tracking-wider hover:bg-royal-navy hover:text-white transition-all duration-300"
              >
                Request Official Transcript
              </button>
            </div>
          </div>
        </header>

        {/* Bento Breakdown and Certs Grid */}
        <div className="max-w-[1280px] mx-auto px-[64px] py-16 space-y-24 w-full flex-grow">
          {/* Performance Breakdown */}
          <section>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Progress SVG Rings */}
              <div className="lg:col-span-8 bg-surface-container-lowest border border-surface-variant p-8 flex flex-col justify-between shadow-sm">
                <h3 className="font-[family-name:var(--font-eb-garamond)] text-[24px] font-semibold text-royal-navy mb-8">
                  Performance Breakdown
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
                  <div className="text-center group">
                    <div className="relative w-32 h-32 mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90">
                        <circle className="text-surface-variant" cx="64" cy="64" fill="transparent" r="60" stroke="currentColor" strokeWidth="2"></circle>
                        <circle className="text-majestic-gold" cx="64" cy="64" fill="transparent" r="60" stroke="currentColor" strokeDasharray="377" strokeDashoffset="15" strokeWidth="2"></circle>
                      </svg>
                      <span className="absolute font-[family-name:var(--font-eb-garamond)] text-xl font-bold text-royal-navy">96%</span>
                    </div>
                    <span className="font-[family-name:var(--font-montserrat)] text-[10px] text-warm-slate tracking-widest block uppercase font-bold">
                      Bridal Artistry
                    </span>
                  </div>
                  <div className="text-center group">
                    <div className="relative w-32 h-32 mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90">
                        <circle className="text-surface-variant" cx="64" cy="64" fill="transparent" r="60" stroke="currentColor" strokeWidth="2"></circle>
                        <circle className="text-royal-navy" cx="64" cy="64" fill="transparent" r="60" stroke="currentColor" strokeDasharray="377" strokeDashoffset="45" strokeWidth="2"></circle>
                      </svg>
                      <span className="absolute font-[family-name:var(--font-eb-garamond)] text-xl font-bold text-royal-navy">88%</span>
                    </div>
                    <span className="font-[family-name:var(--font-montserrat)] text-[10px] text-warm-slate tracking-widest block uppercase font-bold">
                      Chemical Theory
                    </span>
                  </div>
                  <div className="text-center group">
                    <div className="relative w-32 h-32 mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90">
                        <circle className="text-surface-variant" cx="64" cy="64" fill="transparent" r="60" stroke="currentColor" strokeWidth="2"></circle>
                        <circle className="text-champagne-taupe" cx="64" cy="64" fill="transparent" r="60" stroke="currentColor" strokeDasharray="377" strokeDashoffset="30" strokeWidth="2"></circle>
                      </svg>
                      <span className="absolute font-[family-name:var(--font-eb-garamond)] text-xl font-bold text-royal-navy">92%</span>
                    </div>
                    <span className="font-[family-name:var(--font-montserrat)] text-[10px] text-warm-slate tracking-widest block uppercase font-bold">
                      Business &amp; Ethics
                    </span>
                  </div>
                </div>
              </div>

              {/* Side insights box */}
              <div className="lg:col-span-4 bg-midnight-ink p-8 text-alabaster-white flex flex-col justify-center border border-royal-navy shadow-sm">
                <span className="material-symbols-outlined text-majestic-gold text-4xl mb-4">
                  auto_awesome
                </span>
                <h4 className="font-[family-name:var(--font-eb-garamond)] text-[24px] font-semibold mb-4">
                  Elite Standing
                </h4>
                <p className="font-[family-name:var(--font-montserrat)] text-sm leading-relaxed opacity-80">
                  You are currently in the top 5% of the Class of 2024. Your proficiency in Advanced Contour and Bridal Aesthetics has earned you a nomination for the &ldquo;Excellence in Artistry&rdquo; award.
                </p>
              </div>
            </div>
          </section>

          {/* Certifications Gallery */}
          <section>
            <div className="flex items-baseline justify-between mb-12">
              <h2 className="font-[family-name:var(--font-eb-garamond)] text-[36px] font-semibold text-royal-navy">
                Earned Certifications
              </h2>
              <div className="h-[1px] flex-grow mx-8 bg-surface-variant"></div>
              <span className="font-[family-name:var(--font-montserrat)] text-warm-slate text-[12px] font-bold uppercase tracking-wider">
                3 Total
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {certsData.map((cert) => (
                <div
                  key={cert.id}
                  className="group bg-white border border-surface-variant overflow-hidden hover:shadow-lg transition-all duration-500"
                >
                  <div className="aspect-[4/3] relative overflow-hidden bg-alabaster-white">
                    <Image
                      alt={cert.alt}
                      src={cert.imgSrc}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-royal-navy/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => alert("Preparing PDF certificate download...")}
                        className="bg-white text-royal-navy px-6 py-2 font-[family-name:var(--font-montserrat)] text-[11px] font-bold uppercase tracking-wider active:scale-95 transition-transform flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-sm">download</span> PDF
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="font-[family-name:var(--font-montserrat)] text-[14px] font-bold text-royal-navy uppercase tracking-wider">
                      {cert.title}
                    </h4>
                    <p className="font-[family-name:var(--font-montserrat)] text-[10px] text-warm-slate uppercase font-bold mt-1 tracking-wide">
                      Conferred: {cert.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Grades Table */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <h2 className="font-[family-name:var(--font-eb-garamond)] text-[36px] font-semibold text-royal-navy">
                Semester Performance
              </h2>
              <span className="px-3 py-1 bg-royal-navy text-majestic-gold font-[family-name:var(--font-montserrat)] font-bold text-[10px] uppercase tracking-wide">
                Fall 2024
              </span>
            </div>
            <div className="overflow-x-auto border border-surface-variant">
              <table className="w-full border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-midnight-ink text-alabaster-white">
                    <th className="px-8 py-5 text-left font-[family-name:var(--font-montserrat)] tracking-widest text-[11px] uppercase font-bold">
                      Course Name
                    </th>
                    <th className="px-8 py-5 text-left font-[family-name:var(--font-montserrat)] tracking-widest text-[11px] uppercase font-bold">
                      Semester
                    </th>
                    <th className="px-8 py-5 text-center font-[family-name:var(--font-montserrat)] tracking-widest text-[11px] uppercase font-bold">
                      Final Grade
                    </th>
                    <th className="px-8 py-5 text-right font-[family-name:var(--font-montserrat)] tracking-widest text-[11px] uppercase font-bold">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-variant bg-white">
                  {gradesData.map((row) => (
                    <tr key={row.code} className="hover:bg-surface-bright transition-all duration-300">
                      <td className="px-8 py-6">
                        <div className="font-bold text-royal-navy text-[15px]">{row.code} {row.name}</div>
                        <div className="text-[10px] font-bold text-warm-slate mt-1 uppercase tracking-wider">
                          {row.instructor}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-warm-slate font-medium text-[14px]">
                        {row.semester}
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className="font-[family-name:var(--font-eb-garamond)] text-2xl font-bold text-royal-navy">
                          {row.grade}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span
                          className={`inline-block px-4 py-1 border font-[family-name:var(--font-montserrat)] text-[10px] font-bold uppercase tracking-wider ${
                            row.status === "Distinction"
                              ? "border-majestic-gold text-majestic-gold bg-majestic-gold/5"
                              : "border-royal-navy/20 text-royal-navy"
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Desktop Footer */}
        <footer className="w-full bg-surface-container-lowest border-t border-surface-variant py-8 px-[64px]">
          <div className="max-w-[1280px] mx-auto flex justify-between items-center gap-8 text-sm">
            <span className="font-[family-name:var(--font-eb-garamond)] text-[24px] font-semibold text-royal-navy">
              Erniekay Splendor
            </span>
            <p className="font-[family-name:var(--font-montserrat)] text-[10px] text-warm-slate uppercase font-bold">
              © 2024 Luxury Beauty Academy. All Rights Reserved.
            </p>
          </div>
        </footer>
      </main>

      {/* ── MOBILE Canvas Layout (<md) ── */}
      <main className="pb-32 px-6 pt-8 max-w-md mx-auto block md:hidden mt-16">
        {/* Header Section */}
        <section className="mb-8">
          <h1 className="font-[family-name:var(--font-eb-garamond)] text-[32px] font-semibold text-royal-navy mb-2">
            Academic Standing
          </h1>
          <p className="text-outline font-[family-name:var(--font-montserrat)] text-sm mb-6">
            Your professional progress and certification status.
          </p>
          <button
            onClick={handleRequestTranscript}
            className="w-full bg-royal-navy text-majestic-gold border border-majestic-gold font-[family-name:var(--font-montserrat)] font-bold h-12 flex items-center justify-center gap-2 hover:bg-opacity-90 active:scale-95 transition-all uppercase tracking-wider text-[12px]"
          >
            <span className="material-symbols-outlined">description</span>
            REQUEST OFFICIAL TRANSCRIPT
          </button>
        </section>

        {/* GPA & Credits Bento grid */}
        <section className="grid grid-cols-2 gap-4 mb-10">
          <div className="col-span-1 bg-white/85 backdrop-blur border border-[#EBEBEB] p-6 flex flex-col justify-between shadow-sm">
            <span className="text-[10px] font-[family-name:var(--font-montserrat)] font-bold text-outline uppercase tracking-wider">
              Current GPA
            </span>
            <div className="mt-4">
              <span className="text-4xl font-[family-name:var(--font-eb-garamond)] font-bold text-royal-navy">3.92</span>
              <span className="text-outline text-xs ml-1">/ 4.0</span>
            </div>
          </div>
          <div className="col-span-1 bg-white/85 backdrop-blur border border-[#EBEBEB] border-l-4 border-l-majestic-gold p-6 flex flex-col justify-between shadow-sm">
            <span className="text-[10px] font-[family-name:var(--font-montserrat)] font-bold text-outline uppercase tracking-wider">
              Total Credits
            </span>
            <div className="mt-4">
              <span className="text-4xl font-[family-name:var(--font-eb-garamond)] font-bold text-royal-navy">142</span>
              <span className="text-outline text-[10px] font-bold ml-1 uppercase tracking-wider block sm:inline">EARNED</span>
            </div>
          </div>
        </section>

        {/* Performance Mastery */}
        <section className="mb-10">
          <div className="flex justify-between items-end mb-6">
            <h2 className="font-[family-name:var(--font-eb-garamond)] text-[22px] font-semibold text-royal-navy">
              Performance Mastery
            </h2>
            <div className="flex items-center gap-1 text-majestic-gold">
              <span className="material-symbols-outlined text-sm">verified</span>
              <span className="font-[family-name:var(--font-montserrat)] text-[9px] font-bold tracking-widest uppercase">
                ELITE STANDING
              </span>
            </div>
          </div>
          <div className="space-y-6">
            {/* Progress Item 1 */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-[14px] font-bold text-royal-navy">Bridal Artistry</span>
                <span className="text-[14px] font-bold text-royal-navy">96%</span>
              </div>
              <div className="h-1.5 w-full bg-outline-variant/30 overflow-hidden relative">
                <div className="h-full bg-royal-navy absolute left-0 top-0 transition-all duration-1000" style={{ width: "96%" }}></div>
              </div>
            </div>
            {/* Progress Item 2 */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-[14px] font-bold text-royal-navy">Chemical Theory</span>
                <span className="text-[14px] font-bold text-royal-navy">88%</span>
              </div>
              <div className="h-1.5 w-full bg-outline-variant/30 overflow-hidden relative">
                <div className="h-full bg-royal-navy absolute left-0 top-0 transition-all duration-1000" style={{ width: "88%" }}></div>
              </div>
            </div>
            {/* Progress Item 3 */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-[14px] font-bold text-royal-navy">Business &amp; Ethics</span>
                <span className="text-[14px] font-bold text-royal-navy">92%</span>
              </div>
              <div className="h-1.5 w-full bg-outline-variant/30 overflow-hidden relative">
                <div className="h-full bg-majestic-gold absolute left-0 top-0 transition-all duration-1000" style={{ width: "92%" }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* Earned Certifications */}
        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-eb-garamond)] text-[22px] font-semibold text-royal-navy mb-6">
            Professional Certifications
          </h2>
          <div className="space-y-4">
            {certsData.map((cert) => (
              <div
                key={cert.id}
                onClick={() => alert(`Reviewing credential details for ${cert.title}`)}
                className="bg-white/80 backdrop-blur border border-[#EBEBEB] flex items-center p-3 gap-4 group active:scale-[0.98] transition-transform cursor-pointer shadow-sm"
              >
                <div className="w-20 h-24 bg-alabaster-white border border-outline-variant flex-shrink-0 relative overflow-hidden">
                  <Image
                    alt={cert.alt}
                    src={cert.imgSrc}
                    fill
                    className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                  <div className="absolute inset-0 border-[4px] border-white/20 pointer-events-none"></div>
                </div>
                <div>
                  <h3 className="font-bold text-royal-navy text-sm leading-tight mb-1">
                    {cert.title}
                  </h3>
                  <p className="text-[10px] text-outline font-bold tracking-wider uppercase mb-2">
                    CONFERRED {cert.date}
                  </p>
                  <div className="flex items-center text-majestic-gold gap-1">
                    <span className="material-symbols-outlined text-[14px]">workspace_premium</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider">Verified Credential</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Detailed Transcript rows */}
        <section className="mb-6">
          <h2 className="font-[family-name:var(--font-eb-garamond)] text-[22px] font-semibold text-royal-navy mb-6">
            Detailed Transcript
          </h2>
          <div className="space-y-0.5 border-y border-outline-variant/30">
            {gradesData.map((row) => (
              <div key={row.code} className="flex justify-between items-center py-5 border-b border-outline-variant/20 bg-white px-2">
                <div className="flex-1 pr-4">
                  <p className="text-[10px] font-bold text-outline uppercase tracking-wider mb-1">
                    {row.code}
                  </p>
                  <p className="font-bold text-royal-navy text-sm leading-tight">
                    {row.name}
                  </p>
                  <div
                    className={`mt-2 inline-block px-2 py-0.5 text-[9px] font-bold rounded-sm uppercase tracking-wider ${
                      row.status === "Distinction"
                        ? "bg-premium-green/10 text-premium-green"
                        : "bg-royal-navy/5 text-royal-navy"
                    }`}
                  >
                    {row.status}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-[family-name:var(--font-eb-garamond)] font-bold text-royal-navy">
                    {row.grade}
                  </p>
                  <p className="text-[10px] font-bold text-outline uppercase tracking-wider mt-0.5">
                    {row.credits}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Registrar Help Link */}
        <div className="text-center py-8">
          <a
            className="text-champagne-taupe font-bold text-[11px] underline underline-offset-4 decoration-majestic-gold tracking-widest uppercase"
            href="mailto:registrar@academy.com"
          >
            Contact Registrar Office
          </a>
        </div>

        {/* MOBILE Bottom Navigation bar fixed */}
        <nav className="fixed bottom-0 left-0 w-full h-16 bg-surface border-t border-champagne-taupe/30 flex items-center justify-around z-50 block md:hidden">
          <Link className="flex flex-col items-center gap-1 text-warm-slate" href="/academy/portal/courses">
            <span className="material-symbols-outlined">school</span>
            <span className="font-[family-name:var(--font-montserrat)] text-[10px] font-bold">Courses</span>
          </Link>
          <a className="flex flex-col items-center gap-1 text-warm-slate" href="#">
            <span className="material-symbols-outlined">calendar_today</span>
            <span className="font-[family-name:var(--font-montserrat)] text-[10px] font-bold">Schedule</span>
          </a>
          <Link className="flex flex-col items-center gap-1 text-majestic-gold" href="/academy/portal/grades">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>grade</span>
            <span className="font-[family-name:var(--font-montserrat)] text-[10px] font-bold">Grades</span>
          </Link>
          <Link className="flex flex-col items-center gap-1 text-warm-slate" href="/academy/portal/profile">
            <span className="material-symbols-outlined">person</span>
            <span className="font-[family-name:var(--font-montserrat)] text-[10px] font-bold">Profile</span>
          </Link>
        </nav>
      </main>

    </div>
  );
}
