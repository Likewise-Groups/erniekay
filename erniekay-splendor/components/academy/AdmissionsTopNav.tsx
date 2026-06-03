"use client";

import Link from "next/link";
import Image from "next/image";

export default function AdmissionsTopNav() {
  return (
    <nav className="bg-background dark:bg-inverse-surface border-b border-outline-variant dark:border-on-surface-variant flex justify-between items-center px-margin-desktop py-4 max-w-[1280px] mx-auto w-full z-50 sticky top-0">
      <Link href="/academy" className="hover:opacity-80 transition-opacity">
        <Image
          src="/erniekayacademy logo.jpeg"
          alt="Erniekay School of Beauty Arts"
          width={120}
          height={60}
          priority
          className="h-auto w-auto max-h-16"
        />
      </Link>
      
      <div className="hidden md:flex gap-8 items-center">
        <Link
          href="/academy/programs"
          className="text-on-surface-variant dark:text-outline-variant hover:text-majestic-gold transition-colors duration-300 font-label-caps text-label-caps"
        >
          Programs
        </Link>
        <Link
          href="/academy"
          className="text-on-surface-variant dark:text-outline-variant hover:text-majestic-gold transition-colors duration-300 font-label-caps text-label-caps"
        >
          Academy
        </Link>
        <Link
          href="/academy/admissions"
          className="text-royal-navy dark:text-majestic-gold border-b-2 border-majestic-gold pb-1 font-label-caps text-label-caps"
        >
          Admissions
        </Link>
        <Link
          href="/bridal"
          className="text-on-surface-variant dark:text-outline-variant hover:text-majestic-gold transition-colors duration-300 font-label-caps text-label-caps"
        >
          Bespoke
        </Link>
      </div>
      
      <button className="bg-royal-navy text-majestic-gold border border-majestic-gold px-6 py-3 font-label-caps text-label-caps hover:opacity-90 active:scale-95 transition-all">
        Enrol Now
      </button>
    </nav>
  );
}
