"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parentName: form.get("parentName"),
          phone: form.get("phone"),
          email: form.get("email"),
          grade: form.get("grade"),
          message: form.get("message"),
          consent: form.get("consent") === "on",
          website: form.get("website")
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to send your message.");
      setSent(true);
      event.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send your message.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="border border-brand-border bg-brand-alabaster p-8 sm:p-10">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-green text-white"><CheckCircle2 size={24} /></div>
        <h3 className="mt-6 font-display text-3xl text-brand-ink">Thank you for reaching out.</h3>
        <p className="mt-3 max-w-lg text-sm leading-7 text-brand-ink/60">Your message is now with the Avinya team. We’ll get back to you through the contact details you provided.</p>
        <button type="button" onClick={() => setSent(false)} className="editorial-link mt-7 text-brand-orange">Send another message <ArrowRight size={16} /></button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="border border-brand-border bg-white p-6 shadow-card sm:p-8">
      <input name="website" tabIndex={-1} autoComplete="off" className="absolute -left-[9999px] h-px w-px opacity-0" aria-hidden="true" />
      <div className="grid gap-5 sm:grid-cols-2">
        <label><span className="form-label">Parent Name</span><input name="parentName" className="form-input" placeholder="Your name" required /></label>
        <label><span className="form-label">WhatsApp / Phone</span><input name="phone" className="form-input" placeholder="+91 ..." inputMode="tel" required /></label>
        <label><span className="form-label">Email <span className="normal-case tracking-normal font-normal text-brand-ink/35">(optional)</span></span><input name="email" type="email" className="form-input" placeholder="you@example.com" /></label>
        <label><span className="form-label">Grade</span><select name="grade" defaultValue="" className="form-input" required><option value="" disabled>Select grade</option><option>Pre-Nursery</option><option>Nursery</option><option>LKG</option><option>UKG</option><option>Class 1</option></select></label>
      </div>
      <label className="mt-5 block"><span className="form-label">Message</span><textarea name="message" className="min-h-36 w-full resize-y rounded-xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-ink outline-none transition placeholder:text-brand-ink/35 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/10" placeholder="How can we help?" required /></label>
      <label className="mt-5 flex items-start gap-3 text-xs leading-5 text-brand-ink/52"><input name="consent" type="checkbox" required className="mt-0.5 h-4 w-4 rounded border-brand-border accent-brand-orange" /><span>I agree to be contacted regarding my enquiry.</span></label>
      {error && <p role="alert" className="mt-4 rounded-xl border border-brand-terracotta/30 bg-brand-terracotta-soft px-4 py-3 text-sm text-brand-ink">{error}</p>}
      <button disabled={loading} type="submit" className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-brand-orange px-6 py-3 text-sm font-bold text-white shadow-lift transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-60">{loading ? "Sending…" : "Send Enquiry"} {!loading && <ArrowRight size={16} />}</button>
    </form>
  );
}
