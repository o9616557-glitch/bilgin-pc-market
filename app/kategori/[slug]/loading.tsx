export default function Loading() {
  return (
    // 🔥 ŞEFİN İMZASI: KENARLARI SİYAH (BORDER-FREE) PREMIUM SKELETON 🔥
    <div className="min-h-screen bg-black text-white pt-24 pb-24 px-4 sm:px-6 lg:px-8 font-sans max-w-[1400px] mx-auto animate-in fade-in duration-300">

      {/* 1. ÜST BAŞLIK ALANI İSKELETİ (Kenarsız) */}
      <div className="border-b border-black pb-6 mb-8"> {/* Başlık altındaki çizgi bile siyah */}
        <div className="w-32 h-3 bg-white/10 rounded mb-4 animate-pulse"></div>
        <div className="w-64 h-10 bg-white/10 rounded animate-pulse"></div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">

        {/* 2. SOL FİLTRE PANELİ İSKELETİ (Kenarsız) */}
        <aside className="hidden lg:flex flex-col w-[260px] xl:w-[280px] shrink-0 border-r border-black pr-6"> {/* Yan çizgi siyah */}
          <div className="flex justify-between mb-8 animate-pulse">
             <div className="w-24 h-4 bg-white/10 rounded"></div>
             <div className="w-12 h-4 bg-white/5 rounded"></div>
          </div>

          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="mb-6 pb-6 border-b border-black"> {/* Filtre alt çizgileri siyah */}
              <div className="w-1/2 h-3 bg-white/10 rounded mb-4 animate-pulse uppercase tracking-widest"></div>
              <div className="space-y-3">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="flex items-center gap-3 animate-pulse">
                    <div className="w-4 h-4 rounded bg-white/5"></div>
                    <div className="w-3/4 h-2.5 bg-white/5 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </aside>

        {/* 3. SAĞ ÜRÜN KARTLARI İSKELETİ (Kenarsız) */}
        <main className="flex-1 w-full min-w-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              // 🔥 KART KENARLARINI SİYAH YAPTIK (border-black) 🔥
              <div key={i} className="w-full h-[400px] bg-[#09090b] rounded-3xl border border-black animate-pulse flex flex-col p-5 shadow-2xl">
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
                <div className="mt-auto flex justify-between items-end border-t border-black pt-4"> {/* Kart içi çizgi de siyah */}
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