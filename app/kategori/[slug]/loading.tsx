export default function Loading() {
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-24 px-4 sm:px-6 lg:px-8 font-sans max-w-[1400px] mx-auto animate-in fade-in duration-300">

      {/* 1. ÜST BAŞLIK ALANI İSKELETİ (Geri Dön ve Kategori İsmi) */}
      <div className="border-b border-white/5 pb-6 mb-8">
        <div className="w-32 h-3 bg-white/10 rounded mb-4"></div>
        <div className="w-64 h-10 bg-white/10 rounded"></div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">

        {/* 2. SOL FİLTRE PANELİ İSKELETİ */}
        <aside className="hidden lg:flex flex-col w-[260px] xl:w-[280px] shrink-0 border-r border-white/5 pr-6">
          <div className="flex justify-between mb-8">
             <div className="w-24 h-4 bg-white/10 rounded"></div>
             <div className="w-12 h-4 bg-white/5 rounded"></div>
          </div>

          {/* 5 Adet Sahte Filtre Bloğu */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="mb-6 pb-6 border-b border-white/5">
              <div className="w-1/2 h-3 bg-white/10 rounded mb-4 uppercase tracking-widest"></div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded border border-white/10 bg-white/5"></div>
                  <div className="w-3/4 h-2.5 bg-white/5 rounded"></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded border border-white/10 bg-white/5"></div>
                  <div className="w-1/2 h-2.5 bg-white/5 rounded"></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded border border-white/10 bg-white/5"></div>
                  <div className="w-2/3 h-2.5 bg-white/5 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </aside>

        {/* 3. SAĞ ÜRÜN KARTLARI İSKELETİ */}
        <main className="flex-1 w-full min-w-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="w-full h-[400px] bg-[#18181b]/90 rounded-3xl border border-white/10 animate-pulse flex flex-col p-5">
                {/* Resim Alanı */}
                <div className="w-full h-40 bg-white/5 rounded-2xl mb-5"></div>
                
                {/* Marka ve Yıldız */}
                <div className="flex justify-between items-center mb-4">
                   <div className="w-1/4 h-2.5 bg-white/10 rounded"></div>
                   <div className="w-1/5 h-2.5 bg-white/10 rounded"></div>
                </div>
                
                {/* Başlık */}
                <div className="w-full h-4 bg-white/10 rounded mb-2"></div>
                <div className="w-2/3 h-4 bg-white/10 rounded mb-8"></div>
                
                {/* Fiyat ve Sepet Butonu */}
                <div className="mt-auto flex justify-between items-end border-t border-white/5 pt-4">
                   <div className="flex flex-col gap-1.5">
                     <div className="w-16 h-2.5 bg-white/5 rounded"></div>
                     <div className="w-24 h-6 bg-white/10 rounded"></div>
                   </div>
                   <div className="flex gap-2">
                     <div className="w-10 h-10 bg-white/10 rounded-xl"></div>
                     <div className="w-10 h-10 bg-white/10 rounded-xl"></div>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </main>

      </div>
    </div>
  );
}