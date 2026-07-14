"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "./logo";

const LINKS = [
  { href: "/work", label: "Work" },
  { href: "/studio", label: "Studio" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // lock body scroll when the mobile overlay is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-[var(--color-line)] bg-[var(--color-paper)]/80 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <nav className="gutter mx-auto flex max-w-[90rem] items-center justify-between py-4">
        <Link href="/" aria-label="Createch Architects — home" onClick={() => setOpen(false)}>
          <Logo variant="mark" className="md:hidden" />
          <Logo variant="full" className="hidden md:inline-flex" />
        </Link>

        {/* desktop links */}
        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
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

        {/* mobile toggle */}
        <button
          type="button"
          className="caption !tracking-[0.12em] text-[var(--color-ink)] md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      {/* mobile overlay — full-screen paper, plain */}
      {open && (
        <div
          id="mobile-menu"
          className="fixed inset-0 top-[57px] z-40 bg-[var(--color-paper)] md:hidden"
        >
          <ul className="gutter flex flex-col gap-6 py-10">
            {LINKS.map((l) => (
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
