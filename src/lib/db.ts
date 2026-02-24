import { createClient } from "@supabase/supabase-js";

// Server-side client using the service role key — bypasses RLS.
// Ownership is enforced manually in every server action.
// Never import this in client components.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

export default supabase;
