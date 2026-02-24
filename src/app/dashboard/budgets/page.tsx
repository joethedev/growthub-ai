import { getPeriods } from "@/actions/periods";
import { getCategories } from "@/actions/categories";
import { getUserSettings } from "@/actions/settings";
import BudgetManager from "@/components/dashboard/BudgetManager";

export const metadata = { title: "Budgets — GrowthOS" };

export default async function BudgetsPage() {
  const [periods, categories, user] = await Promise.all([getPeriods(), getCategories(), getUserSettings()]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">Budgets</h1>
        <p className="text-sm text-muted mt-1">Set spending limits per category for each tracking period.</p>
      </div>
      <BudgetManager periods={periods} categories={categories} currency={user.currency ?? "USD"} />
    </div>
  );
}
