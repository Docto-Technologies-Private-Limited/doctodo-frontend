import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { theme } from "@/lib/theme";

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
      style={
        {
          "--color-primary": c.primary,
          "--color-primaryLight": c.primaryLight,

          "--color-secondary": c.secondary,
          "--color-secondaryLight": c.secondaryLight,

          "--color-lightBg": c.lightBg,

          "--color-textPrimary": c.textPrimary,
          "--color-textSecondary": c.textSecondary,
          "--color-textWhite": c.textWhite,
          "--color-textDisabled": c.textDisabled,

          "--color-divider": c.divider,

          "--color-warning": c.warning,
          "--color-warningLight": c.warningLight,

          "--color-alert": c.alert,
          "--color-alertLight": c.alertLight,
          "--color-alertBg": c.alertBg,

          "--color-success": c.success,
          "--color-successLight": c.successLight,

          "--color-welcome": c.welcome,
          "--color-welcomeLight": c.welcomeLight,
        } as React.CSSProperties
      }
    >
      <body className="min-h-full flex flex-col text-textPrimary">
        {children}
      </body>
    </html>
  );
}