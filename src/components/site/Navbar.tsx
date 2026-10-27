"use client";

import { useState } from "react";
import { Close, Menu } from "@/components/icons";

const links = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#work", label: "Portfolio" },
  { href: "#contact", label: "Contact" },
];

export function Navbar({ brand, ctaLabel }: { brand: string; ctaLabel: string | null }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative z-20 flex items-center justify-between gap-4">
      <a href="#home" className="text-lg font-semibold tracking-tight text-ink">
        {brand}
      </a>

      <nav className="hidden items-center gap-8 text-sm text-ink-soft md:flex">
        {links.map((l) => (
          <a key={l.href} href={l.href} className="transition hover:text-ink">
            {l.label}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        {ctaLabel && (
          <a
            href="#contact"
            className="hidden rounded-full bg-ink px-5 py-2 text-xs font-medium text-white shadow-lg shadow-ink/20 transition hover:bg-ink-soft sm:inline-block"
          >
            {ctaLabel}
          </a>
        )}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="glass grid size-10 place-items-center rounded-full text-ink md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <Close /> : <Menu />}
        </button>
      </div>

      {open && (
        <nav className="glass-strong absolute top-14 right-0 left-0 flex flex-col rounded-3xl p-3 md:hidden">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-2xl px-4 py-3 text-sm text-ink-soft hover:bg-white/60"
            >
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
