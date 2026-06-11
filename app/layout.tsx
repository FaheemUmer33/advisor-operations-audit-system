import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Advisor Operations Audit System",
  description: "Smart Logics audit system for advisory operations.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
