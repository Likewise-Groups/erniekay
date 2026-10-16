import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import GalleryHero from "@/components/gallery/GalleryHero";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import GalleryCTA from "@/components/gallery/GalleryCTA";
import Footer from "@/components/Footer";
import { getMediaOverrides } from "@/lib/media";

/**
 * Rendered per request so media changes made in the admin appear immediately.
 * Without this the page is prerendered at build time and would freeze whichever
 * pictures were live when it was built. The lookup is a single indexed query
 * over a table with a few dozen rows, through Hyperdrive.
 */
export const dynamic = "force-dynamic";


export const metadata: Metadata = {
  title: "The Splendor Portfolio | LUXE ARTISTRY",
  description:
    "Explore the pinnacle of luxury beauty. A curated showcase of timeless editorial elegance, bridal excellence, and beauty academy masterclasses by Erniekay Splendor.",
};

export default async function GalleryPage() {
  // GalleryGrid is a client component (it filters by category), so the media
  // lookup happens here and is handed down.
  const media = await getMediaOverrides();

  return (
    <>
      <Navbar />
      <main className="mt-20">
        <GalleryHero />
        <GalleryGrid media={media} />
        <GalleryCTA />
      </main>
      <Footer />
    </>
  );
}
