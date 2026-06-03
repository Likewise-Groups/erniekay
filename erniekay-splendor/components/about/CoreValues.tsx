import FadeIn from "@/components/FadeIn";

const values = [
  {
    icon: "visibility",
    title: "Editorial Vision",
    body: "We look at beauty through a fashion-forward lens, ensuring every look possesses runway appeal and modern structure.",
  },
  {
    icon: "biotech",
    title: "Clinical Precision",
    body: "Whether analyzing skin health or performing a color melt, our techniques are backed by science, safety, and pristine hygiene.",
  },
  {
    icon: "face",
    title: "Bespoke Artistry",
    body: "No pre-made templates. We custom-mix pigments and design haircuts that respect your unique bone structure and skin tone.",
  },
  {
    icon: "school",
    title: "Prestigious Training",
    body: "We commit to raising industry standards by passing down elite practical secrets and career mentorship to our students.",
  },
];

export default function CoreValues() {
  return (
    <section className="py-[112px] bg-royal-navy text-on-primary">
      <div className="max-w-[1280px] mx-auto px-6 md:px-[64px]">
        <div className="text-center mb-16">
          <FadeIn>
            <span className="font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold text-majestic-gold block mb-4">
              Our Pillars
            </span>
            <h2 className="font-[family-name:var(--font-eb-garamond)] text-[36px] md:text-[44px] leading-[44px] font-semibold text-white">
              The Foundations of Our Craft
            </h2>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((v, idx) => (
            <FadeIn key={v.title} delay={idx * 100}>
              <div className="h-full bg-white/5 border border-white/10 p-8 flex flex-col items-center text-center transition-all duration-300 hover:border-majestic-gold hover:bg-white/10 group">
                <span className="material-symbols-outlined text-[48px] text-majestic-gold mb-6 group-hover:scale-110 transition-transform duration-300">
                  {v.icon}
                </span>
                <h4 className="font-[family-name:var(--font-eb-garamond)] text-[22px] leading-[28px] font-semibold text-white mb-4">
                  {v.title}
                </h4>
                <p className="font-[family-name:var(--font-montserrat)] text-[14px] leading-[22px] text-on-primary-container opacity-85">
                  {v.body}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
