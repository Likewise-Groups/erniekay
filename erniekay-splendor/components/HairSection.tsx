"use client";

import Image from "next/image";
import { useState } from "react";
import BookingModal, { ServiceCategory } from "./BookingModal";

/* ─── Types ─────────────────────────────────────────────────── */
interface ServiceCardProps {
  id: string;
  tag: string;
  price: string;
  title: string;
  description: string;
  onBook: () => void;
}

/* ─── Desktop service card ───────────────────────────────────── */
function DesktopServiceCard({ id, tag, price, title, description, onBook }: ServiceCardProps) {
  return (
    <div className="group relative bg-white/70 backdrop-blur-xl border border-white/60 rounded-[32px] p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-15px_rgba(212,175,55,0.2)] hover:border-majestic-gold/40 hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col h-full cursor-pointer" onClick={onBook}>
      <div className="absolute top-0 right-0 w-48 h-48 bg-majestic-gold/10 rounded-full blur-[40px] -mr-20 -mt-20 transition-all duration-700 group-hover:scale-150 opacity-0 group-hover:opacity-100" />
      
      <div className="relative z-10 flex justify-between items-start mb-6">
        <span className="font-[family-name:var(--font-montserrat)] text-[10px] leading-[16px] tracking-[0.2em] font-bold uppercase text-royal-navy bg-majestic-gold/10 px-4 py-1.5 rounded-full border border-majestic-gold/20">
          {tag}
        </span>
        <span className="font-[family-name:var(--font-montserrat)] text-[14px] font-bold text-royal-navy bg-white px-4 py-1.5 rounded-full border border-outline-variant/30 shadow-sm flex items-center gap-1 transition-colors duration-300 group-hover:bg-majestic-gold/10 group-hover:border-majestic-gold/30">
          {price.replace('GH', ' GH₵')}
        </span>
      </div>
      <h3 className="relative z-10 font-[family-name:var(--font-eb-garamond)] text-[32px] leading-[40px] tracking-[-0.01em] font-semibold text-royal-navy mb-4 group-hover:text-majestic-gold transition-colors duration-300">
        {title}
      </h3>
      <p className="relative z-10 font-[family-name:var(--font-montserrat)] text-[15px] leading-[26px] text-on-surface-variant mb-8 flex-grow">
        {description}
      </p>
      <div className="relative z-10 flex items-center justify-between border-t border-outline-variant/20 pt-6 mt-auto">
        <span className="font-[family-name:var(--font-montserrat)] text-[12px] tracking-[0.15em] uppercase font-bold text-majestic-gold group-hover:text-royal-navy transition-colors">
          Explore Service
        </span>
        <div className="w-10 h-10 rounded-full bg-alabaster-white border border-outline-variant/30 flex items-center justify-center group-hover:bg-majestic-gold group-hover:border-majestic-gold transition-all duration-300">
          <span className="text-royal-navy text-lg group-hover:-rotate-45 transition-transform duration-300">→</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Mobile simple card ─────────────────────────────────────── */
function MobileServiceCard({ id, tag, title, price, description, onBook }: ServiceCardProps) {
  return (
    <div className="group relative bg-white/80 backdrop-blur-md border border-white/60 rounded-3xl p-6 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-xl transition-all duration-300 overflow-hidden" onClick={onBook}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-majestic-gold/10 rounded-full blur-2xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10 flex flex-col mb-4">
        <div className="flex justify-between items-center mb-3">
          <span className="font-[family-name:var(--font-montserrat)] text-[9px] tracking-[0.2em] font-bold uppercase text-royal-navy bg-majestic-gold/10 px-3 py-1 rounded-full">
            {tag}
          </span>
          <span className="font-[family-name:var(--font-montserrat)] text-[12px] font-bold text-royal-navy bg-white px-3 py-1 rounded-full border border-outline-variant/30 shadow-sm">
            {price.replace('GH', ' GH₵')}
          </span>
        </div>
        <h4 className="font-[family-name:var(--font-eb-garamond)] text-[26px] leading-[32px] tracking-[-0.005em] font-semibold text-royal-navy leading-tight">
          {title}
        </h4>
      </div>
      <p className="relative z-10 font-[family-name:var(--font-montserrat)] text-[14px] leading-[22px] text-on-surface-variant mb-6">
        {description}
      </p>
      <div className="relative z-10 flex items-center justify-between border-t border-outline-variant/20 pt-4 mt-auto">
        <span className="font-[family-name:var(--font-montserrat)] text-[11px] tracking-[0.15em] uppercase font-bold text-majestic-gold">
          Book Now
        </span>
        <span className="text-royal-navy">→</span>
      </div>
    </div>
  );
}

/* ─── Data ───────────────────────────────────────────────────── */
const hairServices = [
  {
    id: "hair-services",
    tag: "Essentials",
    price: "From 100GH",
    title: "Hair Services",
    description:
      "A comprehensive overview of our essential hair care rituals including shampooing, relaxing, cutting, and styling.",
    subServices: [
      { name: "Shampooing", price: 120 },
      { name: "Relaxing", price: 200 },
      { name: "Perm Cut Only", price: 100 },
      { name: "Normal Pony", price: 150 },
    ],
  },
  {
    id: "sew-in",
    tag: "Extensions",
    price: "From 180GH",
    title: "Sew-In",
    description:
      "Explore our premium sew-in extension services tailored for a flawless and natural finish.",
    subServices: [
      { name: "Traditional Sew-In", price: 250 },
      { name: "Closure Sew-In", price: 250 },
      { name: "Frontal Sew-In", price: 300 },
      { name: "Half-Up Half-Down", price: 180 },
    ],
  },
  {
    id: "installation",
    tag: "Finishing",
    price: "From 50GH",
    title: "Installation",
    description:
      "Professional installation services to perfectly secure and blend your closures and frontals.",
    subServices: [
      { name: "Closure Installation", price: 50 },
      { name: "Frontal Installation", price: 100 },
      { name: "180 Frontal Pony", price: 200 },
      { name: "360 Frontal Pony", price: 350 },
    ],
  },
  {
    id: "styling",
    tag: "Artistry",
    price: "From 40GH",
    title: "Styling",
    description:
      "Elevate your look with expert straightening, curling, and customized styling for any occasion.",
    subServices: [
      { name: "Straightening", price: "40-100" },
      { name: "Curling", price: "50-150" },
      { name: "Pixie Curls", price: 100 },
      { name: "Bridal Inspo", price: "200-500" },
    ],
  },
  {
    id: "revamp-colouring",
    tag: "Transformation",
    price: "From 60GH",
    title: "Revamp / Colouring",
    description:
      "Transform your hair with our signature coloring techniques and comprehensive revamping treatments.",
    subServices: [
      { name: "Revamp Only", price: "60-200" },
      { name: "Colouring", price: "250-600" },
      { name: "Natural Hair", price: "100-400" },
    ],
  },
];

const customWiggingCategory: ServiceCategory = {
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
};

/* ─── Component ──────────────────────────────────────────────── */
export default function HairSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);

  const openModal = (category: ServiceCategory) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  return (
    <section id="hair" className="bg-gradient-to-br from-[#f8f6f0] to-[#f4eee6] py-[80px] md:py-[140px] relative overflow-hidden">
      {/* Decorative blurred spheres */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-majestic-gold/5 rounded-full blur-[100px] -translate-x-1/4 -translate-y-1/4 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-white/40 rounded-full blur-[120px] translate-x-1/4 translate-y-1/4 pointer-events-none" />

      {/* ══════════════════════════════════════════════════════════
          MOBILE LAYOUT
      ══════════════════════════════════════════════════════════ */}
      <div className="md:hidden relative z-10 px-6">
        {/* Section Header */}
        <div className="mb-12">
          <span className="font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.2em] uppercase font-bold text-majestic-gold mb-4 block text-center">
            Crown &amp; Glory
          </span>
          <h2 className="font-[family-name:var(--font-eb-garamond)] text-[48px] leading-[52px] tracking-[-0.01em] font-semibold text-royal-navy mb-4 text-center">
            Hair Artistry
          </h2>
          <p className="font-[family-name:var(--font-montserrat)] text-[15px] leading-[26px] text-on-surface-variant text-center px-4">
            Precision cutting and editorial color techniques tailored to your lifestyle.
          </p>
        </div>

        {/* Featured Service Card */}
        <div className="mb-10">
          <div className="bg-white/90 backdrop-blur-md border border-white overflow-hidden rounded-[32px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] relative group">
            <div className="relative aspect-[4/5] w-full overflow-hidden p-2 pb-0">
              <div className="w-full h-full rounded-[24px] overflow-hidden relative">
                <video
                  src="/hair.MOV"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-midnight-ink/90 via-midnight-ink/20 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <span className="bg-white text-royal-navy text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-[0.15em] inline-block mb-3 shadow-md">
                    Editor&apos;s Choice
                  </span>
                  <h2 className="text-white font-[family-name:var(--font-eb-garamond)] text-[36px] leading-[40px] font-semibold">
                    Custom Wigging
                  </h2>
                </div>
              </div>
            </div>
            <div className="p-8 relative z-10">
              <p className="font-[family-name:var(--font-montserrat)] text-[14px] leading-[24px] text-on-surface-variant mb-6">
                Experience luxury with our bespoke wig making services, perfectly tailored to your unique style.
              </p>
              <button
                onClick={() => openModal(customWiggingCategory)}
                className="w-full bg-royal-navy rounded-xl text-white font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold py-4 hover:bg-majestic-gold hover:text-royal-navy transition-colors shadow-lg"
              >
                Explore &amp; Book
              </button>
            </div>
          </div>
        </div>

        {/* Essential Rituals Grid */}
        <div className="relative">
          <h3 className="font-[family-name:var(--font-eb-garamond)] text-[32px] font-semibold text-royal-navy mb-6 text-center">
            Service Menu
          </h3>
          <div className="grid grid-cols-1 gap-6">
            {hairServices.map((svc) => (
              <MobileServiceCard 
                key={svc.id} 
                {...svc} 
                onBook={() => openModal({ id: svc.id, title: svc.title, subServices: svc.subServices })} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          DESKTOP LAYOUT
      ══════════════════════════════════════════════════════════ */}
      <div className="hidden md:block relative z-10 max-w-[1280px] mx-auto px-[64px]">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px w-12 bg-majestic-gold"></div>
              <span className="font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.2em] uppercase font-bold text-majestic-gold">
                Crown &amp; Glory
              </span>
            </div>
            <h2 className="font-[family-name:var(--font-eb-garamond)] text-[56px] lg:text-[72px] leading-[60px] lg:leading-[76px] tracking-[-0.01em] font-semibold text-royal-navy">
              Hair Artistry
            </h2>
          </div>
          <div className="max-w-md pb-2">
            <p className="font-[family-name:var(--font-montserrat)] text-[16px] leading-[28px] text-on-surface-variant">
              Precision cutting and editorial color techniques perfectly tailored to your lifestyle, face shape, and hair texture.
            </p>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-3 gap-6 lg:gap-8 mb-20">
          {/* First standard card */}
          <DesktopServiceCard 
            {...hairServices[0]} 
            onBook={() => openModal({ id: hairServices[0].id, title: hairServices[0].title, subServices: hairServices[0].subServices })} 
          />

          {/* Featured Video Card - Spans 2 Rows */}
          <div className="row-span-2 col-span-1 group relative overflow-hidden bg-midnight-ink text-white rounded-[40px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.4)] hover:shadow-[0_30px_60px_-15px_rgba(212,175,55,0.3)] transition-all duration-500 flex flex-col p-2">
            <div className="absolute inset-0 opacity-40 group-hover:scale-105 transition-transform duration-1000">
              <video
                src="/hair.MOV"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-midnight-ink via-midnight-ink/40 to-transparent" />
            
            <div className="relative z-10 border border-white/20 rounded-[32px] h-full flex flex-col justify-between p-8">
              <div>
                <span className="inline-block px-4 py-1.5 bg-white text-royal-navy rounded-full font-[family-name:var(--font-montserrat)] text-[10px] uppercase font-bold tracking-widest mb-6 shadow-lg">
                  Editor&apos;s Choice
                </span>
                <h3 className="font-[family-name:var(--font-eb-garamond)] text-[48px] leading-[52px] font-semibold mb-4 text-white group-hover:text-majestic-gold transition-colors duration-300">
                  Custom<br/>Wigging
                </h3>
                <p className="font-[family-name:var(--font-montserrat)] text-[16px] leading-[26px] text-white/80 mb-6">
                  Experience luxury with our bespoke wig making services, perfectly tailored to your unique style and fit.
                </p>
              </div>
              <div className="flex flex-col gap-6 mt-12">
                <div>
                  <span className="block text-majestic-gold/80 font-[family-name:var(--font-montserrat)] text-xs uppercase tracking-widest font-bold mb-2">
                    Investment
                  </span>
                  <span className="inline-block bg-white/10 backdrop-blur-md px-5 py-2 rounded-full border border-white/20 text-white font-[family-name:var(--font-montserrat)] text-[16px] font-semibold">
                    From 200 GH₵
                  </span>
                </div>
                <button
                  onClick={() => openModal(customWiggingCategory)}
                  className="w-full py-4 rounded-xl bg-majestic-gold text-royal-navy font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold hover:bg-white transition-all shadow-[0_10px_20px_rgba(212,175,55,0.2)] hover:shadow-[0_15px_30px_rgba(212,175,55,0.4)] hover:-translate-y-1"
                >
                  Configure &amp; Book
                </button>
              </div>
            </div>
          </div>

          {/* Remaining standard cards */}
          {hairServices.slice(1, 3).map((s) => (
            <DesktopServiceCard 
              key={s.id} 
              {...s} 
              onBook={() => openModal({ id: s.id, title: s.title, subServices: s.subServices })} 
            />
          ))}
          {hairServices.slice(3).map((s) => (
            <DesktopServiceCard 
              key={s.id} 
              {...s} 
              onBook={() => openModal({ id: s.id, title: s.title, subServices: s.subServices })} 
            />
          ))}
        </div>
      </div>

      <BookingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        category={selectedCategory} 
      />
    </section>
  );
}
