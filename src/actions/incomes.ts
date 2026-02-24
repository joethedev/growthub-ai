"use server";

import { revalidatePath } from "next/cache";
import supabase from "@/lib/db";
import { ensureUser } from "@/lib/user";
import { incomeSchema, type IncomeInput } from "@/lib/validations";
import type { Income, ActionResult } from "@/lib/types";

// ─── Read ─────────────────────────────────────────────────────────────────────

export async function getIncomes(): Promise<Income[]> {
  const user = await ensureUser();
  const { data } = await supabase
    .from("incomes")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  return (data ?? []) as Income[];
}

export async function getActiveIncomes(): Promise<Income[]> {
  const user = await ensureUser();
  const { data } = await supabase
    .from("incomes")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  return (data ?? []) as Income[];
}

// ─── Create ───────────────────────────────────────────────────────────────────

export async function createIncome(
  input: IncomeInput
): Promise<ActionResult<Income>> {
  const parsed = incomeSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  try {
    const user = await ensureUser();
    const { name, type, amount, frequency, received_at, notes, is_active } = parsed.data;

    const { data, error } = await supabase
      .from("incomes")
      .insert({
        user_id: user.id,
        name,
        type,
        amount,
        frequency,
        received_at: received_at ?? null,
        notes: notes ?? null,
        is_active: is_active ?? true,
      })
      .select()
      .single();

    if (error) return { success: false, error: error.message };

    revalidatePath("/dashboard/incomes");
    return { success: true, data: data as Income };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

// ─── Update ───────────────────────────────────────────────────────────────────

export async function updateIncome(
  id: string,
  input: Partial<IncomeInput>
): Promise<ActionResult<Income>> {
  try {
    const user = await ensureUser();

    // Ownership check
    const { data: existing } = await supabase
      .from("incomes")
      .select("id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();
    if (!existing) return { success: false, error: "Income not found." };

    const { data, error } = await supabase
      .from("incomes")
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) return { success: false, error: error.message };

    revalidatePath("/dashboard/incomes");
    return { success: true, data: data as Income };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

// ─── Toggle active ────────────────────────────────────────────────────────────

export async function toggleIncomeActive(
  id: string,
  is_active: boolean
): Promise<ActionResult<Income>> {
  return updateIncome(id, { is_active });
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export async function deleteIncome(id: string): Promise<ActionResult> {
  try {
    const user = await ensureUser();

    const { data: existing } = await supabase
      .from("incomes")
      .select("id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();
    if (!existing) return { success: false, error: "Income not found." };

    const { error } = await supabase.from("incomes").delete().eq("id", id);
    if (error) return { success: false, error: error.message };

    revalidatePath("/dashboard/incomes");
    return { success: true, data: undefined };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}
