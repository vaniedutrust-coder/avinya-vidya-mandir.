"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServer } from "../../../lib/supabase-server";

const statuses = ["new","contacted","visit_scheduled","visited","application_started","admitted","closed"] as const;
type Status = typeof statuses[number];

async function authorized() {
  const db = await getSupabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) throw new Error("Unauthorized.");
  const { data: profile } = await db.from("admin_profiles").select("active,role").eq("user_id",user.id).maybeSingle();
  if (!profile?.active || !["super_admin","admin","admissions"].includes(profile.role)) throw new Error("Forbidden.");
  return { db, user };
}

export async function updateInquiryStatus(id: string, status: Status) {
  if (!statuses.includes(status)) throw new Error("Invalid inquiry status.");
  const { db, user } = await authorized();
  const { data: before } = await db.from("inquiries").select("status").eq("id",id).maybeSingle();
  if (!before) throw new Error("Inquiry not found.");
  const { error } = await db.from("inquiries").update({ status, last_contacted_at: status === "contacted" ? new Date().toISOString() : undefined }).eq("id",id);
  if (error) throw new Error(error.message);
  await db.from("audit_logs").insert({ actor_id:user.id, action:"inquiry.status_changed", entity_type:"inquiry", entity_id:id, before_data:{status:before.status}, after_data:{status} });
  revalidatePath("/admin/inquiries"); revalidatePath(`/admin/inquiries/${id}`); revalidatePath("/admin");
}

export async function updateInquiryNotes(id: string, notes: string) {
  const clean = notes.trim();
  if (clean.length > 5000) throw new Error("Notes are too long.");
  const { db, user } = await authorized();
  const { data: before } = await db.from("inquiries").select("notes").eq("id",id).maybeSingle();
  if (!before) throw new Error("Inquiry not found.");
  const { error } = await db.from("inquiries").update({ notes: clean || null }).eq("id",id);
  if (error) throw new Error(error.message);
  await db.from("audit_logs").insert({ actor_id:user.id, action:"inquiry.notes_updated", entity_type:"inquiry", entity_id:id, before_data:{notes:before.notes}, after_data:{notes:clean || null} });
  revalidatePath(`/admin/inquiries/${id}`);
}

export async function assignInquiry(id: string, assignedTo: string | null) {
  const { db, user } = await authorized();
  const { data: before } = await db.from("inquiries").select("assigned_to").eq("id",id).maybeSingle();
  if (!before) throw new Error("Inquiry not found.");
  if (assignedTo) {
    const { data: assignee } = await db.from("admin_profiles").select("user_id").eq("user_id",assignedTo).eq("active",true).maybeSingle();
    if (!assignee) throw new Error("Assignee is not an active administrator.");
  }
  const { error } = await db.from("inquiries").update({ assigned_to: assignedTo }).eq("id",id);
  if (error) throw new Error(error.message);
  await db.from("audit_logs").insert({ actor_id:user.id, action:"inquiry.assigned", entity_type:"inquiry", entity_id:id, before_data:{assigned_to:before.assigned_to}, after_data:{assigned_to:assignedTo} });
  revalidatePath(`/admin/inquiries/${id}`); revalidatePath("/admin/inquiries");
}
