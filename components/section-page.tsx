import Link from "next/link";

export function SectionPage({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <main className="min-h-screen bg-brand-alabaster text-brand-navy">
      <header className="border-b border-brand-border bg-brand-navy text-white">
        <div className="container-avinya flex min-h-20 items-center justify-between gap-5">
          <Link href="/" className="font-display text-lg tracking-[0.12em]">AVINYA</Link>
          <Link href="/" className="text-sm font-semibold text-white/75 hover:text-white">← Home</Link>
        </div>
      </header>
      <section className="section-space">
        <div className="container-avinya max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-teal">{eyebrow}</p>
          <h1 className="mt-4 font-display text-4xl leading-tight sm:text-6xl">{title}</h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-brand-navy/65 sm:text-lg">{description}</p>
          <div className="mt-10 rounded-[28px] border border-brand-border bg-white p-8 shadow-soft">
            <p className="font-display text-2xl">UI foundation in progress</p>
            <p className="mt-3 text-sm leading-7 text-brand-navy/60">
              This route is intentionally scaffolded while the Avinya design system and real school content are assembled.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
