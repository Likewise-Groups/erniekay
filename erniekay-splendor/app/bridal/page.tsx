"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "sending" | "sent">("idle");

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
      package: null
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
        
        {/* ── HERO SECTION ── */}
        {/* Desktop Viewport (Double-column layout) */}
        <section className="hidden md:grid md:grid-cols-12 gap-0 min-h-[614px] items-center">
          <div className="md:col-span-7 px-6 md:px-[64px] py-12 md:py-24 space-y-8">
            <div className="space-y-4">
              <span className="font-label-caps text-label-caps text-champagne-taupe tracking-[0.3em] block">
                ERNIEKAY SPLENDOR
              </span>
              <h1 className="font-display-lg text-[36px] md:text-[48px] leading-tight text-royal-navy font-semibold">
                Commence Your <br />
                <span className="italic font-normal">Bridal Ritual</span>
              </h1>
            </div>
            <p className="font-body-base text-body-base text-warm-slate max-w-lg leading-relaxed">
              A celebration of bespoke artistry and refined elegance. We invite you to share the canvas of your wedding day vision, allowing our master artisans to curate a look that is as timeless as your commitment.
            </p>
            <div className="flex items-center gap-4 text-royal-navy">
              <span className="w-12 h-[1px] bg-majestic-gold"></span>
              <span className="font-label-caps text-label-caps font-bold">PRIVATE CONSULTATIONS</span>
            </div>
          </div>
          <div className="md:col-span-5 min-h-[614px] relative overflow-hidden">
            <Image
              alt="Bridal Elegance"
              className="absolute inset-0 w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAu2K-jCwTYPY4OGxpXIydkWvZA1enPk7Y8tQrq8gf0RyVrtS7HZIJiXXDiqTd4FPNX7KANSpsfpq3Bemevz81WDo_LY7bUuNODcdlTL2iaXusEGAXNhyyRyFRhyXM_h2rvFvdd-S6DrpYnGpD7OHZ27_HZ3Vx0nXs9_ZqRlTLIoE7MPTlZNDq0G_62-6tjld9TRtqIpGCS-KwV5zeGrWY3ID60TQ6FGxTePf_V9VyH68IbNgjCOMNf0ei1ATZ_Yy04wmfWjlZ6_Hc"
              fill
              priority
              unoptimized
            />
          </div>
        </section>

        {/* Mobile Viewport (Background Image with gradient bottom text overlay) */}
        <section className="relative h-[530px] flex items-end md:hidden">
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <Image
              alt="Luxury Bridal Styling"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLUjDwWZofdBXYM4hbc0Tt7PQfxQG71GjPvbYgNl8DEKXAPCSIi3X9pdkq-MAl1c8lY2yc7zBfJ5_B1kqoHfZA-GVGmHFG3rqej-yVIOh8SHBMkWURwDST_8BZzu60I0y1SMxuMrYC7ZplGpU31twr3VCHmvupCxVK2VuDaHNCxygzL9y-3twYjwUqoT4F-Q69D_2-HQw6Al0nBE3H2_qbh3rC1t-07L_we0ccGJx6KDYp1Ft0NaT4WTecNPWRMfB197ISBDdxncw"
              fill
              priority
              unoptimized
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-royal-navy/80 via-transparent to-transparent"></div>
          <div className="relative px-6 pb-12 w-full text-alabaster-white z-10">
            <h1 className="font-display-lg-mobile text-[32px] font-semibold leading-tight mb-4">
              Commence Your Bridal Ritual
            </h1>
            <p className="font-body-base opacity-90 max-w-sm">
              Welcome to a sanctuary of bespoke beauty. Entrust your vision to our artistry as we prepare for your most sacred celebration.
            </p>
          </div>
        </section>

        {/* ── FORM & TIMELINE SECTION ── */}
        <section className="px-6 md:px-[64px] py-12 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter-desktop">
            
            {/* Left: Main Form */}
            <div className="md:col-span-8 bg-surface-container-lowest border border-champagne-taupe/10 p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-16">
                
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
