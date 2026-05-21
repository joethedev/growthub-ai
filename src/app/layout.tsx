// Minimal root layout — the [locale] layout provides html/body/providers.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
