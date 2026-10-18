"use client";

import Image from "next/image";
import { useState } from "react";
import BookingModal from "@/components/BookingModal";
// Prices come from the catalogue, which is what the server charges against.
import { requireCategory, type ServiceCategory, type SubService } from "@/lib/serviceCatalog";

const WHATSAPP_NUMBER = "0543543111";
const WHATSAPP_URL = "https://wa.me/233543643111";

const priceGroups = [
  { id: "home-makeup", icon: "brush", title: "Makeup", subtitle: "Services" },
  { id: "home-hairstyling", icon: "content_cut", title: "Hairstyling", subtitle: "Services" },
  { id: "home-combo", icon: "redeem", title: "Combo Packages", subtitle: "Makeup + Hairstyling", featured: true },
].map((group) => ({ ...group, category: requireCategory(group.id) }));

const notes = [
  {
    icon: "local_taxi",
    title: "Transport included",
    body: "Prices include transport within Kumasi. Locations outside Kumasi and long-distance travel may attract an extra charge.",
  },
  {
    icon: "schedule",
    title: "Waiting time",
    body: "An extra GH₵300 applies for every 30 minutes of waiting beyond your booked time.",
  },
  {
    icon: "verified",
    title: "50% deposit",
    body: "A 50% deposit secures your booking. The balance is paid on the day of your appointment.",
  },
];

const perks = ["Convenience", "Comfort", "Privacy", "Personalised experience"];

const cedis = (amount: number) => `GH₵${amount.toLocaleString("en-GH")}`;

/** 1500 → "GH₵1,500"; "800-1000" → "GH₵800 – GH₵1,000". */
const formatPrice = (price: SubService["price"]) => {
  if (typeof price === "number") return cedis(price);
  const [low, high] = (price.match(/\d+/g) ?? []).map(Number);
  if (low === undefined) return price;
  return high === undefined ? cedis(low) : `${cedis(low)} – ${cedis(high)}`;
};

/** "Wig Styling Only (Curls, Straightening, etc.)" → ["Wig Styling Only", "Curls, Straightening, etc."] */
const splitName = (name: string): [string, string | undefined] => {
  const match = name.match(/^(.*?)\s*\((.*)\)$/);
  return match ? [match[1], match[2]] : [name, undefined];
};

export default function HomeServiceContent() {
  const [category, setCategory] = useState<ServiceCategory | null>(null);

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-midnight-ink text-white">
        <div className="pointer-events-none absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-majestic-gold/10 blur-[120px]" />
        <div className="relative mx-auto grid max-w-[1280px] items-center gap-12 px-6 py-20 md:px-[64px] md:py-28 lg:grid-cols-2">
          <div>
            <div className="mb-6 flex items-center gap-4">
              <div className="h-px w-12 bg-majestic-gold" />
              <span className="font-[family-name:var(--font-montserrat)] text-[12px] font-bold uppercase tracking-[0.2em] text-majestic-gold">
                Home Service · 2026 Price List
              </span>
            </div>
            <h1 className="font-[family-name:var(--font-eb-garamond)] text-[44px] font-semibold leading-[48px] md:text-[64px] md:leading-[68px]">
              Makeup &amp; hairstyling,
              <span className="block italic text-majestic-gold">at your doorstep.</span>
            </h1>
            <p className="mt-6 max-w-lg font-[family-name:var(--font-montserrat)] text-[16px] leading-[28px] text-white/75">
              The Erniekay Splendor experience, brought to your home, hotel or venue in Kumasi. Event glam, wig
              installation, bridal updos and combo packages.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href="#prices"
                className="rounded-[999px] bg-majestic-gold px-8 py-4 font-[family-name:var(--font-montserrat)] text-[12px] font-bold uppercase leading-[16px] tracking-[0.15em] text-royal-navy transition-all duration-300 hover:-translate-y-0.5 hover:bg-white"
              >
                View prices &amp; book
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-[999px] border border-white/30 px-8 py-4 font-[family-name:var(--font-montserrat)] text-[12px] font-bold uppercase leading-[16px] tracking-[0.15em] text-white transition-colors duration-300 hover:border-majestic-gold hover:text-majestic-gold"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                WhatsApp {WHATSAPP_NUMBER}
              </a>
            </div>
          </div>

          <div className="relative hidden h-[520px] lg:block">
            <div className="absolute right-0 top-0 h-[440px] w-[62%] overflow-hidden rounded-[32px] ring-1 ring-white/10">
              <Image src="/makeup4.jpg" alt="Soft glam bridal makeup" fill sizes="30vw" className="object-cover" priority />
            </div>
            <div className="absolute bottom-0 left-0 h-[320px] w-[48%] overflow-hidden rounded-[32px] shadow-2xl ring-4 ring-midnight-ink">
              <Image src="/makeup2.jpg" alt="Occasion glam with curls" fill sizes="25vw" className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Price list ── */}
      <section id="prices" className="scroll-mt-24 bg-surface py-20 md:py-28">
        <div className="mx-auto max-w-[1280px] px-6 md:px-[64px]">
          <div className="mb-12 max-w-2xl md:mb-16">
            <span className="font-[family-name:var(--font-montserrat)] text-[12px] font-bold uppercase tracking-[0.2em] text-champagne-taupe">
              Price list
            </span>
            <h2 className="mt-3 font-[family-name:var(--font-eb-garamond)] text-[40px] font-semibold leading-[44px] text-ink md:text-[52px] md:leading-[56px]">
              Choose your service
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
            {priceGroups.map((group) => (
              <div
                key={group.id}
                className={`relative flex flex-col rounded-[28px] p-7 md:p-8 ${
                  group.featured
                    ? "bg-royal-navy text-white shadow-[0_30px_60px_-25px_rgba(17,24,68,0.6)] ring-1 ring-majestic-gold/50"
                    : "border border-ink/10 bg-card shadow-[0_10px_30px_-18px_rgba(17,24,68,0.25)]"
                }`}
              >
                {group.featured && (
                  <span className="absolute -top-3 right-7 rounded-[999px] bg-majestic-gold px-4 py-1.5 font-[family-name:var(--font-montserrat)] text-[10px] font-bold uppercase tracking-[0.2em] text-royal-navy">
                    Combo offers
                  </span>
                )}

                <div className="flex items-center gap-4">
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-[999px] ${
                      group.featured ? "bg-majestic-gold text-royal-navy" : "bg-majestic-gold/15 text-ink"
                    }`}
                  >
                    <span className="material-symbols-outlined">{group.icon}</span>
                  </span>
                  <div>
                    <h3
                      className={`font-[family-name:var(--font-eb-garamond)] text-[28px] font-semibold leading-[32px] ${
                        group.featured ? "text-white" : "text-ink"
                      }`}
                    >
                      {group.title}
                    </h3>
                    <p
                      className={`font-[family-name:var(--font-montserrat)] text-[11px] font-bold uppercase tracking-[0.15em] ${
                        group.featured ? "text-majestic-gold" : "text-champagne-taupe"
                      }`}
                    >
                      {group.subtitle}
                    </p>
                  </div>
                </div>

                <ul className="mt-7 flex-1">
                  {group.category.subServices.map((sub) => {
                    const [name, detail] = splitName(sub.name);
                    return (
                      <li
                        key={sub.name}
                        className={`flex flex-wrap items-start justify-between gap-x-4 gap-y-2 border-b border-dashed py-4 last:border-0 ${
                          group.featured ? "border-white/15" : "border-ink/15"
                        }`}
                      >
                        {/* Wide price ranges drop below a long name instead of squeezing it */}
                        <span className="min-w-[11rem] flex-1">
                          <span
                            className={`block font-[family-name:var(--font-montserrat)] text-[15px] font-semibold ${
                              group.featured ? "text-white" : "text-ink"
                            }`}
                          >
                            {name}
                          </span>
                          {detail && (
                            <span
                              className={`block font-[family-name:var(--font-montserrat)] text-[12px] ${
                                group.featured ? "text-white/60" : "text-on-surface-variant"
                              }`}
                            >
                              {detail}
                            </span>
                          )}
                        </span>
                        <span className="shrink-0 whitespace-nowrap rounded-[999px] bg-majestic-gold px-3 py-1 font-[family-name:var(--font-montserrat)] text-[13px] font-bold text-royal-navy">
                          {formatPrice(sub.price)}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                <button
                  type="button"
                  onClick={() => setCategory(group.category)}
                  className={`mt-6 w-full rounded-[999px] py-4 font-[family-name:var(--font-montserrat)] text-[12px] font-bold uppercase leading-[16px] tracking-[0.15em] transition-all duration-300 hover:-translate-y-0.5 ${
                    group.featured
                      ? "bg-majestic-gold text-royal-navy hover:bg-white"
                      : "bg-royal-navy text-white hover:bg-majestic-gold hover:text-royal-navy"
                  }`}
                >
                  Book {group.title.toLowerCase()}
                </button>
              </div>
            ))}
          </div>

          <p className="mt-6 font-[family-name:var(--font-montserrat)] text-[13px] text-on-surface-variant">
            Where a price is a range, the final figure depends on the look and is confirmed before your appointment.
          </p>
        </div>
      </section>

      {/* ── Good to know ── */}
      <section className="bg-surface-container-low py-20 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-[64px]">
          <h2 className="font-[family-name:var(--font-eb-garamond)] text-[36px] font-semibold leading-[40px] text-ink md:text-[44px] md:leading-[48px]">
            Good to know
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {notes.map((note) => (
              <div key={note.title} className="rounded-[24px] border border-ink/10 bg-card p-7">
                <span className="material-symbols-outlined text-[28px] text-champagne-taupe">{note.icon}</span>
                <h3 className="mt-4 font-[family-name:var(--font-eb-garamond)] text-[24px] font-semibold text-ink">
                  {note.title}
                </h3>
                <p className="mt-2 font-[family-name:var(--font-montserrat)] text-[14px] leading-[24px] text-on-surface-variant">
                  {note.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why home service + WhatsApp ── */}
      <section className="bg-midnight-ink py-20 text-white md:py-24">
        <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-10 px-6 md:px-[64px] lg:flex-row lg:items-center">
          <div>
            <h2 className="font-[family-name:var(--font-eb-garamond)] text-[36px] font-semibold leading-[40px] md:text-[44px] md:leading-[48px]">
              Why choose home service?
            </h2>
            <ul className="mt-6 flex flex-wrap gap-3">
              {perks.map((perk) => (
                <li
                  key={perk}
                  className="rounded-[999px] border border-white/20 px-5 py-2 font-[family-name:var(--font-montserrat)] text-[13px] text-white/85"
                >
                  {perk}
                </li>
              ))}
            </ul>
          </div>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-5 rounded-[28px] border border-majestic-gold/40 bg-white/5 px-7 py-6 transition-colors duration-300 hover:border-majestic-gold hover:bg-white/10"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-[999px] bg-[#25D366] text-white">
              <span className="material-symbols-outlined text-[28px]">chat</span>
            </span>
            <span>
              <span className="block font-[family-name:var(--font-montserrat)] text-[12px] font-bold uppercase tracking-[0.15em] text-white/70">
                Call or WhatsApp to book
              </span>
              <span className="block font-[family-name:var(--font-eb-garamond)] text-[32px] font-semibold text-majestic-gold">
                {WHATSAPP_NUMBER}
              </span>
            </span>
          </a>
        </div>
      </section>

      <BookingModal isOpen={category !== null} onClose={() => setCategory(null)} category={category} />
    </>
  );
}
