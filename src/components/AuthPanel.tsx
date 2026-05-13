import Link from "next/link";
import Image from "next/image";

const FEATURES = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z" />
      </svg>
    ),
    title: "AI-Powered Predictions",
    description: "Know before you overspend. Our models flag risks days in advance.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    title: "Real-Time Dashboards",
    description: "Revenue, burn rate, and task progress — live, all in one place.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect width="18" height="18" x="3" y="3" rx="2" /><path d="M9 9h6M9 12h6M9 15h4" />
      </svg>
    ),
    title: "Goal & Task Tracking",
    description: "Link financial targets to daily tasks. Stay accountable, ship faster.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2a10 10 0 1 0 10 10H12V2z" /><path d="M21.18 8.02c-1-2.3-2.85-4.17-5.16-5.18" />
      </svg>
    ),
    title: "Smart Expense Intelligence",
    description: "Auto-categorize every transaction. Spot waste before it compounds.",
  },
];

const STATS = [
  { value: "4,200+", label: "Teams growing" },
  { value: "98%", label: "User satisfaction" },
  { value: "$2.4M", label: "Savings found" },
];

export default function AuthPanel() {
  return (
    <div
      className="relative flex flex-col justify-between h-full px-10 py-12 overflow-hidden"
      style={{ background: "linear-gradient(145deg, hsl(var(--bg-secondary)) 0%, hsl(222 50% 18%) 100%)" }}
    >
      {/* Background blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-24 -right-24 h-80 w-80 rounded-full opacity-20 blur-3xl"
          style={{ background: "hsl(var(--accent))" }}
        />
        <div
          className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full opacity-10 blur-3xl"
          style={{ background: "#a78bfa" }}
        />
      </div>

      <div className="relative z-10 flex flex-col gap-10 h-full">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center w-fit">
          <Image
            src="/assets/imgs/logo-finmchawfloussi.png"
            alt="GrowthOS"
            width={160}
            height={32}
            className="h-8 w-auto"
            priority
          />
        </Link>

        {/* Headline */}
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-primary leading-snug mb-3 xl:text-3xl">
            The growth partner
            <br />
            <span className="gradient-text">your business deserves.</span>
          </h2>
          <p className="text-sm leading-relaxed text-muted max-w-sm">
            Join thousands of founders who replaced five tools with one
            intelligent platform.
          </p>
        </div>

        {/* Features list */}
        <ul className="flex flex-col gap-5 list-none m-0 p-0" aria-label="Platform features">
          {FEATURES.map((f) => (
            <li key={f.title} className="flex items-start gap-4">
              <span
                className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: "hsl(var(--accent) / 0.12)", color: "hsl(var(--accent))" }}
                aria-hidden="true"
              >
                {f.icon}
              </span>
              <div>
                <p className="text-sm font-semibold text-primary mb-0.5">{f.title}</p>
                <p className="text-xs leading-relaxed text-muted">{f.description}</p>
              </div>
            </li>
          ))}
        </ul>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-auto">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-subtle px-3 py-4 text-center"
              style={{ backgroundColor: "hsl(var(--bg-card) / 0.5)" }}
            >
              <p className="text-lg font-extrabold text-primary leading-none mb-1">{s.value}</p>
              <p className="text-[11px] text-muted">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Testimonial */}
        <figure
          className="glass-card !p-5 mt-2"
          style={{ borderColor: "hsl(var(--accent) / 0.2)" }}
        >
          <blockquote className="text-sm leading-relaxed text-muted mb-3">
            &ldquo;GrowthOS cut our monthly review meetings in half. The AI catches
            spending anomalies before I even open the app.&rdquo;
          </blockquote>
          <figcaption className="flex items-center gap-3">
            <div
              className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: "linear-gradient(135deg, hsl(var(--accent)), #a78bfa)" }}
              aria-hidden="true"
            >
              SK
            </div>
            <div>
              <p className="text-xs font-semibold text-primary">Sarah K.</p>
              <p className="text-[11px] text-muted">Founder, Stackwise</p>
            </div>
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
