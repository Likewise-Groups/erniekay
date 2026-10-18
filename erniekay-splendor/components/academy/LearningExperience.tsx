import FadeIn from "@/components/FadeIn";
import SlotMedia from "@/components/SlotMedia";
import type { MediaOverrides } from "@/lib/mediaSlots";

const features = [
  {
    icon: "architecture",
    title: "Modern Infrastructure",
    body: "Our training studio is modeled after international luxury salons, providing a seamless transition to the professional world.",
  },
  {
    icon: "verified_user",
    title: "Industry-Standard Tools",
    body: "Work exclusively with premium global brands and the latest cosmetic technologies.",
  },
  {
    icon: "groups",
    title: "Intimate Class Sizes",
    body: "We limit enrollment to ensure every student receives personalized mentorship from our lead educators.",
  },
];

export default function LearningExperience({ media }: { media?: MediaOverrides }) {
  return (
    <section className="py-[112px] bg-card overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 md:px-[64px]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">

          {/* Image column */}
          <FadeIn className="md:col-span-5 relative">
            <div className="relative aspect-[4/5] overflow-hidden">
              <SlotMedia
                media={media}
                slot="academy.learning"
                sizes="(max-width: 768px) 100vw, 42vw"
                className="object-cover"
              />
            </div>
            {/* Gold badge — desktop only */}
            <div className="absolute -bottom-8 -right-8 w-44 h-44 bg-majestic-gold hidden md:flex items-center justify-center p-6 text-royal-navy font-[family-name:var(--font-montserrat)] text-[14px] leading-[20px] font-bold text-center z-10">
              Hands-on Practice from Day&nbsp;1
            </div>
          </FadeIn>

          {/* Copy column */}
          <FadeIn className="md:col-span-6 md:col-start-7 py-8 md:py-12" delay={150}>
            <span className="font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.3em] uppercase text-majestic-gold block mb-4">
              The Environment
            </span>
            <h2 className="font-[family-name:var(--font-eb-garamond)] text-[36px] md:text-[48px] leading-tight tracking-[-0.01em] font-semibold text-ink mb-8">
              Where Theory Meets Artistry
            </h2>
            <div className="space-y-8">
              {features.map((f) => (
                <div key={f.icon}>
                  <h4 className="font-[family-name:var(--font-montserrat)] text-[16px] leading-[26px] font-semibold text-ink flex items-center gap-3">
                    <span className="material-symbols-outlined text-majestic-gold shrink-0">
                      {f.icon}
                    </span>
                    {f.title}
                  </h4>
                  <p className="font-[family-name:var(--font-montserrat)] text-[16px] leading-[26px] text-warm-slate mt-2 pl-9">
                    {f.body}
                  </p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
