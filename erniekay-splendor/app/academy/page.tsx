import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import AcademyHero from "@/components/academy/AcademyHero";
import AcademyPillars from "@/components/academy/AcademyPillars";
import CourseCatalog from "@/components/academy/CourseCatalog";
import LearningExperience from "@/components/academy/LearningExperience";
import EnrollmentFlow from "@/components/academy/EnrollmentFlow";
import AcademyTestimonials from "@/components/academy/AcademyTestimonials";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Academy | Erniekay Splendor Beauty Academy",
  description:
    "Embark on a transformative journey with our professional beauty education. Explore bespoke editorial makeup, hair styling courses, and hands-on guidance from industry leaders.",
};

export default function AcademyPage() {
  return (
    <>
      <Navbar />
      <main className="mt-20">
        <AcademyHero />
        <AcademyPillars />
        <CourseCatalog />
        <LearningExperience />
        <EnrollmentFlow />
        <AcademyTestimonials />
      </main>
      <Footer />
    </>
  );
}
