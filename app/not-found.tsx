import Link from "next/link";
import PageHeader from "@/components/page-header";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import ChromeVars from "@/components/chrome-vars";
import { notFoundCopy, projects } from "@/content";
import { getChrome } from "@/lib/chrome";

/**
 * 404. Root not-found sits outside the public (site) layout, so it mounts
 * its own chrome (nav/footer/tokens) rather than rendering a bare page.
 */
export default async function NotFound() {
  const chrome = await getChrome();
  const featured = [...projects]
    .sort((a, b) => a.order - b.order)
    .slice(0, 3);

  return (
    <>
      <ChromeVars chrome={chrome} />
      <Nav links={chrome.nav.links} />
      <main id="main" className="flex-1">
        <PageHeader
          eyebrow={notFoundCopy.eyebrow}
          title={notFoundCopy.title}
          lede={notFoundCopy.lede}
        />

        <section className="gutter mx-auto max-w-[90rem] py-16 md:py-24">
          <div className="flex flex-wrap gap-x-10 gap-y-4">
            <Link href="/work" className="group text-[0.95rem] font-medium">
              All work
              <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
            <Link href="/studio" className="group text-[0.95rem] font-medium">
              The studio
              <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
            <Link href="/contact" className="group text-[0.95rem] font-medium">
              Contact
              <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>

          <p className="caption mt-16">{notFoundCopy.recent}</p>
          <ul className="mt-4 space-y-3">
            {featured.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/work/${p.slug}`}
                  className="font-serif text-[1.25rem] transition-colors hover:text-[var(--color-gold-deep)] md:text-[1.5rem]"
                >
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer chrome={chrome} />
    </>
  );
}
