import { getPeriods } from "@/actions/periods";
import PeriodManager from "@/components/dashboard/PeriodManager";

export const metadata = { title: "Periods — GrowthOS" };

export default async function PeriodsPage() {
  const periods = await getPeriods();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">Tracking Periods</h1>
        <p className="text-sm text-muted mt-1">Define monthly or custom date ranges to track your spending against budgets.</p>
      </div>
      <PeriodManager initialPeriods={periods} />
    </div>
  );
}
