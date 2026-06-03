import Image from "next/image";

const packages = [
  {
    id: "civil-elegance",
    title: "The Civil Elegance",
    price: "From $1,200",
    description:
      "Minimalist sophistication for the modern bride. Perfect for registry weddings and intimate elopements.",
    features: [
      "90-min Consultation",
      "One Bridal Hair & Makeup Look",
      "Premium Product Kit",
    ],
    featured: false,
    buttonStyle: "outline" as const,
    imgSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAWXvkcg1fDNXnIJHEvldl93k3M6mlnA-im31wZjU880cl4IFV3z09ju4o8wfvau0oiEq_NGlZn4OVCPs_Peel_tfmkjOH_N0rmtSonM2rDu3dhuSoUIxXhYaVONHM589uUZmN3r0vLpyeKkpAhcUCcxkdK2KM5id6Q-t8Q9GM38V9uWmKCkpvV0t6bbd2eu--ncBpZkr0uolzk7Uw__ZL7akU4YuyzquCxSgqoh44fIBZYAFYM6zk1e4ipSifIOVRNDDOjdxnXwzM",
    imgAlt: "A minimalist bridal styling session with a clean low bun and natural dewy makeup",
  },
  {
    id: "traditional-splendor",
    title: "Traditional Splendor",
    price: "From $2,500",
    description:
      "Celebrating cultural heritage with high-impact, radiant artistry that glows from morning to night.",
    features: [
      "Multi-day Styling Support",
      "Detailed Jewelry Setting",
      "Luxury Hair & Face Contour",
    ],
    featured: true,
    buttonStyle: "filled" as const,
    imgSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBDjdZqkLRnBEwmmt-igOG4gQCgOvsV29crmuyPNnfbTbLTgAW4qLNYPB2HJ7Fg-g39575ccAdNFiJbmSbQ7qID9a0WqPE0h05edXrLYOqnFCq1YWk6mzryoa7VfCJCZfNhTfo6NtqEVJ589ME0YORz9y5R44HSyh32aJG_B1Xn1p3caViMa3dMtlANOzK8zql3xPlMjmsuBZzXxi6zgAWv1dqGQnM71GPFfK5PQ9gWGhbITtKlTrJenNZgRxdI7kembMQcCBU8Ulw",
    imgAlt:
      "A stunning bride with vibrant, high-impact traditional bridal artistry with gold accents",
  },
  {
    id: "white-wedding",
    title: "The White Wedding",
    price: "From $1,800",
    description:
      "Our signature editorial luxury for the bride who wants a timeless, runway-ready look for her big day.",
    features: [
      "Signature Bridal Trial",
      "Wedding Day Touch-ups",
      "Veil & Accessory Styling",
    ],
    featured: false,
    buttonStyle: "outline" as const,
    imgSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBe0ssogSOgwzQbYFytKnI4vBnMjODliLJ7-5RmtmQSU7T4yLOZ0ou9zStkhSyK7SQc1pL2By-3fv34dxlV6qgRu5jZgFfnxfVBOHU3zjggQVKskl3T0tdgRGuGFtf5R_8zl3a44JohknTJH40KiBA_Hwi7bUPbLXHaxjy1q2uWiEFpF8dAKdBU_02RVSkhK8gb7eQJOKZEgmiGBykQ2tLoTY3ZkFyYsrEEhb1W7FngoA7l_Z8xXD_y_3rY5MT9tvZzjEI1I2G75NE",
    imgAlt: "A modern bride in a grand white wedding dress in a sprawling, historic mansion setting",
  },
];

export default function BridalPackages() {
  return (
    <section className="py-[112px] bg-alabaster-white">
      <div className="max-w-[1280px] mx-auto px-6 md:px-[64px]">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-[family-name:var(--font-eb-garamond)] text-[48px] leading-[56px] tracking-[-0.01em] font-semibold text-primary mb-4">
            Curated Bridal Collections
          </h2>
          <div className="h-[2px] w-24 bg-majestic-gold mx-auto" />
        </div>

        {/* Package Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`bg-white group hover:editorial-shadow transition-all duration-500 overflow-hidden relative ${
                pkg.featured
                  ? "border-2 border-majestic-gold"
                  : "border border-[#EBEBEB]"
              }`}
            >
              {/* Most Requested badge */}
              {pkg.featured && (
                <div className="absolute top-0 right-0 bg-majestic-gold text-royal-navy font-[family-name:var(--font-montserrat)] text-[10px] leading-[16px] tracking-[0.15em] uppercase font-bold px-3 py-1 z-10">
                  Most Requested
                </div>
              )}

              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={pkg.imgSrc}
                  alt={pkg.imgAlt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  unoptimized
                />
              </div>

              {/* Body */}
              <div className="p-8">
                <h3 className="font-[family-name:var(--font-eb-garamond)] text-[24px] leading-[32px] font-semibold text-primary mb-2">
                  {pkg.title}
                </h3>
                <p className="font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold text-majestic-gold mb-6">
                  {pkg.price}
                </p>
                <p className="font-[family-name:var(--font-montserrat)] text-[16px] leading-[26px] text-on-surface-variant mb-8 h-20">
                  {pkg.description}
                </p>

                {/* Features */}
                <ul className="space-y-4 mb-10">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 font-[family-name:var(--font-montserrat)] text-[16px] leading-[26px]">
                      <span
                        className="material-symbols-outlined text-majestic-gold"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        check_circle
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                {pkg.buttonStyle === "filled" ? (
                  <button
                    id={`pkg-${pkg.id}`}
                    className="w-full py-4 bg-royal-navy text-white font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold hover:bg-black transition-colors active:scale-95"
                  >
                    Select Package
                  </button>
                ) : (
                  <button
                    id={`pkg-${pkg.id}`}
                    className="w-full py-4 border border-royal-navy text-royal-navy font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold hover:bg-royal-navy hover:text-white transition-colors active:scale-95"
                  >
                    Select Package
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
