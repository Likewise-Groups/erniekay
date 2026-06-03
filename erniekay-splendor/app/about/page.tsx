import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import AboutHero from "@/components/about/AboutHero";
import BrandStory from "@/components/about/BrandStory";
import CoreValues from "@/components/about/CoreValues";
import Milestones from "@/components/about/Milestones";
import TeamProfiles from "@/components/about/TeamProfiles";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "About | Erniekay Splendor",
  description:
    "Discover the visionaries and values behind Erniekay Splendor. Blending clinical skin/hair precision with high-fashion artistic soul.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="mt-20">
        <AboutHero />
        <BrandStory />
        <CoreValues />
        <Milestones />
        <TeamProfiles />
      </main>
      <Footer />
    </>
  );
}
