import type { Metadata } from "next";
import Link from "next/link";
import { EB_Garamond, Montserrat } from "next/font/google";
import "./globals.css";
import { salonUrl } from "./admin-utils";

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
  title: "Erniekay Admin Dashboard",
  description: "Separate administration app for Erniekay Splendor bookings, services, clients, and receipts.",
};

const navItems = [
  ["Overview", "/", "dashboard"],
  ["Bookings", "/bookings", "event_available"],
  ["Calendar", "/calendar", "calendar_month"],
  ["Services", "/services", "design_services"],
  ["Clients", "/clients", "groups"],
  ["Receipts", "/receipts", "receipt_long"],
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ebGaramond.variable} ${montserrat.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className="bg-slate-50 text-slate-900">
        <div className="min-h-screen bg-slate-50">
          <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
            <aside className="border-r border-slate-200 bg-white px-5 py-6 shadow-sm">
              <div className="flex h-full flex-col">
                <div className="mb-10 flex items-center gap-4">
                  <div className="relative h-14 w-14 overflow-hidden rounded-3xl bg-slate-900 text-white shadow-lg">
                    <img src="/logo.svg" alt="Erniekay logo" className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold tracking-tight">Erniekay Admin</p>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Beauty operations</p>
                  </div>
                </div>

                <nav className="space-y-1">
                  {navItems.map(([label, href, icon]) => (
                    <Link
                      key={label}
                      href={String(href)}
                      className="flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                    >
                      <span className="material-symbols-outlined text-[18px] text-slate-500">{icon}</span>
                      {label}
                    </Link>
                  ))}
                </nav>

                <div className="mt-auto rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 shadow-sm">
                  <p className="font-semibold text-slate-900">Salon connection</p>
                  <p className="mt-2 text-sm leading-6">This portal reads the shared bookings database alongside the salon website.</p>
                  <Link
                    href={salonUrl}
                    className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-900"
                  >
                    View salon
                    <span className="material-symbols-outlined text-[16px]">arrow_outward</span>
                  </Link>
                </div>
              </div>
            </aside>

            <main className="min-w-0 bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
