import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "../../lib/supabase-admin";

export default async function AdminPage() {
  const db = getSupabaseAdmin();
  const { data: { user } } = await db.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profile } = await db.from("admin_profiles").select("display_name, role, active").eq("user_id", user.id).maybeSingle();
  if (!profile?.active) redirect("/admin/login");

  const [{ count: enquiries }, { count: visits }] = await Promise.all([
    db.from("inquiries").select("*",{count:"exact",head:true}).eq("status","new"),
    db.from("visit_requests").select("*",{count:"exact",head:true}).eq("status","new")
  ]);

  return (
    <main className="min-h-screen bg-brand-alabaster px-5 py-10 text-brand-ink">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-5 border-b border-brand-border pb-7 sm:flex-row sm:items-end">
          <div><p className="editorial-kicker text-brand-teal-deep">Avinya Administration</p><h1 className="mt-3 font-display text-4xl sm:text-5xl">Good morning{profile.display_name ? `, ${profile.display_name}` : ""}.</h1><p className="mt-3 text-sm text-brand-ink/55">{profile.role.replace("_"," ")} · Private school operations</p></div>
          <a href="/" className="text-sm font-bold text-brand-teal-deep">View website →</a>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[["New enquiries",enquiries??0],["New visit requests",visits??0],["Role",profile.role.replace("_"," ")],["Status","Online"]].map(([label,value])=><div key={String(label)} className="border border-brand-border bg-white p-6 shadow-card"><p className="form-label">{label}</p><p className="mt-4 font-display text-3xl capitalize">{value}</p></div>)}
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <a href="/admin/inquiries" className="border border-brand-border bg-white p-7 transition hover:-translate-y-1 hover:shadow-soft"><p className="editorial-kicker text-brand-orange">Admissions</p><h2 className="mt-3 font-display text-2xl">Enquiry desk →</h2><p className="mt-3 text-sm leading-7 text-brand-ink/55">Review parent enquiries and move them through the admissions lifecycle.</p></a>
          <a href="/admin/builder" className="border border-brand-border bg-white p-7 transition hover:-translate-y-1 hover:shadow-soft"><p className="editorial-kicker text-brand-amber">Content</p><h2 className="mt-3 font-display text-2xl">Content builder →</h2><p className="mt-3 text-sm leading-7 text-brand-ink/55">The next CMS layer will manage pages, sections, SEO and publication.</p></a>
        </div>
      </div>
    </main>
  );
}
