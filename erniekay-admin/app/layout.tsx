import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Erniekay Admin",
  description: "Bookings, payments, enquiries and site media for Erniekay Splendor.",
  // Staff data behind a sign-in has no business in a search index, and the
  // deployment may well be on a guessable subdomain.
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
