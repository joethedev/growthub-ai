"use client";

import { useState, useTransition } from "react";
import Modal from "@/components/ui/Modal";
import {
  createIncome,
  updateIncome,
  toggleIncomeActive,
  deleteIncome,
} from "@/actions/incomes";
import { fmtAmount } from "@/lib/format-currency";
import { INCOME_TYPES, INCOME_FREQUENCIES } from "@/lib/income-types";
import type { Income } from "@/lib/types";

interface Props {
  initialIncomes: Income[];
  currency: string;
}

const emptyForm = {
  name: "",
  type: "salary",
  amount: "",
  frequency: "monthly",
  received_at: "",
  notes: "",
  is_active: true,
};

type FormState = typeof emptyForm;

export default function IncomeManager({ initialIncomes, currency }: Props) {
  const [incomes, setIncomes] = useState<Income[]>(initialIncomes);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Income | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function openAdd() {
    setForm({ ...emptyForm });
    setEditing(null);
    setError("");
    setModal("add");
  }

  function openEdit(inc: Income) {
    setForm({
      name: inc.name,
      type: inc.type,
      amount: String(inc.amount),
      frequency: inc.frequency,
      received_at: inc.received_at ?? "",
      notes: inc.notes ?? "",
      is_active: inc.is_active,
    });
    setEditing(inc);
    setError("");
    setModal("edit");
  }

  function closeModal() {
    setModal(null);
    setEditing(null);
    setError("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const payload = {
        name: form.name,
        type: form.type,
        amount: Number(form.amount),
        frequency: form.frequency,
        received_at: form.frequency === "once" ? form.received_at || undefined : undefined,
        notes: form.notes || undefined,
        is_active: form.is_active,
      };

      if (modal === "edit" && editing) {
        const res = await updateIncome(editing.id, payload);
        if (!res.success) { setError(res.error); return; }
        setIncomes((prev) =>
          prev.map((i) => (i.id === editing.id ? res.data : i))
        );
      } else {
        const res = await createIncome(payload);
        if (!res.success) { setError(res.error); return; }
        setIncomes((prev) => [res.data, ...prev]);
      }
      closeModal();
    });
  }

  function handleToggle(inc: Income) {
    startTransition(async () => {
      const res = await toggleIncomeActive(inc.id, !inc.is_active);
      if (!res.success) { alert(res.error); return; }
      setIncomes((prev) =>
        prev.map((i) => (i.id === inc.id ? res.data : i))
      );
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this income stream?")) return;
    startTransition(async () => {
      const res = await deleteIncome(id);
      if (!res.success) { alert(res.error); return; }
      setIncomes((prev) => prev.filter((i) => i.id !== id));
    });
  }

  // ─── Derived stats ──────────────────────────────────────────────────────────

  /** Convert any income to a monthly-equivalent amount for summary purposes */
  function toMonthly(inc: Income): number {
    const amt = parseFloat(String(inc.amount));
    if (!inc.is_active || isNaN(amt)) return 0;
    switch (inc.frequency) {
      case "once":       return 0;
      case "weekly":     return (amt * 52) / 12;
      case "bi_weekly":  return (amt * 26) / 12;
      case "monthly":    return amt;
      case "quarterly":  return amt / 3;
      case "yearly":     return amt / 12;
      default:           return 0;
    }
  }

  const monthlyTotal = incomes.reduce((sum, i) => sum + toMonthly(i), 0);
  const oneTimeTotal  = incomes
    .filter((i) => i.frequency === "once" && i.is_active)
    .reduce((sum, i) => sum + parseFloat(String(i.amount)), 0);

  function getTypeEntry(value: string) {
    return INCOME_TYPES.find((t) => t.value === value) ?? { icon: "📥", label: value };
  }

  function getFreqLabel(value: string) {
    return INCOME_FREQUENCIES.find((f) => f.value === value)?.label ?? value;
  }

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div
          className="rounded-xl border border-subtle px-5 py-4"
          style={{ backgroundColor: "hsl(var(--bg-secondary))" }}
        >
          <p className="text-xs text-muted mb-1">Est. Monthly Income</p>
          <p className="text-2xl font-bold text-primary">{fmtAmount(monthlyTotal, currency)}</p>
          <p className="text-xs text-muted mt-1">from recurring streams</p>
        </div>
        <div
          className="rounded-xl border border-subtle px-5 py-4"
          style={{ backgroundColor: "hsl(var(--bg-secondary))" }}
        >
          <p className="text-xs text-muted mb-1">One-time Income</p>
          <p className="text-2xl font-bold text-primary">{fmtAmount(oneTimeTotal, currency)}</p>
          <p className="text-xs text-muted mt-1">{incomes.filter((i) => i.frequency === "once").length} entries</p>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-primary">
          All streams <span className="text-muted font-normal">({incomes.length})</span>
        </h2>
        <button onClick={openAdd} className="button-primary text-sm px-4 py-2">
          + Add Income
        </button>
      </div>

      {/* List */}
      {incomes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-subtle py-16 text-center">
          <p className="text-muted text-sm">No income streams yet.</p>
          <button onClick={openAdd} className="mt-3 button-primary text-sm px-5 py-2">
            Add your first income
          </button>
        </div>
      ) : (
        <ul className="space-y-2">
          {incomes.map((inc) => {
            const typeEntry = getTypeEntry(inc.type);
            const freqLabel = getFreqLabel(inc.frequency);
            const monthly = toMonthly(inc);
            return (
              <li
                key={inc.id}
                className="flex items-center gap-4 rounded-xl border border-subtle px-4 py-3 transition-opacity"
                style={{
                  backgroundColor: "hsl(var(--bg-secondary))",
                  opacity: inc.is_active ? 1 : 0.5,
                }}
              >
                {/* Icon */}
                <span className="text-2xl select-none w-8 text-center shrink-0">
                  {typeEntry.icon}
                </span>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-primary truncate">{inc.name}</p>
                    {!inc.is_active && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-muted">
                        inactive
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted mt-0.5">
                    {typeEntry.label} · {freqLabel}
                    {inc.frequency === "once" && inc.received_at
                      ? ` · ${new Date(inc.received_at).toLocaleDateString()}`
                      : ""}
                  </p>
                </div>

                {/* Amount */}
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-primary">
                    {fmtAmount(inc.amount, currency)}
                  </p>
                  {monthly > 0 && (
                    <p className="text-[10px] text-muted">
                      ≈ {fmtAmount(monthly, currency)}/mo
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleToggle(inc)}
                    disabled={isPending}
                    title={inc.is_active ? "Deactivate" : "Activate"}
                    className="h-7 w-7 flex items-center justify-center rounded-lg text-muted hover:text-primary hover:bg-white/5 transition-colors"
                  >
                    {inc.is_active ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-.18-6.55"/></svg>
                    )}
                  </button>
                  <button
                    onClick={() => openEdit(inc)}
                    className="h-7 w-7 flex items-center justify-center rounded-lg text-muted hover:text-primary hover:bg-white/5 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button
                    onClick={() => handleDelete(inc.id)}
                    disabled={isPending}
                    className="h-7 w-7 flex items-center justify-center rounded-lg text-muted hover:text-red-400 hover:bg-red-400/10 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Add / Edit Modal */}
      <Modal
        open={modal !== null}
        onClose={closeModal}
        title={modal === "edit" ? "Edit Income" : "Add Income Stream"}
      >
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-muted mb-1">Name</label>
            <input
              className="form-input"
              placeholder="e.g. Main salary, Upwork contract…"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          {/* Type + Frequency */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Type</label>
              <select
                className="form-input"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                {INCOME_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.icon} {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Frequency</label>
              <select
                className="form-input"
                value={form.frequency}
                onChange={(e) => setForm({ ...form, frequency: e.target.value })}
              >
                {INCOME_FREQUENCIES.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-medium text-muted mb-1">Amount</label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              className="form-input"
              placeholder="0.00"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              required
            />
          </div>

          {/* Received at — shown only for one-time */}
          {form.frequency === "once" && (
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Received on</label>
              <input
                type="date"
                className="form-input"
                value={form.received_at}
                onChange={(e) => setForm({ ...form, received_at: e.target.value })}
              />
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-muted mb-1">Notes (optional)</label>
            <textarea
              rows={2}
              className="form-input resize-none"
              placeholder="Any additional info…"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>

          {/* Active toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm text-secondary">Active stream</span>
          </label>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={closeModal} className="button-secondary text-sm px-4 py-2">
              Cancel
            </button>
            <button type="submit" disabled={isPending} className="button-primary text-sm px-5 py-2">
              {isPending ? "Saving…" : modal === "edit" ? "Save changes" : "Add income"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
