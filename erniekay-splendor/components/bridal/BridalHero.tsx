import Image from "next/image";

export default function BridalHero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background image + gradient */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA55FCD2W7Ay6UyOWxNJdTzTLxSisBlr6Ya4D4_LKQNEV4ZEQm641FUBHbXg89EKmZW79Yn3FU8lvEeJCqPVD1DhHoN6qzVtL2F-7yQ1u6NbmxgcmJalzH5l3Qt3U6YGdK8Wz6ULhwYIGzMRXwDF-3VKTvURSVzhlwBhD0C8Jho8zrxyJRuHAUfJ8MiEdptq_Ujh5V7R53d4b6pk7flwOI3fFfPTOPgp9lJanzkXtIQ2G18_iXcxRaSqrireFm6RQGtrNk5JKR4sGQ"
          alt="A radiant bride with flawless skin and intricate hairstyling in a luxurious bridal suite"
          fill
          className="object-cover"
          unoptimized
          priority
        />
        <div className="absolute inset-0 hero-gradient" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-[64px] w-full text-white">
        <div className="max-w-2xl py-20 md:py-0">
          <span className="font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.3em] uppercase text-majestic-gold block mb-4">
            Established Luxury
          </span>
          <h1 className="font-[family-name:var(--font-eb-garamond)] text-[42px] md:text-[64px] leading-tight font-semibold mb-6">
            Bridal Artistry:<br />Your Eternal Radiance
          </h1>
          <p className="font-[family-name:var(--font-montserrat)] text-[16px] md:text-[18px] leading-[28px] mb-10 text-white/80">
            From traditional elegance to modern splendor, our bespoke bridal services are designed
            to make your most beautiful moments timeless.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              id="bridal-hero-inquire"
              className="bg-majestic-gold text-royal-navy font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold px-10 py-4 hover:bg-white transition-colors active:scale-95"
            >
              Inquire Now
            </button>
            <button
              id="bridal-hero-gallery"
              className="border border-white text-white font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase px-10 py-4 hover:bg-white hover:text-primary transition-colors active:scale-95"
            >
              View Bridal Gallery
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
