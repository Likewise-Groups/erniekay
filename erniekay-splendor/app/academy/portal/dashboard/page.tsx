"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function StudentDashboardPage() {
  const [toastVisible, setToastVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Show toast message shortly after mount, then hide it after 3 seconds
    const showTimer = setTimeout(() => setToastVisible(true), 800);
    const hideTimer = setTimeout(() => setToastVisible(false), 3800);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const menuItems = [
    { label: "My Courses", href: "/academy/portal/courses", icon: "school", active: false },
    { label: "Schedule", href: "/academy/portal/schedule", icon: "calendar_today", active: false },
    { label: "Grades", href: "/academy/portal/grades", icon: "grade", active: false },
    { label: "Profile", href: "/academy/portal/profile", icon: "person", active: false },
  ];

  return (
    <div className="font-[family-name:var(--font-montserrat)] text-royal-navy bg-[#F5F5F5] min-h-screen">
      
      {/* ── Desktop SideNavBar Navigation ── */}
      <aside className="fixed left-0 top-0 h-full hidden md:flex flex-col z-40 bg-royal-navy w-64 text-white">
        <div className="p-6">
          <div className="relative w-52 h-32 -ml-2">
            <Image 
              src="/erniekayacademylogo.jpeg" 
              alt="Erniekay Academy Logo" 
              fill 
              className="object-contain object-left" 
              unoptimized
            />
          </div>
        </div>
        <div className="px-6 py-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-majestic-gold flex items-center justify-center">
              <span className="material-symbols-outlined text-royal-navy">person</span>
            </div>
            <div>
              <p className="font-[family-name:var(--font-montserrat)] text-[10px] uppercase font-bold text-majestic-gold tracking-wider">
                Welcome back
              </p>
              <p className="font-[family-name:var(--font-montserrat)] text-[14px] font-bold text-alabaster-white/90">
                Academy Student
              </p>
            </div>
          </div>
        </div>
        <nav className="flex-grow">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-4 py-4 px-6 cursor-pointer transition-all ${
                item.active
                  ? "text-majestic-gold border-r-2 border-majestic-gold bg-primary-container"
                  : "text-alabaster-white/70 hover:bg-primary-container hover:text-majestic-gold"
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-[family-name:var(--font-montserrat)] text-[12px] uppercase font-bold tracking-wider">
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
        <div className="p-6 border-t border-alabaster-white/10">
          <button className="w-full py-3 bg-majestic-gold text-royal-navy font-[family-name:var(--font-montserrat)] text-[12px] uppercase tracking-widest font-bold hover:brightness-110 transition-all">
            Enroll in New Course
          </button>
        </div>
        <div className="mb-8">
          <div className="flex items-center gap-4 py-4 px-6 cursor-pointer text-alabaster-white/70 hover:bg-primary-container hover:text-majestic-gold transition-all">
            <span className="material-symbols-outlined">settings</span>
            <span className="font-[family-name:var(--font-montserrat)] text-[12px] uppercase font-bold tracking-wider">
              Settings
            </span>
          </div>
          <Link
            href="/academy/portal"
            className="flex items-center gap-4 py-4 px-6 cursor-pointer text-alabaster-white/70 hover:bg-primary-container hover:text-majestic-gold transition-all"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="font-[family-name:var(--font-montserrat)] text-[12px] uppercase font-bold tracking-wider">
              Logout
            </span>
          </Link>
        </div>
      </aside>

      {/* ── Mobile SideNavBar Drawer Menu Overlay ── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-midnight-ink/80 backdrop-blur-sm">
          <div className="relative w-64 bg-royal-navy text-white flex flex-col p-6 h-full transition-transform duration-300">
            <div className="flex justify-between items-center mb-8">
              <div className="relative w-48 h-24">
                <Image 
                  src="/erniekayacademylogo.jpeg" 
                  alt="Erniekay Academy Logo" 
                  fill 
                  className="object-contain object-left" 
                  unoptimized
                />
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-white hover:text-majestic-gold"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <nav className="flex-grow space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-4 py-3 px-4 cursor-pointer rounded transition-all ${
                    item.active
                      ? "text-majestic-gold bg-primary-container"
                      : "text-alabaster-white/70 hover:bg-primary-container"
                  }`}
                >
                  <span className="material-symbols-outlined">{item.icon}</span>
                  <span className="font-[family-name:var(--font-montserrat)] text-[12px] uppercase font-bold tracking-wider">
                    {item.label}
                  </span>
                </Link>
              ))}
            </nav>
            <div className="border-t border-white/10 pt-4 space-y-4">
              <button className="w-full py-3 bg-majestic-gold text-royal-navy font-[family-name:var(--font-montserrat)] text-[12px] uppercase tracking-widest font-bold hover:brightness-110 transition-all">
                Enroll in New Course
              </button>
              <Link
                href="/academy/portal"
                className="flex items-center gap-4 py-3 px-4 cursor-pointer text-alabaster-white/70 hover:bg-primary-container"
              >
                <span className="material-symbols-outlined">logout</span>
                <span className="font-[family-name:var(--font-montserrat)] text-[12px] uppercase font-bold tracking-wider">
                  Logout
                </span>
              </Link>
            </div>
          </div>
          {/* Close tap listener */}
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* ── Main Canvas ── */}
      <main className="md:ml-64 min-h-screen bg-alabaster-white flex flex-col">
        {/* Top Bar */}
        <header className="sticky top-0 w-full h-16 bg-surface z-30 flex justify-between items-center px-6 md:px-8 border-b border-champagne-taupe/30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="material-symbols-outlined md:hidden text-royal-navy active:opacity-80 transition-opacity"
            >
              menu
            </button>
            <span className="font-[family-name:var(--font-eb-garamond)] text-[22px] md:text-[28px] font-semibold text-royal-navy">
              Dashboard
            </span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-royal-navy cursor-pointer hover:text-majestic-gold transition-colors">
                notifications
              </span>
              <span className="material-symbols-outlined text-royal-navy cursor-pointer hover:text-majestic-gold transition-colors">
                help
              </span>
            </div>
            <div className="w-10 h-10 border border-champagne-taupe overflow-hidden relative">
              <Image
                alt="Student profile avatar headshot"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBB09Vq84XiTvXnuTQSz9pa6ycihKxjASgk8hC9eiiMZDrud7_RcmNmGiluW1xU3H5mgkafZuIlql58uPyYGHV1f8mmRym39tKSAAyrt4afkKZhtffAuxyR3HAKmSdyx8kFPdhkuGu4SiOl4Dfkd7F4cGnxUBT1AwHqCTScedp20t8Espko9Sf1gRcbR_LV6TI00w1pIlK-5h5O-o7CnxC-xN9v5VAdZwMuBO0etnhVWDZf_KcV93bzlZAgy_wfjoMmDCUDKjr2wZY"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        </header>

        {/* Dashboard Grid Content */}
        <div className="max-w-[1280px] w-full mx-auto p-6 md:p-8 space-y-12 flex-grow">
          {/* Welcome Header and Stats summary */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-7 space-y-2">
              <p className="font-[family-name:var(--font-montserrat)] text-[10px] uppercase font-bold text-champagne-taupe tracking-[0.2em]">
                ACADEMY EXCELLENCE
              </p>
              <h2 className="font-[family-name:var(--font-eb-garamond)] text-[36px] md:text-[44px] leading-tight text-royal-navy font-semibold">
                Welcome back, Isabella
              </h2>
              <p className="text-warm-slate max-w-lg text-[14px]">
                Your journey to bridal artistry mastery is 65% complete. Today&apos;s sessions are ready for your expertise.
              </p>
            </div>
            <div className="lg:col-span-5 grid grid-cols-3 gap-4">
              <div className="bg-white border border-champagne-taupe/20 p-6 text-center hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                <p className="font-[family-name:var(--font-eb-garamond)] text-[28px] font-bold text-royal-navy">4</p>
                <p className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase font-bold tracking-wider text-champagne-taupe">
                  Modules
                </p>
              </div>
              <div className="bg-white border border-champagne-taupe/20 p-6 text-center hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                <p className="font-[family-name:var(--font-eb-garamond)] text-[28px] font-bold text-royal-navy">2</p>
                <p className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase font-bold tracking-wider text-champagne-taupe">
                  Certs
                </p>
              </div>
              <div className="bg-white border border-champagne-taupe/20 p-6 text-center hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                <p className="font-[family-name:var(--font-eb-garamond)] text-[28px] font-bold text-royal-navy">120</p>
                <p className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase font-bold tracking-wider text-champagne-taupe">
                  Hours
                </p>
              </div>
            </div>
          </section>

          {/* Asymmetric Core Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Center Column: Coursework and Schedules */}
            <div className="lg:col-span-8 space-y-12">
              {/* Continue Learning card */}
              <article>
                <h3 className="font-[family-name:var(--font-eb-garamond)] text-[22px] font-semibold mb-6 border-b border-champagne-taupe/20 pb-4">
                  Continue Learning
                </h3>
                <div className="group relative bg-white border border-champagne-taupe/30 overflow-hidden transition-all hover:border-majestic-gold hover:shadow-lg">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/2 h-64 md:h-auto overflow-hidden relative min-h-[220px]">
                      <Image
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        alt="Bridal Artistry beauty kits arranged on high-end marble surface"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDX2QxvzoCS5mCen_McxX3wtt4seIBbrXtkyhnUXW8TIglOohVjRTw1_Z1G7m0-VhFWgr2fSZo-g8qVB2pCoPsSgd642PecC9gLwwtDQnp8RPQM_gKt52EPsUZwgWBpu9fhQIzBSZvaAOwi-p1rXu7Q6qnjCg6n_vwL-RR456mMuZeaDk2yMjwz8nmcSHqj5HZUqAPZhYsDLxLQKTW0zz4fXlTsUVqs2Q0Ap5C0U76Q9idMWiq4_-7Z6VAsaB443GP6xSCSH_PWI2U"
                        fill
                        unoptimized
                      />
                    </div>
                    <div className="md:w-1/2 p-8 flex flex-col justify-between space-y-6">
                      <div>
                        <p className="font-[family-name:var(--font-montserrat)] text-[10px] font-bold text-majestic-gold mb-2 tracking-widest uppercase">
                          PRIMARY COURSE
                        </p>
                        <h4 className="font-[family-name:var(--font-eb-garamond)] text-[24px] font-semibold text-royal-navy leading-tight">
                          Masterclass in Bridal Artistry
                        </h4>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between font-[family-name:var(--font-montserrat)] text-[10px] tracking-widest font-bold text-warm-slate">
                          <span>COURSE PROGRESS</span>
                          <span>65%</span>
                        </div>
                        <div className="w-full h-1 bg-[#F5F5F5]">
                          <div className="h-full bg-majestic-gold transition-all duration-1000 ease-out" style={{ width: "65%" }}></div>
                        </div>
                      </div>
                      <button className="bg-royal-navy text-majestic-gold px-8 py-3 border border-majestic-gold font-[family-name:var(--font-montserrat)] text-[12px] uppercase font-bold tracking-widest flex items-center justify-center gap-2 hover:bg-midnight-ink active:scale-95 transition-all">
                        RESUME MODULE <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                      </button>
                    </div>
                  </div>
                </div>
              </article>

              {/* Schedule cards */}
              <article>
                <div className="flex justify-between items-end mb-6 border-b border-champagne-taupe/20 pb-4">
                  <h3 className="font-[family-name:var(--font-eb-garamond)] text-[22px] font-semibold text-royal-navy">
                    Upcoming Sessions
                  </h3>
                  <button className="font-[family-name:var(--font-montserrat)] text-[10px] font-bold text-champagne-taupe hover:text-majestic-gold transition-colors tracking-widest uppercase">
                    VIEW FULL CALENDAR
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Class 1 */}
                  <div className="p-6 bg-white border border-champagne-taupe/20 flex gap-6 items-center hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                    <div className="text-center border-r border-champagne-taupe/20 pr-6">
                      <p className="font-[family-name:var(--font-montserrat)] text-[10px] font-bold text-majestic-gold tracking-widest">TODAY</p>
                      <p className="font-[family-name:var(--font-eb-garamond)] text-[24px] font-bold text-royal-navy">2</p>
                      <p className="font-[family-name:var(--font-montserrat)] text-[9px] font-bold text-warm-slate">PM</p>
                    </div>
                    <div>
                      <h5 className="font-[family-name:var(--font-montserrat)] text-[14px] font-bold text-royal-navy">
                        Editorial Hair Styling
                      </h5>
                      <p className="font-[family-name:var(--font-montserrat)] text-[10px] font-bold text-champagne-taupe uppercase tracking-wider mt-1">
                        Studio A • Masterclass
                      </p>
                    </div>
                  </div>
                  {/* Class 2 */}
                  <div className="p-6 bg-white border border-champagne-taupe/20 flex gap-6 items-center hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                    <div className="text-center border-r border-champagne-taupe/20 pr-6">
                      <p className="font-[family-name:var(--font-montserrat)] text-[10px] font-bold text-warm-slate tracking-widest">TOMW</p>
                      <p className="font-[family-name:var(--font-eb-garamond)] text-[24px] font-bold text-royal-navy">10</p>
                      <p className="font-[family-name:var(--font-montserrat)] text-[9px] font-bold text-warm-slate">AM</p>
                    </div>
                    <div>
                      <h5 className="font-[family-name:var(--font-montserrat)] text-[14px] font-bold text-royal-navy">
                        Color Theory &amp; Aesthetics
                      </h5>
                      <p className="font-[family-name:var(--font-montserrat)] text-[10px] font-bold text-champagne-taupe uppercase tracking-wider mt-1">
                        Digital Lab • Seminar
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            </div>

            {/* Right Column: Widgets */}
            <div className="lg:col-span-4 space-y-8">
              {/* Achievements Widget */}
              <aside className="bg-royal-navy text-alabaster-white p-8">
                <h3 className="font-[family-name:var(--font-eb-garamond)] text-[22px] font-semibold text-majestic-gold mb-6">
                  Recent Achievements
                </h3>
                <div className="space-y-6">
                  {/* Achievement 1 */}
                  <div className="flex gap-4 items-start">
                    <div className="mt-1 p-2 border border-majestic-gold rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-majestic-gold text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                        workspace_premium
                      </span>
                    </div>
                    <div>
                      <p className="font-[family-name:var(--font-montserrat)] text-[13px] font-bold">
                        Perfect Score: Color Theory
                      </p>
                      <p className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-wider text-alabaster-white/50 mt-1">
                        AWARDED 2 DAYS AGO
                      </p>
                    </div>
                  </div>
                  {/* Achievement 2 */}
                  <div className="flex gap-4 items-start">
                    <div className="mt-1 p-2 border border-champagne-taupe rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-champagne-taupe text-lg">
                        history_edu
                      </span>
                    </div>
                    <div>
                      <p className="font-[family-name:var(--font-montserrat)] text-[13px] font-bold">
                        Graded: Wedding Radiance
                      </p>
                      <p className="font-[family-name:var(--font-montserrat)] text-[10px] font-bold text-majestic-gold mt-1 uppercase tracking-wider">
                        GRADE: 98% (A+)
                      </p>
                    </div>
                  </div>
                  {/* Achievement 3 (Locked) */}
                  <div className="flex gap-4 items-start opacity-50">
                    <div className="mt-1 p-2 border border-white/20 rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-white/40 text-lg">
                        lock
                      </span>
                    </div>
                    <div>
                      <p className="font-[family-name:var(--font-montserrat)] text-[13px] font-bold">
                        Luxury Consultant Badge
                      </p>
                      <p className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-wider text-white/50 mt-1">
                        NEXT MILESTONE
                      </p>
                    </div>
                  </div>
                </div>
                <button className="w-full mt-8 py-3 border border-white/20 font-[family-name:var(--font-montserrat)] text-[10px] tracking-widest uppercase font-bold hover:bg-white/10 transition-colors">
                  DOWNLOAD CERTIFICATES
                </button>
              </aside>

              {/* Master Tip Widget */}
              <div className="bg-white border border-champagne-taupe/20 p-8 space-y-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                <div className="h-40 bg-surface overflow-hidden -mx-8 -mt-8 mb-4 relative">
                  <Image
                    className="object-cover"
                    alt="Luxury beauty clinic workspace layout"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAuuq3x8eBsNsmcfczn0Pjz3HqmnrPflwRtxTy1Vpi39A3kEj_Fc_jTxdif0s_NNgRAsStTBmQ9KH1rEzBgoqdaK1Z047bmInKf9lJ-yRab_Nxb8HpIYbfq22vo4tKUwLYjk5N4VoQzi5Uqp32ARQ4poQd3jL_p4uKRYvveHjeBwGD3o6CHMCEO05R8iyhKqs1_B8hY_XQ1HVABIhvxXheVGHLq-IGxeiwz3-HitWlpzYSvqnLuh9qMT-O7X7p9Cw53uHfdTYOjbT0"
                    fill
                    unoptimized
                  />
                </div>
                <p className="font-[family-name:var(--font-montserrat)] text-[10px] font-bold text-champagne-taupe tracking-widest uppercase">
                  MASTER TIP
                </p>
                <h4 className="font-[family-name:var(--font-montserrat)] text-[15px] font-bold text-royal-navy">
                  The Ritual of Skin Preparation
                </h4>
                <p className="text-[13px] text-warm-slate leading-relaxed">
                  Luxury bridal artistry begins with the canvas. Access our exclusive video library on editorial skin prep routines.
                </p>
                <a
                  className="inline-block font-[family-name:var(--font-montserrat)] text-[10px] font-bold text-royal-navy border-b border-majestic-gold pb-1 hover:text-majestic-gold transition-colors tracking-widest uppercase"
                  href="#"
                >
                  WATCH RESOURCE
                </a>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* ── Slide-up Toast Notification micro-interaction ── */}
      <div
        className={`fixed bottom-8 right-8 bg-royal-navy text-majestic-gold px-8 py-4 border border-majestic-gold z-50 flex items-center gap-3 transition-all duration-500 shadow-xl ${
          toastVisible ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0 pointer-events-none"
        }`}
      >
        <span className="material-symbols-outlined">check_circle</span>
        <span className="font-[family-name:var(--font-montserrat)] text-[11px] uppercase tracking-wider font-bold">
          Syncing Dashboard Progress...
        </span>
      </div>

    </div>
  );
}
