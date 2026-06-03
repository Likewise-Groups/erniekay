"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Course {
  id: string;
  category: string;
  title: string;
  progress: number;
  status: "in-progress" | "completed" | "not-started";
  imgSrc: string;
  alt: string;
}

const coursesData: Course[] = [
  {
    id: "bridal-1",
    category: "Advanced Certification",
    title: "Masterclass in Bridal Artistry",
    progress: 75,
    status: "in-progress",
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuDd3U9sRd_ouCO6-M9_aH5574sRw4I8gj3tY9SyH_rAu_pRyXl4za0TKULOs1OljetWLGNQwmqE2ulEOImmLgo0wW-Mu0aZohU-FsEIVcMVTSESJp0NA1SiaZ8YocO7xFahthNqL4trEfMItuwu4oPMU7LrfBsDtDcgxnKPR4goHK2CfSsSZRLs5YK6DShitwSCvZ2xZ1Uj6nLd8jHdy3w4KZS_mCmR1axp56pHF9c3-SiOQDJMKdpFdTQ0YfYMRmFwCpg-8yo-SjE",
    alt: "A luxurious high-fashion photograph of a bride with intricate, sophisticated makeup.",
  },
  {
    id: "hair-1",
    category: "Professional Series",
    title: "Advanced Editorial Hair Sculpting",
    progress: 12,
    status: "in-progress",
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuDcnUfGZgBOneNbueKIiGHnytF5wgCIZ2op9OrM0QuMYbkrHJcqxrhzvNCcvHNV1fN_HmnZrvVDxLa4DG6iXe43fk-M--T9fDaSQ3eb_8A3v8iN_pqCcPdPPbkoNBEQk9s6bK8Paeae7QYjLOTXhYRckgPtd82QPLBOG7YyeJjQjWMb60tOubfMMbpZOdkrb_4M5LLKNcXho3Xs8yr6Kh9piRd2xQDhuWiGd7wkx_W13wUuPNGLT6nlIuqt2gBEcGX08IDZg6yOxfI",
    alt: "A striking editorial image featuring a model with avant-garde hair styling.",
  },
  {
    id: "color-1",
    category: "Course Completed",
    title: "Color Theory & Palette Development",
    progress: 100,
    status: "completed",
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuCTWrGySWkyLNJK3cuH4QoOGacJB_RBlfiyL3uXEapku3x0kOumLpX9evdC6IF-hqscXRPoAOk2ALcSB0yV52nalfr2yXp2tPOyQiOsYbi83Wss3JToECYB9ObtYXy88tm9pdNwMta5G1pA0Yqya0lofMBL4SNd9-3MAjI4zThbbMZfzJkdv-MdUVA2VSvPimJnFfp7tdokzg6iRBaOuGyOjYackkIlAmX50gJGSxEEeKXMccunkQjytvJYLpbr2XICNwmm-1QHpi0",
    alt: "An artistic arrangement of high-end cosmetic palettes and brushes on a marble surface.",
  },
];

const tabs = [
  { id: "all", label: "All Courses" },
  { id: "in-progress", label: "In Progress" },
  { id: "completed", label: "Completed" },
  { id: "not-started", label: "Not Started" },
];

export default function MyCoursesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredCourses = coursesData.filter((course) => {
    const matchesTab = activeTab === "all" || course.status === activeTab;
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const sidebarLinks = [
    { label: "Dashboard", href: "/academy/portal/dashboard", icon: "dashboard" },
    { label: "Course Catalog", href: "/academy/portal/courses", icon: "auto_stories", active: true },
    { label: "Schedule", href: "/academy/portal/schedule", icon: "calendar_month" },
    { label: "Grades", href: "/academy/portal/grades", icon: "grade" },
    { label: "Profile", href: "/academy/portal/profile", icon: "person" },
  ];

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
        <h1 className="font-[family-name:var(--font-eb-garamond)] text-[28px] text-royal-navy leading-none font-semibold">
          Beauty Academy
        </h1>
        <div className="flex items-center gap-4">
          <button className="material-symbols-outlined text-warm-slate cursor-pointer active:scale-95">
            notifications
          </button>
          <div className="w-8 h-8 rounded-full overflow-hidden border border-champagne-taupe/50 relative">
            <Image
              alt="Student profile picture"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAT6-vxSZlZ9e1N16bes5SGjB8cAxor6k9Lyv3SDa_WQBrF_J2C333gmd15BEpOeT99Z1f8H-6gtDt71Mnt1kWv6GgkClnvon0Z0E042_12hiY53KEnWHrFRmLK_I74LshUKw1gSPOyKc38_jV0erKfXF6emYr03u4DRo5uIZ1ARUBvfb1lommAXvr7UcgEAmcxtkMz65wlD6xKHRyuX6uDxi_Vj0iKyqjLyW3U3lvgSHzE-pNEeDYs3k_NqaP3YFkU8GAMZkT43sw"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        </div>
      </header>

      {/* ── DESKTOP Layout Container ── */}
      <main className="ml-64 min-h-screen hidden md:flex flex-col">
        {/* Header Section */}
        <header className="bg-surface-container-lowest pt-20 pb-12 px-[64px] border-b border-outline-variant">
          <div className="max-w-[1280px] mx-auto">
            <span className="font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold text-champagne-taupe mb-4 block">
              ERNIEKAY SPLENDOR ACADEMY
            </span>
            <h2 className="font-[family-name:var(--font-eb-garamond)] text-[48px] leading-[56px] font-semibold text-royal-navy mb-4">
              My Courses
            </h2>
            <p className="font-[family-name:var(--font-montserrat)] text-[16px] leading-[26px] text-warm-slate max-w-2xl leading-relaxed">
              Refinement of your craft, one ritual at a time. Your dedication to bridal artistry and editorial excellence begins with every module you master.
            </p>
          </div>
        </header>

        {/* Search & Filter Bar */}
        <section className="sticky top-0 z-40 bg-alabaster-white/95 backdrop-blur-md border-b border-outline-variant">
          <div className="max-w-[1280px] mx-auto px-[64px] py-6 flex justify-between items-center gap-6">
            {/* Filter tabs */}
            <div className="flex gap-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold pb-2 transition-all border-b-2 ${
                    activeTab === tab.id
                      ? "text-royal-navy border-majestic-gold"
                      : "text-warm-slate border-transparent hover:text-royal-navy"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            {/* Search inputs */}
            <div className="relative w-80 group">
              <span className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-warm-slate group-focus-within:text-royal-navy transition-colors">
                search
              </span>
              <input
                className="w-full bg-transparent border-b border-champagne-taupe py-2 pl-8 pr-4 font-[family-name:var(--font-montserrat)] text-[11px] font-bold tracking-wider focus:outline-none focus:border-royal-navy transition-all placeholder:text-warm-slate/50"
                placeholder="SEARCH CATALOG..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Course Card Grid */}
        <section className="max-w-[1280px] mx-auto px-[64px] py-12 flex-grow w-full">
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px]">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="group bg-surface-container-lowest border border-outline-variant transition-all hover:border-majestic-gold hover:-translate-y-1 shadow-sm hover:shadow-md flex flex-col justify-between"
                >
                  <div>
                    {/* Course cover photo */}
                    <div className="relative h-64 overflow-hidden bg-royal-navy">
                      <Image
                        alt={course.alt}
                        src={course.imgSrc}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        unoptimized
                      />
                      <div className="absolute top-4 left-4 bg-royal-navy/90 text-majestic-gold px-3 py-1 font-[family-name:var(--font-montserrat)] text-[10px] tracking-widest font-bold uppercase">
                        {course.category}
                      </div>
                    </div>

                    {/* Course copy metadata */}
                    <div className="p-8">
                      <h3 className="font-[family-name:var(--font-eb-garamond)] text-[24px] font-semibold text-royal-navy mb-4 leading-tight">
                        {course.title}
                      </h3>
                      {course.status === "completed" ? (
                        <div className="mb-8 flex items-center gap-3">
                          <span className="material-symbols-outlined text-premium-green">
                            check_circle
                          </span>
                          <span className="font-[family-name:var(--font-montserrat)] text-[10px] text-premium-green tracking-widest font-bold">
                            COURSE COMPLETED
                          </span>
                        </div>
                      ) : (
                        <div className="mb-8">
                          <div className="flex justify-between font-[family-name:var(--font-montserrat)] text-[10px] text-warm-slate mb-2 font-bold">
                            <span>PROGRESS</span>
                            <span>{course.progress}%</span>
                          </div>
                          <div className="w-full h-[2px] bg-outline-variant">
                            <div className="h-full bg-majestic-gold" style={{ width: `${course.progress}%` }}></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="p-8 pt-0 mt-auto">
                    {course.status === "completed" ? (
                      <Link href={`/academy/portal/courses/${course.id}`} className="w-full block text-center bg-transparent text-royal-navy border border-royal-navy py-4 font-[family-name:var(--font-montserrat)] text-[11px] font-bold tracking-widest hover:bg-royal-navy hover:text-white transition-colors uppercase">
                        REVIEW MATERIALS
                      </Link>
                    ) : (
                      <Link href={`/academy/portal/courses/${course.id}`} className="w-full block text-center bg-royal-navy text-majestic-gold border border-majestic-gold py-4 font-[family-name:var(--font-montserrat)] text-[11px] font-bold tracking-widest hover:bg-primary transition-colors flex justify-center items-center gap-2 uppercase">
                        RESUME LESSON
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-warm-slate">
              <p className="font-[family-name:var(--font-montserrat)] text-[14px]">No matches found.</p>
            </div>
          )}
        </section>

        {/* Explore expertise CTA block */}
        <section className="max-w-[1280px] w-full mx-auto px-[64px] py-[112px]">
          <div className="relative bg-royal-navy p-24 overflow-hidden border border-majestic-gold/20 text-white">
            <div className="relative z-10 flex items-center justify-between gap-12">
              <div className="max-w-xl">
                <h2 className="font-[family-name:var(--font-eb-garamond)] text-[48px] font-semibold text-majestic-gold mb-6">
                  Expand Your Expertise
                </h2>
                <p className="font-[family-name:var(--font-montserrat)] text-[16px] leading-[26px] text-on-primary/80 mb-8">
                  Discover our latest professional certifications in Lash Artistry, Advanced Skincare, and Runway Aesthetics. Tailored for those who refuse to settle for anything less than perfection.
                </p>
                <button className="bg-majestic-gold text-royal-navy px-10 py-5 font-[family-name:var(--font-montserrat)] text-[12px] font-bold tracking-[0.2em] hover:brightness-110 transition-all uppercase">
                  EXPLORE FULL CATALOG
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Desktop Footer */}
        <footer className="w-full bg-surface-container-low border-t border-outline-variant py-12 px-[64px]">
          <div className="max-w-[1280px] mx-auto flex justify-between items-center gap-8 text-sm">
            <p className="text-warm-slate">© 2024 Premium Beauty Academy. All rights reserved.</p>
          </div>
        </footer>
      </main>

      {/* ── MOBILE Layout Container ── */}
      <main className="mt-16 pt-8 block md:hidden">
        {/* Headline Section */}
        <section className="px-6 mb-8">
          <h2 className="font-[family-name:var(--font-eb-garamond)] text-[28px] font-semibold text-royal-navy mb-2">
            My Courses
          </h2>
          <p className="text-warm-slate font-[family-name:var(--font-montserrat)] text-[14px] leading-relaxed">
            Refinement of your craft, one ritual at a time. Your journey to bridal and editorial mastery continues here.
          </p>
        </section>

        {/* Filter Tabs scrollable */}
        <section className="mb-8 overflow-x-auto no-scrollbar flex gap-6 px-6 border-b border-surface-variant">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 whitespace-nowrap font-[family-name:var(--font-montserrat)] text-[14px] transition-all border-b-2 ${
                activeTab === tab.id
                  ? "text-majestic-gold border-majestic-gold font-bold"
                  : "text-warm-slate border-transparent hover:text-majestic-gold"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </section>

        {/* Mobile Course Bento List */}
        <section className="px-6 space-y-8">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-surface-container-lowest border border-surface-variant overflow-hidden">
              <div className="aspect-[16/9] w-full overflow-hidden relative">
                <Image
                  alt={course.alt}
                  src={course.imgSrc}
                  fill
                  className={`object-cover transition-transform duration-700 hover:scale-105 ${
                    course.status === "completed" ? "grayscale contrast-125" : ""
                  }`}
                  unoptimized
                />
              </div>
              <div className="p-6">
                {course.status === "completed" ? (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-premium-green text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                    <span className="font-[family-name:var(--font-montserrat)] text-[10px] text-premium-green uppercase font-bold tracking-wider">
                      Course Completed
                    </span>
                  </div>
                ) : (
                  <span className="font-[family-name:var(--font-montserrat)] text-[10px] text-champagne-taupe mb-2 block uppercase font-bold tracking-wider">
                    {course.category}
                  </span>
                )}
                <h3 className="font-[family-name:var(--font-eb-garamond)] text-[22px] font-semibold text-royal-navy mb-4">
                  {course.title}
                </h3>
                
                {course.status !== "completed" && (
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-[family-name:var(--font-montserrat)] text-[10px] text-warm-slate font-bold">Progress</span>
                      <span className="font-[family-name:var(--font-montserrat)] text-[12px] font-bold text-royal-navy">{course.progress}%</span>
                    </div>
                    <div className="w-full h-[2px] bg-surface-variant relative">
                      <div className="absolute top-0 left-0 h-full bg-majestic-gold" style={{ width: `${course.progress}%` }}></div>
                    </div>
                  </div>
                )}

                {course.status === "completed" ? (
                  <Link href={`/academy/portal/courses/${course.id}`} className="w-full block text-center py-4 border border-royal-navy text-royal-navy font-[family-name:var(--font-montserrat)] text-[12px] font-bold uppercase tracking-wider active:scale-95 transition-all">
                    Review Materials
                  </Link>
                ) : (
                  <Link href={`/academy/portal/courses/${course.id}`} className="w-full block text-center py-4 bg-royal-navy text-majestic-gold font-[family-name:var(--font-montserrat)] text-[12px] font-bold border border-majestic-gold cursor-pointer active:scale-95 transition-all uppercase tracking-wider">
                    Resume Lesson
                  </Link>
                )}
              </div>
            </div>
          ))}
          {filteredCourses.length === 0 && (
            <div className="text-center py-10 text-warm-slate text-[14px]">No matches found.</div>
          )}
        </section>

        {/* Mobile Expand Expertise Section */}
        <section className="mt-16 bg-royal-navy py-16 px-6 text-center text-white">
          <h2 className="font-[family-name:var(--font-eb-garamond)] text-[28px] font-semibold text-majestic-gold mb-4">
            Expand Your Expertise
          </h2>
          <p className="text-alabaster-white/80 font-[family-name:var(--font-montserrat)] text-sm mb-8 max-w-xs mx-auto leading-relaxed">
            Ready to elevate your portfolio? Discover our curated selection of masterclasses led by industry titans.
          </p>
          <button className="px-8 py-4 bg-majestic-gold text-royal-navy font-[family-name:var(--font-montserrat)] text-[11px] font-bold uppercase tracking-wider cursor-pointer active:scale-95 transition-all">
            Explore Full Catalog
          </button>
        </section>

        {/* MOBILE Bottom Navigation fixed */}
        <nav className="fixed bottom-0 left-0 w-full h-16 bg-surface border-t border-champagne-taupe/30 flex items-center justify-around z-50">
          <Link className="flex flex-col items-center gap-1 text-majestic-gold" href="/academy/portal/courses">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
            <span className="font-[family-name:var(--font-montserrat)] text-[10px] font-bold">Courses</span>
          </Link>
          <Link className="flex flex-col items-center gap-1 text-warm-slate" href="/academy/portal/schedule">
            <span className="material-symbols-outlined">calendar_today</span>
            <span className="font-[family-name:var(--font-montserrat)] text-[10px] font-bold">Schedule</span>
          </Link>
          <Link className="flex flex-col items-center gap-1 text-warm-slate" href="/academy/portal/grades">
            <span className="material-symbols-outlined">grade</span>
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
