"use server";

import supabase from "@/lib/db";
import { ensureUser } from "@/lib/user";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DaySpend {
  day: string;   // "Mon", "Tue" …
  date: string;  // ISO "2026-02-17"
  amount: number;
}

export interface BudgetProgressRow {
  id: string;
  categoryName: string;
  categoryColor: string;
  spent: number;
  budget: number;
  pct: number;
  over: boolean;
}

export interface RecentTransaction {
  id: string;
  note: string | null;
  amount: number;
  date: string;
  categoryName: string;
  categoryColor: string;
  categoryIcon: string | null;
}

export interface DashboardStats {
  totalSpent: number;
  totalBudget: number;
  estimatedMonthlyIncome: number;
  txCount: number;
  periodName: string | null;
}

export interface DashboardData {
  stats: DashboardStats;
  weeklyDays: DaySpend[];
  budgetProgress: BudgetProgressRow[];
  recentTransactions: RecentTransaction[];
  currency: string;
}

// ─── Aggregation ──────────────────────────────────────────────────────────────

export async function getDashboardData(): Promise<DashboardData> {
  const user = await ensureUser();

  // 1. Find current period (latest open, else latest closed)
  const { data: periodsRaw } = await supabase
    .from("tracking_periods")
    .select("id, name, is_closed")
    .eq("user_id", user.id)
    .order("start_date", { ascending: false })
    .limit(10);

  const periods = periodsRaw ?? [];
  const openPeriod = periods.find((p: any) => !p.is_closed);
  const currentPeriod: { id: string; name: string } | null = openPeriod ?? periods[0] ?? null;

  // 2. Parallel: budgets (with spending rows + category info) + active incomes
  const [budgetsRes, incomesRes] = await Promise.all([
    currentPeriod
      ? supabase
          .from("budgets")
          .select("id, max_amount, categories(name, color, icon), spendings(id, amount, note, spending_date)")
          .eq("tracking_period_id", currentPeriod.id)
      : Promise.resolve({ data: [] as any[] }),
    supabase
      .from("incomes")
      .select("amount, frequency")
      .eq("user_id", user.id)
      .eq("is_active", true),
  ]);

  const allBudgets: any[] = (budgetsRes as any).data ?? [];

  // Flatten all spendings with their parent category info
  const allSpendings = allBudgets.flatMap((b: any) =>
    (b.spendings ?? []).map((sp: any) => ({
      id: sp.id,
      amount: sp.amount,
      note: sp.note ?? null,
      spending_date: sp.spending_date,
      categoryName: b.categories?.name ?? "Unknown",
      categoryColor: b.categories?.color ?? "hsl(var(--accent))",
      categoryIcon: b.categories?.icon ?? null,
    }))
  );

  // 3. Budget-progress rows
  const budgetProgress: BudgetProgressRow[] = allBudgets.map((b: any) => {
    const spent = (b.spendings ?? []).reduce(
      (sum: number, sp: any) => sum + parseFloat(sp.amount || "0"),
      0
    );
    const budget = parseFloat(b.max_amount || "0");
    const pct = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
    return {
      id: b.id,
      categoryName: b.categories?.name ?? "Unknown",
      categoryColor: b.categories?.color ?? "hsl(var(--accent))",
      spent,
      budget,
      pct,
      over: spent > budget,
    };
  });

  // 4. Stats
  const totalSpent  = budgetProgress.reduce((s, r) => s + r.spent, 0);
  const totalBudget = budgetProgress.reduce((s, r) => s + r.budget, 0);
  const txCount     = allSpendings.length;

  // 5. Monthly income estimate (from active income streams)
  function toMonthly(amount: number, freq: string): number {
    switch (freq) {
      case "weekly":    return (amount * 52) / 12;
      case "bi_weekly": return (amount * 26) / 12;
      case "monthly":   return amount;
      case "quarterly": return amount / 3;
      case "yearly":    return amount / 12;
      default:          return 0; // "once" → not counted in monthly
    }
  }
  const estimatedMonthlyIncome = ((incomesRes as any).data ?? []).reduce(
    (s: number, i: any) => s + toMonthly(parseFloat(i.amount || "0"), i.frequency),
    0
  );

  // 6. Recent transactions — last 8 spendings sorted by date desc
  const recentTransactions: RecentTransaction[] = allSpendings
    .slice()
    .sort((a: any, b: any) =>
      b.spending_date > a.spending_date ? 1 : b.spending_date < a.spending_date ? -1 : 0
    )
    .slice(0, 8)
    .map((sp: any) => ({
      id: sp.id,
      note: sp.note,
      amount: parseFloat(sp.amount || "0"),
      date: sp.spending_date,
      categoryName: sp.categoryName,
      categoryColor: sp.categoryColor,
      categoryIcon: sp.categoryIcon,
    }));

  // 7. Weekly spending — last 7 calendar days
  const today = new Date();
  const weeklyDays: DaySpend[] = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    return {
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
      date: d.toISOString().split("T")[0],
      amount: 0,
    };
  });
  allSpendings.forEach((sp: any) => {
    const idx = weeklyDays.findIndex((d) => d.date === sp.spending_date);
    if (idx !== -1) weeklyDays[idx].amount += parseFloat(sp.amount || "0");
  });

  return {
    stats: { totalSpent, totalBudget, estimatedMonthlyIncome, txCount, periodName: currentPeriod?.name ?? null },
    weeklyDays,
    budgetProgress,
    recentTransactions,
    currency: user.currency ?? "USD",
  };
}
