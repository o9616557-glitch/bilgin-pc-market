"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/app/CartContext";

export default function KategoriSayfasi({ params }: { params: Promise<{ slug: string }> }) {
  // Next.js 15 kurallarına göre params'ı çözümlüyoruz
  const resolvedParams = use(params);
  const { slug } = resolvedParams;
  
  const { sepeteEkle } = useCart();
  
  // GERÇEK ÜRÜNLERİ TUTACAĞIMIZ DEPOLAR
  const [kategoriUrunleri, setKategoriUrunleri] = useState<any[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);

  // 🚀 İŞTE GERÇEK ÜRÜNLERİ ÇEKEN MOTOR BURASI
  useEffect(() => {
    async function gercekUrunleriGetir() {
      setYukleniyor(true);
      try {
        /* 
           ŞEF DİKKAT: Burası senin WordPress/Veritabanı API adresin!
           Eğer ürünleri çektiğin özel bir adresin varsa (örn: /api/urunler) buraya yaz.
           Şu an otomatik olarak senin kategorine ait ürünleri arayacak.
        */
        const response = await fetch(`/api/urunler?kategori=${slug}`);
        
        if (response.ok) {
          const data = await response.json();
          setKategoriUrunleri(data);
        } else {
          console.error("Veritabanından ürünler çekilemedi!");
        }
      } catch (error) {
        console.error("Bağlantı hatası:", error);
      } finally {
        setYukleniyor(false);
      }
    }

    gercekUrunleriGetir();
  }, [slug]);

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

        {/* YÜKLENİYOR EKRANI */}
        {yukleniyor ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#3b82f6]"></div>
          </div>
        ) : kategoriUrunleri.length === 0 ? (
          
          /* ÜRÜN YOKSA UYARI VER */
          <div className="text-center py-20 bg-[#09090b] border border-gray-800 rounded-2xl shadow-xl">
            <span className="text-6xl block mb-4">🔍</span>
            <h2 className="text-2xl font-bold text-gray-300">Bu Kategoride Ürün Bulunamadı</h2>
            <p className="text-gray-500 mt-2">Şef henüz bu kategoriye ürün eklememiş veya API bağlantısı bekleniyor.</p>
          </div>
        ) : (
          
          /* GERÇEK ÜRÜN VİTRİNİ (GRID SİSTEMİ) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {kategoriUrunleri.map((urun) => (
              <div key={urun.id} className="bg-[#09090b] border border-gray-800 rounded-2xl p-4 flex flex-col hover:border-gray-600 transition-all group shadow-lg shadow-black/50 hover:shadow-[#3b82f6]/10 relative">
                
                {/* Ürün Resmi */}
                <div className="w-full aspect-square bg-gray-900 rounded-xl mb-4 overflow-hidden relative border border-gray-800/50">
                  {/* Senin sistemden gelen resim yolunu kullanır */}
                  <img src={urun.resim || urun.image} alt={urun.isim || urun.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                </div>
                
                {/* Ürün İsmi */}
                <Link href={`/urun/${urun.id || urun.slug}`} className="text-base font-bold text-gray-200 hover:text-[#3b82f6] transition-colors line-clamp-2 mb-2 flex-grow">
                  {urun.isim || urun.title || urun.name}
                </Link>
                
                {/* Fiyat ve Buton Alt Kısım */}
                <div className="mt-auto pt-4 border-t border-gray-800/50">
                  <div className="text-2xl font-black text-white mb-4">
                    {/* Veritabanından gelen fiyatı formatla */}
                    {Number(urun.fiyat || urun.price).toLocaleString('tr-TR')} <span className="text-sm font-normal text-gray-400">TL</span>
                  </div>
                  
                  {/* JİLET GİBİ SEPETE EKLE BUTONU */}
                  <button 
                    onClick={() => sepeteEkle(urun)}
                    className="w-full bg-[#3b82f6] text-white font-bold uppercase tracking-wider rounded-xl text-sm hover:bg-[#2563eb] transition-all shadow-lg shadow-blue-500/30 py-3 flex items-center justify-center space-x-2"
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