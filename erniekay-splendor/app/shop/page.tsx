import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ShopHero from "@/components/shop/ShopHero";
import ShopCategoryNav from "@/components/shop/ShopCategoryNav";
import ProductGrid from "@/components/shop/ProductGrid";
import NewsletterCTA from "@/components/shop/NewsletterCTA";
import ShopFooter from "@/components/shop/ShopFooter";
import MobileBottomNav from "@/components/shop/MobileBottomNav";

export const metadata: Metadata = {
  title: "Shop | Erniekay Splendor",
  description:
    "Experience curated luxury through the Splendor Collection — clinical hair serums, bespoke skin rituals, and professional tools designed for editorial perfection.",
};

export default function ShopPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 pb-16 md:pb-0">
        <ShopHero />
        <ShopCategoryNav />
        <ProductGrid />
        <NewsletterCTA />
      </main>
      <ShopFooter />
      <MobileBottomNav />
    </>
  );
}
