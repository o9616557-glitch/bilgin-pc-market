import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { CartProvider } from "./CartContext";

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
    // ŞEFİM DİKKAT: Buradaki h-full silindi, yapışkan menü serbest bırakıldı!
    <html lang="tr">
      {/* overflow-x-hidden: Sağa sola kaymayı sonsuza dek kilitler! */}
      {/* min-h-screen: Ekranı tam kaplar ama menünün seninle inmesine izin verir! */}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-[#050810] overflow-x-hidden`}>
        
        <CartProvider>
          {/* Bu menü artık sen aşağı indikçe seninle gelecek */}
          <Header />

          <main className="flex-grow w-full">
            {children}
          </main>
        </CartProvider>

      </body>
    </html>
  );
}