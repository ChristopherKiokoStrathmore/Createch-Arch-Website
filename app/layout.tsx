import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/lenis-provider";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import { OrganizationJsonLd } from "@/components/json-ld";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SITE_ORIGIN } from "@/lib/site-url";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: SITE_ORIGIN,
  title: {
    default: "Createch Architects",
    template: "%s · Createch Architects",
  },
  description:
    "Createch Architects is a Nairobi practice designing hotels, restaurants and lifestyle destinations across Africa and India.",
  // Every page inherits this card unless it sets its own — the case studies
  // override it with the project photograph in their generateMetadata.
  openGraph: {
    type: "website",
    siteName: "Createch Architects",
    locale: "en_KE",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Createch Architects — architecture for hospitality, from first line to final detail.",
      },
    ],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <OrganizationJsonLd />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-[var(--color-ink)] focus:px-4 focus:py-2 focus:text-[var(--color-paper)]"
        >
          Skip to content
        </a>
        <LenisProvider>
          <Nav />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </LenisProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
