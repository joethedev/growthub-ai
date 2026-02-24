import Link from "next/link";

export default function CTA() {
  return (
    <section aria-labelledby="cta-heading" className="section px-6">
      <div className="mx-auto max-w-6xl">
        <div
          className="relative overflow-hidden rounded-3xl border border-subtle p-12 text-center md:p-20"
          style={{
            background: "linear-gradient(135deg, hsl(var(--bg-secondary)) 0%, hsl(222 50% 18%) 100%)",
          }}
        >
          {/* Glow blobs */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div
              className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full opacity-25 blur-3xl"
              style={{ background: "hsl(var(--accent))" }}
            />
            <div
              className="absolute -top-16 -right-16 h-64 w-64 rounded-full opacity-15 blur-3xl"
              style={{ background: "#a78bfa" }}
            />
          </div>

          <div className="relative">
            {/* Eyebrow */}
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-accent">
              Get Started Free
            </p>

            {/* Heading */}
            <h2
              id="cta-heading"
              className="mb-5 text-3xl font-extrabold tracking-tight text-primary sm:text-4xl lg:text-5xl"
            >
              Stop guessing.
              <br />
              <span className="gradient-text">Start growing.</span>
            </h2>

            {/* Sub */}
            <p className="mx-auto mb-10 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              Join thousands of founders and teams using GrowthOS to track every dollar,
              hit every goal, and make smarter decisions — starting today.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="#"
                className="button-primary px-9 py-3.5 text-base"
                style={{ boxShadow: "0 0 32px 4px hsl(var(--accent) / 0.35)" }}
              >
                Start for Free
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href="#" className="button-secondary px-9 py-3.5 text-base">
                Book a Demo
              </Link>
            </div>

            {/* Trust line */}
            <p className="mt-8 text-xs text-muted">
              No credit card required · Free up to 3 users · Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
