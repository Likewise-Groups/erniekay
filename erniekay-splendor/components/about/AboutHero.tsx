import Image from "next/image";
import FadeIn from "@/components/FadeIn";

export default function AboutHero() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-royal-navy py-[112px]">
      {/* Background Subtle Overlay */}
      <div className="absolute inset-0 opacity-20">
        <Image
          className="w-full h-full object-cover"
          alt="Luxury studio setting showing professional lighting and editorial vanity setup"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7kSjuQrIZ1Q3-NEaa0WIXzvnmaUj5tunoZK28M04CZgZb7wUr6-NHrOUDRKiDb9vSbGGzkkbDvyIvjmYwX3ZuvkGmroPRz0qYSS42ShvafMfAOFHUoj-tBXKO0kUmsdCwVgK2_7Lr1tpzNhFkiR5yWv_ION0Edm5gKy0oLzYE22_JRnvOQek1ShvY2mIGxVuD9jajgR3J_ln1w4anPRexZTi9zBxlmmXW-k-oSoO64-Aw4J9iOigYdblun5B1djQavqDBv8yFfWc"
          fill
          priority
          sizes="100vw"
        />
      </div>
      <div className="relative max-w-[1280px] mx-auto px-6 md:px-[64px] text-center z-10">
        <FadeIn>
          <span className="font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold text-majestic-gold mb-4 block">
            The Visionaries
          </span>
          <h1 className="font-[family-name:var(--font-eb-garamond)] text-[48px] md:text-[56px] leading-[56px] font-semibold text-on-primary mb-8 max-w-4xl mx-auto">
            Clinical Precision. Artistic Soul.
          </h1>
          <p className="font-[family-name:var(--font-montserrat)] text-[18px] leading-[28px] text-on-primary-container max-w-3xl mx-auto opacity-90">
            Erniekay Splendor was founded on a simple yet uncompromising philosophy: that true beauty is realized when the precision of science meets the freedom of high-fashion art. We curate luxury transformations and train the next generation of global beauty leaders.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
