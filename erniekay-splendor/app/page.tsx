import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoryNav from "@/components/CategoryNav";
import HairSection from "@/components/HairSection";
import SkinSection from "@/components/SkinSection";
import NailsSection from "@/components/NailsSection";
import MakeupSection from "@/components/MakeupSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function SalonServicesPage() {
  return (
    <>
      <Navbar />
      <main className="mt-20">
        <HeroSection />
        <CategoryNav />
        <HairSection />
        <NailsSection />
        <SkinSection />
        <MakeupSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
