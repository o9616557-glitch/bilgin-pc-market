"use client";
import { useCompare } from "./CompareContext";

export default function CompareButton({ urun }: { urun: any }) {
  const { karsilastirmayaEkle, setPopupAcik } = useCompare();

  return (
    <button
      onClick={(e) => {
        e.preventDefault(); // Ürün sayfasına gitmeyi engeller
        e.stopPropagation(); // Tıklamanın dışarı taşmasını engeller
        karsilastirmayaEkle(urun);
        setPopupAcik(true);
      }}
      className="absolute bottom-3 right-3 bg-[#09090b]/80 hover:bg-[#00e5ff] text-slate-400 hover:text-black border border-slate-700 hover:border-[#00e5ff] p-2 rounded-xl z-20 backdrop-blur-md transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] group/btn"
      title="Karşılaştırmaya Ekle"
    >
      {/* Terazi İkonu */}
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover/btn:scale-110 transition-transform">
        <path d="M16 3h5v5" />
        <path d="M8 3H3v5" />
        <path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3" />
        <path d="m15 9 6-6" />
      </svg>
    </button>
  );
}