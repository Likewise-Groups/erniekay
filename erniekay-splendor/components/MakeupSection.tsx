import Image from "next/image";

const makeupServices = [
  { icon: "star",            label: "Special Occasion Makeup",      price: "$150" },
  { icon: "camera_enhance",  label: "Editorial / Photoshoot",       price: "$250" },
  { icon: "school",          label: "Makeup Consultation & Class",  price: "$180" },
];

const gallery = [
  { src: "/makeup.jpg",  alt: "Soft glam editorial makeup look" },
  { src: "/makeup2.jpg", alt: "Bold occasion makeup with curls" },
  { src: "/makeUP3.jpg", alt: "Smiling client in full glam makeover" },
  { src: "/makeup4.jpg", alt: "Bridal soft glam with sculpted eyes" },
  { src: "/makeup5.jpg", alt: "Traditional bridal makeup and gele" },
];

export default function MakeupSection() {
  return (
    <section id="makeup" className="bg-midnight-ink py-[64px] md:py-[112px] text-on-primary overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 md:px-[64px]">
        {/* Section header */}
        <div className="max-w-2xl mb-10 md:mb-16">
          <span className="font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold text-majestic-gold mb-4 block">
            Editorial &amp; Glam
          </span>
          <h2 className="font-[family-name:var(--font-eb-garamond)] text-[32px] md:text-[56px] leading-[40px] md:leading-[60px] tracking-[-0.01em] font-semibold mb-6">
            Professional Makeup
          </h2>
          <p className="font-[family-name:var(--font-montserrat)] text-[16px] leading-[26px] text-white/70">
            From soft glam to high-fashion editorial, our makeup artists specialize in techniques
            that enhance your features while looking flawless under any lighting.
          </p>
        </div>

        {/* Main video showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Hero video */}
          <div className="lg:col-span-7 group relative rounded-2xl overflow-hidden ring-1 ring-white/10 aspect-[16/10] lg:aspect-auto lg:min-h-[520px]">
            <video
              className="absolute inset-0 w-full h-full object-cover object-[center_20%] scale-150"
              src="/makeupv.mp4"
              autoPlay
              loop
              muted
              playsInline
              poster="/makeup.jpg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-midnight-ink/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 md:p-8">
              <span className="font-[family-name:var(--font-montserrat)] text-[11px] leading-[16px] tracking-[0.15em] uppercase font-bold text-majestic-gold mb-2 block">
                Behind the Brush
              </span>
              <h3 className="font-[family-name:var(--font-eb-garamond)] text-[24px] md:text-[32px] leading-[32px] md:leading-[40px] font-semibold">
                The Erniekay Glow
              </h3>
            </div>
          </div>

          {/* Copy + services + secondary video */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="relative rounded-2xl overflow-hidden ring-1 ring-white/10 aspect-[16/10]">
              <video
                className="absolute inset-0 w-full h-full object-cover"
                src="/makeupv1.mp4"
                autoPlay
                loop
                muted
                playsInline
                poster="/makeup2.jpg"
              />
            </div>

            <ul className="space-y-5">
              {makeupServices.map((svc) => (
                <li key={svc.icon} className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <span className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-majestic-gold">{svc.icon}</span>
                    <span className="font-[family-name:var(--font-montserrat)] text-[15px] leading-[24px] font-semibold">
                      {svc.label}
                    </span>
                  </span>
                  <span className="font-[family-name:var(--font-eb-garamond)] text-[20px] font-semibold text-majestic-gold shrink-0">
                    {svc.price}
                  </span>
                </li>
              ))}
            </ul>

            <button
              id="book-makeup-artist"
              className="bg-majestic-gold text-royal-navy px-8 py-4 font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold w-full hover:bg-white transition-all"
            >
              Book Makeup Artist
            </button>
          </div>
        </div>

        {/* Gallery strip */}
        <div className="mt-10 md:mt-12">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {gallery.map((img) => (
              <div
                key={img.src}
                className="group relative aspect-[3/4] rounded-xl overflow-hidden ring-1 ring-white/10"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-midnight-ink/0 group-hover:bg-midnight-ink/20 transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
