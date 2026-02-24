import { z } from "zod";

// ─── Category ─────────────────────────────────────────────────────────────────

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Max 100 characters"),
  description: z.string().max(500).optional(),
  icon: z.string().max(50).optional(),
  color: z.string().max(20).optional(),
});

export type CategoryInput = z.infer<typeof categorySchema>;

// ─── Tracking Period ──────────────────────────────────────────────────────────

export const periodSchema = z.object({
  name: z.string().min(1, "Name is required").max(120, "Max 120 characters"),
  type: z.enum(["MONTHLY", "WEEKLY", "CUSTOM"]),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
}).refine((d) => d.start_date < d.end_date, {
  message: "End date must be after start date",
  path: ["end_date"],
});

export type PeriodInput = z.infer<typeof periodSchema>;

// ─── Budget ───────────────────────────────────────────────────────────────────

export const budgetSchema = z.object({
  tracking_period_id: z.string().min(1),
  category_id: z.string().min(1),
  max_amount: z.coerce
    .number({ message: "Amount must be a number" })
    .nonnegative("Amount must be ≥ 0"),
  is_recurrent: z.boolean().optional().default(false),
});

export type BudgetInput = z.infer<typeof budgetSchema>;

// ─── Spending ─────────────────────────────────────────────────────────────────

export const spendingSchema = z.object({
  budget_id: z.string().min(1, "Budget is required"),
  amount: z.coerce
    .number({ message: "Amount must be a number" })
    .positive("Amount must be greater than 0"),
  spending_date: z.string().min(1, "Date is required"),
  note: z.string().max(500).optional(),
});

export type SpendingInput = z.infer<typeof spendingSchema>;

// ─── Income ───────────────────────────────────────────────────────────────────

export const incomeSchema = z.object({
  name: z.string().min(1, "Name is required").max(120, "Max 120 characters"),
  type: z.string().min(1, "Type is required"),
  amount: z.coerce
    .number({ message: "Amount must be a number" })
    .positive("Amount must be greater than 0"),
  frequency: z.string().min(1, "Frequency is required"),
  received_at: z.string().optional(),
  notes: z.string().max(500).optional(),
  is_active: z.boolean().optional().default(true),
});

export type IncomeInput = z.infer<typeof incomeSchema>;
