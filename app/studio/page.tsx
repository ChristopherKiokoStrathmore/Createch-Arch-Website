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
  services,
  studioPhilosophy,
} from "@/content/seed";

export const metadata: Metadata = {
  title: "Studio",
  description:
    "Createch Architects is a Nairobi practice for hospitality, F&B, lifestyle and high-end residential design, founded by Anvi Shah after sixteen years across Kenya, India, East and West Africa.",
  alternates: { canonical: "/studio" },
  openGraph: {
    title: "Studio · Createch Architects",
    description:
      "A Nairobi practice for hospitality, F&B, lifestyle and high-end residential design, founded by Anvi Shah.",
    url: "/studio",
    type: "profile",
    images: [
      {
        url: "/images/founder/Anvi_Shah_Profile.jpg",
        width: 414,
        height: 659,
        alt: "Anvi Shah, founder and principal architect of Createch Architects.",
      },
    ],
  },
};

/**
 * Studio (Build prompt §3.4 / law #5): the practice, then the founder in full.
 * The homepage carries an abbreviated founder block; this is where the whole
 * profile and the credentials live.
 */
export default function Studio() {
  return (
    <>
      <PageHeader
        eyebrow="The practice"
        title="Design that has to work on opening night."
        lede="Createch Architects is a Nairobi-based practice for hospitality, food and beverage, lifestyle spaces and high-end residential design."
      />

      {/* 01 — approach */}
      <section className="gutter mx-auto max-w-[90rem] py-20 md:py-28">
        <SectionIndex number="01" label="Approach" />
        <div className="grid gap-x-12 gap-y-10 md:grid-cols-12">
          <Reveal className="md:col-span-5">
            <p className="h2 max-w-[20ch] font-serif">
              Successful hospitality design goes beyond aesthetics.
            </p>
          </Reveal>
          <Reveal index={1} className="md:col-span-7">
            <p className="max-w-[62ch] text-[var(--color-ink-60)]">
              {studioPhilosophy}
            </p>
          </Reveal>
        </div>
      </section>

      {/* 02 — services */}
      <section className="bg-[var(--color-paper-2)]">
        <div className="gutter mx-auto max-w-[90rem] py-20 md:py-28">
          <SectionIndex number="02" label="Services" />
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
            <p className="caption mb-2">Where the work has been</p>
            <FootprintStrip />
          </Reveal>
        </div>
      </section>

      {/* 03 — founder */}
      <section className="gutter mx-auto max-w-[90rem] py-20 md:py-28">
        <SectionIndex number="03" label="Founder" />
        <div className="grid grid-cols-12 gap-x-10 gap-y-12">
          <Reveal
            as="figure"
            className="col-span-12 sm:col-span-7 md:col-span-4"
          >
            <div className="max-w-[380px] border border-[var(--color-line)] bg-[var(--color-paper)] p-3">
              <CinematicImage
                src="/images/founder/Anvi_Shah_Profile.jpg"
                alt="Anvi Shah, founder and principal architect of Createch Architects."
                aspect="414 / 659"
                parallax={false}
                sizes="(min-width: 768px) 380px, 60vw"
              />
            </div>
          </Reveal>

          <div className="col-span-12 md:col-span-8">
            <Reveal>
              <h2 className="h2 font-serif">Anvi Shah</h2>
              <p className="caption mt-2 !tracking-[0.12em]">
                Founder · Principal Architect
              </p>
            </Reveal>
            <Reveal index={1}>
              <p className="mt-7 max-w-[62ch] text-[var(--color-ink-60)]">
                {anviBio}
              </p>
            </Reveal>
            <Reveal index={2}>
              <DimensionCaption
                className="mt-8"
                items={[
                  { label: "Base", value: "Nairobi, Kenya" },
                  { label: "Practising", value: "16+ years" },
                ]}
              />
            </Reveal>

            <Reveal index={3}>
              <h3 className="caption mt-12 !tracking-[0.14em] text-[var(--color-gold-deep)]">
                Qualifications &amp; registrations
              </h3>
              <ul className="mt-4 space-y-2">
                {anviCredentials.map((c) => (
                  <li
                    key={c}
                    className="border-l border-[var(--color-line)] pl-4 text-[0.95rem] text-[var(--color-ink-60)]"
                  >
                    {c}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 04 — CTA */}
      <section className="gutter mx-auto max-w-[90rem] border-t border-[var(--color-line)] py-16 md:py-20">
        <Reveal>
          <h2 className="h2 max-w-[16ch] font-serif">
            Tell us about your project.
          </h2>
          <Link
            href="/contact"
            className="group mt-7 inline-block text-[0.95rem] font-medium"
          >
            Start a conversation
            <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </Reveal>
      </section>
    </>
  );
}
