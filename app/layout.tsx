import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NeuraTrade AI | Premium Crypto Trading Dashboard",
  description:
    "A cinematic AI-powered crypto trading dashboard for bot automation, portfolio intelligence, security, and real-time market execution."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
