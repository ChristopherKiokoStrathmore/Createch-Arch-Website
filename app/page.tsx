import Link from "next/link";
import HeroLineReveal from "@/components/hero-line-reveal";
import FeaturedWork from "@/components/featured-work";
import FootprintStrip from "@/components/footprint-strip";
import SectionIndex from "@/components/section-index";
import Reveal from "@/components/reveal";
import { featuredProjects } from "@/content/seed";
import { heroImage, heroAlt, heroPaths, heroViewBox } from "@/content/hero";

/**
 * Home — exactly 4 sections (law #7): Hero, Featured Work, Studio-in-brief,
 * Contact CTA. Seamless continuous scroll (law #2), nothing locked to 100vh
 * (law #3). Firm detail lives on /studio; here text is minimal (law #5).
 */
export default function Home() {
  return (
    <>
      {/* 01 — Hero */}
      <HeroLineReveal
        src={heroImage}
        alt={heroAlt}
        paths={heroPaths}
        viewBox={heroViewBox}
      />

      {/* 02 — Featured Work */}
      <section
        id="featured-work"
        className="gutter mx-auto max-w-[90rem] py-24 md:py-36"
      >
        <SectionIndex number="02" label="Selected Work" />
        <FeaturedWork projects={featuredProjects} />
      </section>

      {/* 03 — Studio in brief */}
      <section className="bg-[var(--color-paper-2)]">
        <div className="gutter mx-auto max-w-[90rem] py-24 md:py-36">
          <SectionIndex number="03" label="Studio" />
          <Reveal>
            <p className="h2 max-w-[24ch] font-serif">
              We design for guest experience, operational efficiency and
              commercial performance.
            </p>
          </Reveal>
          <Reveal index={1}>
            <p className="mt-6 max-w-[60ch] text-[var(--color-ink-60)]">
              Sixteen years across hotels, lodges, retail destinations and
              residences, from concept to handover.
            </p>
          </Reveal>

          <Reveal index={2}>
            <ul className="caption mt-10 flex flex-wrap gap-x-4 gap-y-2 !tracking-[0.14em] text-[var(--color-ink)]">
              <li>Hospitality</li>
              <li aria-hidden="true" className="text-[var(--color-gold-deep)]">·</li>
              <li>Architecture</li>
              <li aria-hidden="true" className="text-[var(--color-gold-deep)]">·</li>
              <li>Interior Design</li>
            </ul>
          </Reveal>

          <Reveal index={3} className="mt-14">
            <FootprintStrip />
          </Reveal>

          <Reveal index={4}>
            <Link
              href="/studio"
              className="group mt-12 inline-block text-[0.95rem] font-medium"
            >
              About the studio
              <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* 04 — Contact CTA */}
      <section className="gutter mx-auto max-w-[90rem] py-24 md:py-36">
        <SectionIndex number="04" label="Contact" />
        <Reveal>
          <h2 className="h1 max-w-[14ch]">Tell us about your project.</h2>
        </Reveal>
        <Reveal index={1}>
          <div className="mt-10 flex flex-col gap-3 text-[1.25rem] md:text-[1.5rem]">
            <a
              href="mailto:anvi@createch.co.ke"
              className="group w-fit font-serif"
            >
              anvi@createch.co.ke
              <span className="block h-px w-0 bg-[var(--color-gold)] transition-all duration-200 group-hover:w-full" />
            </a>
            <a
              href="https://wa.me/254733622848"
              target="_blank"
              rel="noopener noreferrer"
              className="group w-fit font-serif"
            >
              WhatsApp +254 733 622 848
              <span className="block h-px w-0 bg-[var(--color-gold)] transition-all duration-200 group-hover:w-full" />
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}
