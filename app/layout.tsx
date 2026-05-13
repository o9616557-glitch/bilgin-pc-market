import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header"; // Menü bileşenini iskelete dahil ettik

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bilgin PC Market",
  description: "Yüksek performanslı oyuncu bilgisayarları ve bileşenleri.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="h-full">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-full flex flex-col bg-[#050810]`}>
        
        {/* Üst Menü: Tüm sayfalarda sabitlenmiş şekilde en tepede yer alır */}
        <Header />

        {/* Sayfa İçerikleri: Header'ın altından başlar */}
        <main className="flex-grow">
          {children}
        </main>

      </body>
    </html>
  );
}