"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import BookingModal, { ServiceCategory } from "./BookingModal";

/* ─── All Service Categories (mirroring section data) ─── */
const allServiceCategories: ServiceCategory[] = [
  {
    id: "hair-services",
    title: "Hair Services",
    subServices: [
      { name: "Shampooing", price: 120 },
      { name: "Relaxing", price: 200 },
      { name: "Perm Cut Only", price: 100 },
      { name: "Normal Pony", price: 150 },
    ],
  },
  {
    id: "sew-in",
    title: "Sew-In",
    subServices: [
      { name: "Traditional Sew-In", price: 250 },
      { name: "Closure Sew-In", price: 250 },
      { name: "Frontal Sew-In", price: 300 },
      { name: "Half-Up Half-Down", price: 180 },
    ],
  },
  {
    id: "installation",
    title: "Installation",
    subServices: [
      { name: "Closure Installation", price: 50 },
      { name: "Frontal Installation", price: 100 },
      { name: "180 Frontal Pony", price: 200 },
      { name: "360 Frontal Pony", price: 350 },
    ],
  },
  {
    id: "styling",
    title: "Styling",
    subServices: [
      { name: "Straightening", price: "40-100" },
      { name: "Curling", price: "50-150" },
      { name: "Pixie Curls", price: 100 },
      { name: "Bridal Inspo", price: "200-500" },
    ],
  },
  {
    id: "revamp-colouring",
    title: "Revamp / Colouring",
    subServices: [
      { name: "Revamp Only", price: "60-200" },
      { name: "Colouring", price: "250-600" },
      { name: "Natural Hair", price: "100-400" },
    ],
  },
  {
    id: "custom-wigging",
    title: "Custom Wigging",
    subServices: [
      { name: "Closure (2*6, 4*4)", price: 200 },
      { name: "Closure (5*5, 6*6)", price: 250 },
      { name: "180 Frontal", price: 300 },
      { name: "360 Frontal", price: 350 },
      { name: "Express services", price: "100-200" },
      { name: "Pixie wigging", price: 50 },
      { name: "Corn-rolls", price: 40 },
    ],
  },
  {
    id: "nail-care",
    title: "Nail Care & Artistry",
    subServices: [
      { name: "Artisan Manicure", price: "150" },
      { name: "The Splendor Pedicure", price: "200" },
      { name: "Gel Extensions (Full Set)", price: "250" },
      { name: "Editorial Nail Art", price: "100+" },
    ],
  },
  {
    id: "spa-skin",
    title: "SPA & Skin Rejuvenation",
    subServices: [
      { name: "Glow Facial", price: "150" },
      { name: "Dermaplaning Luxe", price: "220" },
      { name: "Red Carpet Peel", price: "275" },
    ],
  },
  {
    id: "professional-makeup",
    title: "Professional Makeup",
    subServices: [
      { name: "Special Occasion Makeup", price: "150" },
      { name: "Editorial / Photoshoot", price: "250" },
      { name: "Makeup Consultation & Class", price: "180" },
    ],
  },
];

const navLinks = [
  { label: "Salon Services",   href: "/" },
  { label: "Bridal Artistry",  href: "/bridal" },
  { label: "Beauty Academy",   href: "/academy" },
  { label: "Gallery",          href: "/gallery" },
  { label: "About",            href: "/about" },
  { label: "Shop",             href: "/shop" },
];

interface SearchItem {
  category: string;
  title: string;
  url: string;
  description: string;
}

const searchDatabase: SearchItem[] = [
  { category: "Salon Services", title: "Editorial Hair Styling", url: "/#hair", description: "Bespoke cuts, couture balayages, blowouts, and advanced texturizing services." },
  { category: "Salon Services", title: "Bespoke Skin Rituals", url: "/#skin", description: "Advanced clinical facials, skin peels, dermaplaning, and microcurrent therapy." },
  { category: "Salon Services", title: "Precision Nails & Manicures", url: "/#nails", description: "Artistic gel extensions, structured manicures, and custom nail art designs." },
  { category: "Salon Services", title: "High-Definition Makeup Artistry", url: "/#makeup", description: "Editorial makeup applications, event styling, and face-sculpting." },
  { category: "Bridal Artistry", title: "Luxury Bridal Styling Packages", url: "/bridal", description: "Full-day wedding styling support, trial sessions, and bride/bridal party makeup packages." },
  { category: "Beauty Academy", title: "Bridal Artistry Masterclass", url: "/academy", description: "Learn bridal prep, high-fashion styling, and advanced skincare integration." },
  { category: "Beauty Academy", title: "Editorial Hair Sculpting Course", url: "/academy", description: "Hands-on certificate course for professional hair cutting, sectioning, and styling." },
  { category: "Luxury Shop", title: "Editorial Styling Serum", url: "/shop", description: "Ultra-lightweight shine serum designed for studio photography and daily protection." },
  { category: "Luxury Shop", title: "Botanical Skin Essence", url: "/shop", description: "Nourishing hydration tonic containing clinical humectants and rose distillate." },
  { category: "Luxury Shop", title: "Professional Makeup Brush Set", url: "/shop", description: "Twelve synthetic fibers designed specifically for seamless airbrushed-finish blending." },
];

export default function Navbar() {
  const pathname = usePathname();
  const { count: cartCount } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingCategory, setBookingCategory] = useState<ServiceCategory | null>(null);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Prevent body scroll when menu or search is open
  useEffect(() => {
    document.body.style.overflow = (menuOpen || searchOpen) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen, searchOpen]);

  // Focus input on search modal open
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Keyboard shortcut to close search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleAnchor = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#") && href.length > 1) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
    setMenuOpen(false);
  };

  const filteredResults = searchQuery.trim() === ""
    ? []
    : searchDatabase.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <>
      {/* ── Top Bar ── */}
      <nav
        className={`fixed top-0 w-full z-50 flex justify-between items-center bg-surface border-b border-outline-variant transition-all duration-300
          px-6 md:px-[64px]
          ${scrolled ? "h-16 shadow-sm" : "h-20"}
        `}
      >
        {/* Mobile left: hamburger + logo | Desktop left: logo */}
        <div className="flex items-center gap-4 flex-1">
          {/* Hamburger — mobile only */}
          <button
            id="mobile-menu-trigger"
            className="md:hidden text-royal-navy"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZw_y4dATKYatHzjv9PQwRw5kZSaShal4-I6iB9txmC9LQYUYBj7VrT_3j3OtdJ9JrErYTGMJho74Lax8wPmxRIVjTzYcPRMEtnu5fPHYWn0QSOMiEG5mJK9VenmIf8_9ZOis_ekZkCKCxZ2FCzDw9NbLuNC_DEWxTtX5hp1Qv0aI-BD-OAxlz2rNkoDy-WepFomvUd1Q-i7GBxbIQ_UB_mxEpknsylxpyBrhLp3mKDth_MCurW7YwyW7Ipp5KM52hqGJFwYcHgT4"
              alt="Erniekay Splendor Logo"
              width={160}
              height={40}
              className="h-8 md:h-10 w-auto object-contain"
              unoptimized
              priority
            />
          </Link>
        </div>

        {/* Desktop nav links (Center) */}
        <div className="hidden md:flex gap-8 items-center justify-center flex-none">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`font-[family-name:var(--font-montserrat)] text-[16px] leading-[26px] hover:text-majestic-gold transition-colors duration-300 ${
                isActive(link.href)
                  ? "text-royal-navy border-b-2 border-majestic-gold pb-1"
                  : "text-on-surface-variant"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right: icons + Book Now */}
        <div className="flex items-center justify-end gap-3 md:gap-4 flex-1">
          {/* Search Button */}
          <button
            id="nav-search"
            aria-label="Search"
            onClick={() => setSearchOpen(true)}
            className="text-royal-navy hover:text-majestic-gold transition-colors"
          >
            <span className="material-symbols-outlined">search</span>
          </button>

          {/* Shopping bag with cart count */}
          <Link
            href="/shop"
            id="nav-cart"
            aria-label="Shopping bag"
            className="relative text-royal-navy hover:text-majestic-gold transition-colors"
          >
            <span className="material-symbols-outlined">shopping_bag</span>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-majestic-gold text-royal-navy text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>

          <button
            id="nav-book-now"
            onClick={() => setShowCategoryPicker(true)}
            className="bg-royal-navy text-on-primary px-4 md:px-8 py-2 md:py-3 font-[family-name:var(--font-montserrat)] text-[11px] md:text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold border border-majestic-gold hover:bg-primary-container transition-all active:opacity-80 flex items-center justify-center"
          >
            Book Now
          </button>
        </div>
      </nav>

      {/* ── Mobile Fullscreen Overlay Menu ── */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 bg-midnight-ink z-[60] flex flex-col p-6 transition-transform duration-500 ease-in-out ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close button */}
        <div className="flex justify-end mb-8">
          <button
            id="menu-close"
            className="text-on-primary"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          >
            <span className="material-symbols-outlined text-3xl">close</span>
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`font-[family-name:var(--font-eb-garamond)] text-[28px] leading-[36px] font-semibold transition-colors ${
                isActive(link.href)
                  ? "text-majestic-gold border-b-2 border-majestic-gold pb-1 self-start"
                  : "text-surface-variant hover:text-majestic-gold"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Footer of the menu */}
        <div className="mt-auto pt-8 border-t border-on-surface-variant/30">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfny7Zx2dAFLTCnd5i1xkg1Rrkj6Dc_zoKmkSdfrW5ENcHTrZD1eFWqBRy1pW-Gg-0NeLjsEOdq752EDnfxgRt9ehJ7qw8c0FWjI0EOnGp0Ja3uNGim4d6mRuNFFC9T78EYgIunoiepLAoGg6EeDtEGleMh4GWum6ta4_5mMMsgAzglzVilzcdfPUPok4viD5UDCyHw8t0XZsBLfAcLX-RN5aYkLB8wQrO0Pp3gaehU0Opx5QDVijpVSb9tTXmDEaN56COSZlepOQ"
            alt="Erniekay Splendor Logo Light"
            width={120}
            height={40}
            className="h-10 w-auto object-contain mb-4"
            unoptimized
          />
          <p className="text-surface-variant font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase">
            Timeless Editorial Elegance
          </p>
        </div>
      </div>

      {/* ── Glassmorphic Fullscreen Search Overlay ── */}
      {searchOpen && (
        <div className="fixed inset-0 bg-midnight-ink/95 backdrop-blur-md z-[100] flex flex-col p-6 md:p-24 transition-opacity duration-300">
          {/* Top header: Close and title */}
          <div className="flex justify-between items-center mb-12">
            <span className="font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold text-majestic-gold">
              Prestige Search
            </span>
            <button
              onClick={() => {
                setSearchOpen(false);
                setSearchQuery("");
              }}
              className="text-on-primary hover:text-majestic-gold transition-colors flex items-center gap-2"
              aria-label="Close search"
            >
              <span className="font-[family-name:var(--font-montserrat)] text-[12px] tracking-[0.15em] uppercase font-bold hidden md:inline">Close</span>
              <span className="material-symbols-outlined text-3xl">close</span>
            </button>
          </div>

          {/* Search box input */}
          <div className="w-full max-w-4xl mx-auto mb-12 relative">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search services, products, courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-b-2 border-white/20 hover:border-white/40 focus:border-majestic-gold outline-none py-4 px-2 text-white font-[family-name:var(--font-eb-garamond)] text-[32px] md:text-[44px] transition-colors placeholder:text-white/30"
            />
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-white/50 text-[36px]">
              search
            </span>
          </div>

          {/* Search results catalog */}
          <div className="w-full max-w-4xl mx-auto flex-1 overflow-y-auto pr-2 hide-scrollbar">
            {searchQuery.trim() === "" ? (
              <div className="text-white/50 font-[family-name:var(--font-montserrat)] text-[14px]">
                <p className="mb-4 font-bold text-majestic-gold tracking-wide">SUGGESTED SEARCHES</p>
                <div className="flex flex-wrap gap-4">
                  {["Hair Styling", "Skin Rituals", "Bridal Package", "Academy Masterclass", "Serum"].map((sug) => (
                    <button
                      key={sug}
                      onClick={() => setSearchQuery(sug)}
                      className="bg-white/5 border border-white/10 hover:border-majestic-gold hover:text-white px-4 py-2 text-[13px] transition-colors"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>
            ) : filteredResults.length > 0 ? (
              <div className="flex flex-col gap-6">
                <p className="text-majestic-gold font-[family-name:var(--font-montserrat)] text-[12px] tracking-[0.15em] uppercase font-bold">
                  {filteredResults.length} matches found
                </p>
                <div className="flex flex-col gap-4">
                  {filteredResults.map((res) => (
                    <Link
                      key={res.title}
                      href={res.url}
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchQuery("");
                      }}
                      className="group bg-white/5 border border-white/10 p-6 flex flex-col md:flex-row md:justify-between md:items-center hover:border-majestic-gold transition-colors"
                    >
                      <div>
                        <span className="text-majestic-gold font-[family-name:var(--font-montserrat)] text-[10px] tracking-[0.1em] uppercase font-bold block mb-1">
                          {res.category}
                        </span>
                        <h4 className="text-white font-[family-name:var(--font-eb-garamond)] text-[22px] font-semibold group-hover:text-majestic-gold transition-colors">
                          {res.title}
                        </h4>
                        <p className="text-white/70 font-[family-name:var(--font-montserrat)] text-[13px] leading-[20px] mt-1 max-w-2xl">
                          {res.description}
                        </p>
                      </div>
                      <span className="material-symbols-outlined text-white/50 group-hover:text-majestic-gold group-hover:translate-x-2 transition-all mt-4 md:mt-0">
                        arrow_forward
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-white/50 font-[family-name:var(--font-montserrat)] text-[14px]">
                No results found matching &ldquo;<span className="text-white">{searchQuery}</span>&rdquo;. Please try another keyword.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Category Picker Modal ── */}
      {showCategoryPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-none border border-majestic-gold shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="bg-royal-navy p-6 flex justify-between items-center text-white">
              <div>
                <h2 className="font-[family-name:var(--font-eb-garamond)] text-2xl font-semibold">
                  Book Appointment
                </h2>
                <p className="font-[family-name:var(--font-montserrat)] text-xs tracking-widest uppercase text-champagne-taupe mt-1">
                  Select a service category
                </p>
              </div>
              <button
                onClick={() => setShowCategoryPicker(false)}
                className="text-white hover:text-majestic-gold transition-colors text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            {/* Category List */}
            <div className="p-6 overflow-y-auto">
              <div className="space-y-3">
                {allServiceCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setBookingCategory(cat);
                      setShowCategoryPicker(false);
                      setBookingOpen(true);
                    }}
                    className="w-full flex items-center justify-between p-4 border border-outline-variant hover:border-majestic-gold hover:bg-alabaster-white transition-all text-left group"
                  >
                    <div>
                      <span className="font-[family-name:var(--font-eb-garamond)] text-lg font-semibold text-royal-navy group-hover:text-majestic-gold transition-colors">
                        {cat.title}
                      </span>
                      <span className="block font-[family-name:var(--font-montserrat)] text-[11px] text-on-surface-variant mt-0.5">
                        {cat.subServices.length} services
                      </span>
                    </div>
                    <span className="text-royal-navy group-hover:text-majestic-gold group-hover:translate-x-1 transition-all text-lg">→</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Booking Modal (sub-service selection → details → payment) ── */}
      <BookingModal
        isOpen={bookingOpen}
        onClose={() => {
          setBookingOpen(false);
          setBookingCategory(null);
        }}
        category={bookingCategory}
      />
    </>
  );
}

