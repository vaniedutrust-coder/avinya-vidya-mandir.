import Link from "next/link";
import { ArrowRight, Compass, HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";
import { SiteHeader } from "../components/site-header";
import { BookVisit } from "../components/book-visit";
import { AcademicSpectrum } from "../components/academic-spectrum";
import { VirtualTour } from "../components/virtual-tour";

const ethos = [
  ["01", "Rooted in Values", "Culture, empathy, discipline and character.", "border-brand-teal/20 bg-brand-teal/5"],
  ["02", "Rising in Excellence", "Strong foundations built for a long academic journey.", "border-brand-amber/30 bg-brand-amber/10"],
  ["03", "Holistic Development", "Movement, creativity, language and discovery.", "border-brand-navy/10 bg-brand-navy/5"],
  ["04", "Nurturing Care", "A safe, attentive environment where children are known.", "border-brand-terracotta/20 bg-brand-terracotta/5"]
];

const journey = ["Pre-Nursery", "Nursery", "LKG", "UKG", "Class 1", "Primary", "Middle", "Secondary", "Senior Secondary"];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-brand-alabaster">
      <SiteHeader />

      <section className="hero-grid border-b border-brand-border pt-[78px]">
        <div className="container-avinya grid min-h-[700px] items-center gap-12 py-14 lg:grid-cols-[0.85fr_1.15fr] lg:py-20">
          <div className="order-2 lg:order-1">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-teal/20 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-teal">
              Avinya Vidya Mandir · Delhi
            </div>
            <p className="max-w-xl font-display text-xl leading-relaxed text-brand-navy/80 sm:text-2xl">
              Rooted in Values, Rising in Excellence
            </p>
            <h1 className="mt-5 max-w-2xl font-display text-4xl leading-[1.08] tracking-[-0.02em] text-brand-navy sm:text-6xl">
              A thoughtful beginning for a remarkable journey.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-brand-navy/65 sm:text-lg">
              A boutique foundational school where every child is seen, supported and encouraged to discover with confidence.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <BookVisit />
              <Link href="/campus" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-brand-border bg-white px-6 py-3 text-sm font-bold text-brand-navy shadow-sm transition hover:-translate-y-0.5">
                Explore the Campus <ArrowRight size={17} />
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-5">
              <div className="h-px w-12 bg-brand-teal/40" />
              <div>
                <div className="font-display text-sm text-brand-navy">सा विद्या या विमुक्तये</div>
                <div className="mt-1 text-xs text-brand-navy/45">Knowledge that opens the way to freedom.</div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="image-frame aspect-[4/3] lg:aspect-[1.08/1]">
              <img src="/images/hero.jpg" alt="Children participating in a school celebration at Avinya Vidya Mandir" className="h-full object-cover" fetchPriority="high" />
              <div className="absolute inset-x-4 bottom-4 flex items-end justify-between rounded-2xl border border-white/30 bg-brand-navy/80 p-4 text-white backdrop-blur-md sm:inset-x-6 sm:bottom-6 sm:p-5">
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.18em] text-brand-amber">At Avinya</div>
                  <div className="mt-1 font-display text-lg">Childhood with purpose.</div>
                </div>
                <div className="hidden text-right text-xs leading-5 text-white/65 sm:block">Real learning.<br />Real relationships.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-brand-border bg-white">
        <div className="container-avinya grid gap-6 py-8 sm:grid-cols-3 sm:gap-8">
          {[
            ["1:10", "Student-to-teacher mentorship"],
            ["NEP 2020", "Foundational stage alignment"],
            ["360°", "Explore the campus virtually"]
          ].map(([value, label]) => (
            <div key={value} className="flex items-center gap-4">
              <div className="font-display text-3xl text-brand-navy">{value}</div>
              <div className="text-sm leading-6 text-brand-navy/60">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-space">
        <div className="container-avinya">
          <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-teal">The Avinya ethos</p>
              <h2 className="mt-4 font-display text-4xl leading-tight text-brand-navy sm:text-5xl">A foundation built around the whole child.</h2>
            </div>
            <div className="max-w-2xl">
              <p className="text-base leading-8 text-brand-navy/65 sm:text-lg">
                Education is not only what a child remembers. It is how a child learns to think, care, communicate, move, create and grow.
              </p>
              <div className="mt-4 font-display text-sm text-brand-teal">ज्ञानम् · संस्कारः · करुणा · सृजनम्</div>
            </div>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {ethos.map(([number, title, text, cls]) => (
              <article key={title} className={"rounded-[28px] border p-7 sm:p-8 " + cls}>
                <div className="text-xs font-bold tracking-[0.2em] text-brand-navy/35">{number}</div>
                <h3 className="mt-4 font-display text-2xl text-brand-navy">{title}</h3>
                <p className="mt-3 max-w-md text-sm leading-7 text-brand-navy/60">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space bg-white">
        <div className="container-avinya grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="image-frame">
            <img src="/images/classroom.jpg" alt="Children learning with a teacher in an Avinya Vidya Mandir classroom" className="aspect-[1.3/1] object-cover" loading="lazy" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-teal">Foundational years</p>
            <h2 className="mt-4 font-display text-4xl leading-tight text-brand-navy sm:text-5xl">Small enough to know every child. Ambitious enough to grow with them.</h2>
            <p className="mt-6 text-base leading-8 text-brand-navy/65">
              From Pre-Nursery through Class 1 today, Avinya is designed around an organic, grade-by-grade journey toward a complete CBSE K–12 institution.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                [Sparkles, "Experiential learning"],
                [HeartHandshake, "Personal mentorship"],
                [ShieldCheck, "Care & safety"],
                [Compass, "Long-term trajectory"]
              ].map(([Icon, label]) => (
                <div key={String(label)} className="flex items-center gap-3 rounded-2xl border border-brand-border bg-brand-alabaster px-4 py-4">
                  <Icon size={18} className="text-brand-teal" />
                  <span className="text-sm font-semibold text-brand-navy/75">{String(label)}</span>
                </div>
              ))}
            </div>
            <Link href="/academics" className="mt-8 inline-flex min-h-12 items-center gap-2 text-sm font-bold text-brand-navy">
              Explore the learning approach <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="section-space grid-paper">
        <div className="container-avinya">
          <div className="mb-10 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-teal">Academic spectrum</p>
            <h2 className="mt-4 font-display text-4xl leading-tight text-brand-navy sm:text-5xl">Every stage has its own rhythm of growth.</h2>
            <p className="mt-5 text-base leading-8 text-brand-navy/65">A foundational framework balancing phonics, bilingual fluency, tactile discovery, movement and confidence.</p>
          </div>
          <AcademicSpectrum />
        </div>
      </section>

      <section className="section-space bg-brand-navy text-white">
        <div className="container-avinya grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-amber">Step inside Avinya</p>
            <h2 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">See the spaces where curiosity gets room to grow.</h2>
          </div>
          <div>
            <p className="max-w-2xl text-base leading-8 text-white/70">Explore the school through the 360° experience, then come and experience it in person.</p>
            <a href="#book-visit" className="mt-6 inline-flex min-h-12 items-center gap-2 text-sm font-bold text-brand-amber">Book a visit <ArrowRight size={16} /></a>
          </div>
        </div>
        <div className="container-avinya mt-10">
          <VirtualTour />
        </div>
      </section>

      <section className="section-space bg-white">
        <div className="container-avinya grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-teal">Life at Avinya</p>
            <h2 className="mt-4 font-display text-4xl leading-tight text-brand-navy sm:text-5xl">A school day is made of many small moments.</h2>
            <p className="mt-5 text-base leading-8 text-brand-navy/65">
              Learning, laughter, celebrations, making, movement and quiet moments of discovery all belong to the experience.
            </p>
            <Link href="/life-at-avinya" className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-brand-navy px-6 py-3 text-sm font-bold text-white">See Life at Avinya <ArrowRight size={16} /></Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="image-frame"><img src="/images/life.jpg" alt="Children enjoying an activity at Avinya Vidya Mandir" className="aspect-[4/5] object-cover" loading="lazy" /></div>
            <div className="image-frame mt-8 sm:mt-16"><img src="/images/discovery.jpg" alt="Hands-on discovery activity at Avinya Vidya Mandir" className="aspect-[4/5] object-cover" loading="lazy" /></div>
          </div>
        </div>
      </section>

      <section className="section-space bg-brand-alabaster">
        <div className="container-avinya">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-teal">The journey ahead</p>
              <h2 className="mt-4 font-display text-4xl leading-tight text-brand-navy sm:text-5xl">A school that grows with your child.</h2>
            </div>
            <p className="max-w-2xl text-base leading-8 text-brand-navy/65">The long-term vision is a continuous pathway from foundational discovery to Senior Secondary CBSE education, developed grade by grade.</p>
          </div>
          <div className="mt-12 overflow-x-auto pb-2">
            <div className="flex min-w-max items-center gap-3">
              {journey.map((item, index) => (
                <div key={item} className="flex items-center gap-3">
                  <span className={"rounded-full border px-4 py-2 text-sm font-semibold " + (index <= 4 ? "border-brand-teal/30 bg-brand-teal/5 text-brand-navy" : "border-brand-border bg-white text-brand-navy/55")}>{item}</span>
                  {index < journey.length - 1 && <span className="text-brand-border">→</span>}
                </div>
              ))}
            </div>
          </div>
          <p className="mt-6 text-xs leading-6 text-brand-navy/45">Current operating grades are shown separately from the school’s planned grade-by-grade expansion.</p>
        </div>
      </section>

      <section id="book-visit" className="section-space">
        <div className="container-avinya">
          <div className="overflow-hidden rounded-[34px] bg-brand-amber p-8 sm:p-12 lg:p-16">
            <div className="grid gap-10 lg:grid-cols-[1.22fr_0.78fr] lg:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-navy/60">Come see for yourself</p>
                <h2 className="mt-4 font-display text-4xl leading-tight text-brand-navy sm:text-5xl">The best way to discover Avinya is to step inside.</h2>
                <p className="mt-5 max-w-2xl text-base leading-8 text-brand-navy/70">Explore the campus, meet the team and experience the environment your child could call their own.</p>
              </div>
              <div className="lg:justify-self-end"><BookVisit /></div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-brand-border bg-brand-navy py-14 pb-28 text-white sm:pb-14">
        <div className="container-avinya grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-white p-1">
                <img src="/images/logo.webp" alt="" className="h-full w-full object-contain" />
              </div>
              <div>
                <div className="font-display text-xl tracking-[0.12em]">AVINYA</div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-white/50">Vidya Mandir</div>
              </div>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-7 text-white/60">Rooted in Values, Rising in Excellence.</p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/45">Explore</p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-white/70">
              <Link href="/about">About Us</Link>
              <Link href="/academics">Academics</Link>
              <Link href="/campus">Campus</Link>
              <Link href="/admissions">Admissions</Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/45">Institution</p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-white/70">
              <Link href="/mandatory-disclosure">Mandatory Disclosure</Link>
              <Link href="/privacy-policy">Privacy Policy</Link>
              <Link href="/terms">Terms</Link>
              <Link href="/accessibility">Accessibility</Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/45">Visit</p>
            <p className="mt-4 text-sm leading-7 text-white/70">Delhi · India</p>
            <a className="mt-2 inline-block text-sm font-semibold text-brand-amber" href="https://avinyaschool.dharamgraphics.in/" target="_blank" rel="noreferrer">Open 360° Tour</a>
          </div>
        </div>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-border bg-white p-3 shadow-[0_-10px_35px_rgba(11,32,56,0.10)] sm:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-2 gap-3">
          <a href="https://wa.me/" aria-label="WhatsApp Avinya" className="flex min-h-12 items-center justify-center rounded-full border border-brand-teal/30 bg-brand-teal/5 text-sm font-bold text-brand-navy">WhatsApp Us</a>
          <a href="#book-visit" className="flex min-h-12 items-center justify-center rounded-full bg-brand-navy text-sm font-bold text-white">Book Visit</a>
        </div>
      </div>
    </main>
  );
}
