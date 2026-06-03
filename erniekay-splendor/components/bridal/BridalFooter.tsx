import Link from "next/link";

const services = [
  { label: "Bridal Packages", href: "/bridal" },
  { label: "Academy Courses", href: "/academy" },
  { label: "Editorial Styling", href: "#" },
  { label: "Salon Bookings", href: "/" },
];

const resources = [
  { label: "Bridal Guide", href: "#" },
  { label: "Academy Enrollment", href: "/academy" },
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
];

export default function BridalFooter() {
  return (
    <footer className="bg-primary py-[112px]">
      <div className="max-w-[1280px] mx-auto px-6 md:px-[64px]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6 mb-20">

          {/* Brand */}
          <div className="md:col-span-1">
            <p className="font-[family-name:var(--font-eb-garamond)] text-[48px] leading-[56px] tracking-[-0.01em] font-semibold text-majestic-gold mb-6">
              Erniekay Splendor
            </p>
            <p className="font-[family-name:var(--font-montserrat)] text-[16px] leading-[26px] text-on-primary-container mb-8">
              Redefining bridal beauty through clinical precision and editorial artistry.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                id="footer-social-camera"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full border border-on-primary-container flex items-center justify-center text-on-primary-container hover:text-majestic-gold hover:border-majestic-gold transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">camera</span>
              </a>
              <a
                href="#"
                id="footer-social-brand"
                aria-label="Brand awareness"
                className="w-10 h-10 rounded-full border border-on-primary-container flex items-center justify-center text-on-primary-container hover:text-majestic-gold hover:border-majestic-gold transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">brand_awareness</span>
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h6 className="font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold text-majestic-gold mb-8">
              Services
            </h6>
            <ul className="space-y-4">
              {services.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="font-[family-name:var(--font-montserrat)] text-[11px] leading-[16px] tracking-[0.15em] uppercase font-bold text-on-primary-container hover:text-majestic-gold transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h6 className="font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold text-majestic-gold mb-8">
              Resources
            </h6>
            <ul className="space-y-4">
              {resources.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="font-[family-name:var(--font-montserrat)] text-[11px] leading-[16px] tracking-[0.15em] uppercase font-bold text-on-primary-container hover:text-majestic-gold transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h6 className="font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold text-majestic-gold mb-8">
              Contact
            </h6>
            <ul className="space-y-4">
              {[
                { icon: "mail",        text: "hello@erniekay.com" },
                { icon: "call",        text: "+1 (555) 012-3456" },
                { icon: "location_on", text: "12 Luxury Row, Mayfair" },
              ].map((item) => (
                <li key={item.icon} className="flex items-center gap-3 font-[family-name:var(--font-montserrat)] text-[14px] leading-[22px] text-on-primary-container">
                  <span className="material-symbols-outlined text-majestic-gold text-[18px]">
                    {item.icon}
                  </span>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] text-on-primary-container">
            © 2024 Erniekay Splendor. All Rights Reserved.
          </p>
          <div className="flex items-center gap-8 font-[family-name:var(--font-montserrat)] text-[10px] leading-[16px] tracking-[0.2em] uppercase text-primary-fixed-dim">
            <span>Crafting Confidence</span>
            <span className="text-majestic-gold">•</span>
            <span>Inspiring Radiance</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
