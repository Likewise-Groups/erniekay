import FadeIn from "@/components/FadeIn";

const milestones = [
  {
    year: "2018",
    title: "The Genesis",
    body: "Erniekay opens a boutique private studio focused on bespoke hair styling and clinical skin analysis.",
  },
  {
    year: "2020",
    title: "Bridal Artistry Launch",
    body: "Expanded into high-end bridal beauty, becoming featured in top-tier local and international wedding publications.",
  },
  {
    year: "2022",
    title: "Erniekay Beauty Academy",
    body: "Inaugurated the academy to raise industry standards, offering comprehensive makeup and styling certifications.",
  },
  {
    year: "2024",
    title: "The Digital Shop & Expansion",
    body: "Launched our curation of professional tools and luxury hair/skincare essentials online, servicing clients worldwide.",
  },
];

export default function Milestones() {
  return (
    <section className="py-[112px] bg-alabaster-white overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 md:px-[64px]">
        <div className="text-center mb-16">
          <FadeIn>
            <span className="font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold text-champagne-taupe block mb-4">
              Our Journey
            </span>
            <h2 className="font-[family-name:var(--font-eb-garamond)] text-[36px] md:text-[44px] leading-[44px] font-semibold text-royal-navy">
              Milestones of Excellence
            </h2>
          </FadeIn>
        </div>

        {/* Timeline container */}
        <div className="relative max-w-3xl mx-auto flex flex-col items-center">
          {/* Vertical Center Line */}
          <div className="absolute top-0 bottom-0 left-[20px] md:left-1/2 w-[2px] bg-majestic-gold/30" />

          {milestones.map((m, idx) => (
            <div
              key={m.year}
              className={`relative w-full flex flex-col md:flex-row items-start md:items-center justify-between mb-12 last:mb-0 ${
                idx % 2 === 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Timeline dot */}
              <div className="absolute left-[20px] md:left-1/2 w-4 h-4 bg-majestic-gold border border-royal-navy rounded-full -translate-x-[7px]" />

              {/* Spacing holder column on desktop */}
              <div className="hidden md:block md:w-[45%]" />

              {/* Timeline content block */}
              <div className="w-full md:w-[45%] pl-10 md:pl-0">
                <FadeIn delay={150}>
                  <div className="bg-white border border-outline-variant p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <span className="font-[family-name:var(--font-montserrat)] text-[24px] font-bold text-champagne-taupe mb-2 block">
                      {m.year}
                    </span>
                    <h4 className="font-[family-name:var(--font-eb-garamond)] text-[20px] leading-[26px] font-semibold text-royal-navy mb-2">
                      {m.title}
                    </h4>
                    <p className="font-[family-name:var(--font-montserrat)] text-[14px] leading-[22px] text-warm-slate">
                      {m.body}
                    </p>
                  </div>
                </FadeIn>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
