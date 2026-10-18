"use client";

import { useState } from "react";
import BookingModal from "./BookingModal";
// Prices come from the catalogue the server charges against.
import { priceLabel, requireCategory } from "@/lib/serviceCatalog";
import { type MediaOverrides } from "@/lib/mediaSlots";
import SlotMedia from "./SlotMedia";

// `service` set: a card was clicked and the modal leads with that service.
type BookingIntent = { service?: string } | null;

export default function SkinSection({ media }: { media?: MediaOverrides }) {
  const [booking, setBooking] = useState<BookingIntent>(null);

  const categoryData = requireCategory("spa-skin");

  return (
    <section id="skin" className="bg-gradient-to-br from-[#fcfbf9] to-[#f5f0eb] dark:from-surface dark:to-surface-container-low py-[80px] md:py-[140px] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-majestic-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-royal-navy/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

      <div className="max-w-[1280px] mx-auto px-6 md:px-[64px] relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-24">
          <span className="font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.2em] uppercase font-bold text-majestic-gold mb-4 block">
            The Ritual
          </span>
          <h2 className="font-[family-name:var(--font-eb-garamond)] text-[48px] md:text-[64px] leading-[56px] md:leading-[72px] tracking-[-0.01em] font-semibold text-ink mb-6">
            SPA & Rejuvenation
          </h2>
          <p className="font-[family-name:var(--font-montserrat)] text-[16px] leading-[28px] text-on-surface-variant">
            Medical-grade results meeting holistic luxury. Every facial is a custom journey designed to restore balance and unveil your natural luminosity.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Services List */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            {categoryData.subServices.map((svc, idx) => (
              <div
                key={svc.name}
                className="group bg-card/80 backdrop-blur-sm border border-outline-variant/40 rounded-3xl p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-15px_rgba(212,175,55,0.2)] hover:border-majestic-gold/30 hover:-translate-y-2 transition-all duration-500 relative overflow-hidden"
              >
                {/* Number indicator */}
                <span className="absolute -right-4 -top-6 font-[family-name:var(--font-eb-garamond)] text-[120px] font-bold text-black/[0.03] group-hover:text-majestic-gold/10 transition-colors duration-500 pointer-events-none select-none">
                  0{idx + 1}
                </span>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4 relative z-10">
                  <h4 className="font-[family-name:var(--font-eb-garamond)] text-[28px] md:text-[32px] leading-[36px] tracking-[-0.005em] font-semibold text-ink group-hover:text-majestic-gold transition-colors duration-300">
                    {svc.name}
                  </h4>
                  <span className="font-[family-name:var(--font-montserrat)] text-[14px] font-bold text-ink bg-surface-alt px-4 py-2 rounded-full border border-outline-variant/50 shrink-0">
                    {priceLabel(svc)}
                  </span>
                </div>
                <p className="font-[family-name:var(--font-montserrat)] text-[15px] leading-[26px] text-on-surface-variant mb-6 relative z-10 max-w-md">
                  {svc.description}
                </p>
                <button
                  onClick={() => setBooking({ service: svc.name })}
                  className="font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold text-ink border border-ink rounded-xl px-6 py-3 hover:bg-royal-navy hover:text-white transition-all duration-300 relative z-10 inline-flex items-center gap-2 group-hover:border-majestic-gold group-hover:bg-majestic-gold group-hover:text-royal-navy"
                >
                  Book Service <span className="text-lg">→</span>
                </button>
              </div>
            ))}
          </div>

          {/* Right Column: Hero Image Collage */}
          <div className="lg:col-span-5 relative h-full min-h-[500px]">
            {/* Main large image */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-h-[700px] rounded-[40px] overflow-hidden shadow-2xl border-4 border-white z-10">
              <SlotMedia
                media={media}
                slot="salon.skin.hero"
                className="absolute inset-0 h-full w-full object-cover scale-105 hover:scale-100 transition-transform duration-[2s]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-royal-navy/60 via-transparent to-transparent opacity-80" />
            </div>

            {/* Overlay descriptive card */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[85%] bg-card/95 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white z-20 hover:-translate-y-2 transition-transform duration-500">
               <h3 className="font-[family-name:var(--font-eb-garamond)] text-[24px] font-semibold text-ink mb-2">
                 Tailored For You
               </h3>
               <p className="font-[family-name:var(--font-montserrat)] text-[14px] leading-[22px] text-on-surface-variant">
                 Our expert estheticians use premium active ingredients customized to your unique skin profile.
               </p>
            </div>
          </div>
          
        </div>
      </div>

      {booking && (
        <BookingModal
          key={booking.service ?? "all"}
          isOpen
          onClose={() => setBooking(null)}
          category={categoryData}
          initialService={booking.service}
        />
      )}
    </section>
  );
}
