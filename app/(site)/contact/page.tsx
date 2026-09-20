import type { Metadata } from "next";
import PageHeader from "@/components/page-header";
import SectionIndex from "@/components/section-index";
import Reveal from "@/components/reveal";
import EnquiryForm from "@/components/enquiry-form";
import {
  contactCopy,
  locationLabel,
  mailtoHref,
  site,
  streetAddress,
  telHref,
  waHref,
} from "@/content";
import { getChrome } from "@/lib/chrome";

export const metadata: Metadata = {
  title: "Contact",
  description: contactCopy.metaDescription,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact · Createch Architects",
    description: contactCopy.metaDescription,
    url: "/contact",
    type: "website",
  },
};

/**
 * Contact. Direct channels first (WhatsApp stays above the form), then the
 * enquiry. Street address only renders when `site.address.line1` is set —
 * we do not invent one.
 */
function channels(chrome: {
  email: string;
  phone: string;
  whatsapp: string;
}) {
  const list: {
    label: string;
    value: string;
    href: string;
    external: boolean;
  }[] = [];

  const email = chrome.email || site.email;
  const phone = chrome.phone || site.phone;
  const whatsapp = chrome.whatsapp || site.whatsapp;

  if (email) {
    list.push({
      label: "Email",
      value: email,
      href: mailtoHref(email),
      external: false,
    });
  }
  if (whatsapp) {
    list.push({
      label: "WhatsApp",
      value: phone,
      href: waHref(whatsapp),
      external: true,
    });
  }
  if (phone) {
    list.push({
      label: "Telephone",
      value: phone,
      href: telHref(phone),
      external: false,
    });
  }
  const street = streetAddress();
  if (street) {
    list.push({
      label: "Address",
      value: `${street}, ${locationLabel()}`,
      href: "#",
      external: false,
    });
  }
  return list;
}

export default async function Contact() {
  const chrome = await getChrome();
  const CHANNELS = channels(chrome.contact);

  return (
    <>
      <PageHeader
        eyebrow={contactCopy.eyebrow}
        title={contactCopy.title}
        lede={contactCopy.lede}
      />

      <section className="gutter mx-auto max-w-[90rem] py-20 md:py-28">
        <SectionIndex
          number={contactCopy.direct.number}
          label={contactCopy.direct.label}
        />
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
              {c.href === "#" ? (
                <p className="mt-2 font-serif text-[1.25rem] md:text-[1.5rem]">
                  {c.value}
                </p>
              ) : (
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
              )}
            </Reveal>
          ))}
        </ul>

        <Reveal index={1}>
          <p className="caption mt-14 !tracking-[0.12em]">
            {contactCopy.studioLabel} · {chrome.contact.location || site.location}
          </p>
        </Reveal>
      </section>

      <section className="bg-[var(--color-paper-2)]">
        <div className="gutter mx-auto max-w-[90rem] py-20 md:py-28">
          <SectionIndex
            number={contactCopy.brief.number}
            label={contactCopy.brief.label}
          />
          <div className="grid gap-x-12 gap-y-14 md:grid-cols-12">
            <div className="md:col-span-5">
              <Reveal>
                <p className="h2 max-w-[18ch] font-serif">
                  {contactCopy.brief.headline}
                </p>
                <p className="mt-6 max-w-[44ch] text-[var(--color-ink-60)]">
                  {contactCopy.brief.lede}
                </p>
              </Reveal>

              <dl className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 md:grid-cols-1">
                {contactCopy.prompts.map((p, i) => (
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
                  {contactCopy.preferEmail}{" "}
                  <a
                    href={mailtoHref(site.email)}
                    className="text-[var(--color-ink)] underline decoration-[var(--color-gold)] underline-offset-4"
                  >
                    {site.email}
                  </a>{" "}
                  {contactCopy.preferEmailTail}
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
