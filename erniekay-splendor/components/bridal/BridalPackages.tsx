"use client";

import { useState } from "react";
import Image from "next/image";

type BridalPackage = {
  id: string;
  title: string;
  price: string; // GHS, plain numerals
  tagline: string;
  features: string[];
  featured: boolean;
  imgSrc?: string;
  imgAlt?: string;
};

type AddOn = { name: string; price: string };

// ── MAKEUP — from the Erniekay Splendor Bridal Rate Card 2026 ──
const makeupPackages: BridalPackage[] = [
  {
    id: "mk-trial",
    title: "Trial",
    price: "2000",
    tagline: "Get familiar, try looks & tones before the big day.",
    features: [
      "One trial look with the artist",
      "Usable for your pre-wedding shoot",
      "Up to 2 guests at the studio",
    ],
    featured: false,
    imgSrc: "/makeup.jpg",
    imgAlt: "Bride having soft glam makeup applied by Erniekay Splendor",
  },
  {
    id: "mk-bronze",
    title: "Bronze Package",
    price: "3200",
    tagline: "Bridal makeup for a single event.",
    features: ["Makeup for the bride — one event only", "2-hour session"],
    featured: false,
    imgSrc: "/makeup7.jpg",
    imgAlt: "Glam bridal makeup with a smokey eye and glossy lip",
  },
  {
    id: "mk-gold",
    title: "Gold Package",
    price: "5000",
    tagline: "Two events in one day, one radiant bride.",
    features: [
      "Makeup for a 2-in-1 event (one day)",
      "2 hours for the 1st look",
      "Touch-up & colour change for the 2nd look",
    ],
    featured: true,
    imgSrc: "/hair1.jpg",
    imgAlt: "Bridal hair and makeup styling by Erniekay Splendor",
  },
  {
    id: "mk-platinum",
    title: "Platinum Package",
    price: "6000",
    tagline: "Traditional & white wedding across two days.",
    features: ["Bride's makeup for 2 days", "2 hours each day"],
    featured: false,
    imgSrc: "/MAKEUP9.jpg",
    imgAlt: "Elegant bridal makeup and styling by Erniekay Splendor",
  },
  {
    id: "mk-premium",
    title: "Premium Package",
    price: "7500",
    tagline: "Two days plus a reception touch-up.",
    features: [
      "Traditional & white wedding",
      "Wedding reception touch-up",
      "2 hrs each day + 30-min touch-up",
    ],
    featured: false,
    imgSrc: "/MAKEUP10.jpg",
    imgAlt: "Radiant bridal makeup look by Erniekay Splendor",
  },
  {
    id: "mk-splendor-experience",
    title: "The Splendor Premium Experience",
    price: "9000",
    tagline: "Up to 4 looks across a 10-hour day.",
    features: [
      "Up to 4 changes in 10 hours",
      "Lead artist present throughout",
      "Begins at your dress-up location",
    ],
    featured: false,
    imgSrc: "/makeup4.jpg",
    imgAlt: "Bride in beaded gown with full glam makeup and styling",
  },
  {
    id: "mk-luxury-touch",
    title: "Luxury Touch",
    price: "2000",
    tagline: "Curated for your other special occasions.",
    features: [
      "Thanksgiving & baby christening",
      "Court signing",
      "Bridal trial (studio walk-in)",
    ],
    featured: false,
    imgSrc: "/makeup5.jpg",
    imgAlt: "Traditional bridal makeup and gele styling by Erniekay Splendor",
  },
];

const makeupAddOns: AddOn[] = [
  { name: "Bridesmaid / Guest", price: "800" },
  { name: "Mother of the Bride", price: "1200" },
];

// ── HAIR STYLING — from the Erniekay Splendor Bridal Hairstyling Rate Card 2026 ──
const hairPackages: BridalPackage[] = [
  {
    id: "hr-bronze",
    title: "Bronze Package",
    price: "2800",
    tagline: "Same-day event — clean install & style.",
    features: ["Installation and hairstyling", "Up to 2 hours"],
    featured: false,
    imgSrc: "/hair.jpg",
    imgAlt: "Bridal hairstyling by Erniekay Splendor",
  },
  {
    id: "hr-silver",
    title: "Silver Package",
    price: "3200",
    tagline: "Same-day event with a custom wig.",
    features: ["Installation, one wig making & styling", "Up to 2 hours"],
    featured: false,
    imgSrc: "/hair2.jpg",
    imgAlt: "Bridal wig install and styling by Erniekay Splendor",
  },
  {
    id: "hr-gold",
    title: "Gold Package",
    price: "4500",
    tagline: "Same-day event, two distinct styles.",
    features: [
      "Installation, one wig making & two hair styles",
      "Up to 5 hours",
    ],
    featured: true,
    imgSrc: "/hair3.jpg",
    imgAlt: "Elegant bridal hairstyle by Erniekay Splendor",
  },
  {
    id: "hr-diamond",
    title: "Diamond Package",
    price: "6000",
    tagline: "Full-day event, three hair changes.",
    features: [
      "Installation, one wig making & three hair styles",
      "Up to 8 hours (full day)",
    ],
    featured: false,
    imgSrc: "/hair4.jpg",
    imgAlt: "Full-day bridal hairstyling by Erniekay Splendor",
  },
  {
    id: "hr-premium",
    title: "Premium Package",
    price: "5500",
    tagline: "Two-day event — engagement & wedding.",
    features: [
      "Installation, one wig making & two hair styles",
      "One style each: engagement & wedding/reception",
    ],
    featured: false,
    imgSrc: "/hair1.jpg",
    imgAlt: "Two-day bridal hairstyling by Erniekay Splendor",
  },
  {
    id: "hr-premium-x",
    title: "Premium X Package",
    price: "7000",
    tagline: "Two-day event with three styles.",
    features: [
      "Installation, two wig making & three hair styles",
      "One style each: engagement, wedding & reception",
    ],
    featured: false,
    imgSrc: "/hair.jpg",
    imgAlt: "Bridal hairstyling across two days by Erniekay Splendor",
  },
  {
    id: "hr-platinum",
    title: "Platinum Package",
    price: "9000",
    tagline: "Two days, four styles + bride's mum.",
    features: [
      "Installation, two wig making & four hairstyles",
      "Two styles each day (engagement, wedding & reception)",
      "One hairstyle for the bride's mum",
    ],
    featured: false,
    imgSrc: "/hair2.jpg",
    imgAlt: "Premium bridal hairstyling by Erniekay Splendor",
  },
  {
    id: "hr-delux",
    title: "De-Lux Package",
    price: "11000",
    tagline: "Three-day event across all celebrations.",
    features: [
      "Installation, two wig making & four hairstyles",
      "Two styles (engagement) + one each (wedding & reception)",
      "One style each for thanksgiving & bride's mum",
    ],
    featured: false,
    imgSrc: "/hair3.jpg",
    imgAlt: "Multi-day bridal hairstyling by Erniekay Splendor",
  },
  {
    id: "hr-desplendor",
    title: "De-Splendor Package",
    price: "15000",
    tagline: "The complete three-day styling experience.",
    features: [
      "Installation, two wig making & five hairstyles",
      "Two styles each day (engagement, wedding & reception)",
      "Styles for thanksgiving, bride's mum & sister",
    ],
    featured: false,
    imgSrc: "/hair4.jpg",
    imgAlt: "Signature multi-day bridal hairstyling by Erniekay Splendor",
  },
];

const hairAddOns: AddOn[] = [
  { name: "Bridesmaid / Mother / Guest — Styling only", price: "800" },
  { name: "Bridesmaid / Mother / Guest — Wig install & styling", price: "1200" },
];

// Event tier per hair package — so "Special · Three-Day Event" etc. is visible.
const hairTier: Record<string, string> = {
  "hr-bronze": "Same-Day Event",
  "hr-silver": "Same-Day Event",
  "hr-gold": "Same-Day Event",
  "hr-diamond": "Same-Day Event",
  "hr-premium": "Two-Day Event",
  "hr-premium-x": "Two-Day Event",
  "hr-platinum": "Two-Day Event",
  "hr-delux": "Special · Three-Day Event",
  "hr-desplendor": "Special · Three-Day Event",
};

// ── Informational cards ("Good to Know") ──
type InfoRow = { label: string; value: string };
type InfoGroup = { heading: string; rows: InfoRow[] };
type InfoCard = {
  id: string;
  title: string;
  icon: string; // material symbol name
  rows?: InfoRow[];
  groups?: InfoGroup[];
  note?: string;
};

// Shown in both makeup & hair modes.
const universalInfoCards: InfoCard[] = [
  {
    id: "out-of-kumasi",
    title: "Out of Kumasi Deals",
    icon: "map",
    rows: [
      { label: "One Day", value: "GH₵6,000" },
      { label: "Two Days", value: "GH₵12,000" },
      { label: "Three Days", value: "GH₵18,000" },
    ],
    note: "Plus travel — see Transportation.",
  },
  {
    id: "transportation",
    title: "Transportation",
    icon: "local_taxi",
    rows: [
      { label: "Within Kumasi", value: "GH₵300" },
      { label: "Outside Kumasi", value: "By location (+ hotel)" },
      { label: "Outside Ghana", value: "Flight, food, hotel & travel" },
    ],
    note: "Transportation is not included in any package.",
  },
  {
    id: "payment",
    title: "Payment Details",
    icon: "payments",
    rows: [
      { label: "MTN MoMo", value: "0598592252" },
      { label: "Merchant ID", value: "561922" },
      { label: "Cal Bank Acct", value: "1400008433544" },
      { label: "Account Name", value: "Erniekay Splendor" },
    ],
    note: "A non-refundable 50% retainer secures your confirmed date.",
  },
];

// Shown in hair mode only.
const hairInfoCards: InfoCard[] = [
  {
    id: "bridesmaids-others",
    title: "Bridesmaids & Others",
    icon: "group",
    rows: [
      { label: "Styling only", value: "GH₵800" },
      { label: "Wig install & styling", value: "GH₵1,200" },
    ],
    note: "Bridesmaids · Bride's mother · Guests.",
  },
  {
    id: "thanksgiving-others",
    title: "Thanksgiving & Others",
    icon: "celebration",
    rows: [
      { label: "Styling only", value: "GH₵1,500" },
      { label: "Wig install & styling", value: "GH₵2,000" },
    ],
    note: "Thanksgiving · Baby christening · Birthday.",
  },
  {
    id: "wig-making",
    title: "Wig Making & Sew-in",
    icon: "content_cut",
    rows: [
      { label: "Traditional sew-in", value: "GH₵500" },
      { label: "U-part / Closure wig", value: "GH₵500" },
      { label: "180 frontal wig", value: "GH₵700" },
      { label: "360 frontal wig", value: "GH₵800" },
      { label: "Two-frontal customization", value: "GH₵1,200" },
      { label: "Colouring", value: "GH₵800 – 1,500" },
    ],
  },
  {
    id: "lux-hair-unit",
    title: "Lux Hair Unit",
    icon: "auto_awesome",
    groups: [
      {
        heading: "Raw Hair Bundles",
        rows: [
          { label: "12″", value: "GH₵800" },
          { label: "14″", value: "GH₵1,200" },
          { label: "16″", value: "GH₵1,300" },
          { label: "18″", value: "GH₵1,400" },
          { label: "20″", value: "GH₵1,600" },
          { label: "22″", value: "GH₵1,700" },
          { label: "24″", value: "GH₵1,850" },
          { label: "26″", value: "GH₵2,000" },
        ],
      },
      {
        heading: "HD Lace Frontals",
        rows: [
          { label: "14″", value: "GH₵2,300" },
          { label: "16″", value: "GH₵2,500" },
          { label: "18″", value: "GH₵2,650" },
          { label: "20″", value: "GH₵2,800" },
        ],
      },
    ],
    note: "Bundles & frontals priced by length & volume.",
  },
];

const currency = new Intl.NumberFormat("en-GH", {
  style: "currency",
  currency: "GHS",
  maximumFractionDigits: 0,
});

type ServiceMode = "makeup" | "hair";

const MODES: { key: ServiceMode; label: string; footnote: string }[] = [
  {
    key: "makeup",
    label: "Makeup",
    footnote:
      "A non-refundable 50% deposit secures your date. Prices exclude transportation.",
  },
  {
    key: "hair",
    label: "Hair Styling",
    footnote:
      "A non-refundable 50% deposit secures your date. Prices exclude transportation & hair bundles. Wigs for styling must be made by us.",
  },
];

function InfoRows({ rows }: { rows: InfoRow[] }) {
  return (
    <dl className="space-y-3">
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex items-baseline justify-between gap-4 border-b border-[#F0F0F0] pb-3 last:border-0"
        >
          <dt className="font-[family-name:var(--font-montserrat)] text-[13px] leading-[20px] text-on-surface-variant">
            {row.label}
          </dt>
          <dd className="font-[family-name:var(--font-montserrat)] text-[13px] leading-[20px] font-bold text-royal-navy text-right shrink-0">
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

type BridalPackagesProps = {
  /** Called with a labelled package (e.g. "Makeup · Gold Package") when a client enquires. */
  onSelectPackage?: (label: string) => void;
  /** Label of the package currently selected in the enquiry, if any. */
  selectedPackage?: string | null;
};

export default function BridalPackages({
  onSelectPackage,
  selectedPackage,
}: BridalPackagesProps) {
  const [mode, setMode] = useState<ServiceMode>("makeup");

  const active = MODES.find((m) => m.key === mode)!;
  const packages = mode === "makeup" ? makeupPackages : hairPackages;
  const addOns = mode === "makeup" ? makeupAddOns : hairAddOns;
  const infoCards =
    mode === "hair" ? [...hairInfoCards, ...universalInfoCards] : universalInfoCards;

  return (
    <section className="py-[112px] bg-alabaster-white">
      <div className="max-w-[1280px] mx-auto px-6 md:px-[64px]">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="font-[family-name:var(--font-eb-garamond)] text-[48px] leading-[56px] tracking-[-0.01em] font-semibold text-primary mb-4">
            Curated Bridal Collections
          </h2>
          <p className="font-[family-name:var(--font-montserrat)] text-[14px] leading-[22px] text-on-surface-variant">
            Choose your service to view its pricing.
          </p>
          <div className="h-[2px] w-24 bg-majestic-gold mx-auto mt-6" />
        </div>

        {/* Service toggle — Makeup / Hair Styling */}
        <div className="mb-14 flex justify-center">
          <div className="inline-flex border border-outline bg-white p-1">
            {MODES.map((m) => (
              <button
                key={m.key}
                type="button"
                onClick={() => setMode(m.key)}
                className={`px-8 py-3 font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold transition-colors ${
                  mode === m.key
                    ? "bg-royal-navy text-white"
                    : "text-royal-navy hover:text-majestic-gold"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Package Cards — price-forward */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => {
            const label = `${active.label} · ${pkg.title}`;
            const isSelected = selectedPackage === label;
            const tier = mode === "hair" ? hairTier[pkg.id] : undefined;
            const isSpecial = tier?.startsWith("Special");
            return (
              <div
                key={pkg.id}
                className={`bg-white group hover:editorial-shadow transition-all duration-500 relative flex flex-col p-8 ${
                  isSelected
                    ? "border-2 border-royal-navy"
                    : pkg.featured
                      ? "border-2 border-majestic-gold"
                      : "border border-[#EBEBEB]"
                }`}
              >
                {/* Most Requested badge */}
                {pkg.featured && !isSelected && (
                  <div className="absolute top-0 right-0 bg-majestic-gold text-royal-navy font-[family-name:var(--font-montserrat)] text-[10px] leading-[16px] tracking-[0.15em] uppercase font-bold px-3 py-1 z-10">
                    Most Requested
                  </div>
                )}

                {/* Selected badge */}
                {isSelected && (
                  <div className="absolute top-0 right-0 bg-royal-navy text-white font-[family-name:var(--font-montserrat)] text-[10px] leading-[16px] tracking-[0.15em] uppercase font-bold px-3 py-1 z-10">
                    Selected
                  </div>
                )}

                {/* Header image (edge-to-edge, breaking out of card padding).
                    object-contain so the full portrait image is always visible. */}
                {pkg.imgSrc && (
                  <div className="relative -mx-8 -mt-8 mb-6 aspect-[3/4] overflow-hidden bg-alabaster-white">
                    <Image
                      src={pkg.imgSrc}
                      alt={pkg.imgAlt ?? pkg.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-contain"
                    />
                  </div>
                )}

                {/* Event tier pill (hair packages) */}
                {tier && (
                  <span
                    className={`inline-block self-start mb-3 px-3 py-1 font-[family-name:var(--font-montserrat)] text-[9px] leading-[14px] tracking-[0.15em] uppercase font-bold ${
                      isSpecial
                        ? "bg-royal-navy text-majestic-gold"
                        : "border border-champagne-taupe/50 text-champagne-taupe"
                    }`}
                  >
                    {tier}
                  </span>
                )}

                {/* Package name — subdued */}
                <p className="font-[family-name:var(--font-montserrat)] text-[11px] leading-[16px] tracking-[0.2em] uppercase font-bold text-champagne-taupe mb-4">
                  {pkg.title}
                </p>

                {/* PRICE — the emphasis */}
                <p className="font-[family-name:var(--font-eb-garamond)] text-[56px] leading-[60px] font-semibold text-royal-navy mb-4">
                  {currency.format(Number(pkg.price))}
                </p>

                {/* Supporting copy — kept quiet */}
                <p className="font-[family-name:var(--font-montserrat)] text-[14px] leading-[22px] text-on-surface-variant mb-6">
                  {pkg.tagline}
                </p>

                <ul className="space-y-3 mb-8 flex-1">
                  {pkg.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-3 font-[family-name:var(--font-montserrat)] text-[14px] leading-[22px] text-on-surface-variant"
                    >
                      <span
                        className="material-symbols-outlined text-majestic-gold text-[18px] mt-[1px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        check_circle
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA — carries the labelled package into the enquiry */}
                <button
                  id={`pkg-${pkg.id}`}
                  type="button"
                  onClick={() => onSelectPackage?.(label)}
                  className={`w-full py-4 font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold transition-colors active:scale-95 ${
                    isSelected
                      ? "bg-royal-navy text-white"
                      : pkg.featured
                        ? "bg-royal-navy text-white hover:bg-black"
                        : "border border-royal-navy text-royal-navy hover:bg-royal-navy hover:text-white"
                  }`}
                >
                  {isSelected ? "Selected — Enquire Below" : "Enquire About This Package"}
                </button>
              </div>
            );
          })}
        </div>

        {/* Add-ons + footnote */}
        <div className="mt-12 flex flex-col items-center gap-4">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            {addOns.map((add) => (
              <p
                key={add.name}
                className="font-[family-name:var(--font-montserrat)] text-[13px] leading-[20px] text-on-surface-variant"
              >
                <span className="font-bold text-royal-navy">
                  {currency.format(Number(add.price))}
                </span>{" "}
                — {add.name}
              </p>
            ))}
          </div>
          <p className="text-center font-[family-name:var(--font-montserrat)] text-[12px] leading-[20px] text-on-surface-variant italic max-w-2xl">
            {active.footnote}
          </p>
        </div>

        {/* ── Good to Know — informational cards ── */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <h3 className="font-[family-name:var(--font-eb-garamond)] text-[36px] leading-[44px] font-semibold text-primary mb-4">
              Good to Know
            </h3>
            <div className="h-[2px] w-16 bg-majestic-gold mx-auto" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {infoCards.map((card) => (
              <div
                key={card.id}
                className="bg-white border border-[#EBEBEB] p-8 flex flex-col"
              >
                <div className="flex items-center gap-3 mb-6">
                  <span
                    className="material-symbols-outlined text-majestic-gold"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {card.icon}
                  </span>
                  <h4 className="font-[family-name:var(--font-eb-garamond)] text-[22px] leading-[28px] font-semibold text-royal-navy">
                    {card.title}
                  </h4>
                </div>

                <div className="flex-1 space-y-5">
                  {card.rows && <InfoRows rows={card.rows} />}
                  {card.groups?.map((group) => (
                    <div key={group.heading}>
                      <p className="font-[family-name:var(--font-montserrat)] text-[10px] leading-[16px] tracking-[0.15em] uppercase font-bold text-champagne-taupe mb-3">
                        {group.heading}
                      </p>
                      <InfoRows rows={group.rows} />
                    </div>
                  ))}
                </div>

                {card.note && (
                  <p className="mt-5 font-[family-name:var(--font-montserrat)] text-[11px] leading-[18px] text-on-surface-variant italic">
                    {card.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
