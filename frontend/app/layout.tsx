import type { Metadata } from "next";
import {Inter} from "next/font/google"
import "./globals.css";
import Navbar from "./navbar";
import Image from "next/image";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "Искра Льда | Аналитика",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  
  return (
    <html
      lang="ru">
      <body className="antialiased font-sans">
        <Navbar/>
        <main className="relative min-h-screen">
          <div className="fixed inset-0 -z-10 pointer-events-none">
            <Image 
            src="/background.jpg"
            alt = "Фон"
            fill
            className="object-cover"
            priority
            />
          </div>
        
          <div className="relative z-10">
            {children}
          </div>
          </main>
        </body>
    </html>
  );
}

