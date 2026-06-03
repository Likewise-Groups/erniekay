"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ProfileSettingsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("SAVE ALL CHANGES");

  // Form states
  const [fullName, setFullName] = useState("Julianna V. Sterling");
  const [email, setEmail] = useState("j.sterling@splendoracademy.edu");
  const [bio, setBio] = useState(
    "Aspiring bridal makeup artist and aesthetician specializing in high-definition editorial looks. Focused on blending classical beauty standards with modern structural techniques."
  );
  
  // Toggles
  const [portfolioVisibility, setPortfolioVisibility] = useState(true);
  const [courseUpdates, setCourseUpdates] = useState(true);
  const [gradeAlerts, setGradeAlerts] = useState(true);
  const [academyNews, setAcademyNews] = useState(false);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Input focus states for color changes
  const [focusFields, setFocusFields] = useState<{ [key: string]: boolean }>({});

  const sidebarLinks = [
    { label: "Dashboard", href: "/academy/portal/dashboard", icon: "dashboard" },
    { label: "My Courses", href: "/academy/portal/courses", icon: "auto_stories" },
    { label: "Schedule", href: "#", icon: "calendar_month" },
    { label: "Grades", href: "/academy/portal/grades", icon: "grade" },
    { label: "Profile", href: "/academy/portal/profile", icon: "person", active: true },
  ];

  const handleFocus = (field: string) => {
    setFocusFields((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field: string) => {
    setFocusFields((prev) => ({ ...prev, [field]: false }));
  };

  const handleSaveAll = () => {
    setSaving(true);
    setSaveStatus("SAVING...");
    setTimeout(() => {
      setSaveStatus("CHANGES SAVED");
      setSaving(false);
      setTimeout(() => {
        setSaveStatus("SAVE ALL CHANGES");
      }, 2000);
    }, 1200);
  };

  const handleUpdatePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill in all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }
    alert("Password updated successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handlePhotoChange = () => {
    alert("Photo upload feature is currently in demonstration mode.");
  };

  return (
    <div className="bg-surface text-on-surface font-[family-name:var(--font-montserrat)] min-h-screen">
      
      {/* Global Layout Wrapper */}
      <div className="flex min-h-screen overflow-hidden">
        
        {/* ── DESKTOP SideNavBar Shell ── */}
        <aside className="hidden md:flex flex-col h-full py-8 bg-royal-navy dark:bg-primary-container docked left-0 h-full w-64 fixed z-50 text-white">
          <div className="px-6 mb-10">
            <h1 className="font-[family-name:var(--font-eb-garamond)] text-[28px] font-semibold text-majestic-gold">Academy Portal</h1>
            <p className="font-[family-name:var(--font-montserrat)] text-[10px] text-alabaster-white/60 tracking-widest mt-1 uppercase">STUDENT ACCESS</p>
          </div>
          <nav className="flex-grow space-y-1">
            {sidebarLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`flex items-center px-6 py-4 transition-all ${
                  link.active
                    ? "text-majestic-gold border-l-2 border-majestic-gold bg-white/5 font-bold"
                    : "text-alabaster-white/70 hover:bg-white/10 hover:text-majestic-gold"
                }`}
              >
                <span className="material-symbols-outlined mr-3">{link.icon}</span>
                <span className="font-[family-name:var(--font-montserrat)] text-[12px] uppercase font-bold tracking-wider">{link.label}</span>
              </Link>
            ))}
          </nav>
          <div className="px-6 pt-6 border-t border-white/10 space-y-1">
            <a className="flex items-center py-3 text-alabaster-white/70 hover:text-majestic-gold transition-all" href="#">
              <span className="material-symbols-outlined mr-3 text-sm">settings</span>
              <span className="font-[family-name:var(--font-montserrat)] text-[10px] uppercase font-bold tracking-wider">Settings</span>
            </a>
            <Link className="flex items-center py-3 text-alabaster-white/70 hover:text-majestic-gold transition-all" href="/academy/portal">
              <span className="material-symbols-outlined mr-3 text-sm">logout</span>
              <span className="font-[family-name:var(--font-montserrat)] text-[10px] uppercase font-bold tracking-wider">Logout</span>
            </Link>
          </div>
        </aside>

        {/* ── MOBILE SideNavBar Drawer Menu Overlay ── */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden bg-midnight-ink/80 backdrop-blur-sm">
            <div className="relative w-64 bg-royal-navy text-white flex flex-col p-6 h-full transition-transform duration-300">
              <div className="flex justify-between items-center mb-8">
                <h1 className="font-[family-name:var(--font-eb-garamond)] text-[22px] font-semibold text-majestic-gold">
                  Academy Portal
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

        {/* ── Main Content Area ── */}
        <main className="flex-grow md:ml-64 flex flex-col min-h-screen">
          
          {/* TopAppBar */}
          <header className="flex justify-between items-center px-6 md:px-16 h-16 w-full bg-surface border-b border-outline-variant sticky top-0 z-40">
            <div className="flex items-center gap-4">
              <span
                onClick={() => setMobileMenuOpen(true)}
                className="material-symbols-outlined md:hidden text-royal-navy cursor-pointer"
              >
                menu
              </span>
              <h2 className="font-[family-name:var(--font-eb-garamond)] text-[20px] md:text-[24px] font-semibold text-royal-navy leading-none">
                Erniekay Splendor Academy
              </h2>
            </div>
            <div className="flex items-center gap-6">
              <span className="material-symbols-outlined text-royal-navy cursor-pointer hover:text-majestic-gold transition-colors">
                notifications
              </span>
              <span className="material-symbols-outlined text-royal-navy cursor-pointer hover:text-majestic-gold transition-colors">
                help_outline
              </span>
              <div className="w-8 h-8 rounded-full bg-royal-navy overflow-hidden relative">
                <Image
                  alt="Student Profile"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAt8trEQjAQzgKM_tyLKLysIFKUy_Aoo87sICfRNivH9hKnQ4SurlxztUtfRzAZPqP9veR7xWGX-hWPFj7AgptJkG_v1xclOAL-h7MN3WZ-015Asx2cPMabqlLycy5z466RcfoC6S9zKxarW3BD-Rqe6sI2_o3lr-5U1fzW6Ln5CGB39QA5c-0eD_cXgWIJ5fMLqUiNzqkIE4tET-0MmMw8bi5oO_aLGT3k2LD8jwHbZ9UOo7EfO7G3kYLMv1RlyNOAK64oadhLFNo"
                  fill
                  unoptimized
                />
              </div>
            </div>
          </header>

          {/* Page Content Canvas */}
          <div className="max-w-[1280px] w-full mx-auto px-6 md:px-16 py-12 md:py-16 flex-grow">
            
            {/* Page Header Section */}
            <section className="mb-16">
              <h3 className="font-[family-name:var(--font-eb-garamond)] text-[48px] leading-[56px] text-royal-navy mb-4 font-semibold">
                Profile Settings
              </h3>
              <p className="font-[family-name:var(--font-montserrat)] text-sm text-warm-slate max-w-2xl leading-relaxed">
                Manage your professional student record, academic standing, and digital presence within the academy. These details ensure your credentials remain verified and your portfolio is accurately represented to potential clients and industry partners.
              </p>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Personal Identity & Credentials */}
              <div className="lg:col-span-8 space-y-12">
                
                {/* Personal Identity Section */}
                <section className="bg-white p-8 md:p-10 border border-outline-variant">
                  <h4 className="font-[family-name:var(--font-eb-garamond)] text-[28px] font-semibold text-royal-navy mb-8">
                    Personal Identity
                  </h4>
                  <div className="flex flex-col md:flex-row gap-10 items-start">
                    {/* Profile Photo Upload */}
                    <div className="relative group flex-shrink-0">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-majestic-gold p-1">
                        <Image
                          alt="Profile"
                          className="w-full h-full object-cover rounded-full"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDW0dE-eC-QJfJ6atjNZiq7WM0V88JnWRGdlsDhAt4ctrNOMtQP4RX8UACAUSWjvGQvlECu0cqpzd8bk5uowTxMJMnX30Ew3d_NZBBda7lVb8eF_b-zcAypraq9Qmqmul9n9_sqgWAaynXVeVkxaLllklkQUN1_j2djd1xlWa_hhfpB2hVaBmeq0vNl6K8RUsLaQh3hPUmPB_mkv5BYidTzYOzDDxiS_U2gKC9qxaGiW84fyfShCDZsKgf0Dz8FuxX5Q1wNOdoxtOI"
                          width={128}
                          height={128}
                          unoptimized
                        />
                      </div>
                      <button
                        onClick={handlePhotoChange}
                        className="mt-4 w-full font-[family-name:var(--font-montserrat)] text-[10px] text-royal-navy border border-royal-navy py-2 hover:bg-royal-navy hover:text-majestic-gold transition-all font-bold tracking-wider"
                      >
                        CHANGE PHOTO
                      </button>
                    </div>

                    <div className="flex-grow space-y-8 w-full">
                      <div className="relative">
                        <label
                          className={`block font-[family-name:var(--font-montserrat)] text-[12px] font-bold mb-2 tracking-widest transition-colors duration-300 ${
                            focusFields.name ? "text-majestic-gold" : "text-royal-navy"
                          }`}
                        >
                          FULL NAME
                        </label>
                        <input
                          className="w-full border-b border-champagne-taupe bg-transparent py-2 text-royal-navy text-sm focus:outline-none focus:border-royal-navy transition-colors"
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          onFocus={() => handleFocus("name")}
                          onBlur={() => handleBlur("name")}
                        />
                      </div>
                      <div className="relative">
                        <label
                          className={`block font-[family-name:var(--font-montserrat)] text-[12px] font-bold mb-2 tracking-widest transition-colors duration-300 ${
                            focusFields.email ? "text-majestic-gold" : "text-royal-navy"
                          }`}
                        >
                          CONTACT EMAIL
                        </label>
                        <input
                          className="w-full border-b border-champagne-taupe bg-transparent py-2 text-royal-navy text-sm focus:outline-none focus:border-royal-navy transition-colors"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onFocus={() => handleFocus("email")}
                          onBlur={() => handleBlur("email")}
                        />
                      </div>
                      <div className="relative">
                        <label
                          className={`block font-[family-name:var(--font-montserrat)] text-[12px] font-bold mb-2 tracking-widest transition-colors duration-300 ${
                            focusFields.bio ? "text-majestic-gold" : "text-royal-navy"
                          }`}
                        >
                          PROFESSIONAL BIO
                        </label>
                        <textarea
                          className="w-full border-b border-champagne-taupe bg-transparent py-2 text-royal-navy text-sm focus:outline-none focus:border-royal-navy transition-colors resize-none"
                          rows={4}
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          onFocus={() => handleFocus("bio")}
                          onBlur={() => handleBlur("bio")}
                        ></textarea>
                        <p className="text-[11px] text-warm-slate mt-2 italic">
                          This bio will be displayed in the Academy Student Gallery.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Academic Credentials Section */}
                <section className="bg-white p-8 md:p-10 border border-outline-variant">
                  <div className="flex justify-between items-center mb-8">
                    <h4 className="font-[family-name:var(--font-eb-garamond)] text-[28px] font-semibold text-royal-navy leading-none">
                      Academic Credentials
                    </h4>
                    <span className="bg-royal-navy/5 text-royal-navy font-[family-name:var(--font-montserrat)] text-[10px] font-bold tracking-widest px-3 py-1 border border-royal-navy/10 uppercase">
                      VERIFIED STUDENT
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-4 bg-alabaster-white border border-outline-variant/30">
                      <label className="block font-[family-name:var(--font-montserrat)] text-[10px] text-warm-slate mb-1 font-bold tracking-wider uppercase">
                        STUDENT ID
                      </label>
                      <p className="font-bold text-royal-navy text-sm">SA-99283-E</p>
                    </div>
                    <div className="p-4 bg-alabaster-white border border-outline-variant/30">
                      <label className="block font-[family-name:var(--font-montserrat)] text-[10px] text-warm-slate mb-1 font-bold tracking-wider uppercase">
                        ENROLLMENT DATE
                      </label>
                      <p className="font-bold text-royal-navy text-sm">Sept 2023</p>
                    </div>
                    <div className="p-4 bg-alabaster-white border border-outline-variant/30 md:col-span-2">
                      <label className="block font-[family-name:var(--font-montserrat)] text-[10px] text-warm-slate mb-1 font-bold tracking-wider uppercase">
                        CURRENT PROGRAM
                      </label>
                      <p className="font-[family-name:var(--font-eb-garamond)] text-xl text-royal-navy font-semibold">
                        Advanced Masterclass in Bridal Artistry
                      </p>
                    </div>
                  </div>
                  <div className="mt-10 flex items-center justify-between py-6 border-t border-champagne-taupe/20">
                    <div>
                      <p className="font-bold text-royal-navy text-sm">Public Portfolio Visibility</p>
                      <p className="text-xs text-warm-slate leading-relaxed">
                        Allow recruiters and clients to see your profile in the directory.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={portfolioVisibility}
                        onChange={(e) => setPortfolioVisibility(e.target.checked)}
                      />
                      <div className="w-12 h-6 bg-outline-variant rounded-full transition-colors peer peer-checked:bg-royal-navy flex items-center px-1">
                        <div className="w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6 transform duration-300 peer-checked:bg-majestic-gold"></div>
                      </div>
                    </label>
                  </div>
                </section>
              </div>

              {/* Right Column: Security & Preferences */}
              <div className="lg:col-span-4 space-y-12">
                
                {/* Security & Access Section */}
                <section className="bg-white p-8 border border-outline-variant">
                  <h4 className="font-[family-name:var(--font-eb-garamond)] text-2xl text-royal-navy mb-6 font-semibold">
                    Security &amp; Access
                  </h4>
                  <div className="space-y-6">
                    <div>
                      <label className="block font-[family-name:var(--font-montserrat)] text-[12px] font-bold text-royal-navy mb-2 tracking-widest">
                        CURRENT PASSWORD
                      </label>
                      <input
                        className="w-full border-b border-champagne-taupe bg-transparent py-2 text-royal-navy text-sm focus:outline-none focus:border-royal-navy transition-colors"
                        placeholder="••••••••"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block font-[family-name:var(--font-montserrat)] text-[12px] font-bold text-royal-navy mb-2 tracking-widest">
                        NEW PASSWORD
                      </label>
                      <input
                        className="w-full border-b border-champagne-taupe bg-transparent py-2 text-royal-navy text-sm focus:outline-none focus:border-royal-navy transition-colors"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block font-[family-name:var(--font-montserrat)] text-[12px] font-bold text-royal-navy mb-2 tracking-widest">
                        CONFIRM NEW PASSWORD
                      </label>
                      <input
                        className="w-full border-b border-champagne-taupe bg-transparent py-2 text-royal-navy text-sm focus:outline-none focus:border-royal-navy transition-colors"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                    <button
                      onClick={handleUpdatePassword}
                      className="w-full bg-majestic-gold text-royal-navy font-[family-name:var(--font-montserrat)] py-4 mt-4 hover:opacity-90 transition-all flex items-center justify-center gap-2 font-bold tracking-widest text-[11px] uppercase"
                    >
                      UPDATE PASSWORD
                    </button>
                    <div className="mt-8 pt-6 border-t border-champagne-taupe/20">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-premium-green" style={{ fontVariationSettings: "'FILL' 1" }}>
                            verified_user
                          </span>
                          <span className="font-bold text-sm text-royal-navy">Two-Factor Auth</span>
                        </div>
                        <span className="text-[10px] font-[family-name:var(--font-montserrat)] font-bold text-premium-green tracking-widest uppercase">
                          ENABLED
                        </span>
                      </div>
                      <p className="text-[11px] text-warm-slate leading-relaxed">
                        Your account is secured with a secondary verification code.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Notification Preferences Section */}
                <section className="bg-white p-8 border border-outline-variant">
                  <h4 className="font-[family-name:var(--font-eb-garamond)] text-2xl text-royal-navy mb-6 font-semibold">
                    Notifications
                  </h4>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-royal-navy">Course Updates</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={courseUpdates}
                          onChange={(e) => setCourseUpdates(e.target.checked)}
                        />
                        <div className="w-10 h-5 bg-outline-variant rounded-full transition-colors peer peer-checked:bg-royal-navy flex items-center px-0.5">
                          <div className="w-3.5 h-3.5 bg-white rounded-full transition-transform peer-checked:translate-x-5 transform duration-300"></div>
                        </div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-royal-navy">Grade Alerts</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={gradeAlerts}
                          onChange={(e) => setGradeAlerts(e.target.checked)}
                        />
                        <div className="w-10 h-5 bg-outline-variant rounded-full transition-colors peer peer-checked:bg-royal-navy flex items-center px-0.5">
                          <div className="w-3.5 h-3.5 bg-white rounded-full transition-transform peer-checked:translate-x-5 transform duration-300"></div>
                        </div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-royal-navy">Academy News</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={academyNews}
                          onChange={(e) => setAcademyNews(e.target.checked)}
                        />
                        <div className="w-10 h-5 bg-outline-variant rounded-full transition-colors peer peer-checked:bg-royal-navy flex items-center px-0.5">
                          <div className="w-3.5 h-3.5 bg-white rounded-full transition-transform peer-checked:translate-x-5 transform duration-300"></div>
                        </div>
                      </label>
                    </div>
                  </div>
                </section>

                {/* Save Changes CTA */}
                <div className="pt-4">
                  <button
                    onClick={handleSaveAll}
                    disabled={saving}
                    className="w-full bg-royal-navy text-majestic-gold font-[family-name:var(--font-montserrat)] py-5 border border-majestic-gold hover:bg-royal-navy/90 transition-all flex items-center justify-center gap-3 font-bold tracking-widest text-[11px] uppercase"
                  >
                    {saveStatus}
                  </button>
                  <p className="text-center text-[11px] text-warm-slate mt-4">Last updated: October 24, 2023</p>
                </div>

              </div>

            </div>

          </div>

          {/* Footer (Shared Component) */}
          <footer className="mt-auto bg-alabaster-white border-t border-outline-variant w-full">
            <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-16 py-8 w-full">
              <div className="mb-4 md:mb-0">
                <span className="font-[family-name:var(--font-montserrat)] text-[12px] font-bold text-royal-navy uppercase tracking-wider">
                  © 2024 Erniekay Splendor Beauty Academy
                </span>
              </div>
              <div className="flex gap-8">
                <a className="text-sm text-warm-slate hover:text-majestic-gold transition-colors" href="#">Academic Policy</a>
                <a className="text-sm text-warm-slate hover:text-majestic-gold transition-colors" href="#">Student Handbook</a>
                <a className="text-sm text-warm-slate hover:text-majestic-gold transition-colors" href="#">Support</a>
              </div>
            </div>
          </footer>

        </main>

      </div>

    </div>
  );
}
