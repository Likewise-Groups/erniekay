"use client";

import { useState } from "react";
import Image from "next/image";
import FadeIn from "@/components/FadeIn";

const testimonials = [
  {
    id: "sarah",
    quote:
      "The Bridal Artistry Masterclass was a turning point for my career. The level of precision and the focus on the business side of beauty gave me the confidence to launch my own studio within months of graduating.",
    name: "Sarah Jenkins",
    meta: "Class of 2022 | Owner, Glow Studio",
    imgSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDwBOnjhUF3mODgSjuTaQzYfb4BjzTu4VBF74NInc3nCun2YuPg8APHNUxHGfNjhyrCAu9sHH_6cfppY5PiEEkgrnnO6MxUtDyYj5LgcbhzkcJQ4bHk1BIwPjfMOkF9KXZPa2D9JeYld23xyfufK6srCCld5N2roWpRF8JMGDnKr9mYQRjXQI2aQ1DESZewHo04gEMADMFQgA35w6nPjI1yhVIys2PfTUs9uA6o5pzuzIne_xktEujleSCXlpzD7pID9gePWd5iVwE",
    imgAlt: "Professional headshot of Sarah Jenkins",
  },
  {
    id: "amina",
    quote:
      "Editorial Hair Styling transformed the way I see structure and form. The instructors bring real-world fashion experience into every session. I left with a portfolio that opened doors immediately.",
    name: "Amina O.",
    meta: "Class of 2023 | Lead Stylist, Fashion Week Lagos",
    imgSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDwBOnjhUF3mODgSjuTaQzYfb4BjzTu4VBF74NInc3nCun2YuPg8APHNUxHGfNjhyrCAu9sHH_6cfppY5PiEEkgrnnO6MxUtDyYj5LgcbhzkcJQ4bHk1BIwPjfMOkF9KXZPa2D9JeYld23xyfufK6srCCld5N2roWpRF8JMGDnKr9mYQRjXQI2aQ1DESZewHo04gEMADMFQgA35w6nPjI1yhVIys2PfTUs9uA6o5pzuzIne_xktEujleSCXlpzD7pID9gePWd5iVwE",
    imgAlt: "Professional headshot of Amina O.",
  },
];

export default function AcademyTestimonials() {
  const [current, setCurrent] = useState(0);
  const t = testimonials[current];

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  return (
    <section className="py-[112px] bg-white">
      <div className="max-w-[1280px] mx-auto px-6 md:px-[64px]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* Left — label + nav */}
          <FadeIn className="md:col-span-4">
            <h2 className="font-[family-name:var(--font-eb-garamond)] text-[40px] md:text-[48px] leading-tight tracking-[-0.01em] font-semibold text-royal-navy mb-8">
              Success Stories
            </h2>
            <p className="font-[family-name:var(--font-montserrat)] text-[16px] leading-[26px] text-warm-slate">
              Hear from our graduates who are now defining the beauty landscape across the globe.
            </p>
            <div className="mt-12 flex gap-4">
              <button
                id="testimonial-prev"
                aria-label="Previous testimonial"
                onClick={prev}
                className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center hover:bg-royal-navy hover:text-white hover:border-royal-navy transition-colors"
              >
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <button
                id="testimonial-next"
                aria-label="Next testimonial"
                onClick={next}
                className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center hover:bg-royal-navy hover:text-white hover:border-royal-navy transition-colors"
              >
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </FadeIn>

          {/* Right — quote card */}
          <FadeIn className="md:col-span-8" delay={100}>
            <div className="bg-alabaster-white p-10 md:p-12 relative">
              {/* Decorative quote mark */}
              <span
                className="material-symbols-outlined text-[60px] md:text-[72px] text-majestic-gold/20 absolute top-6 right-8 select-none"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                format_quote
              </span>

              <div className="max-w-xl relative z-10">
                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className="material-symbols-outlined text-majestic-gold text-[18px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                  ))}
                </div>

                <p className="font-[family-name:var(--font-eb-garamond)] text-[22px] md:text-[26px] leading-[34px] font-semibold italic text-royal-navy mb-8">
                  &ldquo;{t.quote}&rdquo;
                </p>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-royal-navy overflow-hidden shrink-0">
                    <Image
                      src={t.imgSrc}
                      alt={t.imgAlt}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </div>
                  <div>
                    <p className="font-[family-name:var(--font-montserrat)] text-[16px] leading-[26px] font-semibold text-royal-navy">
                      {t.name}
                    </p>
                    <p className="font-[family-name:var(--font-montserrat)] text-[10px] leading-[16px] tracking-[0.15em] uppercase font-bold text-warm-slate">
                      {t.meta}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
