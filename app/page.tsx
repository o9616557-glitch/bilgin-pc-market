import React from 'react';
import Link from 'next/link';

// EĞİTİM NOTU: Header'ı buradan sildik çünkü layout dosyasında zaten var. Çift çıkmasını engelledik.
import Hero from '@/components/Hero';

// @ts-ignore
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

export const revalidate = 3600;

// SİTENİN MOTORU: API Bağlantı Ayarları
const api = new (WooCommerceRestApi as any)({
  url: process.env.NEXT_PUBLIC_WC_URL || "",
  consumerKey: process.env.WC_CONSUMER_KEY || "",
  consumerSecret: process.env.WC_CONSUMER_SECRET || "",
  version: "wc/v3"
});

export default async function HomePage() {
  
  // 1. WOOCOMMERCE VERİ ÇEKME İŞLEMLERİ
  const res = await api.get('products', { per_page: 20, status: 'publish' }).catch(() => ({ data: [] }));
  const urunler = res.data.map((item: any) => ({
    id: item.id,
    ad: item.name,
    fiyat: item.price ? Number(item.price).toLocaleString('tr-TR') + " TL" : "Fiyat Sorunuz",
    resim: item.images?.[0]?.src || "https://via.placeholder.com/300?text=Bilgin+PC",
    ozellik: item.short_description ? item.short_description.replace(/(<([^>]+)>)/gi, "").substring(0, 60) + "..." : "Sistem özellikleri yükleniyor..."
  }));

  // 2. KURUMSAL LİNKLER (Veriler burada duruyor)
  const kurumsalLinkler = [
    { title: "Hakkımızda", path: "/hakkimizda", icon: "📄" },
    { title: "Gizlilik Politikası", path: "/gizlilik-politikasi", icon: "🔒" },
    { title: "Mesafeli Satış", path: "/mesafeli-satis", icon: "📜" },
    { title: "İade Şartları", path: "/iade-sartlari", icon: "📦" },
    { title: "Garanti Şartları", path: "/garanti-sartlari", icon: "🛡️" },
    { title: "İletişim", path: "/iletisim", icon: "📞" }
  ];

  return (
    <div className="bg-[#0b1120] min-h-screen text-white font-sans selection:bg-blue-500/30 flex flex-col">
      
      {/* ANA İÇERİK */}
      <main className="flex-grow">
        {/* Kahraman Afişi */}
        <Hero />
        
        {/* ÜRÜNLER ALANI (İleride buraya ürünleri dizeceğiz) */}
      </main>

      {/* 3. YENİ EKLENDİ: KAYIP OLAN KURUMSAL LİNKLER (FOOTER BÖLÜMÜ) */}
      {/* EĞİTİM NOTU: 'map' fonksiyonu ile yukarıdaki kurumsalLinkler listesini tek tek ekrana yazdırıyoruz. */}
      <footer className="w-full bg-[#050810] border-t border-white/5 py-8 mt-10">
        <div className="max-w-[1400px] mx-auto px-5 flex flex-wrap justify-center gap-6">
          {kurumsalLinkler.map((link, index) => (
            <Link key={index} href={link.path} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors">
              <span>{link.icon}</span>
              <span>{link.title}</span>
            </Link>
          ))}
        </div>
        <div className="text-center text-slate-600 text-xs mt-6">
          © 2026 Bilgin PC Market. Tüm hakları saklıdır.
        </div>
      </footer>

    </div>
  );
}