import Image from "next/image";

const skinServices = [
  {
    id: "glow-facial",
    title: "Glow Facial",
    price: "$150",
    description:
      "Our signature introductory skin ritual focused on hydration, lymphatic drainage, and instant radiance.",
  },
  {
    id: "dermaplaning-luxe",
    title: "Dermaplaning Luxe",
    price: "$220",
    description:
      "Physical exfoliation combined with a specialty enzyme peel and cooling collagen mask for glass-like skin.",
  },
  {
    id: "red-carpet-peel",
    title: "Red Carpet Peel",
    price: "$275",
    description:
      "Advanced chemical resurfacing with zero downtime. Perfect for prepping for a major event or gala.",
  },
];

export default function SkinSection() {
  return (
    <section id="skin" className="bg-alabaster-white py-[64px] md:py-[112px]">
      <div className="max-w-[1280px] mx-auto px-6 md:px-[64px]">
        {/* Mobile section header */}
        <div className="md:hidden mb-8">
          <span className="font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold text-majestic-gold mb-2 block">
            The Ritual
          </span>
          <h2 className="font-[family-name:var(--font-eb-garamond)] text-[32px] leading-[40px] tracking-[-0.01em] font-semibold text-royal-navy">
            SPA
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          {/* Image column */}
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 border-t-2 border-l-2 border-majestic-gold hidden md:block" />
            <div className="relative w-full h-[340px] md:h-[600px] border border-outline-variant shadow-xl overflow-hidden">
              <Image
                src="/facial.jpg"
                alt="A serene spa environment focusing on SPA"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            {/* Overlay card — desktop only */}
            <div className="hidden md:block absolute bottom-0 right-0 bg-royal-navy text-white p-10 max-w-sm">
              <span className="font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold text-majestic-gold mb-4 block">
                The Ritual
              </span>
              <h3 className="font-[family-name:var(--font-eb-garamond)] text-[28px] leading-[36px] font-semibold mb-4">
                Skin Rejuvenation
              </h3>
              <p className="font-[family-name:var(--font-montserrat)] text-[16px] leading-[26px] text-white/80 mb-6">
                Medical-grade results meeting holistic luxury. Every facial is a custom journey.
              </p>
            </div>
          </div>

          {/* Services list */}
          <div className="space-y-8 md:space-y-12">
            {skinServices.map((svc) => (
              <div key={svc.id} className="border-b border-outline-variant pb-8">
                <div className="flex justify-between items-start md:items-center mb-4 gap-4">
                  <h4 className="font-[family-name:var(--font-eb-garamond)] text-[24px] md:text-[28px] leading-[32px] md:leading-[36px] tracking-[-0.005em] font-semibold text-royal-navy">
                    {svc.title}
                  </h4>
                  <span className="font-[family-name:var(--font-eb-garamond)] text-[24px] md:text-[28px] leading-[32px] md:leading-[36px] font-semibold text-majestic-gold shrink-0">
                    {svc.price}
                  </span>
                </div>
                <p className="font-[family-name:var(--font-montserrat)] text-[14px] md:text-[16px] leading-[22px] md:leading-[26px] text-on-surface-variant mb-6">
                  {svc.description}
                </p>
                <a
                  id={svc.id}
                  href="#"
                  className="text-royal-navy font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold border-b border-royal-navy pb-1 hover:text-majestic-gold hover:border-majestic-gold transition-all"
                >
                  Book Service
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
