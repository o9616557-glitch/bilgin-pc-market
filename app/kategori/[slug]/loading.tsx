export default function Loading() {
  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-24 px-4 font-sans flex flex-col items-center">
      
      {/* SADECE İSKELET KARTLAR - YAZI, SİMGE VE NEON YOK */}
      <div className="max-w-[1400px] w-full mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 sm:px-0 animate-in fade-in duration-300">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="w-full h-[450px] bg-[#09090b] rounded-2xl border border-white/5 animate-pulse flex flex-col p-5">
            {/* Resim İskeleti */}
            <div className="w-full h-48 bg-white/5 rounded-xl mb-5"></div>
            
            {/* Marka ve Yıldız İskeleti */}
            <div className="flex justify-between items-center mb-4">
               <div className="w-1/4 h-3 bg-white/10 rounded"></div>
               <div className="w-1/5 h-3 bg-white/10 rounded"></div>
            </div>

            {/* Başlık İskeleti */}
            <div className="w-full h-5 bg-white/10 rounded mb-2"></div>
            <div className="w-2/3 h-5 bg-white/10 rounded mb-8"></div>
            
            {/* Alt Fiyat ve Buton İskeleti */}
            <div className="mt-auto flex justify-between items-end border-t border-white/5 pt-4">
               <div className="w-1/2 h-8 bg-white/10 rounded"></div>
               <div className="w-1/3 h-10 bg-white/10 rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
}