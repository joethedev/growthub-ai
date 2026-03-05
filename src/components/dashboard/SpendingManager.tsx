"use client";

import { useState, useTransition, useCallback, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { getSpendingsByPeriod, createSpending, updateSpending, deleteSpending } from "@/actions/spendings";
import { getBudgetsByPeriod } from "@/actions/budgets";
import { fmtAmount } from "@/lib/format-currency";
import type { Spending, Budget, TrackingPeriod } from "@/lib/types";

interface Props { periods: TrackingPeriod[]; currency: string }

const today = new Date().toISOString().slice(0, 10);
const emptyForm = { budget_id: "", amount: "", spending_date: today, note: "" };

function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function SpendingManager({ periods, currency }: Props) {
  const [selectedPeriodId, setSelectedPeriodId] = useState(periods[0]?.id ?? "");
  const [spendings, setSpendings] = useState<Spending[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(!!periods[0]?.id);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Spending | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const loadData = useCallback((periodId: string) => {
    if (!periodId) return;
    startTransition(async () => {
      const [s, b] = await Promise.all([
        getSpendingsByPeriod(periodId),
        getBudgetsByPeriod(periodId),
      ]);
      setSpendings(s);
      setBudgets(b);
      setLoading(false);
    });
  }, []);

  // Auto-load the most recent period on mount
  useEffect(() => {
    if (periods[0]?.id) loadData(periods[0].id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function selectPeriod(id: string) {
    setSelectedPeriodId(id);
    if (id) { setLoading(true); loadData(id); }
    else { setSpendings([]); setBudgets([]); setLoading(false); }
  }

  function openAdd() {
    setForm({ ...emptyForm, budget_id: budgets[0]?.id ?? "" });
    setEditing(null); setError(""); setModal("add");
  }
  function openEdit(s: Spending) {
    setForm({ budget_id: s.budget_id, amount: String(s.amount), spending_date: s.spending_date.toString().slice(0, 10), note: s.note ?? "" });
    setEditing(s); setError(""); setModal("edit");
  }
  function closeModal() { setModal(null); setEditing(null); setError(""); }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError("");
    startTransition(async () => {
      if (modal === "edit" && editing) {
        const res = await updateSpending(editing.id, {
          amount: Number(form.amount),
          spending_date: form.spending_date,
          note: form.note || undefined,
        });
        if (!res.success) { setError(res.error); return; }
        setSpendings((prev) => prev.map((s) => s.id === editing.id ? { ...res.data, category_name: editing.category_name, category_color: editing.category_color, category_icon: editing.category_icon } : s));
      } else {
        const res = await createSpending({
          budget_id: form.budget_id,
          amount: Number(form.amount),
          spending_date: form.spending_date,
          note: form.note || undefined,
        });
        if (!res.success) { setError(res.error); return; }
        // Reload to get joined data
        const fresh = await getSpendingsByPeriod(selectedPeriodId);
        setSpendings(fresh);
      }
      closeModal();
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this spending?")) return;
    startTransition(async () => {
      const res = await deleteSpending(id);
      if (!res.success) { alert(res.error); return; }
      setSpendings((prev) => prev.filter((s) => s.id !== id));
    });
  }

  const selectedPeriod = periods.find((p) => p.id === selectedPeriodId);

  // Group spendings by date
  const grouped = spendings.reduce<Record<string, Spending[]>>((acc, s) => {
    const d = s.spending_date.toString().slice(0, 10);
    if (!acc[d]) acc[d] = [];
    acc[d].push(s);
    return acc;
  }, {});
  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  const totalSpent = spendings.reduce((sum, s) => sum + parseFloat(String(s.amount)), 0);

  return (
    <>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <select className="form-input max-w-xs" value={selectedPeriodId} onChange={(e) => selectPeriod(e.target.value)}>
          <option value="">— Select a period —</option>
          {periods.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        {selectedPeriodId && !selectedPeriod?.is_closed && !loading && budgets.length > 0 && (
          <button onClick={openAdd} className="button-primary text-sm px-4 py-2">+ Add Spending</button>
        )}
      </div>

      {!selectedPeriodId && <div className="card py-16 text-center text-sm text-muted">Select a period to view spendings.</div>}

      {selectedPeriodId && loading && (
        <div className="card py-16 text-center text-sm text-muted">Loading…</div>
      )}

      {!loading && selectedPeriodId && (
        <>
          {/* Summary bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            <div className="card !py-3">
              <p className="text-[11px] text-muted uppercase tracking-wider mb-1">Total Spent</p>
              <p className="text-xl font-extrabold text-primary">{fmtAmount(totalSpent, currency)}</p>
            </div>
            <div className="card !py-3">
              <p className="text-[11px] text-muted uppercase tracking-wider mb-1">Transactions</p>
              <p className="text-xl font-extrabold text-primary">{spendings.length}</p>
            </div>
            <div className="card !py-3 hidden sm:block">
              <p className="text-[11px] text-muted uppercase tracking-wider mb-1">Categories</p>
              <p className="text-xl font-extrabold text-primary">{new Set(spendings.map((s) => s.category_name)).size}</p>
            </div>
          </div>

          {spendings.length === 0 ? (
            <div className="card py-12 text-center text-sm text-muted">
              {budgets.length === 0 ? "No budgets for this period. Create budgets first." : "No spendings yet. Add your first spending above!"}
            </div>
          ) : (
            <div className="space-y-6">
              {sortedDates.map((date) => (
                <div key={date}>
                  <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 px-1">{fmt(date)}</p>
                  <div className="card !p-0 overflow-hidden">
                    {grouped[date].map((s, i) => (
                      <div
                        key={s.id}
                        className={`flex items-center gap-3 px-5 py-3.5 hover-muted transition-colors ${i < grouped[date].length - 1 ? "border-b border-subtle" : ""}`}
                      >
                        <span
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm"
                          style={{ backgroundColor: `${s.category_color ?? "#6d5aee"}22`, color: s.category_color ?? "hsl(var(--accent))" }}
                          aria-hidden="true"
                        >
                          {s.category_icon || "●"}
                        </span>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-primary truncate">{s.note || s.category_name}</p>
                          <p className="text-xs text-muted">{s.category_name}</p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-sm font-semibold text-primary tabular-nums">
                            -{fmtAmount(parseFloat(String(s.amount)), currency)}
                          </span>
                          {!selectedPeriod?.is_closed && (
                            <div className="flex gap-1">
                              <button onClick={() => openEdit(s)} aria-label="Edit" className="flex h-7 w-7 items-center justify-center rounded-lg text-muted hover:text-primary hover-muted transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                              </button>
                              <button onClick={() => handleDelete(s.id)} aria-label="Delete" className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors hover:bg-red-500/10" style={{ color: "hsl(var(--text-muted))" }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <Modal open={modal !== null} onClose={closeModal} title={modal === "edit" ? "Edit Spending" : "New Spending"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-xs rounded-lg px-3 py-2" style={{ backgroundColor: "hsl(var(--danger)/0.1)", color: "hsl(var(--danger))" }}>{error}</p>}

          {modal === "add" && (
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-muted">Category / Budget *</label>
              <select className="form-input" value={form.budget_id} onChange={(e) => setForm({ ...form, budget_id: e.target.value })} required>
                <option value="">— Select —</option>
                {budgets.map((b) => (
                  <option key={b.id} value={b.id}>{b.category_name} (limit: {fmtAmount(parseFloat(String(b.max_amount)), currency)})</option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-muted">Amount *</label>
              <input type="number" step="0.01" min="0.01" className="form-input" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="0.00" required />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-muted">Date *</label>
              <input type="date" className="form-input" value={form.spending_date} onChange={(e) => setForm({ ...form, spending_date: e.target.value })} required />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-muted">Note</label>
            <input className="form-input" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Optional description…" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={closeModal} className="button-secondary flex-1">Cancel</button>
            <button type="submit" disabled={isPending} className="button-primary flex-1">{isPending ? "Saving…" : "Save"}</button>
          </div>
        </form>
      </Modal>
    </>
  );
}
