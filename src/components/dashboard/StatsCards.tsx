import { fmtAmount } from "@/lib/format-currency";
import type { DashboardStats } from "@/actions/dashboard";

interface Props {
  stats: DashboardStats;
  currency: string;
}

export default function StatsCards({ stats, currency }: Props) {
  const netBalance = stats.estimatedMonthlyIncome - stats.totalSpent;
  const budgetUsedPct =
    stats.totalBudget > 0
      ? Math.round((stats.totalSpent / stats.totalBudget) * 100)
      : 0;

  const cards = [
    {
      label: "Total Spent",
      value: fmtAmount(stats.totalSpent, currency),
      sub: stats.periodName ? `in ${stats.periodName}` : "current period",
      accentColor: "hsl(var(--danger))",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>
        </svg>
      ),
    },
    {
      label: "Est. Monthly Income",
      value: fmtAmount(stats.estimatedMonthlyIncome, currency),
      sub: "from active streams",
      accentColor: "hsl(142 71% 45%)",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 3v18h18"/><path d="m19 15-5-5-4 4-3-3"/>
        </svg>
      ),
    },
    {
      label: "Net Balance",
      value: fmtAmount(netBalance, currency),
      sub: netBalance >= 0 ? "positive cashflow" : "spending over income",
      accentColor: netBalance >= 0 ? "hsl(var(--accent))" : "hsl(var(--danger))",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="12" y1="1" x2="12" y2="23"/>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      ),
    },
    {
      label: "Budget Used",
      value: `${budgetUsedPct}%`,
      sub: `${stats.txCount} transaction${stats.txCount !== 1 ? "s" : ""} logged`,
      accentColor: budgetUsedPct > 90 ? "hsl(var(--danger))" : "hsl(200 80% 55%)",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 2a10 10 0 1 0 10 10H12V2z"/>
          <path d="M21.18 8.02c-1-2.3-2.85-4.17-5.16-5.18"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="card flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted uppercase tracking-wider">
              {card.label}
            </span>
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${card.accentColor}1a`, color: card.accentColor }}
              aria-hidden="true"
            >
              {card.icon}
            </span>
          </div>
          <p className="text-2xl font-extrabold text-primary tracking-tight">
            {card.value}
          </p>
          <p className="text-xs text-muted">{card.sub}</p>
        </div>
      ))}
    </div>
  );
}
