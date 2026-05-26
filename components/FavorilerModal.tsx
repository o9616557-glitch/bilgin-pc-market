"use client";

import Link from "next/link";

export default function FavorilerModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    // ARKAPLAN KARARTMASI VE BULANIKLIK EFEKTİ
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      
      {/* ANA POPUP KUTUSU */}
      <div className="w-full max-w-xl bg-[#09090b] border border-white/10 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden relative">
        
        {/* Kapat (X) Butonu */}
        <button onClick={onClose} className="absolute top-4 right-5 text-slate-400 hover:text-white text-3xl font-black transition-all z-10">
          &times;
        </button>

        <div className="p-6 md:p-8">
          {/* BAŞLIK */}
          <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter mb-2">
            FAVORİ <span className="text-[#00e5ff]">ÜRÜNLERİM</span>
          </h2>
          <p className="text-slate-400 text-sm mb-6 border-b border-white/10 pb-4">
            Gözüne kestirdiğin ve beğendiğin ürünler burada listelenir.
          </p>

          {/* FAVORİ ÜRÜNLER LİSTESİ (Şimdilik Demo, buraya kendi sistemini bağlayabilirsin) */}
          <div className="flex flex-col gap-3 max-h-[50vh] overflow-y-auto pr-2">
            
            {/* ÖRNEK ÜRÜN KUTUSU */}
            <div className="flex items-center gap-4 bg-[#121215] border border-white/5 rounded-xl p-3 hover:border-[#00e5ff]/30 transition-all">
              <div className="w-16 h-16 bg-black rounded-lg border border-white/10 flex items-center justify-center text-2xl">💻</div>
              <div className="flex-1">
                <h3 className="text-white font-bold text-sm md:text-base leading-tight">Gaming Oyuncu Kasası</h3>
                <p className="text-[#00e5ff] font-black text-sm mt-1">15.000 TL</p>
              </div>
              <button className="bg-[#00e5ff]/10 text-[#00e5ff] hover:bg-[#00e5ff] hover:text-black text-xs font-bold py-2 px-4 rounded-lg transition-all">
                İncele
              </button>
            </div>
            
            {/* FAVORİLER BOŞSA ÇIKACAK YAZI İÇİN YER */}
            {/* <div className="text-center py-8 text-slate-500 font-medium">Henüz favorilere eklenmiş bir ürün yok.</div> */}

          </div>

          {/* ALT KISIM KAPANIŞ */}
          <div className="mt-6 pt-4 border-t border-white/10 text-center">
             <button onClick={onClose} className="text-slate-400 hover:text-white text-sm transition-all font-medium">
               Kapat ve Alışverişe Devam Et
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}