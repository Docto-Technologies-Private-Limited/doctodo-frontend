import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { theme } from '@/lib/theme'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Docto DO",
  description: "Docto DO",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const c = theme.colors;

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      style={{
        // ✅ GLOBAL CSS VARIABLES
        ['--color-primary' as any]: c.primary,
        ['--color-secondary' as any]: c.secondary,
        ['--color-lightBg' as any]: c.lightBg,
        ['--color-textPrimary' as any]: c.textPrimary,
        ['--color-textSecondary' as any]: c.textSecondary,
        ['--color-divider' as any]: c.divider,
        ['--color-warning' as any]: c.warning,
        ['--color-alert' as any]: c.alert,
        ['--color-warningLight' as any]: c.warningLight,
        ['--color-welcome' as any]: c.welcome,
        ['--color-success' as any]: c.success,
      }}
    >
      <head> <meta name="viewport" content="width=device-width, initial-scale=1" /> </head>

      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}