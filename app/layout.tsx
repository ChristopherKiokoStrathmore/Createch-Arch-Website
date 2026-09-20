import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SITE_ORIGIN } from "@/lib/site-url";
import { metadataCopy, site } from "@/content";

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
    default: metadataCopy.title,
    template: `%s · ${site.name}`,
  },
  description: metadataCopy.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_KE",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: metadataCopy.ogAlt,
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
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
