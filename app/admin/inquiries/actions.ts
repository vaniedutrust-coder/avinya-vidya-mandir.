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
  revalidatePath("/admin/inquiries");
  revalidatePath(`/admin/inquiries/${id}`);
  revalidatePath("/admin");
}
