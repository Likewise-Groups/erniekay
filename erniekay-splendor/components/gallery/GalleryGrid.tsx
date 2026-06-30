"use client";

import { useRef, useState } from "react";
import Image from "next/image";

type Category = "makeup" | "bridal" | "salon";

interface GalleryItem {
  id: string;
  type: "image" | "video";
  src: string;
  category: Category;
  displayCategory: string;
  title: string;
  alt: string;
  aspectClass: string;
}

const galleryItems: GalleryItem[] = [
  // ── Makeup ──────────────────────────────────────────────
  { id: "mk-v1", type: "video", src: "/makeupv.mp4",  category: "makeup", displayCategory: "Professional Makeup", title: "The Erniekay Glow",  alt: "Makeup artist sculpting a flawless glam look.", aspectClass: "aspect-[3/4]" },
  { id: "mk-v2", type: "video", src: "/makeupv1.mp4", category: "makeup", displayCategory: "Professional Makeup", title: "Soft Glam in Motion", alt: "Curated soft glam makeup reveal.", aspectClass: "aspect-[3/4]" },
  { id: "mk-v3", type: "video", src: "/obremsmakeover_19-Jun-2026.mp4", category: "makeup", displayCategory: "Professional Makeup", title: "Obrems Makeover", alt: "Full bridal makeover transformation.", aspectClass: "aspect-[3/4]" },
  { id: "mk-1", type: "image", src: "/makeup.jpg",   category: "makeup", displayCategory: "Professional Makeup", title: "Editorial Radiance", alt: "Soft glam editorial makeup look.", aspectClass: "aspect-[3/4]" },
  { id: "mk-2", type: "image", src: "/makeup2.jpg",  category: "makeup", displayCategory: "Professional Makeup", title: "Bold & Bronzed", alt: "Bold occasion makeup with curls.", aspectClass: "aspect-square" },
  { id: "mk-3", type: "image", src: "/makeUP3.jpg",  category: "makeup", displayCategory: "Professional Makeup", title: "Full Glam Smile", alt: "Client in full glam makeover.", aspectClass: "aspect-[3/4]" },
  { id: "mk-6", type: "image", src: "/makeup6.jpg",  category: "makeup", displayCategory: "Professional Makeup", title: "Studio Luxe", alt: "Luxury studio makeup portrait.", aspectClass: "aspect-[3/4]" },
  { id: "mk-7", type: "image", src: "/makeup7.jpg",  category: "makeup", displayCategory: "Professional Makeup", title: "Signature Beat", alt: "Signature glam beat.", aspectClass: "aspect-square" },
  { id: "mk-8", type: "image", src: "/makeup8.jpg",  category: "makeup", displayCategory: "Professional Makeup", title: "Camera Ready", alt: "Camera-ready editorial makeup.", aspectClass: "aspect-[3/4]" },
  { id: "mk-9", type: "image", src: "/MAKEUP9.jpg",  category: "makeup", displayCategory: "Professional Makeup", title: "Couture Finish", alt: "Couture finish makeup look.", aspectClass: "aspect-[3/4]" },
  { id: "mk-10", type: "image", src: "/MAKEUP10.jpg", category: "makeup", displayCategory: "Professional Makeup", title: "Flawless Base", alt: "Flawless base and contour.", aspectClass: "aspect-[3/4]" },

  // ── Bridal ──────────────────────────────────────────────
  { id: "br-1", type: "image", src: "/makeup4.jpg", category: "bridal", displayCategory: "Bridal Excellence", title: "Bridal Soft Glam", alt: "Bridal soft glam with sculpted eyes.", aspectClass: "aspect-[3/4]" },
  { id: "br-2", type: "image", src: "/makeup5.jpg", category: "bridal", displayCategory: "Bridal Excellence", title: "Traditional Splendor", alt: "Traditional bridal makeup and gele.", aspectClass: "aspect-[3/4]" },

  // ── Salon (Hair · Nails · Skin) ─────────────────────────
  { id: "sl-hair", type: "video", src: "/hair.MOV", category: "salon", displayCategory: "Salon Artistry", title: "Hair Artistry", alt: "Couture hair styling session.", aspectClass: "aspect-[3/4]" },
  { id: "sl-n1", type: "video", src: "/nail%20service.mp4",   category: "salon", displayCategory: "Nail Couture", title: "Nail Couture",     alt: "Luxury nail service.", aspectClass: "aspect-[3/4]" },
  { id: "sl-n2", type: "video", src: "/nail%20service%202.mp4", category: "salon", displayCategory: "Nail Couture", title: "Gel Perfection", alt: "Gel nail application.", aspectClass: "aspect-[3/4]" },
  { id: "sl-n3", type: "video", src: "/nail%20service%203.mp4", category: "salon", displayCategory: "Nail Couture", title: "Sculpted Tips",  alt: "Sculpted nail tips.", aspectClass: "aspect-[3/4]" },
  { id: "sl-n4", type: "video", src: "/nail%20service%204.mp4", category: "salon", displayCategory: "Nail Couture", title: "Luxe Manicure", alt: "Luxe manicure finish.", aspectClass: "aspect-[3/4]" },
  { id: "sl-n5", type: "video", src: "/nail%20service%205.mp4", category: "salon", displayCategory: "Nail Couture", title: "Polished Finish", alt: "Polished nail finish.", aspectClass: "aspect-[3/4]" },
  { id: "sl-h1", type: "image", src: "/hero-1.jpg", category: "salon", displayCategory: "Salon Artistry", title: "Salon Atelier", alt: "Inside the salon atelier.", aspectClass: "aspect-[4/3]" },
  { id: "sl-h2", type: "image", src: "/hero-2.jpg", category: "salon", displayCategory: "Salon Artistry", title: "Crowning Glory", alt: "Signature hair transformation.", aspectClass: "aspect-[4/3]" },
  { id: "sl-fc", type: "image", src: "/facial.jpg", category: "salon", displayCategory: "Skin Rejuvenation", title: "Skin Rejuvenation", alt: "Medical-grade luxury facial.", aspectClass: "aspect-[4/5]" },
];

const categories = [
  { id: "all", label: "All" },
  { id: "makeup", label: "Professional Makeup" },
  { id: "bridal", label: "Bridal Excellence" },
  { id: "salon", label: "Salon & Nails" },
];

function MediaCard({ item }: { item: GalleryItem }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleEnter = () => {
    if (item.type === "video") {
      videoRef.current?.play().catch(() => {});
    }
  };

  const handleLeave = () => {
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
  };

  return (
    <div
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="group relative mb-6 break-inside-avoid overflow-hidden rounded-xl bg-royal-navy cursor-pointer"
    >
      <div className={`relative w-full overflow-hidden ${item.aspectClass}`}>
        {item.type === "image" ? (
          <Image
            src={item.src}
            alt={item.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <video
            ref={videoRef}
            src={item.src}
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}

        {/* Video badge */}
        {item.type === "video" && (
          <div className="absolute top-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-0">
            <span className="material-symbols-outlined text-[20px] text-white">play_arrow</span>
          </div>
        )}

        <div className="absolute inset-0 z-10 bg-gradient-to-t from-royal-navy/85 via-transparent to-transparent opacity-0 transition-opacity duration-400 group-hover:opacity-100" />
      </div>

      <div className="absolute bottom-0 left-0 z-20 translate-y-4 p-6 opacity-0 transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100">
        <p className="mb-1 font-[family-name:var(--font-montserrat)] text-[12px] font-bold uppercase leading-[16px] tracking-[0.15em] text-majestic-gold">
          {item.displayCategory}
        </p>
        <h3 className="font-[family-name:var(--font-eb-garamond)] text-[26px] font-semibold leading-[32px] text-on-primary">
          {item.title}
        </h3>
      </div>
    </div>
  );
}

export default function GalleryGrid() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredItems = galleryItems.filter(
    (item) => activeTab === "all" || item.category === activeTab
  );

  return (
    <>
      {/* Category Filter Bar */}
      <section className="bg-surface-bright py-8 border-b border-outline-variant sticky top-20 z-40">
        <div className="max-w-[1280px] mx-auto px-6 md:px-[64px] flex flex-wrap justify-center gap-8 md:gap-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold transition-all duration-300 pb-1 ${
                activeTab === cat.id
                  ? "text-primary border-b-2 border-majestic-gold"
                  : "text-on-surface-variant hover:text-majestic-gold"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Masonry Grid */}
      <main className="max-w-[1280px] mx-auto px-6 md:px-[64px] py-[72px] md:py-[112px]">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
          {filteredItems.map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      </main>
    </>
  );
}
