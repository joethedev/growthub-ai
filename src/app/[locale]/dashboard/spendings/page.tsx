import { getPeriods } from "@/actions/periods";
import { getUserSettings } from "@/actions/settings";
import SpendingManager from "@/components/dashboard/SpendingManager";

export const metadata = { title: "Spendings — Floussi.Pro" };

export default async function SpendingsPage() {
  const [periods, user] = await Promise.all([getPeriods(), getUserSettings()]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">Spendings</h1>
        <p className="text-sm text-muted mt-1">Log and review individual transactions within your budgets.</p>
      </div>
      <SpendingManager periods={periods} currency={user.currency ?? "USD"} />
    </div>
  );
}
