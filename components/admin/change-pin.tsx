"use client";

import { useState } from "react";
import { useAdminAuth } from "@/context/admin-auth-context";

const FIELD =
  "mt-2 w-full border border-[var(--color-line)] bg-[var(--color-paper)] px-3 py-2 text-[0.95rem] text-[var(--color-ink)] focus:border-[var(--color-gold-deep)] focus:outline-none";

export default function ChangePin() {
  const { headers, login } = useAdminAuth();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (next !== confirm) {
      setError("The new PIN and its confirmation do not match.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/admin/pin", {
        method: "PUT",
        credentials: "include",
        headers: { ...headers(), "Content-Type": "application/json" },
        body: JSON.stringify({ current, next }),
      });
      const body = (await res.json().catch(() => null)) as
        | { error?: string }
        | null;
      if (!res.ok) {
        setError(body?.error ?? "Could not change the PIN.");
        return;
      }
      login(next);
      setCurrent("");
      setNext("");
      setConfirm("");
      setMessage("PIN changed. Any other open admin sessions are now signed out.");
    } catch {
      setError("Connection error. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mt-10 border border-[var(--color-line)] p-6 md:p-8">
      <h2 className="font-serif text-2xl">Change PIN</h2>
      <p className="mt-2 text-[0.95rem] text-[var(--color-ink-60)]">
        6–64 characters. The new PIN replaces the one set in Vercel, which
        stops working once you save.
      </p>
      <form onSubmit={submit} className="mt-6 grid gap-5">
        <label className="block">
          <span className="caption">Current PIN</span>
          <input
            type="password"
            autoComplete="current-password"
            required
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            className={FIELD}
          />
        </label>
        <label className="block">
          <span className="caption">New PIN</span>
          <input
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            maxLength={64}
            value={next}
            onChange={(e) => setNext(e.target.value)}
            className={FIELD}
          />
        </label>
        <label className="block">
          <span className="caption">Confirm new PIN</span>
          <input
            type="password"
            autoComplete="new-password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className={FIELD}
          />
        </label>
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
        <div>
          <button
            type="submit"
            disabled={busy}
            className="border border-[var(--color-ink)] px-6 py-2.5 text-[0.95rem] font-medium text-[var(--color-ink)] transition-colors hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)] disabled:opacity-50"
          >
            {busy ? "Changing…" : "Change PIN"}
          </button>
        </div>
      </form>
    </section>
  );
}
