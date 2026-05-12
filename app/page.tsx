"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [urunler, setUrunler] = useState<any[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hataVarMi, setHataVarMi] = useState(false);

  useEffect(() => {
    let aktif = true;

    async function urunleriGetir() {
      try {
        setHataVarMi(false);
        // Telefonların ve PC'nin aynı adresi tanıması için dinamik köprü
        const apiUrl = window.location.origin + '/api/products?t=' + Date.now();
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: { 'Cache-Control': 'no-cache' }
        });

        if (!response.ok) throw new Error("API Baglanti Hatasi");

        const data = await response.json();

        if (aktif) {
          if (Array.isArray(data) && data.length > 0) {
            const formatliUrunler = data.map((item: any) => ({
              id: item.id,
              ad: item.name,
              fiyat: item.price ? Number(item.price).toLocaleString('tr-TR') + " TL" : "Fiyat Sorunuz",
              resim: item.images?.[0]?.src || "https://via.placeholder.com/300?text=Bilgin+PC",
              ozellik: item.short_description ? item.short_description.replace(/<[^>]*>?/gm, '').substring(0, 60) + "..." : "Sistem özellikleri için tıklayın."
            }));
            setUrunler(formatliUrunler);
          } else {
            setUrunler([]);
          }
        }
      } catch (error) {
        console.error("Hata Detayi:", error);
        if (aktif) setHataVarMi(true);
      } finally {
        if (aktif) setYukleniyor(false);
      }
    }

    urunleriGetir();
    return () => { aktif = false; };
  }, []);

  return (
    <div className="bg-[#0b1120] min-h-screen text-white font-sans selection:bg-blue-500/30 flex flex-col">
      
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-6 md:px-10 py-4 border-b border-white/5 sticky top-0 bg-[#0b1120]/90 backdrop-blur-xl z-50">
        <div className="flex items-center gap-4 md:gap-8">
          <button className="p-2 hover:bg-white/5 rounded-xl transition-all">
            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-lg md:text-xl font-black tracking-tighter uppercase italic">
            BİLGİN <span className="text-blue-600 underline decoration-2 underline-offset-4">PC MARKET</span>
          </span>
        </div>
        <button className="bg-white/5 border border-white/10 px-6 py-2 rounded-full text-[10px] font-black uppercase hover:bg-blue-600 transition-all">
          GİRİŞ YAP
        </button>
      </nav>

      <main className="flex-grow">
        {/* HERO */}
        <section className="relative px-6 py-10 md:py-24 max-w-[1300px] mx-auto overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="z-10 space-y-6 text-center lg:text-left order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-1.5 rounded-full">
                <span className="text-blue-500 animate-pulse text-xs">●</span>
                <span className="text-[10px] font-black uppercase tracking-widest">PREMİUM DONANIM HATTI</span>
              </div>
              <h1 className="text-4xl md:text-7xl font-black leading-[1.1] tracking-tighter uppercase">
                SAF <span className="text-blue-600">GÜÇ</span><br />
                <span className="text-white/90 font-extrabold">LABORATUVARI.</span>
              </h1>
              <p className="text-slate-400 text-sm md:text-lg max-w-lg mx-auto lg:mx-0 font-medium">
                Bilgin PC Market güvencesiyle donanım dünyasının zirvesini keşfedin. Performansı doruklarda yaşayın.
              </p>
              <button className="bg-blue-600 px-10 py-5 rounded-2xl font-black text-xs uppercase shadow-2xl shadow-blue-600/40 active:scale-95 transition-all">
                VİTRİNİ KEŞFET
              </button>
            </div>
            <div className="relative order-1 lg:order-2 flex justify-center items-center">
              <div className="absolute inset-0 bg-blue-600/20 blur-[100px] rounded-full scale-75"></div>
              <div className="relative z-10 w-full max-w-[320px] md:max-w-[500px] text-center text-9xl animate-bounce duration-[3000ms]">🖥️</div>
            </div>
          </div>
        </section>

        {/* ÜRÜN VİTRİNİ */}
        <section className="px-6 py-20 bg-white/[0.02] border-y border-white/5">
          <div className="max-w-[1300px] mx-auto">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl font-black tracking-tighter uppercase italic text-white">ÖNE ÇIKAN <span className="text-blue-600">CANAVARLAR</span></h2>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2 italic">Doğrudan Stoktan Canlı Veri</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {yukleniyor ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/5 p-6 rounded-[2rem] animate-pulse">
                    <div className="h-48 bg-white/10 rounded-2xl mb-6"></div>
                    <div className="h-6 bg-white/10 rounded mb-4 w-3/4"></div>
                    <div className="h-4 bg-white/10 rounded mb-2 w-full"></div>
                    <div className="h-10 w-full bg-white/10 rounded-xl mt-4"></div>
                  </div>
                ))
              ) : hataVarMi ? (
                <div className="col-span-full py-12 text-center border-2 border-dashed border-blue-900/30 rounded-[2rem]">
                  <p className="text-blue-400 font-black uppercase tracking-widest text-sm">Baglanti Hatasi: Veriler cekilemedi.</p>
                  <button onClick={() => window.location.reload()} className="mt-4 text-xs bg-white/5 px-4 py-2 rounded-lg font-bold">TEKRAR DENE</button>
                </div>
              ) : urunler.length > 0 ? (
                urunler.map((pc) => (
                  <Link href={`/product/${pc.id}`} key={pc.id} className="group bg-[#0b1120] border border-white/5 p-6 rounded-[2rem] hover:border-blue-600/50 transition-all flex flex-col h-full active:scale-[0.98]">
                    <div className="h-48 bg-white/5 rounded-2xl mb-6 overflow-hidden flex items-center justify-center relative">
                      <img src={pc.resim} alt={pc.ad} className="absolute w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <h3 className="font-black text-lg mb-2 uppercase tracking-tighter line-clamp-2">{pc.ad}</h3>
                    <div className="mb-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest flex-grow">{pc.ozellik}</div>
                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/5">
                      <span className="text-blue-500 font-black text-lg">{pc.fiyat}</span>
                      <div className="bg-white/5 p-3 rounded-xl group-hover:bg-blue-600 transition-all text-white">🛒</div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center py-20 text-slate-500 font-bold uppercase tracking-widest">Henüz öne çıkan ürün bulunmuyor.</div>
              )}
            </div>
          </div>
        </section>

        {/* SOSYAL & KURUMSAL HUB */}
        <section className="px-6 py-20">
          <div className="max-w-[1300px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: "Hakkımızda", path: "/hakkimizda", icon: "📄" },
                { title: "Gizlilik Politikası", path: "/gizlilik-politikasi", icon: "🔒" },
                { title: "Mesafeli Satış", path: "/mesafeli-satis", icon: "📝" },
                { title: "İade Şartları", path: "/iade-sartlari", icon: "🔄" },
                { title: "Garanti Şartları", path: "/garanti-sartlari", icon: "🛡️" },
                { title: "İletişim", path: "/iletisim", icon: "📞" }
              ].map((item, idx) => (
                <Link key={idx} href={item.path} className="flex items-center gap-3 p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-blue-600/10 transition-all group">
                  <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-slate-300">{item.title}</span>
                </Link>
              ))}
            </div>
            <div className="space-y-4">
              <a href="https://wa.me/905327345023" className="flex items-center justify-between p-6 bg-green-500/10 border border-green-500/20 rounded-3xl hover:bg-green-500 transition-all group">
                <div className="flex items-center gap-4">
                  <span className="bg-green-500 text-white p-2 rounded-xl group-hover:bg-white group-hover:text-green-500">💬</span>
                  <div className="text-left font-black"><p className="text-[10px] opacity-70">WHATSAPP</p><p className="text-lg group-hover:text-white">CANLI DESTEK</p></div>
                </div>
                <span className="text-2xl text-green-500 group-hover:text-white">→</span>
              </a>
              <a href="tel:08503055968" className="flex items-center justify-between p-6 bg-blue-500/10 border border-blue-500/20 rounded-3xl hover:bg-blue-600 transition-all group">
                <div className="flex items-center gap-4 text-blue-500 group-hover:text-white">
                  <span className="bg-blue-500 text-white p-2 rounded-xl group-hover:bg-white group-hover:text-blue-500">📞</span>
                  <div className="text-left font-black"><p className="text-[10px] opacity-70">MÜŞTERİ HATTI</p><p className="text-lg">0850 305 59 68</p></div>
                </div>
              </a>
              <a href="https://instagram.com/bilgin_pc_market" className="block w-full p-[2px] rounded-3xl bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600">
                 <div className="bg-[#0b1120] hover:bg-transparent rounded-[22px] p-4 flex items-center justify-center gap-3 transition-all font-black text-white italic">📸 BİLGİN_PC_INSTAGRAM</div>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-8 px-6 text-center text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">
        © 2026 BİLGİN PC MARKET – PERFORMANS BURADA BAŞLAR.
      </footer>
    </div>
  );
}