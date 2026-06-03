import Link from "next/link";

const experience = [
  { label: "Salon Services",   href: "/" },
  { label: "Bridal Artistry",  href: "/bridal" },
  { label: "Beauty Academy",   href: "/academy" },
];

const company = [
  { label: "Privacy Policy",  href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Careers",         href: "#" },
  { label: "Contact Us",      href: "#" },
];

export default function ShopFooter() {
  return (
    <footer className="bg-royal-navy w-full py-[112px]">
      <div className="max-w-[1280px] mx-auto px-6 md:px-[64px]">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 md:gap-6">
          {/* Brand */}
          <div className="flex flex-col gap-6 max-w-sm">
            <div className="font-[family-name:var(--font-eb-garamond)] text-[28px] leading-[36px] tracking-[-0.005em] font-semibold text-majestic-gold">
              Erniekay Splendor
            </div>
            <p className="font-[family-name:var(--font-montserrat)] text-[16px] leading-[26px] text-on-primary-container opacity-80">
              Redefining luxury through editorial excellence and bespoke beauty rituals. Professional
              training and clinical formulations for the discerning individual.
            </p>
            <div className="flex gap-4">
              {[
                { icon: "public",         label: "Website" },
                { icon: "camera_enhance", label: "Instagram" },
                { icon: "mail",           label: "Email" },
              ].map((s) => (
                <a
                  key={s.icon}
                  href="#"
                  aria-label={s.label}
                  className="text-on-primary hover:text-majestic-gold transition-colors"
                >
                  <span className="material-symbols-outlined">{s.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-12 md:gap-16">
            <div className="flex flex-col gap-4">
              <span className="font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold text-majestic-gold">
                Experience
              </span>
              {experience.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="font-[family-name:var(--font-montserrat)] text-[16px] leading-[26px] text-on-primary-container opacity-80 hover:text-majestic-gold hover:opacity-100 transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-4">
              <span className="font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold text-majestic-gold">
                Company
              </span>
              {company.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="font-[family-name:var(--font-montserrat)] text-[16px] leading-[26px] text-on-primary-container opacity-80 hover:text-majestic-gold hover:opacity-100 transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-[family-name:var(--font-montserrat)] text-[14px] leading-[22px] text-on-primary-container opacity-60">
            © 2024 Erniekay Splendor. All Rights Reserved.
          </div>
          <div className="flex gap-6">
            {["Visa", "Mastercard", "Amex"].map((method) => (
              <span
                key={method}
                className="font-[family-name:var(--font-montserrat)] text-[10px] leading-[16px] tracking-[0.15em] uppercase font-bold text-majestic-gold"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
