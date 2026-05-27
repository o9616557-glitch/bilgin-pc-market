import { Toaster } from "react-hot-toast";
import AuthProvider from "@/components/AuthProvider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { CartProvider } from "./CartContext";

// 🚀 1. BİNGO: FOOTER'I BURADAN İÇERİ ÇAĞIRDIK
import Footer from "@/components/Footer"; 

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
    <html lang="tr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-[#050814] overflow-x-hidden`}>
        
        {/* 🚀 BİLDİRİM MOTORU */}
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#09090b',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)'
            }
          }}
        />

        {/* 🚀 ANA ŞALTER */}
        <AuthProvider>
          <CartProvider>
            <Header />
            
            <main className="flex-grow w-full">
              {children}
            </main>
            
            {/* 🚀 2. BİNGO: SİTENİN EN ALTINA (MAİN'İN BİTTİĞİ YERE) FOOTER'I MÜHÜRLEDİK! */}
            <Footer />
            
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}