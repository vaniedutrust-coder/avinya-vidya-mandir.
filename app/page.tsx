import Link from "next/link";
import { ArrowRight, Compass, HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";
import { SiteHeader } from "../components/site-header";
import { BookVisit } from "../components/book-visit";
import { AcademicSpectrum } from "../components/academic-spectrum";
import { VirtualTour } from "../components/virtual-tour";

const ethos = [
  ["Rooted in Values", "Culture, empathy, discipline and character.", "border-brand-teal/20 bg-brand-teal/5"],
  ["Rising in Excellence", "Strong foundations built for a long academic journey.", "border-brand-amber/30 bg-brand-amber/10"],
  ["Holistic Development", "Movement, creativity, language and discovery.", "border-brand-navy/10 bg-brand-navy/5"],
  ["Nurturing Care", "A safe, attentive environment where children are known.", "border-brand-terracotta/20 bg-brand-terracotta/5"]
];

const journey = ["Pre-Nursery", "Nursery", "LKG", "UKG", "Class 1", "Primary", "Middle", "Secondary", "Senior Secondary"];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-brand-alabaster">
      <SiteHeader />

      <section className="hero-image min-h-[720px] pt-[76px] text-white">
        <div className="container-avinya flex min-h-[644px] items-end py-14 sm:py-20">
          <div className="max-w-3xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-brand-amber">Avinya Vidya Mandir · Delhi</p>
            <p className="mb-5 max-w-2xl font-display text-lg text-white/85 sm:text-xl">Rooted in Values, Rising in Excellence</p>
            <h1 className="font-display text-4xl leading-[1.08] sm:text-6xl lg:text-7xl">A thoughtful beginning for a remarkable journey.</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
              A boutique foundational school where every child is seen, supported and encouraged to discover with confidence.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <BookVisit />
              <Link href="/academics" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/15">
                Explore the Learning Journey <ArrowRight size={17} />
              </Link>
            </div>
            <p className="mt-8 font-display text-sm text-white/65">सा विद्या या विमुक्तये</p>
          </div>
        </div>
      </section>

      <section className="border-b border-brand-border bg-white">
        <div className="container-avinya grid gap-8 py-9 md:grid-cols-3">
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
          <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-teal">The Avinya ethos</p>
              <h2 className="mt-4 font-display text-4xl leading-tight text-brand-navy sm:text-5xl">Education is more than what a child learns.</h2>
            </div>
            <p className="max-w-2xl text-base leading-8 text-brand-navy/65 sm:text-lg">
              It is how a child learns to think, care, communicate, move, create and grow. Our four-part ethos brings values, aspiration, development and care into one coherent experience.
            </p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {ethos.map(([title, text, cls]) => (
              <article key={title} className={"rounded-[26px] border p-7 sm:p-8 " + cls}>
                <h3 className="font-display text-2xl text-brand-navy">{title}</h3>
                <p className="mt-3 max-w-md text-sm leading-7 text-brand-navy/60">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space bg-white">
        <div className="container-avinya grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="overflow-hidden rounded-[30px] shadow-soft">
            <img src="/images/classroom.jpg" alt="Children learning with a teacher in an Avinya Vidya Mandir classroom" className="h-full min-h-[420px] w-full object-cover" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-teal">Foundational years</p>
            <h2 className="mt-4 font-display text-4xl leading-tight text-brand-navy sm:text-5xl">Small enough to know every child. Ambitious enough to grow with them.</h2>
            <p className="mt-6 text-base leading-8 text-brand-navy/65">
              From Pre-Nursery through Class 1 today, Avinya is designed around an organic, grade-by-grade journey toward a complete CBSE K–12 institution.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
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
            <Link href="/about" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-brand-navy">Discover the Avinya story <ArrowRight size={16} /></Link>
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
        <div className="container-avinya grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-amber">Step inside Avinya</p>
            <h2 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">See the spaces where curiosity gets room to grow.</h2>
          </div>
          <div>
            <p className="max-w-2xl text-base leading-8 text-white/70">Explore the school through the 360° experience, then come and experience it in person.</p>
            <a href="#book-visit" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand-amber">Book a visit <ArrowRight size={16} /></a>
          </div>
        </div>
        <div className="container-avinya mt-10"><VirtualTour /></div>
      </section>

      <section className="section-space bg-white">
        <div className="container-avinya">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-teal">The journey ahead</p>
              <h2 className="mt-4 font-display text-4xl leading-tight text-brand-navy sm:text-5xl">A school that grows with your child.</h2>
            </div>
            <p className="max-w-2xl text-base leading-8 text-brand-navy/65">The long-term vision is a continuous pathway from foundational discovery to Senior Secondary CBSE education, developed grade by grade.</p>
          </div>
          <div className="mt-12 flex flex-wrap items-center gap-3">
            {journey.map((item, index) => (
              <div key={item} className="flex items-center gap-3">
                <span className={"rounded-full border px-4 py-2 text-sm font-semibold " + (index <= 4 ? "border-brand-teal/30 bg-brand-teal/5" : "border-brand-border bg-brand-alabaster text-brand-navy/55")}>{item}</span>
                {index < journey.length - 1 && <span className="hidden text-brand-border sm:inline">→</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="book-visit" className="section-space">
        <div className="container-avinya">
          <div className="overflow-hidden rounded-[34px] bg-brand-amber p-8 sm:p-12 lg:p-16">
            <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
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
            <div className="font-display text-xl tracking-[0.12em]">AVINYA</div>
            <p className="mt-3 max-w-xs text-sm leading-7 text-white/60">Rooted in Values, Rising in Excellence.</p>
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
