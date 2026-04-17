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
      >
     
      <body className="min-h-full flex flex-col text-textPrimary">
        {children}
      </body>
    </html>
  );
}