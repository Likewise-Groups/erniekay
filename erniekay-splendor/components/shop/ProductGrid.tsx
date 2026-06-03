"use client";

import Image from "next/image";
import { useCart } from "@/context/CartContext";

interface Product {
  id: string;
  brand: string;
  title: string;
  subtitle: string;
  price: number;
  badge?: string;
  imgSrc: string;
  imgAlt: string;
}

const products: Product[] = [
  {
    id: "signature-gloss-serum",
    brand: "Erniekay Splendor",
    title: "Signature Gloss Serum",
    subtitle: "for editorial shine",
    price: 45,
    imgSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuANcB0d3HSWvO1CDJJEDV9A6FlwGqDFeDJ4ac5xZTjvjCM9Ebi8jdrzR6wFsi_rjR-tXJBYywIcHk7O7lNjXHqohndHP3N9o7CpHQvRUpNTfoNitBn5ANc9P48T7qIP-vvwZYqoRD_52Gx4fi_j9VExtvznJr7sD4x2N6bb5ezpPQlTEdEn0c_DADt24ahwrIe-Q-6y0WRm20Hd0yGdJ43-HnT3tnVpGUyRZLMJ2r4wVJe_aijbs0dtfOuTj1RlpcvGl9tgd8UT3bQ",
    imgAlt: "Sleek glass serum bottle on a warm champagne taupe background",
  },
  {
    id: "royal-hydra-cream",
    brand: "Erniekay Splendor",
    title: "Royal Hydra-Cream",
    subtitle: "deep skin rejuvenation",
    price: 120,
    badge: "BESTSELLER",
    imgSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA-LWBck45ZVdY60gGbIfFpZOVUaa_Q2i3IUeK_57WWaHeQbb3LrjT4mNNRnvRgvAk1hwPamwnGVp7SXgvhX38yZMVKxMiebFgnQo5RSML3BCfowAEyPBU5BGFiDzHoCZIKISfjoEnQfp1q_fgiw0SHDi9AkCt2JwKWhxfTasgpGO9oKdhYzWfaO0_J2r1PMV8tFtxXrZHyH36pd0J8iQhbUSkCPEYAz-dmjUqEEt7xJ_QxTje7qk9l-u_jCw3lMtTFlEd0eNpFfiM",
    imgAlt: "Frosted white glass cream jar with metallic gold lid on white marble",
  },
  {
    id: "botanical-scalp-ritual",
    brand: "Erniekay Splendor",
    title: "Botanical Scalp Ritual",
    subtitle: "holistic hair health",
    price: 65,
    imgSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBq10db8PYMQ-EloS9IThH_zmxM2uzsXaY5xufw5TvMF5zWTQ02rg1yVfU-9Osftjj1fO1sQt9loNkHvEv00ZtGLvjg61RStQk951tYAkm_8p-eydGLTm7I5sFqS2SpK4Fjz2_fTcNakOr8AyDWa-gJzpaZ9og2--GjWoer0p1T-AXSRspx7-39goGC9EhNDt8CQjRCoJSwwfvSTvGvE189J8ye1eBSED6eB7-shMpHa8jpVA2nCQzjOcJJ6DgU3XAp1dN8-_5iEZk",
    imgAlt: "Dark amber apothecary bottle with dropper surrounded by botanical leaves",
  },
  {
    id: "luxe-satin-wrap",
    brand: "Erniekay Splendor",
    title: "Luxe Satin Wrap",
    subtitle: "night-time protection",
    price: 35,
    imgSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBt_PadtyOXIgFurEDLtQGUzleQhli7oH42zsTcqVSghf70BRg0JxYFSIIA5GfYytighdg_MK1eQiPGZl9a5K3jVSYQKFqBb-eY7iw_eP3R1uSqj6YRxTbjyM2RVgHGwm6xUGxcOiW8sEn3PtGBN8x7AjgXuk2TQXVw3ETP7U-v_1O1eNi0VrCCtGuEKB12bagpVPQSR1IW2PE0lX67lde9csZA7oWfHqJls9zBAvlSh0QYxyxjaMn8D7pxHsTLT_LWgLwJdALmZRs",
    imgAlt: "Soft navy blue satin wrap draped over a minimalist wooden stand",
  },
  {
    id: "precision-edge-brush",
    brand: "Erniekay Splendor",
    title: "Precision Edge Brush",
    subtitle: "professional styling tool",
    price: 20,
    imgSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBeIti_-vkgzK-ZyNRLmlljSaueNLiWC-vzR4c4gUw4Uu5JjOgpJK0XBGoAU2gckzJLEXQId25MjN6JrFKRjxFa7fbed9qZK1TrTsBGmqcUDumHFtV4YEW4rKuUNLYsXV87zaXUbqPfN37v1vS84KE3o4m28tfDgV_5KEBwXEWZcqLnvTfenwInOxdkqMt0ujiwxh_SruPf9S4joQBWS4wPC_F9WmWP8OXVeWI-4Vy-Bw2SdTNroE-9O5uI7iZYuuvjHZtPjX8UexA",
    imgAlt: "Professional precision styling brush with matte navy handle and golden bristles",
  },
  {
    id: "splendor-glow-oil",
    brand: "Erniekay Splendor",
    title: "Splendor Glow Oil",
    subtitle: "all-over body radiance",
    price: 85,
    imgSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCyhnQtJzqNO9hfAw42mL9OZCRupepOE07fZ4CByqAGUnpNFC7Jwh3z9kxIb040i2_QTcN6j7UYdF1K9eKYS7D0Rjx7M08L28KbQcKH_xxN66DHWKXk7Bp9akJVjg7KnJRice0ga3UCYCR5xr28gBSFPaZGZY3HqbNDYpsU-twitn-dA3-UjKAnj9vmHp365LrKFCcYuqYy-JcXcfEgZXnkmh1Iu50kGojuDkqjLF1wVoAZJ6ha6_lVXs68moC-Qqt38Jcv0szK36s",
    imgAlt: "Tall slender glass bottle with golden shimmer body oil on a reflective surface",
  },
];

function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <div className="group">
      {/* Image container */}
      <div className="relative aspect-[4/5] bg-white border border-[#EBEBEB] overflow-hidden mb-6 transition-all duration-500 hover:shadow-sm">
        <Image
          src={product.imgSrc}
          alt={product.imgAlt}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          unoptimized
        />

        {/* Hover navy tint */}
        <div className="absolute inset-0 bg-royal-navy/0 group-hover:bg-royal-navy/5 transition-colors duration-500" />

        {/* Bestseller badge */}
        {product.badge && (
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-majestic-gold text-royal-navy px-3 py-1 font-[family-name:var(--font-montserrat)] text-[10px] leading-[16px] tracking-[0.15em] uppercase font-bold">
              {product.badge}
            </span>
          </div>
        )}

        {/* Add to Ritual — slides up on hover */}
        <div className="absolute bottom-4 left-4 right-4 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
          <button
            id={`add-${product.id}`}
            onClick={() =>
              addItem({ id: product.id, title: product.title, price: product.price })
            }
            className="w-full bg-white text-royal-navy py-4 font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold border border-royal-navy hover:bg-royal-navy hover:text-white transition-colors"
          >
            Add to Ritual
          </button>
        </div>
      </div>

      {/* Product info */}
      <div className="flex flex-col gap-1">
        <span className="font-[family-name:var(--font-montserrat)] text-[10px] leading-[16px] tracking-[0.15em] uppercase font-bold text-champagne-taupe">
          {product.brand}
        </span>
        <div className="flex justify-between items-start">
          <h3 className="font-[family-name:var(--font-eb-garamond)] text-[22px] leading-[30px] font-semibold text-royal-navy">
            {product.title}
          </h3>
          <span className="font-[family-name:var(--font-montserrat)] text-[16px] leading-[26px] text-royal-navy font-medium">
            ${product.price}
          </span>
        </div>
        <p className="font-[family-name:var(--font-montserrat)] text-[14px] leading-[22px] text-warm-slate italic">
          {product.subtitle}
        </p>
      </div>
    </div>
  );
}

export default function ProductGrid() {
  return (
    <section className="py-[112px] max-w-[1280px] mx-auto px-6 md:px-[64px]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-14">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
