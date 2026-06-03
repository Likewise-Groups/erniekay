export default function CTASection() {
  return (
    <section className="py-[112px] bg-white">
      <div className="max-w-4xl mx-auto px-[24px] text-center">
        <h2 className="font-[family-name:var(--font-eb-garamond)] text-[48px] leading-[56px] tracking-[-0.01em] font-semibold text-royal-navy mb-8">
          Indulge in Excellence
        </h2>
        <p className="font-[family-name:var(--font-montserrat)] text-[16px] leading-[26px] text-on-surface-variant mb-12">
          Our appointments fill up quickly. Secure your moment of luxury with Nigeria&apos;s premier
          beauty destination today.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <button
            id="cta-schedule-online"
            className="bg-royal-navy text-on-primary px-12 py-5 font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold border border-majestic-gold hover:bg-primary-container transition-all"
          >
            Schedule Online
          </button>
          <button
            id="cta-contact-salon"
            className="border border-royal-navy text-royal-navy px-12 py-5 font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold hover:bg-alabaster-white transition-all"
          >
            Contact Salon
          </button>
        </div>
      </div>
    </section>
  );
}
