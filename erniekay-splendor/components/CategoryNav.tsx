"use client";

import { useState } from "react";

const categories = [
  { label: "Hair Artistry", href: "#hair" },
  { label: "Nail Care", href: "#nails" },
  { label: "SPA", href: "#skin" },
  { label: "Professional Makeup", href: "#makeup" },
];

export default function CategoryNav() {
  const [activeLabel, setActiveLabel] = useState(categories[0].label);

  const handleAnchor = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, href: string, label: string) => {
    e.preventDefault();
    setActiveLabel(label);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="bg-white border-b border-outline-variant sticky top-20 z-40">
      <div className="max-w-[1280px] mx-auto flex flex-wrap justify-between items-center gap-6
        px-6 py-4 md:px-[64px] md:py-6
      ">
        {/* Horizontal scrolling category pills */}
        <div className="flex gap-6 md:gap-10 overflow-x-auto no-scrollbar w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat.label}
              onClick={(e) => handleAnchor(e, cat.href, cat.label)}
              className={`font-[family-name:var(--font-montserrat)] text-[12px] md:text-[16px] leading-[16px] md:leading-[26px] tracking-[0.15em] uppercase font-bold whitespace-nowrap transition-colors pb-2 ${activeLabel === cat.label
                ? "text-royal-navy border-b-2 border-majestic-gold"
                : "text-on-surface-variant hover:text-royal-navy"
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Elite badge — desktop only */}
        <div className="hidden lg:flex items-center gap-2 text-royal-navy">
          <span className="material-symbols-outlined">verified</span>
          <span className="font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold">
            Elite Certified Stylists
          </span>
        </div>
      </div>
    </section>
  );
}
