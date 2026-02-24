"use server";

import { revalidatePath } from "next/cache";
import supabase from "@/lib/db";
import { ensureUser } from "@/lib/user";
import { CURRENCIES, type CurrencyCode } from "@/lib/currencies";
import type { ActionResult, DbUser } from "@/lib/types";

export async function getUserSettings(): Promise<DbUser> {
  const user = await ensureUser();
  return user;
}

export async function updateCurrency(
  currency: string
): Promise<ActionResult<DbUser>> {
  const valid = CURRENCIES.map((c) => c.code);
  if (!valid.includes(currency as CurrencyCode)) {
    return { success: false, error: "Invalid currency." };
  }

  try {
    const user = await ensureUser();

    const { data, error } = await supabase
      .from("users")
      .update({ currency })
      .eq("id", user.id)
      .select()
      .single();

    if (error || !data) return { success: false, error: error?.message ?? "Unknown error" };

    revalidatePath("/dashboard/settings");
    return { success: true, data: data as DbUser };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}
