"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useCart } from "@/app/CartContext";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { Search, X, Clock, Flame, ArrowRight, Loader2 } from "lucide-react";

const POPULER_KELIMELER = ["Asus ROG", "RTX 4090", "Intel 14. Nesil", "DDR5 RAM", "Samsung 990 Pro"];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const gizlenecekSayfalar = ["/sepet", "/odeme", "/giris", "/kayit", "/checkout"];
  if (gizlenecekSayfalar.includes(pathname)) return null; 

  const { sepet } = useCart();
  const [menuAcik, setMenuAcik] = useState(false);
  const [hesabimAcik, setHesabimAcik] = useState(false);
  
  // 🔥 YENİ NESİL ARAMA MOTORU STATE'LERİ 🔥
  const [aramaAcik, setAramaAcik] = useState(false);
  const [aramaMetni, setAramaMetni] = useState("");
  const [canliSonuclar, setCanliSonuclar] = useState<any[]>([]);
  const [populerUrunler, setPopulerUrunler] = useState<any[]>([]);
  const [sonAramalar, setSonAramalar] = useState<string[]>([]);
  const [aramaYukleniyor, setAramaYukleniyor] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const hesabimRef = useRef<HTMLDivElement>(null);
  const sepetAdedi = sepet.reduce((toplam: number, urun: any) => toplam + (urun.adet || 1), 0);
  const { data: session } = useSession();

  // 1. Sayfa yüklendiğinde "Son Aramaları" yerel hafızadan (Tarayıcıdan) çek
  useEffect(() => {
    const kayitliAramalar = localStorage.getItem("sonAramalar");
    if (kayitliAramalar) setSonAramalar(JSON.parse(kayitliAramalar));
  }, []);

  // 2. Arama Modal'ı açıldığında "En Çok Satanlar" ürünlerini anında getir ve Input'a odaklan
  useEffect(() => {
    if (aramaAcik) {
      setTimeout(() => searchInputRef.current?.focus(), 100); // Açılınca klavyeyi otomatik çıkar
      if (populerUrunler.length === 0) {
        fetch("/api/arama?init=true").then(res => res.json()).then(data => setPopulerUrunler(data));
      }
    } else {
      setAramaMetni(""); // Kapanınca metni temizle
    }
  }, [aramaAcik]);

  // 3. Yazı yazıldıkça çalışan canlı arama
  useEffect(() => {
    if (aramaMetni.trim().length >= 2) {
      setAramaYukleniyor(true);
      const timer = setTimeout(async () => {
        try {
          const res = await fetch("/api/arama?q=" + encodeURIComponent(aramaMetni));
          const data = await res.json();
          setCanliSonuclar(data);
        } catch (e) { setCanliSonuclar([]); }
        setAramaYukleniyor(false);
      }, 250);
      return () => clearTimeout(timer);
    } else {
      setCanliSonuclar([]);
    }
  }, [aramaMetni]);

  // ARAMAYI TETİKLE VE HAFIZAYA KAYDET
  const handleAramaSubmit = (e?: React.FormEvent, ozelKelime?: string) => {
    if (e) e.preventDefault();
    const aranacak = ozelKelime || aramaMetni;
    
    if (aranacak.trim()) {
      // Aramayı hafızaya kaydet
      const yeniAramalar = [aranacak, ...sonAramalar.filter(k => k !== aranacak)].slice(0, 3);
      setSonAramalar(yeniAramalar);
      localStorage.setItem("sonAramalar", JSON.stringify(yeniAramalar));
      
      setAramaAcik(false);
      window.location.href = "/arama?q=" + encodeURIComponent(aranacak);
    }
  };

  const gecmisAramayiSil = (kelime: string) => {
    const yeni = sonAramalar.filter(k => k !== kelime);
    setSonAramalar(yeni);
    localStorage.setItem("sonAramalar", JSON.stringify(yeni));
  };

  return (
    <>
      <header className="bg-[#050814]/90 backdrop-blur-md border-b border-gray-800 sticky top-0 z-[40] w-full transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">

            {/* SOL: LOGO VE HAMBURGER */}
            <div className="flex-shrink-0 flex items-center gap-4">
              <button className="md:hidden text-white" onClick={() => setMenuAcik(!menuAcik)}>
                 <span className={"block w-6 h-0.5 bg-white transition-all " + (menuAcik ? "rotate-45 translate-y-1.5" : "")}></span>
                 <span className={"block w-6 h-0.5 bg-white mt-1 transition-all " + (menuAcik ? "opacity-0" : "")}></span>
                 <span className={"block w-6 h-0.5 bg-white mt-1 transition-all " + (menuAcik ? "-rotate-45 -translate-y-1.5" : "")}></span>
              </button>
              <Link href="/" prefetch={true} className="text-white font-black text-xl md:text-2xl tracking-tight flex items-center">
                BİLGİN <span className="text-[#00d2ff] ml-1">PC</span>
              </Link>
            </div>

            {/* SAĞ: ARAMA İKONU, HESABIM & SEPET */}
            <div className="flex items-center space-x-2 md:space-x-4 shrink-0">
              
              {/* 🔥 ÜSTTEKİ YENİ BÜYÜTEÇ BUTONU 🔥 */}
              <button onClick={() => setAramaAcik(true)} className="flex items-center justify-center w-10 h-10 md:w-auto md:h-10 md:px-4 md:space-x-2 rounded-xl text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
                <Search className="w-5 h-5 md:w-4 md:h-4 text-[#00d2ff]" />
                <span className="hidden md:block text-xs font-bold uppercase text-gray-400">Ürün Ara...</span>
              </button>

              <div ref={hesabimRef} className="relative hidden sm:block">
                <button onClick={() => setHesabimAcik(!hesabimAcik)} className="flex items-center justify-center h-10 px-3 space-x-2 rounded-xl text-gray-300 hover:text-white bg-white/5 border border-white/10 transition-colors">
                  <span className="text-xs font-bold uppercase">{session?.user?.name ? session.user.name.split(" ")[0] : "Hesabım"}</span>
                </button>
                {hesabimAcik && (
                  <div className="absolute top-full right-0 mt-3 w-48 bg-[#09090b] border border-white/10 rounded-2xl shadow-2xl p-2 z-[60]">
                    <Link href="/siparislerim" className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl text-sm">Siparişlerim</Link>
                  </div>
                )}
              </div>

              <Link href="/sepet" className="relative flex items-center justify-center w-10 h-10 md:w-auto md:h-10 md:px-4 md:space-x-2 rounded-xl text-gray-300 hover:text-white bg-white/5 border border-white/10">
                <svg className="w-5 h-5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                {sepetAdedi > 0 && <span className="absolute -top-1 -right-1 bg-[#00d2ff] text-black text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full">{sepetAdedi}</span>}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* 🔥 RAZER STYLE TAM EKRAN ARAMA MODALI 🔥 */}
      {aramaAcik && (
        <div className="fixed inset-0 z-[100] bg-[#09090b]/95 backdrop-blur-xl flex flex-col overflow-hidden animate-in fade-in duration-200">
          
          {/* Üst Arama Barı */}
          <div className="p-4 md:p-6 border-b border-white/10 flex items-center gap-3">
            <form onSubmit={handleAramaSubmit} className="relative w-full max-w-4xl mx-auto flex-1">
              <button type="submit" className="absolute inset-y-0 left-0 pl-4 flex items-center z-10">
                <Search className="w-5 h-5 text-[#00d2ff]" />
              </button>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Ürün, Marka veya Kategori Ara..."
                value={aramaMetni}
                onChange={(e) => setAramaMetni(e.target.value)}
                className="w-full h-14 bg-white/5 border border-white/10 focus:border-[#00d2ff] focus:bg-[#121212] rounded-2xl pl-12 pr-12 text-lg text-white placeholder-gray-500 outline-none transition-all shadow-[0_0_20px_rgba(0,210,255,0.05)] focus:shadow-[0_0_30px_rgba(0,210,255,0.15)]"
              />
              {aramaMetni && (
                <button type="button" onClick={() => setAramaMetni("")} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white z-10">
                  <X className="w-5 h-5" />
                </button>
              )}
            </form>
            <button onClick={() => setAramaAcik(false)} className="md:hidden text-gray-400 hover:text-white p-2">
              İptal
            </button>
          </div>

          {/* İçerik Alanı (Kaydırılabilir) */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-4xl mx-auto w-full pb-32">
            
            {/* EĞER YAZI YAZILDIYSA: CANLI SONUÇLAR */}
            {aramaMetni.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  {aramaYukleniyor ? <Loader2 className="w-4 h-4 animate-spin text-[#00d2ff]" /> : <Search className="w-4 h-4" />}
                  Arama Sonuçları
                </h3>
                
                {canliSonuclar.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {canliSonuclar.map((urun) => (
                      <Link key={urun._id} href={"/product/" + urun.slug} onClick={() => setAramaAcik(false)} className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#00d2ff]/30 rounded-2xl transition-all group">
                        <div className="w-16 h-16 bg-black/50 rounded-xl p-2 flex shrink-0 items-center justify-center">
                          <img src={urun.resim} alt={urun.isim} className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-white line-clamp-2 leading-snug mb-1">{urun.isim}</span>
                          <span className="text-lg font-black text-[#00d2ff]">{Number(urun.fiyat).toLocaleString("tr-TR")} ₺</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  !aramaYukleniyor && <div className="text-center py-10 text-gray-500">Ürün bulunamadı.</div>
                )}
                
                {canliSonuclar.length > 0 && (
                  <button onClick={() => handleAramaSubmit()} className="w-full mt-4 flex items-center justify-center gap-2 py-4 bg-[#00d2ff]/10 hover:bg-[#00d2ff] text-[#00d2ff] hover:text-black rounded-2xl font-black uppercase text-xs tracking-widest transition-colors">
                    Tüm Sonuçlara Git <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            ) : (
              /* EĞER YAZI YOKSA: POPÜLER, SON ARAMALAR VE VİTRİN */
              <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-300">
                
                {/* Popüler Kelimeler (Pill Buttons) */}
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                    <Flame className="w-4 h-4 text-[#00d2ff]" /> POPÜLER KELİMELER
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {POPULER_KELIMELER.map((kelime) => (
                      <button key={kelime} onClick={() => handleAramaSubmit(undefined, kelime)} className="px-4 py-2 bg-white/5 border border-white/10 hover:border-[#00d2ff]/50 hover:bg-[#00d2ff]/10 text-gray-300 hover:text-white rounded-full text-sm transition-all whitespace-nowrap">
                        {kelime}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Son Aramalar (Geçmiş) */}
                {sonAramalar.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                      <Clock className="w-4 h-4" /> SON ARAMALAR
                    </h3>
                    <div className="flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                      {sonAramalar.map((kelime, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => handleAramaSubmit(undefined, kelime)}>
                          <span className="text-gray-300 group-hover:text-[#00d2ff]">"{kelime}"</span>
                          <button onClick={(e) => { e.stopPropagation(); gecmisAramayiSil(kelime); }} className="text-gray-500 hover:text-red-500 p-1">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* EN ÇOK SATANLAR (Gerçek Vitrin) */}
                {populerUrunler.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">EN ÇOK SATANLAR</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {populerUrunler.map((urun) => (
                        <Link key={urun._id} href={"/product/" + urun.slug} onClick={() => setAramaAcik(false)} className="bg-[#121212] border border-white/5 hover:border-[#00d2ff]/30 p-3 rounded-2xl group transition-colors flex flex-col">
                          <div className="aspect-square bg-black/40 rounded-xl mb-3 flex items-center justify-center p-2">
                             <img src={urun.resim} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform" />
                          </div>
                          <h4 className="text-xs text-gray-300 font-medium line-clamp-2 flex-1 mb-2">{urun.isim}</h4>
                          <span className="text-sm font-black text-white">{Number(urun.fiyat).toLocaleString("tr-TR")} ₺</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}