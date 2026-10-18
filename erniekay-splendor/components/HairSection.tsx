"use client";

import { useState } from "react";
import BookingModal, { ServiceCategory } from "./BookingModal";
// Sub-service names and prices come from the catalogue, which is what the
// server charges. Keeping a second copy here would let the page quote a price
// the payment endpoint refuses.
import { requireCategory, type SubService } from "@/lib/serviceCatalog";
import { type MediaOverrides } from "@/lib/mediaSlots";
import SlotMedia from "./SlotMedia";

/* ─── Data ───────────────────────────────────────────────────── */
const hairServices = [
  {
    id: "hair-services",
    tag: "Essentials",
    from: 50,
    title: "Hair Services",
    description: "Shampooing, relaxing, cutting and styling: the essential rituals, done properly.",
  },
  {
    id: "sew-in",
    tag: "Extensions",
    from: 300,
    title: "Sew-In",
    description: "Premium sew-in extensions tailored for a flawless, natural finish.",
  },
  {
    id: "installation",
    tag: "Finishing",
    from: 150,
    title: "Installation",
    description: "Closures and frontals secured and blended so they read as your own hairline.",
  },
  {
    id: "styling",
    tag: "Artistry",
    from: 70,
    title: "Styling",
    description: "Straightening, curling and bespoke styling, priced by hair length.",
  },
  {
    id: "revamp-colouring",
    tag: "Transformation",
    from: 150,
    title: "Revamp / Colouring",
    description: "Signature colour work, from highlights to full transformations, and complete revamps.",
  },
];

const customWiggingCategory: ServiceCategory = requireCategory("custom-wigging");

const formatFrom = (amount: number) => `From GH₵${amount.toLocaleString("en-GH")}`;

/** The treatments a category covers, for the row's preview line: group headings first, else names. */
const treatmentsOf = (subServices: SubService[]): string[] => {
  const names = subServices.map((sub) => sub.group ?? sub.name.replace(/\s*\(.*\)$/, ""));
  return [...new Set(names)];
};

/* ─── Service card ───────────────────────────────────────────── */
function ServiceCard({
  index,
  service,
  onBook,
}: {
  index: number;
  service: (typeof hairServices)[number];
  onBook: () => void;
}) {
  const allTreatments = treatmentsOf(requireCategory(service.id).subServices);
  const treatments = allTreatments.length > 4 ? allTreatments.slice(0, 3) : allTreatments;
  const moreCount = allTreatments.length - treatments.length;

  return (
    <li>
      <button
        type="button"
        onClick={onBook}
        className="group flex h-full w-full flex-col rounded-[28px] border border-ink/10 bg-card/70 p-7 text-left shadow-[0_10px_30px_-18px_rgba(17,24,68,0.25)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-majestic-gold/60 hover:shadow-[0_20px_40px_-18px_rgba(212,175,55,0.35)]"
      >
        <span className="flex items-center justify-between">
          <span className="font-[family-name:var(--font-montserrat)] text-[10px] font-bold uppercase tracking-[0.2em] text-champagne-taupe">
            {service.tag}
          </span>
          <span className="font-[family-name:var(--font-montserrat)] text-[12px] font-bold tracking-[0.2em] text-ink/30">
            {String(index + 1).padStart(2, "0")}
          </span>
        </span>

        <span className="mt-4 block font-[family-name:var(--font-eb-garamond)] text-[30px] font-semibold leading-[36px] text-ink">
          {service.title}
        </span>
        <span className="mt-2 block font-[family-name:var(--font-montserrat)] text-[14px] leading-[23px] text-on-surface-variant">
          {service.description}
        </span>

        <span className="mt-5 mb-6 flex flex-wrap gap-2">
          {treatments.map((treatment) => (
            <span
              key={treatment}
              className="rounded-[999px] border border-ink/10 px-3 py-1 font-[family-name:var(--font-montserrat)] text-[11px] text-on-surface-variant"
            >
              {treatment}
            </span>
          ))}
          {moreCount > 0 && (
            <span className="px-1 py-1 font-[family-name:var(--font-montserrat)] text-[11px] text-on-surface-variant">
              +{moreCount} more
            </span>
          )}
        </span>

        <span className="mt-auto flex items-center justify-between border-t border-ink/10 pt-5">
          <span className="font-[family-name:var(--font-montserrat)] text-[15px] font-bold text-ink">
            {formatFrom(service.from)}
          </span>
          <span
            aria-hidden
            className="flex h-11 w-11 items-center justify-center rounded-[999px] border border-ink/15 text-ink transition-all duration-300 group-hover:border-majestic-gold group-hover:bg-majestic-gold group-hover:text-royal-navy"
          >
            <span className="material-symbols-outlined text-[20px] transition-transform duration-300 group-hover:translate-x-0.5">
              arrow_forward
            </span>
          </span>
        </span>
      </button>
    </li>
  );
}

/* ─── Component ──────────────────────────────────────────────── */
export default function HairSection({ media }: { media?: MediaOverrides }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);

  const openModal = (category: ServiceCategory) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  return (
    <section id="hair" className="bg-gradient-to-br from-[#f8f6f0] to-[#f4eee6] dark:from-surface dark:to-surface-container-low py-[80px] md:py-[140px] relative overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-majestic-gold/5 rounded-full blur-[100px] -translate-x-1/4 -translate-y-1/4 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-[1280px] px-6 md:px-[64px]">
        {/* Section Header */}
        <div className="mb-12 flex flex-col justify-between gap-6 md:mb-20 md:flex-row md:items-end md:gap-8">
          <div className="max-w-2xl">
            <div className="mb-5 flex items-center gap-4">
              <div className="h-px w-12 bg-champagne-taupe" />
              <span className="font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.2em] uppercase font-bold text-champagne-taupe">
                Crown &amp; Glory
              </span>
            </div>
            <h2 className="font-[family-name:var(--font-eb-garamond)] text-[48px] leading-[52px] md:text-[56px] md:leading-[60px] lg:text-[72px] lg:leading-[76px] tracking-[-0.01em] font-semibold text-ink">
              Hair Artistry
            </h2>
          </div>
          <p className="max-w-md pb-2 font-[family-name:var(--font-montserrat)] text-[15px] leading-[26px] md:text-[16px] md:leading-[28px] text-on-surface-variant">
            Precision cutting and editorial colour techniques, tailored to your lifestyle, face shape and hair texture.
          </p>
        </div>

        {/* Featured tile + five services: two even rows of three on desktop */}
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {/* Featured: Custom Wigging */}
          <li className="group relative min-h-[400px] overflow-hidden rounded-[28px] bg-midnight-ink text-white shadow-[0_30px_60px_-20px_rgba(17,24,68,0.45)]">
            {/* One element only: two copies of the same video (one CSS-hidden)
                download in parallel and the visible one intermittently stalls. */}
            <SlotMedia
              media={media}
              slot="salon.hair.showcase"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-midnight-ink via-midnight-ink/60 to-midnight-ink/10" />

            <div className="relative flex h-full flex-col p-7">
              <span className="self-start rounded-[999px] bg-majestic-gold px-4 py-1.5 font-[family-name:var(--font-montserrat)] text-[10px] font-bold uppercase tracking-[0.2em] text-royal-navy">
                Editor&apos;s Choice
              </span>

              <div className="mt-auto">
                <h3 className="font-[family-name:var(--font-eb-garamond)] text-[38px] leading-[42px] font-semibold">
                  Custom Wigging
                </h3>
                <p className="mt-3 font-[family-name:var(--font-montserrat)] text-[14px] leading-[23px] text-white/80">
                  Bespoke wigs made for your head, your hairline and your style, from closure units to 360 frontals.
                </p>

                <div className="mt-6 flex flex-col gap-4 border-t border-white/15 pt-5">
                  <span className="font-[family-name:var(--font-montserrat)] text-[15px] font-bold">
                    {formatFrom(300)}
                  </span>
                  <button
                    type="button"
                    onClick={() => openModal(customWiggingCategory)}
                    className="w-full rounded-[999px] bg-majestic-gold px-6 py-3.5 font-[family-name:var(--font-montserrat)] text-[11px] font-bold uppercase leading-[16px] tracking-[0.15em] text-royal-navy transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_15px_30px_rgba(212,175,55,0.35)]"
                  >
                    Configure &amp; Book
                  </button>
                </div>
              </div>
            </div>
          </li>

          {hairServices.map((service, index) => (
            <ServiceCard
              key={service.id}
              index={index}
              service={service}
              onBook={() => openModal(requireCategory(service.id))}
            />
          ))}
        </ul>
      </div>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={selectedCategory}
      />
    </section>
  );
}
