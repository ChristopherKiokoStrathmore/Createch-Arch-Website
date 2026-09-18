import Link from "next/link";
import Logo from "./logo";
import {
  footerCopy,
  mailtoHref,
  site,
  telHref,
  waHref,
} from "@/content";

/**
 * Footer — ink band, the only dark surface. Contact comes from `site` in
 * `@/content`; empty social URLs do not render. Street address is omitted
 * until `site.address.line1` is filled.
 */
export default function Footer() {
  const year = new Date().getFullYear();

  const socials = (
    [
      { label: "Instagram", href: site.socials.instagram },
      { label: "LinkedIn", href: site.socials.linkedin },
    ] as const
  ).filter((s) => s.href);

  return (
    <footer className="mt-auto bg-[var(--color-ink)] text-[var(--color-paper)]">
      <div className="gutter mx-auto grid max-w-[90rem] gap-10 py-16 md:grid-cols-[1fr_auto] md:py-20">
        <div>
          <Logo variant="inverse" />
          <p className="caption mt-6 !text-[var(--color-paper)]/60">
            {site.kicker.replace(/ · /g, " · ")}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 text-[0.95rem] md:gap-16">
          <ul className="space-y-2">
            <li>
              <a
                href={mailtoHref(site.email)}
                className="transition-colors hover:text-[var(--color-gold)]"
              >
                {site.email}
              </a>
            </li>
            <li>
              <a
                href={telHref(site.phone)}
                className="transition-colors hover:text-[var(--color-gold)]"
              >
                {site.phone}
              </a>
            </li>
            <li>
              <a
                href={waHref(site.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-[var(--color-gold)]"
              >
                WhatsApp
              </a>
            </li>
            <li className="text-[var(--color-paper)]/60">{site.location}</li>
          </ul>

          <ul className="space-y-2">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-[var(--color-gold)]"
                >
                  {s.label}
                </a>
              </li>
            ))}
            <li>
              <Link
                href="/work"
                className="transition-colors hover:text-[var(--color-gold)]"
              >
                {footerCopy.work}
              </Link>
            </li>
            <li>
              <Link
                href="/studio"
                className="transition-colors hover:text-[var(--color-gold)]"
              >
                {footerCopy.studio}
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="transition-colors hover:text-[var(--color-gold)]"
              >
                {footerCopy.start}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="gutter mx-auto max-w-[90rem] border-t border-[var(--color-paper)]/15 py-6">
        <p className="caption !text-[var(--color-paper)]/50">
          © {site.legalName} {year}
        </p>
      </div>
    </footer>
  );
}
