"use client";

import { useState } from "react";

const categories = [
  { id: "hair", label: "Editorial Hair Care" },
  { id: "skin", label: "Bespoke Skin Rituals" },
  { id: "tools", label: "Professional Tools" },
];

export default function ShopCategoryNav() {
  const [active, setActive] = useState("hair");

  return (
    <section className="bg-alabaster-white py-10 md:py-12 border-b border-outline-variant">
      <div className="max-w-[1280px] mx-auto px-6 md:px-[64px] flex flex-wrap justify-center gap-8 md:gap-12">
        {categories.map((cat) => (
          <button
            key={cat.id}
            id={`shop-cat-${cat.id}`}
            onClick={() => setActive(cat.id)}
            className="group flex flex-col items-center gap-2"
          >
            <span
              className={`font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold transition-colors ${
                active === cat.id ? "text-majestic-gold" : "text-royal-navy group-hover:text-majestic-gold"
              }`}
            >
              {cat.label}
            </span>
            {/* Expanding underline */}
            <div
              className={`h-0.5 bg-majestic-gold transition-all duration-300 ${
                active === cat.id ? "w-full" : "w-0 group-hover:w-full"
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
