import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Image from "next/image";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "Искра Льда | Аналитика",
  description: "Мониторинг и визуализация прогресса"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className="antialiased font-sans">

        {/* ФОН */}
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <Image
            src="/background.jpg"
            alt="Фон"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* КОНТЕНТ */}
        <div className="relative z-10">
          {children}
        </div>

      </body>
    </html>
  );
}