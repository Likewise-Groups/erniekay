"use client";

import { useState } from "react";
import Image from "next/image";

interface GalleryItem {
  id: string;
  category: "salon" | "bridal" | "academy";
  displayCategory: string;
  title: string;
  imgSrc: string;
  alt: string;
  aspectClass: string;
}

const galleryItems: GalleryItem[] = [
  {
    id: "bridal-1",
    category: "bridal",
    displayCategory: "Bridal Excellence",
    title: "Traditional Splendor",
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBqIQhO4eWVSmS4wioFQ7VQZ9NgDCw-tmKvgESR_7Q4rUMLG7Dps05Rp_zqwvkzfJ6JuSRAk2nRFJvUxzpEVSO9Fj57jC-VuaGLHBEskWClH02mwZ3nEf35beCvnO-12W2d_F9o1MXocHKioMSFymUZCLSDursPHetI8jws2MtzIHKkCmtKQFFfla-YIR6CNJDYg1dMO2iqD7GZxNMTG4fkDlkJTP8iQh4A1AKEPO6BHtONTgid_9AmVlBg8xbLvrhzu7iPtCRqgvg",
    alt: "A stunning high-fashion portrait of a bride with intricate, pearl-studded hair styling and radiant dewy skin.",
    aspectClass: "aspect-[4/5]",
  },
  {
    id: "salon-1",
    category: "salon",
    displayCategory: "Salon Artistry",
    title: "Couture Balayage",
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4NSHhdnS3HC2wv9GoLiymAe8j8yLtNVNnPQ8dBeBWkJBbQYAeSwCeRD1AOCy_A5aEp5HftG6gZjiOenMYMYB73BB6E4kZ-gFG4c2SHETUA0rR77rU-0gANaLn1lcfiV9s9g35uilDQLckSvNAgt0DEPl5C-6meLFYVbp56vOvRzRMr3OWtmHgpsv3AT6RV2O-Q5rCEhKC2tQ9lNOR8WIa37Ggh4Fa6ZWImx5jp2eOcbdt80DVCQCzpqzIzWKzv8isKCxs8Dkulm4",
    alt: "A sharp, detailed macro photograph of professional hair texture after a couture balayage service.",
    aspectClass: "aspect-square",
  },
  {
    id: "academy-1",
    category: "academy",
    displayCategory: "Academy Masterclass",
    title: "Editorial Sculpting",
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0CGvUzGbcCpPOSnZFWMUieJTe5QEqI3MhLO_Z5a5USs6nHnEBcykDuRplwjdHLfffHmIVw5m8DgGGDll48U-uCvwtO_w3dG1PTA3tJ_rlGsGr_nmc4tZcei9q5tejEctmLCuR2IMMeeUs2TyVu0Y_uW3RwUpI7OGzw6yAjnSIY44mNse59XMebtxHhXoQPPCUWuI5osT5W2cWGifwzrad7TtLdETnkX5OFsN3QJ9dGdFn86y4DuCMGjn7LWkUSx2VK8CtUfpOxOc",
    alt: "Behind the scenes at a beauty academy masterclass where a professional instructor is demonstrating editorial sculpting techniques.",
    aspectClass: "aspect-[4/3]",
  },
  {
    id: "tools-1",
    category: "salon", // Associated with salon/precision instruments
    displayCategory: "The Tools",
    title: "Precision Instruments",
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuAw-hBxRRfWNsGQqJAeOoOWHWzi03iQHcGDgi0a5Mu8Fyd4oFZ6tFG7w7l92b0KkFfBFXT_JAI-LTTXivcyU4T9lKZdEE6SDSNOyyaIzT9sraBfY7c48ShLtPzHC2-_8B2d7INnvBBH4btbUzof717t_n1dJvWvMUhXkIeF7dWtJCbWuoxX8xisNZG0NdGt0bv0lrLxIb79ecWnoMlHI7o9VPH9ryeyyb1ljAFnp--WvCK6Bpy-uVdR2eK2LGkMS7Y9nRuaaYKF0IA",
    alt: "A close-up artistic shot of high-end cosmetic tools and palettes arranged symmetrically on a champagne taupe surface.",
    aspectClass: "aspect-[3/4]",
  },
  {
    id: "salon-2",
    category: "salon",
    displayCategory: "Salon Artistry",
    title: "Avante-Garde Vision",
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuDv1EGMdsvRUAIyNqsTqXBsdsxjV-5gs5aO0q5XntNVYc18YdC1n4pJr58q6oqqmRsTVwdci6hQdl75qRbDLWXIC-dxonm4xrgNEMRT4nWiXEPl-IWsm-5g_H0x3edqthSsRTey4wLneGWPPB1lEXP4IbAC0d3fqZPmhFPNF6NgRdaLVg2dfGa_CJTNCfQyfHSRnOeWJQypJ1woPxX_Qvrp4k9XUJWwiMmAHPzKLT9WnMRa1TdUXg8DCFPKREckfn_Xq715y4RdJko",
    alt: "A wide-angle, fashion-forward shot of a model in an avant-garde editorial look.",
    aspectClass: "aspect-[16/9]",
  },
];

const categories = [
  { id: "all", label: "All" },
  { id: "salon", label: "Salon Artistry" },
  { id: "bridal", label: "Bridal Excellence" },
  { id: "academy", label: "Academy Masterclass" },
];

export default function GalleryGrid() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredItems = galleryItems.filter(
    (item) => activeTab === "all" || item.category === activeTab
  );

  // We check if an item is currently active/visible to style it
  const isVisible = (category: string) => {
    return activeTab === "all" || category === activeTab;
  };

  return (
    <>
      {/* Category Filter Bar */}
      <section className="bg-surface-bright py-8 border-b border-outline-variant sticky top-20 z-40">
        <div className="max-w-[1280px] mx-auto px-6 md:px-[64px] flex flex-wrap justify-center gap-8 md:gap-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold transition-all duration-300 pb-1 ${
                activeTab === cat.id
                  ? "text-primary border-b-2 border-majestic-gold"
                  : "text-on-surface-variant hover:text-majestic-gold"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Grid Content */}
      <main className="max-w-[1280px] mx-auto px-6 md:px-[64px] py-[112px]">
        {activeTab === "all" ? (
          /* Custom asymmetric layout matches the designer's exact specification when viewing 'All' */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-start">
            {/* Large Focus Item (Item 1) */}
            <div className="lg:col-span-7 group relative overflow-hidden bg-royal-navy cursor-pointer">
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                  src={galleryItems[0].imgSrc}
                  alt={galleryItems[0].alt}
                  fill
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-w-1024px) 100vw, 58vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-royal-navy/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 z-10" />
              </div>
              <div className="absolute bottom-0 left-0 p-8 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                <p className="text-majestic-gold font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold mb-1">
                  {galleryItems[0].displayCategory}
                </p>
                <h3 className="text-on-primary font-[family-name:var(--font-eb-garamond)] text-[28px] leading-[36px] font-semibold">
                  {galleryItems[0].title}
                </h3>
              </div>
            </div>

            {/* Side Cluster (Items 2 and 3) */}
            <div className="lg:col-span-5 flex flex-col gap-8">
              <div className="group relative overflow-hidden bg-royal-navy cursor-pointer">
                <div className="relative aspect-square w-full overflow-hidden">
                  <Image
                    src={galleryItems[1].imgSrc}
                    alt={galleryItems[1].alt}
                    fill
                    priority
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-w-1024px) 100vw, 42vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-royal-navy/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 z-10" />
                </div>
                <div className="absolute bottom-0 left-0 p-6 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                  <p className="text-majestic-gold font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold mb-1">
                    {galleryItems[1].displayCategory}
                  </p>
                  <h3 className="text-on-primary font-[family-name:var(--font-eb-garamond)] text-[28px] leading-[36px] font-semibold">
                    {galleryItems[1].title}
                  </h3>
                </div>
              </div>

              <div className="group relative overflow-hidden bg-royal-navy cursor-pointer md:mt-12 lg:mt-12">
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={galleryItems[2].imgSrc}
                    alt={galleryItems[2].alt}
                    fill
                    priority
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-w-1024px) 100vw, 42vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-royal-navy/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 z-10" />
                </div>
                <div className="absolute bottom-0 left-0 p-6 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                  <p className="text-majestic-gold font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold mb-1">
                    {galleryItems[2].displayCategory}
                  </p>
                  <h3 className="text-on-primary font-[family-name:var(--font-eb-garamond)] text-[28px] leading-[36px] font-semibold">
                    {galleryItems[2].title}
                  </h3>
                </div>
              </div>
            </div>

            {/* Bottom Row (Items 4 and 5) */}
            <div className="lg:col-span-4 group relative overflow-hidden bg-royal-navy cursor-pointer md:mt-12 lg:mt-12">
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                <Image
                  src={galleryItems[3].imgSrc}
                  alt={galleryItems[3].alt}
                  fill
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-w-1024px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-royal-navy/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 z-10" />
              </div>
              <div className="absolute bottom-0 left-0 p-6 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                <p className="text-majestic-gold font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold mb-1">
                  {galleryItems[3].displayCategory}
                </p>
                <h3 className="text-on-primary font-[family-name:var(--font-eb-garamond)] text-[28px] leading-[36px] font-semibold">
                  {galleryItems[3].title}
                </h3>
              </div>
            </div>

            <div className="lg:col-span-8 group relative overflow-hidden bg-royal-navy cursor-pointer">
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <Image
                  src={galleryItems[4].imgSrc}
                  alt={galleryItems[4].alt}
                  fill
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-w-1024px) 100vw, 66vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-royal-navy/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 z-10" />
              </div>
              <div className="absolute bottom-0 left-0 p-8 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                <p className="text-majestic-gold font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold mb-1">
                  {galleryItems[4].displayCategory}
                </p>
                <h3 className="text-on-primary font-[family-name:var(--font-eb-garamond)] text-[28px] leading-[36px] font-semibold">
                  {galleryItems[4].title}
                </h3>
              </div>
            </div>
          </div>
        ) : (
          /* Filtered state: display active items in a clean responsive grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                className="group relative overflow-hidden bg-royal-navy cursor-pointer transition-all duration-500"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <Image
                    src={item.imgSrc}
                    alt={item.alt}
                    fill
                    priority={index < 6}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-w-768px) 100vw, (max-w-1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-royal-navy/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 z-10" />
                </div>
                <div className="absolute bottom-0 left-0 p-6 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                  <p className="text-majestic-gold font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold mb-1">
                    {item.displayCategory}
                  </p>
                  <h3 className="text-on-primary font-[family-name:var(--font-eb-garamond)] text-[28px] leading-[36px] font-semibold">
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
