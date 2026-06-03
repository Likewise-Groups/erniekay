import Image from "next/image";

export default function ShopHero() {
  return (
    <section className="relative w-full h-[500px] md:h-[614px] flex items-center overflow-hidden bg-royal-navy">
      {/* Background */}
      <div className="absolute inset-0 opacity-40">
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpA3Zz3bBmdvFfLCO0PPd_SaH0QVldrJuygmxG6aXjSi0lWOdzZ6NHGY0vqlos9WtKI6rXcADLSrNnv10XhqV2izjZG682HluEZwrVwZKIckXbjm4UFEeAfTN6IZsPK6PvlTcfsWeajClH5qO8XM349U53mNkVOsdsWK0yoj1NU780VAK3CxP80jtdjzE-WWuFNrerHF8n7lu21hGEar5leF4Q_nEWfZhe-hH_PB2Q9oDrr72I7XQMq3VgOrPA4nooD8skubbdifg"
          alt="Luxury beauty flat lay with dark glass bottles and golden accents on navy silk"
          fill
          className="object-cover object-center"
          unoptimized
          priority
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-[64px] w-full">
        <div className="max-w-2xl">
          <span className="font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.3em] uppercase text-majestic-gold mb-4 block">
            Established Prestige
          </span>
          <h1 className="font-[family-name:var(--font-eb-garamond)] text-[40px] md:text-[48px] leading-[48px] md:leading-[56px] tracking-[-0.01em] font-semibold text-white mb-6">
            The Splendor Collection
          </h1>
          <p className="font-[family-name:var(--font-montserrat)] text-[16px] leading-[26px] text-on-primary-container max-w-lg mb-8">
            Experience curated luxury through our bespoke range of clinical formulations. Designed
            for those who demand editorial perfection and skin rejuvenation as a daily ritual.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              id="shop-hero-explore"
              className="bg-majestic-gold text-royal-navy px-8 py-4 font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold hover:bg-white transition-colors active:scale-[0.98]"
            >
              Explore All
            </button>
            <button
              id="shop-hero-academy"
              className="border border-white text-white px-8 py-4 font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase hover:bg-white hover:text-royal-navy transition-colors active:scale-[0.98]"
            >
              The Academy Set
            </button>
          </div>
        </div>
      </div>

      {/* Featured selection — desktop only */}
      <div className="absolute bottom-0 right-0 p-8 md:p-12 hidden lg:block">
        <div className="border-l border-majestic-gold pl-6 py-2">
          <p className="font-[family-name:var(--font-montserrat)] text-[10px] leading-[16px] uppercase tracking-[0.15em] text-white/60">
            Featured Selection
          </p>
          <p className="font-[family-name:var(--font-eb-garamond)] text-[22px] leading-[30px] font-semibold text-majestic-gold">
            Winter &apos;24 Rituals
          </p>
        </div>
      </div>
    </section>
  );
}
