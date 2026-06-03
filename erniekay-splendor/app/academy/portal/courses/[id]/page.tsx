"use client";

import { useState, use } from "react";
import Image from "next/image";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CourseContentPage({ params }: PageProps) {
  const { id } = use(params);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Map courses data
  const coursesMap: { [key: string]: { title: string; progress: number } } = {
    "bridal-1": { title: "Masterclass in Bridal Artistry", progress: 75 },
    "hair-1": { title: "Advanced Editorial Hair Sculpting", progress: 12 },
    "color-1": { title: "Color Theory & Palette Development", progress: 100 },
  };

  const currentCourse = coursesMap[id] || {
    title: "Masterclass in Bridal Artistry",
    progress: 65,
  };

  const syllabusItems = [
    { label: "Introduction", status: "completed" },
    { label: "Foundations", status: "completed" },
    { label: "Advanced Techniques", status: "current" },
    { label: "Bridal Specialization", status: "locked" },
    { label: "Final Assessment", status: "locked" },
  ];

  const sidebarLinks = [
    { label: "Dashboard", href: "/academy/portal/dashboard", icon: "dashboard" },
    { label: "My Courses", href: "/academy/portal/courses", icon: "auto_stories" },
    { label: "Grades", href: "/academy/portal/grades", icon: "grade" },
    { label: "Profile Settings", href: "/academy/portal/profile", icon: "person" },
  ];

  const handleMarkComplete = () => {
    setIsCompleted((prev) => !prev);
  };

  return (
    <div className="bg-surface text-on-surface font-[family-name:var(--font-montserrat)] min-h-screen antialiased">
      <div className="flex min-h-screen overflow-hidden">
        
        {/* ── DESKTOP Curriculum SideNavBar (md+) ── */}
        <aside className="hidden md:flex flex-col h-screen w-80 sticky left-0 bg-surface-container-low dark:bg-primary-container border-r border-outline-variant dark:border-midnight-ink py-8 px-4 z-50 text-royal-navy dark:text-white">
          {/* Header Identity */}
          <div className="mb-10 px-4">
            <h1 className="font-[family-name:var(--font-eb-garamond)] text-[22px] font-semibold text-royal-navy dark:text-majestic-gold tracking-tight leading-tight">
              {currentCourse.title}
            </h1>
            <div className="mt-4 flex items-center justify-between">
              <span className="font-[family-name:var(--font-montserrat)] text-[11px] font-bold text-warm-slate dark:text-champagne-taupe">
                {currentCourse.progress}% Completed
              </span>
              <div className="h-1 w-24 bg-outline-variant rounded-full overflow-hidden">
                <div
                  className="h-full bg-majestic-gold transition-all duration-1000"
                  style={{ width: `${currentCourse.progress}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-2 overflow-y-auto scrollbar-hide">
            {syllabusItems.map((item, index) => {
              if (item.status === "completed") {
                return (
                  <div
                    key={index}
                    className="flex items-center gap-4 py-3 px-4 text-warm-slate dark:text-champagne-taupe font-medium hover:bg-surface-bright dark:hover:bg-surface-tint/10 transition-all duration-300 cursor-pointer group hover:translate-x-1"
                  >
                    <span className="material-symbols-outlined text-premium-green" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                    <span className="font-[family-name:var(--font-montserrat)] text-[12px] font-bold uppercase tracking-wider">
                      {item.label}
                    </span>
                  </div>
                );
              } else if (item.status === "current") {
                return (
                  <div
                    key={index}
                    className="flex items-center gap-4 py-3 px-4 text-royal-navy dark:text-majestic-gold font-bold bg-white dark:bg-midnight-ink border-l-4 border-majestic-gold transition-all duration-200 cursor-pointer"
                  >
                    <span className="material-symbols-outlined">radio_button_checked</span>
                    <span className="font-[family-name:var(--font-montserrat)] text-[12px] font-bold uppercase tracking-wider">
                      {item.label}
                    </span>
                    <span className="ml-auto text-[9px] bg-majestic-gold text-royal-navy px-2 py-0.5 rounded-full font-bold">
                      CURRENT
                    </span>
                  </div>
                );
              } else {
                return (
                  <div
                    key={index}
                    className="flex items-center gap-4 py-3 px-4 text-warm-slate dark:text-champagne-taupe font-medium opacity-60 cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined">lock</span>
                    <span className="font-[family-name:var(--font-montserrat)] text-[12px] font-bold uppercase tracking-wider">
                      {item.label}
                    </span>
                  </div>
                );
              }
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="mt-auto pt-6 border-t border-outline-variant/30 px-4 space-y-4">
            <button
              onClick={() => alert("Syllabus document is preparing for download...")}
              className="w-full py-3 bg-royal-navy text-majestic-gold font-[family-name:var(--font-montserrat)] text-[12px] font-bold uppercase tracking-widest border border-majestic-gold hover:bg-majestic-gold hover:text-royal-navy transition-all duration-300"
            >
              View Syllabus
            </button>
            <div className="flex justify-around text-warm-slate">
              <span className="material-symbols-outlined cursor-pointer hover:text-royal-navy transition-colors">help</span>
              <span className="material-symbols-outlined cursor-pointer hover:text-royal-navy transition-colors">settings</span>
            </div>
          </div>
        </aside>

        {/* ── MOBILE Curriculum Drawer Menu Overlay (<md) ── */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden bg-midnight-ink/80 backdrop-blur-sm">
            <div className="relative w-80 bg-surface-container-low text-royal-navy flex flex-col p-6 h-full transition-transform duration-300">
              <div className="flex justify-between items-center mb-8">
                <h1 className="font-[family-name:var(--font-eb-garamond)] text-xl font-semibold text-royal-navy leading-none">
                  Academy Portal
                </h1>
                <button onClick={() => setMobileMenuOpen(false)} className="text-royal-navy hover:text-majestic-gold">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <nav className="flex-grow space-y-2">
                {syllabusItems.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-4 py-3 px-4 text-warm-slate"
                  >
                    <span className="material-symbols-outlined">
                      {item.status === "completed" ? "check_circle" : item.status === "current" ? "radio_button_checked" : "lock"}
                    </span>
                    <span className="font-[family-name:var(--font-montserrat)] text-[12px] font-bold uppercase tracking-wider">
                      {item.label}
                    </span>
                  </div>
                ))}
              </nav>
            </div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}

        {/* ── Main Canvas (Desktop Content) ── */}
        <main className="hidden md:flex flex-1 flex-col overflow-y-auto h-screen bg-surface">
          {/* TopAppBar (Simplified Content Header) */}
          <header className="w-full sticky top-0 bg-surface/90 backdrop-blur-md z-40 border-b border-outline-variant py-4 px-8 flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <span className="font-[family-name:var(--font-montserrat)] text-[11px] font-bold tracking-widest text-warm-slate uppercase">
                Module 3 / Lesson 4
              </span>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-warm-slate">
                <span className="material-symbols-outlined text-[20px]">timer</span>
                <span className="text-sm font-medium">42 mins remaining</span>
              </div>
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-royal-navy cursor-pointer">notifications</span>
                <Link href="/academy/portal/profile" className="flex items-center">
                  <span className="material-symbols-outlined text-royal-navy cursor-pointer">account_circle</span>
                </Link>
              </div>
            </div>
          </header>

          <div className="max-w-[1100px] mx-auto py-10 px-8 flex-grow">
            {/* Video Player */}
            <section className="relative aspect-video w-full bg-midnight-ink overflow-hidden rounded-lg shadow-2xl group border border-outline-variant">
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  alt="Lesson Video Thumbnail"
                  className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_0FzlOeSdeweajuS5e0OqQde3xfzc54hEfHQFZZCrKJyShqndxS8wZ0JkfffgHGaMvExpvDX4cq2ZgCfbuwB_y2Bsk1AF9t7a7whI9WtGkPdjbZbiTPQXt4UMN0Vt29SL_dR2su2m5kxCfTKf-cNuNofMsQaQf7GZMPwTb-HWsoY8un7OaFjJbjaCOvsBaqMgIDxhoMJtBRGF8C3CLZDLj6dEKatpsx3FyL_YmmKVorkNNcjNfwyuhJveylrJ-QpUXfvQ8hMCEZQ"
                  fill
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-royal-navy/80 via-transparent to-transparent"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => setIsPlaying((prev) => !prev)}
                  className="w-20 h-20 rounded-full bg-majestic-gold flex items-center justify-center text-royal-navy transition-transform duration-300 hover:scale-110 active:scale-95 shadow-xl cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[48px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {isPlaying ? "pause" : "play_arrow"}
                  </span>
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 flex items-center gap-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/75 to-transparent">
                <span
                  onClick={() => setIsPlaying((prev) => !prev)}
                  className="material-symbols-outlined cursor-pointer hover:text-majestic-gold"
                >
                  {isPlaying ? "pause" : "play_arrow"}
                </span>
                <div className="flex-1 h-1.5 bg-white/30 rounded-full relative overflow-hidden cursor-pointer">
                  <div className="absolute inset-0 bg-majestic-gold w-[40%]"></div>
                </div>
                <span className="text-xs font-bold tracking-widest font-[family-name:var(--font-montserrat)]">12:45 / 32:00</span>
                <span className="material-symbols-outlined cursor-pointer hover:text-majestic-gold">volume_up</span>
                <span className="material-symbols-outlined cursor-pointer hover:text-majestic-gold">settings</span>
                <span className="material-symbols-outlined cursor-pointer hover:text-majestic-gold">fullscreen</span>
              </div>
            </section>

            {/* Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12">
              <div className="lg:col-span-8 space-y-8">
                <div>
                  <div className="h-[1px] bg-gradient-to-r from-majestic-gold to-transparent mb-6"></div>
                  <h2 className="font-[family-name:var(--font-eb-garamond)] text-[48px] leading-tight text-royal-navy mb-4 font-semibold">
                    Editorial Skin Prep &amp; Base Artistry
                  </h2>
                  <p className="font-[family-name:var(--font-montserrat)] text-sm text-warm-slate leading-relaxed">
                    In this session, we dive into the foundational secrets of the &ldquo;Glow-from-within&rdquo; editorial look. Mastering the base is not just about coverage; it's about the architectural manipulation of light and hydration. We will explore how to prep various skin types using elite professional products and how to layer thin, translucent washes of pigment to achieve a flawless yet breathable finish suitable for high-definition bridal photography.
                  </p>
                </div>

                <div className="bg-surface-container-low p-8 border border-outline-variant border-l-4 border-l-majestic-gold">
                  <h3 className="font-[family-name:var(--font-eb-garamond)] text-[28px] text-royal-navy mb-6 font-semibold leading-none">
                    Key Takeaways
                  </h3>
                  <ul className="space-y-4">
                    {[
                      "The 'Hydration Mapping' technique for uneven skin textures.",
                      "Understanding opacity: When to use sheer versus full-coverage pigments.",
                      "The 'Press & Roll' blending method for a seamless editorial finish.",
                      "Product chemistry: Managing cream and liquid interactions.",
                    ].map((takeaway, idx) => (
                      <li key={idx} className="flex items-start gap-4">
                        <span className="material-symbols-outlined text-majestic-gold mt-0.5">auto_awesome</span>
                        <span className="font-[family-name:var(--font-montserrat)] text-sm text-on-surface">
                          {takeaway}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 pt-8 border-t border-outline-variant">
                  <button className="w-full sm:w-auto px-8 py-3 bg-transparent text-royal-navy border border-royal-navy font-[family-name:var(--font-montserrat)] text-[12px] font-bold uppercase tracking-widest hover:bg-royal-navy hover:text-white transition-all duration-300">
                    Previous Lesson
                  </button>
                  <button
                    onClick={handleMarkComplete}
                    className={`w-full sm:w-auto px-10 py-3 font-[family-name:var(--font-montserrat)] text-[12px] font-bold uppercase tracking-widest hover:shadow-lg transition-all duration-300 ${
                      isCompleted ? "bg-premium-green text-white" : "bg-majestic-gold text-royal-navy"
                    }`}
                  >
                    {isCompleted ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-[16px]">check</span> LESSON COMPLETED
                      </span>
                    ) : (
                      "Mark as Complete"
                    )}
                  </button>
                  <button className="w-full sm:w-auto px-8 py-3 bg-transparent text-royal-navy border border-royal-navy font-[family-name:var(--font-montserrat)] text-[12px] font-bold uppercase tracking-widest hover:bg-royal-navy hover:text-white transition-all duration-300">
                    Next Lesson
                  </button>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-10">
                <section>
                  <h4 className="font-[family-name:var(--font-montserrat)] text-[12px] font-bold text-warm-slate mb-6 border-b border-outline-variant pb-2 uppercase tracking-widest">
                    Academic Resources
                  </h4>
                  <div className="space-y-4">
                    {[
                      { title: "Product List PDF", size: "2.4 MB • Essential", icon: "picture_as_pdf" },
                      { title: "Technique Diagram", size: "1.1 MB • Visual Aid", icon: "schema" },
                      { title: "Artistic Notes", size: "540 KB • Instructor Prep", icon: "edit_note" },
                    ].map((mat, idx) => (
                      <div
                        key={idx}
                        onClick={() => alert(`Preparing ${mat.title} download...`)}
                        className="group flex items-center justify-between p-4 bg-white border border-outline-variant hover:border-majestic-gold transition-colors cursor-pointer shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-royal-navy">{mat.icon}</span>
                          <div>
                            <p className="font-bold text-royal-navy text-sm leading-none mb-1">{mat.title}</p>
                            <p className="text-xs text-warm-slate">{mat.size}</p>
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-warm-slate group-hover:text-majestic-gold transition-colors">
                          download
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </main>

        {/* ── MOBILE Canvas Layout (<md) ── */}
        <main className="flex-1 flex flex-col h-screen md:hidden bg-surface pb-24 overflow-y-auto">
          {/* Mobile Header */}
          <header className="bg-surface dark:bg-on-surface border-b border-champagne-taupe sticky top-0 z-40 h-16 w-full flex justify-between items-center px-6 flex-shrink-0">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="text-royal-navy dark:text-majestic-gold hover:bg-alabaster-white p-2 rounded flex items-center"
              >
                <span className="material-symbols-outlined">menu</span>
              </button>
              <h1 className="font-[family-name:var(--font-eb-garamond)] text-[22px] font-semibold text-royal-navy dark:text-majestic-gold">
                Academy Portal
              </h1>
            </div>
            <Link href="/academy/portal/profile" className="w-10 h-10 rounded-full border border-champagne-taupe overflow-hidden relative">
              <Image
                alt="Student Profile Photo"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8Jm6VC8C-QqIRZW0lbDSFEeUbeQ1959TxJrejJfXnVHUTaICf9SbPMSnnAVsGzJ61WIvaU6_CvSQXIc7uZRy43VK-7YHMtn5hINztWUaoAQLB2oayxf8TrXo8TCUcOMzbuWYEvPtyoFhbELipNYDanJ9d5XB6_7EKWiLBD0WFIr_3GaF5mEfhKTYBd4nkcgotbB7kpGKVAi_904qw0IofFtVHGFKgRokv8EXzIlBFGjNy18ZvifOYTW_vz_rGa-F7FyFJGBxg1SA"
                fill
                unoptimized
              />
            </Link>
          </header>

          <div className="w-full flex-grow">
            
            {/* Mobile Video Player */}
            <section className="relative w-full aspect-video bg-black overflow-hidden flex-shrink-0">
              <Image
                alt="Tutorial Placeholder"
                className="w-full h-full object-cover opacity-80"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_0FzlOeSdeweajuS5e0OqQde3xfzc54hEfHQFZZCrKJyShqndxS8wZ0JkfffgHGaMvExpvDX4cq2ZgCfbuwB_y2Bsk1AF9t7a7whI9WtGkPdjbZbiTPQXt4UMN0Vt29SL_dR2su2m5kxCfTKf-cNuNofMsQaQf7GZMPwTb-HWsoY8un7OaFjJbjaCOvsBaqMgIDxhoMJtBRGF8C3CLZDLj6dEKatpsx3FyL_YmmKVorkNNcjNfwyuhJveylrJ-QpUXfvQ8hMCEZQ"
                fill
                unoptimized
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => setIsPlaying((prev) => !prev)}
                  className="w-20 h-20 bg-majestic-gold text-royal-navy rounded-full flex items-center justify-center editorial-shadow transition-transform active:scale-95 shadow-xl"
                >
                  <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {isPlaying ? "pause" : "play_arrow"}
                  </span>
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-center justify-between text-white">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-majestic-gold">
                    Current Lesson: 14:22 / 28:05
                  </span>
                  <span className="material-symbols-outlined text-xl">fullscreen</span>
                </div>
                <div className="w-full h-1 bg-white/20 mt-2 rounded-full overflow-hidden">
                  <div className="w-1/2 h-full bg-majestic-gold"></div>
                </div>
              </div>
            </section>

            {/* Mobile Lesson Header */}
            <article className="px-6 py-8">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-[family-name:var(--font-montserrat)] text-[11px] font-bold text-champagne-taupe uppercase tracking-wider">
                  Module 03 — Artistry Fundamentals
                </span>
              </div>
              <h2 className="font-[family-name:var(--font-eb-garamond)] text-[32px] text-royal-navy mb-4 leading-tight font-semibold">
                Editorial Skin Prep &amp; Base Artistry
              </h2>
              <p className="font-[family-name:var(--font-montserrat)] text-sm text-warm-slate mb-6 leading-relaxed">
                Master the foundations of the &ldquo;Splendor Signature&rdquo; glow. In this lesson, we explore high-performance priming techniques and the precise layering of editorial-grade foundations to create a canvas that radiates under studio lighting.
              </p>
              <div className="bg-alabaster-white p-4 border-l-2 border-majestic-gold">
                <h4 className="font-bold text-royal-navy mb-2 uppercase tracking-wider text-xs">
                  Core Objectives
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-xs text-warm-slate font-medium">
                    <span className="material-symbols-outlined text-royal-navy text-sm mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                    Identifying skin undertones for bridal longevity.
                  </li>
                  <li className="flex items-start gap-2 text-xs text-warm-slate font-medium">
                    <span className="material-symbols-outlined text-royal-navy text-sm mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                    Customizing emulsion ratios for different textures.
                  </li>
                </ul>
              </div>
            </article>

            {/* Mobile Academic Resources */}
            <section className="px-6 pb-8">
              <div className="flex items-center justify-between border-b border-champagne-taupe pb-2 mb-6">
                <h3 className="font-[family-name:var(--font-eb-garamond)] text-[22px] font-semibold text-royal-navy">
                  Academic Resources
                </h3>
                <span className="material-symbols-outlined text-champagne-taupe">library_books</span>
              </div>
              <div className="space-y-3">
                {[
                  { title: "Product List PDF", size: "Recommended Kit Staples (2.4 MB)", icon: "picture_as_pdf" },
                  { title: "Technique Diagram", size: "Mapping the Splendor Glow (1.1 MB)", icon: "architecture" },
                  { title: "Artistic Notes", size: "Lecture Summary Transcription", icon: "edit_note" },
                ].map((mat, idx) => (
                  <div
                    key={idx}
                    onClick={() => alert(`Preparing ${mat.title} download...`)}
                    className="flex items-center justify-between p-4 bg-white border border-surface-container-highest hover:border-majestic-gold transition-colors active:scale-[0.98] cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 flex items-center justify-center bg-royal-navy text-majestic-gold">
                        <span className="material-symbols-outlined">{mat.icon}</span>
                      </div>
                      <div>
                        <p className="font-bold text-sm text-royal-navy leading-none mb-1">{mat.title}</p>
                        <p className="text-xs text-warm-slate">{mat.size}</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-champagne-taupe">download</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Mobile Navigation & CTA */}
            <section className="px-6 py-10 bg-royal-navy text-white text-center">
              <span className="font-[family-name:var(--font-montserrat)] text-[10px] tracking-widest text-majestic-gold uppercase mb-2 block font-bold">
                Lesson 4 of 12
              </span>
              <h4 className="font-[family-name:var(--font-eb-garamond)] text-2xl mb-6 font-semibold">
                Ready for the next module?
              </h4>
              <div className="flex flex-col gap-4 max-w-sm mx-auto">
                <button
                  onClick={handleMarkComplete}
                  className={`py-4 px-8 font-[family-name:var(--font-montserrat)] text-[12px] font-bold uppercase tracking-widest transition-all active:scale-[0.98] ${
                    isCompleted ? "bg-premium-green text-white" : "bg-majestic-gold text-royal-navy"
                  }`}
                >
                  {isCompleted ? (
                    <div className="flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined">check</span> LESSON COMPLETED
                    </div>
                  ) : (
                    "COMPLETE & CONTINUE"
                  )}
                </button>
                <button
                  onClick={() => alert("Syllabus is preparing...")}
                  className="border border-majestic-gold text-majestic-gold font-[family-name:var(--font-montserrat)] text-[12px] font-bold py-4 px-8 tracking-widest transition-opacity active:opacity-70 uppercase"
                >
                  VIEW SYLLABUS
                </button>
              </div>
            </section>

          </div>

          {/* Mobile BottomNavBar Component */}
          <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center bg-surface border-t border-champagne-taupe px-4 pb-2 z-50 h-20">
            <Link
              className="flex flex-col items-center justify-center text-royal-navy dark:text-majestic-gold border-t-2 border-majestic-gold pt-2 h-full w-1/4 scale-95 transition-transform"
              href="/academy/portal/courses"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
              <span className="font-bold text-[10px] mt-1 uppercase tracking-wider">Courses</span>
            </Link>
            <a className="flex flex-col items-center justify-center text-warm-slate pt-2 h-full w-1/4 hover:text-royal-navy transition-colors" href="#">
              <span className="material-symbols-outlined">library_books</span>
              <span className="font-bold text-[10px] mt-1 uppercase tracking-wider">Resources</span>
            </a>
            <Link
              className="flex flex-col items-center justify-center text-warm-slate pt-2 h-full w-1/4 hover:text-royal-navy transition-colors"
              href="/academy/portal/grades"
            >
              <span className="material-symbols-outlined">grade</span>
              <span className="font-bold text-[10px] mt-1 uppercase tracking-wider">Grades</span>
            </Link>
            <Link
              className="flex flex-col items-center justify-center text-warm-slate pt-2 h-full w-1/4 hover:text-royal-navy transition-colors"
              href="/academy/portal/profile"
            >
              <span className="material-symbols-outlined">person</span>
              <span className="font-bold text-[10px] mt-1 uppercase tracking-wider">Profile</span>
            </Link>
          </nav>
        </main>

      </div>
    </div>
  );
}
