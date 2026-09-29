import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const grade = typeof body.grade === "string" ? body.grade.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const consent = body.consent === true;
    const website = typeof body.website === "string" ? body.website.trim() : "";

    if (website) return NextResponse.json({ ok: true });
    if (parentName.length < 2 || parentName.length > 120) return NextResponse.json({ error: "Please enter a valid name." }, { status: 400 });
    if (!/^[+0-9()\s.-]{7,30}$/.test(phone)) return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 400 });
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
    if (grade && grade.length > 40) return NextResponse.json({ error: "Please select a valid grade." }, { status: 400 });
    if (message.length < 2 || message.length > 3000) return NextResponse.json({ error: "Please enter your message." }, { status: 400 });
    if (!consent) return NextResponse.json({ error: "Consent is required." }, { status: 400 });

    const db = getServerClient();
    const { error } = await db.from("inquiries").insert({
      parent_name: parentName,
      phone,
      email: email || null,
      grade: grade || null,
      message,
      consent,
      consent_version: "2026-09-01",
      source: "website"
    });

    if (error) {
      console.error("inquiry insert failed", error);
      return NextResponse.json({ error: "We could not send your message. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("inquiry route failed", error);
    return NextResponse.json({ error: "Unable to process the request." }, { status: 500 });
  }
}
