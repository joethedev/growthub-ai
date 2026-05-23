import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Image from "next/image";
import AuthPanel from "@/components/AuthPanel";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — Floussi.Pro",
  description: "Sign in to your Floussi.Pro account.",
};

export default async function SignInPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <main className="min-h-screen grid lg:grid-cols-[1fr_1.1fr]">
      {/* ── Left: Sign-in form ── */}
      <section
        className="flex flex-col items-center justify-center px-6 py-16 bg-primary"
        aria-label="Sign in"
      >
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="mb-10 lg:hidden">
            <Image
              src="/assets/imgs/logo-floussi.png"
              alt="Floussi.Pro"
              width={160}
              height={32}
              className="h-8 w-auto"
              priority
            />
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-extrabold tracking-tight text-primary mb-2">
              Welcome back
            </h1>
            <p className="text-sm text-muted">
              Sign in to continue to your dashboard.
            </p>
          </div>

          <SignIn
            routing="path"
            path={`/${locale}/sign-in`}
            signUpUrl={`/${locale}/sign-up`}
            fallbackRedirectUrl={`/${locale}/dashboard`}
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-emerald-500/30 backdrop-blur-xl shadow-2xl shadow-emerald-500/10 rounded-2xl",
                headerTitle: "text-white",
                headerSubtitle: "text-gray-400",
                socialButtonsBlockButton:
                  "border-gray-700 bg-gray-800/50 hover:bg-gray-800 text-white hover:border-emerald-500/50 transition-all",
                formFieldLabel: "text-gray-300",
                formFieldInput:
                  "bg-gray-950/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-emerald-500 focus:ring-emerald-500",
                formButtonPrimary:
                  "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all",
                footerActionLink: "text-emerald-400 hover:text-emerald-300",
                identityPreviewText: "text-white",
                identityPreviewEditButton:
                  "text-emerald-400 hover:text-emerald-300",
                formResendCodeLink: "text-emerald-400 hover:text-emerald-300",
                otpCodeFieldInput:
                  "bg-gray-950/50 border-gray-700 text-white focus:border-emerald-500",
                dividerLine: "bg-gray-700",
                dividerText: "text-gray-400",
              },
            }}
          />
        </div>
      </section>

      {/* ── Right: Auth panel (hidden on mobile) ── */}
      <section
        className="hidden lg:block bg-secondary"
        aria-label="Why Floussi.Pro"
      >
        <AuthPanel />
      </section>
    </main>
  );
}
