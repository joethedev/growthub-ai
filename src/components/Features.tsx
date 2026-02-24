const FEATURES = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2a10 10 0 1 0 10 10H12V2z" /><path d="M21.18 8.02c-1-2.3-2.85-4.17-5.16-5.18" />
      </svg>
    ),
    title: "Expense Intelligence",
    description: "Automatic categorization and trend analysis across all your accounts in one unified view.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z" />
      </svg>
    ),
    title: "AI Predictions",
    description: "Predict overspending risks before they occur with machine-learning models trained on your habits.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect width="18" height="18" x="3" y="3" rx="2" /><path d="M9 9h6M9 12h6M9 15h4" />
      </svg>
    ),
    title: "Task & Goal Tracking",
    description: "Link your financial goals to concrete tasks. Stay accountable with progress tracking and milestone alerts.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    title: "Real-Time Dashboards",
    description: "Live metrics for revenue, burn rate, and productivity — updated every minute, no refresh needed.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" x2="6" y1="1" y2="4" /><line x1="10" x2="10" y1="1" y2="4" /><line x1="14" x2="14" y1="1" y2="4" />
      </svg>
    ),
    title: "Smart Budgets",
    description: "Set flexible budgets per category. GrowthOS auto-adjusts recommendations based on seasons and income shifts.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Team Collaboration",
    description: "Invite your team, set roles, and share dashboards. Everyone aligned, no meetings needed.",
  },
];

export default function Features() {
  return (
    <section id="features" aria-labelledby="features-heading" className="section">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent">
            Features
          </p>
          <h2
            id="features-heading"
            className="mb-4 text-3xl font-extrabold tracking-tight text-primary sm:text-4xl"
          >
            Everything you need to grow
          </h2>
          <p className="text-base leading-relaxed text-muted">
            From tracking every dollar to predicting your next big win — GrowthOS gives you
            the intelligence layer your business has been missing.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <article key={feature.title} className="card group flex flex-col gap-4">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl transition-colors duration-200"
                style={{
                  backgroundColor: "hsl(var(--accent) / 0.1)",
                  color: "hsl(var(--accent))",
                }}
                aria-hidden="true"
              >
                {feature.icon}
              </div>
              <div>
                <h3 className="mb-2 text-base font-semibold text-primary">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{feature.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
