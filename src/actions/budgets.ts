"use server";

import { revalidatePath } from "next/cache";
import supabase from "@/lib/db";
import { ensureUser } from "@/lib/user";
import { budgetSchema, type BudgetInput } from "@/lib/validations";
import type { Budget, ActionResult } from "@/lib/types";

// â”€â”€â”€ Ownership helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

async function periodBelongsToUser(periodId: string, userId: string): Promise<boolean> {
  const { data } = await supabase
    .from("tracking_periods")
    .select("id")
    .eq("id", periodId)
    .eq("user_id", userId)
    .single();
  return !!data;
}

async function budgetBelongsToUser(budgetId: string, userId: string): Promise<boolean> {
  const { data } = await supabase
    .from("budgets")
    .select("tracking_period_id")
    .eq("id", budgetId)
    .single();
  if (!data) return false;
  return periodBelongsToUser(data.tracking_period_id, userId);
}

// â”€â”€â”€ Read â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function getBudgetsByPeriod(periodId: string): Promise<Budget[]> {
  const user = await ensureUser();
  if (!(await periodBelongsToUser(periodId, user.id))) return [];

  const { data } = await supabase
    .from("budgets")
    .select("*, categories(name, color, icon), spendings(amount)")
    .eq("tracking_period_id", periodId)
    .order("category_id");

  return ((data ?? []) as any[]).map((row) => ({
    id: row.id,
    tracking_period_id: row.tracking_period_id,
    category_id: row.category_id,
    max_amount: row.max_amount,
    is_recurrent: row.is_recurrent,
    created_at: row.created_at,
    category_name: row.categories?.name ?? "",
    category_color: row.categories?.color ?? null,
    category_icon: row.categories?.icon ?? null,
    spent_total: ((row.spendings ?? []) as { amount: string }[])
      .reduce((sum, s) => sum + parseFloat(s.amount), 0)
      .toFixed(2),
  })) as Budget[];
}

// â”€â”€â”€ Create â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function createBudget(
  input: BudgetInput
): Promise<ActionResult<Budget>> {
  const parsed = budgetSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  try {
    const user = await ensureUser();
    const { tracking_period_id, category_id, max_amount, is_recurrent } = parsed.data;

    if (!(await periodBelongsToUser(tracking_period_id, user.id)))
      return { success: false, error: "Tracking period not found." };

    const { data, error } = await supabase
      .from("budgets")
      .insert({ tracking_period_id, category_id, max_amount, is_recurrent: is_recurrent ?? false })
      .select()
      .single();

    if (error) {
      if (error.code === "23505")
        return { success: false, error: "A budget for this category already exists in this period." };
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/budgets");
    return { success: true, data: data as Budget };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

// â”€â”€â”€ Update â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function updateBudget(
  id: string,
  input: Pick<BudgetInput, "max_amount" | "is_recurrent">
): Promise<ActionResult<Budget>> {
  const parsed = budgetSchema
    .pick({ max_amount: true, is_recurrent: true })
    .safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  try {
    const user = await ensureUser();
    if (!(await budgetBelongsToUser(id, user.id)))
      return { success: false, error: "Budget not found." };

    const { data, error } = await supabase
      .from("budgets")
      .update({ max_amount: parsed.data.max_amount, is_recurrent: parsed.data.is_recurrent ?? false })
      .eq("id", id)
      .select()
      .single();

    if (error || !data) return { success: false, error: error?.message ?? "Unknown error" };

    revalidatePath("/dashboard/budgets");
    return { success: true, data: data as Budget };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

// â”€â”€â”€ Delete â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function deleteBudget(id: string): Promise<ActionResult> {
  try {
    const user = await ensureUser();
    if (!(await budgetBelongsToUser(id, user.id)))
      return { success: false, error: "Budget not found." };

    const { error } = await supabase.from("budgets").delete().eq("id", id);
    if (error) return { success: false, error: error.message };

    revalidatePath("/dashboard/budgets");
    revalidatePath("/dashboard/spendings");
    return { success: true, data: undefined };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}
