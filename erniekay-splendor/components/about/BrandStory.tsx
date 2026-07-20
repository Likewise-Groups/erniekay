import Image from "next/image";
import FadeIn from "@/components/FadeIn";

export default function BrandStory() {
  return (
    <section className="py-[112px] md:py-[160px] bg-white overflow-hidden relative">
      <div className="max-w-[1280px] mx-auto px-6 md:px-[64px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          
          {/* Asymmetric Image Wrapper */}
          <div className="lg:col-span-5 relative">
            <FadeIn className="w-full">
              <div className="relative w-full aspect-[3/4] max-w-[500px] mx-auto overflow-hidden group shadow-2xl rounded-2xl">
                <Image
                  src="/erniekay.jpg"
                  alt="Founder Erniekay at work applying custom editorial detailing"
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                
                {/* Decorative Frame */}
                <div className="absolute inset-0 border-2 border-majestic-gold m-6 opacity-0 group-hover:opacity-100 group-hover:m-4 transition-all duration-500 rounded-xl" />
              </div>

              {/* Offset Image / Texture behind */}
              <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-background border border-outline-variant/30 rounded-full -z-10 opacity-50" />
            </FadeIn>
          </div>

          {/* Text Content */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <FadeIn delay={200}>
              <span className="font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.2em] uppercase font-bold text-majestic-gold block mb-6">
                Our Story
              </span>
              <h2 className="font-[family-name:var(--font-eb-garamond)] text-[40px] md:text-[56px] leading-[48px] md:leading-[64px] font-semibold text-royal-navy mb-8">
                From a Private Studio <br className="hidden md:block"/> to an Editorial Powerhouse
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="font-[family-name:var(--font-montserrat)] text-[15px] leading-[26px] text-on-surface-variant flex flex-col gap-4">
                  <p>
                    Founded by Erniekay, a visionary master artist obsessed with detail and symmetry, the brand was born from a desire to elevate salon standards to the level of global runways. 
                  </p>
                  <p>
                    We believed that clients shouldn&apos;t have to choose between a clinically precise application and a soul-stirring, artistic creation.
                  </p>
                </div>
                <div className="font-[family-name:var(--font-montserrat)] text-[15px] leading-[26px] text-on-surface-variant flex flex-col gap-4">
                  <p>
                    Today, Erniekay Splendor spans three distinct yet interconnected divisions: our luxury salon boutique, our bridal artistry service, and our prestigious beauty academy. 
                  </p>
                  <p>
                    Each branch operates on the same baseline value: uncompromising quality, premium inputs, and editorial-grade aesthetics.
                  </p>
                </div>
              </div>

              <div className="bg-alabaster-white/50 p-8 md:p-10 rounded-3xl border border-outline-variant/30 relative">
                <span className="absolute -top-4 -left-2 text-[80px] text-majestic-gold/20 font-serif leading-none">&ldquo;</span>
                <p className="italic font-[family-name:var(--font-eb-garamond)] text-[22px] md:text-[26px] leading-[32px] md:leading-[38px] text-royal-navy mb-6 relative z-10">
                  Beauty isn&apos;t about matching a stencil; it&apos;s about translating the inner architecture of a face into a physical masterpiece.
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-px bg-majestic-gold"></div>
                  <p className="text-royal-navy font-bold font-[family-name:var(--font-montserrat)] text-[13px] tracking-widest uppercase">
                    Erniekay, Founder & Creative Director
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>

        </div>
      </div>
    </section>
  );
}
