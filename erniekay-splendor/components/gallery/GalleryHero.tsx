import Image from "next/image";

export default function GalleryHero() {
  return (
    <header className="relative bg-midnight-ink text-on-primary py-[112px] overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <Image
          className="w-full h-full object-cover"
          alt="A cinematic, high-fashion close-up of professional makeup application in a luxury studio setting."
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7kSjuQrIZ1Q3-NEaa0WIXzvnmaUj5tunoZK28M04CZgZb7wUr6-NHrOUDRKiDb9vSbGGzkkbDvyIvjmYwX3ZuvkGmroPRz0qYSS42ShvafMfAOFHUoj-tBXKO0kUmsdCwVgK2_7Lr1tpzNhFkiR5yWv_ION0Edm5gKy0oLzYE22_JRnvOQek1ShvY2mIGxVuD9jajgR3J_ln1w4anPRexZTi9zBxlmmXW-k-oSoO64-Aw4J9iOigYdblun5B1djQavqDBv8yFfWc"
          fill
          priority
          sizes="100vw"
        />
      </div>
      <div className="relative max-w-[1280px] mx-auto px-6 md:px-[64px] text-center">
        <span className="font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold text-majestic-gold mb-4 block">
          PRESTIGE PORTFOLIO
        </span>
        <h1 className="font-[family-name:var(--font-eb-garamond)] text-[48px] md:text-[56px] leading-[56px] font-semibold mb-6">
          The Splendor Portfolio
        </h1>
        <p className="font-[family-name:var(--font-montserrat)] text-[16px] leading-[26px] text-on-primary-container max-w-2xl mx-auto opacity-90">
          A curated showcase of timeless beauty, clinical precision, and artistic soul. Explore the pinnacle of luxury artistry across our salon, bridal, and academy divisions.
        </p>
      </div>
    </header>
  );
}
