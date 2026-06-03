import Link from "next/link";

const quickLinks = [
  { label: "Salon Services", href: "#" },
  { label: "Bridal Artistry", href: "#" },
  { label: "Beauty Academy", href: "#" },
  { label: "Career Opportunities", href: "#" },
];

const policyLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Salon Etiquette", href: "#" },
];

export default function Footer() {
  return (
    <footer className="w-full py-[112px] px-[64px] grid grid-cols-1 md:grid-cols-4 gap-6 bg-midnight-ink">
      {/* Brand */}
      <div className="flex flex-col gap-8">
        <div className="font-[family-name:var(--font-eb-garamond)] text-[28px] leading-[36px] font-semibold text-majestic-gold">
          ERNIEKAY SPLENDOR
        </div>
        <p className="font-[family-name:var(--font-montserrat)] text-[16px] leading-[26px] text-surface-variant">
          Elevating beauty through precision, artistry, and editorial excellence.
        </p>
      </div>

      {/* Quick Links */}
      <div>
        <h5 className="text-on-primary font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold mb-6">
          Quick Links
        </h5>
        <ul className="flex flex-col gap-4">
          {quickLinks.map((l) => (
            <li key={l.label}>
              <Link
                href={l.href}
                className="text-surface-variant hover:text-majestic-gold transition-colors font-[family-name:var(--font-montserrat)] text-[16px] leading-[26px]"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Policy */}
      <div>
        <h5 className="text-on-primary font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold mb-6">
          Policy
        </h5>
        <ul className="flex flex-col gap-4">
          {policyLinks.map((l) => (
            <li key={l.label}>
              <Link
                href={l.href}
                className="text-surface-variant hover:text-majestic-gold transition-colors font-[family-name:var(--font-montserrat)] text-[16px] leading-[26px]"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Connect */}
      <div>
        <h5 className="text-on-primary font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold mb-6">
          Connect
        </h5>
        <div className="flex gap-4 mb-6">
          <a
            href="#"
            id="footer-social-web"
            className="w-10 h-10 border border-white/20 flex items-center justify-center text-white hover:border-majestic-gold hover:text-majestic-gold transition-all"
            aria-label="Website"
          >
            <span className="material-symbols-outlined">public</span>
          </a>
          <a
            href="#"
            id="footer-social-email"
            className="w-10 h-10 border border-white/20 flex items-center justify-center text-white hover:border-majestic-gold hover:text-majestic-gold transition-all"
            aria-label="Email"
          >
            <span className="material-symbols-outlined">mail</span>
          </a>
        </div>
        <p className="text-surface-variant font-[family-name:var(--font-montserrat)] text-[10px] leading-[16px] tracking-[0.15em]">
          © 2024 Erniekay Splendor. All rights reserved. Timeless Editorial Elegance.
        </p>
      </div>
    </footer>
  );
}
