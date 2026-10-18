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

// Theme before first paint, and mark <html> once the icon font is usable; the
// icons stay hidden until then (see globals.css) so their names never show.
const themeScript = `try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}(function(){var h=document.documentElement,F="Material Symbols Outlined",ready=function(){h.classList.add("icons-ready")};try{var fs=document.fonts;fs.addEventListener("loadingdone",function(e){for(var i=0;i<e.fontfaces.length;i++)if(e.fontfaces[i].family.indexOf(F)>-1)ready()});addEventListener("load",function(){fs.load('24px "'+F+'"',"search").then(function(f){if(f.length)ready()})})}catch(e){ready()}})()`;

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
        {/* Material Symbols. Only weight 400 is requested (the site uses no
            other), with FILL 0..1 for the filled stars and ticks: ~0.46 MB
            instead of 1.1 MB for the full weight range. display=block, not
            swap: an icon font's fallback text is the icon's name, so swap
            showed "shopping_bag" etc. until the font arrived. */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@400,0..1&display=block"
        />
      </head>
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
