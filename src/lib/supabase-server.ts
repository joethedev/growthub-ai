import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

/**
 * Creates a new Supabase server client with the service role key.
 * Use this in API routes / Route Handlers where you need a fresh client
 * instance per request. For server actions, prefer the default export
 * from `./db` directly.
 *
 * NOTE: The `users` table columns are:
 *   clerk_id, email, first_name, last_name, image_url, currency, role
 * Not: full_name, avatar_url — map Clerk fields accordingly.
 */
export function createSupabaseServerClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
