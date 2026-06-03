import Image from "next/image";
import Link from "next/link";

export default function AcademyHero() {
  return (
    <section className="relative h-[80vh] flex items-center overflow-hidden bg-royal-navy">
      {/* Background image */}
      <div className="absolute inset-0 opacity-40">
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDC4JazpJCdG1rjirZUUP9lIEbNWP0R2dN9XMVAjXg2aFCmG8US3lA-dKgpPB33DC-w6OJVggHLtQzCj5FO_AzLP0bIFZCwer3Xczt_89VoqNzum9mWKi00safjEmotPOtxSsQUa3hbzHgbGXGTI0lWlzfqpWZ_ekSrT1dsYHarAnfUYI1vd82D3cgwQCmUqJ04CiuWdf9ZFZGyP0BuSnZWnniDvnjxCzucWdLN3QiA-F8wEiCXnNbAtx5E2kDB29kNsQ4ri5xrz54"
          alt="Professional beauty educator demonstrating makeup technique in a luxury studio"
          fill
          className="object-cover"
          unoptimized
          priority
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-[64px] w-full">
        <div className="max-w-2xl">
          <span className="font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.3em] uppercase text-majestic-gold mb-6 block">
            Elite Professional Training
          </span>
          <h1 className="font-[family-name:var(--font-eb-garamond)] text-[40px] md:text-[48px] leading-tight tracking-[-0.01em] font-semibold text-white mb-8">
            Master the Art<br />of Beauty
          </h1>
          <p className="font-[family-name:var(--font-montserrat)] text-[16px] leading-[26px] text-white/80 mb-10 max-w-lg">
            Step into a world of artistic rigor and technical mastery. Our academy provides the
            architectural foundation for your career in high-end bridal and editorial beauty.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <button
              id="academy-hero-browse"
              className="bg-majestic-gold text-royal-navy px-10 py-4 font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold hover:bg-white transition-colors active:scale-[0.98]"
            >
              Browse Courses
            </button>
            <button
              id="academy-hero-syllabus"
              className="border border-white text-white px-10 py-4 font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase hover:bg-white hover:text-royal-navy transition-all active:scale-[0.98]"
            >
              Our Syllabus
            </button>
          </div>
          <div>
            <Link
              href="/academy/portal"
              className="inline-block font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold text-majestic-gold hover:text-white underline transition-colors"
            >
              Existing Student? Sign in to Portal &rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
