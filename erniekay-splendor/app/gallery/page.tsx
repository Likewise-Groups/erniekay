import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import GalleryHero from "@/components/gallery/GalleryHero";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import GalleryCTA from "@/components/gallery/GalleryCTA";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "The Splendor Portfolio | LUXE ARTISTRY",
  description:
    "Explore the pinnacle of luxury beauty. A curated showcase of timeless editorial elegance, bridal excellence, and beauty academy masterclasses by Erniekay Splendor.",
};

export default function GalleryPage() {
  return (
    <>
      <Navbar />
      <main className="mt-20">
        <GalleryHero />
        <GalleryGrid />
        <GalleryCTA />
      </main>
      <Footer />
    </>
  );
}
