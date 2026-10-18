import type { Metadata } from "next";
import { EB_Garamond, Montserrat } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-eb-garamond",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Salon Services | Erniekay Splendor",
  description:
    "Step into a sanctuary where clinical precision meets editorial luxury. Explore our curated salon services — hair artistry, nail care, SPA, and professional makeup.",
};

const themeScript = `try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${ebGaramond.variable} ${montserrat.variable}`}
      // The theme script below adds `dark` before hydration.
      suppressHydrationWarning
    >
      <head>
        {/* Apply the saved theme (or the OS preference) before first paint so there's no light flash */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {/* Material Symbols */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
