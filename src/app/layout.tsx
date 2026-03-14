import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "AJ's Café — Cafe & POS",
  description: "Order your favorite coffee and meals online. Cafe ordering and POS system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-cream-50 font-sans antialiased text-coffee-950">
        {children}
      </body>
    </html>
  );
}
