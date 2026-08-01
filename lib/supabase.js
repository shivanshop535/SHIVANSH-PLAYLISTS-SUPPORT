import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtZWJtcmlvamNhcmRhdWFxb2ppIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTU4NDc2NiwiZXhwIjoyMTAxMTYwNzY2fQ.Oy0lXql841FyNGTYCj8iqkQttbEEdvSMmg9zHFZ227A; // Use Service Role Key to bypass RLS safely on the backend

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment configuration variables.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
