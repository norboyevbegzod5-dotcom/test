import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BasisCraft | Конструктор мебели",
  description:
    "Профессиональный онлайн-инструмент для проектирования мебели с автоматическим расчетом карт раскроя, спецификаций и сметы.",
};

const navItems = [
  { href: "/", label: "Обзор" },
  { href: "/constructor", label: "Конструктор" },
  { href: "/projects", label: "Проекты" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-100`}>
        <div className="min-h-screen">
          <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur supports-[backdrop-filter]:bg-slate-950/60">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
              <Link href="/" className="font-semibold tracking-tight text-white">
                BasisCraft
              </Link>
              <nav className="flex items-center gap-6 text-sm text-slate-200">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="transition hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </header>
          <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
        </div>
      </body>
    </html>
  );
}
