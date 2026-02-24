"use client";

import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/transactions": "Transactions",
  "/dashboard/budgets": "Budgets",
  "/dashboard/goals": "Goals",
  "/dashboard/settings": "Settings",
};

export default function TopBar() {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? "Dashboard";

  return (
    <header
      className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-subtle px-6"
      style={{ backgroundColor: "hsl(var(--bg-primary) / 0.9)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
    >
      <h1 className="text-base font-semibold text-primary">{title}</h1>

      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <button
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-subtle text-muted hover:text-primary hover:bg-white/5 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
          </svg>
          {/* Unread dot */}
          <span
            className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full"
            style={{ backgroundColor: "hsl(var(--accent))" }}
            aria-hidden="true"
          />
        </button>

        {/* Mobile user button */}
        <div className="lg:hidden">
          <UserButton appearance={{ elements: { avatarBox: "h-8 w-8" } }} />
        </div>
      </div>
    </header>
  );
}
