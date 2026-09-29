"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, ArrowRight } from "lucide-react";
import { getSupabaseBrowser } from "../../../lib/supabase-browser";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault(); setLoading(true); setError("");
    try {
      const { error } = await getSupabaseBrowser().auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.replace("/admin");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to sign in.");
    } finally { setLoading(false); }
  }

  return (
    <main className="min-h-screen bg-brand-alabaster px-5 py-12 text-brand-ink">
      <div className="mx-auto flex min-h-[80vh] max-w-md items-center">
        <div className="w-full border border-brand-border bg-white p-7 shadow-card sm:p-10">
          <div className="flex h-12 w-12 items-center justify-center bg-brand-navy text-white"><LockKeyhole size={20}/></div>
          <p className="mt-8 editorial-kicker text-brand-teal-deep">Avinya Administration</p>
          <h1 className="mt-3 font-display text-4xl">Sign in.</h1>
          <p className="mt-4 text-sm leading-7 text-brand-ink/60">Private access for the Avinya school team.</p>
          <form onSubmit={submit} className="mt-8 space-y-5">
            <label><span className="form-label">Email</span><input className="form-input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="email"/></label>
            <label><span className="form-label">Password</span><input className="form-input" type="password" value={password} onChange={e=>setPassword(e.target.value)} required autoComplete="current-password"/></label>
            {error && <p role="alert" className="rounded-xl border border-brand-terracotta/30 bg-brand-terracotta-soft px-4 py-3 text-sm">{error}</p>}
            <button disabled={loading} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-navy px-5 text-sm font-bold text-white disabled:opacity-60">{loading?"Signing in…":"Sign in"}{!loading&&<ArrowRight size={16}/>}</button>
          </form>
        </div>
      </div>
    </main>
  );
}
