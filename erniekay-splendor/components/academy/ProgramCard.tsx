"use client";

import Image from "next/image";

export interface ProgramOption {
  id: string;
  level: string;
  title: string;
  duration: number;
  certification: string;
  highlights: string[];
  facultyLead: {
    name: string;
    image: string;
    imageAlt: string;
  };
  isFeatured?: boolean;
  badge?: string;
}

interface ProgramCardProps {
  program: ProgramOption;
  isSelected: boolean;
  onSelect: (programId: string) => void;
}

export default function ProgramCard({
  program,
  isSelected,
  onSelect,
}: ProgramCardProps) {
  const handleCardClick = () => {
    onSelect(program.id);
  };

  if (program.isFeatured) {
    return (
      <div
        onClick={handleCardClick}
        className="bg-white border-2 border-majestic-gold p-8 group shadow-[0_10px_30px_-15px_rgba(255,212,0,0.15)] relative cursor-pointer hover:shadow-[0_15px_40px_-10px_rgba(255,212,0,0.25)] transition-all duration-300"
      >
        {program.badge && (
          <div className="absolute top-4 right-4 bg-majestic-gold text-royal-navy px-3 py-1 font-label-caps text-[10px] tracking-widest">
            {program.badge}
          </div>
        )}

        <span className="font-label-caps text-label-caps text-champagne-taupe block mb-4">
          {program.level}
        </span>

        <h3 className="font-headline-md text-headline-md text-royal-navy mb-6">
          {program.title}
        </h3>

        <div className="flex items-center gap-6 mb-8 text-sm text-on-surface-variant">
          <div className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-majestic-gold"
              style={{ fontSize: "18px" }}
            >
              schedule
            </span>
            <span>{program.duration} Weeks</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-majestic-gold"
              style={{ fontSize: "18px" }}
            >
              workspace_premium
            </span>
            <span>{program.certification}</span>
          </div>
        </div>

        <div className="mb-8">
          <h4 className="font-body-bold text-body-bold text-royal-navy mb-3">
            Syllabus Highlights
          </h4>
          <ul className="space-y-2 text-sm text-on-surface-variant">
            {program.highlights.map((highlight, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-majestic-gold rounded-full"></span>
                {highlight}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-royal-navy overflow-hidden rounded">
              <img
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all"
                alt={program.facultyLead.imageAlt}
                src={program.facultyLead.image}
              />
            </div>
            <div>
              <p className="text-[10px] font-label-caps text-champagne-taupe">
                FACULTY LEAD
              </p>
              <p className="text-sm font-body-bold text-royal-navy">
                {program.facultyLead.name}
              </p>
            </div>
          </div>
          <input
            type="radio"
            name="program"
            checked={isSelected}
            onChange={handleCardClick}
            className="w-6 h-6 border-majestic-gold text-royal-navy focus:ring-majestic-gold cursor-pointer"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleCardClick}
      className={`bg-white border p-8 group relative cursor-pointer transition-all duration-500 overflow-hidden ${
        isSelected
          ? "border-majestic-gold shadow-[0_10px_30px_-15px_rgba(255,212,0,0.15)]"
          : "border-outline-variant hover:border-majestic-gold"
      }`}
    >
      <div
        className={`absolute top-0 right-0 w-24 h-24 -rotate-45 translate-x-12 -translate-y-12 transition-transform ${
          isSelected ? "bg-majestic-gold/10" : "bg-royal-navy/5 group-hover:bg-majestic-gold/10"
        }`}
      ></div>

      <span className="font-label-caps text-label-caps text-champagne-taupe block mb-4">
        {program.level}
      </span>

      <h3 className="font-headline-md text-headline-md text-royal-navy mb-6">
        {program.title}
      </h3>

      <div className="flex items-center gap-6 mb-8 text-sm text-on-surface-variant">
        <div className="flex items-center gap-2">
          <span
            className="material-symbols-outlined text-majestic-gold"
            style={{ fontSize: "18px" }}
          >
            schedule
          </span>
          <span>{program.duration} Weeks</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="material-symbols-outlined text-majestic-gold"
            style={{ fontSize: "18px" }}
          >
            workspace_premium
          </span>
          <span>{program.certification}</span>
        </div>
      </div>

      <div className="mb-8">
        <h4 className="font-body-bold text-body-bold text-royal-navy mb-3">
          Syllabus Highlights
        </h4>
        <ul className="space-y-2 text-sm text-on-surface-variant">
          {program.highlights.map((highlight, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-majestic-gold rounded-full"></span>
              {highlight}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-royal-navy overflow-hidden rounded">
            <img
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all"
              alt={program.facultyLead.imageAlt}
              src={program.facultyLead.image}
            />
          </div>
          <div>
            <p className="text-[10px] font-label-caps text-champagne-taupe">
              FACULTY LEAD
            </p>
            <p className="text-sm font-body-bold text-royal-navy">
              {program.facultyLead.name}
            </p>
          </div>
        </div>
        <input
          type="radio"
          name="program"
          checked={isSelected}
          onChange={handleCardClick}
          className="w-6 h-6 border-outline-variant text-royal-navy focus:ring-majestic-gold cursor-pointer"
        />
      </div>
    </div>
  );
}
