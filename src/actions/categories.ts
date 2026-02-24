"use server";

import { revalidatePath } from "next/cache";
import supabase from "@/lib/db";
import { ensureUser } from "@/lib/user";
import { categorySchema, type CategoryInput } from "@/lib/validations";
import type { Category, ActionResult } from "@/lib/types";

// â”€â”€â”€ Read â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function getCategories(includeArchived = false): Promise<Category[]> {
  const user = await ensureUser();
  let query = supabase
    .from("categories")
    .select("*")
    .eq("user_id", user.id);
  if (!includeArchived) query = query.eq("is_archived", false);
  const { data } = await query.order("name");
  return (data ?? []) as Category[];
}

// â”€â”€â”€ Create â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function createCategory(
  input: CategoryInput
): Promise<ActionResult<Category>> {
  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  try {
    const user = await ensureUser();
    const { name, description, icon, color } = parsed.data;

    const { data, error } = await supabase
      .from("categories")
      .insert({ user_id: user.id, name, description: description ?? null, icon: icon ?? null, color: color ?? null })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") return { success: false, error: "A category with that name already exists." };
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/categories");
    return { success: true, data: data as Category };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

// â”€â”€â”€ Update â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function updateCategory(
  id: string,
  input: CategoryInput
): Promise<ActionResult<Category>> {
  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  try {
    const user = await ensureUser();
    const { name, description, icon, color } = parsed.data;

    const { data, error } = await supabase
      .from("categories")
      .update({ name, description: description ?? null, icon: icon ?? null, color: color ?? null })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      if (error.code === "23505") return { success: false, error: "A category with that name already exists." };
      return { success: false, error: error.message };
    }
    if (!data) return { success: false, error: "Category not found." };

    revalidatePath("/dashboard/categories");
    return { success: true, data: data as Category };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

// â”€â”€â”€ Archive / Restore â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function toggleArchiveCategory(
  id: string
): Promise<ActionResult<Category>> {
  try {
    const user = await ensureUser();

    const { data: current } = await supabase
      .from("categories")
      .select("is_archived")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();
    if (!current) return { success: false, error: "Category not found." };

    const { data, error } = await supabase
      .from("categories")
      .update({ is_archived: !current.is_archived })
      .eq("id", id)
      .select()
      .single();

    if (error || !data) return { success: false, error: error?.message ?? "Unknown error" };

    revalidatePath("/dashboard/categories");
    return { success: true, data: data as Category };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

// â”€â”€â”€ Delete â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function deleteCategory(id: string): Promise<ActionResult> {
  try {
    const user = await ensureUser();

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) return { success: false, error: error.message };

    revalidatePath("/dashboard/categories");
    return { success: true, data: undefined };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}
