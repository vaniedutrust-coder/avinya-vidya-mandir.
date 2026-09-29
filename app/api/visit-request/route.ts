import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const allowedGrades = new Set(["Pre-Nursery", "Nursery", "LKG", "UKG", "Class 1"]);

function getServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase environment variables are not configured.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parentName = typeof body.parentName === "string" ? body.parentName.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const grade = typeof body.grade === "string" ? body.grade.trim() : "";
    const preferredDate = typeof body.preferredDate === "string" ? body.preferredDate : "";
    const consent = body.consent === true;
    const website = typeof body.website === "string" ? body.website.trim() : "";

    if (website) return NextResponse.json({ ok: true });
    if (parentName.length < 2 || parentName.length > 120) {
      return NextResponse.json({ error: "Please enter a valid parent name." }, { status: 400 });
    }
    if (!/^[+0-9()\s.-]{7,30}$/.test(phone)) {
      return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 400 });
    }
    if (!allowedGrades.has(grade)) {
      return NextResponse.json({ error: "Please select a valid grade." }, { status: 400 });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(preferredDate)) {
      return NextResponse.json({ error: "Please select a valid visit date." }, { status: 400 });
    }
    if (!consent) {
      return NextResponse.json({ error: "Consent is required." }, { status: 400 });
    }

    const db = getServerClient();
    const { error } = await db.from("visit_requests").insert({
      parent_name: parentName,
      phone,
      grade,
      preferred_date: preferredDate,
      consent,
      consent_version: "2026-09-01",
      source: "website"
    });

    if (error) {
      console.error("visit request insert failed", error);
      return NextResponse.json({ error: "We could not save your request. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("visit request route failed", error);
    return NextResponse.json({ error: "Unable to process the request." }, { status: 500 });
  }
}
