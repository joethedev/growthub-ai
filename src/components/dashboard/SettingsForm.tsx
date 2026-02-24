"use client";

import { useState, useTransition } from "react";
import { updateCurrency } from "@/actions/settings";
import { CURRENCIES } from "@/lib/currencies";

interface Props {
  currentCurrency: string;
}

export default function SettingsForm({ currentCurrency }: Props) {
  const [selected, setSelected] = useState<string>(currentCurrency ?? "USD");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaved(false);
    startTransition(async () => {
      const res = await updateCurrency(selected);
      if (!res.success) { setError(res.error); return; }
      setSaved(true);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-sm">
      {error && (
        <p className="text-xs rounded-lg px-3 py-2" style={{ backgroundColor: "hsl(var(--danger)/0.1)", color: "hsl(var(--danger))" }}>
          {error}
        </p>
      )}

      <div className="space-y-3">
        {CURRENCIES.map((c) => {
          const active = selected === c.code;
          return (
            <label
              key={c.code}
              className={`flex items-center gap-4 rounded-xl border px-4 py-3 cursor-pointer transition-all ${
                active ? "border-accent bg-accent/5" : "border-subtle hover:border-white/20"
              }`}
              style={active ? { borderColor: "hsl(var(--accent))", backgroundColor: "hsl(var(--accent)/0.07)" } : {}}
            >
              <input
                type="radio"
                name="currency"
                value={c.code}
                checked={active}
                onChange={() => { setSelected(c.code); setSaved(false); }}
                className="sr-only"
              />
              {/* Symbol badge */}
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold"
                style={
                  active
                    ? { backgroundColor: "hsl(var(--accent)/0.15)", color: "hsl(var(--accent))" }
                    : { backgroundColor: "hsl(var(--bg-primary))", color: "hsl(var(--text-muted))" }
                }
              >
                {c.symbol}
              </span>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-primary">{c.label}</p>
                <p className="text-xs text-muted">{c.code}</p>
              </div>

              {/* Selected indicator */}
              {active && (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--accent))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 6 9 17l-5-5"/>
                </svg>
              )}
            </label>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending || selected === currentCurrency}
          className="button-primary px-6 py-2 text-sm disabled:opacity-40"
        >
          {isPending ? "Saving…" : "Save preference"}
        </button>

        {saved && (
          <span className="flex items-center gap-1.5 text-xs" style={{ color: "hsl(var(--success))" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 6 9 17l-5-5"/>
            </svg>
            Saved
          </span>
        )}
      </div>
    </form>
  );
}
