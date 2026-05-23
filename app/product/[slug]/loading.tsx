export default function Loading() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#050814] flex flex-col items-center justify-center">
      {/* Sadece zarifçe dönen bir neon halka, gölge yok, kalabalık yok */}
      <div className="w-12 h-12 border-4 border-[#00e5ff]/20 border-t-[#00e5ff] rounded-full animate-spin mb-4"></div>
      <p className="text-[#00e5ff] font-bold text-sm tracking-widest uppercase animate-pulse">Ürün Yükleniyor...</p>
    </div>
  );
}