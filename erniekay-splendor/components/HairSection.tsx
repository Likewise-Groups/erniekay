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
    <div className="group relative bg-white border border-outline-variant/50 rounded-2xl p-8 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] hover:border-majestic-gold/50 hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col h-full">
      {/* Subtle background glow on hover */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-majestic-gold/10 rounded-full blur-3xl -mr-20 -mt-20 transition-all duration-700 group-hover:scale-150 opacity-0 group-hover:opacity-100" />
      
      <div className="relative z-10 flex justify-between items-start mb-6">
        <span className="font-[family-name:var(--font-montserrat)] text-[10px] leading-[16px] tracking-[0.15em] font-bold uppercase text-champagne-taupe bg-surface px-3 py-1 rounded-full border border-outline-variant/30 shadow-sm">
          {tag}
        </span>
        <span className="font-[family-name:var(--font-montserrat)] text-[14px] font-semibold text-royal-navy bg-alabaster-white px-4 py-1.5 rounded-full border border-outline-variant/50 shadow-sm flex items-center gap-1 transition-colors duration-300 group-hover:bg-majestic-gold/10 group-hover:border-majestic-gold/30">
          {price.replace('GH', ' GH₵')}
        </span>
      </div>
      <h3 className="relative z-10 font-[family-name:var(--font-eb-garamond)] text-[32px] leading-[40px] tracking-[-0.01em] font-semibold text-royal-navy mb-4 group-hover:text-majestic-gold transition-colors duration-300">
        {title}
      </h3>
      <p className="relative z-10 font-[family-name:var(--font-montserrat)] text-[15px] leading-[26px] text-on-surface-variant mb-8 flex-grow">
        {description}
      </p>
      <button
        id={id}
        onClick={onBook}
        className="relative z-10 w-full py-4 rounded-xl border border-royal-navy text-royal-navy font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold hover:bg-royal-navy hover:text-white transition-all duration-300 shadow-[0_4px_14px_0_rgba(0,0,0,0.05)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)]"
      >
        Book Appointment
      </button>
    </div>
  );
}

/* ─── Mobile simple card ─────────────────────────────────────── */
function MobileServiceCard({
  id,
  title,
  price,
  description,
  onBook,
}: {
  id: string;
  title: string;
  price: string;
  description: string;
  onBook: () => void;
}) {
  return (
    <div className="group relative bg-white border border-outline-variant/50 rounded-2xl p-6 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] hover:border-majestic-gold/50 transition-all duration-300 overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-majestic-gold/10 rounded-full blur-2xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10 flex justify-between items-start mb-4 gap-4">
        <h4 className="font-[family-name:var(--font-eb-garamond)] text-[26px] leading-[32px] tracking-[-0.005em] font-semibold text-royal-navy leading-tight">
          {title}
        </h4>
        <span className="font-[family-name:var(--font-montserrat)] text-[12px] font-semibold text-royal-navy bg-alabaster-white px-3 py-1 rounded-full border border-outline-variant/50 whitespace-nowrap shadow-sm">
          {price.replace('GH', ' GH₵')}
        </span>
      </div>
      <p className="relative z-10 font-[family-name:var(--font-montserrat)] text-[14px] leading-[22px] text-on-surface-variant mb-6">
        {description}
      </p>
      <button
        id={`mobile-${id}`}
        onClick={onBook}
        className="relative z-10 w-full border border-royal-navy rounded-xl text-royal-navy font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold py-3.5 hover:bg-royal-navy hover:text-white transition-all duration-300 shadow-sm"
      >
        Book Appointment
      </button>
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
    <section id="hair" className="bg-background">
      {/* ══════════════════════════════════════════════════════════
          MOBILE LAYOUT
      ══════════════════════════════════════════════════════════ */}
      <div className="md:hidden">
        {/* Featured Service Card */}
        <div className="p-6 bg-alabaster-white/50 rounded-3xl mt-4 border border-outline-variant/30">
          <div className="bg-white border border-outline-variant/50 overflow-hidden rounded-2xl shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] relative group">
            {/* Portrait video */}
            <div className="relative aspect-[4/5] w-full overflow-hidden">
              <video
                src="/hair.MOV"
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700"
              />
              {/* Gradient overlay */}
              <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <span className="bg-majestic-gold text-royal-navy text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter inline-block mb-3">
                  Editor&apos;s Choice
                </span>
                <h2 className="text-white font-[family-name:var(--font-eb-garamond)] text-[32px] leading-[36px] font-semibold">
                  Custom Wigging
                </h2>
              </div>
            </div>
            {/* Card body */}
            <div className="p-6 relative z-10">
              <p className="font-[family-name:var(--font-montserrat)] text-[14px] leading-[22px] text-on-surface-variant mb-6">
                Experience luxury with our bespoke wig making services, perfectly tailored to your unique style and fit.
              </p>
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-[family-name:var(--font-montserrat)] text-[10px] leading-[16px] tracking-[0.15em] uppercase font-bold text-champagne-taupe block mb-1">
                    Investment
                  </span>
                  <span className="font-[family-name:var(--font-montserrat)] text-[14px] font-semibold text-royal-navy bg-surface px-3 py-1 rounded-full border border-outline-variant/50 shadow-sm">
                    From 200 GH₵
                  </span>
                </div>
                <button
                  id="mobile-couture-balayage"
                  onClick={() => openModal(customWiggingCategory)}
                  className="bg-royal-navy rounded-xl text-majestic-gold font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold px-5 py-3 border border-majestic-gold shadow-md"
                >
                  Book
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Essential Rituals Grid */}
        <div className="px-6 pb-[64px]">
          <div className="mb-10 mt-10 relative">
            {/* Editorial underline decoration */}
            <h3 className="font-[family-name:var(--font-eb-garamond)] text-[28px] leading-[36px] font-semibold text-royal-navy mb-2 pb-3 relative after:absolute after:bottom-0 after:left-0 after:w-10 after:h-px after:bg-majestic-gold">
              Essential Rituals
            </h3>
            <p className="font-[family-name:var(--font-montserrat)] text-[14px] leading-[22px] text-on-surface-variant mt-6">
              Elevated basics for the modern professional.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {hairServices.slice(0, 3).map((svc) => (
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
      <div className="hidden md:block py-[112px] max-w-[1280px] mx-auto px-[64px]">
        {/* Section Header */}
        <div className="grid grid-cols-12 gap-6 items-end mb-16">
          <div className="col-span-5">
            <h2 className="font-[family-name:var(--font-eb-garamond)] text-[48px] leading-[56px] tracking-[-0.01em] font-semibold text-royal-navy mb-4">
              Hair Artistry
            </h2>
            <p className="font-[family-name:var(--font-montserrat)] text-[16px] leading-[26px] text-on-surface-variant">
              Precision cutting and editorial color techniques tailored to your lifestyle and hair
              texture.
            </p>
          </div>
          <div className="col-span-7 h-px bg-outline-variant mb-4" />
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-3 gap-8 mb-20">
          {/* First standard card */}
          <DesktopServiceCard 
            {...hairServices[0]} 
            onBook={() => openModal({ id: hairServices[0].id, title: hairServices[0].title, subServices: hairServices[0].subServices })} 
          />

          <div className="row-span-2 group relative overflow-hidden bg-midnight-ink text-white p-8 border border-majestic-gold/40 rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.4)] hover:shadow-[0_30px_60px_-15px_rgba(212,175,55,0.2)] hover:-translate-y-2 transition-all duration-500 flex flex-col">
            <div className="absolute inset-0 opacity-30 group-hover:scale-110 transition-transform duration-1000">
              <video
                src="/hair.MOV"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
            {/* Dark gradient for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-midnight-ink via-midnight-ink/50 to-transparent" />
            
            <div className="relative z-10 h-full flex flex-col justify-between min-h-[420px]">
              <div>
                <span className="inline-block px-4 py-1.5 bg-majestic-gold text-royal-navy rounded-full font-[family-name:var(--font-montserrat)] text-[10px] uppercase font-bold tracking-widest mb-6 shadow-lg">
                  Most Requested
                </span>
                <h3 className="font-[family-name:var(--font-eb-garamond)] text-[42px] leading-[48px] font-semibold mb-4 text-white group-hover:text-majestic-gold transition-colors duration-300">
                  Custom Wigging
                </h3>
                <p className="font-[family-name:var(--font-montserrat)] text-[16px] leading-[26px] text-white/80 mb-6">
                  Experience luxury with our bespoke wig making services, perfectly tailored to your unique style and fit.
                </p>
              </div>
              <div className="flex flex-col gap-6">
                <div>
                  <span className="block text-majestic-gold/80 font-[family-name:var(--font-montserrat)] text-xs uppercase tracking-widest font-bold mb-2">
                    Starts At
                  </span>
                  <span className="inline-block bg-white/10 backdrop-blur-md px-5 py-2 rounded-full border border-white/20 text-white font-[family-name:var(--font-montserrat)] text-[16px] font-semibold">
                    From 200 GH₵
                  </span>
                </div>
                <button
                  id="couture-balayage"
                  onClick={() => openModal(customWiggingCategory)}
                  className="w-full py-4 rounded-xl bg-majestic-gold text-royal-navy font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold hover:bg-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                  Select Service
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
