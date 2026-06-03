"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface PreviewItem {
  id: string;
  src: string;
  name: string;
  starred: boolean;
  alt: string;
}

export default function AddToPortfolioPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // Form states
  const [projectTitle, setProjectTitle] = useState("");
  const [category, setCategory] = useState("Editorial High-Fashion");
  const [productKit, setProductKit] = useState("");
  const [artisticStatement, setArtisticStatement] = useState("");
  const [featurePublic, setFeaturePublic] = useState(true);

  // Previews list state
  const [previews, setPreviews] = useState<PreviewItem[]>([
    {
      id: "prev-1",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDWBdy8lFAcl0e4HevtzJLoOp7ZaLSU5yOp68F1RXYzJi50PC4JC7xyGW1E-YpthRqseQ6DS3ogWDnoCvMUPDZ3VSyibl_8F4rLtRF-d1SYEdqFnHQrxX7YpmpNKPz_BLnHF9F9VLEIU8JkvWEFJ25SQ-O2OjZssKex-TJzQEfEZxGBH_234HngoMcf-ey-tFaU-vzZ2SnRInJy12SbQ8oigKIcgKND5JL8SaiwoB5KsjXrN54qw1zZ1_fkB2NZBW8wvrjfNolNFhE",
      name: "Master_Look_01.jpg",
      starred: true,
      alt: "Professional bridal makeup artistry",
    },
    {
      id: "prev-2",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAYlMYWQbUBB3OD5OzSypgcUSVofytvrHi0YwT3FUjeBr2AnuSQghXryxooHp_3VjBFyShedOeO6I6ZAWGVmtllnH_GmA4mz0Ydn6kft17L_ssIAXkVSJlylCkV8L5tUN_XqgRMgLEre9QPhzT2Ux9SEDSygigwgSitlkTp2om8fsPmfydKIXlHVThzKzlluAmK6p4LwyOTcdmAscKWccVhcGY9VIOBXABEyrDl5hFmxZ6sBqHK06Q2S464O4aJVZOfm21o6WxvfDY",
      name: "Detail_Hair_02.jpg",
      starred: false,
      alt: "Intricate braided hairstyle",
    },
  ]);

  // Input focus states for color changes
  const [focusFields, setFocusFields] = useState<{ [key: string]: boolean }>({});

  const sidebarLinks = [
    { label: "Dashboard", href: "/academy/portal/dashboard", icon: "dashboard" },
    { label: "My Courses", href: "/academy/portal/courses", icon: "auto_stories", active: true },
    { label: "Grades", href: "/academy/portal/grades", icon: "grade" },
    { label: "Profile Settings", href: "/academy/portal/profile", icon: "person" },
  ];

  const handleFocus = (field: string) => {
    setFocusFields((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field: string) => {
    setFocusFields((prev) => ({ ...prev, [field]: false }));
  };

  const toggleStar = (id: string) => {
    setPreviews((prev) =>
      prev.map((item) => ({
        ...item,
        starred: item.id === id,
      }))
    );
  };

  const removePreview = (id: string) => {
    setPreviews((prev) => prev.filter((item) => item.id !== id));
  };

  const removeAllPreviews = () => {
    setPreviews([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle.trim()) {
      alert("Please provide a Project Title.");
      return;
    }
    alert("Project published successfully to your portfolio!");
    setProjectTitle("");
    setProductKit("");
    setArtisticStatement("");
  };

  return (
    <div className="bg-alabaster-white text-on-surface font-[family-name:var(--font-montserrat)] min-h-screen antialiased">
      <div className="flex min-h-screen">
        
        {/* ── DESKTOP SideNavBar ── */}
        <aside className="hidden md:flex flex-col h-screen w-64 bg-alabaster-white dark:bg-primary-container border-r border-outline-variant dark:border-warm-slate fixed left-0 top-0 z-50 text-royal-navy dark:text-white">
          <div className="flex flex-col h-full py-8 px-4">
            <div className="mb-10 px-2">
              <h1 className="font-[family-name:var(--font-eb-garamond)] text-[28px] leading-tight text-royal-navy dark:text-majestic-gold font-semibold">
                Erniekay Splendor
              </h1>
              <p className="font-[family-name:var(--font-montserrat)] text-[10px] uppercase font-bold text-champagne-taupe tracking-widest mt-1">
                Academy Portal
              </p>
            </div>
            <nav className="flex-1 space-y-2">
              {sidebarLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 transition-all duration-200 ${
                    link.active
                      ? "text-royal-navy dark:text-majestic-gold border-r-4 border-majestic-gold bg-surface-container-high font-bold"
                      : "text-warm-slate dark:text-on-surface-variant hover:text-royal-navy hover:bg-surface-container-highest dark:hover:bg-primary"
                  }`}
                >
                  <span className="material-symbols-outlined">{link.icon}</span>
                  <span className="font-[family-name:var(--font-montserrat)] text-[12px] uppercase font-bold tracking-wider">{link.label}</span>
                </Link>
              ))}
            </nav>
            <div className="mt-auto space-y-6">
              <button className="w-full py-4 bg-royal-navy text-majestic-gold border border-majestic-gold font-[family-name:var(--font-montserrat)] text-[12px] uppercase tracking-widest font-bold hover:bg-opacity-90 active:scale-95 transition-all">
                Book Training
              </button>
              <div className="pt-6 border-t border-outline-variant space-y-2">
                <a className="flex items-center gap-3 px-4 py-2 text-warm-slate hover:text-royal-navy transition-all" href="#">
                  <span className="material-symbols-outlined">help</span>
                  <span className="font-[family-name:var(--font-montserrat)] text-[12px] uppercase font-bold tracking-wider">Help Center</span>
                </a>
                <Link className="flex items-center gap-3 px-4 py-2 text-warm-slate hover:text-royal-navy transition-all" href="/academy/portal">
                  <span className="material-symbols-outlined">logout</span>
                  <span className="font-[family-name:var(--font-montserrat)] text-[12px] uppercase font-bold tracking-wider">Logout</span>
                </Link>
              </div>
            </div>
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
            </div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}

        {/* ── Main Content Area ── */}
        <main className="flex-grow md:ml-64 flex flex-col min-h-screen">
          
          {/* TopAppBar */}
          <header className="fixed top-0 w-full z-50 bg-background border-b border-outline-variant flex justify-between items-center px-6 h-16 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="text-royal-navy active:opacity-80 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <span className="font-[family-name:var(--font-eb-garamond)] text-xl text-royal-navy tracking-tighter uppercase font-semibold">
              Academy Elite
            </span>
            <button className="text-royal-navy active:opacity-80 active:scale-95 transition-all">
              <span className="material-symbols-outlined">notifications</span>
            </button>
          </header>

          {/* Desktop-only TopNavBar */}
          <header className="hidden md:flex justify-between items-center w-full px-8 h-20 bg-surface dark:bg-primary border-b border-outline-variant dark:border-warm-slate sticky top-0 z-40">
            <div className="flex items-center gap-4">
              <nav className="flex items-center gap-2 font-[family-name:var(--font-montserrat)] text-[12px] font-bold tracking-widest text-warm-slate uppercase">
                <Link className="hover:text-royal-navy" href="/academy/portal/dashboard">Portal</Link>
                <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                <span className="hover:text-royal-navy">Portfolio</span>
                <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                <span className="text-royal-navy font-bold">Add New Work</span>
              </nav>
            </div>
            <div className="flex items-center gap-6">
              <span className="material-symbols-outlined text-royal-navy cursor-pointer hover:bg-surface-container-low p-2 transition-colors duration-300">
                notifications
              </span>
              <div className="flex items-center gap-3 border-l border-outline-variant pl-6">
                <div className="text-right hidden sm:block">
                  <p className="font-[family-name:var(--font-montserrat)] text-[10px] uppercase font-bold text-champagne-taupe tracking-wider">Student Artist</p>
                  <p className="font-bold text-royal-navy text-[14px]">Elena Rossi</p>
                </div>
                <div className="w-10 h-10 bg-surface-container-high overflow-hidden border border-outline-variant relative">
                  <Image
                    alt="Elena Rossi Profile"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2NWpgATBGCuFP_jJc4pQOepLEUE5zEY8Rp8JAh_YwgGfspEGPaqn1BL1Y7QGlSV2IljIzVQc3x95H0O_qStLHgjXNb_8HgElK1LEq3xzoBufQ1jeLv8-HnHexyUA4NrzlIsBZN_8a4pRsKgvBH-IBqfHmII_HIsX18RqDf7-9eh-8ejtL5xsvEey4zhXqVPFZnCd2mkiH1P4obEtpyf61NcWcvI2aiu-mbXzI4QBHKq_TK78e9G35GttvjWZprbOLkrcl4dr1bUA"
                    fill
                    unoptimized
                  />
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="max-w-[1280px] mx-auto p-6 md:p-12 mt-16 md:mt-0 flex-grow">
            
            {/* Editorial Header */}
            <section className="pt-8 pb-10">
              <h1 className="font-[family-name:var(--font-eb-garamond)] text-[32px] md:text-[48px] text-royal-navy mb-2 font-semibold leading-tight">
                Add to Portfolio
              </h1>
              <p className="text-warm-slate max-w-xs md:max-w-2xl font-[family-name:var(--font-montserrat)] text-sm leading-relaxed">
                Curate your professional gallery. Showcase your transformation artistry and technical mastery to the world.
              </p>
            </section>

            {/* Content layout split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              
              {/* Left Column: Upload Zone & Previews */}
              <div className="lg:col-span-7 space-y-10">
                
                {/* Touch-Optimized Upload Zone */}
                <section>
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragOver(true);
                    }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragOver(false);
                      alert("File upload is currently in simulation mode.");
                    }}
                    className={`relative border-2 border-dashed border-champagne-taupe bg-white flex flex-col items-center justify-center py-12 px-6 text-center transition-colors duration-300 hover:bg-alabaster-white active:scale-[0.98] ${
                      isDragOver ? "bg-alabaster-white border-royal-navy" : ""
                    }`}
                  >
                    <input className="absolute inset-0 opacity-0 cursor-pointer" type="file" disabled />
                    <span className="material-symbols-outlined text-royal-navy text-4xl mb-4">
                      cloud_upload
                    </span>
                    <span className="font-bold text-royal-navy block text-sm">
                      Tap to Upload
                    </span>
                    <span className="text-warm-slate text-xs mt-1">
                      High-resolution JPG or PNG supported
                    </span>
                  </div>
                </section>

                {/* Previews State */}
                <section className="mb-12 overflow-hidden">
                  <div className="flex items-baseline justify-between mb-4">
                    <h2 className="font-[family-name:var(--font-montserrat)] text-[12px] font-bold text-royal-navy uppercase tracking-widest">
                      Upload Previews
                    </h2>
                    <span className="text-warm-slate text-xs">
                      {previews.length} of 5 slots
                    </span>
                  </div>
                  
                  {/* Horizontal Scroll layout for previews */}
                  <div className="flex gap-4 overflow-x-auto pb-4 -mx-1 px-1 scrollbar-hide">
                    {previews.map((preview) => (
                      <div
                        key={preview.id}
                        className="flex-none w-40 relative group"
                      >
                        <div className="aspect-[3/4] bg-surface-container-low overflow-hidden border border-outline-variant relative">
                          <Image
                            alt={preview.alt}
                            className="w-full h-full object-cover"
                            src={preview.src}
                            fill
                            unoptimized
                          />
                        </div>
                        <div className="absolute top-2 right-2 flex flex-col gap-2">
                          <button
                            type="button"
                            onClick={() => removePreview(preview.id)}
                            className="bg-white/90 p-1.5 shadow-sm active:scale-90 transition-transform flex items-center justify-center"
                          >
                            <span className="material-symbols-outlined text-royal-navy text-[20px]">close</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleStar(preview.id)}
                            className={`p-1.5 shadow-sm active:scale-90 transition-transform flex items-center justify-center ${
                              preview.starred ? "bg-majestic-gold" : "bg-white/90"
                            }`}
                          >
                            <span className="material-symbols-outlined text-royal-navy text-[20px]" style={{ fontVariationSettings: preview.starred ? "'FILL' 1" : "'FILL' 0" }}>
                              star
                            </span>
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    {/* Empty placeholder Thumbnail */}
                    <div className="flex-none w-40 aspect-[3/4] border border-dashed border-outline-variant flex items-center justify-center bg-surface-container-lowest">
                      <span className="material-symbols-outlined text-outline-variant">add_a_photo</span>
                    </div>
                  </div>
                </section>

              </div>

              {/* Right Column: Project Details Form */}
              <div className="lg:col-span-5">
                <section className="bg-white p-8 md:p-10 border border-outline-variant shadow-sm space-y-8">
                  <h2 className="font-[family-name:var(--font-montserrat)] text-[12px] font-bold text-royal-navy uppercase tracking-widest pb-4 border-b border-outline-variant">
                    Project Details
                  </h2>
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    
                    {/* Project Title */}
                    <div className="relative">
                      <label
                        className={`block font-[family-name:var(--font-montserrat)] text-[10px] font-bold uppercase mb-1 tracking-widest transition-colors duration-300 ${
                          focusFields.title ? "text-royal-navy" : "text-champagne-taupe"
                        }`}
                      >
                        Project Title
                      </label>
                      <input
                        className="w-full bg-white border-0 border-b border-champagne-taupe py-3 focus:ring-0 focus:border-royal-navy transition-colors placeholder:text-surface-variant text-sm font-semibold text-royal-navy"
                        placeholder="e.g. Midnight Gala Transformation"
                        type="text"
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                        onFocus={() => handleFocus("title")}
                        onBlur={() => handleBlur("title")}
                        required
                      />
                    </div>

                    {/* Technique/Category */}
                    <div className="relative">
                      <label
                        className={`block font-[family-name:var(--font-montserrat)] text-[10px] font-bold uppercase mb-1 tracking-widest transition-colors duration-300 ${
                          focusFields.category ? "text-royal-navy" : "text-champagne-taupe"
                        }`}
                      >
                        Technique/Category
                      </label>
                      <div className="relative">
                        <select
                          className="w-full bg-white border-0 border-b border-champagne-taupe py-3 pr-8 focus:ring-0 focus:border-royal-navy transition-colors appearance-none text-sm font-semibold text-royal-navy"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          onFocus={() => handleFocus("category")}
                          onBlur={() => handleBlur("category")}
                        >
                          <option value="">Select a Category</option>
                          <option value="Bridal Mastery">Bridal Mastery</option>
                          <option value="Editorial High-Fashion">Editorial High-Fashion</option>
                          <option value="Airbrush Artistry">Airbrush Artistry</option>
                          <option value="Period Makeup">Period Makeup</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-royal-navy">
                          expand_more
                        </span>
                      </div>
                    </div>

                    {/* Product Kit Used */}
                    <div className="relative">
                      <label
                        className={`block font-[family-name:var(--font-montserrat)] text-[10px] font-bold uppercase mb-1 tracking-widest transition-colors duration-300 ${
                          focusFields.kit ? "text-royal-navy" : "text-champagne-taupe"
                        }`}
                      >
                        Product Kit Used
                      </label>
                      <input
                        className="w-full bg-white border-0 border-b border-champagne-taupe py-3 focus:ring-0 focus:border-royal-navy transition-colors placeholder:text-surface-variant text-sm font-semibold text-royal-navy"
                        placeholder="e.g. Elite Bridal Kit, Dior Backstage"
                        type="text"
                        value={productKit}
                        onChange={(e) => setProductKit(e.target.value)}
                        onFocus={() => handleFocus("kit")}
                        onBlur={() => handleBlur("kit")}
                      />
                    </div>

                    {/* Artistic Statement */}
                    <div className="relative">
                      <label
                        className={`block font-[family-name:var(--font-montserrat)] text-[10px] font-bold uppercase mb-1 tracking-widest transition-colors duration-300 ${
                          focusFields.statement ? "text-royal-navy" : "text-champagne-taupe"
                        }`}
                      >
                        Artistic Statement
                      </label>
                      <textarea
                        className="w-full bg-white border border-champagne-taupe p-4 focus:ring-0 focus:border-royal-navy transition-colors placeholder:text-surface-variant text-sm font-medium text-royal-navy resize-none"
                        placeholder="Describe your creative vision and execution..."
                        rows={4}
                        value={artisticStatement}
                        onChange={(e) => setArtisticStatement(e.target.value)}
                        onFocus={() => handleFocus("statement")}
                        onBlur={() => handleBlur("statement")}
                      ></textarea>
                    </div>

                    {/* Feature Toggle */}
                    <div className="flex items-center justify-between p-4 bg-royal-navy text-white">
                      <div>
                        <span className="font-bold text-sm block">Feature on Public Gallery</span>
                        <span className="text-[11px] text-white/70">Allow recruiters and clients to see this project.</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={featurePublic}
                          onChange={(e) => setFeaturePublic(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full transition-colors peer peer-checked:bg-majestic-gold flex items-center px-0.5">
                          <div className="w-4 h-4 bg-white rounded-full transition-transform peer peer-checked:translate-x-5 peer-checked:bg-royal-navy"></div>
                        </div>
                      </label>
                    </div>

                    {/* Action button */}
                    <button
                      type="submit"
                      className="w-full bg-majestic-gold text-royal-navy font-bold py-5 flex justify-center items-center gap-2 active:scale-95 transition-all shadow-lg shadow-majestic-gold/20 text-sm uppercase tracking-widest"
                    >
                      Publish to Portfolio
                      <span className="material-symbols-outlined">auto_awesome</span>
                    </button>

                  </form>
                </section>
              </div>

            </div>
          </div>

          {/* BottomNavBar */}
          <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-safe bg-background border-t border-champagne-taupe h-20 z-50 md:hidden">
            <Link
              className="flex flex-col items-center justify-center text-warm-slate pt-2 hover:text-majestic-gold transition-all"
              href="/academy/portal/courses"
            >
              <span className="material-symbols-outlined">auto_stories</span>
              <span className="font-bold text-[10px] mt-1 uppercase tracking-wider">Courses</span>
            </Link>
            <a className="flex flex-col items-center justify-center text-warm-slate pt-2 hover:text-majestic-gold transition-all" href="#">
              <span className="material-symbols-outlined">calendar_month</span>
              <span className="font-bold text-[10px] mt-1 uppercase tracking-wider">Schedule</span>
            </a>
            <Link
              className="flex flex-col items-center justify-center text-warm-slate pt-2 hover:text-majestic-gold transition-all"
              href="/academy/portal/grades"
            >
              <span className="material-symbols-outlined">grade</span>
              <span className="font-bold text-[10px] mt-1 uppercase tracking-wider">Grades</span>
            </Link>
            <Link
              className="flex flex-col items-center justify-center text-majestic-gold border-t-2 border-majestic-gold -mt-px pt-2"
              href="/academy/portal/profile"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
              <span className="font-bold text-[10px] mt-1 uppercase tracking-wider">Profile</span>
            </Link>
          </nav>

        </main>
      </div>
    </div>
  );
}
