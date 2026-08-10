"use client";

import Image from "next/image";
import { useState } from "react";
import BookingModal from "./BookingModal";
// Prices come from the catalogue the server charges against.
import { subServicesOf } from "@/lib/serviceCatalog";

const makeupServices = [
  { id: "special-occasion", icon: "star", label: "Special Occasion Makeup", price: "150", desc: "Flawless glam tailored for your most important events." },
  { id: "editorial", icon: "camera_enhance", label: "Editorial / Photoshoot", price: "250", desc: "High-fashion techniques that look perfect under any lighting." },
  { id: "consultation", icon: "school", label: "Makeup Consultation & Class", price: "180", desc: "Learn signature techniques and discover products that fit your skin." },
];

const gallery = [
  { src: "/makeup.jpg",  alt: "Soft glam editorial makeup look" },
  { src: "/makeup2.jpg", alt: "Bold occasion makeup with curls" },
  { src: "/makeUP3.jpg", alt: "Smiling client in full glam makeover" },
  { src: "/makeup4.jpg", alt: "Bridal soft glam with sculpted eyes" },
  { src: "/makeup5.jpg", alt: "Traditional bridal makeup and gele" },
];

export default function MakeupSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categoryData = {
    id: "professional-makeup",
    title: "Professional Makeup",
    subServices: subServicesOf("professional-makeup")
  };

  return (
    <section id="makeup" className="bg-midnight-ink py-[80px] md:py-[140px] text-white relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-majestic-gold/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-6 md:px-[64px] relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 md:mb-24">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px w-12 bg-majestic-gold"></div>
              <span className="font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.2em] uppercase font-bold text-majestic-gold">
                Editorial &amp; Glam
              </span>
            </div>
            <h2 className="font-[family-name:var(--font-eb-garamond)] text-[48px] md:text-[72px] leading-[52px] md:leading-[76px] tracking-[-0.01em] font-semibold text-white">
              Professional Makeup
            </h2>
          </div>
          <div className="max-w-md">
            <p className="font-[family-name:var(--font-montserrat)] text-[16px] leading-[28px] text-white/70 mb-8">
              From soft glam to high-fashion editorial, our artists specialize in techniques that enhance your features and radiate confidence.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-majestic-gold text-royal-navy px-8 py-4 font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold hover:bg-white hover:-translate-y-1 transition-all duration-300 shadow-[0_10px_20px_rgba(212,175,55,0.2)]"
            >
              Book An Artist
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* Services List */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {makeupServices.map((svc) => (
              <div 
                key={svc.id}
                className="group relative bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 hover:bg-white/10 hover:border-majestic-gold/40 transition-all duration-500 overflow-hidden cursor-pointer"
                onClick={() => setIsModalOpen(true)}
              >
                <div className="absolute right-0 top-0 w-32 h-32 bg-majestic-gold/10 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-majestic-gold/10 flex items-center justify-center text-majestic-gold group-hover:scale-110 transition-transform duration-300">
                      <span className="material-symbols-outlined">{svc.icon}</span>
                    </div>
                    <h3 className="font-[family-name:var(--font-eb-garamond)] text-[22px] md:text-[26px] font-semibold text-white group-hover:text-majestic-gold transition-colors">
                      {svc.label}
                    </h3>
                  </div>
                </div>
                
                <p className="font-[family-name:var(--font-montserrat)] text-[14px] leading-[24px] text-white/60 mb-6 relative z-10 pl-16">
                  {svc.desc}
                </p>
                
                <div className="flex items-center justify-between pl-16 relative z-10">
                  <span className="font-[family-name:var(--font-montserrat)] text-[16px] font-bold text-white">
                    {svc.price} GH₵
                  </span>
                  <span className="font-[family-name:var(--font-montserrat)] text-[12px] uppercase tracking-widest font-bold text-majestic-gold group-hover:translate-x-2 transition-transform duration-300">
                    Book →
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Videos and Gallery Bento Box */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-4 md:gap-6 h-full">
            {/* Main Video */}
            <div className="col-span-2 relative rounded-3xl overflow-hidden aspect-[16/9] ring-1 ring-white/10 group">
              <video
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]"
                src="/makeupv.mp4"
                autoPlay
                loop
                muted
                playsInline
                poster="/makeup.jpg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-midnight-ink/90 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
                <span className="font-[family-name:var(--font-montserrat)] text-[10px] tracking-[0.2em] uppercase font-bold text-majestic-gold mb-2 block">
                  Signature Look
                </span>
                <h3 className="font-[family-name:var(--font-eb-garamond)] text-[28px] font-semibold text-white">
                  The Erniekay Glow
                </h3>
              </div>
            </div>

            {/* Secondary Video */}
            <div className="col-span-1 relative rounded-3xl overflow-hidden aspect-square ring-1 ring-white/10 group">
              <video
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]"
                src="/makeupv1.mp4"
                autoPlay
                loop
                muted
                playsInline
                poster="/makeup2.jpg"
              />
            </div>

            {/* Image Tile */}
            <div className="col-span-1 relative rounded-3xl overflow-hidden aspect-square ring-1 ring-white/10 group">
              <Image
                src="/makeup5.jpg"
                alt="Traditional bridal makeup"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-[2s]"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
            </div>
          </div>
          
        </div>

        {/* Gallery Strip Bottom */}
        <div className="mt-12 md:mt-20">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-[family-name:var(--font-eb-garamond)] text-[28px] font-semibold text-white">
              Portfolio
            </h3>
            <div className="h-px flex-1 bg-white/10 mx-6"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
            {gallery.slice(0, 4).map((img, idx) => (
              <div
                key={idx}
                className="group relative aspect-[4/5] rounded-2xl overflow-hidden ring-1 ring-white/10"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-midnight-ink/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
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
