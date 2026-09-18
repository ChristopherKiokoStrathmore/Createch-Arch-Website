import Link from "next/link";
import type { Metadata } from "next";
import PageHeader from "@/components/page-header";
import CinematicImage from "@/components/cinematic-image";
import FootprintStrip from "@/components/footprint-strip";
import SectionIndex from "@/components/section-index";
import DimensionCaption from "@/components/dimension-caption";
import Reveal from "@/components/reveal";
import {
  anviBio,
  anviCredentials,
  founderCopy,
  services,
  studioCopy,
  studioPhilosophy,
} from "@/content";

export const metadata: Metadata = {
  title: "Studio",
  description: studioCopy.metaDescription,
  alternates: { canonical: "/studio" },
  openGraph: {
    title: "Studio · Createch Architects",
    description:
      "A Nairobi practice for hospitality, F&B, lifestyle and high-end residential design, founded by Anvi Shah.",
    url: "/studio",
    type: "profile",
    images: [
      {
        url: founderCopy.portraitSrc,
        width: 414,
        height: 659,
        alt: founderCopy.portraitAlt,
      },
    ],
  },
};

export default function Studio() {
  const c = studioCopy;

  return (
    <>
      <PageHeader eyebrow={c.eyebrow} title={c.title} lede={c.lede} />

      <section className="gutter mx-auto max-w-[90rem] py-20 md:py-28">
        <SectionIndex number={c.approach.number} label={c.approach.label} />
        <div className="grid gap-x-12 gap-y-10 md:grid-cols-12">
          <Reveal className="md:col-span-5">
            <p className="h2 max-w-[20ch] font-serif">{c.approach.headline}</p>
          </Reveal>
          <Reveal index={1} className="md:col-span-7">
            <p className="max-w-[62ch] text-[var(--color-ink-60)]">
              {studioPhilosophy}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-[var(--color-paper-2)]">
        <div className="gutter mx-auto max-w-[90rem] py-20 md:py-28">
          <SectionIndex number={c.services.number} label={c.services.label} />
          <ul className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, i) => (
              <Reveal
                as="li"
                key={service.title}
                index={i}
                className="border-l border-[var(--color-gold)] pl-5"
              >
                <h2 className="h3 font-serif">{service.title}</h2>
                <p className="mt-3 text-[0.95rem] text-[var(--color-ink-60)]">
                  {service.description}
                </p>
              </Reveal>
            ))}
          </ul>

          <Reveal className="mt-20">
            <p className="caption mb-2">{c.services.where}</p>
            <FootprintStrip />
          </Reveal>
        </div>
      </section>

      <section className="gutter mx-auto max-w-[90rem] py-20 md:py-28">
        <SectionIndex number={c.founder.number} label={c.founder.label} />
        <div className="grid grid-cols-12 gap-x-10 gap-y-12">
          <Reveal
            as="figure"
            className="col-span-12 sm:col-span-7 md:col-span-4"
          >
            <div className="max-w-[380px] border border-[var(--color-line)] bg-[var(--color-paper)] p-3">
              <CinematicImage
                src={founderCopy.portraitSrc}
                alt={founderCopy.portraitAlt}
                aspect="414 / 659"
                parallax={false}
                sizes="(min-width: 768px) 380px, 60vw"
              />
            </div>
          </Reveal>

          <div className="col-span-12 md:col-span-8">
            <Reveal>
              <h2 className="h2 font-serif">{c.founder.name}</h2>
              <p className="caption mt-2 !tracking-[0.12em]">{c.founder.role}</p>
            </Reveal>
            <Reveal index={1}>
              <p className="mt-7 max-w-[62ch] text-[var(--color-ink-60)]">
                {anviBio}
              </p>
            </Reveal>
            <Reveal index={2}>
              <DimensionCaption
                className="mt-8"
                items={[...c.founder.caption]}
              />
            </Reveal>

            <Reveal index={3}>
              <h3 className="caption mt-12 !tracking-[0.14em] text-[var(--color-gold-deep)]">
                {c.founder.qualifications}
              </h3>
              <ul className="mt-4 space-y-2">
                {anviCredentials.map((cred) => (
                  <li
                    key={cred}
                    className="border-l border-[var(--color-line)] pl-4 text-[0.95rem] text-[var(--color-ink-60)]"
                  >
                    {cred}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="gutter mx-auto max-w-[90rem] border-t border-[var(--color-line)] py-16 md:py-20">
        <Reveal>
          <h2 className="h2 max-w-[16ch] font-serif">{c.cta.headline}</h2>
          <Link
            href="/contact"
            className="group mt-7 inline-block text-[0.95rem] font-medium"
          >
            {c.cta.link}
            <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </Reveal>
      </section>
    </>
  );
}
