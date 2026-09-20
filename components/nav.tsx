"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import Logo from "./logo";
import type { ChromeNavLink } from "@/lib/chrome-types";

export default function Nav({ links }: { links: readonly ChromeNavLink[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const bar = headerRef.current?.querySelector("nav");
    if (!bar) return;
    const publish = () =>
      headerRef.current?.style.setProperty("--nav-h", `${bar.offsetHeight}px`);
    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(bar);
    return () => observer.disconnect();
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusables = () =>
      Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])'
        ) ?? []
      );
    focusables()[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab") return;

      const items = [...focusables(), toggleRef.current].filter(
        (el): el is HTMLElement => Boolean(el)
      );
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, close]);

  return (
    <header ref={headerRef} className="fixed inset-x-0 top-0 z-50">
      <nav
        className={`gutter mx-auto flex max-w-[90rem] items-center justify-between py-4 transition-colors duration-300 ${
          scrolled || open
            ? "border-b border-[var(--color-line)] bg-[var(--color-paper)]/80 backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <Link href="/" aria-label="Createch Architects — home" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="caption !tracking-[0.12em] text-[var(--color-ink)] transition-colors hover:text-[var(--color-gold-deep)]"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          ref={toggleRef}
          type="button"
          className="caption !tracking-[0.12em] text-[var(--color-ink)] md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      {open && (
        <div
          ref={panelRef}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-x-0 bottom-0 top-[var(--nav-h,3.5rem)] z-40 overflow-y-auto bg-[var(--color-paper)] md:hidden"
        >
          <ul className="gutter flex flex-col gap-6 py-10">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="h3 font-serif text-[var(--color-ink)]"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
