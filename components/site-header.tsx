"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  ["About Us", "/about"],
  ["Academics", "/academics"],
  ["Campus", "/campus"],
  ["Care & Safety", "/care-and-safety"],
  ["Admissions", "/admissions"],
  ["Contact", "/contact"]
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-brand-border/80 bg-brand-alabaster/94 text-brand-navy backdrop-blur-xl">
      <div className="container-avinya flex h-[80px] items-center justify-between gap-6">
        <Link href="/" className="flex min-w-0 items-center gap-3" aria-label="Avinya Vidya Mandir home">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-brand-border bg-white">
            <img src="/images/logo.webp" alt="Avinya Vidya Mandir crest" className="h-full w-full object-contain p-1" />
          </div>
          <div className="min-w-0 leading-none">
            <div className="font-display text-[15px] tracking-[0.16em] text-brand-navy">AVINYA</div>
            <div className="mt-1 truncate text-[10px] uppercase tracking-[0.23em] text-brand-navy/45">Vidya Mandir</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="text-[13px] font-semibold text-brand-navy/68 transition hover:text-brand-navy">
              {label}
            </Link>
          ))}
          <a href="#book-visit" className="rounded-full bg-brand-navy px-5 py-3 text-[13px] font-bold text-white shadow-lift transition hover:-translate-y-0.5 hover:bg-brand-navy-soft">
            Book a Visit
          </a>
        </nav>

        <button
          type="button"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-brand-border bg-white lg:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-brand-border bg-brand-alabaster px-5 pb-6 pt-4 lg:hidden">
          <nav className="container-avinya flex flex-col">
            {links.map(([label, href]) => (
              <Link key={href} href={href} onClick={() => setOpen(false)} className="border-b border-brand-border py-4 text-sm font-semibold text-brand-navy/75">
                {label}
              </Link>
            ))}
            <a href="#book-visit" onClick={() => setOpen(false)} className="mt-4 rounded-full bg-brand-navy px-5 py-4 text-center text-sm font-bold text-white">
              Book a Visit
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
