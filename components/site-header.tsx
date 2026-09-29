"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  ["About Us", "/about"], ["Academics", "/academics"], ["Campus", "/campus"],
  ["Care & Safety", "/care-and-safety"], ["Life at Avinya", "/life-at-avinya"], ["Admissions", "/admissions"], ["Contact", "/contact"]
];

const accents: Record<string, string> = {
  "/": "#1F5B46", "/about": "#E85B2A", "/academics": "#C99624", "/campus": "#1F5B46",
  "/care-and-safety": "#1F5B46", "/life-at-avinya": "#E85B2A", "/faculty": "#1F5B46",
  "/admissions": "#C99624", "/visit": "#E85B2A", "/news": "#E85B2A", "/gallery": "#1F5B46", "/contact": "#E85B2A"
};

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const accent = accents[pathname] ?? "#1F5B46";

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-brand-border/80 bg-white/96 text-brand-ink backdrop-blur-xl" style={{ "--header-accent": accent } as React.CSSProperties}>
      <div className="container-avinya flex h-[78px] items-center justify-between gap-6">
        <Link href="/" className="flex min-w-0 items-center gap-3" aria-label="Avinya Vidya Mandir home">
          <img src="/images/logo.webp" alt="Avinya Vidya Mandir crest" className="h-12 w-auto object-contain" />
          <div className="hidden min-w-0 leading-none sm:block">
            <div className="font-display text-[15px] tracking-[0.14em] text-brand-ink">AVINYA</div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.22em] text-brand-ink/45">Vidya Mandir</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="relative py-3 text-[12px] font-semibold text-brand-ink/65 transition hover:text-brand-ink">
              {label}
              {pathname === href && <span className="absolute inset-x-0 bottom-0 h-0.5" style={{ background: accent }} />}
            </Link>
          ))}
          <a href="#book-visit" className="px-5 py-3 text-[12px] font-bold text-white shadow-lift transition hover:-translate-y-0.5" style={{ background: accent }}>
            Book a Visit <span className="ml-2">→</span>
          </a>
        </nav>

        <button type="button" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} onClick={() => setOpen(v => !v)} className="flex h-12 w-12 items-center justify-center border border-brand-border bg-white lg:hidden" style={{ color: accent }}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-brand-border bg-white px-5 pb-6 pt-4 lg:hidden">
          <nav className="container-avinya flex flex-col">
            {links.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)} className="border-b border-brand-border py-4 text-sm font-semibold text-brand-ink/75">{label}</Link>)}
            <a href="#book-visit" onClick={() => setOpen(false)} className="mt-4 px-5 py-4 text-center text-sm font-bold text-white" style={{ background: accent }}>Book a Visit</a>
          </nav>
        </div>
      )}
    </header>
  );
}