import Link from "next/link";
import HeroLineReveal from "@/components/hero-line-reveal";
import FeaturedWork from "@/components/featured-work";
import FootprintStrip from "@/components/footprint-strip";
import Founder from "@/components/founder";
import BlueprintLines from "@/components/blueprint-lines";
import SectionIndex from "@/components/section-index";
import Reveal from "@/components/reveal";
import Principles from "@/components/principles";
import Presence from "@/components/presence";
import ChromePlates from "@/components/chrome-plates";
import {
  featuredProjects,
  heroAlt,
  heroCopy,
  heroImage,
  heroPaths,
  heroViewBox,
  homeCopy,
  mailtoHref,
  waHref,
} from "@/content";
import { getChrome } from "@/lib/chrome";

/**
 * Home — Hero, Featured Work, Studio (principles + presence + founder), Contact.
 * Photos lead; copy from `@/content`. Original practice voice from the live
 * site sits in the hero and the studio band — not SaaS slogans.
 */

const PLAN_LINES = [
  "M 0 132 L 1200 132",
  "M 60 132 L 60 46 L 380 46 L 380 132",
  "M 380 46 L 660 46 L 660 96 L 940 96",
  "M 940 24 L 940 132",
  "M 60 150 L 380 150",
  "M 60 144 L 60 156 M 380 144 L 380 156",
];

export default async function Home() {
  const chrome = await getChrome();
  const { featured, studio, contact } = homeCopy;
  const heroSrc = chrome.hero.imageUrl || heroImage;
  const heroLine = {
    kicker: chrome.hero.kicker || heroCopy.kicker,
    title: chrome.hero.title || heroCopy.title,
    strap: chrome.hero.strap || heroCopy.strap,
    lede: chrome.hero.lede || heroCopy.lede,
    cta: chrome.hero.cta || heroCopy.cta,
    ctaHref: chrome.hero.ctaHref || heroCopy.ctaHref,
  };

  return (
    <>
      <HeroLineReveal
        src={heroSrc}
        alt={chrome.hero.imageAlt || heroAlt}
        paths={heroSrc === heroImage ? heroPaths : []}
        viewBox={heroViewBox}
        copy={heroLine}
      />

      <ChromePlates chrome={chrome} />

      {featuredProjects.length > 0 && (
        <section
          id="featured-work"
          className="gutter mx-auto max-w-[90rem] py-24 md:py-36"
        >
          <SectionIndex number={featured.number} label={featured.label} />
          <FeaturedWork projects={featuredProjects} />
        </section>
      )}

      <section className="bg-[var(--color-paper-2)]">
        <div className="gutter mx-auto max-w-[90rem] py-24 md:py-36">
          <SectionIndex number={studio.number} label={studio.label} />
          <Reveal>
            <p className="h2 max-w-[24ch] font-serif">{studio.headline}</p>
          </Reveal>
          <Reveal index={1}>
            <p className="mt-6 max-w-[60ch] text-[var(--color-ink-60)]">
              {studio.lede}
            </p>
          </Reveal>

          <Reveal index={2}>
            <ul className="caption mt-10 flex flex-wrap gap-x-4 gap-y-2 !tracking-[0.14em] text-[var(--color-ink)]">
              {studio.disciplines.flatMap((d, i) => [
                i > 0 ? (
                  <li
                    key={`sep-${d}`}
                    aria-hidden="true"
                    className="text-[var(--color-gold-deep)]"
                  >
                    ·
                  </li>
                ) : null,
                <li key={d}>{d}</li>,
              ])}
            </ul>
          </Reveal>

          <div className="mt-16 md:mt-20">
            <Principles />
          </div>

          <div className="mt-16 md:mt-24">
            <Presence />
          </div>

          <Reveal index={2} className="mt-14">
            <FootprintStrip />
          </Reveal>

          <BlueprintLines
            paths={PLAN_LINES}
            viewBox="0 0 1200 170"
            className="mt-20 h-16 w-full opacity-90 md:h-24"
          />

          <div className="mt-16 md:mt-20">
            <Founder />
          </div>

          <Reveal index={1}>
            <Link
              href="/studio"
              className="group mt-16 inline-block text-[0.95rem] font-medium"
            >
              {studio.aboutCta}
              <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="gutter mx-auto max-w-[90rem] py-24 md:py-36">
        <SectionIndex
          number={contact.number}
          label={chrome.contact.label || contact.label}
        />
        <Reveal>
          <h2 className="h-display max-w-[14ch]">
            {chrome.contact.headline || contact.headline}
          </h2>
        </Reveal>
        <Reveal index={1}>
          <div className="mt-10 flex flex-col gap-3 text-[1.25rem] md:text-[1.5rem]">
            <a
              href={mailtoHref(chrome.contact.email)}
              className="group w-fit font-serif"
            >
              {chrome.contact.email}
              <span className="block h-px w-0 bg-[var(--color-gold)] transition-all duration-200 group-hover:w-full" />
            </a>
            <a
              href={waHref(chrome.contact.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="group w-fit font-serif"
            >
              WhatsApp {chrome.contact.phone}
              <span className="block h-px w-0 bg-[var(--color-gold)] transition-all duration-200 group-hover:w-full" />
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}
