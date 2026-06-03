import Image from "next/image";

const makeupServices = [
  { icon: "star",            label: "Special Occasion Makeup",      price: "$150" },
  { icon: "camera_enhance",  label: "Editorial / Photoshoot",       price: "$250" },
  { icon: "school",          label: "Makeup Consultation & Class",  price: "$180" },
];

export default function MakeupSection() {
  return (
    <section id="makeup" className="bg-midnight-ink py-[64px] md:py-[112px] text-on-primary">
      <div className="max-w-[1280px] mx-auto px-6 md:px-[64px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          {/* Copy */}
          <div className="lg:col-span-4">
            <h2 className="font-[family-name:var(--font-eb-garamond)] text-[32px] md:text-[48px] leading-[40px] md:leading-[56px] tracking-[-0.01em] font-semibold mb-8">
              Professional Makeup
            </h2>
            <p className="font-[family-name:var(--font-montserrat)] text-[16px] leading-[26px] text-white/70 mb-10">
              From soft glam to high-fashion editorial, our makeup artists specialize in techniques
              that enhance your features while looking flawless under any lighting.
            </p>
            <ul className="space-y-6 mb-12">
              {makeupServices.map((svc) => (
                <li key={svc.icon} className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-majestic-gold">{svc.icon}</span>
                  <span className="font-[family-name:var(--font-montserrat)] text-[16px] leading-[26px] font-semibold">
                    {svc.label} — {svc.price}
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

          {/* Images — stacked on mobile, side-by-side on desktop */}
          <div className="lg:col-span-8 grid grid-cols-2 gap-4 mt-10 lg:mt-0">
            <div className="relative w-full h-60 md:h-[500px] border border-white/10 overflow-hidden">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKoK_Eqc80zH7pk7BtGiqgJ9Peo3ZBbbEUw9QfXhh_qR5AluvcHhXdW3Qr-pE5FqnEVQONfARhBb8UdIAeVQzGj6XHuo5Oudpn9mO_h5-_Oeyr4aEdGALW9WM4nOsFqddOkRdH2qiZ7ogJNJvRV9H0FEQBqde-G7SdSwj6Ld7IWRmU-3tKy5DWSN8PbrFcKILDj9sMkiZ1zmZOOr7lx0mMU088kepb-5REsG5OUk5yPAEoCwa9XqcA1mfBrDnLeoYOGRez2Ul-jNA"
                alt="A professional makeup palette with deep rich colors in a luxury studio"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="relative w-full h-60 md:h-[500px] border border-white/10 overflow-hidden md:mt-12">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGV9u9GjGmJPe0JZoQhTyQisW7egMmrBZllgJVaYdbi4oIwpP1I0aV1Feg88UTu2erTeEh8FASMmCYqJY27T-feWCLbA3dXkjHXCP2SWgWCy_vfMamz2O6q7TQnYNQ9jgtmgHiTaoUc7S0pzY1v-gBf1L3W42pLeXVc69YuZ_Ig1XbYGZ9slDCg4-6RvF1KBm2Ozvh3aQPGjpS5ucJXmikCYkE3wK8Fo1uEclDyjs7oEfOx3lZKOUqug2i88R2eYnSopRBGWWcOZk"
                alt="An artist's hand applying professional makeup to a model"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
