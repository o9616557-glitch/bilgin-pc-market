import React from 'react';
import Link from 'next/link';

// YENİ EKLENDİ: Hazırladığımız Lego parçalarını (Bileşenleri) buraya çağırıyoruz
import Header from '@/components/Header';
import Hero from '@/components/Hero';

// @ts-ignore
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

export const revalidate = 3600;

// SİTENİN MOTORU: API Bağlantı Ayarları (Korundu)
const api = new (WooCommerceRestApi as any)({
  url: process.env.NEXT_PUBLIC_WC_URL || "",
  consumerKey: process.env.WC_CONSUMER_KEY || "",
  consumerSecret: process.env.WC_CONSUMER_SECRET || "",
  version: "wc/v3"
});

export default async function HomePage() {
  
  // 1. WOOCOMMERCE VERİ ÇEKME İŞLEMLERİ (Aynen korundu)
  const res = await api.get('products', { per_page: 20, status: 'publish' }).catch(() => ({ data: [] }));
  const urunler = res.data.map((item: any) => ({
    id: item.id,
    ad: item.name,
    fiyat: item.price ? Number(item.price).toLocaleString('tr-TR') + " TL" : "Fiyat Sorunuz",
    resim: item.images?.[0]?.src || "https://via.placeholder.com/300?text=Bilgin+PC",
    ozellik: item.short_description ? item.short_description.replace(/(<([^>]+)>)/gi, "").substring(0, 60) + "..." : "Sistem özellikleri yükleniyor..."
  }));

  // 2. KURUMSAL LİNKLER (Korundu, ileride En Alt Bilgi - Footer için kullanacağız)
  const kurumsalLinkler = [
    { title: "Hakkımızda", path: "/hakkimizda", icon: "📄" },
    { title: "Gizlilik Politikası", path: "/gizlilik-politikasi", icon: "🔒" },
    { title: "Mesafeli Satış", path: "/mesafeli-satis", icon: "📜" },
    { title: "İade Şartları", path: "/iade-sartlari", icon: "📦" },
    { title: "Garanti Şartları", path: "/garanti-sartlari", icon: "🛡️" },
    { title: "İletişim", path: "/iletisim", icon: "📞" }
  ];

  // 3. EKRANDA GÖRÜNEN KISIM (Eski menü silindi, yeni Lego parçaları eklendi)
  return (
    <div className="bg-[#0b1120] min-h-screen text-white font-sans selection:bg-blue-500/30 flex flex-col">
      
      {/* PARÇA 1: Yeni Efsane Üst Menümüz */}
      <Header />

      {/* PARÇA 2: Yeni Nesil Kahraman Afişimiz */}
      <main className="flex-grow">
        <Hero />
        
        {/* EĞİTİM NOTU: Yukarıda API'den çektiğimiz (urunler) listesini 
            bir sonraki aşamada buraya, afişin hemen altına dizeceğiz. */}
      </main>

    </div>
  );
}