import Image from "next/image";

/* ─── Types ─────────────────────────────────────────────────── */
interface ServiceCardProps {
  id: string;
  tag: string;
  price: string;
  title: string;
  description: string;
}

/* ─── Desktop service card ───────────────────────────────────── */
function DesktopServiceCard({ id, tag, price, title, description }: ServiceCardProps) {
  return (
    <div className="group border border-outline-variant p-8 hover:border-majestic-gold transition-all duration-500 bg-white">
      <div className="flex justify-between items-start mb-6">
        <span className="font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] font-bold uppercase text-champagne-taupe">
          {tag}
        </span>
        <span className="font-[family-name:var(--font-eb-garamond)] text-[28px] leading-[36px] tracking-[-0.005em] font-semibold text-royal-navy">
          {price}
        </span>
      </div>
      <h3 className="font-[family-name:var(--font-eb-garamond)] text-[28px] leading-[36px] tracking-[-0.005em] font-semibold text-royal-navy mb-4">
        {title}
      </h3>
      <p className="font-[family-name:var(--font-montserrat)] text-[16px] leading-[26px] text-on-surface-variant mb-8 h-20">
        {description}
      </p>
      <button
        id={id}
        className="w-full py-4 border border-royal-navy text-royal-navy font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold hover:bg-royal-navy hover:text-white transition-all"
      >
        Book Appointment
      </button>
    </div>
  );
}

/* ─── Mobile simple card ─────────────────────────────────────── */
function MobileServiceCard({
  id,
  title,
  price,
  description,
}: {
  id: string;
  title: string;
  price: string;
  description: string;
}) {
  return (
    <div className="bg-surface border border-outline-variant p-6 hover:border-majestic-gold transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <h4 className="font-[family-name:var(--font-eb-garamond)] text-[28px] leading-[36px] tracking-[-0.005em] font-semibold text-royal-navy leading-tight">
          {title}
        </h4>
        <span className="font-[family-name:var(--font-montserrat)] text-[16px] leading-[26px] font-bold text-royal-navy">
          {price}
        </span>
      </div>
      <p className="font-[family-name:var(--font-montserrat)] text-[14px] leading-[22px] text-on-surface-variant mb-6">
        {description}
      </p>
      <button
        id={`mobile-${id}`}
        className="w-full border border-royal-navy text-royal-navy font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold py-3 hover:bg-royal-navy hover:text-on-primary transition-colors"
      >
        Book Appointment
      </button>
    </div>
  );
}

/* ─── Data ───────────────────────────────────────────────────── */
const hairServices = [
  {
    id: "signature-haircut",
    tag: "Precision",
    price: "$125+",
    title: "Signature Haircut",
    description:
      "Includes a personalized consultation, detoxing wash, and a signature runway blowout.",
  },
  {
    id: "gloss-renewal",
    tag: "Revitalize",
    price: "$95+",
    title: "Gloss & Renewal",
    description:
      "High-shine semi-permanent treatment to refresh tone and add clinical-grade hydration.",
  },
  {
    id: "silk-press",
    tag: "Structure",
    price: "$150+",
    title: "Silk Press Ritual",
    description:
      "Precision thermal straightening that maintains hair health and provides mirror-like shine.",
  },
  {
    id: "keratin-infusion",
    tag: "Structure",
    price: "$400",
    title: "Keratin Infusion",
    description:
      "Smoothing treatment that eliminates frizz and enhances shine for up to 5 months of effortless hair.",
  },
  {
    id: "editorial-updo",
    tag: "Event",
    price: "$150",
    title: "Editorial Updo",
    description:
      "High-fashion hair styling for events, galas, or special evenings. Custom designed for your look.",
  },
];

/* ─── Component ──────────────────────────────────────────────── */
export default function HairSection() {
  return (
    <section id="hair" className="bg-background">
      {/* ══════════════════════════════════════════════════════════
          MOBILE LAYOUT
      ══════════════════════════════════════════════════════════ */}
      <div className="md:hidden">
        {/* Featured Service Card */}
        <div className="p-6 bg-alabaster-white">
          <div className="bg-surface border border-outline-variant overflow-hidden">
            {/* Portrait image */}
            <div className="relative aspect-[4/5] w-full">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_ykfQsTr1L__1MAvtB2fWbfMHGZFGg9TsOWKK3EKsNaDXaS5QGNNgJgBxSeAkJUc2JWgPZKGuAs44ehHjL5x-jPsIM_4PWyM4AQKtRZAuIZyWUKPfSuVZzqb4BZr_2txXEq8e1hnrcDXUO6YGUAkvtgktFSFXHpYCE99qp84-stbKsygNR5YwpyIbqUiBkxQclWXzFyTplYqIM89EvoWQKay2QS6xcOg9YRLMEttxSZjnDHlxcjH8yEb6EBf31AfyuL7yBtRJXp4"
                alt="Couture Balayage — Editor's Choice hair service"
                fill
                className="object-cover"
                unoptimized
              />
              {/* Gradient overlay */}
              <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/70 to-transparent">
                <span className="bg-majestic-gold text-royal-navy text-[10px] font-bold px-2 py-1 uppercase tracking-tighter inline-block mb-2">
                  Editor&apos;s Choice
                </span>
                <h2 className="text-white font-[family-name:var(--font-eb-garamond)] text-[28px] leading-[36px] font-semibold">
                  Couture Balayage
                </h2>
              </div>
            </div>
            {/* Card body */}
            <div className="p-6">
              <p className="font-[family-name:var(--font-montserrat)] text-[14px] leading-[22px] text-on-surface-variant mb-6">
                A signature hand-painted technique creating natural, sun-kissed dimension tailored
                to your hair&apos;s natural flow and skin tone.
              </p>
              <div className="flex justify-between items-end">
                <div>
                  <span className="font-[family-name:var(--font-montserrat)] text-[10px] leading-[16px] tracking-[0.15em] uppercase font-bold text-champagne-taupe block">
                    Investment
                  </span>
                  <span className="font-[family-name:var(--font-eb-garamond)] text-[28px] leading-[36px] font-semibold text-royal-navy">
                    From $350
                  </span>
                </div>
                <button
                  id="mobile-couture-balayage"
                  className="bg-royal-navy text-majestic-gold font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold px-6 py-3 border border-majestic-gold"
                >
                  Select Service
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Essential Rituals Grid */}
        <div className="px-6 pb-[64px]">
          <div className="mb-10 mt-10 relative">
            {/* Editorial underline decoration */}
            <h3 className="font-[family-name:var(--font-eb-garamond)] text-[28px] leading-[36px] font-semibold text-royal-navy mb-2 pb-3 relative after:absolute after:bottom-0 after:left-0 after:w-10 after:h-px after:bg-majestic-gold">
              Essential Rituals
            </h3>
            <p className="font-[family-name:var(--font-montserrat)] text-[14px] leading-[22px] text-on-surface-variant mt-6">
              Elevated basics for the modern professional.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {hairServices.slice(0, 3).map((svc) => (
              <MobileServiceCard key={svc.id} {...svc} />
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          DESKTOP LAYOUT
      ══════════════════════════════════════════════════════════ */}
      <div className="hidden md:block py-[112px] max-w-[1280px] mx-auto px-[64px]">
        {/* Section Header */}
        <div className="grid grid-cols-12 gap-6 items-end mb-16">
          <div className="col-span-5">
            <h2 className="font-[family-name:var(--font-eb-garamond)] text-[48px] leading-[56px] tracking-[-0.01em] font-semibold text-royal-navy mb-4">
              Hair Artistry
            </h2>
            <p className="font-[family-name:var(--font-montserrat)] text-[16px] leading-[26px] text-on-surface-variant">
              Precision cutting and editorial color techniques tailored to your lifestyle and hair
              texture.
            </p>
          </div>
          <div className="col-span-7 h-px bg-outline-variant mb-4" />
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-3 gap-8 mb-20">
          {/* First standard card */}
          <DesktopServiceCard {...hairServices[0]} />

          {/* Featured Card — spans 2 rows */}
          <div className="row-span-2 group relative overflow-hidden bg-midnight-ink text-white p-8 border border-majestic-gold">
            <div className="absolute inset-0 opacity-20 group-hover:scale-110 transition-transform duration-1000">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA35lBRGVMx2VSKFW7D8qK6ZaWxlbPki7_g6PA6ZEFvNWTCdt1ZKapiSm57mTbrjJmtBnfQy6zxDNHEGJJ-Jf4HRICO2ZnBOVsMlmwMI4qt4hEwXpApfgWQZy1IAtIWZESL-DwoBXPdraMflyPQebY0nnCFLm5LLHwpJSanhpP_ZBDpC_wiA_u3zke1NGk0xBG_NgyrpsjNY4E8syHlCpKtdPkFMjRi9Ib5nMKNjvW3bPnqpiQvohL9Mzf09hRdpcxvE5eebs8i9Vc"
                alt="Luxurious honey-blonde balayage hair with soft editorial waves"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="relative z-10 h-full flex flex-col justify-between min-h-[420px]">
              <div>
                <span className="inline-block px-3 py-1 bg-majestic-gold text-royal-navy font-[family-name:var(--font-montserrat)] text-[10px] uppercase font-bold tracking-widest mb-6">
                  Most Requested
                </span>
                <h3 className="font-[family-name:var(--font-eb-garamond)] text-[36px] leading-[44px] font-semibold mb-4">
                  Couture Balayage
                </h3>
                <p className="font-[family-name:var(--font-montserrat)] text-[16px] leading-[26px] text-white/80 mb-6">
                  Hand-painted highlights designed to grow out seamlessly. Includes toner and deep
                  conditioning.
                </p>
              </div>
              <div>
                <span className="block text-majestic-gold font-[family-name:var(--font-eb-garamond)] text-[48px] leading-[56px] font-semibold mb-6">
                  From $350
                </span>
                <button
                  id="couture-balayage"
                  className="w-full py-4 bg-majestic-gold text-royal-navy font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold hover:bg-white transition-all"
                >
                  Select Service
                </button>
              </div>
            </div>
          </div>

          {/* Remaining standard cards */}
          {hairServices.slice(1, 3).map((s) => (
            <DesktopServiceCard key={s.id} {...s} />
          ))}
          {hairServices.slice(3).map((s) => (
            <DesktopServiceCard key={s.id} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}
