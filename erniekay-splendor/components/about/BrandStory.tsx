import Image from "next/image";
import FadeIn from "@/components/FadeIn";

export default function BrandStory() {
  return (
    <section className="py-[112px] bg-alabaster-white overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 md:px-[64px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text Content */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <FadeIn>
              <span className="font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold text-champagne-taupe">
                Our Story
              </span>
              <h2 className="font-[family-name:var(--font-eb-garamond)] text-[36px] md:text-[44px] leading-[44px] md:leading-[52px] font-semibold text-royal-navy mt-2 mb-6">
                From a Private Studio to an Editorial Powerhouse
              </h2>
              <div className="flex flex-col gap-4 font-[family-name:var(--font-montserrat)] text-[16px] leading-[26px] text-warm-slate">
                <p>
                  Founded by Erniekay, a visionary master artist obsessed with detail and symmetry, the brand was born from a desire to elevate salon standards to the level of global runways. We believed that clients shouldn&apos;t have to choose between a clinically precise application and a soul-stirring, artistic creation.
                </p>
                <p>
                  Today, Erniekay Splendor spans three distinct yet interconnected divisions: our luxury salon boutique, our bridal artistry service, and our prestigious beauty academy. Each branch operates on the same baseline value: uncompromising quality, premium inputs, and editorial-grade aesthetics.
                </p>
                <p className="border-l-2 border-majestic-gold pl-6 italic font-[family-name:var(--font-eb-garamond)] text-[20px] leading-[30px] text-royal-navy my-4 font-medium">
                  &ldquo;Beauty isn&apos;t about matching a stencil; it&apos;s about translating the inner architecture of a face into a physical masterpiece.&rdquo;
                </p>
                <p className="text-royal-navy font-bold text-[14px]">
                  — Erniekay, Founder & Creative Director
                </p>
              </div>
            </FadeIn>
          </div>

          {/* Asymmetric Image Wrapper */}
          <div className="lg:col-span-6 relative flex justify-center">
            <FadeIn delay={200} className="w-full">
              <div className="relative w-full aspect-[4/5] max-w-[500px] overflow-hidden group shadow-xl">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqIQhO4eWVSmS4wioFQ7VQZ9NgDCw-tmKvgESR_7Q4rUMLG7Dps05Rp_zqwvkzfJ6JuSRAk2nRFJvUxzpEVSO9Fj57jC-VuaGLHBEskWClH02mwZ3nEf35beCvnO-12W2d_F9o1MXocHKioMSFymUZCLSDursPHetI8jws2MtzIHKkCmtKQFFfla-YIR6CNJDYg1dMO2iqD7GZxNMTG4fkDlkJTP8iQh4A1AKEPO6BHtONTgid_9AmVlBg8xbLvrhzu7iPtCRqgvg"
                  alt="Founder Erniekay at work applying custom editorial detailing"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-w-1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 border border-majestic-gold/30 m-4 pointer-events-none transition-all duration-500 group-hover:m-6" />
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
