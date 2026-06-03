import Link from "next/link";

const tabs = [
  { icon: "content_cut",  label: "Services", href: "/",        active: false },
  { icon: "auto_fix_high",label: "Bridal",   href: "/bridal",  active: false },
  { icon: "shopping_bag", label: "Shop",     href: "/shop",    active: true  },
  { icon: "person",       label: "Account",  href: "#",        active: false },
];

export default function MobileBottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-surface-bright border-t border-outline-variant z-50 flex justify-around items-center h-16">
      {tabs.map((tab) => (
        <Link
          key={tab.label}
          href={tab.href}
          className={`flex flex-col items-center gap-1 ${
            tab.active ? "text-royal-navy" : "text-warm-slate"
          }`}
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={tab.active ? { fontVariationSettings: "'FILL' 1" } : undefined}
          >
            {tab.icon}
          </span>
          <span className="font-[family-name:var(--font-montserrat)] text-[10px] leading-[14px] tracking-[0.15em] uppercase font-bold">
            {tab.label}
          </span>
        </Link>
      ))}
    </nav>
  );
}
