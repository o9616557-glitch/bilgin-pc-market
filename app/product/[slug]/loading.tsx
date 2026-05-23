export default function Loading() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#050814] text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 bg-[#0b1329]/60 backdrop-blur-2xl border border-[#00e5ff]/10 p-6 sm:p-10 rounded-3xl shadow-[0_0_50px_rgba(0,229,255,0.03)] animate-pulse">
        
        {/* SOL TARAF: Havalı Dönen Yuvarlak (Görsel Yükleniyor) */}
        <div className="w-full h-[350px] sm:h-[500px] bg-[#09090b] rounded-2xl border border-white/5 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-[#00e5ff]/30 border-t-[#00e5ff] rounded-full animate-spin"></div>
        </div>
        
        {/* SAĞ TARAF: Yazı, Fiyat ve Buton İskeletleri */}
        <div className="flex flex-col justify-center gap-6">
          
          {/* Rozet alanı */}
          <div className="flex gap-2 mb-2">
            <div className="w-20 h-6 bg-white/5 rounded-full"></div>
            <div className="w-28 h-6 bg-[#00e5ff]/10 rounded-full border border-[#00e5ff]/20"></div>
          </div>

          {/* Ürün Başlığı */}
          <div className="w-3/4 h-10 bg-white/10 rounded-lg"></div>
          <div className="w-1/2 h-10 bg-white/10 rounded-lg"></div>

          {/* Kargo alanı */}
          <div className="w-full h-16 bg-[#050814]/80 rounded-xl border border-white/5 mt-4"></div>

          {/* Fiyat alanı */}
          <div className="w-full h-32 bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/5 mt-2"></div>

          {/* Butonlar */}
          <div className="flex gap-4 mt-6">
            <div className="w-24 h-14 bg-white/5 rounded-xl border border-white/5"></div>
            <div className="flex-1 h-14 bg-[#00e5ff]/20 rounded-xl border border-[#00e5ff]/30"></div>
            <div className="w-14 h-14 bg-white/5 rounded-xl border border-white/5 hidden sm:block"></div>
          </div>
          
        </div>
      </div>
    </div>
  );
}