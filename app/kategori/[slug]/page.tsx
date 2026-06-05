"use client";

import { use } from "react";
import Link from "next/link";
import { useCart } from "@/app/CartContext";

// ŞEF DİKKAT: Burası senin veritabanından gelecek ürünlerin yeri. Şimdilik test için sahte ürünler koydum.
const ornekUrunler = [
  { id: 1, kategori: "anakart", isim: "MSI MAG B650 TOMAHAWK WIFI AM5", fiyat: 8499, resim: "https://via.placeholder.com/300x300/09090b/3b82f6?text=Anakart+Resmi" },
  { id: 2, kategori: "anakart", isim: "ASUS ROG STRIX B650E-F GAMING WIFI", fiyat: 11250, resim: "https://via.placeholder.com/300x300/09090b/3b82f6?text=Anakart+Resmi" },
  { id: 3, kategori: "ekran-karti", isim: "ASUS TUF Gaming GeForce RTX 4070 Ti", fiyat: 36500, resim: "https://via.placeholder.com/300x300/09090b/3b82f6?text=Ekran+Karti" },
  { id: 4, kategori: "islemci", isim: "AMD Ryzen 7 7800X3D 5.0GHz 8 Çekirdek", fiyat: 14200, resim: "https://via.placeholder.com/300x300/09090b/3b82f6?text=Islemci" },
];

export default function KategoriSayfasi({ params }: { params: Promise<{ slug: string }> }) {
  // Next.js 15 kurallarına göre params'ı çözümlüyoruz
  const resolvedParams = use(params);
  const { slug } = resolvedParams;
  
  const { sepeteEkle } = useCart(); // Senin sepet motorun

  // URL'den gelen kategoriye göre ürünleri filtrele (Örn: sadece anakartlar)
  const kategoriUrunleri = ornekUrunler.filter(urun => urun.kategori === slug);

  // Linkteki yazıyı başlık için düzelt (Örn: "ekran-karti" -> "EKRAN KARTI")
  const baslik = slug.replace("-", " ").toUpperCase();

  return (
    <div className="min-h-screen bg-[#050814] text-white pt-10 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ÜST BİLGİ VE BAŞLIK */}
        <div className="mb-10 border-b border-gray-800 pb-6">
          <div className="flex items-center text-sm text-gray-400 mb-4 space-x-2">
            <Link href="/" className="hover:text-[#3b82f6] transition-colors">Ana Sayfa</Link>
            <span>/</span>
            <span className="text-gray-200">{baslik}</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white">
            <span className="text-[#3b82f6]">/</span> {baslik}
          </h1>
          <p className="mt-2 text-gray-400">En güncel ve yüksek performanslı {baslik.toLowerCase()} modelleri Bilgin PC Market güvencesiyle.</p>
        </div>

        {/* ÜRÜNLER YOKSA UYARI VER */}
        {kategoriUrunleri.length === 0 ? (
          <div className="text-center py-20 bg-[#09090b] border border-gray-800 rounded-2xl">
            <span className="text-6xl block mb-4">🔍</span>
            <h2 className="text-2xl font-bold text-gray-300">Bu Kategoride Ürün Bulunamadı</h2>
            <p className="text-gray-500 mt-2">Şef henüz bu kategoriye ürün eklememiş.</p>
          </div>
        ) : (
          
          /* ÜRÜN VİTRİNİ (GRID SİSTEMİ) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {kategoriUrunleri.map((urun) => (
              <div key={urun.id} className="bg-[#09090b] border border-gray-800 rounded-2xl p-4 flex flex-col hover:border-gray-600 transition-all group shadow-lg shadow-black/50 hover:shadow-[#3b82f6]/10 relative">
                
                {/* Ürün Resmi */}
                <div className="w-full aspect-square bg-gray-900 rounded-xl mb-4 overflow-hidden relative border border-gray-800/50">
                  <img src={urun.resim} alt={urun.isim} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                </div>
                
                {/* Ürün İsmi */}
                <Link href={`/urun/${urun.id}`} className="text-base font-bold text-gray-200 hover:text-[#3b82f6] transition-colors line-clamp-2 mb-2 flex-grow">
                  {urun.isim}
                </Link>
                
                {/* Fiyat ve Buton Alt Kısım */}
                <div className="mt-auto pt-4 border-t border-gray-800/50">
                  <div className="text-2xl font-black text-white mb-4">
                    {urun.fiyat.toLocaleString('tr-TR')} <span className="text-sm font-normal text-gray-400">TL</span>
                  </div>
                  
                  {/* JİLET GİBİ SEPETE EKLE BUTONU */}
                  <button 
                    onClick={() => sepeteEkle(urun)} // Sepete Ekle Motoru Bağlı
                    className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl border border-gray-800 hover:bg-[#3b82f6] hover:border-[#3b82f6] hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all flex items-center justify-center space-x-2 group-hover:bg-[#3b82f6] group-hover:border-[#3b82f6]"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    <span>Sepete Ekle</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}