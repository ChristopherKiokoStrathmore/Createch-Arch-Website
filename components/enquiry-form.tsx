"use client";

import { useActionState } from "react";
import { submitEnquiry } from "@/app/(site)/contact/actions";
import { EMPTY_STATE } from "@/app/(site)/contact/enquiry-state";
import { enquiryCopy, mailtoHref, site, waHref } from "@/content/copy";

/**
 * Enquiry form. Server Action, works without JavaScript.
 * Fields: name, email, phone (optional), project type (optional), plus the
 * brief prompts (site, stage, dates) and a message. Honeypot on `company`.
 */
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
        <p className="h3 font-serif">{enquiryCopy.sentTitle}</p>
        <p className="mt-3 max-w-[46ch] text-[var(--color-ink-60)]">
          {enquiryCopy.sentBody}{" "}
          <a
            href={waHref(site.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-ink)] underline decoration-[var(--color-gold)] underline-offset-4"
          >
            {site.phone}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="grid gap-6 sm:grid-cols-2">
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
        <label className={LABEL} htmlFor="phone">
          Phone
        </label>
        <input
          className={fieldClass(Boolean(errors.phone))}
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder={enquiryCopy.placeholders.phone}
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? "phone-error" : undefined}
        />
        {errors.phone && (
          <p id="phone-error" className="mt-2 text-[0.85rem]">
            {errors.phone}
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
          <option value="">Select one — optional</option>
          {enquiryCopy.projectTypes.map((t) => (
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
          placeholder={enquiryCopy.placeholders.location}
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
          <option value="">Select one — optional</option>
          {enquiryCopy.stages.map((s) => (
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
          placeholder={enquiryCopy.placeholders.timeline}
        />
      </div>

      <div className="sm:col-span-2">
        <label className={LABEL} htmlFor="message">
          Message
        </label>
        <textarea
          className={`${fieldClass(Boolean(errors.message))} min-h-[9rem] resize-y`}
          id="message"
          name="message"
          required
          placeholder={enquiryCopy.placeholders.message}
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
            href={mailtoHref(site.email, "Project enquiry")}
            className="underline decoration-[var(--color-gold)] underline-offset-4"
          >
            {site.email}
          </a>
        </p>
      )}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="group border border-[var(--color-ink)] px-7 py-3 text-[0.95rem] font-medium transition-colors hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)] disabled:opacity-50"
        >
          {pending ? enquiryCopy.pending : enquiryCopy.submit}
          <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">
            →
          </span>
        </button>
      </div>
    </form>
  );
}
