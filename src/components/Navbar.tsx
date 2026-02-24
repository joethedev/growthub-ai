"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
];

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  /* Close drawer on outside click */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setDrawerOpen(false);
      }
    }
    if (drawerOpen) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [drawerOpen]);

  /* Lock scroll while drawer is open */
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  return (
    <>
      <header
        className="fixed top-0 inset-x-0 z-50 border-b border-subtle"
        style={{ backgroundColor: "hsl(var(--bg-primary) / 0.85)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
      >
        <nav
          className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight text-primary">
            <span
              aria-hidden="true"
              className="flex h-8 w-8 items-center justify-center rounded-xl text-white text-sm font-black"
              style={{ background: "hsl(var(--accent))" }}
            >
              G
            </span>
            GrowthOS
          </Link>

          {/* Desktop center links */}
          <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-muted transition-colors duration-200 hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop right actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/sign-in" className="button-secondary text-sm px-4 py-2">
              Log In
            </Link>
            <Link href="/sign-up" className="button-primary text-sm px-4 py-2">
              Get Started
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col justify-center items-center gap-1.25 w-9 h-9 rounded-lg transition-colors hover:bg-white/5"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={drawerOpen}
            aria-controls="mobile-drawer"
          >
            <span className="block h-0.5 w-5 bg-current text-primary rounded-full" />
            <span className="block h-0.5 w-5 bg-current text-primary rounded-full" />
            <span className="block h-0.5 w-3 bg-current text-primary rounded-full self-end" />
          </button>
        </nav>
      </header>

      {/* ── Mobile Drawer Backdrop ── */}
      <div
        aria-hidden="true"
        onClick={() => setDrawerOpen(false)}
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden"
        style={{ opacity: drawerOpen ? 1 : 0, pointerEvents: drawerOpen ? "auto" : "none" }}
      />

      {/* ── Mobile Drawer Panel ── */}
      <div
        id="mobile-drawer"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className="fixed top-0 right-0 z-50 h-full w-72 bg-secondary border-l border-subtle flex flex-col p-6 md:hidden transition-transform duration-300 ease-out"
        style={{ transform: drawerOpen ? "translateX(0)" : "translateX(100%)" }}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between mb-10">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-lg tracking-tight text-primary"
            onClick={() => setDrawerOpen(false)}
          >
            <span
              aria-hidden="true"
              className="flex h-8 w-8 items-center justify-center rounded-xl text-white text-sm font-black"
              style={{ background: "hsl(var(--accent))" }}
            >
              G
            </span>
            GrowthOS
          </Link>
          <button
            onClick={() => setDrawerOpen(false)}
            aria-label="Close navigation menu"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:text-primary hover:bg-white/5 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer nav links */}
        <nav aria-label="Mobile navigation">
          <ul className="flex flex-col gap-1 list-none m-0 p-0">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted transition-all duration-150 hover:bg-white/5 hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Drawer CTAs */}
        <div className="mt-auto flex flex-col gap-3">
          <Link
            href="/sign-in"
            className="button-secondary w-full justify-center"
            onClick={() => setDrawerOpen(false)}
          >
            Log In
          </Link>
          <Link
            href="/sign-up"
            className="button-primary w-full justify-center"
            onClick={() => setDrawerOpen(false)}
          >
            Get Started
          </Link>
        </div>
      </div>
    </>
  );
}
