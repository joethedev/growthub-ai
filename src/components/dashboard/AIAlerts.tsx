import { fmtAmount } from "@/lib/format-currency";
import type { BudgetProgressRow, DashboardStats } from "@/actions/dashboard";

interface Alert {
  type: "warning" | "insight" | "tip";
  emoji: string;
  title: string;
  body: string;
}

interface Props {
  rows: BudgetProgressRow[];
  stats: DashboardStats;
  currency: string;
}

function buildAlerts(rows: BudgetProgressRow[], stats: DashboardStats, currency: string): Alert[] {
  const alerts: Alert[] = [];

  // Over-budget categories
  rows.filter((r) => r.over).forEach((r) => {
    alerts.push({
      type: "warning",
      emoji: "⚠️",
      title: `${r.categoryName} over budget`,
      body: `Exceeded the limit by ${fmtAmount(r.spent - r.budget, currency)}. Review recent transactions.`,
    });
  });

  // High usage (80–99%) but not over
  rows.filter((r) => !r.over && r.pct >= 80).forEach((r) => {
    alerts.push({
      type: "warning",
      emoji: "⚠️",
      title: `${r.categoryName} at ${Math.round(r.pct)}%`,
      body: `${fmtAmount(r.spent, currency)} of ${fmtAmount(r.budget, currency)} used. Pace yourself.`,
    });
  });

  // Savings rate insight
  if (stats.estimatedMonthlyIncome > 0) {
    const saved = stats.estimatedMonthlyIncome - stats.totalSpent;
    const rate  = (saved / stats.estimatedMonthlyIncome) * 100;
    if (rate > 20) {
      alerts.push({
        type: "insight",
        emoji: "✨",
        title: `${Math.round(rate)}% savings rate`,
        body: `You're saving ${fmtAmount(saved, currency)} this period. Great discipline!`,
      });
    } else if (rate < 0) {
      alerts.push({
        type: "warning",
        emoji: "💸",
        title: "Spending exceeds income",
        body: `Spending is ${fmtAmount(-saved, currency)} above your estimated monthly income.`,
      });
    }
  }

  if (alerts.length === 0 && rows.length > 0) {
    alerts.push({ type: "tip", emoji: "💡", title: "All budgets on track", body: `${rows.length} budget${rows.length !== 1 ? "s" : ""} in good standing. Keep it up!` });
  }
  if (alerts.length === 0) {
    alerts.push({ type: "tip", emoji: "💡", title: "No data yet", body: "Set up a tracking period and add budgets to see smart insights here." });
  }

  return alerts.slice(0, 3);
}

export default function AIAlerts({ rows, stats, currency }: Props) {
  const alerts = buildAlerts(rows, stats, currency);

  return (
    <div className="card flex flex-col gap-1">
      <div className="flex items-center gap-2 mb-4">
        <span
          className="flex h-6 w-6 items-center justify-center rounded-md text-xs"
          style={{ backgroundColor: "hsl(var(--accent) / 0.12)", color: "hsl(var(--accent))" }}
          aria-hidden="true"
        >
          ✦
        </span>
        <p className="text-sm font-semibold text-primary">Smart Insights</p>
      </div>

      <div className="space-y-3">
        {alerts.map((alert, i) => (
          <div
            key={i}
            className="flex items-start gap-3 rounded-xl p-3 border"
            style={{
              borderColor: alert.type === "warning"
                ? "hsl(var(--danger) / 0.25)"
                : "hsl(var(--accent) / 0.15)",
              backgroundColor: alert.type === "warning"
                ? "hsl(var(--danger) / 0.05)"
                : "hsl(var(--accent) / 0.04)",
            }}
          >
            <span className="text-base shrink-0 mt-0.5" aria-hidden="true">{alert.emoji}</span>
            <div>
              <p
                className="text-xs font-semibold mb-0.5"
                style={{
                  color: alert.type === "warning"
                    ? "hsl(var(--danger))"
                    : "hsl(var(--accent))",
                }}
              >
                {alert.title}
              </p>
              <p className="text-xs leading-relaxed text-muted">{alert.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
