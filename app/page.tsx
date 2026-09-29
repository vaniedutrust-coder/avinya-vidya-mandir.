import Link from "next/link";
import { ArrowRight, Play, HeartHandshake, ShieldCheck, Sparkles, Compass, UsersRound, Leaf } from "lucide-react";
import { SiteHeader } from "../components/site-header";
import { BookVisit } from "../components/book-visit";
import { AcademicSpectrum } from "../components/academic-spectrum";
import { VirtualTour } from "../components/virtual-tour";

const values = [
  ["01", "Strong Foundations", "A thoughtful start built around language, confidence, curiosity and character."],
  ["02", "Nurturing Environment", "A small-school setting where children are known, supported and encouraged."],
  ["03", "1:10 Mentorship", "Individual attention that gives every child room to be seen and heard."],
  ["04", "Holistic Development", "Movement, creativity, discovery and life skills alongside academic readiness."]
];

const journey = ["Pre-Nursery", "Nursery", "LKG", "UKG", "Class 1", "Primary", "Middle", "Secondary", "Senior Secondary"];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <SiteHeader />

      <section className="relative overflow-hidden border-b border-brand-border bg-white pt-[78px]">
        <div className="container-avinya grid min-h-[720px] items-stretch lg:grid-cols-[0.78fr_1.22fr]">
          <div className="relative z-10 flex flex-col justify-center py-14 pr-0 lg:py-20 lg:pr-12">
            <div className="editorial-kicker">Pre-Nursery to Class 1 <span /> Delhi</div>
            <h1 className="mt-7 max-w-2xl font-display text-[3.15rem] leading-[0.98] tracking-[-0.045em] text-brand-ink sm:text-[4.7rem] lg:text-[5.25rem]">
              A Kinder Start
              <br />
              for Brighter
              <br />
              <em className="not-italic text-brand-green">Tomorrows.</em>
            </h1>
            <p className="mt-7 max-w-xl font-display text-xl leading-snug text-brand-ink sm:text-2xl">
              Rooted in Values, Rising in Excellence.
            </p>
            <p className="mt-4 max-w-lg text-sm leading-7 text-brand-ink/62 sm:text-base">
              A nurturing early learning journey in a warm, values-driven environment where curiosity, confidence and character grow together.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <BookVisit />
              <a href="#story" className="inline-flex min-h-12 items-center justify-center gap-3 px-5 py-3 text-sm font-bold text-brand-ink">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-navy/25"><Play size={14} fill="currentColor" /></span>
                Watch Our Story
              </a>
            </div>
          </div>

          <div className="relative min-h-[430px] overflow-hidden lg:min-h-0">
            <img
              src="/images/hero.jpg"
              alt="Children learning together at Avinya Vidya Mandir"
              className="absolute inset-0 h-full w-full object-cover"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/12 to-transparent lg:from-white lg:via-transparent" />
            <div className="absolute bottom-7 right-7 hidden max-w-[190px] border-l border-brand-green bg-white/92 px-5 py-4 backdrop-blur-sm sm:block">
              <div className="font-display text-lg leading-tight text-brand-ink">विद्या ददाति विनयम्</div>
              <div className="mt-1 text-xs italic text-brand-ink/55">Knowledge gives humility.</div>
            </div>
          </div>
        </div>

        <div className="container-avinya relative z-10 -mt-px border-t border-brand-border bg-white">
          <div className="grid sm:grid-cols-4">
            {values.map(([number, title], index) => (
              <div key={title} className={"flex gap-3 py-6 sm:px-5 sm:py-7 " + (index < 3 ? "border-b border-brand-border sm:border-b-0 sm:border-r" : "")}>
                <span className="font-display text-sm text-brand-green">{number}</span>
                <div>
                  <div className="text-sm font-bold text-brand-ink">{title}</div>
                  <div className="mt-1 text-xs leading-5 text-brand-ink/48">{index === 0 ? "Language · confidence · character" : index === 1 ? "Known · supported · encouraged" : index === 2 ? "Individual attention" : "Mind · body · creativity"}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="story" className="section-space bg-white">
        <div className="container-avinya grid gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div>
            <div className="editorial-kicker">About Avinya</div>
            <h2 className="editorial-heading mt-5">Where curiosity becomes confidence.</h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-brand-ink/62">
              At Avinya Vidya Mandir, we believe every child is unique and capable. Our foundational years are designed to nurture curiosity, independence and kindness while building a strong foundation for lifelong learning.
            </p>
            <Link href="/about" className="editorial-link mt-8">Discover Our Approach <ArrowRight size={16} /></Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-[1.15fr_0.85fr]">
            <div className="image-frame image-frame-editorial">
              <img src="/images/classroom.jpg" alt="Child engaged in a classroom learning activity" className="aspect-[1.05/1] object-cover" loading="lazy" />
            </div>
            <div className="flex flex-col justify-between border-y border-brand-border py-8 sm:border-y-0 sm:border-l sm:pl-8">
              <div className="font-display text-3xl leading-tight text-brand-ink">“</div>
              <p className="font-display text-xl italic leading-relaxed text-brand-ink/75 sm:text-2xl">
                A nurturing environment today, for a remarkable tomorrow.
              </p>
              <div className="mt-7 h-px w-10 bg-brand-green" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-brand-border bg-brand-green py-20 text-white sm:py-24">
        <div className="container-avinya">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
            <div>
              <div className="editorial-kicker editorial-kicker-light">Our philosophy</div>
              <h2 className="mt-5 font-display text-4xl leading-tight sm:text-5xl">Values today.<br />A remarkable tomorrow.</h2>
            </div>
            <p className="max-w-2xl text-base leading-8 text-white/65">
              Education at Avinya is about developing confident, kind and curious learners—rooted in values and prepared for a bright future.
            </p>
          </div>
          <div className="mt-12 grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(([number, title, text]) => (
              <article key={title} className="bg-brand-green p-7 transition hover:bg-brand-green">
                <div className="font-display text-sm text-brand-green">{number}</div>
                <h3 className="mt-12 font-display text-2xl">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/55">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space bg-white">
        <div className="container-avinya grid gap-12 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
          <div>
            <div className="editorial-kicker">Our campus</div>
            <h2 className="editorial-heading mt-5">A place to belong, explore and grow.</h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-brand-ink/62">
              Bright classrooms, safe spaces, green surroundings and purpose-built learning areas create the environment for exploration and discovery.
            </p>
            <Link href="/campus" className="editorial-link mt-8">Explore the Campus <ArrowRight size={16} /></Link>
          </div>
          <div className="image-frame group">
            <img src="/images/hero.jpg" alt="Avinya Vidya Mandir campus" className="aspect-[1.5/1] object-cover transition duration-700 group-hover:scale-[1.02]" loading="lazy" />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-brand-green/88 p-5 text-white backdrop-blur-sm sm:p-6">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-green">360° experience</div>
                <div className="mt-1 font-display text-lg">Step inside Avinya</div>
              </div>
              <a href="https://avinyaschool.dharamgraphics.in/" target="_blank" rel="noreferrer" className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-green/60 text-brand-green" aria-label="Open 360 degree campus tour">
                <ArrowRight size={17} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section-space bg-white">
        <div className="container-avinya">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
            <div>
              <div className="editorial-kicker">Learning stages</div>
              <h2 className="editorial-heading mt-5">A strong foundation for every stage.</h2>
            </div>
            <div>
              <p className="max-w-2xl text-base leading-8 text-brand-ink/62">
                From early discovery to confident learners, each stage is thoughtfully designed to support the whole child.
              </p>
              <Link href="/academics" className="editorial-link mt-6">Explore Academics <ArrowRight size={16} /></Link>
            </div>
          </div>
          <AcademicSpectrum />
        </div>
      </section>

      <section className="section-tight bg-white">
        <div className="container-avinya grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="image-frame">
            <img src="/images/life.jpg" alt="Children enjoying life at Avinya Vidya Mandir" className="aspect-[1.5/1] object-cover" loading="lazy" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="border border-brand-border bg-white p-7">
              <div className="flex items-center gap-3"><Sparkles size={19} className="text-brand-green" /><span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-ink/55">Discovery</span></div>
              <h3 className="mt-5 font-display text-2xl text-brand-ink">Learning through doing.</h3>
              <p className="mt-3 text-sm leading-7 text-brand-ink/58">Phonics, tactile discovery, movement, making and purposeful play.</p>
            </div>
            <div className="border border-brand-border bg-brand-alabaster p-7">
              <div className="flex items-center gap-3"><HeartHandshake size={19} className="text-brand-green" /><span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-ink/55">Care</span></div>
              <h3 className="mt-5 font-display text-2xl text-brand-ink">A child-first environment.</h3>
              <p className="mt-3 text-sm leading-7 text-brand-ink/58">Thoughtful care, safety, cleanliness and attentive adults around every child.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-space bg-brand-green text-white">
        <div className="container-avinya">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
            <div>
              <div className="editorial-kicker editorial-kicker-light">See Avinya</div>
              <h2 className="mt-5 font-display text-4xl leading-tight sm:text-5xl">Experience the spaces where curiosity gets room to grow.</h2>
            </div>
            <p className="max-w-2xl text-base leading-8 text-white/65">Explore the school through the 360° experience, then come and experience it in person.</p>
          </div>
          <div className="mt-10"><VirtualTour /></div>
        </div>
      </section>

      <section className="section-space bg-white">
        <div className="container-avinya grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <div className="editorial-kicker">The journey ahead</div>
            <h2 className="editorial-heading mt-5">A school that grows with your child.</h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-brand-ink/62">
              Avinya is growing grade by grade toward a continuous pathway from foundational discovery to Senior Secondary CBSE education.
            </p>
          </div>
          <div className="border-l border-brand-border pl-6 sm:pl-10">
            <div className="flex flex-wrap gap-x-4 gap-y-5">
              {journey.map((item, index) => (
                <div key={item} className="flex items-center gap-2">
                  <span className={"flex h-8 w-8 items-center justify-center rounded-full border text-[10px] font-bold " + (index <= 4 ? "border-brand-green/40 bg-brand-green/10 text-brand-green" : "border-brand-border text-brand-ink/35")}>{index + 1}</span>
                  <span className={"text-sm " + (index <= 4 ? "font-semibold text-brand-ink" : "text-brand-ink/40")}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="book-visit" className="section-space bg-white">
        <div className="container-avinya">
          <div className="relative overflow-hidden border border-brand-border bg-white p-8 sm:p-12 lg:p-16">
            <div className="absolute right-0 top-0 h-56 w-56 rounded-full border border-brand-green/20 -translate-y-1/2 translate-x-1/2" />
            <div className="relative grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
              <div>
                <div className="editorial-kicker">Admissions 2026–2027</div>
                <h2 className="editorial-heading mt-5">Give your child a thoughtful beginning.</h2>
                <p className="mt-5 max-w-2xl text-base leading-8 text-brand-ink/62">Schedule a campus visit, meet the team and discover the environment your child could call their own.</p>
              </div>
              <div className="lg:justify-self-end"><BookVisit /></div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-brand-navy/20 bg-brand-green py-14 pb-28 text-white sm:pb-14">
        <div className="container-avinya grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <img src="/images/logo.webp" alt="Avinya Vidya Mandir crest" className="h-16 w-auto rounded-sm bg-white p-1" />
            <p className="mt-5 max-w-xs font-display text-sm leading-6 text-white/70">Rooted in Values, Rising in Excellence.</p>
          </div>
          <div><p className="footer-label">Explore</p><div className="footer-links"><Link href="/about">About Us</Link><Link href="/academics">Academics</Link><Link href="/campus">Campus</Link><Link href="/admissions">Admissions</Link></div></div>
          <div><p className="footer-label">Institution</p><div className="footer-links"><Link href="/mandatory-disclosure">Mandatory Disclosure</Link><Link href="/privacy-policy">Privacy Policy</Link><Link href="/terms">Terms</Link><Link href="/accessibility">Accessibility</Link></div></div>
          <div><p className="footer-label">Visit</p><p className="mt-4 text-sm leading-7 text-white/60">Delhi · India</p><a className="mt-3 inline-flex text-sm font-semibold text-brand-green" href="https://avinyaschool.dharamgraphics.in/" target="_blank" rel="noreferrer">Open 360° Tour <ArrowRight size={15} className="ml-2" /></a></div>
        </div>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-border bg-white p-3 shadow-[0_-10px_35px_rgba(17,42,58,0.10)] sm:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-2 gap-3">
          <a href="https://wa.me/" aria-label="WhatsApp Avinya" className="flex min-h-12 items-center justify-center border border-brand-green/30 bg-brand-green/10 text-sm font-bold text-brand-ink">WhatsApp Us</a>
          <a href="#book-visit" className="flex min-h-12 items-center justify-center bg-brand-green text-sm font-bold text-white">Book Visit</a>
        </div>
      </div>
    </main>
  );
}
