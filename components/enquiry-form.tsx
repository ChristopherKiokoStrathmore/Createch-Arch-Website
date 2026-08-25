"use client";

import { useActionState } from "react";
import { submitEnquiry } from "@/app/contact/actions";
import { EMPTY_STATE } from "@/app/contact/enquiry-state";
import { siteSettings } from "@/content/seed";

/**
 * Enquiry form (Build prompt §3.5, Phase 4).
 *
 * Wired straight to a Server Action, so it works with JavaScript disabled:
 * React posts the form natively and Next runs the action on the server. With
 * JS, `useActionState` gives us the pending state and inline field errors
 * without a page transition.
 *
 * The fields mirror the four prompts in the "Your brief" section, so what the
 * page asks for and what the form collects stay the same question.
 */
const PROJECT_TYPES = [
  "Hotel or lodge",
  "Restaurant, bar or café",
  "Retail or mixed-use",
  "Private residence",
  "Workplace",
  "Something else",
];

const STAGES = [
  "Just an idea",
  "Feasibility",
  "Concept design",
  "An existing scheme that needs resolving",
  "Ready for site",
];

const FIELD =
  "mt-2 w-full border bg-[var(--color-paper)] px-4 py-3 text-[0.95rem] " +
  "text-[var(--color-ink)] transition-colors placeholder:text-[var(--color-ink-60)] " +
  "focus:border-[var(--color-gold-deep)] focus:outline-none";

const LABEL = "caption !tracking-[0.14em] text-[var(--color-gold-deep)]";

function fieldClass(hasError: boolean) {
  return `${FIELD} ${
    hasError ? "border-[var(--color-gold-deep)]" : "border-[var(--color-line)]"
  }`;
}

export default function EnquiryForm() {
  const [state, formAction, pending] = useActionState(
    submitEnquiry,
    EMPTY_STATE
  );
  const errors = state.fieldErrors ?? {};

  if (state.status === "sent") {
    return (
      <div className="border-l-2 border-[var(--color-gold)] pl-5">
        <p className="h3 font-serif">Thank you — that has reached Anvi.</p>
        <p className="mt-3 max-w-[46ch] text-[var(--color-ink-60)]">
          You can expect a reply within two working days. If it is urgent,
          WhatsApp is faster:{" "}
          <a
            href={`https://wa.me/${siteSettings.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-ink)] underline decoration-[var(--color-gold)] underline-offset-4"
          >
            {siteSettings.phone}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="grid gap-6 sm:grid-cols-2">
      {/* honeypot — real people never see it, bots fill it in */}
      <div aria-hidden="true" className="hidden">
        <label htmlFor="company">Company</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div>
        <label className={LABEL} htmlFor="name">
          Your name
        </label>
        <input
          className={fieldClass(Boolean(errors.name))}
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name && (
          <p id="name-error" className="mt-2 text-[0.85rem]">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label className={LABEL} htmlFor="email">
          Email
        </label>
        <input
          className={fieldClass(Boolean(errors.email))}
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <p id="email-error" className="mt-2 text-[0.85rem]">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label className={LABEL} htmlFor="projectType">
          The project
        </label>
        <select
          className={fieldClass(false)}
          id="projectType"
          name="projectType"
          defaultValue=""
        >
          <option value="" disabled>
            Select one
          </option>
          {PROJECT_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={LABEL} htmlFor="location">
          The site
        </label>
        <input
          className={fieldClass(false)}
          id="location"
          name="location"
          type="text"
          placeholder="Where it is"
        />
      </div>

      <div>
        <label className={LABEL} htmlFor="stage">
          The stage
        </label>
        <select
          className={fieldClass(false)}
          id="stage"
          name="stage"
          defaultValue=""
        >
          <option value="" disabled>
            Select one
          </option>
          {STAGES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={LABEL} htmlFor="timeline">
          The dates
        </label>
        <input
          className={fieldClass(false)}
          id="timeline"
          name="timeline"
          type="text"
          placeholder="On site by, open by"
        />
      </div>

      <div className="sm:col-span-2">
        <label className={LABEL} htmlFor="message">
          Anything else
        </label>
        <textarea
          className={`${fieldClass(Boolean(errors.message))} min-h-[9rem] resize-y`}
          id="message"
          name="message"
          required
          placeholder="A sentence or two is enough."
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
        {errors.message && (
          <p id="message-error" className="mt-2 text-[0.85rem]">
            {errors.message}
          </p>
        )}
      </div>

      {state.status === "error" && state.message && (
        <p
          role="alert"
          className="border-l-2 border-[var(--color-gold-deep)] pl-4 text-[0.95rem] sm:col-span-2"
        >
          {state.message}{" "}
          <a
            href={`mailto:${siteSettings.email}?subject=${encodeURIComponent("Project enquiry")}`}
            className="underline decoration-[var(--color-gold)] underline-offset-4"
          >
            {siteSettings.email}
          </a>
        </p>
      )}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="group border border-[var(--color-ink)] px-7 py-3 text-[0.95rem] font-medium transition-colors hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)] disabled:opacity-50"
        >
          {pending ? "Sending…" : "Send enquiry"}
          <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">
            →
          </span>
        </button>
      </div>
    </form>
  );
}
