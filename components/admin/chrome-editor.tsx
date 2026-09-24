"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ChangePin from "@/components/admin/change-pin";
import ImageLibrary from "@/components/admin/image-library";
import { useAdminAuth } from "@/context/admin-auth-context";
import { DEFAULT_CHROME } from "@/lib/chrome-defaults";
import type { ChromeConfig, ChromePersistence } from "@/lib/chrome-types";

const FIELD =
  "mt-2 w-full border border-[var(--color-line)] bg-[var(--color-paper)] px-3 py-2 text-[0.95rem] text-[var(--color-ink)] focus:border-[var(--color-gold-deep)] focus:outline-none";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="caption">{label}</span>
      {children}
      {hint ? (
        <span className="mt-1 block text-xs text-[var(--color-ink-60)]">
          {hint}
        </span>
      ) : null}
    </label>
  );
}

export default function ChromeEditor() {
  const { headers, signOut } = useAdminAuth();
  const [chrome, setChrome] = useState<ChromeConfig>(DEFAULT_CHROME);
  const [persistence, setPersistence] = useState<ChromePersistence | null>(
    null,
  );
  const [uploadsEnabled, setUploadsEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    async function run() {
      try {
        const res = await fetch("/api/admin/chrome", {
          credentials: "include",
          headers: headers(),
          cache: "no-store",
        });
        if (ignore) return;
        if (res.status === 401) {
          await signOut();
          return;
        }
        if (!res.ok) {
          const body = (await res.json().catch(() => null)) as
            | { error?: string }
            | null;
          if (!ignore) setError(body?.error ?? "Could not load chrome");
          return;
        }
        const body = (await res.json()) as {
          chrome: ChromeConfig;
          persistence: ChromePersistence;
          uploadsEnabled?: boolean;
        };
        if (ignore) return;
        setChrome(body.chrome);
        setPersistence(body.persistence);
        setUploadsEnabled(Boolean(body.uploadsEnabled));
      } catch {
        if (!ignore) setError("Could not load chrome");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    void run();
    return () => {
      ignore = true;
    };
  }, [headers, signOut]);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/admin/chrome", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...headers(),
        },
        body: JSON.stringify({ chrome }),
      });
      const body = (await res.json().catch(() => null)) as {
        chrome?: ChromeConfig;
        persistence?: ChromePersistence;
        error?: string;
      } | null;
      if (res.status === 401) {
        await signOut();
        return;
      }
      if (!res.ok) {
        setError(body?.error ?? "Save failed");
        return;
      }
      if (body?.chrome) setChrome(body.chrome);
      if (body?.persistence) setPersistence(body.persistence);
      setMessage("Saved. Public pages will refresh on the next visit.");
    } catch {
      setError("Save failed");
    } finally {
      setBusy(false);
    }
  }

  const colours = chrome.colours;

  return (
    <div className="min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)]">
      <header className="border-b border-[var(--color-line)]">
        <div className="gutter mx-auto flex max-w-[90rem] items-center justify-between py-5">
          <div>
            <p className="kicker">Createch Architects</p>
            <h1 className="mt-1 font-serif text-2xl md:text-3xl">Site chrome</h1>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <Link
              href="/"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-[var(--color-gold)] underline-offset-4"
            >
              View site
            </Link>
            <button
              type="button"
              onClick={() => void signOut()}
              className="text-[var(--color-ink-60)]"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="gutter mx-auto max-w-[52rem] py-12 md:py-16">
        {persistence?.warning ? (
          <p
            className="mb-8 border-l-2 border-[var(--color-gold)] pl-4 text-sm text-[var(--color-ink-60)]"
            role="status"
          >
            {persistence.warning}
          </p>
        ) : persistence?.durable ? (
          <p className="caption mb-8 !normal-case !tracking-normal">
            Persistence: {persistence.kind}
            {chrome.updatedAt
              ? ` · last saved ${chrome.updatedAt}`
              : " · using defaults until you save"}
          </p>
        ) : null}

        {loading ? (
          <p className="text-[var(--color-ink-60)]">Loading…</p>
        ) : (
          <form onSubmit={save} className="space-y-10">
            <section className="border border-[var(--color-line)] p-6 md:p-8">
              <h2 className="font-serif text-2xl">Colours</h2>
              <p className="mt-2 text-[0.95rem] text-[var(--color-ink-60)]">
                Tokens for paper, ink and gold. Gold is an accent, not a
                surface.
              </p>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {(
                  [
                    ["paper", "Paper"],
                    ["paper2", "Paper 2"],
                    ["ink", "Ink"],
                    ["gold", "Gold"],
                    ["goldDeep", "Gold (text)"],
                  ] as const
                ).map(([key, label]) => (
                  <Field key={key} label={label}>
                    <span className="mt-2 flex gap-2">
                      <input
                        type="color"
                        value={colours[key]}
                        onChange={(e) =>
                          setChrome({
                            ...chrome,
                            colours: { ...colours, [key]: e.target.value },
                          })
                        }
                        className="h-10 w-10 shrink-0 cursor-pointer border border-[var(--color-line)] bg-transparent"
                      />
                      <input
                        value={colours[key]}
                        onChange={(e) =>
                          setChrome({
                            ...chrome,
                            colours: { ...colours, [key]: e.target.value },
                          })
                        }
                        className={FIELD + " font-mono uppercase"}
                        spellCheck={false}
                      />
                    </span>
                  </Field>
                ))}
              </div>
            </section>

            <section className="border border-[var(--color-line)] p-6 md:p-8">
              <h2 className="font-serif text-2xl">Navigation</h2>
              <div className="mt-6 space-y-4">
                {chrome.nav.links.map((link, i) => (
                  <Field key={link.href} label={link.href}>
                    <input
                      value={link.label}
                      onChange={(e) => {
                        const links = chrome.nav.links.map((item, idx) =>
                          idx === i ? { ...item, label: e.target.value } : item,
                        );
                        setChrome({ ...chrome, nav: { links } });
                      }}
                      className={FIELD}
                    />
                  </Field>
                ))}
              </div>
            </section>

            <section className="border border-[var(--color-line)] p-6 md:p-8">
              <h2 className="font-serif text-2xl">Hero line</h2>
              <div className="mt-6 grid gap-5">
                <Field label="Kicker">
                  <input
                    value={chrome.hero.kicker}
                    onChange={(e) =>
                      setChrome({
                        ...chrome,
                        hero: { ...chrome.hero, kicker: e.target.value },
                      })
                    }
                    className={FIELD}
                  />
                </Field>
                <Field label="Title">
                  <input
                    value={chrome.hero.title}
                    onChange={(e) =>
                      setChrome({
                        ...chrome,
                        hero: { ...chrome.hero, title: e.target.value },
                      })
                    }
                    className={FIELD}
                  />
                </Field>
                <Field label="Strap">
                  <input
                    value={chrome.hero.strap}
                    onChange={(e) =>
                      setChrome({
                        ...chrome,
                        hero: { ...chrome.hero, strap: e.target.value },
                      })
                    }
                    className={FIELD}
                  />
                </Field>
                <Field label="Lede">
                  <textarea
                    value={chrome.hero.lede}
                    onChange={(e) =>
                      setChrome({
                        ...chrome,
                        hero: { ...chrome.hero, lede: e.target.value },
                      })
                    }
                    rows={4}
                    className={FIELD}
                  />
                </Field>
                <Field label="CTA">
                  <input
                    value={chrome.hero.cta}
                    onChange={(e) =>
                      setChrome({
                        ...chrome,
                        hero: { ...chrome.hero, cta: e.target.value },
                      })
                    }
                    className={FIELD}
                  />
                </Field>
                <Field label="Hero image alt">
                  <input
                    value={chrome.hero.imageAlt}
                    onChange={(e) =>
                      setChrome({
                        ...chrome,
                        hero: { ...chrome.hero, imageAlt: e.target.value },
                      })
                    }
                    className={FIELD}
                  />
                </Field>
              </div>
            </section>

            <section className="border border-[var(--color-line)] p-6 md:p-8">
              <h2 className="font-serif text-2xl">Contact strip</h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <Field label="Section label">
                  <input
                    value={chrome.contact.label}
                    onChange={(e) =>
                      setChrome({
                        ...chrome,
                        contact: { ...chrome.contact, label: e.target.value },
                      })
                    }
                    className={FIELD}
                  />
                </Field>
                <Field label="Headline">
                  <input
                    value={chrome.contact.headline}
                    onChange={(e) =>
                      setChrome({
                        ...chrome,
                        contact: {
                          ...chrome.contact,
                          headline: e.target.value,
                        },
                      })
                    }
                    className={FIELD}
                  />
                </Field>
                <Field label="Email">
                  <input
                    type="email"
                    value={chrome.contact.email}
                    onChange={(e) =>
                      setChrome({
                        ...chrome,
                        contact: { ...chrome.contact, email: e.target.value },
                      })
                    }
                    className={FIELD}
                  />
                </Field>
                <Field label="Phone">
                  <input
                    value={chrome.contact.phone}
                    onChange={(e) =>
                      setChrome({
                        ...chrome,
                        contact: { ...chrome.contact, phone: e.target.value },
                      })
                    }
                    className={FIELD}
                  />
                </Field>
                <Field label="WhatsApp id" hint="Digits only, country code included.">
                  <input
                    value={chrome.contact.whatsapp}
                    onChange={(e) =>
                      setChrome({
                        ...chrome,
                        contact: {
                          ...chrome.contact,
                          whatsapp: e.target.value,
                        },
                      })
                    }
                    className={FIELD}
                  />
                </Field>
                <Field label="Location">
                  <input
                    value={chrome.contact.location}
                    onChange={(e) =>
                      setChrome({
                        ...chrome,
                        contact: {
                          ...chrome.contact,
                          location: e.target.value,
                        },
                      })
                    }
                    className={FIELD}
                  />
                </Field>
              </div>
            </section>

            <section className="border border-[var(--color-line)] p-6 md:p-8">
              <h2 className="font-serif text-2xl">SEO band</h2>
              <p className="mt-2 text-[0.95rem] text-[var(--color-ink-60)]">
                Optional placeholders for the site-wide title and description.
                WordPress SEO is a later layer — leave blank to keep the
                existing copy.
              </p>
              <div className="mt-6 grid gap-5">
                <Field label="Title">
                  <input
                    value={chrome.seo.title}
                    onChange={(e) =>
                      setChrome({
                        ...chrome,
                        seo: { ...chrome.seo, title: e.target.value },
                      })
                    }
                    className={FIELD}
                  />
                </Field>
                <Field label="Description">
                  <textarea
                    value={chrome.seo.description}
                    onChange={(e) =>
                      setChrome({
                        ...chrome,
                        seo: { ...chrome.seo, description: e.target.value },
                      })
                    }
                    rows={3}
                    className={FIELD}
                  />
                </Field>
                <Field label="OG image alt">
                  <input
                    value={chrome.seo.ogAlt}
                    onChange={(e) =>
                      setChrome({
                        ...chrome,
                        seo: { ...chrome.seo, ogAlt: e.target.value },
                      })
                    }
                    className={FIELD}
                  />
                </Field>
              </div>
            </section>

            <ImageLibrary
              chrome={chrome}
              onChange={setChrome}
              onBusy={setBusy}
              onError={setError}
              uploadsEnabled={uploadsEnabled}
            />

            {error ? (
              <p className="text-sm text-[var(--color-gold-deep)]" role="alert">
                {error}
              </p>
            ) : null}
            {message ? (
              <p className="text-sm text-[var(--color-ink-60)]" role="status">
                {message}
              </p>
            ) : null}

            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={busy}
                className="border border-[var(--color-ink)] bg-[var(--color-ink)] px-6 py-2.5 text-[0.95rem] font-medium text-[var(--color-paper)] transition-colors hover:bg-transparent hover:text-[var(--color-ink)] disabled:opacity-50"
              >
                {busy ? "Saving…" : "Save chrome"}
              </button>
              <p className="text-xs text-[var(--color-ink-60)]">
                Image bytes stay on Railway. This save writes layout JSON only.
              </p>
            </div>
          </form>
        )}
        {loading ? null : <ChangePin />}
      </div>
    </div>
  );
}
