import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CV Builder",
  description: "Build a clean, professional CV in minutes.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-zinc-50 text-zinc-900">
        {children}
      </body>
    </html>
  );
}
