import FadeIn from "@/components/FadeIn";

const pillars = [
  {
    id: "excellence",
    icon: "workspace_premium",
    title: "Professional Excellence",
    body: "Grounded in international standards, our curriculum ensures you graduate with the prestige of an elite beauty professional.",
  },
  {
    id: "innovation",
    icon: "brush",
    title: "Artistic Innovation",
    body: "We encourage the boundaries of traditional artistry, fostering a space where creative vision meets clinical execution.",
  },
  {
    id: "precision",
    icon: "biotech",
    title: "Clinical Precision",
    body: "Our approach combines beauty with science, teaching deep skin knowledge and product chemistry for lasting results.",
  },
];

export default function AcademyPillars() {
  return (
    <section className="py-[112px] bg-white">
      <div className="max-w-[1280px] mx-auto px-6 md:px-[64px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((p, i) => (
            <FadeIn key={p.id} delay={i * 120}>
              <div className="p-8 border border-outline-variant hover:border-majestic-gold transition-colors duration-500 h-full">
                <span className="material-symbols-outlined text-[40px] text-majestic-gold mb-6 block">
                  {p.icon}
                </span>
                <h3 className="font-[family-name:var(--font-eb-garamond)] text-[28px] leading-[36px] tracking-[-0.005em] font-semibold text-royal-navy mb-4">
                  {p.title}
                </h3>
                <p className="font-[family-name:var(--font-montserrat)] text-[16px] leading-[26px] text-warm-slate">
                  {p.body}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
