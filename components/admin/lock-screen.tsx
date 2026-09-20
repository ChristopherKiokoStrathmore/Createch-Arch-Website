"use client";

import { useState } from "react";
import { useAdminAuth } from "@/context/admin-auth-context";

export default function LockScreen() {
  const { login } = useAdminAuth();
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const clean = key.trim().replace(/[^\x20-\x7E]/g, "");
    try {
      const res = await fetch("/api/admin/session", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: clean }),
      });
      if (res.status === 503) {
        const body = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        setError(
          body?.error ?? "Admin PIN is not configured on this deployment.",
        );
        return;
      }
      if (res.status === 401) {
        setError("Invalid PIN.");
        return;
      }
      if (!res.ok) {
        setError("Could not sign in. Try again.");
        return;
      }
      login(clean);
    } catch {
      setError("Connection error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-paper)] px-6">
      <div className="w-full max-w-sm">
        <p className="kicker mb-4">Createch Architects</p>
        <h1 className="font-serif text-3xl tracking-[-0.02em]">Admin</h1>
        <p className="mt-3 text-[0.95rem] text-[var(--color-ink-60)]">
          Enter the studio PIN to edit site chrome.
        </p>
        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-4 border border-[var(--color-line)] bg-[var(--color-paper-2)] p-6"
        >
          <label className="block">
            <span className="caption">PIN</span>
            <input
              type="password"
              name="pin"
              autoComplete="current-password"
              required
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="mt-2 w-full border border-[var(--color-line)] bg-[var(--color-paper)] px-3 py-2.5 text-[0.95rem] text-[var(--color-ink)] focus:border-[var(--color-gold-deep)] focus:outline-none"
            />
          </label>
          {error ? (
            <p className="text-sm text-[var(--color-gold-deep)]" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full border border-[var(--color-ink)] bg-[var(--color-ink)] px-4 py-2.5 text-[0.95rem] font-medium text-[var(--color-paper)] transition-colors hover:bg-transparent hover:text-[var(--color-ink)] disabled:opacity-50"
          >
            {loading ? "Checking…" : "Enter"}
          </button>
        </form>
      </div>
    </div>
  );
}
