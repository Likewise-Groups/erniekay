import FadeIn from "@/components/FadeIn";

const steps = [
  {
    n: "01",
    title: "Select Course",
    body: "Browse our professional syllabus and identify the course that aligns with your career goals.",
    style: "outline" as const,
  },
  {
    n: "edit_note",
    title: "Submit Application",
    body: "Complete our inquiry form including your portfolio or professional background for review.",
    style: "filled" as const,
  },
  {
    n: "03",
    title: "Enrollment",
    body: "Upon approval, finalize your seat with an admin review and orientation package.",
    style: "outline" as const,
  },
];

export default function EnrollmentFlow() {
  return (
    <section className="py-[112px] bg-royal-navy text-white">
      <div className="max-w-[1280px] mx-auto px-6 md:px-[64px]">
        {/* Header */}
        <FadeIn>
          <div className="text-center mb-20">
            <h2 className="font-[family-name:var(--font-eb-garamond)] text-[40px] md:text-[48px] leading-tight tracking-[-0.01em] font-semibold text-white mb-4">
              Your Path to Mastery
            </h2>
            <p className="font-[family-name:var(--font-montserrat)] text-[16px] leading-[26px] text-white/70">
              A streamlined process to begin your journey with us.
            </p>
          </div>
        </FadeIn>

        {/* Steps */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Connecting line — desktop */}
          <div className="absolute top-8 left-0 w-full h-px bg-majestic-gold/20 hidden md:block" />

          {steps.map((step, i) => (
            <FadeIn key={step.title} delay={i * 100} className="relative z-10 text-center">
              {/* Step circle */}
              {step.style === "filled" ? (
                <div className="w-16 h-16 bg-majestic-gold border-2 border-majestic-gold rounded-full flex items-center justify-center mx-auto mb-8">
                  <span
                    className="material-symbols-outlined text-royal-navy"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {step.n}
                  </span>
                </div>
              ) : (
                <div className="w-16 h-16 bg-royal-navy border-2 border-majestic-gold rounded-full flex items-center justify-center mx-auto mb-8">
                  <span className="font-[family-name:var(--font-montserrat)] text-[18px] font-bold text-majestic-gold">
                    {step.n}
                  </span>
                </div>
              )}

              <h3
                className={`font-[family-name:var(--font-eb-garamond)] text-[28px] leading-[36px] font-semibold mb-4 ${
                  step.style === "filled" ? "text-majestic-gold" : "text-white"
                }`}
              >
                {step.title}
              </h3>
              <p className="font-[family-name:var(--font-montserrat)] text-[16px] leading-[26px] text-white/70 px-4">
                {step.body}
              </p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
