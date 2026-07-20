import Image from "next/image";
import FadeIn from "@/components/FadeIn";

export default function AboutHero() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#f8f6f0] to-[#f4eee6] py-[120px]">
      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-majestic-gold/10 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-royal-navy/5 rounded-full blur-[80px] -translate-x-1/4 translate-y-1/4" />

      <div className="max-w-[1280px] mx-auto px-6 md:px-[64px] relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          <div className="flex flex-col gap-6 order-2 lg:order-1">
            <FadeIn>
              <div className="flex items-center gap-4 mb-4">
                <div className="h-px w-12 bg-majestic-gold"></div>
                <span className="font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.2em] uppercase font-bold text-majestic-gold">
                  The Visionaries
                </span>
              </div>
              <h1 className="font-[family-name:var(--font-eb-garamond)] text-[48px] md:text-[64px] lg:text-[72px] leading-[52px] md:leading-[68px] lg:leading-[76px] font-semibold text-royal-navy mb-8">
                Clinical Precision. <br className="hidden md:block"/> Artistic Soul.
              </h1>
              <p className="font-[family-name:var(--font-montserrat)] text-[16px] md:text-[18px] leading-[28px] md:leading-[32px] text-on-surface-variant max-w-xl border-l-2 border-majestic-gold/30 pl-6">
                Erniekay Splendor was founded on a simple yet uncompromising philosophy: that true beauty is realized when the precision of science meets the freedom of high-fashion art. We curate luxury transformations and train the next generation of global beauty leaders.
              </p>
            </FadeIn>
          </div>

          <div className="order-1 lg:order-2 relative">
            <FadeIn delay={200}>
              <div className="relative w-full aspect-[4/5] max-w-[600px] mx-auto rounded-tl-[80px] rounded-br-[80px] overflow-hidden shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)] ring-1 ring-white/50">
                <Image
                  src="/erniekay3.jpg"
                  alt="Founder of Erniekay Splendor"
                  fill
                  priority
                  className="object-cover scale-105 hover:scale-100 transition-transform duration-[2s]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-royal-navy/40 to-transparent opacity-60" />
              </div>
              
              {/* Floating badge */}
              <div className="absolute bottom-10 -left-6 md:-left-12 bg-white/90 backdrop-blur-md px-8 py-6 rounded-2xl shadow-xl border border-majestic-gold/20 flex flex-col items-center">
                <span className="font-[family-name:var(--font-eb-garamond)] text-[32px] font-bold text-majestic-gold mb-1">10+</span>
                <span className="font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-widest font-bold text-royal-navy text-center">Years of<br/>Excellence</span>
              </div>
            </FadeIn>
          </div>

        </div>
      </div>
    </section>
  );
}
