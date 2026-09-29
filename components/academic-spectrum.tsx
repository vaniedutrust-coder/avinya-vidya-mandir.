"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

const stages = [
  ["Pre-Nursery", "Curiosity begins", "A gentle first environment where language, movement, routines and sensory discovery build a confident start."],
  ["Nursery", "Language takes root", "Phonics, bilingual communication, imaginative play and hands-on experiences help children connect words with the world."],
  ["LKG", "Discovery deepens", "Children begin to explain, compare, make, move and collaborate through a carefully sequenced foundational programme."],
  ["UKG", "Confidence grows", "Foundational literacy, numeracy and self-management develop alongside creative expression, inquiry and play."],
  ["Class 1", "Ready to rise", "A stronger academic rhythm emerges without losing the warmth, movement and curiosity of the foundational years."]
];

export function AcademicSpectrum() {
  const [active, setActive] = useState(0);
  const stage = stages[active];

  return (
    <div className="overflow-hidden rounded-[32px] border border-brand-border bg-white shadow-card">
      <div className="border-b border-brand-border bg-brand-alabaster/70 px-3 pt-3 sm:px-4">
        <div className="hide-scrollbar flex gap-1 overflow-x-auto">
          {stages.map((item, index) => (
            <button
              key={item[0]}
              type="button"
              aria-selected={active === index}
              onClick={() => setActive(index)}
              className={"group relative min-h-12 shrink-0 rounded-t-2xl px-5 py-3 text-sm font-semibold transition " + (active === index ? "bg-brand-navy text-white" : "text-brand-navy/50 hover:bg-white hover:text-brand-navy/80")}
            >
              {item[0]}
              {active === index && <span className="absolute inset-x-5 bottom-0 h-0.5 bg-brand-amber" />}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-10 p-7 sm:p-10 lg:grid-cols-[0.72fr_1.28fr] lg:p-12">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-brand-amber" />
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-teal-deep">{stage[1]}</p>
          </div>
          <h3 className="mt-4 font-display text-3xl leading-tight text-brand-navy sm:text-4xl">{stage[0]}</h3>
          <div className="mt-5 font-display text-xs tracking-[0.16em] text-brand-navy/30">विद्या · विकास · संस्कार</div>
        </div>
        <div className="flex flex-col justify-between gap-8">
          <p className="max-w-2xl text-base leading-8 text-brand-navy/62 sm:text-lg">{stage[2]}</p>
          <div className="flex items-center justify-between border-t border-brand-border pt-5 text-xs font-semibold uppercase tracking-[0.14em] text-brand-navy/45">
            <span>Foundational stage</span>
            <ArrowRight size={16} className="text-brand-teal-deep" />
          </div>
        </div>
      </div>
    </div>
  );
}
