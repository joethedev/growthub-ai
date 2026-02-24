import Link from "next/link";
import { fmtAmount } from "@/lib/format-currency";
import type { RecentTransaction } from "@/actions/dashboard";

interface Props {
  transactions: RecentTransaction[];
  currency: string;
}

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function TransactionList({ transactions, currency }: Props) {
  return (
    <div className="card flex flex-col gap-1">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-primary">Recent Transactions</p>
        <Link
          href="/dashboard/spendings"
          className="text-xs font-medium text-accent hover:opacity-80 transition-opacity"
        >
          View all
        </Link>
      </div>

      {transactions.length === 0 ? (
        <p className="text-xs text-muted py-6 text-center">No transactions logged yet.</p>
      ) : (
        <div className="space-y-1">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-white/[0.03]"
            >
              {/* Category color dot / icon */}
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base"
                style={{
                  backgroundColor: `${tx.categoryColor}1a`,
                  border: "1px solid hsl(var(--border))",
                }}
                aria-hidden="true"
              >
                {tx.categoryIcon ?? (
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: tx.categoryColor }}
                  />
                )}
              </div>

              {/* Note + category + date */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-primary truncate">
                  {tx.note || tx.categoryName}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className="hidden sm:inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${tx.categoryColor}1a`, color: tx.categoryColor }}
                  >
                    {tx.categoryName}
                  </span>
                  <span className="text-[11px] text-muted">{formatDate(tx.date)}</span>
                </div>
              </div>

              {/* Amount */}
              <span className="text-sm font-semibold tabular-nums shrink-0 text-primary">
                -{fmtAmount(tx.amount, currency)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
