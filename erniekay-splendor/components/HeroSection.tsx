import ShaderBackground from "./ShaderBackground";

export default function HeroSection() {
  return (
    <section className="relative flex items-center justify-center bg-midnight-ink overflow-hidden
      min-h-[60vh] md:min-h-[70vh]
    ">
      {/* WebGL Shader Background */}
      <div className="absolute inset-0 z-0">
        <ShaderBackground />
        {/* Optional gradient overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-midnight-ink/80 via-midnight-ink/50 to-transparent z-10" />
      </div>

      {/* ── Mobile layout — centered ── */}
      <div className="md:hidden relative z-20 w-full px-6 py-16 text-center">
        <div className="max-w-md mx-auto">
          <span className="font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.2em] uppercase text-majestic-gold mb-4 block">
            Professional Artistry
          </span>
          <h1 className="font-[family-name:var(--font-eb-garamond)] text-[32px] leading-[40px] tracking-[-0.01em] font-semibold text-on-primary mb-8">
            Salon Services
          </h1>
          <p className="font-[family-name:var(--font-montserrat)] text-[16px] leading-[26px] text-on-primary/80 mb-10">
            Where clinical precision meets editorial luxury. Our bespoke hair, skin, and makeup
            services are tailored to your unique beauty signature.
          </p>
          <div className="flex flex-col gap-4">
            <button
              id="hero-mobile-book"
              className="bg-majestic-gold text-royal-navy py-4 font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold"
            >
              Book Your Ritual
            </button>
            <button
              id="hero-mobile-pricing"
              className="border border-white/50 text-white py-4 font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase"
            >
              View Pricing
            </button>
          </div>
        </div>
      </div>

      {/* ── Desktop layout — left-aligned ── */}
      <div className="hidden md:block relative z-20 max-w-[1280px] w-full px-[64px]">
        <div className="grid grid-cols-12 gap-6 py-32">
          <div className="col-span-8">
            <span className="font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.3em] uppercase text-majestic-gold mb-6 block">
              Artistry in Every Detail
            </span>
            <h1 className="font-[family-name:var(--font-eb-garamond)] text-on-primary text-[64px] leading-[72px] tracking-[-0.01em] font-semibold mb-8">
              Salon Services
            </h1>
            <p className="font-[family-name:var(--font-montserrat)] text-[16px] leading-[26px] text-on-primary/80 max-w-xl mb-12">
              Step into a sanctuary where clinical precision meets editorial luxury. Our curated
              salon experiences are designed to celebrate your unique essence through bespoke
              artistry and world-class care.
            </p>
            <div className="flex gap-6">
              <button
                id="hero-view-services"
                className="bg-majestic-gold text-royal-navy px-10 py-4 font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold hover:bg-white transition-all"
              >
                View All Services
              </button>
              <button
                id="hero-portfolio"
                className="border border-white/30 text-white px-10 py-4 font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase hover:border-majestic-gold transition-all"
              >
                Our Portfolio
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}