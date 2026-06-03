"use client";

import { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    message: "",
  });

  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Inquiry Submitted:", formData);
    alert(
      "Thank you for your inquiry. Our concierge team will review your details and reach out within 24 business hours."
    );
    setFormData({
      name: "",
      email: "",
      phone: "",
      department: "",
      message: "",
    });
  };

  const toggleAccordion = (index: number) => {
    setActiveAccordion((prev) => (prev === index ? null : index));
  };

  const faqs = [
    {
      q: "WHAT IS THE BRIDAL BOOKING TIMELINE?",
      a: "We recommend inquiring at least 6–9 months in advance for peak wedding seasons. However, we maintain a limited number of slots for shorter timelines when possible.",
    },
    {
      q: "DO YOU OFFER TRAVEL SERVICES?",
      a: "Yes, our elite team is available for domestic and international destination bookings. Bespoke travel arrangements are curated upon inquiry approval.",
    },
    {
      q: "ACADEMY ADMISSIONS PROCESS?",
      a: "Prospective students must complete an initial application followed by a portfolio review and personal interview with our Director of Education.",
    },
  ];

  return (
    <div className="bg-surface text-on-surface selection:bg-majestic-gold selection:text-royal-navy">
      <Navbar />

      <main className="pt-20">
        
        {/* ── DESKTOP Content View (md+) ── */}
        <div className="hidden md:block">
          {/* Desktop Hero Section */}
          <section className="relative py-[112px] px-[64px] bg-surface overflow-hidden">
            <div className="max-w-[1280px] mx-auto grid grid-cols-12 gap-[24px] items-center">
              <div className="col-span-7 z-10">
                <span className="font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.3em] text-champagne-taupe mb-4 block uppercase font-bold">
                  CONNECT WITH US
                </span>
                <h1 className="font-[family-name:var(--font-eb-garamond)] text-[48px] leading-[56px] font-semibold text-royal-navy mb-8">
                  Contact &amp; Inquiry
                </h1>
                <p className="font-[family-name:var(--font-montserrat)] text-[16px] leading-[26px] text-warm-slate max-w-xl mb-12 border-l-2 border-majestic-gold pl-6">
                  Experience the pinnacle of beauty artistry and education. Whether you are seeking a bespoke bridal transformation, professional salon services, or enrollment in our elite academy, our team is dedicated to providing a tailored service that mirrors your own standard of excellence.
                </p>
              </div>
              <div className="col-span-5 h-[600px] relative">
                <div className="absolute inset-0 bg-alabaster-white border border-outline-variant transform translate-x-4 translate-y-4"></div>
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <Image
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    alt="Luxury salon interior with royal navy chairs and minimalist marble floors"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA880t4MZNTQgq2EpwMkptu_lK8zaz51gFtJm9dTI9OqzuaPsadd8K-HRtoxF5L1IJ2-3V6y8KhheKIVQdldWMOTcUZqTjlmkzuji_Ic-zxBt15qFGOL5KUY-nQqvQEW6j5WsW0y9Q_RiOlzyCe9plkIB4rXVF2JT5x-2Gd4TLvNWuK7nEIwECXOgdKFbaIpXX2eVhbsaI8YNTdHMACvUhwS_-7uS4btTQN18w-ZPiNdLMc0ZGnMSKCGLFQ12AiEGPswo3l0GDbAnY"
                    fill
                    unoptimized
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Desktop Inquiry Details Grid */}
          <section className="py-[112px] px-[64px] bg-alabaster-white">
            <div className="max-w-[1280px] mx-auto grid grid-cols-12 gap-16">
              
              {/* Contact Details (Left Column) */}
              <div className="col-span-4 space-y-12">
                <div>
                  <h3 className="font-[family-name:var(--font-montserrat)] text-[12px] font-bold text-royal-navy mb-6 tracking-widest border-b border-outline-variant pb-2 inline-block">
                    THE ATELIER
                  </h3>
                  <p className="font-[family-name:var(--font-montserrat)] text-sm text-warm-slate leading-relaxed">
                    128 Splendor Way, Victoria Island<br />
                    Lagos, Nigeria
                  </p>
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-montserrat)] text-[12px] font-bold text-royal-navy mb-6 tracking-widest border-b border-outline-variant pb-2 inline-block">
                    DIRECT LINE
                  </h3>
                  <p className="font-[family-name:var(--font-montserrat)] text-sm text-warm-slate leading-relaxed">
                    +234 800 SPLENDOR<br />
                    +234 901 234 5678
                  </p>
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-montserrat)] text-[12px] font-bold text-royal-navy mb-6 tracking-widest border-b border-outline-variant pb-2 inline-block">
                    CORRESPONDENCE
                  </h3>
                  <p className="font-[family-name:var(--font-montserrat)] text-sm text-warm-slate leading-relaxed">
                    concierge@erniekay.com<br />
                    academy@erniekay.com
                  </p>
                </div>
                {/* Visual badge */}
                <div className="aspect-square bg-royal-navy p-12 flex flex-col justify-end relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
                    <span className="material-symbols-outlined text-[120px] text-majestic-gold">
                      auto_awesome
                    </span>
                  </div>
                  <h4 className="font-[family-name:var(--font-eb-garamond)] text-[28px] font-semibold text-white z-10 relative">
                    Crafting<br />Timeless<br />Elegance
                  </h4>
                </div>
              </div>

              {/* Inquiry Form (Right Column) */}
              <div className="col-span-8 bg-surface p-16 border border-outline-variant shadow-sm">
                <form className="space-y-10" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-2 gap-10">
                    <div className="relative border-b border-champagne-taupe pb-2 focus-within:border-royal-navy transition-colors">
                      <input
                        className="w-full bg-transparent border-none focus:ring-0 p-0 font-[family-name:var(--font-montserrat)] text-on-surface placeholder:text-warm-slate/30 text-sm outline-none"
                        id="name"
                        placeholder="Your Name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                      <label className="absolute -top-5 left-0 font-[family-name:var(--font-montserrat)] text-[10px] text-warm-slate uppercase tracking-widest font-bold">
                        Full Name
                      </label>
                    </div>
                    <div className="relative border-b border-champagne-taupe pb-2 focus-within:border-royal-navy transition-colors">
                      <input
                        className="w-full bg-transparent border-none focus:ring-0 p-0 font-[family-name:var(--font-montserrat)] text-on-surface placeholder:text-warm-slate/30 text-sm outline-none"
                        id="email"
                        placeholder="email@address.com"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                      <label className="absolute -top-5 left-0 font-[family-name:var(--font-montserrat)] text-[10px] text-warm-slate uppercase tracking-widest font-bold">
                        Email Address
                      </label>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-10">
                    <div className="relative border-b border-champagne-taupe pb-2 focus-within:border-royal-navy transition-colors">
                      <input
                        className="w-full bg-transparent border-none focus:ring-0 p-0 font-[family-name:var(--font-montserrat)] text-on-surface placeholder:text-warm-slate/30 text-sm outline-none"
                        id="phone"
                        placeholder="+234 (000) 000-0000"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                      <label className="absolute -top-5 left-0 font-[family-name:var(--font-montserrat)] text-[10px] text-warm-slate uppercase tracking-widest font-bold">
                        Phone Number
                      </label>
                    </div>
                    <div className="relative border-b border-champagne-taupe pb-2 focus-within:border-royal-navy transition-colors">
                      <select
                        className="w-full bg-transparent border-none focus:ring-0 p-0 font-[family-name:var(--font-montserrat)] text-on-surface appearance-none cursor-pointer text-sm outline-none"
                        id="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="" disabled>Select Department</option>
                        <option value="Salon Services">Salon Services</option>
                        <option value="Bridal Artistry">Bridal Artistry</option>
                        <option value="Beauty Academy">Beauty Academy</option>
                      </select>
                      <label className="absolute -top-5 left-0 font-[family-name:var(--font-montserrat)] text-[10px] text-warm-slate uppercase tracking-widest font-bold">
                        Department
                      </label>
                      <span className="material-symbols-outlined absolute right-0 top-0 text-champagne-taupe pointer-events-none">
                        expand_more
                      </span>
                    </div>
                  </div>
                  <div className="relative border-b border-champagne-taupe pb-2 focus-within:border-royal-navy transition-colors">
                    <textarea
                      className="w-full bg-transparent border-none focus:ring-0 p-0 font-[family-name:var(--font-montserrat)] text-on-surface resize-none text-sm outline-none"
                      id="message"
                      placeholder="Your message..."
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                    <label className="absolute -top-5 left-0 font-[family-name:var(--font-montserrat)] text-[10px] text-warm-slate uppercase tracking-widest font-bold">
                      How can we assist you?
                    </label>
                  </div>
                  <div className="pt-6">
                    <button
                      className="w-full md:w-auto bg-majestic-gold text-royal-navy font-[family-name:var(--font-montserrat)] text-[12px] font-bold uppercase tracking-[0.2em] px-12 py-5 hover:bg-royal-navy hover:text-white transition-all duration-500"
                      type="submit"
                    >
                      SUBMIT INQUIRY
                    </button>
                  </div>
                </form>
              </div>

            </div>
          </section>

          {/* Desktop map Section */}
          <section className="w-full h-[500px] relative overflow-hidden">
            <div className="absolute inset-0 bg-royal-navy/40 z-10 pointer-events-none"></div>
            <Image
              alt="Lagos Urban Atelier Map"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIEZ_MAVBVjPEqYeZSkb4WaBdnNA7xz_W-eyi-4XmnhBxtw232lT0v9uo6u5553Df_HmCOCKL3g_Sbehly4OvJXlkik_ESTU9EjHd8NwCJoVsUdpKnOb47QCBjeIcFCtzCAEgd00ezzSb-ex-rfdaolnLaLeZMd1D1eUipY8mwrga41MKVxnWfDldbEVRme5HQPyOWnVLVKh3sVUmXbJozfz-SBQQtDvQ0GwKOoOhckZO3E-KxgDbbFtD06VNqmlet_vc9HQ9ipAU"
              fill
              className="object-cover opacity-60 grayscale contrast-125 brightness-75"
              unoptimized
            />
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <div className="bg-surface/95 backdrop-blur-sm p-8 border border-majestic-gold max-w-xs text-center shadow-lg">
                <h5 className="font-[family-name:var(--font-eb-garamond)] text-[22px] font-semibold text-royal-navy mb-2">
                  Visit Us
                </h5>
                <p className="font-[family-name:var(--font-montserrat)] text-[13px] text-warm-slate leading-relaxed mb-4">
                  Monday — Saturday<br />9:00 AM — 7:00 PM
                </p>
                <a
                  className="font-[family-name:var(--font-montserrat)] text-[10px] text-majestic-gold underline font-bold tracking-widest uppercase hover:text-royal-navy transition-colors"
                  href="#"
                >
                  GET DIRECTIONS
                </a>
              </div>
            </div>
          </section>

          {/* Desktop FAQ accordions */}
          <section className="py-[112px] px-[64px] bg-surface">
            <div className="max-w-[800px] mx-auto">
              <div className="text-center mb-16">
                <span className="font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.3em] uppercase font-bold text-champagne-taupe mb-4 block">
                  RESOURCES
                </span>
                <h2 className="font-[family-name:var(--font-eb-garamond)] text-[36px] md:text-[44px] font-semibold text-royal-navy">
                  Essential Inquiries
                </h2>
              </div>
              <div className="space-y-4">
                {faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="border border-outline-variant bg-white transition-all duration-300"
                  >
                    <button
                      onClick={() => toggleAccordion(idx)}
                      className="w-full flex justify-between items-center p-6 cursor-pointer text-left outline-none"
                    >
                      <span className="font-[family-name:var(--font-montserrat)] text-[14px] font-bold text-royal-navy">
                        {faq.q}
                      </span>
                      <span
                        className={`material-symbols-outlined text-majestic-gold text-2xl transition-transform duration-300 ${
                          activeAccordion === idx ? "rotate-180" : ""
                        }`}
                      >
                        expand_more
                      </span>
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-500 ease-in-out ${
                        activeAccordion === idx ? "max-h-40 border-t border-outline-variant/30 p-6" : "max-h-0"
                      }`}
                    >
                      <p className="font-[family-name:var(--font-montserrat)] text-sm text-warm-slate leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* ── MOBILE Content View (<md) ── */}
        <div className="block md:hidden">
          {/* Mobile Hero Section */}
          <section className="relative bg-surface-bright pt-12 pb-16 px-6">
            <div className="max-w-md mx-auto">
              <span className="font-[family-name:var(--font-montserrat)] text-[10px] text-champagne-taupe block mb-4 uppercase tracking-[0.2em] font-bold">
                CONNECT WITH SPLENDOR
              </span>
              <h2 className="font-[family-name:var(--font-eb-garamond)] text-[32px] font-semibold text-royal-navy mb-6 leading-tight">
                Artistry and Education, <br /><span className="italic font-normal">perfectly distilled.</span>
              </h2>
              <div className="w-full aspect-[4/5] overflow-hidden bg-surface-container relative mb-8">
                <Image
                  className="w-full h-full object-cover grayscale-[20%]"
                  alt="Luxury salon interior featuring clean lines and minimalist layout"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8XxOJzjmhKYI11FoDvow0WZYZ3DXWeX-N4s3WejM8KAFRtnGL1urbJetKJeGOZKkx-yciUDVbTPMF7Gs9HMPrgKVa2tMf-Qji8DsSANqXOuPBR2HdP9jVfuIGN39Cl9coyhmHgYpZCPPaSsX1fGC2zItVkeJRJzvqCZ6kmLa7aI7gUeRzJtfEKcxeNA3eElbNip9ILH0TE0d0JF1lWuTyHPXEjw4SZ37LtBGzla9fDId_W6Fp_dlnciulKXr-q8BdnMX7BxIIULA"
                  fill
                  unoptimized
                />
              </div>
              <p className="font-[family-name:var(--font-montserrat)] text-[14px] leading-[22px] text-warm-slate">
                Whether seeking a bespoke bridal transformation or professional mastery at our academy, your journey toward excellence begins with a single conversation.
              </p>
            </div>
          </section>

          {/* Mobile Atelier Section */}
          <section className="bg-alabaster-white py-16 px-6">
            <div className="max-w-md mx-auto">
              <h3 className="font-[family-name:var(--font-eb-garamond)] text-[22px] font-semibold text-royal-navy border-b border-champagne-taupe/20 pb-4 mb-8">
                The Atelier
              </h3>
              <div className="space-y-10">
                <div className="flex flex-col space-y-2">
                  <span className="font-[family-name:var(--font-montserrat)] text-[11px] font-bold text-champagne-taupe tracking-wider uppercase">
                    DIRECT LINE
                  </span>
                  <a
                    className="font-[family-name:var(--font-montserrat)] text-[18px] font-bold text-royal-navy underline decoration-majestic-gold decoration-2 underline-offset-4"
                    href="tel:+15550109988"
                  >
                    +1 (555) 010-9988
                  </a>
                </div>
                <div className="flex flex-col space-y-2">
                  <span className="font-[family-name:var(--font-montserrat)] text-[11px] font-bold text-champagne-taupe tracking-wider uppercase">
                    CORRESPONDENCE
                  </span>
                  <a
                    className="font-[family-name:var(--font-montserrat)] text-[18px] font-bold text-royal-navy underline decoration-majestic-gold decoration-2 underline-offset-4"
                    href="mailto:atelier@erniekay.com"
                  >
                    atelier@erniekay.com
                  </a>
                </div>
                <div className="flex flex-col space-y-2">
                  <span className="font-[family-name:var(--font-montserrat)] text-[11px] font-bold text-champagne-taupe tracking-wider uppercase">
                    LOCATION
                  </span>
                  <p className="font-[family-name:var(--font-montserrat)] text-[14px] leading-relaxed text-royal-navy">
                    425 Madison Avenue, 12th Floor<br />New York, NY 10017
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Mobile Submit Inquiry form */}
          <section className="bg-surface-bright py-16 px-6">
            <div className="max-w-md mx-auto">
              <h3 className="font-[family-name:var(--font-eb-garamond)] text-[22px] font-semibold text-royal-navy mb-2">
                Submit Inquiry
              </h3>
              <p className="font-[family-name:var(--font-montserrat)] text-sm text-warm-slate mb-10">
                Allow us to curate your experience. Please provide the details below.
              </p>
              <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="relative border-b border-champagne-taupe pb-2 focus-within:border-royal-navy transition-colors">
                  <input
                    className="w-full bg-transparent border-none outline-none py-1 font-[family-name:var(--font-montserrat)] text-[14px] text-on-surface placeholder:text-surface-dim"
                    id="name"
                    placeholder="Your Name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                  <label className="block text-[10px] font-bold tracking-widest text-warm-slate uppercase mt-1">
                    FULL NAME
                  </label>
                </div>
                <div className="relative border-b border-champagne-taupe pb-2 focus-within:border-royal-navy transition-colors">
                  <input
                    className="w-full bg-transparent border-none outline-none py-1 font-[family-name:var(--font-montserrat)] text-[14px] text-on-surface placeholder:text-surface-dim"
                    id="email"
                    placeholder="email@address.com"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                  <label className="block text-[10px] font-bold tracking-widest text-warm-slate uppercase mt-1">
                    EMAIL ADDRESS
                  </label>
                </div>
                <div className="relative border-b border-champagne-taupe pb-2 focus-within:border-royal-navy transition-colors">
                  <input
                    className="w-full bg-transparent border-none outline-none py-1 font-[family-name:var(--font-montserrat)] text-[14px] text-on-surface placeholder:text-surface-dim"
                    id="phone"
                    placeholder="+1 (000) 000-0000"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                  <label className="block text-[10px] font-bold tracking-widest text-warm-slate uppercase mt-1">
                    PHONE
                  </label>
                </div>
                <div className="relative border-b border-champagne-taupe pb-2 focus-within:border-royal-navy transition-colors">
                  <select
                    className="w-full bg-transparent border-none outline-none py-1 font-[family-name:var(--font-montserrat)] text-[14px] text-on-surface appearance-none"
                    id="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="" disabled>Select Department</option>
                    <option value="Bridal Artistry">Bridal Artistry</option>
                    <option value="Academy Admissions">Academy Admissions</option>
                    <option value="Salon Services">Salon Services</option>
                    <option value="General Press">General Press</option>
                  </select>
                  <label className="block text-[10px] font-bold tracking-widest text-warm-slate uppercase mt-1">
                    DEPARTMENT
                  </label>
                </div>
                <div className="relative border-b border-champagne-taupe pb-2 focus-within:border-royal-navy transition-colors">
                  <textarea
                    className="w-full bg-transparent border-none outline-none py-1 font-[family-name:var(--font-montserrat)] text-[14px] text-on-surface resize-none"
                    id="message"
                    placeholder="Your message..."
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                  <label className="block text-[10px] font-bold tracking-widest text-warm-slate uppercase mt-1">
                    HOW CAN WE ASSIST YOU?
                  </label>
                </div>
                <button
                  className="w-full h-14 bg-royal-navy text-majestic-gold border border-majestic-gold font-[family-name:var(--font-montserrat)] text-[12px] font-bold tracking-widest hover:bg-midnight-ink transition-all active:scale-[0.98]"
                  type="submit"
                >
                  ENROLL / INQUIRE NOW
                </button>
              </form>
            </div>
          </section>

          {/* Mobile Map Section */}
          <section className="h-96 w-full relative">
            <div className="absolute inset-0 bg-royal-navy opacity-90 z-10 pointer-events-none"></div>
            <Image
              alt="Midtown Manhattan Atelier Map"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAoaMaHc1I2YmS8Qo5hZsNrB01C9nbM2dfQclvGn2O0xpVZCZLBUB6Zf4DSssq3ubs1TArtW0wlbl1xzFXJl8L1_fa4lDSXmnMWyVLb02kfp6G30cuaoXqV0z2McrqctRdNFa65Jlr-ZUcLmxzzRzHZ0DkRj8-67aYBUW2wIiOPoj5a6QPtpWUPsotalpnqji-6IYC3l6PK5qO3P4oyurLxPN_OvPTlUIQEmMvUCaqfQImrPvCCXpeFUpBnzW1_QLxYy1mLKKrklEk"
              fill
              className="object-cover grayscale contrast-125 brightness-50"
              unoptimized
            />
            <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <span className="material-symbols-outlined text-majestic-gold text-5xl animate-bounce">
                  location_on
                </span>
                <p className="font-[family-name:var(--font-montserrat)] text-[12px] font-bold text-white mt-4 tracking-widest uppercase">
                  VISIT THE ATELIER
                </p>
              </div>
            </div>
          </section>

          {/* Mobile FAQ list */}
          <section className="bg-surface-bright py-16 px-6">
            <div className="max-w-md mx-auto">
              <h3 className="font-[family-name:var(--font-eb-garamond)] text-[22px] font-semibold text-royal-navy mb-8">
                Essential Inquiries
              </h3>
              <div className="space-y-4">
                {faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="border border-champagne-taupe/20 bg-white"
                  >
                    <button
                      onClick={() => toggleAccordion(idx + 10)}
                      className="w-full flex items-center justify-between p-6 cursor-pointer text-left outline-none"
                    >
                      <span className="font-[family-name:var(--font-montserrat)] text-sm font-bold text-royal-navy">
                        {faq.q}
                      </span>
                      <span
                        className={`material-symbols-outlined text-majestic-gold transition-transform duration-300 ${
                          activeAccordion === idx + 10 ? "rotate-180" : ""
                        }`}
                      >
                        expand_more
                      </span>
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-500 ease-in-out ${
                        activeAccordion === idx + 10 ? "max-h-40 p-6 border-t border-champagne-taupe/20" : "max-h-0"
                      }`}
                    >
                      <p className="font-[family-name:var(--font-montserrat)] text-sm text-warm-slate leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Mobile bottom help link spacer */}
          <div className="text-center py-8">
            <a
              className="text-champagne-taupe font-[family-name:var(--font-montserrat)] text-[11px] underline underline-offset-4 decoration-majestic-gold tracking-widest uppercase font-bold"
              href="mailto:atelier@erniekay.com"
            >
              Contact Registrar Office
            </a>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
