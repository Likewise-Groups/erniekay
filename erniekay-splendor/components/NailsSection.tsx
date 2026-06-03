import Image from "next/image";

const nailServices = [
  {
    id: "artisan-manicure",
    title: "Artisan Manicure",
    price: "$65",
    description:
      "Includes shaping, cuticle care, luxury exfoliation, and high-shine polish finish.",
  },
  {
    id: "splendor-pedicure",
    title: "The Splendor Pedicure",
    price: "$95",
    description:
      "A regenerative treatment with essential oil soak, volcanic stone massage, and paraffin hydration.",
  },
  {
    id: "gel-extensions",
    title: "Gel Extensions (Full Set)",
    price: "$130",
    description:
      "Sculpted enhancements tailored to your desired length and shape for ultimate durability and elegance.",
  },
  {
    id: "editorial-nail-art",
    title: "Editorial Nail Art",
    price: "Custom",
    description:
      "Bespoke designs, hand-painted details, and premium embellishments for a unique statement.",
  },
];

export default function NailsSection() {
  return (
    <section id="nails" className="py-[64px] md:py-[112px] max-w-[1280px] mx-auto px-6 md:px-[64px]">
      {/* Section Header */}
      <div className="text-center mb-12 md:mb-20">
        <span className="font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold text-majestic-gold mb-4 block">
          Impeccable Finish
        </span>
        <h2 className="font-[family-name:var(--font-eb-garamond)] text-[32px] md:text-[48px] leading-[40px] md:leading-[56px] tracking-[-0.01em] font-semibold text-royal-navy">
          Nail Care &amp; Artistry
        </h2>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-24 gap-y-10 md:gap-y-12">
        {nailServices.map((svc) => (
          <div key={svc.id} className="group service-card-hover">
            <div className="flex justify-between items-baseline mb-2">
              <h4 className="font-[family-name:var(--font-montserrat)] text-[16px] leading-[26px] font-semibold text-royal-navy">
                {svc.title}
              </h4>
              <span className="font-[family-name:var(--font-montserrat)] text-[16px] leading-[26px] font-semibold text-royal-navy">
                {svc.price}
              </span>
            </div>
            {/* Animated underline */}
            <div className="w-12 h-0.5 bg-outline-variant mb-4 service-line transition-all duration-500" />
            <p className="font-[family-name:var(--font-montserrat)] text-[14px] md:text-[16px] leading-[22px] md:leading-[26px] text-on-surface-variant">
              {svc.description}
            </p>
          </div>
        ))}
      </div>

      {/* Nail Art Image */}
      <div className="mt-12 md:mt-20">
        <div className="relative w-full h-52 md:h-80 border border-outline-variant overflow-hidden">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1NrUNbsg0s6RbLMfJeY5okkEz0ETczZ2cd6WMaQn95y6wDU8KXVmSn8guzcqZ2mBEVBkqnBfRPZxCXhRU-rKQ7Fxi-9OelI_y58Slco_Fpv0hL7_8TUtoOoy8g2JJwtfyyP_jVTispddS2c8hbHHYmxss2lnVEq_OKLvkMPb9ZMepHKVlneuoECVRFoNGOLSJVE4Awk5RE_jwBEiGTgo67thS-70c00HoTGDIBlZ0w7P3-M6br5X6uEoj3HRLqPC0UB9TMElq_3o"
            alt="Nail Art Display"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      </div>
    </section>
  );
}
