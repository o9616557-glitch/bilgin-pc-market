"use client";

import { useCart } from "../CartContext";
import Link from "next/link";

export default function SepetSayfasi() {
  const { sepet, sepettenSil, adetGuncelle } = useCart();

  // 🚀 ŞEFİN ORİJİNAL MOTORU (Matematik ve hesaplamalara hiç dokunulmadı!)
  const araToplam = sepet.reduce((toplam: number, urun: any) => toplam + (urun.fiyat * urun.adet), 0);
  const kargo = araToplam > 5000 ? 0 : 150;
  const havaleIndirimi = (araToplam * 0.05); // Motor kısmında duruyor
  const genelToplam = araToplam + kargo;

  // EĞER SEPET BOŞ İSE GÖRÜNECEK JİLET GİBİ EKRAN
  if (sepet.length === 0) {
    return (
      <div className="min-h-[80vh] bg-[#050814] text-white flex flex-col items-center justify-center relative overflow-hidden px-4">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#00e5ff] blur-[150px] opacity-20 pointer-events-none"></div>
        <div className="text-6xl mb-6 opacity-50">🛒</div>
        <h2 className="text-2xl md:text-3xl font-black mb-4 uppercase tracking-wider text-center">
          Sepetin <span className="text-[#00e5ff]">Boş</span>
        </h2>
        <p className="text-slate-400 mb-8 text-center text-sm md:text-base max-w-md">
          İhtiyacınıza en uygun bilgisayar donanımlarını keşfetmek için mağazaya göz atın.
        </p>
        <Link href="/" className="bg-[#00e5ff] text-black font-bold py-3 md:py-4 px-8 md:px-10 rounded-xl hover:bg-[#00c4db] transition-all shadow-[0_0_20px_rgba(0,229,255,0.3)]">
          Mağazaya Geri Dön
        </Link>
      </div>
    );
  }

  // SEPET DOLUYSA GÖRÜNECEK YENİ NESİL KARTLI EKRAN
  return (
    <div className="min-h-screen bg-[#050814] text-white py-12 md:py-20 px-4 relative overflow-hidden">
      {/* ARKADAKİ NEON MAVİ PARLAMA EFEKTİ */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00e5ff] blur-[150px] opacity-20 pointer-events-none"></div>

      <div className="max-w-[1200px] mx-auto relative z-10">
        
        {/* BAŞLIK */}
        <div className="mb-8 md:mb-12 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-2">
            ALIŞVERİŞ <span className="text-[#00e5ff]">SEPETİM</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base font-medium">
            Sepetindeki ürünleri inceleyip siparişini tamamlayabilirsin.
          </p>
        </div>

        {/* ANA İSKELET (Mobilde alt alta, PC'de yan yana) */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* SOL TARAF: ÜRÜNLER LİSTESİ */}
          <div className="flex-1 flex flex-col gap-4">
            {sepet.map((urun: any, index: number) => (
              <div key={index} className="flex flex-col sm:flex-row items-center bg-[#09090b] border border-white/10 rounded-2xl p-4 gap-4 transition-all hover:border-[#00e5ff]/30 shadow-lg relative">
                
                {/* Ürün Resmi */}
                <div className="w-full sm:w-28 h-40 sm:h-28 shrink-0 bg-[#121215] rounded-xl overflow-hidden border border-white/5 flex items-center justify-center p-2">
                  <img 
                    src={urun.resim || "/placeholder.jpg"} 
                    alt={urun.isim} 
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Ürün Detayları */}
                <div className="flex-1 flex flex-col text-center sm:text-left w-full">
                  <h3 className="font-bold text-lg md:text-xl text-white mb-1 leading-tight">{urun.isim}</h3>
                  {urun.varyasyon && (
                    <p className="text-[#00e5ff] text-sm font-semibold mb-2">{urun.varyasyon}</p>
                  )}
                  <div className="text-xl font-black mt-2 sm:mt-auto">
                    {(urun.fiyat * urun.adet).toLocaleString("tr-TR")} <span className="text-sm text-slate-400 font-medium">TL</span>
                  </div>
                </div>

                {/* Butonlar ve Kontroller (Orijinal parametreler korundu) */}
                <div className="flex flex-row sm:flex-col items-center justify-between sm:justify-center gap-4 w-full sm:w-auto mt-4 sm:mt-0">
                  
                  {/* Artı/Eksi Kontrolü */}
                  <div className="flex items-center bg-[#121215] border border-white/10 rounded-xl p-1 shadow-inner">
                    <button 
                      onClick={() => adetGuncelle(urun.id, urun.varyasyon, -1)} 
                      className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all text-xl font-medium"
                    >
                      -
                    </button>
                    <span className="font-black w-8 text-center text-white text-lg">{urun.adet}</span>
                    <button 
                      onClick={() => adetGuncelle(urun.id, urun.varyasyon, 1)} 
                      className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all text-xl font-medium"
                    >
                      +
                    </button>
                  </div>

                  {/* Sil Butonu (Orijinal silme motoruna bağlı) */}
                  <button 
                    onClick={() => sepettenSil(urun.id, urun.varyasyon)} 
                    className="text-red-400 hover:text-white text-sm font-bold bg-red-500/10 hover:bg-red-500/30 py-2.5 px-4 rounded-lg transition-all w-full sm:w-auto"
                  >
                    Kaldır
                  </button>
                </div>

              </div>
            ))}
          </div>

          {/* SAĞ TARAF: SİPARİŞ ÖZETİ KUTUSU */}
          <div className="w-full lg:w-[380px] shrink-0">
            <div className="bg-[#09090b] border border-white/10 rounded-2xl p-6 lg:p-8 sticky top-24 shadow-2xl">
              <h2 className="font-black text-xl mb-6 pb-4 border-b border-white/10 text-white uppercase tracking-wide">
                Sipariş Özeti
              </h2>
              
              <div className="flex justify-between text-slate-400 mb-4 font-medium text-sm lg:text-base">
                <span>Ara Toplam</span>
                <span className="text-white">{araToplam.toLocaleString("tr-TR")} TL</span>
              </div>
              
              <div className="flex justify-between text-slate-400 mb-6 font-medium text-sm lg:text-base">
                <span>Kargo Ücreti</span>
                <span>{kargo === 0 ? <span className="text-[#00e5ff] font-bold">Ücretsiz</span> : <span className="text-white">{kargo} TL</span>}</span>
              </div>
              
              <div className="flex justify-between items-center text-white font-black border-t border-white/10 pt-6 mb-8">
                <span className="text-lg">Genel Toplam</span>
                <span className="text-2xl lg:text-3xl text-[#00e5ff]">{genelToplam.toLocaleString("tr-TR")} TL</span>
              </div>

              {/* ALIŞVERİŞİ TAMAMLA BUTONU */}
              <Link href="/odeme" className="block w-full">
                <button className="w-full bg-[#00e5ff] text-black font-black uppercase tracking-wider py-4 rounded-xl text-lg hover:bg-[#00c4db] transition-all shadow-[0_0_20px_rgba(0,229,255,0.2)] hover:shadow-[0_0_30px_rgba(0,229,255,0.4)]">
                  Alışverişi Tamamla
                </button>
              </Link>
              
              <div className="text-center mt-6">
                 <Link href="/" className="text-slate-500 hover:text-white text-sm transition-all font-medium">
                   ← Mağazaya Dönüp Alışverişe Devam Et
                 </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}