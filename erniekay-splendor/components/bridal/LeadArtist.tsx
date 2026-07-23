import Image from "next/image";

export default function LeadArtist() {
  return (
    <section className="py-[112px] bg-surface overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 md:px-[64px]">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* Image column */}
          <div className="lg:w-1/2 relative w-full">
            {/* Decorative corner accent */}
            <div className="absolute -top-10 -left-10 w-40 h-40 border-l-4 border-t-4 border-majestic-gold hidden md:block" />
            <div className="relative z-10 w-full h-[420px] md:h-[600px] overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQdlhlsFndsofgLHYo3P-i0y1uxzmirkDPWF5TorJ4xE5Ye26126KsC3OdyhFL23DbGWyV3EWD52yCHu-l0HWtKxgrt4JDLagYdXU84nFs061jh9CRsLWVmGl4HcqNtJ4DRVkgfNRhidKygkhGra45cy1XfPJoGpgSgkfEgpX6YlPIME2uQH1RKc4XpkeZ0WUFYFU0oZShe2MgXO7vFORfhy-DhbnloilNkOrTTOYrTALcC_q4nitXPLvY0CmfhA-P0t3xiH65RlI"
                alt="Lead Artist — a sophisticated woman in a modern beauty studio with gold and navy accents"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            {/* Years badge */}
            <div className="absolute -bottom-6 -right-6 bg-majestic-gold p-8 z-20">
              <p className="font-[family-name:var(--font-eb-garamond)] text-[40px] leading-[48px] font-semibold text-royal-navy">
                8+
              </p>
              <p className="font-[family-name:var(--font-montserrat)] text-[11px] leading-[16px] tracking-[0.15em] uppercase font-bold text-royal-navy">
                Years of Excellence
              </p>
            </div>
          </div>

          {/* Copy column */}
          <div className="lg:w-1/2 mt-8 lg:mt-0">
            <span className="font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.3em] uppercase text-majestic-gold block mb-4">
              The Visionary
            </span>
            <h2 className="font-[family-name:var(--font-eb-garamond)] text-[36px] md:text-[42px] leading-tight font-semibold text-primary mb-6">
              Meet Erniekay Splendor
            </h2>
            <p className="font-[family-name:var(--font-montserrat)] text-[16px] md:text-[18px] leading-[28px] text-on-surface-variant mb-6">
              With a career spanning over 8 years in international fashion and bridal artistry,
              Erniekay brings a unique editorial perspective to every bride she touches. Her
              philosophy is simple: makeup should enhance, never mask.
            </p>
            <p className="font-[family-name:var(--font-montserrat)] text-[16px] leading-[26px] text-on-surface-variant mb-10 italic">
              &ldquo;Every bride has a story. My role is to translate that story into a visual
              masterpiece that feels as good as it looks. We don&apos;t just apply makeup; we craft
              confidence.&rdquo;
            </p>

            {/* Credentials */}
            <div className="flex gap-8 items-center">
              <div>
                <p className="font-[family-name:var(--font-montserrat)] text-[16px] leading-[26px] font-semibold text-primary">
                  Certified Specialist
                </p>
                <p className="font-[family-name:var(--font-montserrat)] text-[14px] leading-[22px] text-on-surface-variant">
                  Global Beauty Academy
                </p>
              </div>
              <div className="w-px h-12 bg-outline-variant" />
              <div>
                <p className="font-[family-name:var(--font-montserrat)] text-[16px] leading-[26px] font-semibold text-primary">
                  Vogue Featured
                </p>
                <p className="font-[family-name:var(--font-montserrat)] text-[14px] leading-[22px] text-on-surface-variant">
                  Bridal Masterclass 2023
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
