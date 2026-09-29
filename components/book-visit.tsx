"use client";

import { useState } from "react";
import { CalendarDays, X } from "lucide-react";

export function BookVisit() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand-amber px-6 py-3 text-sm font-bold text-brand-navy shadow-soft transition hover:-translate-y-0.5"
      >
        <CalendarDays size={17} />
        Book a School Visit
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-brand-navy/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Book a school visit"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setOpen(false);
          }}
        >
          <div className="w-full max-w-xl rounded-t-[28px] bg-brand-alabaster p-6 shadow-2xl sm:rounded-[28px] sm:p-8">
            <div className="mb-7 flex items-start justify-between gap-5">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-teal">Come experience Avinya</p>
                <h2 className="font-display text-2xl text-brand-navy sm:text-3xl">Book a School Visit</h2>
              </div>
              <button type="button" aria-label="Close" onClick={() => setOpen(false)} className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-border">
                <X size={18} />
              </button>
            </div>

            <form
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                setOpen(false);
              }}
            >
              <label className="block">
                <span className="sr-only">Parent Name</span>
                <input aria-label="Parent Name" className="h-12 w-full rounded-xl border border-brand-border bg-white px-4 outline-none focus:border-brand-teal" placeholder="Parent Name" required />
              </label>
              <label className="block">
                <span className="sr-only">WhatsApp / Phone</span>
                <input aria-label="WhatsApp / Phone" className="h-12 w-full rounded-xl border border-brand-border bg-white px-4 outline-none focus:border-brand-teal" placeholder="WhatsApp / Phone" inputMode="tel" required />
              </label>
              <label className="block">
                <span className="sr-only">Grade Applying For</span>
                <select aria-label="Grade Applying For" className="h-12 w-full rounded-xl border border-brand-border bg-white px-4 outline-none focus:border-brand-teal" required defaultValue="">
                  <option value="" disabled>Grade Applying For</option>
                  <option>Pre-Nursery</option>
                  <option>Nursery</option>
                  <option>LKG</option>
                  <option>UKG</option>
                  <option>Class 1</option>
                </select>
              </label>
              <label className="block">
                <span className="sr-only">Preferred Visit Date</span>
                <input aria-label="Preferred Visit Date" type="date" className="h-12 w-full rounded-xl border border-brand-border bg-white px-4 outline-none focus:border-brand-teal" required />
              </label>
              <button className="min-h-12 w-full rounded-xl bg-brand-navy px-5 py-3 font-bold text-white transition hover:bg-brand-teal" type="submit">
                Request Visit
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
