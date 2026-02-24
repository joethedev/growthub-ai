import { currentUser } from "@clerk/nextjs/server";
import { getDashboardData } from "@/actions/dashboard";
import StatsCards from "@/components/dashboard/StatsCards";
import SpendingChart from "@/components/dashboard/SpendingChart";
import BudgetProgress from "@/components/dashboard/BudgetProgress";
import TransactionList from "@/components/dashboard/TransactionList";
import AIAlerts from "@/components/dashboard/AIAlerts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — GrowthOS",
};

function greet(firstName: string) {
  const h = new Date().getHours();
  if (h < 12) return `Good morning, ${firstName} 👋`;
  if (h < 18) return `Good afternoon, ${firstName} 👋`;
  return `Good evening, ${firstName} 👋`;
}

export default async function DashboardPage() {
  const [user, data] = await Promise.all([currentUser(), getDashboardData()]);
  const firstName = user?.firstName ?? "there";
  const { stats, weeklyDays, budgetProgress, recentTransactions, currency } = data;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Greeting */}
      <div>
        <h2 className="text-xl font-bold text-primary">{greet(firstName)}</h2>
        <p className="text-sm text-muted mt-1">
          {stats.periodName
            ? `Showing data for your current period: ${stats.periodName}.`
            : "Set up a tracking period to start seeing your data here."}
        </p>
      </div>

      {/* Stats row */}
      <StatsCards stats={stats} currency={currency} />

      {/* Middle row: chart + AI alerts */}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <SpendingChart days={weeklyDays} currency={currency} />
        <AIAlerts rows={budgetProgress} stats={stats} currency={currency} />
      </div>

      {/* Bottom row: transactions + budgets */}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <TransactionList transactions={recentTransactions} currency={currency} />
        <BudgetProgress rows={budgetProgress} periodName={stats.periodName} currency={currency} />
      </div>
    </div>
  );
}

