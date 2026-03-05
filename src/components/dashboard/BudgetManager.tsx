"use client";

import { useState, useTransition, useCallback, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { getBudgetsByPeriod, createBudget, updateBudget, deleteBudget } from "@/actions/budgets";
import { fmtAmount } from "@/lib/format-currency";
import type { Budget, Category, TrackingPeriod } from "@/lib/types";

interface Props {
  periods: TrackingPeriod[];
  categories: Category[];
  currency: string;
}

const emptyForm = { category_id: "", max_amount: "", is_recurrent: false };

export default function BudgetManager({ periods, categories, currency }: Props) {
  const [selectedPeriodId, setSelectedPeriodId] = useState(periods[0]?.id ?? "");
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(!!periods[0]?.id);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Budget | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const loadBudgets = useCallback((periodId: string) => {
    if (!periodId) return;
    startTransition(async () => {
      const data = await getBudgetsByPeriod(periodId);
      setBudgets(data);
      setLoading(false);
    });
  }, []);

  // Auto-load the most recent period on mount
  useEffect(() => {
    if (periods[0]?.id) loadBudgets(periods[0].id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function selectPeriod(id: string) {
    setSelectedPeriodId(id);
    if (id) { setLoading(true); loadBudgets(id); }
    else { setBudgets([]); setLoading(false); }
  }

  function openAdd() {
    setForm({ ...emptyForm, category_id: categories[0]?.id ?? "" });
    setEditing(null); setError(""); setModal("add");
  }
  function openEdit(b: Budget) {
    setForm({ category_id: b.category_id, max_amount: String(b.max_amount), is_recurrent: b.is_recurrent });
    setEditing(b); setError(""); setModal("edit");
  }
  function closeModal() { setModal(null); setEditing(null); setError(""); }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError("");
    startTransition(async () => {
      if (modal === "edit" && editing) {
        const res = await updateBudget(editing.id, {
          max_amount: Number(form.max_amount),
          is_recurrent: form.is_recurrent,
        });
        if (!res.success) { setError(res.error); return; }
        setBudgets((prev) => prev.map((b) => b.id === editing.id ? { ...res.data, category_name: editing.category_name, category_color: editing.category_color, category_icon: editing.category_icon, spent_total: editing.spent_total } : b));
      } else {
        const res = await createBudget({
          tracking_period_id: selectedPeriodId,
          category_id: form.category_id,
          max_amount: Number(form.max_amount),
          is_recurrent: form.is_recurrent,
        });
        if (!res.success) { setError(res.error); return; }
        // Reload to get joined category info
        const fresh = await getBudgetsByPeriod(selectedPeriodId);
        setBudgets(fresh);
      }
      closeModal();
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this budget and all its spendings?")) return;
    startTransition(async () => {
      const res = await deleteBudget(id);
      if (!res.success) { alert(res.error); return; }
      setBudgets((prev) => prev.filter((b) => b.id !== id));
    });
  }

  const selectedPeriod = periods.find((p) => p.id === selectedPeriodId);

  // Categories not yet budgeted in this period
  const usedCategoryIds = new Set(budgets.map((b) => b.category_id));
  const availableCategories = categories.filter(
    (c) => !usedCategoryIds.has(c.id) || (editing && editing.category_id === c.id)
  );

  return (
    <>
      {/* Period selector */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <select
          className="form-input max-w-xs"
          value={selectedPeriodId}
          onChange={(e) => selectPeriod(e.target.value)}
        >
          <option value="">— Select a period —</option>
          {periods.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        {selectedPeriodId && !selectedPeriod?.is_closed && !loading && (
          <button onClick={openAdd} className="button-primary text-sm px-4 py-2 whitespace-nowrap" disabled={availableCategories.length === 0}>
            + Add Budget
          </button>
        )}
      </div>

      {!selectedPeriodId && (
        <div className="card py-16 text-center text-sm text-muted">Select a tracking period to manage budgets.</div>
      )}

      {selectedPeriodId && loading && (
        <div className="card py-16 text-center text-sm text-muted">Loading…</div>
      )}

      {!loading && selectedPeriodId && budgets.length === 0 && (
        <div className="card py-16 text-center text-sm text-muted">No budgets for this period yet.</div>
      )}

      {!loading && selectedPeriodId && budgets.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {budgets.map((b) => {
            const spent = parseFloat(b.spent_total ?? "0");
            const max = parseFloat(String(b.max_amount));
            const pct = max > 0 ? Math.min((spent / max) * 100, 100) : 0;
            const over = spent > max;
            return (
              <div key={b.id} className="card flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base" style={{ color: b.category_color ?? "hsl(var(--accent))" }}>{b.category_icon || "●"}</span>
                    <span className="text-sm font-semibold text-primary">{b.category_name}</span>
                  </div>
                  {b.is_recurrent && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full shrink-0" style={{ backgroundColor: "hsl(var(--accent)/0.1)", color: "hsl(var(--accent))" }}>Recurrent</span>
                  )}
                </div>

                <div className="flex items-end justify-between text-xs">
                  <span className="text-muted">Spent</span>
                  <span className={over ? "" : "text-primary"} style={over ? { color: "hsl(var(--danger))" } : {}}>
                    <strong>{fmtAmount(spent, currency)}</strong>
                    <span className="text-muted"> / {fmtAmount(max, currency)}</span>
                  </span>
                </div>

                <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ backgroundColor: "hsl(var(--border))" }}>
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: over ? "hsl(var(--danger))" : (b.category_color ?? "hsl(var(--accent))") }} />
                </div>

                {!selectedPeriod?.is_closed && (
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => openEdit(b)} className="text-xs flex-1 py-1.5 rounded-lg border border-subtle text-muted hover:text-primary hover-muted transition-colors">Edit</button>
                    <button onClick={() => handleDelete(b.id)} className="text-xs flex-1 py-1.5 rounded-lg border border-subtle transition-colors hover:bg-red-500/5" style={{ color: "hsl(var(--text-muted))" }}>Delete</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Spending Breakdown Chart ─────────────────────────────────────── */}
      {!loading && budgets.length > 0 && (
        <div className="mt-6 card">
          <p className="text-sm font-semibold text-primary mb-4">Spending Breakdown</p>
          <div className="space-y-3">
            {[...budgets]
              .sort(
                (a, b) =>
                  parseFloat(String(b.spent_total ?? "0")) -
                  parseFloat(String(a.spent_total ?? "0"))
              )
              .map((b) => {
                const spent = parseFloat(String(b.spent_total ?? "0"));
                const max   = parseFloat(String(b.max_amount));
                const pct   = max > 0 ? Math.min((spent / max) * 100, 100) : 0;
                const over  = spent > max;
                return (
                  <div key={b.id}>
                    <div className="flex items-center justify-between mb-1.5 gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span style={{ color: b.category_color ?? "hsl(var(--accent))" }}>
                          {b.category_icon || "●"}
                        </span>
                        <span className="text-xs font-medium text-primary truncate">{b.category_name}</span>
                      </div>
                      <div className="text-xs tabular-nums shrink-0 flex items-center gap-1.5">
                        <span className="text-muted">{fmtAmount(spent, currency)}<span className="text-muted/60"> / {fmtAmount(max, currency)}</span></span>
                        <span
                          className="font-semibold text-[10px] px-1.5 py-0.5 rounded-full"
                          style={{
                            backgroundColor: over ? "hsl(var(--danger)/0.12)" : "hsl(var(--accent)/0.1)",
                            color: over ? "hsl(var(--danger))" : "hsl(var(--accent))",
                          }}
                        >
                          {Math.round(pct)}%
                        </span>
                      </div>
                    </div>
                    <div
                      className="h-2 w-full rounded-full overflow-hidden"
                      style={{ backgroundColor: "hsl(var(--border))" }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${Math.max(pct, pct > 0 ? 1 : 0)}%`,
                          backgroundColor: over
                            ? "hsl(var(--danger))"
                            : (b.category_color ?? "hsl(var(--accent))"),
                        }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
          {/* Totals row */}
          <div className="mt-4 pt-3 border-t border-subtle flex items-center justify-between text-xs">
            <span className="text-muted">Period total</span>
            <span className="font-semibold text-primary">
              {fmtAmount(
                budgets.reduce((s, b) => s + parseFloat(String(b.spent_total ?? "0")), 0),
                currency
              )}
              {" "}
              <span className="text-muted font-normal">
                / {fmtAmount(budgets.reduce((s, b) => s + parseFloat(String(b.max_amount)), 0), currency)}
              </span>
            </span>
          </div>
        </div>
      )}

      <Modal open={modal !== null} onClose={closeModal} title={modal === "edit" ? "Edit Budget" : "New Budget"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-xs rounded-lg px-3 py-2" style={{ backgroundColor: "hsl(var(--danger)/0.1)", color: "hsl(var(--danger))" }}>{error}</p>}

          {modal === "add" && (
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-muted">Category *</label>
              <select className="form-input" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} required>
                <option value="">— Select category —</option>
                {availableCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-muted">Budget Limit *</label>
            <input type="number" step="0.01" min="0" className="form-input" value={form.max_amount} onChange={(e) => setForm({ ...form, max_amount: e.target.value })} placeholder="0.00" required />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_recurrent} onChange={(e) => setForm({ ...form, is_recurrent: e.target.checked })} className="rounded" />
            <span className="text-sm text-muted">Recurrent (copies to next period)</span>
          </label>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={closeModal} className="button-secondary flex-1">Cancel</button>
            <button type="submit" disabled={isPending} className="button-primary flex-1">{isPending ? "Saving…" : "Save"}</button>
          </div>
        </form>
      </Modal>
    </>
  );
}
