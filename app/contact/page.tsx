import type { Metadata } from "next";
import PageHeader from "@/components/page-header";
import SectionIndex from "@/components/section-index";
import Reveal from "@/components/reveal";
import EnquiryForm from "@/components/enquiry-form";
import { siteSettings } from "@/content/seed";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to Createch Architects about a hotel, restaurant, lodge, retail or residential project. Based in Nairobi, working across East and West Africa and India.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact · Createch Architects",
    description:
      "Talk to Createch Architects about a hotel, restaurant, lodge, retail or residential project.",
    url: "/contact",
    type: "website",
  },
};

/**
 * Contact (Build prompt §3.5). Direct channels first, then the enquiry form.
 *
 * WhatsApp stays above the form: for this market it is the channel clients
 * actually use, and burying it behind a form would cost enquiries.
 */
const CHANNELS = [
  {
    label: "Email",
    value: siteSettings.email,
    href: `mailto:${siteSettings.email}`,
    external: false,
  },
  {
    label: "WhatsApp",
    value: siteSettings.phone,
    href: `https://wa.me/${siteSettings.whatsapp}`,
    external: true,
  },
  {
    label: "Telephone",
    value: siteSettings.phone,
    href: `tel:${siteSettings.phone.replace(/\s/g, "")}`,
    external: false,
  },
];

const BRIEF_PROMPTS = [
  {
    label: "The project",
    body: "Type and scale — a hotel, a restaurant, a lodge, a retail floor, a house. Rooms, covers or square metres if you know them.",
  },
  {
    label: "The site",
    body: "Where it is, and whether it is greenfield, a conversion or a refurbishment of something operating.",
  },
  {
    label: "The stage",
    body: "Feasibility, concept, an existing scheme that needs resolving, or drawings ready for site.",
  },
  {
    label: "The dates",
    body: "When you need to be on site, and when the doors are meant to open.",
  },
];

export default function Contact() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Tell us about your project."
        lede="Createch works from concept through technical detailing to handover, in Nairobi and across the region. New enquiries go straight to Anvi."
      />

      {/* 01 — direct channels */}
      <section className="gutter mx-auto max-w-[90rem] py-20 md:py-28">
        <SectionIndex number="01" label="Direct" />
        <ul className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {CHANNELS.map((c, i) => (
            <Reveal
              as="li"
              key={c.label}
              index={i}
              className="border-l border-[var(--color-gold)] pl-5"
            >
              <p className="caption !tracking-[0.14em] text-[var(--color-gold-deep)]">
                {c.label}
              </p>
              <a
                href={c.href}
                {...(c.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="group mt-2 inline-block font-serif text-[1.25rem] md:text-[1.5rem]"
              >
                {c.value}
                <span className="block h-px w-0 bg-[var(--color-gold)] transition-all duration-200 group-hover:w-full" />
              </a>
            </Reveal>
          ))}
        </ul>

        <Reveal index={1}>
          <p className="caption mt-14 !tracking-[0.12em]">
            Studio · {siteSettings.location}
          </p>
        </Reveal>
      </section>

      {/* 02 — the brief, and the form that collects it */}
      <section className="bg-[var(--color-paper-2)]">
        <div className="gutter mx-auto max-w-[90rem] py-20 md:py-28">
          <SectionIndex number="02" label="Your brief" />
          <div className="grid gap-x-12 gap-y-14 md:grid-cols-12">
            <div className="md:col-span-5">
              <Reveal>
                <p className="h2 max-w-[18ch] font-serif">
                  Four things that get you a useful first reply.
                </p>
                <p className="mt-6 max-w-[44ch] text-[var(--color-ink-60)]">
                  None of it has to be resolved. A sentence on each is enough to
                  come back to you with something worth reading.
                </p>
              </Reveal>

              <dl className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 md:grid-cols-1">
                {BRIEF_PROMPTS.map((p, i) => (
                  <Reveal key={p.label} index={i}>
                    <dt className="caption !tracking-[0.14em] text-[var(--color-gold-deep)]">
                      {p.label}
                    </dt>
                    <dd className="mt-2 text-[0.95rem] text-[var(--color-ink-60)]">
                      {p.body}
                    </dd>
                  </Reveal>
                ))}
              </dl>
            </div>

            <div className="md:col-span-7">
              <Reveal>
                <EnquiryForm />
              </Reveal>
              <Reveal index={1}>
                <p className="caption mt-8 max-w-[52ch] !normal-case !tracking-normal">
                  Prefer email? Write to{" "}
                  <a
                    href={`mailto:${siteSettings.email}`}
                    className="text-[var(--color-ink)] underline decoration-[var(--color-gold)] underline-offset-4"
                  >
                    {siteSettings.email}
                  </a>{" "}
                  — it reaches the same inbox.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
