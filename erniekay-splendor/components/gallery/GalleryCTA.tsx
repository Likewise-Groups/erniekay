export default function GalleryCTA() {
  return (
    <section className="bg-midnight-ink py-[112px]">
      <div className="max-w-[1280px] mx-auto px-6 md:px-[64px]">
        <div className="border border-majestic-gold/30 p-12 md:p-24 text-center relative overflow-hidden">
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-majestic-gold/5 blur-3xl rounded-full -mr-32 -mt-32"></div>
          
          <h2 className="font-[family-name:var(--font-eb-garamond)] text-[48px] md:text-[56px] leading-[56px] font-semibold text-on-primary mb-8 relative z-10">
            Experience the Splendor
          </h2>
          <p className="font-[family-name:var(--font-montserrat)] text-[16px] leading-[26px] text-on-primary-container max-w-xl mx-auto mb-12 opacity-80 relative z-10">
            Ready to manifest your most radiant self? Whether it&apos;s for your wedding day, a personal transformation, or professional advancement, our doors are open.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-6 relative z-10">
            <button className="bg-majestic-gold text-midnight-ink px-10 py-5 font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold hover:bg-white transition-colors duration-300">
              Book Your Session
            </button>
            <button className="bg-transparent text-on-primary border border-on-primary px-10 py-5 font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold hover:bg-on-primary hover:text-midnight-ink transition-all duration-300">
              Inquire for Bridal
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
