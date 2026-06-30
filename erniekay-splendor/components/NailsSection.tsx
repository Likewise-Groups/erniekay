import Image from "next/image";

const nailServices = [
  {
    id: "artisan-manicure",
    title: "Artisan Manicure",
    price: "150 GH₵",
    description:
      "Includes shaping, cuticle care, luxury exfoliation, and high-shine polish finish.",
  },
  {
    id: "splendor-pedicure",
    title: "The Splendor Pedicure",
    price: "200 GH₵",
    description:
      "A regenerative treatment with essential oil soak, volcanic stone massage, and paraffin hydration.",
  },
  {
    id: "gel-extensions",
    title: "Gel Extensions (Full Set)",
    price: "250 GH₵",
    description:
      "Sculpted enhancements tailored to your desired length and shape for ultimate durability and elegance.",
  },
  {
    id: "editorial-nail-art",
    title: "Editorial Nail Art",
    price: "From 100 GH₵",
    description:
      "Bespoke designs, hand-painted details, and premium embellishments for a unique statement.",
  },
];

export default function NailsSection() {
  return (
    <section id="nails" className="py-[64px] md:py-[112px] bg-background">
      <div className="max-w-[1280px] mx-auto px-6 md:px-[64px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          
          {/* Left Column: Header & Services */}
          <div className="lg:col-span-6">
            <div className="mb-12 md:mb-16">
              <span className="font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.2em] uppercase font-bold text-majestic-gold mb-4 block">
                Impeccable Finish
              </span>
              <h2 className="font-[family-name:var(--font-eb-garamond)] text-[40px] md:text-[56px] leading-[48px] md:leading-[64px] tracking-[-0.01em] font-semibold text-royal-navy mb-6">
                Nail Care &amp; Artistry
              </h2>
              <p className="font-[family-name:var(--font-montserrat)] text-[16px] leading-[26px] text-on-surface-variant max-w-lg">
                Experience our signature nail services designed to provide the ultimate in relaxation and refined beauty. Let our artisans elevate your look.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              {nailServices.map((svc) => (
                <div key={svc.id} className="group relative p-6 rounded-2xl bg-white border border-outline-variant/50 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_40px_-15px_rgba(212,175,55,0.3)] hover:border-majestic-gold/50 transition-all duration-500 hover:-translate-y-1">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-[family-name:var(--font-eb-garamond)] text-[24px] leading-[30px] font-semibold text-royal-navy group-hover:text-majestic-gold transition-colors duration-300">
                      {svc.title}
                    </h4>
                    <span className="font-[family-name:var(--font-montserrat)] text-[14px] font-semibold text-royal-navy bg-alabaster-white px-3 py-1 rounded-full border border-outline-variant/50 whitespace-nowrap shadow-sm">
                      {svc.price}
                    </span>
                  </div>
                  <p className="font-[family-name:var(--font-montserrat)] text-[14px] leading-[22px] text-on-surface-variant">
                    {svc.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Staggered Video Collage */}
          <div className="lg:col-span-6 mt-12 lg:mt-0">
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              {/* Left Column of Videos */}
              <div className="flex flex-col gap-4 md:gap-6 pt-12">
                <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border border-outline-variant/30 group">
                  <video src="/nail service.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-royal-navy/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-xl border border-outline-variant/30 group">
                  <video src="/nail service 2.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-royal-navy/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border border-outline-variant/30 group">
                  <video src="/nail service 4.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-royal-navy/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>

              {/* Right Column of Videos */}
              <div className="flex flex-col gap-4 md:gap-6">
                <div className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-xl border border-outline-variant/30 group">
                  <video src="/nail service 3.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-royal-navy/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border border-outline-variant/30 group">
                  <video src="/nail service 5.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-royal-navy/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
