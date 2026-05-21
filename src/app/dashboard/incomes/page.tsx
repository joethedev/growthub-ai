import { getIncomes } from "@/actions/incomes";
import { getUserSettings } from "@/actions/settings";
import IncomeManager from "@/components/dashboard/IncomeManager";

export const metadata = { title: "Incomes — Floussi.Pro" };

export default async function IncomesPage() {
  const [incomes, user] = await Promise.all([getIncomes(), getUserSettings()]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">Income Streams</h1>
        <p className="text-sm text-muted mt-1">
          Track your salary, freelance work, cashback, and any other income sources.
        </p>
      </div>
      <IncomeManager initialIncomes={incomes} currency={user.currency ?? "USD"} />
    </div>
  );
}
