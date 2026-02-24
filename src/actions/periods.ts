"use server";

import { revalidatePath } from "next/cache";
import supabase from "@/lib/db";
import { ensureUser } from "@/lib/user";
import { periodSchema, type PeriodInput } from "@/lib/validations";
import type { TrackingPeriod, ActionResult } from "@/lib/types";

// â”€â”€â”€ Read â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function getPeriods(): Promise<TrackingPeriod[]> {
  const user = await ensureUser();
  const { data } = await supabase
    .from("tracking_periods")
    .select("*")
    .eq("user_id", user.id)
    .order("start_date", { ascending: false });
  return (data ?? []) as TrackingPeriod[];
}

export async function getPeriodById(id: string): Promise<TrackingPeriod | null> {
  const user = await ensureUser();
  const { data } = await supabase
    .from("tracking_periods")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();
  return (data ?? null) as TrackingPeriod | null;
}

// â”€â”€â”€ Create â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function createPeriod(
  input: PeriodInput
): Promise<ActionResult<TrackingPeriod>> {
  const parsed = periodSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  try {
    const user = await ensureUser();
    const { name, type, start_date, end_date } = parsed.data;

    const { data, error } = await supabase
      .from("tracking_periods")
      .insert({ user_id: user.id, name, type, start_date, end_date })
      .select()
      .single();

    if (error || !data) return { success: false, error: error?.message ?? "Unknown error" };

    revalidatePath("/dashboard/periods");
    return { success: true, data: data as TrackingPeriod };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

// â”€â”€â”€ Update â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function updatePeriod(
  id: string,
  input: PeriodInput
): Promise<ActionResult<TrackingPeriod>> {
  const parsed = periodSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  try {
    const user = await ensureUser();
    const { name, type, start_date, end_date } = parsed.data;

    const { data, error } = await supabase
      .from("tracking_periods")
      .update({ name, type, start_date, end_date })
      .eq("id", id)
      .eq("user_id", user.id)
      .eq("is_closed", false)
      .select()
      .single();

    if (error || !data) return { success: false, error: "Period not found or already closed." };

    revalidatePath("/dashboard/periods");
    return { success: true, data: data as TrackingPeriod };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

// â”€â”€â”€ Close â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function closePeriod(id: string): Promise<ActionResult<TrackingPeriod>> {
  try {
    const user = await ensureUser();

    const { data, error } = await supabase
      .from("tracking_periods")
      .update({ is_closed: true })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error || !data) return { success: false, error: "Period not found." };

    revalidatePath("/dashboard/periods");
    revalidatePath("/dashboard/budgets");
    return { success: true, data: data as TrackingPeriod };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

// â”€â”€â”€ Delete â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function deletePeriod(id: string): Promise<ActionResult> {
  try {
    const user = await ensureUser();

    const { error } = await supabase
      .from("tracking_periods")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) return { success: false, error: error.message };

    revalidatePath("/dashboard/periods");
    revalidatePath("/dashboard/budgets");
    revalidatePath("/dashboard/spendings");
    return { success: true, data: undefined };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}
