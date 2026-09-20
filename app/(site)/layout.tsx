import type { Metadata } from "next";
import LenisProvider from "@/components/lenis-provider";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import ChromeVars from "@/components/chrome-vars";
import { OrganizationJsonLd } from "@/components/json-ld";
import { getChrome } from "@/lib/chrome";
import { metadataCopy, site } from "@/content";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const chrome = await getChrome();
  const title = chrome.seo.title || metadataCopy.title;
  const description = chrome.seo.description || metadataCopy.description;
  const ogAlt = chrome.seo.ogAlt || metadataCopy.ogAlt;
  return {
    title: {
      default: title,
      template: `%s · ${site.name}`,
    },
    description,
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: "en_KE",
      images: [
        {
          url: "/og.jpg",
          width: 1200,
          height: 630,
          alt: ogAlt,
        },
      ],
    },
  };
}

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const chrome = await getChrome();

  return (
    <>
      <ChromeVars chrome={chrome} />
      <OrganizationJsonLd />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-[var(--color-ink)] focus:px-4 focus:py-2 focus:text-[var(--color-paper)]"
      >
        Skip to content
      </a>
      <LenisProvider>
        <Nav links={chrome.nav.links} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer chrome={chrome} />
      </LenisProvider>
    </>
  );
}
