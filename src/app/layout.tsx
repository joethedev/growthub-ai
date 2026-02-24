import { ClerkProvider } from '@clerk/nextjs'
import "./globals.css";
import { dark } from '@clerk/themes'




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{ theme: dark }}>
      <html lang="en" className="dark">
        <body className="antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
