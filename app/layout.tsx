import { Toaster } from "react-hot-toast";
import AuthProvider from "@/components/AuthProvider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { CartProvider } from "./CartContext";
import Footer from "@/components/Footer"; 
import { CompareProvider } from "./CompareContext";
import ComparePopup from "./ComparePopup";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  themeColor: "#050814",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      {/* 🚀 İŞTE BURASI: font-sans eklendi, artık o premium Geist fontu tüm siteye HD kalitesinde basılacak 🚀 */}
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen flex flex-col bg-[#050814] overflow-x-hidden`}>
       <Toaster 
          position="top-right"
          containerStyle={{
            zIndex: 2147483647,
            top: 80,    /* 🚀 Menünün üstüne binmesin diye biraz aşağı aldık */
            right: 60   /* 🚀 Ta fizandan kurtarıp içeriye, Sepet yazısının hizasına çektik */
          }}
          toastOptions={{
            style: {
              background: '#09090b',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)'
            }
          }}
        />
        <AuthProvider>
          <CartProvider>
            <CompareProvider>
              <Header />
              <main className="flex-grow w-full">
                {children}
              </main>
              <Footer />
              <ComparePopup />
            </CompareProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}