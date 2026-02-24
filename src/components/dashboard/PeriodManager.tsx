"use client";

import { useState, useTransition } from "react";
import Modal from "@/components/ui/Modal";
import { createPeriod, updatePeriod, closePeriod, deletePeriod } from "@/actions/periods";
import type { TrackingPeriod } from "@/lib/types";

interface Props { initialPeriods: TrackingPeriod[] }

type PeriodType = "MONTHLY" | "WEEKLY" | "CUSTOM";
const emptyForm: { name: string; type: PeriodType; start_date: string; end_date: string } = { name: "", type: "MONTHLY", start_date: "", end_date: "" };

function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const TYPE_LABELS = { MONTHLY: "Monthly", WEEKLY: "Weekly", CUSTOM: "Custom" };

export default function PeriodManager({ initialPeriods }: Props) {
  const [periods, setPeriods] = useState(initialPeriods);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<TrackingPeriod | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function openAdd() { setForm(emptyForm); setEditing(null); setError(""); setModal("add"); }
  function openEdit(p: TrackingPeriod) {
    setForm({ name: p.name, type: p.type, start_date: p.start_date.toString().slice(0, 10), end_date: p.end_date.toString().slice(0, 10) });
    setEditing(p); setError(""); setModal("edit");
  }
  function closeModal() { setModal(null); setEditing(null); setError(""); }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError("");
    startTransition(async () => {
      const res = modal === "edit" && editing
        ? await updatePeriod(editing.id, form)
        : await createPeriod(form);
      if (!res.success) { setError(res.error); return; }
      if (modal === "edit" && editing) {
        setPeriods((prev) => prev.map((p) => p.id === editing.id ? res.data : p));
      } else {
        setPeriods((prev) => [res.data, ...prev]);
      }
      closeModal();
    });
  }

  function handleClose(p: TrackingPeriod) {
    if (!confirm(`Close period "${p.name}"? This cannot be undone.`)) return;
    startTransition(async () => {
      const res = await closePeriod(p.id);
      if (res.success) setPeriods((prev) => prev.map((x) => x.id === p.id ? res.data : x));
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this period and all its budgets and spendings?")) return;
    startTransition(async () => {
      const res = await deletePeriod(id);
      if (!res.success) { alert(res.error); return; }
      setPeriods((prev) => prev.filter((p) => p.id !== id));
    });
  }

  const open = periods.filter((p) => !p.is_closed);
  const closed = periods.filter((p) => p.is_closed);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted">{open.length} open · {closed.length} closed</p>
        <button onClick={openAdd} className="button-primary text-sm px-4 py-2">+ New Period</button>
      </div>

      <div className="space-y-3">
        {periods.length === 0 && (
          <div className="card py-12 text-center text-sm text-muted">No tracking periods yet.</div>
        )}
        {periods.map((p) => (
          <div key={p.id} className="card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-start gap-4">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold"
                style={{ backgroundColor: "hsl(var(--accent)/0.12)", color: "hsl(var(--accent))" }}
              >
                {p.type.slice(0, 1)}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-primary text-sm">{p.name}</span>
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: p.is_closed ? "hsl(var(--border))" : "hsl(var(--accent)/0.1)",
                      color: p.is_closed ? "hsl(var(--text-muted))" : "hsl(var(--accent))",
                    }}
                  >
                    {p.is_closed ? "Closed" : TYPE_LABELS[p.type]}
                  </span>
                </div>
                <p className="text-xs text-muted mt-0.5">{fmt(p.start_date)} → {fmt(p.end_date)}</p>
              </div>
            </div>

            {!p.is_closed && (
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => openEdit(p)} className="text-xs text-muted hover:text-primary px-3 py-1.5 rounded-lg border border-subtle hover:bg-white/5 transition-colors">Edit</button>
                <button onClick={() => handleClose(p)} className="text-xs text-muted hover:text-primary px-3 py-1.5 rounded-lg border border-subtle hover:bg-white/5 transition-colors">Close</button>
                <button onClick={() => handleDelete(p.id)} className="text-xs px-3 py-1.5 rounded-lg border border-subtle transition-colors hover:bg-red-500/5" style={{ color: "hsl(var(--text-muted))" }}>Delete</button>
              </div>
            )}
            {p.is_closed && (
              <button onClick={() => handleDelete(p.id)} className="text-xs px-3 py-1.5 rounded-lg border border-subtle transition-colors hover:bg-red-500/5 shrink-0" style={{ color: "hsl(var(--text-muted))" }}>Delete</button>
            )}
          </div>
        ))}
      </div>

      <Modal open={modal !== null} onClose={closeModal} title={modal === "edit" ? "Edit Period" : "New Tracking Period"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-xs rounded-lg px-3 py-2" style={{ backgroundColor: "hsl(var(--danger)/0.1)", color: "hsl(var(--danger))" }}>{error}</p>}

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-muted">Name *</label>
            <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. March 2026" required />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-muted">Type *</label>
            <select className="form-input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as typeof form.type })}>
              <option value="MONTHLY">Monthly</option>
              <option value="WEEKLY">Weekly</option>
              <option value="CUSTOM">Custom</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-muted">Start Date *</label>
              <input type="date" className="form-input" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} required />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-muted">End Date *</label>
              <input type="date" className="form-input" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} required />
            </div>
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
