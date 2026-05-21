import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { ThemeProvider } from "@/components/ThemeProvider";
import "../globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Floussi.Pro",
  description: "Your AI budgeting app for everyday life in Morocco.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "ar")) {
    notFound();
  }

  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <ClerkProvider
      appearance={{ theme: dark }}
      signInUrl={`/${locale}/sign-in`}
      signUpUrl={`/${locale}/sign-up`}
    >
      <html lang={locale} dir={dir} suppressHydrationWarning>
        <body className="antialiased">
          <NextIntlClientProvider messages={messages}>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem={false}
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </NextIntlClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
