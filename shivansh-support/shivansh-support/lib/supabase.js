import { createClient } from "@supabase/supabase-js";

let cachedClient = null;

/**
 * Server-only Supabase client using the service role key.
 * NEVER import this file into a "use client" component — it must only
 * ever run inside API routes / server components.
 */
export function getSupabaseAdmin() {
  if (cachedClient) return cachedClient;

  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables. " +
        "Add them in your Vercel project settings or .env.local file."
    );
  }

  cachedClient = createClient(url, serviceKey, {
    auth: { persistSession: false },
  });

  return cachedClient;
}
