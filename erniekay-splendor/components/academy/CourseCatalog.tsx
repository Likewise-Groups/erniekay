import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";

export default function CourseCatalog() {
  return (
    <section className="py-[112px] bg-alabaster-white">
      <div className="max-w-[1280px] mx-auto px-6 md:px-[64px]">
        {/* Section header */}
        <FadeIn>
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <h2 className="font-[family-name:var(--font-eb-garamond)] text-[40px] md:text-[48px] leading-[48px] md:leading-[56px] tracking-[-0.01em] font-semibold text-royal-navy gold-hairline">
                The Curriculum
              </h2>
              <p className="mt-10 font-[family-name:var(--font-montserrat)] text-[16px] leading-[26px] text-warm-slate">
                Choose from our selection of highly specialized masterclasses designed for both
                aspiring and established professionals.
              </p>
            </div>
            <Link
              href="#"
              className="font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold text-royal-navy border-b border-royal-navy pb-1 hover:text-majestic-gold hover:border-majestic-gold transition-all shrink-0"
            >
              View All Modules
            </Link>
          </div>
        </FadeIn>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* Card 1 — wide (8 cols), horizontal */}
          <FadeIn className="md:col-span-8" delay={0}>
            <div className="group cursor-pointer overflow-hidden bg-white border border-outline-variant h-full">
              <div className="flex flex-col md:flex-row h-full">
                <div className="md:w-1/2 h-60 md:h-auto overflow-hidden flex-shrink-0">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiygL4gzPWGhn4pKtNMf4XV8I8cgk8uF9hXZiQACP8BOs9fEpUGazN-Quos2mNo7vzjqLemek3TII3wCMwV1lZ1uyHYQnBB5A2gp2cAOJM0zg_Z8nxJOJneF5vXbMhWQA2WiU1aBeTfyGhEonWk--FvMSDZ-6j9zdIsppduewJa7lUUSNTqhn6Eiwbm_A1ZWxr2RekUBA8y85zcFSo6ZQIUKmo2izolCIvUxeSbIbQLCcQ7x50GffhzRlLBjzMbE-K_Qdd6Y8sRJY"
                    alt="Bridal makeup application in progress — editorial, gold-toned shimmer"
                    width={600}
                    height={500}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    unoptimized
                  />
                </div>
                <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="font-[family-name:var(--font-montserrat)] text-[10px] leading-[16px] tracking-[0.15em] uppercase font-bold bg-royal-navy text-white px-2 py-1">
                        Certified Level III
                      </span>
                      <span className="font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold text-warm-slate">
                        12 Weeks
                      </span>
                    </div>
                    <h3 className="font-[family-name:var(--font-eb-garamond)] text-[28px] leading-[36px] tracking-[-0.005em] font-semibold text-royal-navy mb-4">
                      Masterclass in Bridal Artistry
                    </h3>
                    <p className="font-[family-name:var(--font-montserrat)] text-[16px] leading-[26px] text-warm-slate mb-8">
                      Comprehensive training on cultural bridal looks, long-wear techniques, and
                      business management for bridal artists.
                    </p>
                  </div>
                  <button
                    id="apply-bridal-masterclass"
                    className="w-full bg-royal-navy text-white py-4 font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold hover:bg-majestic-gold hover:text-royal-navy transition-colors"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Card 2 — narrow (4 cols), vertical */}
          <FadeIn className="md:col-span-4" delay={80}>
            <div className="group cursor-pointer bg-white border border-outline-variant flex flex-col h-full">
              <div className="h-64 overflow-hidden flex-shrink-0">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDg0WYHqzgcM6lAEAidz7XzIs_rePMeaWrmeb-DpKzAJRvb7cQfQSssXFG-zbnu9NHHuIjzIikw-NdODcxBC-JRB-_0Lk10f1muMiQauxkd9xSTI95sHW8erBHxbg5KdFQz0nbzjO0FU-QImx_L5wTu0UUubZ9HflSgkqWtUTpb2ai-SEQqkXk8E63t5EUkemRiBoDOLYb-wlTM7C2H9TIsIWGnGFrP_oHmamO5Do2-7_geoh1dyr0aftcQaezyb1xf1H8OBdR_3zE"
                  alt="Architectural editorial hair styling — sleek updo with high-gloss finish"
                  width={400}
                  height={256}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  unoptimized
                />
              </div>
              <div className="p-8 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-[family-name:var(--font-montserrat)] text-[10px] leading-[16px] tracking-[0.15em] uppercase font-bold bg-royal-navy text-white px-2 py-1">
                      Certified
                    </span>
                    <span className="font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold text-warm-slate">
                      6 Weeks
                    </span>
                  </div>
                  <h3 className="font-[family-name:var(--font-eb-garamond)] text-[28px] leading-[36px] tracking-[-0.005em] font-semibold text-royal-navy mb-4">
                    Editorial Hair Styling
                  </h3>
                  <p className="font-[family-name:var(--font-montserrat)] text-[16px] leading-[26px] text-warm-slate mb-6">
                    Master the architecture of hair for runway and high-fashion editorial shoots.
                  </p>
                </div>
                <button
                  id="apply-editorial-hair"
                  className="w-full border border-royal-navy text-royal-navy py-3 font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold hover:bg-royal-navy hover:text-white transition-colors"
                >
                  Apply Now
                </button>
              </div>
            </div>
          </FadeIn>

          {/* Card 3 — narrow (4 cols), vertical */}
          <FadeIn className="md:col-span-4" delay={0}>
            <div className="group cursor-pointer bg-white border border-outline-variant flex flex-col h-full">
              <div className="h-64 overflow-hidden flex-shrink-0">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJxbZaGgIXfLcxHIiBZoe8VwMVcbnSnpbKrrWvBojiouN026ahXMW2Z1-_Hbwtglfuqh3Z2rHd8HhvmX9UDFS_leja1Cq9cMiDS1yC2ziiLGY6oqZER_I4ZEbnyLzXJHco6s8nfn2oZ25Y0IdZuD8vW7qmvW_sNPoT1vL715Hz0DsOCS2TnGQLaqOzvKeQKRf3K8tq1dy0zMjpNpKKsnKbjuK-yGgVLOteLkWnnY_YCe1vz2pxRTGojDYIz-F2n4l2CjgnB6QZCsw"
                  alt="Clinical skin therapy session — soft clinical lighting with professional equipment"
                  width={400}
                  height={256}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  unoptimized
                />
              </div>
              <div className="p-8 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-[family-name:var(--font-montserrat)] text-[10px] leading-[16px] tracking-[0.15em] uppercase font-bold bg-royal-navy text-white px-2 py-1">
                      Advanced
                    </span>
                    <span className="font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold text-warm-slate">
                      8 Weeks
                    </span>
                  </div>
                  <h3 className="font-[family-name:var(--font-eb-garamond)] text-[28px] leading-[36px] tracking-[-0.005em] font-semibold text-royal-navy mb-4">
                    Advanced Skin Therapy
                  </h3>
                  <p className="font-[family-name:var(--font-montserrat)] text-[16px] leading-[26px] text-warm-slate mb-6">
                    Deep dive into dermatology, chemical peels, and advanced facial rejuvenation
                    techniques.
                  </p>
                </div>
                <button
                  id="apply-skin-therapy"
                  className="w-full border border-royal-navy text-royal-navy py-3 font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold hover:bg-royal-navy hover:text-white transition-colors"
                >
                  Apply Now
                </button>
              </div>
            </div>
          </FadeIn>

          {/* Card 4 — wide (8 cols), horizontal, dark */}
          <FadeIn className="md:col-span-8" delay={80}>
            <div className="group cursor-pointer overflow-hidden bg-royal-navy text-white h-full">
              <div className="flex flex-col md:flex-row h-full">
                <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-between order-2 md:order-1">
                  <div>
                    <span className="font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold text-majestic-gold block mb-4">
                      New for 2024
                    </span>
                    <h3 className="font-[family-name:var(--font-eb-garamond)] text-[28px] leading-[36px] tracking-[-0.005em] font-semibold mb-4">
                      The Business of Beauty
                    </h3>
                    <p className="font-[family-name:var(--font-montserrat)] text-[16px] leading-[26px] text-white/80 mb-8">
                      Learn the essentials of branding, social media marketing, and studio
                      management specifically for independent beauty entrepreneurs.
                    </p>
                  </div>
                  <button
                    id="apply-business-beauty"
                    className="w-full bg-majestic-gold text-royal-navy py-4 font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold hover:bg-white transition-colors"
                  >
                    Request Prospectus
                  </button>
                </div>
                <div className="md:w-1/2 h-64 md:h-auto overflow-hidden order-1 md:order-2 flex-shrink-0">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6V1KQD6u0Ea4NiHNBxMtBQN1SUZbh4lVBhb4ABC7b43AILy_fZmjYLP1ot4suWzgxZvMAJrovkpnmQYwU5zeUq6-7df6EjXudKifZBebEC2tOIUuHBt3CJxVun6Ak5WcE4mEUpavtO5YmjLZvjgOErIVSFh_efcMNme2-8NCuYxmr6SqY7E2nUc3lOFICWqFgpjWSdXDaA5BWzUfJ4t0if_6v06odGEiTSNbAHB_DiIBRhcGhOgIsgBc4i2h9SSM16UZ6IAPs6ys"
                    alt="Modern high-end studio workspace with gold laptop and editorial fashion items"
                    width={600}
                    height={500}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    unoptimized
                  />
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
