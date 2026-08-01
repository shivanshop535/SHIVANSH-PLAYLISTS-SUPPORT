const { createClient } = require("@supabase/supabase-js");

let cached = null;

/**
 * Server-only Supabase client using the service role key.
 * Only ever require() this from files in /api — never ship it to the browser.
 */
function getSupabaseAdmin() {
  if (cached) return cached;

  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables."
    );
  }

  cached = createClient(url, serviceKey, { auth: { persistSession: false } });
  return cached;
}

module.exports = { getSupabaseAdmin };
