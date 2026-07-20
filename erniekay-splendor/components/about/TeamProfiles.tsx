import Image from "next/image";
import FadeIn from "@/components/FadeIn";

const team = [
  {
    name: "Erniekay",
    role: "Founder & Creative Director",
    bio: "Obsessed with symmetry and editorial polish, Erniekay directs all hair, makeup, and education campaigns.",
    imgSrc: "/erniekay1.jpg",
  },
  {
    name: "Beatrice Kay",
    role: "Lead Hair Educator & Colorist",
    bio: "Specializing in couture balayages and editorial sculpting, Beatrice bridges the gap between precision cut and runway style.",
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4NSHhdnS3HC2wv9GoLiymAe8j8yLtNVNnPQ8dBeBWkJBbQYAeSwCeRD1AOCy_A5aEp5HftG6gZjiOenMYMYB73BB6E4kZ-gFG4c2SHETUA0rR77rU-0gANaLn1lcfiV9s9g35uilDQLckSvNAgt0DEPl5C-6meLFYVbp56vOvRzRMr3OWtmHgpsv3AT6RV2O-Q5rCEhKC2tQ9lNOR8WIa37Ggh4Fa6ZWImx5jp2eOcbdt80DVCQCzpqzIzWKzv8isKCxs8Dkulm4",
  },
  {
    name: "Celine Vance",
    role: "Lead Skincare & Makeup Specialist",
    bio: "Focused on high-definition cosmetics and clinical skin prep that makes makeup last flawlessly under harsh studio lights.",
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0CGvUzGbcCpPOSnZFWMUieJTe5QEqI3MhLO_Z5a5USs6nHnEBcykDuRplwjdHLfffHmIVw5m8DgGGDll48U-uCvwtO_w3dG1PTA3tJ_rlGsGr_nmc4tZcei9q5tejEctmLCuR2IMMeeUs2TyVu0Y_uW3RwUpI7OGzw6yAjnSIY44mNse59XMebtxHhXoQPPCUWuI5osT5W2cWGifwzrad7TtLdETnkX5OFsN3QJ9dGdFn86y4DuCMGjn7LWkUSx2VK8CtUfpOxOc",
  },
];

export default function TeamProfiles() {
  return (
    <section className="py-[112px] md:py-[160px] bg-midnight-ink text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-majestic-gold/5 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
      
      <div className="max-w-[1280px] mx-auto px-6 md:px-[64px] relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div className="max-w-2xl">
            <FadeIn>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px w-12 bg-majestic-gold"></div>
                <span className="font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.2em] uppercase font-bold text-majestic-gold">
                  Our Experts
                </span>
              </div>
              <h2 className="font-[family-name:var(--font-eb-garamond)] text-[48px] md:text-[64px] leading-[56px] md:leading-[72px] font-semibold text-white">
                Masters of the Craft
              </h2>
            </FadeIn>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {team.map((t, idx) => (
            <FadeIn key={t.name} delay={idx * 150}>
              <div className="flex flex-col gap-8 group">
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[32px] shadow-2xl ring-1 ring-white/10">
                  <Image
                    src={t.imgSrc}
                    alt={t.name}
                    fill
                    className="object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                    sizes="(max-w-768px) 100vw, 30vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-midnight-ink/90 via-midnight-ink/20 to-transparent opacity-60 group-hover:opacity-80 transition-all duration-500" />
                  
                  {/* Bio Reveal on hover */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-end translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <p className="text-majestic-gold font-[family-name:var(--font-montserrat)] text-[11px] uppercase tracking-widest font-bold mb-3">
                      Certified Elite
                    </p>
                    <p className="text-white/90 font-[family-name:var(--font-montserrat)] text-[14px] leading-[24px]">
                      {t.bio}
                    </p>
                  </div>
                </div>
                
                <div className="text-center">
                  <h4 className="font-[family-name:var(--font-eb-garamond)] text-[28px] md:text-[32px] leading-[36px] font-semibold text-white group-hover:text-majestic-gold transition-colors duration-300">
                    {t.name}
                  </h4>
                  <p className="font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold text-white/60 mt-2">
                    {t.role}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
