import Link from "next/link";
import { ArrowRight, HeartHandshake, Sparkles, ShieldCheck, UsersRound } from "lucide-react";
import { SiteHeader } from "./site-header";
import { BookVisit } from "./book-visit";

export type PageAccent = "green" | "orange" | "gold";

const accentMap = { green: "#1F5B46", orange: "#E85B2A", gold: "#C99624" } as const;
const accentSoftMap = { green: "#EAF3EE", orange: "#FFF0E9", gold: "#FBF4DF" } as const;

const defaultFeatures = [
  [Sparkles, "Thoughtful beginnings", "A calm, purposeful environment designed around how young children learn."],
  [HeartHandshake, "Known and supported", "Close attention, warm relationships and a genuine sense of belonging."],
  [ShieldCheck, "Care by design", "Safety, cleanliness and preparedness are part of the everyday experience."],
  [UsersRound, "Mentorship", "A close teacher-child relationship that gives each learner room to grow."]
] as const;

export function SectionPage({
  eyebrow, title, description, accent = "green", image = "/images/classroom.jpg",
  secondaryImage = "/images/life.jpg", intro, features = defaultFeatures, bullets = [], cta = "Explore Avinya"
}: {
  eyebrow: string; title: string; description: string; accent?: PageAccent; image?: string;
  secondaryImage?: string; intro?: string;
  features?: readonly (readonly [typeof Sparkles, string, string])[];
  bullets?: string[]; cta?: string;
}) {
  const colour = accentMap[accent];
  const soft = accentSoftMap[accent];

  return (
    <main className="min-h-screen bg-white text-brand-ink" style={{ "--page-accent": colour, "--page-accent-soft": soft } as React.CSSProperties}>
      <SiteHeader />
      <section className="relative overflow-hidden border-b border-brand-border pt-[78px]">
        <div className="container-avinya grid min-h-[560px] items-stretch lg:grid-cols-[.8fr_1.2fr]">
          <div className="flex flex-col justify-center py-16 lg:py-24 lg:pr-16">
            <div className="editorial-kicker" style={{ color: colour }}>{eyebrow}</div>
            <h1 className="mt-6 max-w-3xl font-display text-5xl leading-[.98] tracking-[-.04em] text-brand-ink sm:text-7xl">{title}</h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-brand-ink/65 sm:text-lg">{description}</p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <BookVisit />
              <Link href="/about" className="editorial-link" style={{ color: colour, borderColor: colour }}>{cta} <ArrowRight size={16} /></Link>
            </div>
          </div>
          <div className="relative min-h-[360px] overflow-hidden lg:min-h-0">
            <img src={image} alt="Avinya Vidya Mandir" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/10 to-transparent" />
            <div className="absolute bottom-6 right-6 border-l-2 bg-white/90 px-5 py-4 backdrop-blur" style={{ borderColor: colour }}>
              <div className="font-display text-lg text-brand-ink">विद्या ददाति विनयम्</div>
              <div className="mt-1 text-xs italic text-brand-ink/55">Knowledge gives humility.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-space bg-white">
        <div className="container-avinya grid gap-14 lg:grid-cols-[.72fr_1.28fr] lg:items-start">
          <div>
            <div className="editorial-kicker" style={{ color: colour }}>The Avinya approach</div>
            <h2 className="editorial-heading mt-5">Designed around the child, not the template.</h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-brand-ink/65">{intro ?? "Every element of the Avinya experience is designed to help children feel secure enough to explore, confident enough to try and supported enough to grow."}</p>
            {bullets.length > 0 && <ul className="mt-8 space-y-4">{bullets.map(item => <li key={item} className="flex gap-3 text-sm leading-6 text-brand-ink/70"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: colour }} />{item}</li>)}</ul>}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {features.map(([Icon, heading, text]) => (
              <article key={heading} className="border border-brand-border bg-white p-7 transition hover:-translate-y-1 hover:shadow-soft">
                <Icon size={21} style={{ color: colour }} />
                <h3 className="mt-10 font-display text-2xl text-brand-ink">{heading}</h3>
                <p className="mt-3 text-sm leading-7 text-brand-ink/58">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight" style={{ background: soft }}>
        <div className="container-avinya grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
          <div className="image-frame"><img src={secondaryImage} alt="Life at Avinya Vidya Mandir" className="aspect-[1.45/1] object-cover" loading="lazy" /></div>
          <div>
            <div className="editorial-kicker" style={{ color: colour }}>Rooted in values</div>
            <h2 className="mt-5 font-display text-4xl leading-tight text-brand-ink sm:text-5xl">A thoughtful beginning can shape a remarkable journey.</h2>
            <p className="mt-6 text-base leading-8 text-brand-ink/65">Our school is intentionally personal today while building toward a continuous K–12 pathway for tomorrow.</p>
            <Link href="/visit" className="editorial-link mt-8" style={{ color: colour, borderColor: colour }}>Come experience Avinya <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      <section className="section-space bg-white">
        <div className="container-avinya grid gap-10 border-y border-brand-border py-12 lg:grid-cols-[1fr_auto] lg:items-center">
          <div><div className="editorial-kicker" style={{ color: colour }}>Avinya Vidya Mandir</div><h2 className="mt-4 font-display text-3xl text-brand-ink sm:text-4xl">Rooted in Values, Rising in Excellence.</h2></div>
          <BookVisit />
        </div>
      </section>

      <footer className="border-t border-brand-ink/15 bg-brand-ink py-14 pb-28 text-white sm:pb-14">
        <div className="container-avinya grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div><img src="/images/logo.webp" alt="Avinya Vidya Mandir crest" className="h-16 w-auto bg-white p-1" /><p className="mt-5 max-w-xs text-sm leading-7 text-white/65">Rooted in Values, Rising in Excellence.</p></div>
          <div><p className="footer-label">Explore</p><div className="footer-links"><Link href="/about">About</Link><Link href="/academics">Academics</Link><Link href="/campus">Campus</Link><Link href="/life-at-avinya">Life at Avinya</Link></div></div>
          <div><p className="footer-label">Admissions</p><div className="footer-links"><Link href="/admissions">Admissions</Link><Link href="/visit">Visit</Link><Link href="/contact">Contact</Link><Link href="/gallery">Gallery</Link></div></div>
          <div><p className="footer-label">Experience</p><a href="https://avinyaschool.dharamgraphics.in/" target="_blank" rel="noreferrer" className="mt-4 inline-flex text-sm font-semibold text-[#E6B85C]">Open 360° Tour <ArrowRight size={15} className="ml-2" /></a></div>
        </div>
      </footer>
    </main>
  );
}