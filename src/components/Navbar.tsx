"use client";

import Image from "next/image";
import ThemeToggle from "@/components/ThemeToggle";
import { useState, useEffect, useRef } from "react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useTheme } from "next-themes";
import { useTranslations, useLocale } from "next-intl";

export default function Navbar() {
  const t = useTranslations("Navbar");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const logoFilter = mounted && resolvedTheme === "light" ? "invert(1)" : undefined;

  const NAV_LINKS = [
    { label: t("features"), href: "#features" as const },
    { label: t("pricing"), href: "#pricing" as const },
    { label: t("about"), href: "#about" as const },
  ];

  function switchLocale(next: string) {
    router.replace(pathname, { locale: next });
  }

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
    return () => {
      document.body.style.overflow = "";
    };
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
          <Link href="/" className="flex items-center">
            <Image
              src="/assets/imgs/logo-floussi.png"
              alt="Floussi.Pro"
              width={180}
              height={40}
              className="h-10 w-auto"
              style={logoFilter ? { filter: logoFilter } : undefined}
              priority
            />
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
            {/* Locale switcher */}
            <button
              onClick={() => switchLocale(locale === "en" ? "ar" : "en")}
              className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-subtle text-muted hover:text-primary hover-muted transition-colors"
              aria-label="Switch language"
            >
              {locale === "en" ? "عربي" : "EN"}
            </button>
            <ThemeToggle />
            <Link href="/sign-in" className="button-secondary text-sm px-4 py-2">
              {t("signIn")}
            </Link>
            <Link href="/sign-up" className="button-primary text-sm px-4 py-2">
              {t("getStarted")}
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col justify-center items-center gap-1.25 w-9 h-9 rounded-lg transition-colors hover-muted"
            onClick={() => setDrawerOpen(true)}
            aria-label={t("openMenu")}
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
            Floussi.Pro
          </Link>
          <button
            onClick={() => setDrawerOpen(false)}
            aria-label="Close navigation menu"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:text-primary hover-muted transition-colors"
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
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted transition-all duration-150 hover-muted hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Drawer CTAs */}
        <div className="mt-auto flex flex-col gap-3">
          <button
            onClick={() => { switchLocale(locale === "en" ? "ar" : "en"); setDrawerOpen(false); }}
            className="text-xs font-semibold px-2.5 py-2 rounded-xl border border-subtle text-muted hover:text-primary hover-muted transition-colors w-full"
          >
            {locale === "en" ? "عربي" : "EN"}
          </button>
          <ThemeToggle className="w-full rounded-xl" />
          <Link
            href="/sign-in"
            className="button-secondary w-full justify-center"
            onClick={() => setDrawerOpen(false)}
          >
            {t("signIn")}
          </Link>
          <Link
            href="/sign-up"
            className="button-primary w-full justify-center"
            onClick={() => setDrawerOpen(false)}
          >
            {t("getStarted")}
          </Link>
        </div>
      </div>
    </>
  );
}
