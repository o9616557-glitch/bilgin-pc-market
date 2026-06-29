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
// 🚀 BİNGO: Yeni Merkezi Sipariş Hafıza Odamızı İçe Aktarıyoruz
import { OrderProvider } from "./OrderContext"; 

// 🚀 İŞTE BİZİM KESKİN NİŞANCI: Akıllı Çip'i Ana Şasiye Çağırıyoruz
import HesapHafizaCipi from "@/components/HesapHafizaCipi"; 

// 🚀 1. ADIM: KÜRESEL KALKANI ÇATIYA ÇAĞIRIYORUZ (Sitenin Koruyucusu)
import GlobalKalkan from "@/components/GlobalKalkan";
import NavigasyonTemizleyici from "@/components/NavigasyonTemizleyici";

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
            top: '90px',          /* Yukarıdan boşluk (Header'ın altına inmesi için) */
            left: '0',            /* Sola yapışma emri (ortalamak için) */
            right: '0',           /* Sağa yapışma emri (ortalamak için) */
            margin: '0 auto',     /* Sağdan soldan eşit boşluk bırakıp tam ortaya kilitler */
            maxWidth: '1200px'    /* 🚀 İŞTE SİHRİN KOPTUĞU YER: Sitenin orta alan genişliği! */
          }}
          toastOptions={{
            style: {
              background: '#09090b',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
              margin: '0'         /* Eski itme ayarlarını tamamen sıfırladık */
            }
          }}
        />
        <AuthProvider>
          
          {/* 🚀 BİNGO! SİSTEMİN YENİ BEYNİ: F5 atılsa bile arkadan verileri toplayan gizli çipimiz! */}
          <HesapHafizaCipi />

          {/* 🚀 2. ADIM: KESKİN NİŞANCIYI NÖBETE DİKİYORUZ! (Şalteri inen adamı anında siteden şutlar) */}
          <GlobalKalkan />
          <NavigasyonTemizleyici />

          <CartProvider>
            <CompareProvider>
              {/* 🚀 ŞALTERİ KALDIRDIK: Artık siteye giren herkesin siparişleri arka planda sessizce indirilecek */}
              <OrderProvider>
                <Header />
                <main className="flex-grow w-full site-content-in">
                  {children}
                </main>
                <Footer />
                <ComparePopup />
              </OrderProvider>
            </CompareProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}