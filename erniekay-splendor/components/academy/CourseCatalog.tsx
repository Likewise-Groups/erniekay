import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import SlotMedia from "@/components/SlotMedia";
import type { MediaOverrides } from "@/lib/mediaSlots";

/**
 * The card pictures are editable slots. Each wrapper gained `relative` because
 * SlotMedia lays its media out with `fill` — that is what lets a slot hold
 * either a still or a video without every call site branching on which.
 */
export default function CourseCatalog({ media }: { media?: MediaOverrides }) {
  return (
    <section className="py-[112px] bg-surface-alt">
      <div className="max-w-[1280px] mx-auto px-6 md:px-[64px]">
        {/* Section header */}
        <FadeIn>
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <h2 className="font-[family-name:var(--font-eb-garamond)] text-[40px] md:text-[48px] leading-[48px] md:leading-[56px] tracking-[-0.01em] font-semibold text-ink gold-hairline">
                The Curriculum
              </h2>
              <p className="mt-10 font-[family-name:var(--font-montserrat)] text-[16px] leading-[26px] text-warm-slate">
                Choose from our selection of highly specialized masterclasses designed for both
                aspiring and established professionals.
              </p>
            </div>
            <Link
              href="#"
              className="font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold text-ink border-b border-ink pb-1 hover:text-majestic-gold hover:border-majestic-gold transition-all shrink-0"
            >
              View All Modules
            </Link>
          </div>
        </FadeIn>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* Card 1 — wide (8 cols), horizontal */}
          <FadeIn className="md:col-span-8" delay={0}>
            <div className="group cursor-pointer overflow-hidden bg-card border border-outline-variant h-full">
              <div className="flex flex-col md:flex-row h-full">
                <div className="relative md:w-1/2 h-60 md:h-auto overflow-hidden flex-shrink-0">
                  <SlotMedia
                    media={media}
                    slot="academy.course.bridal"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="font-[family-name:var(--font-montserrat)] text-[10px] leading-[16px] tracking-[0.15em] uppercase font-bold bg-royal-navy text-white px-2 py-1">
                        Certified Level III
                      </span>
                      <span className="font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold text-warm-slate">
                        12 Weeks
                      </span>
                    </div>
                    <h3 className="font-[family-name:var(--font-eb-garamond)] text-[28px] leading-[36px] tracking-[-0.005em] font-semibold text-ink mb-4">
                      Masterclass in Bridal Artistry
                    </h3>
                    <p className="font-[family-name:var(--font-montserrat)] text-[16px] leading-[26px] text-warm-slate mb-8">
                      Comprehensive training on cultural bridal looks, long-wear techniques, and
                      business management for bridal artists.
                    </p>
                  </div>
                  <button
                    id="apply-bridal-masterclass"
                    className="w-full bg-royal-navy text-white py-4 font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold hover:bg-majestic-gold hover:text-royal-navy transition-colors"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Card 2 — narrow (4 cols), vertical */}
          <FadeIn className="md:col-span-4" delay={80}>
            <div className="group cursor-pointer bg-card border border-outline-variant flex flex-col h-full">
              <div className="relative h-64 overflow-hidden flex-shrink-0">
                <SlotMedia
                  media={media}
                  slot="academy.course.hair"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-8 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-[family-name:var(--font-montserrat)] text-[10px] leading-[16px] tracking-[0.15em] uppercase font-bold bg-royal-navy text-white px-2 py-1">
                      Certified
                    </span>
                    <span className="font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold text-warm-slate">
                      6 Weeks
                    </span>
                  </div>
                  <h3 className="font-[family-name:var(--font-eb-garamond)] text-[28px] leading-[36px] tracking-[-0.005em] font-semibold text-ink mb-4">
                    Editorial Hair Styling
                  </h3>
                  <p className="font-[family-name:var(--font-montserrat)] text-[16px] leading-[26px] text-warm-slate mb-6">
                    Master the architecture of hair for runway and high-fashion editorial shoots.
                  </p>
                </div>
                <button
                  id="apply-editorial-hair"
                  className="w-full border border-ink text-ink py-3 font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold hover:bg-royal-navy hover:text-white transition-colors"
                >
                  Apply Now
                </button>
              </div>
            </div>
          </FadeIn>

          {/* Card 3 — narrow (4 cols), vertical */}
          <FadeIn className="md:col-span-4" delay={0}>
            <div className="group cursor-pointer bg-card border border-outline-variant flex flex-col h-full">
              <div className="relative h-64 overflow-hidden flex-shrink-0">
                <SlotMedia
                  media={media}
                  slot="academy.course.skin"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-8 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-[family-name:var(--font-montserrat)] text-[10px] leading-[16px] tracking-[0.15em] uppercase font-bold bg-royal-navy text-white px-2 py-1">
                      Advanced
                    </span>
                    <span className="font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold text-warm-slate">
                      8 Weeks
                    </span>
                  </div>
                  <h3 className="font-[family-name:var(--font-eb-garamond)] text-[28px] leading-[36px] tracking-[-0.005em] font-semibold text-ink mb-4">
                    Advanced Skin Therapy
                  </h3>
                  <p className="font-[family-name:var(--font-montserrat)] text-[16px] leading-[26px] text-warm-slate mb-6">
                    Deep dive into dermatology, chemical peels, and advanced facial rejuvenation
                    techniques.
                  </p>
                </div>
                <button
                  id="apply-skin-therapy"
                  className="w-full border border-ink text-ink py-3 font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold hover:bg-royal-navy hover:text-white transition-colors"
                >
                  Apply Now
                </button>
              </div>
            </div>
          </FadeIn>

          {/* Card 4 — wide (8 cols), horizontal, dark */}
          <FadeIn className="md:col-span-8" delay={80}>
            <div className="group cursor-pointer overflow-hidden bg-royal-navy text-white h-full">
              <div className="flex flex-col md:flex-row h-full">
                <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-between order-2 md:order-1">
                  <div>
                    <span className="font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold text-majestic-gold block mb-4">
                      New for 2024
                    </span>
                    <h3 className="font-[family-name:var(--font-eb-garamond)] text-[28px] leading-[36px] tracking-[-0.005em] font-semibold mb-4">
                      The Business of Beauty
                    </h3>
                    <p className="font-[family-name:var(--font-montserrat)] text-[16px] leading-[26px] text-white/80 mb-8">
                      Learn the essentials of branding, social media marketing, and studio
                      management specifically for independent beauty entrepreneurs.
                    </p>
                  </div>
                  <button
                    id="apply-business-beauty"
                    className="w-full bg-majestic-gold text-royal-navy py-4 font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold hover:bg-card transition-colors"
                  >
                    Request Prospectus
                  </button>
                </div>
                <div className="relative md:w-1/2 h-64 md:h-auto overflow-hidden order-1 md:order-2 flex-shrink-0">
                  <SlotMedia
                    media={media}
                    slot="academy.course.bespoke"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
