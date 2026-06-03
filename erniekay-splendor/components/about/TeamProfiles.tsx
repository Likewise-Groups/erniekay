import Image from "next/image";
import FadeIn from "@/components/FadeIn";

const team = [
  {
    name: "Erniekay",
    role: "Founder & Creative Director",
    bio: "Obsessed with symmetry and editorial polish, Erniekay directs all hair, makeup, and education campaigns.",
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBqIQhO4eWVSmS4wioFQ7VQZ9NgDCw-tmKvgESR_7Q4rUMLG7Dps05Rp_zqwvkzfJ6JuSRAk2nRFJvUxzpEVSO9Fj57jC-VuaGLHBEskWClH02mwZ3nEf35beCvnO-12W2d_F9o1MXocHKioMSFymUZCLSDursPHetI8jws2MtzIHKkCmtKQFFfla-YIR6CNJDYg1dMO2iqD7GZxNMTG4fkDlkJTP8iQh4A1AKEPO6BHtONTgid_9AmVlBg8xbLvrhzu7iPtCRqgvg",
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
    <section className="py-[112px] bg-royal-navy text-on-primary">
      <div className="max-w-[1280px] mx-auto px-6 md:px-[64px]">
        <div className="text-center mb-16">
          <FadeIn>
            <span className="font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold text-majestic-gold block mb-4">
              Our Experts
            </span>
            <h2 className="font-[family-name:var(--font-eb-garamond)] text-[36px] md:text-[44px] leading-[44px] font-semibold text-white">
              Masters of the Craft
            </h2>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((t, idx) => (
            <FadeIn key={t.name} delay={idx * 150}>
              <div className="flex flex-col gap-6 group">
                <div className="relative aspect-[3/4] w-full overflow-hidden shadow-lg border border-white/10">
                  <Image
                    src={t.imgSrc}
                    alt={t.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-w-768px) 100vw, 30vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-royal-navy/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                    <p className="text-majestic-gold font-[family-name:var(--font-montserrat)] text-[11px] uppercase tracking-wider font-bold mb-1">
                      Certified Elite
                    </p>
                    <p className="text-on-primary font-[family-name:var(--font-montserrat)] text-[13px] leading-[20px] opacity-90">
                      {t.bio}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-[family-name:var(--font-eb-garamond)] text-[24px] leading-[30px] font-semibold text-white">
                    {t.name}
                  </h4>
                  <p className="font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.1em] uppercase font-bold text-majestic-gold mt-1">
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
