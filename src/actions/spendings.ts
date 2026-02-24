"use server";

import { revalidatePath } from "next/cache";
import supabase from "@/lib/db";
import { ensureUser } from "@/lib/user";
import { spendingSchema, type SpendingInput } from "@/lib/validations";
import type { Spending, ActionResult } from "@/lib/types";

// â”€â”€â”€ Ownership helper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/** Returns the period id if the budget is owned by userId, otherwise null. */
async function assertBudgetOwner(budgetId: string, userId: string): Promise<string | null> {
  const { data: budget } = await supabase
    .from("budgets")
    .select("tracking_period_id")
    .eq("id", budgetId)
    .single();
  if (!budget) return null;
  const { data: period } = await supabase
    .from("tracking_periods")
    .select("id")
    .eq("id", budget.tracking_period_id)
    .eq("user_id", userId)
    .single();
  return period ? budget.tracking_period_id : null;
}

// â”€â”€â”€ Read â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function getSpendingsByPeriod(periodId: string): Promise<Spending[]> {
  const user = await ensureUser();

  // Verify period ownership
  const { data: period } = await supabase
    .from("tracking_periods")
    .select("id")
    .eq("id", periodId)
    .eq("user_id", user.id)
    .single();
  if (!period) return [];

  // Fetch budgets for this period (with their category info)
  const { data: budgets } = await supabase
    .from("budgets")
    .select("id, categories(name, color, icon)")
    .eq("tracking_period_id", periodId);
  if (!budgets || budgets.length === 0) return [];

  const budgetMap = new Map((budgets as any[]).map((b) => [b.id, b]));
  const budgetIds = [...budgetMap.keys()];

  // Fetch spendings for those budgets
  const { data: spendings } = await supabase
    .from("spendings")
    .select("*")
    .in("budget_id", budgetIds)
    .order("spending_date", { ascending: false })
    .order("created_at", { ascending: false });

  return ((spendings ?? []) as any[]).map((s) => ({
    ...s,
    category_name: budgetMap.get(s.budget_id)?.categories?.name ?? "",
    category_color: budgetMap.get(s.budget_id)?.categories?.color ?? null,
    category_icon: budgetMap.get(s.budget_id)?.categories?.icon ?? null,
    period_name: "",
  })) as Spending[];
}

// â”€â”€â”€ Create â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function createSpending(
  input: SpendingInput
): Promise<ActionResult<Spending>> {
  const parsed = spendingSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  try {
    const user = await ensureUser();
    const { budget_id, amount, spending_date, note } = parsed.data;

    const owned = await assertBudgetOwner(budget_id, user.id);
    if (!owned) return { success: false, error: "Budget not found." };

    const { data, error } = await supabase
      .from("spendings")
      .insert({ budget_id, amount, spending_date, note: note ?? null })
      .select()
      .single();

    if (error || !data) return { success: false, error: error?.message ?? "Unknown error" };

    revalidatePath("/dashboard/spendings");
    revalidatePath("/dashboard/budgets");
    return { success: true, data: data as Spending };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

// â”€â”€â”€ Update â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function updateSpending(
  id: string,
  input: Pick<SpendingInput, "amount" | "spending_date" | "note">
): Promise<ActionResult<Spending>> {
  const parsed = spendingSchema
    .pick({ amount: true, spending_date: true, note: true })
    .safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  try {
    const user = await ensureUser();

    const { data: spending } = await supabase
      .from("spendings")
      .select("budget_id")
      .eq("id", id)
      .single();
    if (!spending) return { success: false, error: "Spending not found." };

    const owned = await assertBudgetOwner(spending.budget_id, user.id);
    if (!owned) return { success: false, error: "Spending not found." };

    const { data, error } = await supabase
      .from("spendings")
      .update({
        amount: parsed.data.amount,
        spending_date: parsed.data.spending_date,
        note: parsed.data.note ?? null,
      })
      .eq("id", id)
      .select()
      .single();

    if (error || !data) return { success: false, error: error?.message ?? "Unknown error" };

    revalidatePath("/dashboard/spendings");
    revalidatePath("/dashboard/budgets");
    return { success: true, data: data as Spending };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

// â”€â”€â”€ Delete â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function deleteSpending(id: string): Promise<ActionResult> {
  try {
    const user = await ensureUser();

    const { data: spending } = await supabase
      .from("spendings")
      .select("budget_id")
      .eq("id", id)
      .single();
    if (!spending) return { success: false, error: "Spending not found." };

    const owned = await assertBudgetOwner(spending.budget_id, user.id);
    if (!owned) return { success: false, error: "Spending not found." };

    const { error } = await supabase.from("spendings").delete().eq("id", id);
    if (error) return { success: false, error: error.message };

    revalidatePath("/dashboard/spendings");
    revalidatePath("/dashboard/budgets");
    return { success: true, data: undefined };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}
