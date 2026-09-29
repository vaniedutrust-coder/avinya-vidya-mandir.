import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function getSupabaseBrowser() {
  if (!url || !anonKey) {
    throw new Error("Supabase browser environment variables are not configured.");
  }
  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}
