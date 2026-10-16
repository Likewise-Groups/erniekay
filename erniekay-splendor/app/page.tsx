import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoryNav from "@/components/CategoryNav";
import HairSection from "@/components/HairSection";
import SkinSection from "@/components/SkinSection";
import NailsSection from "@/components/NailsSection";
import MakeupSection from "@/components/MakeupSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import { getMediaOverrides } from "@/lib/media";

/**
 * Rendered per request so media changes made in the admin appear immediately.
 * Without this the page is prerendered at build time and would freeze whichever
 * pictures were live when it was built. The lookup is a single indexed query
 * over a table with a few dozen rows, through Hyperdrive.
 */
export const dynamic = "force-dynamic";


export default async function SalonServicesPage() {
  // Every section below is a client component, so the media lookup happens once
  // here and is handed down. An empty map means "show the built-in pictures".
  const media = await getMediaOverrides();

  return (
    <>
      <Navbar />
      <main className="mt-20">
        <HeroSection media={media} />
        <CategoryNav />
        <HairSection media={media} />
        <NailsSection media={media} />
        <SkinSection media={media} />
        <MakeupSection media={media} />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
