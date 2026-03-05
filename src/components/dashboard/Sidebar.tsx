"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { useSidebar } from "@/components/dashboard/SidebarProvider";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const NAV = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
    ),
  },
  {
    label: "Spendings",
    href: "/dashboard/spendings",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M7 12h10M11 18h4"/></svg>
    ),
  },
  {
    label: "Incomes",
    href: "/dashboard/incomes",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
    ),
  },
  {
    label: "Budgets",
    href: "/dashboard/budgets",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10H12V2z"/><path d="M21.18 8.02c-1-2.3-2.85-4.17-5.16-5.18"/></svg>
    ),
  },
  {
    label: "Periods",
    href: "/dashboard/periods",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
    ),
  },
  {
    label: "Categories",
    href: "/dashboard/categories",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/></svg>
    ),
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
    ),
  },
];

// ─── Shared inner panel ───────────────────────────────────────────────────────

function NavPanel({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const logoFilter = mounted && resolvedTheme === "light" ? "invert(1)" : undefined;

  return (
    <>
      {/* Logo */}
      <div className="flex items-center justify-between px-6 h-16 border-b border-subtle shrink-0">
        <Link href="/" onClick={onNavigate} className="flex items-center">
          <Image
            src="/assets/imgs/logo-growthos-dark-theme.png"
            alt="GrowthOS"
            width={140}
            height={28}
            className="h-7 w-auto"
            style={logoFilter ? { filter: logoFilter } : undefined}
            priority
          />
        </Link>

        {/* Close button — mobile only */}
        {onNavigate && (
          <button
            onClick={onNavigate}
            aria-label="Close menu"
            className="flex h-8 w-8 items-center justify-center rounded-xl text-muted hover:text-primary hover-muted transition-colors lg:hidden"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1" aria-label="Dashboard navigation">
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                active ? "text-primary" : "text-muted hover:text-primary hover-muted"
              }`}
              style={active ? { backgroundColor: "hsl(var(--accent) / 0.12)", color: "hsl(var(--accent))" } : {}}
              aria-current={active ? "page" : undefined}
            >
              <span style={active ? { color: "hsl(var(--accent))" } : {}}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-subtle px-5 py-4 flex items-center gap-3">
        <UserButton appearance={{ elements: { avatarBox: "h-8 w-8" } }} />
        <span className="text-xs text-muted truncate">My Account</span>
      </div>
    </>
  );
}

// ─── Sidebar (desktop static + mobile drawer) ─────────────────────────────────

export default function Sidebar() {
  const { open, close } = useSidebar();

  return (
    <>
      {/* ── Desktop: static sidebar ── */}
      <aside
        className="hidden lg:flex flex-col w-60 shrink-0 border-r border-subtle h-screen sticky top-0"
        style={{ backgroundColor: "hsl(var(--bg-secondary))" }}
      >
        <NavPanel />
      </aside>

      {/* ── Mobile: backdrop + drawer ── */}

      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={close}
        className="lg:hidden fixed inset-0 z-40"
        style={{
          backgroundColor: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(3px)",
          WebkitBackdropFilter: "blur(3px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 280ms ease",
        }}
      />

      {/* Drawer panel */}
      <aside
        className="lg:hidden fixed inset-y-0 left-0 z-50 flex flex-col w-72 border-r border-subtle"
        style={{
          backgroundColor: "hsl(var(--bg-secondary))",
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 300ms cubic-bezier(0.4, 0, 0.2, 1)",
          willChange: "transform",
        }}
        aria-label="Mobile navigation drawer"
        role="dialog"
        aria-modal="true"
      >
        <NavPanel onNavigate={close} />
      </aside>
    </>
  );
}
