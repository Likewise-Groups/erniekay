"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BridalPackages from "@/components/bridal/BridalPackages";
import { submitBridalInquiry } from "@/app/actions/bridal";

export default function BridalInquiryPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [social, setSocial] = useState("");
  const [weddingDate, setWeddingDate] = useState("");
  const [venue, setVenue] = useState("");
  const [totalGuests, setTotalGuests] = useState("");
  const [bridalPartySize, setBridalPartySize] = useState("");
  const [aesthetic, setAesthetic] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [prepLocation, setPrepLocation] = useState("");
  const [extraMakeupCount, setExtraMakeupCount] = useState("");
  const [groomService, setGroomService] = useState<"" | "Yes" | "No">("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "sending" | "sent">("idle");

  const handleSelectPackage = (pkg: string) => {
    setSelectedPackage(pkg);
    document
      .getElementById("bridal-enquiry")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const services = [
    "Bridal Hair",
    "Bridal Makeup",
    "Bridal Party Styling",
    "Pre-Wedding Treatments"
  ];

  const handleCheckboxChange = (service: string) => {
    setSelectedServices(prev => 
      prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("sending");

    const result = await submitBridalInquiry({
      fullName,
      email,
      phone,
      socialHandle: social,
      weddingDate,
      venue,
      totalGuests,
      bridalPartySize,
      aesthetic,
      selectedServices,
      package: selectedPackage,
      prepLocation,
      extraMakeupCount,
      groomService:
        groomService === "Yes" ? true : groomService === "No" ? false : null
    });

    setIsSubmitting(false);
    if (result.success) {
      setSubmitStatus("sent");
      setTimeout(() => {
        setSubmitStatus("idle");
        // Reset form
        setFullName("");
        setEmail("");
        setPhone("");
        setSocial("");
        setWeddingDate("");
        setVenue("");
        setTotalGuests("");
        setBridalPartySize("");
        setAesthetic("");
        setSelectedServices([]);
        setSelectedPackage(null);
        setPrepLocation("");
        setExtraMakeupCount("");
        setGroomService("");
      }, 3000);
    } else {
      setSubmitStatus("idle");
      alert(result.error);
    }
  };

  return (
    <div className="bg-surface-bright text-on-surface font-body-base antialiased selection:bg-majestic-gold selection:text-royal-navy overflow-x-hidden">
      <Navbar />

      <main className="max-w-[1280px] mx-auto overflow-hidden pt-20">
        
        {/* ── HERO SECTION (modern, video-led) ── */}
        <section className="relative overflow-hidden bg-midnight-ink text-alabaster-white">
          {/* Ambient glows */}
          <div className="pointer-events-none absolute -top-1/4 -left-1/4 h-[600px] w-[600px] rounded-full bg-majestic-gold/10 blur-[120px]" />
          <div className="pointer-events-none absolute -bottom-1/3 right-0 h-[500px] w-[500px] rounded-full bg-royal-navy/50 blur-[100px]" />

          <div className="relative z-10 grid grid-cols-1 items-center gap-12 px-6 py-16 md:px-[64px] md:py-24 lg:grid-cols-2 lg:gap-8">
            {/* Left — copy */}
            <div className="max-w-xl space-y-8">
              <span className="font-label-caps text-label-caps block tracking-[0.3em] text-majestic-gold">
                ERNIEKAY SPLENDOR · BRIDAL 2026
              </span>
              <h1 className="font-display-lg text-[44px] font-semibold leading-[1.05] md:text-[64px]">
                Commence Your <br />
                <span className="italic font-normal text-majestic-gold">Bridal Ritual</span>
              </h1>
              <p className="font-body-base text-body-base leading-relaxed text-alabaster-white/70">
                A celebration of bespoke artistry and refined elegance. Share the canvas
                of your wedding-day vision, and let our master artisans curate a look as
                timeless as your commitment.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <button
                  type="button"
                  onClick={() =>
                    document
                      .getElementById("bridal-packages")
                      ?.scrollIntoView({ behavior: "smooth", block: "start" })
                  }
                  className="font-label-caps text-label-caps bg-majestic-gold px-8 py-4 font-bold text-royal-navy shadow-[0_10px_30px_rgba(212,175,55,0.25)] transition-all duration-300 hover:-translate-y-1 hover:bg-white"
                >
                  View Packages
                </button>
                <button
                  type="button"
                  onClick={() =>
                    document
                      .getElementById("bridal-enquiry")
                      ?.scrollIntoView({ behavior: "smooth", block: "start" })
                  }
                  className="font-label-caps text-label-caps border border-alabaster-white/40 px-8 py-4 font-bold transition-colors hover:border-majestic-gold hover:text-majestic-gold"
                >
                  Make an Enquiry
                </button>
              </div>
              <div className="flex items-center gap-4 pt-2">
                <span className="h-[1px] w-12 bg-majestic-gold" />
                <span className="font-label-caps text-label-caps font-bold text-alabaster-white/80">
                  PRIVATE CONSULTATIONS
                </span>
              </div>
            </div>

            {/* Right — layered videos */}
            <div className="relative h-[440px] sm:h-[540px] lg:h-[600px]">
              {/* Primary video */}
              <div className="absolute right-0 top-0 h-[86%] w-[72%] overflow-hidden rounded-[28px] shadow-2xl ring-1 ring-white/15">
                <video
                  className="h-full w-full object-cover"
                  src="/obremsmakeover_19-Jun-2026.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster="/makeup4.jpg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-midnight-ink/40 to-transparent" />
              </div>

              {/* Secondary video, overlapping */}
              <div className="absolute bottom-0 left-0 h-[56%] w-[54%] overflow-hidden rounded-[28px] shadow-2xl ring-2 ring-majestic-gold/50">
                <video
                  className="h-full w-full object-cover"
                  src="/hair.MOV"
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster="/hair1.jpg"
                />
              </div>

              {/* Floating caption chip */}
              <div className="absolute right-6 bottom-4 z-10 bg-midnight-ink/70 px-4 py-2 backdrop-blur-sm">
                <span className="font-label-caps text-[10px] font-bold tracking-[0.2em] text-majestic-gold">
                  LIVE ARTISTRY
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── PACKAGES & PRICING ── */}
        <div id="bridal-packages" className="scroll-mt-24">
          <BridalPackages
            onSelectPackage={handleSelectPackage}
            selectedPackage={selectedPackage}
          />
        </div>

        {/* ── FORM & TIMELINE SECTION ── */}
        <section id="bridal-enquiry" className="scroll-mt-24 px-6 md:px-[64px] py-12 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter-desktop">
            
            {/* Left: Main Form */}
            <div className="md:col-span-8 bg-surface-container-lowest border border-champagne-taupe/10 p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-16">

                {/* Package of interest (set from the collections above) */}
                {selectedPackage && (
                  <div className="flex items-center justify-between gap-4 border-l-4 border-majestic-gold bg-alabaster-white/60 px-5 py-4">
                    <div>
                      <p className="font-label-caps text-[11px] font-bold text-champagne-taupe tracking-[0.15em] uppercase">
                        Package of Interest
                      </p>
                      <p className="font-headline-md text-royal-navy mt-1">{selectedPackage}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedPackage(null)}
                      className="font-label-caps text-[11px] font-bold text-warm-slate hover:text-royal-navy transition-colors uppercase tracking-[0.15em]"
                    >
                      Clear
                    </button>
                  </div>
                )}

                {/* 01: The Individual */}
                <div className="space-y-8">
                  <div className="flex items-baseline gap-4">
                    <span
                      className="text-[32px] md:text-[40px] font-semibold leading-none"
                      style={{ WebkitTextStroke: "1px #FFD400", color: "transparent" }}
                    >
                      01
                    </span>
                    <h2 className="font-headline-md text-headline-md text-royal-navy">The Individual</h2>
                  </div>
                  <div className="space-y-6">
                    <div className="relative">
                      <label className="font-label-caps text-[11px] font-bold text-royal-navy block mb-1">Full Name</label>
                      <input
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-transparent border-t-0 border-x-0 border-b border-champagne-taupe/40 py-3 focus:ring-0 focus:outline-none focus:border-b-royal-navy px-0 placeholder-warm-slate/30"
                        placeholder="Genevieve Sterling"
                        type="text"
                      />
                    </div>
                    <div className="relative">
                      <label className="font-label-caps text-[11px] font-bold text-royal-navy block mb-1">Email Address</label>
                      <input
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-transparent border-t-0 border-x-0 border-b border-champagne-taupe/40 py-3 focus:ring-0 focus:outline-none focus:border-b-royal-navy px-0 placeholder-warm-slate/30"
                        placeholder="grace@example.com"
                        type="email"
                      />
                    </div>
                    <div className="relative">
                      <label className="font-label-caps text-[11px] font-bold text-royal-navy block mb-1">Phone Number</label>
                      <input
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-transparent border-t-0 border-x-0 border-b border-champagne-taupe/40 py-3 focus:ring-0 focus:outline-none focus:border-b-royal-navy px-0 placeholder-warm-slate/30"
                        placeholder="+1 (555) 000-0000"
                        type="tel"
                      />
                    </div>
                    <div className="relative">
                      <label className="font-label-caps text-[11px] font-bold text-royal-navy block mb-1">Social Handle</label>
                      <input
                        value={social}
                        onChange={(e) => setSocial(e.target.value)}
                        className="w-full bg-transparent border-t-0 border-x-0 border-b border-champagne-taupe/40 py-3 focus:ring-0 focus:outline-none focus:border-b-royal-navy px-0 placeholder-warm-slate/30"
                        placeholder="@bridal_elegance"
                        type="text"
                      />
                    </div>
                  </div>
                </div>

                {/* 02: The Occasion */}
                <div className="space-y-8">
                  <div className="flex items-baseline gap-4">
                    <span
                      className="text-[32px] md:text-[40px] font-semibold leading-none"
                      style={{ WebkitTextStroke: "1px #FFD400", color: "transparent" }}
                    >
                      02
                    </span>
                    <h2 className="font-headline-md text-headline-md text-royal-navy">The Occasion</h2>
                  </div>
                  <div className="space-y-6">
                    <div className="relative">
                      <label className="font-label-caps text-[11px] font-bold text-royal-navy block mb-1">Date of Marriage</label>
                      <input
                        required
                        value={weddingDate}
                        onChange={(e) => setWeddingDate(e.target.value)}
                        className="w-full bg-transparent border-t-0 border-x-0 border-b border-champagne-taupe/40 py-3 focus:ring-0 focus:outline-none focus:border-b-royal-navy px-0 text-warm-slate"
                        type="date"
                      />
                    </div>
                    <div className="relative">
                      <label className="font-label-caps text-[11px] font-bold text-royal-navy block mb-1">Venue &amp; Location</label>
                      <input
                        required
                        value={venue}
                        onChange={(e) => setVenue(e.target.value)}
                        className="w-full bg-transparent border-t-0 border-x-0 border-b border-champagne-taupe/40 py-3 focus:ring-0 focus:outline-none focus:border-b-royal-navy px-0 placeholder-warm-slate/30"
                        placeholder="St. Regis, Florence"
                        type="text"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="relative">
                        <label className="font-label-caps text-[11px] font-bold text-royal-navy block mb-1">Total Guests</label>
                        <input
                          value={totalGuests}
                          onChange={(e) => setTotalGuests(e.target.value)}
                          className="w-full bg-transparent border-t-0 border-x-0 border-b border-champagne-taupe/40 py-3 focus:ring-0 focus:outline-none focus:border-b-royal-navy px-0 placeholder-warm-slate/30"
                          placeholder="150"
                          type="number"
                        />
                      </div>
                      <div className="relative">
                        <label className="font-label-caps text-[11px] font-bold text-royal-navy block mb-1">Bridal Party Size</label>
                        <input
                          value={bridalPartySize}
                          onChange={(e) => setBridalPartySize(e.target.value)}
                          className="w-full bg-transparent border-t-0 border-x-0 border-b border-champagne-taupe/40 py-3 focus:ring-0 focus:outline-none focus:border-b-royal-navy px-0 placeholder-warm-slate/30"
                          placeholder="6"
                          type="number"
                        />
                      </div>
                    </div>
                    <div className="relative">
                      <label className="font-label-caps text-[11px] font-bold text-royal-navy block mb-1">Bridal Prep Location</label>
                      <input
                        value={prepLocation}
                        onChange={(e) => setPrepLocation(e.target.value)}
                        className="w-full bg-transparent border-t-0 border-x-0 border-b border-champagne-taupe/40 py-3 focus:ring-0 focus:outline-none focus:border-b-royal-navy px-0 placeholder-warm-slate/30"
                        placeholder="Hotel, home or studio where you'll get ready"
                        type="text"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="relative">
                        <label className="font-label-caps text-[11px] font-bold text-royal-navy block mb-1">Bridesmaids / Mothers Needing Makeup</label>
                        <input
                          value={extraMakeupCount}
                          onChange={(e) => setExtraMakeupCount(e.target.value)}
                          className="w-full bg-transparent border-t-0 border-x-0 border-b border-champagne-taupe/40 py-3 focus:ring-0 focus:outline-none focus:border-b-royal-navy px-0 placeholder-warm-slate/30"
                          placeholder="0"
                          type="number"
                          min="0"
                        />
                      </div>
                      <div className="relative">
                        <label className="font-label-caps text-[11px] font-bold text-royal-navy block mb-2">Groom Service</label>
                        <div className="flex gap-3 pt-1">
                          {(["Yes", "No"] as const).map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => setGroomService(option)}
                              className={`px-6 py-2 font-label-caps text-[11px] font-bold uppercase tracking-[0.15em] transition-all active:scale-95 ${
                                groomService === option
                                  ? "border border-majestic-gold text-majestic-gold"
                                  : "border border-outline-variant text-warm-slate hover:border-royal-navy"
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 03: The Vision */}
                <div className="space-y-8">
                  <div className="flex items-baseline gap-4">
                    <span
                      className="text-[32px] md:text-[40px] font-semibold leading-none"
                      style={{ WebkitTextStroke: "1px #FFD400", color: "transparent" }}
                    >
                      03
                    </span>
                    <h2 className="font-headline-md text-headline-md text-royal-navy">The Vision</h2>
                  </div>
                  <div className="space-y-6">
                    <div className="relative">
                      <label className="font-label-caps text-[11px] font-bold text-royal-navy block mb-1">Desired Aesthetic</label>
                      <textarea
                        value={aesthetic}
                        onChange={(e) => setAesthetic(e.target.value)}
                        className="w-full bg-transparent border-t-0 border-x-0 border-b border-champagne-taupe/40 py-3 focus:ring-0 focus:outline-none focus:border-b-royal-navy px-0 placeholder-warm-slate/30 resize-none"
                        placeholder="Describe your dream look..."
                        rows={3}
                      ></textarea>
                    </div>
                    <div className="space-y-4">
                      <label className="font-label-caps text-[11px] font-bold text-royal-navy block mb-2">Services of Interest</label>
                      
                      {/* Responsive Grid view for Checkboxes */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {services.map((service) => {
                          const isSelected = selectedServices.includes(service);
                          return (
                            <label
                              key={service}
                              className={`flex items-center gap-3 p-4 border rounded-lg active:bg-alabaster-white transition-colors cursor-pointer ${
                                isSelected ? "border-majestic-gold bg-alabaster-white/20" : "border-outline-variant"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleCheckboxChange(service)}
                                className="w-5 h-5 rounded-none border-royal-navy text-majestic-gold focus:ring-0 cursor-pointer"
                              />
                              <span className="font-body-base text-royal-navy font-medium">
                                {service}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Action Button */}
                <button
                  disabled={isSubmitting}
                  className={`w-full h-16 font-body-bold tracking-widest shadow-lg active:scale-95 transition-all font-bold ${
                    submitStatus === "sent"
                      ? "bg-premium-green text-white"
                      : "bg-majestic-gold text-royal-navy hover:brightness-105"
                  }`}
                  type="submit"
                >
                  {submitStatus === "idle" && "SUBMIT INQUIRY"}
                  {submitStatus === "sending" && "TRANSMITTING..."}
                  {submitStatus === "sent" && "INQUIRY SENT ✓"}
                </button>
              </form>
            </div>

            {/* Right: Sidebar / Timeline Callout (Desktop Viewport only) */}
            <div className="md:col-span-4 space-y-12 hidden md:block">
              <div className="bg-royal-navy p-8 md:p-10 text-alabaster-white border-l-4 border-majestic-gold">
                <h3 className="font-headline-md text-headline-md text-majestic-gold mb-8">Inquiry to Artistry</h3>
                <div className="space-y-10 relative">
                  <div className="absolute left-[15px] top-2 bottom-2 w-[1px] bg-champagne-taupe/30"></div>
                  
                  {/* Step A */}
                  <div className="flex items-start gap-6 relative">
                    <div className="w-8 h-8 rounded-full bg-majestic-gold flex items-center justify-center shrink-0 z-10">
                      <span className="material-symbols-outlined text-royal-navy text-sm font-bold">chat</span>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-label-caps text-label-caps text-majestic-gold font-bold">CONSULTATION</h4>
                      <p className="font-body-base text-sm opacity-80 leading-relaxed">
                        A private dialogue to define your stylistic DNA and logistics.
                      </p>
                    </div>
                  </div>

                  {/* Step B */}
                  <div className="flex items-start gap-6 relative">
                    <div className="w-8 h-8 rounded-full bg-royal-navy border border-champagne-taupe/50 flex items-center justify-center shrink-0 z-10">
                      <span className="material-symbols-outlined text-champagne-taupe text-sm">brush</span>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-label-caps text-label-caps font-bold">THE TRIAL</h4>
                      <p className="font-body-base text-sm opacity-80 leading-relaxed">
                        A physical realization of your bridal aesthetic at our sanctuary salon.
                      </p>
                    </div>
                  </div>

                  {/* Step C */}
                  <div className="flex items-start gap-6 relative">
                    <div className="w-8 h-8 rounded-full bg-royal-navy border border-champagne-taupe/50 flex items-center justify-center shrink-0 z-10">
                      <span className="material-symbols-outlined text-champagne-taupe text-sm">auto_awesome</span>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-label-caps text-label-caps font-bold">RITUAL DAY</h4>
                      <p className="font-body-base text-sm opacity-80 leading-relaxed">
                        Seamless execution of your vision with a dedicated elite team.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Graphic aspect box */}
              <div className="relative group aspect-[3/4] overflow-hidden">
                <Image
                  alt="Makeup Texture"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMpoGVOzfGl6hchnHfCuAfeHiEi2sgGe92KX2oe0y8eOJ4P92Lk5It04GBKRl9twKKgFEtIl0sLCW0H3sk4TeqcE-qdMrjc6TgA9hT2xq8ifivjnx-4UmuNE8cBXMKTnLOzoohXNcVrFDkwv8VPn5dGwnUjwepmSIcZOAgD4tmWqHJbeaf1JiYmaiOmzJ1sa4eXe0Pc0cDGBjRlCOUWku8u2R4rVPMH85330DCF11_kYssfJaCQh5f0yIRTaAQpZeL1aVKlXh2nUM"
                  fill
                  sizes="(max-width: 768px) 100vw, 30vw"
                  unoptimized
                />
                <div className="absolute inset-0 bg-royal-navy/20 flex items-end p-8">
                  <p className="font-display-lg text-headline-md text-alabaster-white italic">
                    &ldquo;Artistry is the silent language of elegance.&rdquo;
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ── Mobile Journey Timeline (Visible only on Mobile) ── */}
        <section className="px-6 py-20 bg-midnight-ink text-alabaster-white md:hidden">
          <h3 className="font-label-caps text-majestic-gold mb-12 tracking-[0.2em] text-center font-bold">
            THE BRIDAL JOURNEY
          </h3>
          <div className="space-y-12">
            
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-10 h-10 border border-majestic-gold rounded-full flex items-center justify-center font-headline-md text-majestic-gold font-bold">
                1
              </div>
              <div>
                <h4 className="font-headline-md text-[20px] mb-2 font-semibold">Consultation</h4>
                <p className="font-body-base opacity-70 text-sm leading-relaxed">
                  A virtual or in-person dialogue to define your stylistic DNA and logistics.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-10 h-10 border border-majestic-gold rounded-full flex items-center justify-center font-headline-md text-majestic-gold font-bold">
                2
              </div>
              <div>
                <h4 className="font-headline-md text-[20px] mb-2 font-semibold">The Trial</h4>
                <p className="font-body-base opacity-70 text-sm leading-relaxed">
                  The first physical iteration of your vision, perfected in our private atelier.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-10 h-10 border border-majestic-gold rounded-full flex items-center justify-center font-headline-md text-majestic-gold font-bold">
                3
              </div>
              <div>
                <h4 className="font-headline-md text-[20px] mb-2 font-semibold">Ritual Day</h4>
                <p className="font-body-base opacity-70 text-sm leading-relaxed">
                  On-site excellence. We manage the atmosphere so you can inhabit the moment.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* ── Desktop Sanctuary Gallery View (Visible on Desktop) ── */}
        <section className="py-12 md:py-24 bg-alabaster-white hidden md:block">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12 max-w-[1280px] mx-auto px-6">
            <div className="space-y-6">
              <h2 className="font-display-lg text-[32px] md:text-[36px] text-royal-navy font-semibold leading-tight">
                The Bridal Sanctuary
              </h2>
              <p className="font-body-base text-body-base text-warm-slate leading-relaxed">
                Located in the heart of the city, our salon serves as a private sanctuary for brides. Every appointment is a curated experience, designed to provide tranquility before your grand occasion.
              </p>
              <Link href="#" className="inline-flex items-center gap-3 text-royal-navy font-label-caps text-label-caps group font-bold">
                EXPLORE THE ATELIER
                <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_forward</span>
              </Link>
            </div>
            <div>
              <div className="flex gap-4">
                <div className="w-1/2 aspect-square relative overflow-hidden border border-outline-variant/10">
                  <Image
                    alt="Salon Interior"
                    className="object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCX1IjzJKLGkfqTuSju92AOURjeBjzdMV5DI8iYUcMgTswwkbMoM7bSkYk5C5T6HEfD-yAho-mGRBqEQarjpiEYybGhLz-tD9DcekIaEqIoGHSsyD9UIZuKz399_rsJIhmkXT4F1j5C2yFp-SXg6YQm_WRIzABb4bCNwf8mtB11Bun10i4o-TuRJb7h8y5BUJREUF5TBbcw3VIWYTARRs-HWGpEql_0_r3I0PTlBExEUEvNTx6eP-bc1A-PmU4qcSQQ03-6w_MZj8"
                    fill
                    unoptimized
                  />
                </div>
                <div className="w-1/2 aspect-square relative overflow-hidden mt-12 border border-outline-variant/10">
                  <Image
                    alt="Beauty Details"
                    className="object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBytlJzHJseglLdG3St2iFHhxsKbNK6A5QLA53RzdDX06Jb6yxHCKZh8qpmzDn75VzAOj4GWh6foYRH9aIoD54PQ8h8bgxrLBSt05n6VYnmd_GC5HE0vpvZJxkrw2VuN6fgeG8oSgu5iBQCVo_Q6j_5CPTCP6geBNnbaJ_cyvGYfCRGoYosasAy2hNgQnqEtPJQwztS1VKkGukpQ1NoN2BlRG0mosry9ShwQpQaF_YHuvf_ugQ86H_e2Niu-XC8G5VtmZafg1HSbaA"
                    fill
                    unoptimized
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Mobile Sanctuary Box View (Visible on Mobile) ── */}
        <section className="p-6 bg-surface md:hidden">
          <div className="border border-outline-variant bg-white p-6 space-y-6">
            <div className="relative w-full aspect-video overflow-hidden">
              <Image
                alt="Our Atelier"
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzdflQHM06tcTHJX4o3VaPG0Z3dtrZBhYT3Wa2ibom9bPcZ6VaDHNwhRGdOBV2OgxZSHF1rtlZFEJNN9rQ2WUmO9JZ5YnxF5IxZI3lrSys5qIjY8S1ITlEO1WpSAV4vmMMNC5t4C3IieF2cyggxdr7DBrgmuoW2YgKNAw9umUHanaOSoYWXYBVKsnjGOpS1YFD45kLaxyC3O7_DeCUTS3ckNq1rf33Ornr-RtCokpZwVMDzAHsUNTd1q_4fomkPlTcxLdAX4bp-vc"
                fill
                unoptimized
              />
            </div>
            <div>
              <h3 className="font-headline-md text-headline-md text-royal-navy mb-2">The Bridal Sanctuary</h3>
              <p className="font-body-base text-warm-slate mb-6 text-sm leading-relaxed">
                Experience our signature services in the heart of our flagship salon—a space designed for the ultimate preparation ritual.
              </p>
              <Link href="#" className="inline-flex items-center gap-2 font-label-caps text-royal-navy group font-bold">
                EXPLORE THE ATELIER
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-midnight-ink pt-16 pb-8 border-t border-on-primary-container">
        <div className="flex flex-col items-center gap-8 px-6 text-center">
          <span className="font-display-lg text-[32px] md:text-[48px] text-majestic-gold font-semibold leading-none">
            ERNIEKAY SPLENDOR
          </span>
          <div className="flex flex-wrap justify-center gap-6">
            <Link className="font-label-caps text-alabaster-white opacity-70 hover:text-majestic-gold hover:opacity-100 transition-all" href="#">
              The Salon
            </Link>
            <Link className="font-label-caps text-alabaster-white opacity-70 hover:text-majestic-gold hover:opacity-100 transition-all" href="/academy">
              The Academy
            </Link>
            <Link className="font-label-caps text-majestic-gold underline decoration-1 underline-offset-4" href="/bridal">
              Bridal Rituals
            </Link>
            <Link className="font-label-caps text-alabaster-white opacity-70 hover:text-majestic-gold hover:opacity-100 transition-all" href="#">
              Privacy Policy
            </Link>
          </div>
          <div className="flex gap-6 mt-4 text-majestic-gold">
            <span className="material-symbols-outlined cursor-pointer">share</span>
            <span className="material-symbols-outlined cursor-pointer font-bold">camera</span>
          </div>
          <p className="font-label-caps text-majestic-gold opacity-60 text-[10px] mt-8 tracking-[0.2em]">
            © 2024 ERNIEKAY SPLENDOR. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>
  );
}
