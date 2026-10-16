import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import AcademyHero from "@/components/academy/AcademyHero";
import AcademyPillars from "@/components/academy/AcademyPillars";
import CourseCatalog from "@/components/academy/CourseCatalog";
import LearningExperience from "@/components/academy/LearningExperience";
import EnrollmentFlow from "@/components/academy/EnrollmentFlow";
import AcademyTestimonials from "@/components/academy/AcademyTestimonials";
import Footer from "@/components/Footer";
import { getMediaOverrides } from "@/lib/media";

/**
 * Rendered per request so media changes made in the admin appear immediately —
 * the same reason /about and /gallery are. Prerendered, this page would freeze
 * whichever pictures were live at build time.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Academy | Erniekay Splendor Beauty Academy",
  description:
    "Embark on a transformative journey with our professional beauty education. Explore bespoke editorial makeup, hair styling courses, and hands-on guidance from industry leaders.",
};

export default async function AcademyPage() {
  const media = await getMediaOverrides();

  return (
    <>
      <Navbar />
      <main className="mt-20">
        <AcademyHero media={media} />
        <AcademyPillars />
        <CourseCatalog media={media} />
        <LearningExperience media={media} />
        <EnrollmentFlow />
        <AcademyTestimonials media={media} />
      </main>
      <Footer />
    </>
  );
}
