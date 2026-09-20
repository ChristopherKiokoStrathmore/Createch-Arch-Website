"use client";

import { useCallback, useRef, useState } from "react";
import type { ChromeConfig, ChromeImage } from "@/lib/chrome-types";
import { useAdminAuth } from "@/context/admin-auth-context";

type Props = {
  chrome: ChromeConfig;
  onChange: (next: ChromeConfig) => void;
  onBusy: (busy: boolean) => void;
  onError: (message: string) => void;
  uploadsEnabled: boolean;
};

export default function ImageLibrary({
  chrome,
  onChange,
  onBusy,
  onError,
  uploadsEnabled,
}: Props) {
  const { headers, signOut } = useAdminAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const library = chrome.images.library;

  const commitLibrary = useCallback(
    (next: ChromeImage[], slots = chrome.images.slots) => {
      const ordered = next.map((img, i) => ({ ...img, order: i }));
      const ids = new Set(ordered.map((img) => img.id));
      const hero = slots.hero && ids.has(slots.hero) ? slots.hero : null;
      const gallery = slots.gallery.filter((id) => ids.has(id));
      const heroImg = hero ? ordered.find((img) => img.id === hero) : undefined;
      onChange({
        ...chrome,
        hero: {
          ...chrome.hero,
          imageId: hero,
          imageUrl: heroImg?.url ?? null,
        },
        images: {
          library: ordered,
          slots: { hero, gallery },
        },
      });
    },
    [chrome, onChange],
  );

  async function upload(file: File) {
    onBusy(true);
    onError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/images", {
        method: "POST",
        credentials: "include",
        headers: headers(),
        body,
      });
      const json = (await res.json().catch(() => null)) as
        | { image?: ChromeImage; error?: string }
        | null;
      if (res.status === 401) {
        await signOut();
        return;
      }
      if (!res.ok || !json?.image) {
        onError(json?.error ?? "Upload failed");
        return;
      }
      if (library.some((img) => img.id === json.image!.id)) return;
      commitLibrary([...library, json.image]);
    } catch {
      onError("Upload failed");
    } finally {
      onBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function move(id: string, dir: -1 | 1) {
    const index = library.findIndex((img) => img.id === id);
    const next = index + dir;
    if (index < 0 || next < 0 || next >= library.length) return;
    const copy = [...library];
    const [item] = copy.splice(index, 1);
    copy.splice(next, 0, item);
    commitLibrary(copy);
  }

  function onDrop(targetId: string) {
    if (!dragId || dragId === targetId) {
      setDragId(null);
      return;
    }
    const from = library.findIndex((img) => img.id === dragId);
    const to = library.findIndex((img) => img.id === targetId);
    if (from < 0 || to < 0) {
      setDragId(null);
      return;
    }
    const copy = [...library];
    const [item] = copy.splice(from, 1);
    copy.splice(to, 0, item);
    commitLibrary(copy);
    setDragId(null);
  }

  function assignHero(id: string | null) {
    commitLibrary(library, { ...chrome.images.slots, hero: id });
  }

  function setGalleryAt(index: number, id: string) {
    const gallery = [...chrome.images.slots.gallery];
    if (!id) {
      gallery.splice(index, 1);
    } else {
      gallery[index] = id;
    }
    commitLibrary(library, { ...chrome.images.slots, gallery });
  }

  function addGallerySlot() {
    const unused = library.find(
      (img) => !chrome.images.slots.gallery.includes(img.id),
    );
    if (!unused) return;
    commitLibrary(library, {
      ...chrome.images.slots,
      gallery: [...chrome.images.slots.gallery, unused.id],
    });
  }

  async function remove(id: string) {
    if (!window.confirm("Remove this image from the library?")) return;
    onBusy(true);
    try {
      const res = await fetch(`/api/admin/images?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        credentials: "include",
        headers: headers(),
      });
      if (res.status === 401) {
        await signOut();
        return;
      }
      commitLibrary(library.filter((img) => img.id !== id));
    } catch {
      onError("Could not remove image");
    } finally {
      onBusy(false);
    }
  }

  return (
    <section className="border border-[var(--color-line)] p-6 md:p-8">
      <h2 className="font-serif text-2xl">Image library</h2>
      <p className="mt-2 max-w-[62ch] text-[0.95rem] text-[var(--color-ink-60)]">
        Files go to the Railway image API. This site only stores IDs, URLs and
        slot assignments — never the bytes. Assign plates to the hero or to
        gallery positions; do not invent project names here.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void upload(file);
          }}
        />
        <button
          type="button"
          disabled={!uploadsEnabled}
          onClick={() => inputRef.current?.click()}
          className="border border-[var(--color-ink)] px-4 py-2 text-[0.9rem] font-medium disabled:cursor-not-allowed disabled:opacity-40"
        >
          Upload image
        </button>
        {!uploadsEnabled ? (
          <p className="text-sm text-[var(--color-gold-deep)]">
            Set CREATECH_API_URL and ARCH_ADMIN_SECRET to enable uploads.
          </p>
        ) : null}
      </div>

      {library.length === 0 ? (
        <p className="mt-8 text-[0.95rem] text-[var(--color-ink-60)]">
          No images in the library yet.
        </p>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {library.map((img, index) => (
            <li
              key={img.id}
              draggable
              onDragStart={() => setDragId(img.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDrop(img.id)}
              className={`border border-[var(--color-line)] bg-[var(--color-paper-2)] p-3 ${
                dragId === img.id ? "opacity-60" : ""
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.alt || ""}
                className="aspect-[4/3] w-full object-cover bg-[var(--color-paper)]"
              />
              <p className="caption mt-3 truncate !normal-case !tracking-normal">
                {img.filename || img.id}
              </p>
              <label className="mt-3 block">
                <span className="caption">Alt</span>
                <input
                  value={img.alt}
                  onChange={(e) => {
                    const next = library.map((item) =>
                      item.id === img.id
                        ? { ...item, alt: e.target.value }
                        : item,
                    );
                    commitLibrary(next);
                  }}
                  className="mt-1 w-full border border-[var(--color-line)] bg-[var(--color-paper)] px-2 py-1.5 text-sm"
                />
              </label>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => move(img.id, -1)}
                  disabled={index === 0}
                  className="border border-[var(--color-line)] px-2 py-1 text-xs uppercase tracking-[0.12em] disabled:opacity-30"
                >
                  Up
                </button>
                <button
                  type="button"
                  onClick={() => move(img.id, 1)}
                  disabled={index === library.length - 1}
                  className="border border-[var(--color-line)] px-2 py-1 text-xs uppercase tracking-[0.12em] disabled:opacity-30"
                >
                  Down
                </button>
                <button
                  type="button"
                  onClick={() => void remove(img.id)}
                  className="border border-[var(--color-line)] px-2 py-1 text-xs uppercase tracking-[0.12em] text-[var(--color-gold-deep)]"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <label className="block">
          <span className="caption">Hero slot</span>
          <select
            value={chrome.images.slots.hero ?? ""}
            onChange={(e) => assignHero(e.target.value || null)}
            className="mt-2 w-full border border-[var(--color-line)] bg-[var(--color-paper)] px-3 py-2 text-[0.95rem]"
          >
            <option value="">Built-in hero frame</option>
            {library.map((img) => (
              <option key={img.id} value={img.id}>
                {img.filename || img.alt || img.id}
              </option>
            ))}
          </select>
        </label>
        <div>
          <div className="flex items-center justify-between gap-4">
            <p className="caption">Gallery positions</p>
            <button
              type="button"
              onClick={addGallerySlot}
              disabled={
                library.length === 0 ||
                chrome.images.slots.gallery.length >= library.length
              }
              className="text-xs uppercase tracking-[0.12em] underline decoration-[var(--color-gold)] underline-offset-4 disabled:no-underline disabled:opacity-40"
            >
              Add position
            </button>
          </div>
          {chrome.images.slots.gallery.length === 0 ? (
            <p className="mt-2 text-sm text-[var(--color-ink-60)]">
              Empty — the public gallery band stays hidden.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {chrome.images.slots.gallery.map((id, i) => (
                <li key={`${id}-${i}`} className="flex gap-2">
                  <select
                    value={id}
                    onChange={(e) => setGalleryAt(i, e.target.value)}
                    className="w-full border border-[var(--color-line)] bg-[var(--color-paper)] px-3 py-2 text-sm"
                  >
                    {library.map((img) => (
                      <option key={img.id} value={img.id}>
                        {i + 1}. {img.filename || img.alt || img.id}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setGalleryAt(i, "")}
                    className="border border-[var(--color-line)] px-2 text-xs uppercase tracking-[0.12em]"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
