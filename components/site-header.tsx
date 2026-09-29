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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/20 bg-brand-navy/90 text-white backdrop-blur-xl">
      <div className="container-avinya flex h-[76px] items-center justify-between gap-6">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brand-amber/60 bg-white/10 font-display text-lg text-brand-amber">
            A
          </div>
          <div className="min-w-0">
            <div className="font-display text-[15px] tracking-[0.14em]">AVINYA</div>
            <div className="truncate text-[10px] uppercase tracking-[0.24em] text-white/65">Vidya Mandir</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="text-[13px] font-semibold text-white/80 transition hover:text-white">
              {label}
            </Link>
          ))}
          <a href="#book-visit" className="rounded-full bg-brand-amber px-5 py-3 text-[13px] font-bold text-brand-navy transition hover:-translate-y-0.5">
            Book a Visit
          </a>
        </nav>

        <button
          type="button"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 lg:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-brand-navy px-5 pb-6 pt-4 lg:hidden">
          <nav className="container-avinya flex flex-col">
            {links.map(([label, href]) => (
              <Link key={href} href={href} onClick={() => setOpen(false)} className="border-b border-white/10 py-4 text-sm text-white/85">
                {label}
              </Link>
            ))}
            <a href="#book-visit" onClick={() => setOpen(false)} className="mt-4 rounded-full bg-brand-amber px-5 py-4 text-center text-sm font-bold text-brand-navy">
              Book a Visit
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
