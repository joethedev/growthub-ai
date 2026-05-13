const AI_INSIGHTS = [
  {
    emoji: "🎙️",
    category: "Voice Note",
    message: '"Srift 120 dh f restaurant"',
    detail: "Logged as Food expense · 120 dh · This week",
    type: "warning",
  },
  {
    emoji: "🧾",
    category: "Voice Note",
    message: '"Khlsst lkra 2500"',
    detail: "Logged as Rent expense · 2,500 dh · This month",
    type: "insight",
  },
  {
    emoji: "🛒",
    category: "Voice Note",
    message: '"Chrit l7lib w khodra b 85 dh"',
    detail: "Logged as Groceries expense · 85 dh · Today",
    type: "savings",
  },
];

export default function AISection() {
  return (
    <section
      aria-labelledby="ai-heading"
      className="section relative overflow-hidden"
    >
      {/* Background accent blob */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div
          className="h-96 w-96 rounded-full opacity-[0.07] blur-3xl"
          style={{ background: "hsl(var(--accent))" }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-start gap-16 lg:flex-row lg:items-center">

          {/* ── Left: text ── */}
          <div className="flex-1 max-w-lg">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent">
              Voice Tracking
            </p>
            <h2
              id="ai-heading"
              className="mb-5 text-3xl font-extrabold tracking-tight text-primary sm:text-4xl"
            >
              The fastest way to log
              <br />
              your spendings
            </h2>
            <p className="mb-8 text-base leading-relaxed text-muted">
              Just send a voice note in Moroccan Darija. FinMchawFloussi automatically
              turns your voice into organized expenses so you can focus on better decisions.
            </p>
            <ul className="space-y-3 text-sm text-muted">
              {[
                "No typing",
                "No friction",
                "No excuses",
                "Track naturally in the language you use every day",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 h-5 w-5 shrink-0 rounded-full flex items-center justify-center text-[10px]"
                    style={{ backgroundColor: "hsl(var(--accent) / 0.12)", color: "hsl(var(--accent))" }}
                  >
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* ── Right: AI insight cards ── */}
          <div className="flex-1 w-full space-y-4" aria-label="Sample AI insights">
            {AI_INSIGHTS.map((insight) => (
              <InsightCard key={insight.category} insight={insight} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Individual insight card ─────────────────────────────── */
type InsightProps = {
  insight: (typeof AI_INSIGHTS)[number];
};

function InsightCard({ insight }: InsightProps) {
  const isWarning = insight.type === "warning";

  return (
    <div
      className="glass-card p-4 flex items-start gap-4 transition-transform duration-200 hover:-translate-y-0.5"
      style={{
        borderColor: isWarning
          ? "hsl(var(--danger) / 0.3)"
          : "hsl(var(--accent) / 0.2)",
        backgroundColor: isWarning
          ? "hsl(var(--danger) / 0.05)"
          : "hsl(var(--bg-card) / 0.6)",
      }}
      role="article"
      aria-label={`AI insight: ${insight.message}`}
    >
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg"
        style={{
          backgroundColor: isWarning
            ? "hsl(var(--danger) / 0.12)"
            : "hsl(var(--accent) / 0.1)",
        }}
        aria-hidden="true"
      >
        {insight.emoji}
      </span>

      <div className="flex-1 min-w-0">
        <div className="mb-0.5 flex items-center gap-2">
          <span
            className="text-[11px] font-semibold uppercase tracking-wider"
            style={{ color: isWarning ? "hsl(var(--danger))" : "hsl(var(--accent))" }}
          >
            {insight.category}
          </span>
        </div>
        <p className="text-sm font-medium text-primary mb-1">{insight.message}</p>
        <p className="text-xs text-muted">{insight.detail}</p>
      </div>

      <div
        className="h-2 w-2 shrink-0 rounded-full mt-1 animate-pulse"
        style={{ backgroundColor: isWarning ? "hsl(var(--danger))" : "hsl(var(--accent))" }}
        aria-hidden="true"
      />
    </div>
  );
}
