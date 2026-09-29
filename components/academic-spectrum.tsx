"use client";

import { useState } from "react";

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
    <div className="overflow-hidden rounded-[30px] border border-brand-border bg-white shadow-soft">
      <div className="hide-scrollbar flex overflow-x-auto border-b border-brand-border">
        {stages.map((item, index) => (
          <button
            key={item[0]}
            type="button"
            aria-selected={active === index}
            onClick={() => setActive(index)}
            className={"min-h-12 shrink-0 border-r border-brand-border px-5 py-4 text-sm font-bold transition " + (active === index ? "bg-brand-navy text-white" : "text-brand-navy/60 hover:bg-brand-alabaster")}
          >
            {item[0]}
          </button>
        ))}
      </div>
      <div className="grid gap-10 p-7 sm:p-10 lg:grid-cols-[0.8fr_1.2fr] lg:p-12">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-teal">{stage[1]}</p>
          <h3 className="mt-3 font-display text-3xl leading-tight text-brand-navy sm:text-4xl">{stage[0]}</h3>
        </div>
        <p className="max-w-2xl text-base leading-8 text-brand-navy/65 sm:text-lg">{stage[2]}</p>
      </div>
    </div>
  );
}
