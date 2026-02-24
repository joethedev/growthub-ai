import { fmtAmount } from "@/lib/format-currency";
import type { DaySpend } from "@/actions/dashboard";

interface Props {
  days: DaySpend[];
  currency: string;
}

export default function SpendingChart({ days, currency }: Props) {
  const max = Math.max(...days.map((d) => d.amount), 1);
  const weekTotal = days.reduce((s, d) => s + d.amount, 0);

  // Date-range label e.g. "Feb 17 – Feb 24"
  const fmt = (iso: string) =>
    new Date(iso + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const rangeLabel =
    days.length >= 2 ? `${fmt(days[0].date)} – ${fmt(days[days.length - 1].date)}` : "";

  return (
    <div className="card flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Weekly Spending</p>
          <p className="text-xs text-muted mt-0.5">{rangeLabel}</p>
        </div>
        <span
          className="text-xs font-semibold px-3 py-1 rounded-full"
          style={{ backgroundColor: "hsl(var(--accent) / 0.1)", color: "hsl(var(--accent))" }}
        >
          This Week
        </span>
      </div>

      {/* Bar chart */}
      <div className="flex items-end gap-2 h-36" role="img" aria-label="Bar chart of weekly spending">
        {days.map((d, i) => {
          const isToday = i === days.length - 1;
          const heightPct = max > 0 ? (d.amount / max) * 100 : 0;
          return (
            <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
              {d.amount > 0 && (
                <span className="text-[10px] text-muted mb-1">{fmtAmount(d.amount, currency)}</span>
              )}
              {d.amount === 0 && <span className="text-[10px] text-muted mb-1">&nbsp;</span>}
              <div className="w-full flex flex-col justify-end" style={{ height: "80px" }}>
                <div
                  className="w-full rounded-t-md transition-all duration-500"
                  style={{
                    height: heightPct > 0 ? `${Math.max(heightPct, 4)}%` : "2px",
                    background: isToday ? "hsl(var(--accent))" : "hsl(var(--border))",
                    opacity: isToday ? 1 : 0.7,
                  }}
                  title={`${d.day}: ${fmtAmount(d.amount, currency)}`}
                />
              </div>
              <span className="text-[10px] text-muted">{d.day}</span>
            </div>
          );
        })}
      </div>

      {/* Total */}
      <div className="flex items-center justify-between border-t border-subtle pt-4">
        <span className="text-xs text-muted">Total this week</span>
        <span className="text-sm font-bold text-primary">{fmtAmount(weekTotal, currency)}</span>
      </div>
    </div>
  );
}
