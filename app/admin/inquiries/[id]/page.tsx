import { redirect, notFound } from "next/navigation";
import { getSupabaseServer } from "../../../../lib/supabase-server";

const statuses = ["new","contacted","visit_scheduled","visited","application_started","admitted","closed"] as const;

export default async function InquiryDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await getSupabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profile } = await db.from("admin_profiles").select("active,role").eq("user_id", user.id).maybeSingle();
  if (!profile?.active || !["super_admin","admin","admissions"].includes(profile.role)) redirect("/admin");

  const { data: inquiry } = await db.from("inquiries").select("id,parent_name,phone,email,grade,message,status,assigned_to,notes,last_contacted_at,created_at,updated_at").eq("id", id).maybeSingle();
  if (!inquiry) notFound();

  return (
    <main className="min-h-screen bg-brand-alabaster px-5 py-10 text-brand-ink">
      <div className="mx-auto max-w-5xl">
        <a href="/admin/inquiries" className="text-sm font-bold text-brand-teal-deep">← Admissions desk</a>
        <div className="mt-7 flex flex-col justify-between gap-5 border-b border-brand-border pb-7 md:flex-row md:items-end">
          <div><p className="editorial-kicker text-brand-orange">Parent enquiry</p><h1 className="mt-3 font-display text-4xl">{inquiry.parent_name}</h1><p className="mt-2 text-sm text-brand-ink/55">{inquiry.grade || "Grade not specified"} · Received {new Date(inquiry.created_at).toLocaleString("en-IN")}</p></div>
          <div className="flex gap-3"><a className="rounded-xl bg-brand-navy px-4 py-3 text-sm font-bold text-white" href={`tel:${inquiry.phone}`}>Call</a><a className="rounded-xl border border-brand-border bg-white px-4 py-3 text-sm font-bold" href={`https://wa.me/${inquiry.phone.replace(/[^0-9]/g,"")}`}>WhatsApp</a></div>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_.7fr]">
          <section className="space-y-6">
            <div className="border border-brand-border bg-white p-6 shadow-card"><p className="form-label">Parent message</p><p className="mt-4 whitespace-pre-wrap text-sm leading-7">{inquiry.message}</p></div>
            <div className="border border-brand-border bg-white p-6 shadow-card"><p className="form-label">Contact details</p><dl className="mt-4 grid gap-4 sm:grid-cols-2 text-sm"><div><dt className="text-brand-ink/45">Phone</dt><dd className="mt-1 font-semibold">{inquiry.phone}</dd></div><div><dt className="text-brand-ink/45">Email</dt><dd className="mt-1 font-semibold">{inquiry.email || "—"}</dd></div></dl></div>
            <div className="border border-brand-border bg-white p-6 shadow-card"><p className="form-label">Internal notes</p><p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-brand-ink/65">{inquiry.notes || "No notes recorded yet."}</p></div>
          </section>
          <aside className="border border-brand-border bg-white p-6 shadow-card h-fit"><p className="form-label">Admissions stage</p><div className="mt-4 space-y-2">{statuses.map(status=><div key={status} className={`rounded-lg border px-3 py-3 text-sm ${inquiry.status===status ? "border-brand-navy bg-brand-mist font-bold" : "border-brand-border text-brand-ink/55"}`}>{status.replaceAll("_"," ")}</div>)}</div><p className="mt-6 text-xs leading-5 text-brand-ink/45">Status controls will be connected to the audited CRM mutation layer next.</p></aside>
        </div>
      </div>
    </main>
  );
}
