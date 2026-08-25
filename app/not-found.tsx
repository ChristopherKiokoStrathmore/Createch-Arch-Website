import Link from "next/link";
import PageHeader from "@/components/page-header";
import { projects } from "@/content/seed";

/**
 * 404. Exported to out/404.html; `public/.htaccess` points Apache's
 * ErrorDocument at it, since there is no Node server to route misses.
 *
 * A dead end on a portfolio is a lost enquiry, so this offers the two things
 * a lost visitor most likely wanted: the work, and a way to get in touch.
 */
export default function NotFound() {
  const featured = [...projects]
    .sort((a, b) => a.order - b.order)
    .slice(0, 3);

  return (
    <>
      <PageHeader
        eyebrow="404"
        title="That page isn't here."
        lede="The link may be old, or the address slightly off. The work is all still where it should be."
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

        <p className="caption mt-16">Recent projects</p>
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
    </>
  );
}
