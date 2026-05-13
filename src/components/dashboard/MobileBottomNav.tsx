"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: "Category",
    href: "/dashboard/categories",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <path d="M9 12h6M9 16h4" />
      </svg>
    ),
  },
  {
    label: "Spending",
    href: "/dashboard/spendings",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 6h18M7 12h10M11 18h4" />
      </svg>
    ),
  },
  {
    label: "Budget",
    href: "/dashboard/budgets",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 flex items-stretch border-t border-subtle"
      style={{
        backgroundColor: "hsl(var(--bg-secondary))",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
      aria-label="Mobile quick actions"
    >
      {ITEMS.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className="relative flex flex-1 flex-col items-center justify-center gap-1 py-3 transition-colors"
            style={{
              color: active ? "hsl(var(--accent))" : "hsl(var(--text-muted))",
            }}
            aria-current={active ? "page" : undefined}
          >
            {/* Active indicator dot */}
            <span
              className="absolute top-2 h-1 w-5 rounded-full transition-opacity duration-200"
              style={{
                backgroundColor: "hsl(var(--accent))",
                opacity: active ? 1 : 0,
              }}
              aria-hidden="true"
            />
            {item.icon}
            <span className="text-[10px] font-medium tracking-wide">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
