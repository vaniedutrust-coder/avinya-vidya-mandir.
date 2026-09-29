"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ArrowRight, CalendarDays, CheckCircle2, X } from "lucide-react";

export function BookVisit() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    firstFieldRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setSubmitted(false);
          setOpen(true);
        }}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-brand-amber/45 bg-brand-amber px-6 py-3 text-sm font-bold text-brand-navy shadow-lift transition duration-300 hover:-translate-y-0.5 hover:bg-[#D0B37E]"
      >
        <CalendarDays size={17} strokeWidth={1.8} />
        Book a School Visit
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-brand-navy/70 p-0 backdrop-blur-md sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setOpen(false);
          }}
        >
          <div
            ref={dialogRef}
            className="w-full max-w-xl overflow-hidden rounded-t-[30px] border border-brand-border bg-brand-alabaster shadow-2xl sm:rounded-[30px]"
          >
            <div className="bg-brand-navy px-6 py-6 text-white sm:px-8">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.24em] text-brand-amber">Come experience Avinya</p>
                  <h2 id={titleId} className="font-display text-2xl leading-tight sm:text-3xl">Book a School Visit</h2>
                  <p className="mt-3 max-w-md text-sm leading-6 text-white/60">Tell us a little about your child and preferred visit date. Our admissions team can take it from there.</p>
                </div>
                <button type="button" aria-label="Close visit booking" onClick={() => setOpen(false)} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition hover:bg-white/10 hover:text-white">
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              {submitted ? (
                <div className="py-8 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-teal-soft text-brand-teal-deep">
                    <CheckCircle2 size={28} />
                  </div>
                  <h3 className="mt-5 font-display text-2xl text-brand-navy">Thank you.</h3>
                  <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-brand-navy/60">Your visit request has been captured for the current prototype. We’ll connect this to the admissions desk next.</p>
                  <button type="button" onClick={() => setOpen(false)} className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-brand-navy px-5 py-3 text-sm font-bold text-white hover:bg-brand-navy-soft">
                    Close <ArrowRight size={16} />
                  </button>
                </div>
              ) : (
                <form className="space-y-5" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-brand-navy/48">Parent Name</span>
                    <input ref={firstFieldRef} className="h-12 w-full rounded-xl border border-brand-border bg-white px-4 text-sm text-brand-navy outline-none transition placeholder:text-brand-navy/35 focus:border-brand-teal-deep focus:ring-2 focus:ring-brand-teal/10" placeholder="Your name" required />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-brand-navy/48">WhatsApp / Phone</span>
                    <input className="h-12 w-full rounded-xl border border-brand-border bg-white px-4 text-sm text-brand-navy outline-none transition placeholder:text-brand-navy/35 focus:border-brand-teal-deep focus:ring-2 focus:ring-brand-teal/10" placeholder="+91 ..." inputMode="tel" required />
                  </label>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-brand-navy/48">Grade</span>
                      <select className="h-12 w-full rounded-xl border border-brand-border bg-white px-4 text-sm text-brand-navy outline-none focus:border-brand-teal-deep focus:ring-2 focus:ring-brand-teal/10" required defaultValue="">
                        <option value="" disabled>Select grade</option>
                        <option>Pre-Nursery</option>
                        <option>Nursery</option>
                        <option>LKG</option>
                        <option>UKG</option>
                        <option>Class 1</option>
                      </select>
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-brand-navy/48">Preferred Date</span>
                      <input type="date" className="h-12 w-full rounded-xl border border-brand-border bg-white px-4 text-sm text-brand-navy outline-none focus:border-brand-teal-deep focus:ring-2 focus:ring-brand-teal/10" required />
                    </label>
                  </div>
                  <label className="flex items-start gap-3 text-xs leading-5 text-brand-navy/52">
                    <input type="checkbox" required className="mt-0.5 h-4 w-4 rounded border-brand-border accent-brand-teal-deep" />
                    <span>I agree to be contacted regarding my Avinya enquiry and school visit.</span>
                  </label>
                  <button className="group flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-navy px-5 py-3 text-sm font-bold text-white shadow-lift transition hover:bg-brand-navy-soft" type="submit">
                    Request Visit
                    <ArrowRight size={17} className="transition group-hover:translate-x-0.5" />
                  </button>
                  <p className="text-center text-[11px] leading-5 text-brand-navy/40">Your details are intended for Avinya Vidya Mandir admissions communication.</p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
