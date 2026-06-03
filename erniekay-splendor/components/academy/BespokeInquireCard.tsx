"use client";

import Link from "next/link";

interface BespokeInquireCardProps {
  onInquire?: () => void;
}

export default function BespokeInquireCard({ onInquire }: BespokeInquireCardProps) {
  return (
    <div className="border-2 border-dashed border-outline-variant p-8 flex flex-col items-center justify-center text-center group hover:border-majestic-gold transition-all duration-300 bg-white/30">
      <span
        className="material-symbols-outlined text-outline group-hover:text-majestic-gold mb-4 transition-colors"
        style={{ fontSize: "48px" }}
      >
        auto_awesome
      </span>

      <h3 className="font-headline-md text-headline-md text-royal-navy mb-2">
        Bespoke Curriculum
      </h3>

      <p className="text-sm text-on-surface-variant mb-6 max-w-[240px]">
        Work directly with our academic board to tailor a program for your
        specific brand or career goals.
      </p>

      <button
        onClick={onInquire}
        className="text-royal-navy font-label-caps text-label-caps border-b border-royal-navy pb-1 hover:text-majestic-gold hover:border-majestic-gold transition-all"
      >
        Inquire Privately
      </button>
    </div>
  );
}
