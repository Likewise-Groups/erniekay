import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import AboutHero from "@/components/about/AboutHero";
import BrandStory from "@/components/about/BrandStory";
import CoreValues from "@/components/about/CoreValues";
import Milestones from "@/components/about/Milestones";
import TeamProfiles from "@/components/about/TeamProfiles";
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
  title: "About | Erniekay Splendor",
  description:
    "Discover the visionaries and values behind Erniekay Splendor. Blending clinical skin/hair precision with high-fashion artistic soul.",
};

export default async function AboutPage() {
  const media = await getMediaOverrides();

  return (
    <>
      <Navbar />
      <main className="mt-20">
        <AboutHero media={media} />
        <BrandStory media={media} />
        <CoreValues />
        <Milestones />
        <TeamProfiles media={media} />
      </main>
      <Footer />
    </>
  );
}
