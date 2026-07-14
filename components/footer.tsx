import Link from "next/link";
import Logo from "./logo";

/**
 * Footer (Build prompt §3): ink band — the ONLY dark surface on the site.
 * Uses the inverse logo. Social URLs are placeholders pending GATE H1.
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-[var(--color-ink)] text-[var(--color-paper)]">
      <div className="gutter mx-auto grid max-w-[90rem] gap-10 py-16 md:grid-cols-[1fr_auto] md:py-20">
        <div>
          <Logo variant="inverse" />
          <p className="caption mt-6 !text-[var(--color-paper)]/60">
            Hospitality · Architecture · Interior Design
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 text-[0.95rem] md:gap-16">
          <ul className="space-y-2">
            <li>
              <a
                href="mailto:anvi@createch.co.ke"
                className="transition-colors hover:text-[var(--color-gold)]"
              >
                anvi@createch.co.ke
              </a>
            </li>
            <li>
              <a
                href="tel:+254733622848"
                className="transition-colors hover:text-[var(--color-gold)]"
              >
                +254 733 622 848
              </a>
            </li>
            <li>
              <a
                href="https://wa.me/254733622848"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-[var(--color-gold)]"
              >
                WhatsApp
              </a>
            </li>
            <li className="text-[var(--color-paper)]/60">Nairobi, Kenya</li>
          </ul>

          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="transition-colors hover:text-[var(--color-gold)]"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="#"
                className="transition-colors hover:text-[var(--color-gold)]"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <Link
                href="/contact"
                className="transition-colors hover:text-[var(--color-gold)]"
              >
                Start a project
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="gutter mx-auto max-w-[90rem] border-t border-[var(--color-paper)]/15 py-6">
        <p className="caption !text-[var(--color-paper)]/50">
          © Createch Architects Ltd {year}
        </p>
      </div>
    </footer>
  );
}
