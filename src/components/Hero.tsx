import Link from "next/link";

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="section relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32"
    >
      {/* Background gradient blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-24 left-1/2 h-120 w-120 -translate-x-1/2 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, hsl(var(--accent)) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 right-0 h-64 w-64 opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #a78bfa 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center gap-16 lg:flex-row lg:items-center lg:gap-12">

          {/* ── Text side ── */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left lg:flex-1">
            <div
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-subtle px-4 py-1.5 text-xs font-medium text-muted"
              style={{ backgroundColor: "hsl(var(--bg-card))" }}
            >
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: "hsl(var(--accent))" }}
              />
              Built for Morocco · Darija Voice Input
            </div>

            <h1
              id="hero-heading"
              className="mb-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-primary sm:text-5xl lg:text-6xl"
            >
              Take Control of Your Money
              <br />
              <span className="gradient-text">In Darija</span>
            </h1>

            <p className="mb-10 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
              Finally, a budgeting app made for real life in Morocco. No complicated
              spreadsheets. No confusing finance terms. Just speak naturally, track
              your spending, and understand where your money goes.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link href="#" className="button-primary w-full sm:w-auto px-7 py-3 text-base">
                Create Your Account
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href="#features" className="button-secondary w-full sm:w-auto px-7 py-3 text-base">
                Start Tracking in Minutes
              </Link>
            </div>

            {/* Social proof */}
            <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 text-sm text-muted">
              <div className="flex -space-x-2" aria-hidden="true">
                {["#7c6af7", "#a78bfa", "#60a5fa", "#34d399"].map((color, i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full border-2 border-bg-primary"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <span>
                <strong className="text-primary font-semibold">Simple. Fast.</strong> Built for everyday life in Morocco
              </span>
            </div>
          </div>

          {/* ── App mockup side ── */}
          <div className="w-full max-w-sm lg:flex-1 lg:max-w-none" aria-hidden="true">
            <AppMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Inline mockup component ─────────────────────────────── */
function AppMockup() {
  return (
    <div
      className="relative rounded-2xl border border-subtle p-1"
      style={{
        background: "linear-gradient(145deg, hsl(var(--bg-card)), hsl(var(--bg-secondary)))",
        boxShadow: "0 32px 80px -16px hsl(var(--accent) / 0.2), 0 0 0 1px hsl(var(--border))",
      }}
    >
      {/* Window chrome */}
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-subtle">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
        <span className="ml-3 h-4 flex-1 rounded bg-white/5 max-w-35" />
      </div>

      <div className="p-5 space-y-4">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Spent", value: "4,280 dh", change: "+9%" },
            { label: "Remaining", value: "1,720 dh", change: "This month" },
            { label: "Income Est.", value: "7,500 dh", change: "Updated" },
          ].map((stat) => (
            <div key={stat.label} className="card p-3! space-y-1.5">
              <span className="block text-[10px] text-muted uppercase tracking-wider">{stat.label}</span>
              <span className="block text-sm font-bold text-primary">{stat.value}</span>
              <span className="block text-[10px] font-medium" style={{ color: "hsl(var(--success))" }}>
                {stat.change}
              </span>
            </div>
          ))}
        </div>

        {/* Chart bar placeholder */}
        <div className="card p-4!">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-medium text-muted">Spending Trends</span>
            <span className="text-xs text-accent font-semibold">Week View</span>
          </div>
          <div className="flex items-end gap-1.5 h-20">
            {[40, 65, 50, 80, 55, 90, 70].map((h, i) => (
              <div key={i} className="flex-1 rounded-t" style={{
                height: `${h}%`,
                background: i === 5
                  ? "hsl(var(--accent))"
                  : "hsl(var(--border))",
                opacity: i === 5 ? 1 : 0.6,
              }} />
            ))}
          </div>
        </div>

        {/* AI insight pill */}
        <div
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-xs border"
          style={{
            borderColor: "hsl(var(--accent) / 0.3)",
            backgroundColor: "hsl(var(--accent) / 0.06)",
          }}
        >
          <span className="text-base" aria-hidden="true">✦</span>
          <span className="text-muted">
            <strong className="text-primary">AI insight:</strong>{" "}
            You are close to your Food budget limit this week.
          </span>
        </div>
      </div>
    </div>
  );
}
