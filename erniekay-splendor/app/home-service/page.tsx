import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomeServiceContent from "@/components/home-service/HomeServiceContent";

export const metadata: Metadata = {
  title: "Home Service | Erniekay Splendor",
  description:
    "Home service makeup and hairstyling in Kumasi: event glam, wig installation, bridal updos and combo packages. 2026 price list.",
};

export default function HomeServicePage() {
  return (
    <>
      <Navbar />
      <main className="mt-20">
        <HomeServiceContent />
      </main>
      <Footer />
    </>
  );
}
