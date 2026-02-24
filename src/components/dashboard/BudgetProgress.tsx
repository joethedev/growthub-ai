import { fmtAmount } from "@/lib/format-currency";
import type { BudgetProgressRow } from "@/actions/dashboard";

interface Props {
  rows: BudgetProgressRow[];
  periodName: string | null;
  currency: string;
}

export default function BudgetProgress({ rows, periodName, currency }: Props) {
  // Sort by pct desc so worst overages appear first
  const sorted = [...rows].sort((a, b) => b.pct - a.pct).slice(0, 6);

  return (
    <div className="card flex flex-col gap-1">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-primary">Budget Progress</p>
        <span className="text-xs text-muted">{periodName ?? "Current period"}</span>
      </div>

      {sorted.length === 0 ? (
        <p className="text-xs text-muted py-4 text-center">
          No budgets yet for this period.
        </p>
      ) : (
        <div className="space-y-4">
          {sorted.map((row) => (
            <div key={row.id}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: row.categoryColor }}
                    aria-hidden="true"
                  />
                  <span className="text-xs font-medium text-primary">{row.categoryName}</span>
                </div>
                <span
                  className="text-xs font-semibold"
                  style={{ color: row.over ? "hsl(var(--danger))" : "hsl(var(--text-muted))" }}
                >
                  {fmtAmount(row.spent, currency)}
                  <span className="text-muted font-normal"> / {fmtAmount(row.budget, currency)}</span>
                </span>
              </div>

              <div
                className="h-1.5 w-full rounded-full overflow-hidden"
                style={{ backgroundColor: "hsl(var(--border))" }}
                role="progressbar"
                aria-valuenow={row.spent}
                aria-valuemax={row.budget}
                aria-label={`${row.categoryName}: ${fmtAmount(row.spent, currency)} of ${fmtAmount(row.budget, currency)}`}
              >
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${row.pct}%`,
                    backgroundColor: row.over ? "hsl(var(--danger))" : row.categoryColor,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
