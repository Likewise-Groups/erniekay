"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

interface SideNavItem {
  label: string;
  icon: string;
  href: string;
  step: "selection" | "personal" | "professional" | "review";
}

const items: SideNavItem[] = [
  {
    label: "Selection",
    icon: "check_circle",
    href: "/academy/admissions/selection",
    step: "selection",
  },
  {
    label: "Personal",
    icon: "person",
    href: "/academy/admissions/personal",
    step: "personal",
  },
  {
    label: "Professional",
    icon: "school",
    href: "/academy/admissions/professional",
    step: "professional",
  },
  {
    label: "Review",
    icon: "description",
    href: "/academy/admissions/review",
    step: "review",
  },
];

interface AdmissionsSideNavProps {
  currentStep?: "selection" | "personal" | "professional" | "review";
}

export default function AdmissionsSideNav({ currentStep = "selection" }: AdmissionsSideNavProps) {
  return (
    <aside className="hidden lg:flex flex-col h-screen sticky top-[80px] bg-surface-container-low dark:bg-surface-container-lowest h-full w-64 border-r border-outline-variant py-8">
      <div className="px-6 mb-10">
        <h2 className="font-headline-md text-headline-md text-royal-navy">
          Admissions Flow
        </h2>
        <p className="text-on-surface-variant text-sm mt-1">Academy Intake 2024</p>
      </div>

      <nav className="flex-grow space-y-1">
        {items.map((item) => {
          const isActive = currentStep === item.step;
          return (
            <Link
              key={item.step}
              href={item.href}
              className={`
                pl-5 py-4 flex items-center gap-3 transition-colors
                ${
                  isActive
                    ? "text-royal-navy dark:text-majestic-gold font-bold border-l-4 border-majestic-gold pl-4 bg-white/50"
                    : "text-on-surface-variant dark:text-outline-variant hover:bg-surface-variant dark:hover:bg-on-surface-variant cursor-pointer"
                }
              `}
            >
              <span
                className={`material-symbols-outlined ${isActive ? "text-majestic-gold" : ""}`}
                data-icon={item.icon}
              >
                {item.icon}
              </span>
              <span className="font-body-base text-body-base">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6">
        <button className="w-full py-3 border border-royal-navy text-royal-navy font-label-caps text-label-caps hover:bg-royal-navy hover:text-white transition-all">
          Save Draft
        </button>
      </div>
    </aside>
  );
}
