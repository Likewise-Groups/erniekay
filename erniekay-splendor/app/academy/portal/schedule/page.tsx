"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Service {
  id: string;
  name: string;
  category: "Makeup Artistry" | "Advanced Aesthetics" | "Bridal Editorial" | "Hair Sculpting";
  price: string;
  duration: string;
  description?: string;
  imgSrc: string;
  alt: string;
  featured?: boolean;
}

const servicesData: Service[] = [
  {
    id: "makeup",
    name: "Red Carpet Makeup",
    category: "Makeup Artistry",
    price: "$185.00",
    duration: "90 min",
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuCJGqm4GhNjx21y1djNHCMf-VsFAFoa4RgNuLcFXr0oxnDQfNqGuZoJ4pfMAOZ_cdTUSA6h263FT3I6-yqDkYk-jVUCrrTXkSIZuyMygzoZli5sTpwkuin5rOcDc0Ot-io6n1nYsDBQG-CXLAoQI-aTQ1f27HkqII8XEAR7w-_hgupb6mApR2gYnxIFD53yx818U1wJMCHB9shh54NCxoJjl-nEcXZaMl45OBL4KtJphqy5q7eWefs3bL4DyOw5lWUTniw_Z-eNTYg",
    alt: "Editorial makeup application scene in a luxury studio setting.",
    featured: true,
  },
  {
    id: "facial",
    name: "Signature Glow Facial",
    category: "Advanced Aesthetics",
    price: "$120.00",
    duration: "60 min",
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuAKS_r-z9w9QaUKh08Ys-rTgode6V9D7dcMBxm8AayOs5Ys-ZIab4MqEeFxz_bKzK1YUSAEa9zRVzaLPD46m1vP_juyjF3KbC6zX4dLXzbOtyZBZKeKYjgMXE43_Yvp02YwqjAYvX6ycxXqY1mouC3yEB4lMQiP6_MDX7ay5ysimjmffMcrvesa87qm4_2WHitx3EYiUV2nrydt3ni91jpHE9kpkNEhFS33RzgGyDd8Gk0Ao17kT0xErNlyrPcASHV7ZJ3-B3OLCSI",
    alt: "Frosted skincare bottles arranged on marble countertop.",
  },
  {
    id: "bridal",
    name: "Bridal Updo Trials",
    category: "Bridal Editorial",
    price: "$250.00",
    duration: "120 min",
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuCeU3Kaa_tAVgDhTza6orb84C1d-U_5gt5HY0AexOUusYzoKBvLF9p9d7NaaHeknINKS9dlHC8CuX14MEm09Ncv19nJdLuJ-6QWSUTA4ZK1aU9lG_pD7aczeuJ_y5LUXqCi_UHcwhwy7O_IefThdief1lr75-GSn9gNKo4Geof1X0VaIkKKv4AvmOXJB-OaiWhFv6JvhHWZReJU6ammIWk8RmSpDbtN8WvvTdHRBBZqzgywW2pGkNCNJKVzXu8i5VtTbr1cYG1Uzcc",
    alt: "Stylist pinning model's elegant wedding hairstyle.",
  },
  {
    id: "lash",
    name: "Editorial Lash Lift",
    category: "Advanced Aesthetics",
    price: "$95.00",
    duration: "45 min",
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuAGID6kmmydmFgz02dYfdfAT672ProdVs4nWFyVolT5h8jPy4uk6r2V3BIe403B_rBAuNixf-43Hf9YSCB9RCecJG7Ts62H1PwsxPitnSBDXWGcHdLoyOv3CTk1jQHtqU7qHGZJtoVsBIorqM97TCm3bStFFXqr0BM5NmjNNBkJdabd9K9KHG3Y4AgROmMtfkfEWggjfO5Th5oNM8jgJjYoV081Ic_5FkKq_OoKhCjlRfAGP8RUwyE12MRaerX8ud6b068qPjP98WA",
    alt: "Cosmetic makeup brush set details with golden highlights.",
  },
  {
    id: "balayage",
    name: "Balayage Masterclass",
    category: "Hair Sculpting",
    price: "$350.00",
    duration: "180 min",
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuAyVxsCXt3rx3sKWZnwoAFWgMOW6by3ORVJvQvGh4YlMXgOhsUvM3JepSK85_8RD0mrZ51T1Yw1YwvWxjDq00xs38GsG6_mEQ5n_sC2ABt30xTuLnAU7VtguBCZTYkAEqRj1RThG6n-MyiaOrMi2L5fCMxRRW1uBaLuxFwYAxc4_nXRSL4BqtDyBhxiT9-WaZ9XtSFHuifShodMt3_Qb0jtCZ6yZI5GPb_Xee_eUx0uyVhCKJ52CePioRBychFUt8nCTwH4mwqohtg",
    alt: "Styling workstation round mirror glowing backdrop.",
  },
];

interface Artist {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: string;
  image: string;
}

const artistsData: Artist[] = [
  {
    id: "alexandra",
    name: "Alexandra Thorne",
    role: "MASTER COLORIST & STYLIST",
    quote: "Artistry is not just about the cut; it is about the geometry of the soul and how light interacts with the canvas of hair.",
    rating: "4.9",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB42LuF1Yh-a6SO2dBt19QOeNYA2SCal8m3mTPdCuNsEvyAf-5166kixSKRPtae17BSNCKr9yFrdhXlYcaiqzBt_JWOSUOtd-r1xJ1rPBuSX9LROkicb_xBjwnkLdMY03Rzzs604A951nEXOgmkco_M26CYafnwOje1BjayjvXqJWM6xwJjYPxfm3a-EIShHp58UvGpxkeCjqS4epCazUT3SXsErVlU8dRHRIm4ygDgN6BO-hf3HWPA4oEw5_JmQdIDddzIRJpcyEs",
  },
  {
    id: "julianna",
    name: "Julianna Vane",
    role: "BRIDAL & COUTURE SPECIALIST",
    quote: "Every bride deserves a silhouette that captures her unique radiance. I specialize in timeless, romantic artistry.",
    rating: "5.0",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCnJmswCPWbbW2xgdHWC8IxF-NHVbs__JG4FKjJH4RoMvnR01My1YTQihcWxSoc_1bxtUwP81aK7e6j0hCgFVjxoZmrQnL_4aliqOAm5M76Akz7eyfguTPAQQDzG2mA2O4PH98gbjufd34tJ1xV47ghLft-KZNZIZxoSpiH2tL7X2df3JKP4YQY7oqtG1DWJy9Twgp5sfGuFxwXVKc79PftRbABZ-mY-jt6BtW69yi5ZKu3IMRqc-Nf78KyMEmuo6kXX0jzrg8Iw",
  },
  {
    id: "marcus",
    name: "Marcus Sterling",
    role: "ARCHITECTURAL CUT SPECIALIST",
    quote: "Precision is the foundation of luxury. I create structures that enhance natural features with effortless sophistication.",
    rating: "4.8",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDPqnmLTPaL61eEO_iWZCvzb3d4Dbk_sDYpHMGSaK6G2pqFmA33oLYa2PoQcQ7lgkaMhHjAFfBZzMLvX2-nrfXjBHB93LN1HwSZuDJNbIk9LyHCWnuGNqAnJPW_RLE5kYePDiJuGGTF-R4zQbdOHZ0c3EQBXkHSoZJ5qhzJLB5h8KEfm_rascKWtk1A1lm1RREXyCd8Kdk0VTVV81y8OjsauRwzCeVD5fv7rf3GgiQrpapaUOyZRsIoMYn4VdmWAl0xfDUc1y-yklk",
  },
  {
    id: "elena",
    name: "Elena Rossi",
    role: "TEXTURE & RITUAL EXPERT",
    quote: "Beauty is a holistic ritual. I believe in harnessing organic textures to tell a story of authentic radiance and care.",
    rating: "4.9",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAkpnmnuW2dqG3WwY6Q_vseyKfJ8TcqiuP4IxCeDSdnAv1KllXvgbrtxTiM9NJgxeiUlel3n7yGY9SYt7b6JZpmvvoJ1eElQEhwA84bWQHsFJEKxLVCyeYtx0nSG3Sz9JTA_6EAgwOD9ZSxWJZjZ2SfgNWCf56fx64XPRZzdCJNAKTzRu4ZneuvCG2NtKotiqSiYMeOMoUOXZjH3Olp1Kp2PuIrQntpSplPOnjO2CMgSQ75m2VIXouh2Jmuicjcwre1uIiD52MLi9I",
  },
];

export default function StudentSchedulePage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All Collections");
  const [selectedDateDay, setSelectedDateDay] = useState<number>(9); // Default Oct 9
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("02:30 PM"); // Default 2:30 PM

  // Customer Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filters
  const filteredServices = servicesData.filter((service) => {
    if (selectedCategory === "All Collections") return true;
    return service.category === selectedCategory;
  });

  const handleSelectService = (service: Service) => {
    setSelectedService(service);
  };

  const handleSelectArtist = (artist: Artist) => {
    setSelectedArtist(artist);
  };

  const handleNextStep = () => {
    if (step === 1 && selectedService) {
      setStep(2);
    } else if (step === 2 && selectedArtist) {
      setStep(3);
    } else if (step === 3 && selectedDateDay && selectedTimeSlot) {
      setStep(4);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
    }
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(5);
    }, 1500);
  };

  const handleReset = () => {
    setStep(1);
    setSelectedService(null);
    setSelectedArtist(null);
    setSelectedDateDay(9);
    setSelectedTimeSlot("02:30 PM");
    setFullName("");
    setEmail("");
    setPhone("");
    setNotes("");
    setAgreeTerms(false);
  };

  const sidebarLinks = [
    { label: "Dashboard", href: "/academy/portal/dashboard", icon: "dashboard" },
    { label: "Course Catalog", href: "/academy/portal/courses", icon: "auto_stories" },
    { label: "Schedule", href: "/academy/portal/schedule", icon: "calendar_month", active: true },
    { label: "Grades", href: "/academy/portal/grades", icon: "grade" },
    { label: "Profile", href: "/academy/portal/profile", icon: "person" },
  ];

  // Calendar setup
  const calendarDays = [
    { day: 27, disabled: true },
    { day: 28, disabled: true },
    { day: 29, disabled: true },
    { day: 30, disabled: true },
    { day: 1, disabled: false },
    { day: 2, disabled: false },
    { day: 3, disabled: false },
    { day: 4, disabled: false },
    { day: 5, disabled: false },
    { day: 6, disabled: false },
    { day: 7, disabled: false },
    { day: 8, disabled: false },
    { day: 9, disabled: false },
    { day: 10, disabled: false },
    { day: 11, disabled: false },
    { day: 12, disabled: false },
    { day: 13, disabled: false },
    { day: 14, disabled: false },
    { day: 15, disabled: false },
    { day: 16, disabled: false },
    { day: 17, disabled: false },
  ];

  return (
    <div className="bg-[#F5F5F5] text-royal-navy min-h-screen font-[family-name:var(--font-montserrat)] antialiased selection:bg-majestic-gold selection:text-royal-navy">
      
      {/* ── DESKTOP SideNavBar Shell ── */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-royal-navy hidden md:flex flex-col py-8 px-6 border-r border-majestic-gold/20 z-50 text-white">
        <div className="mb-12">
          <h1 className="font-[family-name:var(--font-eb-garamond)] text-[28px] font-semibold text-majestic-gold mb-1 leading-none">
            Beauty Academy
          </h1>
          <p className="font-[family-name:var(--font-montserrat)] text-[10px] text-majestic-gold/60 tracking-[0.2em] uppercase font-bold mt-1">
            ELITE PROFESSIONAL TRAINING
          </p>
        </div>
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
      </aside>

      {/* ── Top Navigation Anchor ── */}
      <header className="w-full top-0 sticky flex justify-between items-center px-margin-mobile h-16 w-full z-50 bg-surface border-b border-outline-variant">
        <div className="flex items-center gap-4">
          <span
            onClick={handlePrevStep}
            className="material-symbols-outlined text-royal-navy cursor-pointer active:scale-90 transition-transform"
          >
            arrow_back
          </span>
          <h1 className="font-headline-md text-headline-md-mobile text-royal-navy uppercase tracking-widest leading-none">
            Elite Academy
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-outline cursor-pointer">notifications</span>
          <div className="w-10 h-10 border border-outline-variant flex items-center justify-center overflow-hidden relative">
            <Image
              alt="Student profile photo"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbxeWFX4UB3R03o32VASvO2aeFSGcoMTXaSoCJ8RK3KPwdVE9LoHg-_H62ZEbJRLbRay9vFJIrfVxGnu8jPni3Uf5VDprOhIlZReu2C9pAAoM4M6hufE1BuQx_ph60Fzc_feiMc6QhH6f1o3q02jJRSuPpby-jSum-057aYj8faVoxR7G3qr9BUcny9ZtgW_DF1VpKI2P3B2ow6Kv9iNqKO9WobZjsFDRfmAAX3ctTtrPs8UfdPYEgtjSvtiCY8TCC99spVqaroik"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <main className="md:ml-64 min-h-screen flex flex-col pt-4">
        <div className="max-w-[1280px] mx-auto px-6 md:px-[64px] py-8 md:py-16 pb-32 w-full flex-grow">
          
          {/* Booking Progress Stepper */}
          <section className="mb-12">
            <div className="flex items-center justify-between w-full max-w-lg mx-auto mb-4">
              {/* Step 1: Complete */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => setStep(1)}
                  className="w-8 h-8 rounded-full bg-royal-navy flex items-center justify-center text-majestic-gold"
                >
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check
                  </span>
                </button>
              </div>
              <div className="step-line mx-2 flex-grow h-[1px] bg-royal-navy opacity-30"></div>

              {/* Step 2: Complete */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => selectedService && setStep(2)}
                  disabled={!selectedService}
                  className="w-8 h-8 rounded-full bg-royal-navy flex items-center justify-center text-majestic-gold"
                >
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check
                  </span>
                </button>
              </div>
              <div className="step-line mx-2 flex-grow h-[1px] bg-royal-navy opacity-30"></div>

              {/* Step 3: Active */}
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full border border-royal-navy flex items-center justify-center bg-surface">
                  <div className="w-2 h-2 bg-majestic-gold rounded-full"></div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between w-full max-w-lg mx-auto text-center px-2">
              <span className="font-label-caps text-label-caps text-royal-navy opacity-50 cursor-pointer" onClick={() => setStep(1)}>
                Service
              </span>
              <span className={`font-label-caps text-label-caps ${step >= 2 ? "text-royal-navy opacity-50 cursor-pointer" : "text-royal-navy opacity-50"}`} onClick={() => selectedService && setStep(2)}>
                Artist
              </span>
              <span className={`font-label-caps text-label-caps ${step >= 3 ? "text-royal-navy font-bold" : "text-outline"}`}>
                Details
              </span>
            </div>
          </section>

          {/* STEP 1: SERVICES BENTO */}
          {step === 1 && (
            <div>
              {/* Header Section */}
              <div className="mb-12 text-center md:text-left">
                <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-royal-navy mb-4 italic">
                  The Ritual of Beauty
                </h1>
                <p className="font-body-base text-body-base text-warm-slate max-w-xl">
                  Curated aesthetic experiences designed for the modern elite. Select your service from our specialized menu of artistry.
                </p>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-4 mb-12 overflow-x-auto pb-4 scrollbar-hide">
                {["All Collections", "Makeup Artistry", "Advanced Aesthetics", "Bridal Editorial", "Hair Sculpting"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-8 py-3 border font-label-caps text-label-caps transition-all uppercase whitespace-nowrap ${
                      selectedCategory === cat
                        ? "border-royal-navy bg-royal-navy text-majestic-gold"
                        : "border-outline-variant text-royal-navy hover:border-royal-navy"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Bento Grid Layout */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter-desktop mb-12">
                {filteredServices.map((service) => {
                  const isSelected = selectedService?.id === service.id;
                  
                  if (service.featured) {
                    return (
                      <div
                        key={service.id}
                        onClick={() => handleSelectService(service)}
                        className={`md:col-span-8 group relative overflow-hidden bg-white border cursor-pointer service-card transition-all ${
                          isSelected ? "border-majestic-gold ring-1 ring-majestic-gold" : "border-outline-variant/30"
                        }`}
                      >
                        <div className="flex flex-col md:flex-row h-full">
                          <div className="md:w-3/5 h-[300px] md:h-auto overflow-hidden relative">
                            <Image
                              className="object-cover transition-transform duration-700 service-img"
                              src={service.imgSrc}
                              alt={service.name}
                              fill
                              unoptimized
                            />
                          </div>
                          <div className="md:w-2/5 p-8 flex flex-col justify-between">
                            <div>
                              <span className="font-label-caps text-label-caps text-champagne-taupe mb-2 block uppercase tracking-[0.2em]">
                                Signature Look
                              </span>
                              <h3 className="font-headline-md text-headline-md text-royal-navy mb-4 group-hover:text-majestic-gold transition-colors">
                                {service.name}
                              </h3>
                              <p className="font-body-base text-body-base text-warm-slate mb-6">
                                {service.description}
                              </p>
                              <div className="flex items-center gap-6 mb-8">
                                <div className="flex items-center gap-2">
                                  <span className="material-symbols-outlined text-royal-navy/50">schedule</span>
                                  <span className="font-body-base text-body-base">{service.duration}</span>
                                </div>
                                <div className="font-body-bold text-body-bold text-royal-navy">{service.price}</div>
                              </div>
                            </div>
                            <button
                              className={`w-full py-4 font-label-caps text-label-caps border transition-all ${
                                isSelected
                                  ? "bg-premium-green text-white border-premium-green"
                                  : "bg-majestic-gold text-royal-navy border-majestic-gold hover:bg-royal-navy hover:text-majestic-gold"
                              }`}
                            >
                              {isSelected ? "Selected" : "Select Service"}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={service.id}
                      onClick={() => handleSelectService(service)}
                      className={`md:col-span-4 group bg-white border cursor-pointer service-card transition-all flex flex-col justify-between ${
                        isSelected ? "border-majestic-gold ring-1 ring-majestic-gold" : "border-outline-variant/30"
                      }`}
                    >
                      <div>
                        <div className="h-[240px] overflow-hidden relative w-full">
                          <Image
                            className="object-cover transition-transform duration-700 service-img"
                            src={service.imgSrc}
                            alt={service.name}
                            fill
                            unoptimized
                          />
                        </div>
                        <div className="p-8 pb-4">
                          <span className="font-label-caps text-label-caps text-champagne-taupe mb-2 block uppercase tracking-[0.2em]">
                            {service.category}
                          </span>
                          <h3 className="font-headline-md text-headline-md text-royal-navy mb-2 group-hover:text-majestic-gold transition-colors">
                            {service.name}
                          </h3>
                        </div>
                      </div>
                      <div className="p-8 pt-0">
                        <div className="flex justify-between items-center mb-6">
                          <span className="font-body-base text-body-base text-warm-slate">{service.duration}</span>
                          <span className="font-body-bold text-body-bold text-royal-navy">{service.price}</span>
                        </div>
                        <button
                          className={`w-full py-4 border font-label-caps text-label-caps transition-all ${
                            isSelected
                              ? "bg-premium-green text-white border-premium-green"
                              : "border-royal-navy text-royal-navy hover:bg-royal-navy hover:text-white"
                          }`}
                        >
                          {isSelected ? "Selected" : "Select"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Mobile Condensed Selection Summary Footer */}
              {selectedService && (
                <div className="fixed bottom-16 left-0 w-full bg-white border-t border-outline-variant px-6 py-4 flex items-center justify-between z-40 md:hidden">
                  <div className="flex flex-col">
                    <span className="font-label-caps text-[10px] text-outline-variant">Selection</span>
                    <span className="font-body-bold text-body-bold text-royal-navy">{selectedService.name}</span>
                  </div>
                  <button
                    onClick={handleNextStep}
                    className="px-6 py-2 bg-royal-navy text-majestic-gold font-label-caps text-[10px] tracking-widest uppercase border border-majestic-gold active:scale-95"
                  >
                    Next Step
                  </button>
                </div>
              )}

              {/* Desktop Next Step */}
              <div className="hidden md:flex justify-end pt-6">
                <button
                  onClick={handleNextStep}
                  disabled={!selectedService}
                  className={`flex items-center gap-2 px-8 py-4 font-bold font-label-caps text-[13px] tracking-[0.15em] uppercase border transition-all ${
                    selectedService
                      ? "bg-royal-navy text-majestic-gold border-majestic-gold hover:bg-majestic-gold hover:text-royal-navy"
                      : "bg-surface-variant text-outline border-surface-variant cursor-not-allowed"
                  }`}
                >
                  Continue to Professional <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: ARTIST PROFILE SELECTION */}
          {step === 2 && (
            <div>
              {/* Page Header */}
              <div className="text-center mb-16">
                <h2 className="font-display-lg text-display-lg-mobile text-royal-navy mb-4">Curated Artisans</h2>
                <p className="max-w-xl mx-auto font-body-base text-on-surface-variant italic">
                  Select the master professional who will craft your ritual experience.
                </p>
              </div>

              {/* Artist Profile Cards (Optimized Stack) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {artistsData.map((artist) => {
                  const isSelected = selectedArtist?.id === artist.id;
                  return (
                    <div
                      key={artist.id}
                      onClick={() => handleSelectArtist(artist)}
                      className={`bg-surface-container-lowest border p-6 flex flex-col md:flex-row gap-6 transition-all duration-300 hover:border-majestic-gold group cursor-pointer ${
                        isSelected ? "border-majestic-gold bg-alabaster-white" : "border-outline-variant"
                      }`}
                    >
                      <div className="w-full md:w-48 h-64 overflow-hidden border border-outline-variant relative">
                        <Image
                          src={artist.image}
                          alt={artist.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 20vw"
                          className={`object-cover transition-all duration-700 ${
                            isSelected ? "grayscale-0" : "grayscale group-hover:grayscale-0"
                          }`}
                          unoptimized
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-headline-md text-royal-navy leading-none">{artist.name}</h3>
                            <div className="flex items-center gap-1 text-majestic-gold leading-none">
                              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                star
                              </span>
                              <span className="font-label-caps text-label-caps text-royal-navy leading-none">
                                {artist.rating}
                              </span>
                            </div>
                          </div>
                          <p className="font-label-caps text-label-caps text-champagne-taupe mb-4">{artist.role}</p>
                          <p className="font-body-base text-on-surface-variant italic text-sm mb-6 leading-relaxed">
                            &ldquo;{artist.quote}&rdquo;
                          </p>
                        </div>
                        <button
                          className={`w-full py-3 border font-label-caps text-label-caps tracking-widest transition-all duration-300 ${
                            isSelected
                              ? "bg-royal-navy text-majestic-gold border-royal-navy"
                              : "border-royal-navy text-royal-navy hover:bg-royal-navy hover:text-majestic-gold"
                          }`}
                        >
                          {isSelected ? "SELECTED" : "SELECT ARTISAN"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-12">
                <button
                  onClick={handlePrevStep}
                  className="flex items-center gap-2 px-6 py-3 font-bold font-label-caps text-[12px] tracking-[0.1em] uppercase border border-royal-navy text-royal-navy hover:bg-royal-navy hover:text-white transition-all"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span> Back
                </button>
                <button
                  onClick={handleNextStep}
                  disabled={!selectedArtist}
                  className={`flex items-center gap-2 px-8 py-4 font-bold font-label-caps text-[13px] tracking-[0.15em] uppercase border transition-all ${
                    selectedArtist
                      ? "bg-royal-navy text-majestic-gold border-majestic-gold hover:bg-majestic-gold hover:text-royal-navy"
                      : "bg-surface-variant text-outline border-surface-variant cursor-not-allowed"
                  }`}
                >
                  Choose Time Slot <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SCHEDULE / CALENDAR */}
          {step === 3 && (
            <div className="grid lg:grid-cols-12 gap-gutter-desktop">
              {/* Left Calendar Section */}
              <section className="lg:col-span-5 bg-surface-container-lowest border border-outline-variant p-6 md:p-8">
                <h2 className="font-display-lg-mobile md:font-display-lg text-royal-navy mb-8">Select Date</h2>
                <div className="flex justify-between items-center mb-6">
                  <span className="font-body-bold text-royal-navy uppercase tracking-widest">October 2026</span>
                  <div className="flex gap-4">
                    <button className="material-symbols-outlined text-royal-navy">chevron_left</button>
                    <button className="material-symbols-outlined text-royal-navy">chevron_right</button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-2 text-center mb-4">
                  <span className="font-label-caps text-[10px] text-outline">MON</span>
                  <span className="font-label-caps text-[10px] text-outline">TUE</span>
                  <span className="font-label-caps text-[10px] text-outline">WED</span>
                  <span className="font-label-caps text-[10px] text-outline">THU</span>
                  <span className="font-label-caps text-[10px] text-outline">FRI</span>
                  <span className="font-label-caps text-[10px] text-outline">SAT</span>
                  <span className="font-label-caps text-[10px] text-outline">SUN</span>
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {/* Calendar Days */}
                  {[27, 28, 29, 30].map((d) => (
                    <button
                      key={`prev-${d}`}
                      disabled
                      className="aspect-square flex items-center justify-center font-body-base text-outline opacity-30 cursor-not-allowed"
                    >
                      {d}
                    </button>
                  ))}
                  {Array.from({ length: 17 }, (_, i) => i + 1).map((d) => {
                    const isSelected = selectedDateDay === d;
                    return (
                      <button
                        key={`day-${d}`}
                        onClick={() => setSelectedDateDay(d)}
                        className={`aspect-square flex items-center justify-center font-body-base transition-colors ${
                          isSelected
                            ? "active-date shadow-lg bg-royal-navy text-majestic-gold border border-majestic-gold"
                            : "text-royal-navy hover:bg-alabaster-white"
                        }`}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-8 pt-6 border-t border-alabaster-white flex items-center gap-4">
                  <div className="w-3 h-3 bg-majestic-gold border border-royal-navy"></div>
                  <span className="text-label-caps font-label-caps text-outline">Selected Date</span>
                  <div className="w-3 h-3 bg-alabaster-white border border-outline-variant ml-4"></div>
                  <span className="text-label-caps font-label-caps text-outline">Available</span>
                </div>
              </section>

              {/* Right Time Slots Section */}
              <section className="lg:col-span-7 space-y-8">
                {/* Morning Slots */}
                <div className="bg-surface-container-lowest border border-outline-variant p-6 md:p-8">
                  <h3 className="font-headline-md text-royal-navy mb-6 flex items-center gap-3">
                    <span className="material-symbols-outlined">wb_sunny</span>
                    Morning Slots
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {["09:00 AM", "09:45 AM", "11:15 AM"].map((time) => {
                      const isSelected = selectedTimeSlot === time;
                      return (
                        <button
                          key={time}
                          onClick={() => setSelectedTimeSlot(time)}
                          className={`time-slot-pill border py-4 px-2 font-body-bold text-center transition-all hover:scale-105 active:scale-95 ${
                            isSelected
                              ? "border-2 border-majestic-gold bg-royal-navy text-majestic-gold"
                              : "border-outline-variant hover:border-majestic-gold hover:bg-alabaster-white"
                          }`}
                        >
                          {time}
                        </button>
                      );
                    })}
                    <button className="time-slot-pill border border-outline-variant py-4 px-2 font-body-bold text-center transition-all opacity-40 cursor-not-allowed line-through">
                      10:30 AM
                    </button>
                  </div>
                </div>

                {/* Afternoon Slots */}
                <div className="bg-surface-container-lowest border border-outline-variant p-6 md:p-8">
                  <h3 className="font-headline-md text-royal-navy mb-6 flex items-center gap-3">
                    <span className="material-symbols-outlined">light_mode</span>
                    Afternoon Slots
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {["01:00 PM", "02:30 PM", "03:15 PM", "04:00 PM"].map((time) => {
                      const isSelected = selectedTimeSlot === time;
                      return (
                        <button
                          key={time}
                          onClick={() => setSelectedTimeSlot(time)}
                          className={`time-slot-pill border py-4 px-2 font-body-bold text-center transition-all hover:scale-105 active:scale-95 ${
                            isSelected
                              ? "border-2 border-majestic-gold bg-royal-navy text-majestic-gold"
                              : "border-outline-variant hover:border-majestic-gold hover:bg-alabaster-white"
                          }`}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Evening Slots */}
                <div className="bg-surface-container-lowest border border-outline-variant p-6 md:p-8">
                  <h3 className="font-headline-md text-royal-navy mb-6 flex items-center gap-3">
                    <span className="material-symbols-outlined">bedtime</span>
                    Evening Slots
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {["05:30 PM", "06:15 PM"].map((time) => {
                      const isSelected = selectedTimeSlot === time;
                      return (
                        <button
                          key={time}
                          onClick={() => setSelectedTimeSlot(time)}
                          className={`time-slot-pill border py-4 px-2 font-body-bold text-center transition-all hover:scale-105 active:scale-95 ${
                            isSelected
                              ? "border-2 border-majestic-gold bg-royal-navy text-majestic-gold"
                              : "border-outline-variant hover:border-majestic-gold hover:bg-alabaster-white"
                          }`}
                        >
                          {time}
                        </button>
                      );
                    })}
                    <button className="time-slot-pill border border-outline-variant py-4 px-2 font-body-bold text-center transition-all opacity-40 cursor-not-allowed">
                      07:00 PM
                    </button>
                    <button className="time-slot-pill border border-outline-variant py-4 px-2 font-body-bold text-center transition-all opacity-40 cursor-not-allowed">
                      07:45 PM
                    </button>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* STEP 4: CUSTOMER INFO FORM & SUMMARY SPLIT */}
          {step === 4 && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter-desktop items-start">
              {/* Left Column: Booking Summary */}
              <div className="md:col-span-5 bg-white border border-[#EBEBEB] p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-alabaster-white -mr-16 -mt-16 rotate-45"></div>
                <h2 className="font-headline-md text-headline-md text-royal-navy mb-8">Booking Summary</h2>
                
                <div className="space-y-8 relative z-10">
                  <div className="group">
                    <p className="text-label-caps font-label-caps text-champagne-taupe mb-2">SERVICE</p>
                    <p className="font-body-bold text-body-bold text-royal-navy">{selectedService?.name}</p>
                    <p className="text-body-base text-warm-slate mt-1">
                      {selectedService?.duration} • {selectedService?.price}
                    </p>
                    <div className="h-[1px] bg-gradient-to-r from-[#8E7A5A] to-transparent mt-4 w-1/4 group-hover:w-full transition-all duration-500"></div>
                  </div>

                  <div className="group">
                    <p className="text-label-caps font-label-caps text-champagne-taupe mb-2">ARTIST</p>
                    <div className="flex items-center gap-4">
                      {selectedArtist && (
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#EBEBEB]">
                          <Image src={selectedArtist.image} alt={selectedArtist.name} fill className="object-cover" unoptimized />
                        </div>
                      )}
                      <div>
                        <p className="font-body-bold text-body-bold text-royal-navy">{selectedArtist?.name}</p>
                        <p className="text-body-base text-warm-slate">{selectedArtist?.role}</p>
                      </div>
                    </div>
                    <div className="h-[1px] bg-gradient-to-r from-[#8E7A5A] to-transparent mt-4 w-1/4 group-hover:w-full transition-all duration-500"></div>
                  </div>

                  <div className="group">
                    <p className="text-label-caps font-label-caps text-champagne-taupe mb-2">DATE &amp; TIME</p>
                    <p className="font-body-bold text-body-bold text-royal-navy">
                      Thursday, October {selectedDateDay}, 2026
                    </p>
                    <p className="text-body-base text-warm-slate mt-1">
                      {selectedTimeSlot}
                    </p>
                    <div className="h-[1px] bg-gradient-to-r from-[#8E7A5A] to-transparent mt-4 w-1/4 group-hover:w-full transition-all duration-500"></div>
                  </div>

                  <div className="group">
                    <p className="text-label-caps font-label-caps text-champagne-taupe mb-2">LOCATION</p>
                    <p className="font-body-bold text-body-bold text-royal-navy">Erniekay Flagship Salon</p>
                    <p className="text-body-base text-warm-slate mt-1">128 Luxury Plaza, Victoria Island, Lagos</p>
                    <div className="h-[1px] bg-gradient-to-r from-[#8E7A5A] to-transparent mt-4 w-1/4 group-hover:w-full transition-all duration-500"></div>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-[#EBEBEB] flex justify-between items-end">
                  <div>
                    <p className="text-label-caps font-label-caps text-warm-slate">ESTIMATED TOTAL</p>
                    <p className="font-headline-md text-headline-md text-royal-navy">{selectedService?.price}</p>
                  </div>
                  <span className="text-label-caps font-label-caps text-premium-green flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> SECURE BOOKING
                  </span>
                </div>
              </div>

              {/* Right Column: Customer Info Form */}
              <div className="md:col-span-7 bg-white border border-[#EBEBEB] p-10">
                <h2 className="font-headline-md text-headline-md text-royal-navy mb-4">Personal Information</h2>
                <p className="text-body-base text-warm-slate mb-10">
                  Please provide your details to finalize the appointment. Your information is handled with the utmost discretion.
                </p>
                
                <form onSubmit={handleSubmitBooking} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="relative">
                      <label className="text-label-caps font-label-caps text-champagne-taupe absolute -top-4 left-0">Full Name</label>
                      <input
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-white border-b border-champagne-taupe py-4 font-body-base text-royal-navy placeholder:text-[#D1D1D1] focus:outline-none focus:border-b-royal-navy"
                        placeholder="e.g. Adanna Okoro"
                        type="text"
                      />
                    </div>
                    <div className="relative">
                      <label className="text-label-caps font-label-caps text-champagne-taupe absolute -top-4 left-0">Email Address</label>
                      <input
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white border-b border-champagne-taupe py-4 font-body-base text-royal-navy placeholder:text-[#D1D1D1] focus:outline-none focus:border-b-royal-navy"
                        placeholder="adanna.okoro@example.com"
                        type="email"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="relative">
                      <label className="text-label-caps font-label-caps text-champagne-taupe absolute -top-4 left-0">Phone Number</label>
                      <input
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-white border-b border-champagne-taupe py-4 font-body-base text-royal-navy placeholder:text-[#D1D1D1] focus:outline-none focus:border-b-royal-navy"
                        placeholder="+234 --- --- ----"
                        type="tel"
                      />
                    </div>
                    <div className="relative">
                      <label className="text-label-caps font-label-caps text-champagne-taupe absolute -top-4 left-0">Service Type</label>
                      <div className="w-full bg-white border-b border-champagne-taupe py-4 font-body-base text-royal-navy">
                        Selected: {selectedService?.name}
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <label className="text-label-caps font-label-caps text-champagne-taupe absolute -top-4 left-0">Special Notes or Inquiries</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-white border-b border-champagne-taupe py-4 font-body-base text-royal-navy placeholder:text-[#D1D1D1] resize-none focus:outline-none focus:border-b-royal-navy"
                      placeholder="Share any specific requests or hair concerns with your stylist..."
                      rows={3}
                    ></textarea>
                  </div>

                  <div className="flex items-start gap-3 pt-4">
                    <input
                      required
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-1 border-champagne-taupe rounded-sm text-royal-navy focus:ring-royal-navy cursor-pointer"
                      id="terms"
                      type="checkbox"
                    />
                    <label className="text-body-base text-warm-slate text-sm cursor-pointer" htmlFor="terms">
                      I agree to the <a className="text-royal-navy underline font-body-bold" href="#">Terms of Service</a> and acknowledge the 24-hour cancellation policy.
                    </label>
                  </div>

                  <div className="pt-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <button
                      onClick={handlePrevStep}
                      type="button"
                      className="text-label-caps font-label-caps text-warm-slate hover:text-royal-navy flex items-center gap-2 group transition-colors"
                    >
                      <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
                      Back to Calendar
                    </button>
                    <button
                      disabled={isSubmitting}
                      className="w-full md:w-auto bg-majestic-gold text-royal-navy px-12 py-5 text-label-caps font-label-caps uppercase tracking-[0.2em] font-bold shadow-lg hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-50"
                      type="submit"
                    >
                      {isSubmitting ? "Processing..." : "Confirm Booking"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* STEP 5: SUCCESS / CONFIRMATION RECEIPT */}
          {step === 5 && (
            <div className="max-w-2xl mx-auto bg-white border border-majestic-gold p-8 md:p-12 text-center shadow-lg space-y-8">
              <div className="w-16 h-16 rounded-full bg-premium-green/10 border border-premium-green flex items-center justify-center mx-auto text-premium-green">
                <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
              </div>

              <div className="space-y-2">
                <span className="text-[12px] font-bold font-label-caps tracking-[0.2em] text-champagne-taupe uppercase block">
                  Practical Session Booked
                </span>
                <h2 className="font-[family-name:var(--font-eb-garamond)] text-[32px] md:text-[40px] text-royal-navy font-bold">
                  Your Training Session is Set
                </h2>
                <p className="text-warm-slate text-[15px] font-[family-name:var(--font-montserrat)] leading-[24px]">
                  Thank you! Your scheduling for {selectedService?.name} is successfully processed. A digital invitation has been dispatched to your student email inbox.
                </p>
              </div>

              {/* Invoice details */}
              <div className="border border-champagne-taupe/20 bg-alabaster-white/50 p-6 text-left space-y-4">
                <h4 className="text-[12px] font-bold font-label-caps tracking-[0.15em] text-royal-navy border-b border-champagne-taupe/20 pb-2 uppercase">
                  Booking Receipt Details
                </h4>
                <div className="space-y-2 text-[14px] font-[family-name:var(--font-montserrat)] text-warm-slate">
                  <div className="flex justify-between">
                    <span>Student Name</span>
                    <span className="font-bold text-royal-navy">{fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service</span>
                    <span className="font-bold text-royal-navy">{selectedService?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Assigned Professional</span>
                    <span className="font-bold text-royal-navy">{selectedArtist?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date &amp; Time</span>
                    <span className="font-semibold text-royal-navy">
                      October {selectedDateDay}, 2026 at {selectedTimeSlot}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/academy/portal/dashboard"
                  className="px-8 py-3 text-royal-navy border border-royal-navy font-bold font-label-caps text-[12px] tracking-[0.1em] uppercase hover:bg-royal-navy hover:text-white transition-all text-center"
                >
                  Return to Dashboard
                </Link>
                <button
                  onClick={handleReset}
                  className="px-8 py-3 bg-royal-navy text-majestic-gold border border-majestic-gold font-bold font-label-caps text-[12px] tracking-[0.1em] uppercase hover:bg-majestic-gold hover:text-royal-navy transition-all active:scale-95"
                >
                  Book Another Session
                </button>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ── STICKY FOOTER SUMMARY BAR (STEP 3 ONLY) ── */}
      {step === 3 && (
        <footer className="fixed bottom-0 left-0 w-full bg-royal-navy text-white z-[60] border-t border-majestic-gold">
          <div className="max-w-[1280px] mx-auto px-6 md:px-[64px] py-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6">
              <div className="hidden md:block">
                <p className="text-label-caps font-label-caps text-outline-variant">Service</p>
                <p className="font-body-bold text-[14px]">
                  {selectedService ? selectedService.name : "None Selected"}
                </p>
              </div>
              <div className="w-[1px] h-10 bg-warm-slate hidden md:block"></div>
              <div>
                <p className="text-label-caps font-label-caps text-outline-variant">Artisan</p>
                <p className="font-body-bold text-[14px]">
                  {selectedArtist ? selectedArtist.name : "None Selected"}
                </p>
              </div>
              <div className="w-[1px] h-10 bg-warm-slate hidden md:block"></div>
              <div>
                <p className="text-label-caps font-label-caps text-outline-variant">Selected Slot</p>
                <p className="font-body-bold text-majestic-gold text-[14px]">
                  {selectedDateDay && selectedTimeSlot ? `Oct ${selectedDateDay} • ${selectedTimeSlot}` : "Choose Slot"}
                </p>
              </div>
            </div>
            <button
              onClick={handleNextStep}
              disabled={!selectedDateDay || !selectedTimeSlot}
              className="w-full md:w-auto bg-majestic-gold text-royal-navy px-12 py-4 font-label-caps text-[12px] uppercase tracking-widest hover:bg-yellow-400 active:scale-95 transition-all font-bold disabled:opacity-50"
            >
              Confirm Schedule
            </button>
          </div>
        </footer>
      )}

      {/* MOBILE bottom navigation fixed bar */}
      <nav className="fixed bottom-0 left-0 w-full h-16 bg-surface border-t border-champagne-taupe/30 flex items-center justify-around z-50 md:hidden">
        <Link className="flex flex-col items-center gap-1 text-warm-slate" href="/academy/portal/courses">
          <span className="material-symbols-outlined">school</span>
          <span className="font-[family-name:var(--font-montserrat)] text-[10px] font-bold">Courses</span>
        </Link>
        <Link className="flex flex-col items-center gap-1 text-majestic-gold" href="/academy/portal/schedule">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_today</span>
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

    </div>
  );
}
