"use client";
import { useEffect, useState } from "react";
import { Loader2, Trash2, X, Heart, ShoppingCart } from "lucide-react"; 

interface FavorilerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FavorilerModal({ isOpen, onClose }: FavorilerModalProps) {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchFavoriler = async () => {
    try {
      setLoading(true);
      // Şefim, eğer favorileri veritabanından çekiyorsan burası çalışır. 
      // Eğer LocalStorage (tarayıcı hafızası) kullanıyorsan bana söyle, 1 saniyede güncellerim!
      const res = await fetch(`/api/favoriler?t=${new Date().getTime()}`, { 
        cache: 'no-store'
      });
      const data = await res.json();
      if (res.ok) {
        setFavorites(data.favoriler || []);
      } else {
        // API yoksa bile sayfa çökmesin diye boş liste veriyoruz
        setFavorites([]); 
      }
    } catch (error) {
      setFavorites([]); // Hata olursa boş göster, çökmesin
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      fetchFavoriler();
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [isOpen]);

  const handleRemove = async (id: string) => {
    try {
      // Şimdilik sadece ekrandan uçurur, API'n varsa oradan da siler
      setFavorites(favorites.filter((fav) => fav._id !== id));
      await fetch(`/api/favoriler?id=${id}`, { method: "DELETE" });
    } catch (error) {
      console.log("Silme hatası");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-[#03060A]/95 backdrop-blur-3xl p-0 md:p-6 transition-all duration-300">
      <div className="bg-[#050B14] md:bg-slate-900/80 md:border border-slate-700 md:rounded-3xl w-full h-full md:max-w-4xl md:h-[85vh] flex flex-col relative shadow-[0_0_50px_rgba(225,29,72,0.1)]">
        
        {/* ÜST BAŞLIK (PEMBE NEON TASARIM) */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-800/80 bg-[#050B14]/95 md:bg-slate-900/95 sticky top-0 z-30 md:rounded-t-3xl backdrop-blur-xl">
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-500 flex items-center gap-3">
            <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-pink-500 fill-pink-500/20" /> Favorilerim
          </h1>
          <button onClick={onClose} className="p-2 sm:p-2.5 bg-slate-800/50 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded-xl transition-all border border-transparent hover:border-red-500/20" title="Kapat">
            <X className="w-6 h-6 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* İÇERİK KISMI */}
        <div className="overflow-y-auto p-4 sm:p-8 flex-1 custom-scrollbar text-white">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="animate-spin text-pink-500 h-10 w-10" />
            </div>
          ) : errorMsg ? (
            <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-red-400 text-sm mb-6 flex justify-between items-center">
                <span>{errorMsg}</span>
                <button onClick={() => setErrorMsg(null)} className="text-red-400 hover:text-red-300">✕</button>
            </div>
          ) : favorites.length === 0 ? (
            <div className="text-center p-12 bg-slate-800/20 border border-slate-700/50 rounded-2xl mt-10 flex flex-col items-center justify-center h-[40vh]">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <Heart className="w-10 h-10 text-slate-600" />
              </div>
              <p className="text-slate-300 font-bold text-lg mb-2">Favori Listeniz Boş</p>
              <p className="text-slate-500 text-sm">Beğendiğiniz ürünleri buraya ekleyerek daha sonra kolayca bulabilirsiniz.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pb-10">
              {favorites.map((item: any) => (
                <div key={item._id} className="border border-slate-700/50 bg-slate-800/30 rounded-2xl p-4 flex gap-4 relative group hover:border-pink-500/50 hover:bg-slate-800/60 transition-all">
                  
                  {/* SİLME BUTONU */}
                  <button onClick={() => handleRemove(item._id)} className="absolute top-3 right-3 p-2 text-slate-500 hover:text-red-400 bg-slate-900/80 rounded-lg hover:bg-red-500/10 transition-all z-10 opacity-80 group-hover:opacity-100" title="Favorilerden Kaldır">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  
                  <img src={item.image || item.resim || "https://app.bilginpcmarket.com/placeholder.png"} alt={item.title || item.isim} className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl bg-slate-800 border border-slate-700/50" />
                  
                  <div className="flex flex-col justify-between py-1 flex-1 pr-8">
                    <div>
                      <p className="font-bold text-slate-200 line-clamp-2 text-sm leading-tight">{item.title || item.isim || "İsimsiz Ürün"}</p>
                      <p className="font-black text-pink-400 text-base sm:text-lg mt-2">{Number(item.price || item.fiyat || 0).toLocaleString("tr-TR")} TL</p>
                    </div>
                    
                    {/* İleride Sepete Ekleme Fonksiyonu Yazmak İstersen Diye Hazır Tasarım */}
                    <button className="flex items-center gap-2 mt-3 text-xs font-bold text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 py-1.5 px-3 rounded-lg w-fit transition-all border border-cyan-500/20">
                      <ShoppingCart className="w-3.5 h-3.5" /> Sepete Ekle
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}