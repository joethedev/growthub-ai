"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  toggleArchiveCategory,
} from "@/actions/categories";
import type { Category } from "@/lib/types";

interface Props { initialCategories: Category[] }

const COLORS = ["#6d5aee", "#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#ec4899", "#8b5cf6", "#14b8a6"];

const ICONS = [
  "🍔","🛒","🏠","🚗","💊","🎮","👗","✈️",
  "📚","💪","🎬","🍕","☕","💡","🐾","🎵",
  "💰","🎁","🏥","📱","🔧","🌿",
];

const emptyForm = { name: "", description: "", icon: "", color: COLORS[0] };

export default function CategoryManager({ initialCategories }: Props) {
  const [categories, setCategories] = useState(initialCategories);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const iconPickerRef = useRef<HTMLDivElement>(null);

  // Close picker on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (iconPickerRef.current && !iconPickerRef.current.contains(e.target as Node)) {
        setIconPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function closeModal() { setModal(null); setEditing(null); setError(""); setIconPickerOpen(false); }

  function openAdd() { setForm(emptyForm); setEditing(null); setError(""); setIconPickerOpen(false); setModal("add"); }
  function openEdit(c: Category) {
    setForm({ name: c.name, description: c.description ?? "", icon: c.icon ?? "", color: c.color ?? COLORS[0] });
    setEditing(c); setError(""); setIconPickerOpen(false); setModal("edit");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const input = { name: form.name, description: form.description || undefined, icon: form.icon || undefined, color: form.color || undefined };
      const res = modal === "edit" && editing
        ? await updateCategory(editing.id, input)
        : await createCategory(input);

      if (!res.success) { setError(res.error); return; }

      if (modal === "edit" && editing) {
        setCategories((prev) => prev.map((c) => c.id === editing.id ? res.data : c));
      } else {
        setCategories((prev) => [...prev, res.data]);
      }
      closeModal();
    });
  }

  function handleArchive(c: Category) {
    startTransition(async () => {
      const res = await toggleArchiveCategory(c.id);
      if (res.success) setCategories((prev) => prev.map((x) => x.id === c.id ? res.data : x));
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this category? This cannot be undone.")) return;
    startTransition(async () => {
      const res = await deleteCategory(id);
      if (!res.success) { alert(res.error); return; }
      setCategories((prev) => prev.filter((c) => c.id !== id));
    });
  }

  const visible = categories.filter((c) => !c.is_archived);
  const archived = categories.filter((c) => c.is_archived);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-muted">{visible.length} active · {archived.length} archived</p>
        </div>
        <button onClick={openAdd} className="button-primary text-sm px-4 py-2">
          + Add Category
        </button>
      </div>

      {/* Active */}
      <div className="card !p-0 overflow-hidden">
        {visible.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted">No categories yet. Add one to get started.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-subtle">
                <th className="text-left px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider">Category</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider hidden sm:table-cell">Description</th>
                <th className="px-5 py-3 text-right text-xs font-medium text-muted uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((c) => (
                <tr key={c.id} className="border-b border-subtle last:border-0 hover-muted transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <span
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-sm shrink-0"
                        style={{ backgroundColor: `${c.color ?? "#6d5aee"}22`, color: c.color ?? "#6d5aee" }}
                      >
                        {c.icon || "●"}
                      </span>
                      <span className="font-medium text-primary">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-muted hidden sm:table-cell">{c.description ?? "—"}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(c)} className="text-xs text-muted hover:text-primary px-2 py-1 rounded-lg hover-muted transition-colors">Edit</button>
                      <button onClick={() => handleArchive(c)} className="text-xs text-muted hover:text-primary px-2 py-1 rounded-lg hover-muted transition-colors">Archive</button>
                      <button onClick={() => handleDelete(c.id)} className="text-xs hover:text-danger px-2 py-1 rounded-lg hover:bg-red-500/5 transition-colors" style={{ color: "hsl(var(--text-muted))" }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Archived */}
      {archived.length > 0 && (
        <details className="mt-4">
          <summary className="cursor-pointer text-xs text-muted hover:text-primary transition-colors py-2">
            {archived.length} archived {archived.length === 1 ? "category" : "categories"}
          </summary>
          <div className="mt-2 card !p-0 overflow-hidden opacity-60">
            <table className="w-full text-sm">
              <tbody>
                {archived.map((c) => (
                  <tr key={c.id} className="border-b border-subtle last:border-0">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg text-xs" style={{ backgroundColor: `${c.color ?? "#6d5aee"}22`, color: c.color ?? "#6d5aee" }}>
                          {c.icon || "●"}
                        </span>
                        <span className="text-muted line-through">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button onClick={() => handleArchive(c)} className="text-xs text-accent hover:opacity-80 transition-opacity">Restore</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}

      {/* Modal */}
      <Modal open={modal !== null} onClose={closeModal} title={modal === "edit" ? "Edit Category" : "New Category"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-xs rounded-lg px-3 py-2" style={{ backgroundColor: "hsl(var(--danger)/0.1)", color: "hsl(var(--danger))" }}>{error}</p>}

          <Field label="Name *">
            <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Food & Dining" required />
          </Field>

          <Field label="Description">
            <input className="form-input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Optional description" />
          </Field>

          <Field label="Icon">
            <div ref={iconPickerRef} className="relative">
              {/* Trigger */}
              <button
                type="button"
                onClick={() => setIconPickerOpen((o) => !o)}
                className="form-input flex items-center gap-2 cursor-pointer text-left"
                aria-haspopup="true"
                aria-expanded={iconPickerOpen}
              >
                <span className="text-base leading-none">{form.icon || "＋"}</span>
                <span className="text-muted text-xs">{form.icon ? "Change icon" : "Pick an icon"}</span>
                <svg className="ml-auto shrink-0" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
              </button>

              {/* Picker grid */}
              {iconPickerOpen && (
                <div
                  className="absolute z-50 mt-1 w-full rounded-xl border border-subtle p-2 shadow-xl"
                  style={{ backgroundColor: "hsl(var(--bg-card))" }}
                  role="listbox"
                  aria-label="Choose an icon"
                >
                  <div className="grid grid-cols-6 gap-1 mb-2">
                    {ICONS.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        role="option"
                        aria-selected={form.icon === icon}
                        onClick={() => { setForm((f) => ({ ...f, icon })); setIconPickerOpen(false); }}
                        className="flex h-9 w-full items-center justify-center rounded-lg text-lg transition-colors hover-muted-strong"
                        style={form.icon === icon ? { backgroundColor: `${form.color}22`, outline: `2px solid ${form.color}` } : {}}
                        title={icon}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                  {/* Clear button */}
                  {form.icon && (
                    <button
                      type="button"
                      onClick={() => { setForm((f) => ({ ...f, icon: "" })); setIconPickerOpen(false); }}
                      className="w-full text-center text-xs text-muted hover:text-primary py-1 rounded-lg hover-muted transition-colors"
                    >
                      Clear icon
                    </button>
                  )}
                </div>
              )}
            </div>
          </Field>

          <Field label="Color">
            <div className="flex flex-wrap gap-2 mt-1">
              {COLORS.map((col) => (
                <button key={col} type="button" onClick={() => setForm({ ...form, color: col })}
                  className="h-7 w-7 rounded-full border-2 transition-transform hover:scale-110"
                  style={{ backgroundColor: col, borderColor: form.color === col ? "white" : "transparent" }}
                  aria-label={col}
                />
              ))}
            </div>
          </Field>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={closeModal} className="button-secondary flex-1">Cancel</button>
            <button type="submit" disabled={isPending} className="button-primary flex-1">{isPending ? "Saving…" : "Save"}</button>
          </div>
        </form>
      </Modal>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-muted">{label}</label>
      {children}
    </div>
  );
}
