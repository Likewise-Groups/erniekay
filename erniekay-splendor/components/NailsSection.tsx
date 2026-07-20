"use client";

import Image from "next/image";
import { useState } from "react";
import BookingModal from "./BookingModal";

const nailServices = [
  {
    id: "artisan-manicure",
    title: "Artisan Manicure",
    price: "150",
    description:
      "Includes shaping, cuticle care, luxury exfoliation, and high-shine polish finish.",
  },
  {
    id: "splendor-pedicure",
    title: "The Splendor Pedicure",
    price: "200",
    description:
      "A regenerative treatment with essential oil soak, volcanic stone massage, and paraffin hydration.",
  },
  {
    id: "gel-extensions",
    title: "Gel Extensions (Full Set)",
    price: "250",
    description:
      "Sculpted enhancements tailored to your desired length and shape for ultimate durability and elegance.",
  },
  {
    id: "editorial-nail-art",
    title: "Editorial Nail Art",
    price: "100+",
    description:
      "Bespoke designs, hand-painted details, and premium embellishments for a unique statement.",
  },
];

export default function NailsSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categoryData = {
    id: "nail-care",
    title: "Nail Care & Artistry",
    subServices: nailServices.map(s => ({ name: s.title, price: s.price }))
  };

  return (
    <section id="nails" className="py-[80px] md:py-[140px] bg-gradient-to-b from-[#fffcfb] to-[#fdf8f5] relative overflow-hidden">
      {/* Decorative floating shapes */}
      <div className="absolute top-20 right-10 w-[400px] h-[400px] bg-majestic-gold/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-[500px] h-[500px] bg-royal-navy/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-6 md:px-[64px] relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          
          {/* Left Column: Header & Services */}
          <div className="lg:col-span-6">
            <div className="mb-12 md:mb-16">
              <span className="font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.2em] uppercase font-bold text-majestic-gold mb-4 block">
                Impeccable Finish
              </span>
              <h2 className="font-[family-name:var(--font-eb-garamond)] text-[48px] md:text-[64px] leading-[52px] md:leading-[68px] tracking-[-0.01em] font-semibold text-royal-navy mb-6">
                Nail Care <br className="hidden md:block"/> &amp; Artistry
              </h2>
              <p className="font-[family-name:var(--font-montserrat)] text-[16px] leading-[28px] text-on-surface-variant max-w-lg mb-8">
                Experience our signature nail services designed to provide the ultimate in relaxation and refined beauty. Let our artisans elevate your look.
              </p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-3 px-8 py-4 bg-royal-navy text-white font-[family-name:var(--font-montserrat)] text-[12px] tracking-[0.15em] uppercase font-bold hover:bg-majestic-gold hover:text-royal-navy transition-all duration-300 shadow-[0_10px_20px_rgba(17,24,68,0.15)] hover:shadow-[0_15px_25px_rgba(212,175,55,0.3)] hover:-translate-y-1"
              >
                Book Appointment <span className="text-lg">→</span>
              </button>
            </div>

            <div className="flex flex-col gap-5 relative">
              {/* Connecting line */}
              <div className="absolute left-8 top-8 bottom-8 w-px bg-majestic-gold/20 hidden md:block" />

              {nailServices.map((svc, idx) => (
                <div 
                  key={svc.id} 
                  className="group relative bg-white/70 backdrop-blur-md rounded-2xl p-6 md:pl-20 border border-white shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(212,175,55,0.15)] hover:border-majestic-gold/40 transition-all duration-500 hover:-translate-y-1 cursor-pointer overflow-hidden"
                  onClick={() => setIsModalOpen(true)}
                >
                  <div className="absolute right-0 top-0 w-32 h-32 bg-majestic-gold/5 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Step dot */}
                  <div className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-majestic-gold items-center justify-center group-hover:scale-150 group-hover:bg-majestic-gold transition-all duration-500 shadow-[0_0_10px_rgba(212,175,55,0.5)] z-20">
                    <div className="w-1 h-1 bg-royal-navy rounded-full opacity-0 group-hover:opacity-100 transition-opacity delay-100" />
                  </div>

                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-2 gap-4">
                      <h4 className="font-[family-name:var(--font-eb-garamond)] text-[22px] md:text-[26px] leading-[30px] font-semibold text-royal-navy group-hover:text-majestic-gold transition-colors duration-300">
                        {svc.title}
                      </h4>
                      <span className="font-[family-name:var(--font-montserrat)] text-[14px] font-bold text-royal-navy bg-white px-3 py-1 rounded-full border border-majestic-gold/20 shrink-0">
                        {svc.price} GH₵
                      </span>
                    </div>
                    <p className="font-[family-name:var(--font-montserrat)] text-[14px] leading-[24px] text-on-surface-variant max-w-[90%]">
                      {svc.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Staggered Video Collage */}
          <div className="lg:col-span-6 mt-16 lg:mt-0 relative">
            
            {/* Soft backdrop for videos */}
            <div className="absolute inset-0 bg-majestic-gold/5 rounded-[40px] -rotate-3 scale-105 pointer-events-none hidden md:block" />

            <div className="grid grid-cols-2 gap-4 md:gap-6 relative z-10">
              {/* Left Column of Videos */}
              <div className="flex flex-col gap-4 md:gap-6 pt-12 md:pt-20">
                <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white group">
                  <video src="/nail service.mp4" autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-royal-navy/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white group">
                  <video src="/nail service 2.mp4" autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-royal-navy/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>

              {/* Right Column of Videos */}
              <div className="flex flex-col gap-4 md:gap-6 pb-12 md:pb-20">
                <div className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white group">
                  <video src="/nail service 3.mp4" autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-royal-navy/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white group">
                  <video src="/nail service 5.mp4" autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-royal-navy/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>
            </div>
            
            {/* Floating badge */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl border border-majestic-gold/20 z-20 flex flex-col items-center">
              <span className="font-[family-name:var(--font-eb-garamond)] text-[24px] font-bold text-majestic-gold">100%</span>
              <span className="font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-widest font-bold text-royal-navy text-center">Sanitized<br/>Tools</span>
            </div>

          </div>
          
        </div>
      </div>
      
      <BookingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        category={categoryData} 
      />
    </section>
  );
}
