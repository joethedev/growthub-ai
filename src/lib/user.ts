import { auth, currentUser } from "@clerk/nextjs/server";
import supabase from "./db";
import type { DbUser } from "./types";

/**
 * Gets the authenticated Clerk user, syncing them to the `users` table on
 * first visit (upsert via Supabase). Returns the DB user row.
 * Throws if not authenticated.
 */
export async function ensureUser(): Promise<DbUser> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Fast path: user already in DB
  const { data: existing } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_id", userId)
    .single();
  if (existing) return existing as DbUser;

  // Slow path: first visit — fetch Clerk profile and upsert
  const clerkUser = await currentUser();
  if (!clerkUser) throw new Error("Unauthorized");

  const email = clerkUser.emailAddresses[0]?.emailAddress ?? "";

  const { data: created, error } = await supabase
    .from("users")
    .upsert(
      {
        clerk_id: userId,
        email,
        first_name: clerkUser.firstName ?? null,
        last_name: clerkUser.lastName ?? null,
        image_url: clerkUser.imageUrl ?? null,
      },
      { onConflict: "clerk_id" }
    )
    .select()
    .single();

  if (error || !created) throw new Error(error?.message ?? "Failed to sync user");
  return created as DbUser;
}
