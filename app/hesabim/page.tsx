"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User, ShieldCheck, CreditCard, Package, LogOut, Server, Truck, Star, MapPin, Loader2, ChevronLeft, ChevronRight } from "lucide-react";

export default function HesabimPage() {
  const { data: session } = useSession();
  
  // 🧠 CANLI VERİ VE ANALİZ MOTORLARI
  const [hamSiparisler, setHamSiparisler] = useState<any[]>([]);
  const [sonSiparislerListesi, setSonSiparislerListesi] = useState<any[]>([]);
  const [grafikVerisi, setGrafikVerisi] = useState<any[]>([]);
  
  // 🍩 HARCAMA DAĞILIMI (PASTA) MOTORU STATE'LERİ
  const [pastaVerisi, setPastaVerisi] = useState({
    kendinTopla: { tutar: 0, yuzde: 0, offset: 0 },
    bilesen: { tutar: 0, yuzde: 0, offset: 0 },
    cevre: { tutar: 0, yuzde: 0, offset: 0 },
    sistem: { tutar: 0, yuzde: 0, offset: 0 },
    aksesuar: { tutar: 0, yuzde: 0, offset: 0 },
    toplam: 0
  });
  
  const suAnkiTarih = new Date();
  const [seciliYil, setSeciliYil] = useState<number>(suAnkiTarih.getFullYear());
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tiklananAy, setTiklananAy] = useState<number | null>(suAnkiTarih.getMonth());
  const [loading, setLoading] = useState(true);

  const handleCikisYap = async () => {
    localStorage.removeItem("bilgin_kayitli_sistemler");
    sessionStorage.removeItem("bilgin_hesabim_data");
    await signOut({ callbackUrl: "/" });
  };

  // 🚀 1. AŞAMA: VERİ ÇEKME
  useEffect(() => {
    if (!session?.user?.email) {
      setLoading(false);
      return;
    }

    const verileriGetir = async () => {
      try {
        const res = await fetch("/api/orders?t=" + new Date().getTime(), { 
          cache: "no-store",
          headers: { "Cache-Control": "no-cache", "Pragma": "no-cache" }
        });
        const data = await res.json();
        if (res.ok && data.orders) {
          const benimSiparislerim = data.orders.filter((siparis: any) => {
            const siparisMaili = siparis.userEmail || siparis.email || siparis.musteri?.eposta || siparis.musteri?.email || "";
            return siparisMaili.toLowerCase() === (session?.user?.email || "").toLowerCase();
          });
          setHamSiparisler(benimSiparislerim);
        }
      } catch (error) {
        console.error("Veri çekme hatası:", error);
      } finally {
        setLoading(false);
      }
    };
    verileriGetir();
  }, [session]);

  // 🚀 2. AŞAMA: ANALİZ VE HESAPLAMA MOTORU
  useEffect(() => {
    if (!hamSiparisler || hamSiparisler.length === 0) return;

    // --- A) LİSTE VE ÇUBUK GRAFİK HESABI ---
    const sirali = [...hamSiparisler].sort((a: any, b: any) => new Date(b.createdAt || b.tarih).getTime() - new Date(a.createdAt || a.tarih).getTime());
    setSonSiparislerListesi(sirali.slice(0, 6));

    const aylar = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
    const aylikToplamlar = new Array(12).fill(0);
    
    // --- B) HARCAMA DAĞILIMI (PASTA) HESABI ---
    let kat = { kendinTopla: 0, bilesen: 0, cevre: 0, sistem: 0, aksesuar: 0, toplamGenel: 0 };

    hamSiparisler.forEach((siparis: any) => {
      const d = new Date(siparis.createdAt || siparis.tarih);
      const tutar = Number(siparis.totalPrice || siparis.toplamTutar) || 0;
      
      // Çubuk Grafik İçin
      if (d.getFullYear() === seciliYil) {
        aylikToplamlar[d.getMonth()] += tutar;
      }

      // Pasta İçin (Sepet içindeki her ürünü kategorisine göre ayırır)
      const urunler = siparis.items || siparis.sepet || [];
      urunler.forEach((item: any) => {
        const ad = (item.isim || item.title || "").toLowerCase();
        const cat = (item.kategori || "").toLowerCase();
        const itemTutar = (Number(item.fiyat || item.price) * (item.adet || item.quantity)) || 0;

        if (ad.includes("topla") || ad.includes("sihirbaz") || cat.includes("kendin")) {
          kat.kendinTopla += itemTutar;
        } else if (cat.includes("bileşen") || ad.includes("ekran kartı") || ad.includes("işlemci") || ad.includes("ram") || ad.includes("anakart")) {
          kat.bilesen += itemTutar;
        } else if (cat.includes("çevre") || cat.includes("oyuncu") || ad.includes("mouse") || ad.includes("klavye") || ad.includes("kulaklık")) {
          kat.cevre += itemTutar;
        } else if (cat.includes("sistem") || cat.includes("laptop") || ad.includes("dizüstü") || cat.includes("yazılım")) {
          kat.sistem += itemTutar;
        } else {
          kat.aksesuar += itemTutar;
        }
        kat.toplamGenel += itemTutar;
      });
    });

    // Yüzdeleri ve SVG Offsetleri Hesapla
    const hesaplaYuzde = (tutar: number) => kat.toplamGenel > 0 ? (tutar / kat.toplamGenel) * 100 : 0;
    
    const p1 = hesaplaYuzde(kat.kendinTopla);
    const p2 = hesaplaYuzde(kat.bilesen);
    const p3 = hesaplaYuzde(kat.cevre);
    const p4 = hesaplaYuzde(kat.sistem);
    const p5 = hesaplaYuzde(kat.aksesuar);

    setPastaVerisi({
      kendinTopla: { tutar: kat.kendinTopla, yuzde: Math.round(p1), offset: 0 },
      bilesen: { tutar: kat.bilesen, yuzde: Math.round(p2), offset: p1 },
      cevre: { tutar: kat.cevre, yuzde: Math.round(p3), offset: p1 + p2 },
      sistem: { tutar: kat.sistem, yuzde: Math.round(p4), offset: p1 + p2 + p3 },
      aksesuar: { tutar: kat.aksesuar, yuzde: Math.round(p5), offset: p1 + p2 + p3 + p4 },
      toplam: kat.toplamGenel
    });

    // Çubuk Grafik Yüzdeleri
    const maxTutar = Math.max(...aylikToplamlar);
    setGrafikVerisi(aylikToplamlar.map((t, i) => ({
      etiket: aylar[i],
      yuzde: maxTutar > 0 && t > 0 ? Math.max((t / maxTutar) * 100, 5) : 2,
      tutar: t
    })));

  }, [hamSiparisler, seciliYil]);

  const userName = session?.user?.name || "Özkan";
  const userEmail = session?.user?.email || "";
  const basHarf = userName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-[#00d2ff] blur-[250px] opacity-[0.05] pointer-events-none rounded-full"></div>

      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-6 relative z-10">

        {/* ⬅️ SOL MENÜ */}
        <div className="w-full lg:w-64 shrink-0 flex flex-col gap-2">
          <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 shadow-xl">
            <nav className="flex flex-col gap-1.5">
              <Link href="/hesabim" className="flex items-center gap-3 px-4 py-3.5 bg-white/[0.05] border border-white/10 rounded-xl text-white font-bold shadow-inner"><User className="w-5 h-5 text-cyan-400" /> Profil</Link>
              <Link href="/hesabim" className="flex items-center gap-3 px-4 py-3.5 text-slate-400 hover:text-white hover:bg-white/[0.02] rounded-xl transition-all font-medium"><CreditCard className="w-5 h-5" /> Ödeme</Link>
              <Link href="/hesabim" className="flex items-center gap-3 px-4 py-3.5 text-slate-400 hover:text-white hover:bg-white/[0.02] rounded-xl transition-all font-medium"><ShieldCheck className="w-5 h-5" /> Güvenlik</Link>
            </nav>
          </div>
        </div>

        {/* ➡️ SAĞ TARAF */}
        <div className="flex-1 flex flex-col min-w-0 gap-6">

          {/* 🏆 NEON PROFİL KARTI */}
          <div className="relative rounded-[2rem] p-[2px] bg-gradient-to-r from-cyan-500/30 via-[#0f172a] to-cyan-500/10 shadow-[0_0_50px_rgba(0,210,255,0.15)]">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-transparent opacity-20 blur-xl rounded-[2rem]"></div>
            <div className="relative bg-[#0b1121] rounded-[2rem] p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 border border-cyan-500/20 overflow-hidden z-10">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-slate-600 to-slate-900 border-[3px] border-slate-700"></div>
                <div className="absolute inset-2.5 rounded-full border border-cyan-400/30 shadow-[0_0_20px_rgba(34,211,255,0.4)] animate-[spin_8s_linear_infinite]"></div>
                <div className="absolute inset-4 bg-[#020617] rounded-full flex items-center justify-center">
                  <span className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-cyan-100 to-cyan-500 drop-shadow-[0_0_15px_rgba(34,211,255,0.8)]">{basHarf}</span>
                </div>
              </div>
              <div className="flex-1 text-center sm:text-left z-10">
                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">{userName}</h1>
                <p className="text-slate-400 text-sm sm:text-base font-medium tracking-wide">{userEmail}</p>
              </div>
              <button onClick={handleCikisYap} className="relative z-10 flex items-center gap-2 px-6 py-3.5 rounded-xl bg-red-950/40 border border-red-900/50 text-red-400 hover:bg-red-900/60 font-bold uppercase text-xs transition-all"><LogOut className="w-4 h-4" /> Çıkış</button>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">

            {/* 🔥 SON İŞLEMLER */}
            <div className="xl:col-span-1 flex flex-col">
              <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col min-h-[450px] xl:h-[550px]">
                <h3 className="text-white font-bold text-lg mb-6 relative z-10">Son İşlemler</h3>
                <div className="space-y-3 relative z-10 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">
                  {sonSiparislerListesi.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center gap-3 py-3 border-b border-white/5 last:border-0 rounded-xl px-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-bold text-[13px] truncate mb-0.5">{item.items?.[0]?.isim || "Sipariş"}</p>
                        <p className="text-slate-500 text-[11px]">{new Date(item.createdAt || item.tarih).toLocaleDateString("tr-TR")}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-white font-black text-[13px] mb-1">{Number(item.totalPrice || item.toplamTutar).toLocaleString("tr-TR")} ₺</p>
                        <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">{item.status || item.durum || "Süreçte"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 📊 GRAFİKLER SÜTUNU */}
            <div className="xl:col-span-2 flex flex-col gap-6">
              
              {/* 1. SİPARİŞ GEÇMİŞİ (ÇUBUK) */}
              <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col">
                <div className="flex row items-center justify-between mb-4">
                  <h3 className="text-white font-bold text-base">Harcama Grafiği</h3>
                  <div className="flex items-center gap-2 bg-slate-800/30 border border-slate-700/50 rounded-lg px-2 py-1">
                    <button onClick={() => setSeciliYil(y => y - 1)} className="p-1 text-slate-400 hover:text-cyan-400"><ChevronLeft className="w-3.5 h-3.5" /></button>
                    <span className="text-[11px] font-black text-slate-200 w-8 text-center">{seciliYil}</span>
                    <button onClick={() => setSeciliYil(y => y + 1)} className="p-1 text-slate-400 hover:text-cyan-400" disabled={seciliYil >= suAnkiTarih.getFullYear()}><ChevronRight className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                <div className="bg-white/[0.02] border border-white/5 rounded-xl flex items-end justify-between pt-10 pb-4 px-1 sm:px-4 h-[220px] relative mt-2">
                  {grafikVerisi.map((item, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end h-full relative select-none" onClick={() => setTiklananAy(i)}>
                      {(hoveredIndex === i || tiklananAy === i) && item.tutar > 0 && (
                        <div className="absolute bottom-[105%] bg-[#090f1e] border border-cyan-500 text-cyan-400 font-black text-[10px] px-2 py-1 rounded shadow-lg z-50">
                          {item.tutar.toLocaleString("tr-TR")} ₺
                        </div>
                      )}
                      <div className="w-full flex items-end justify-center h-[140px]">
                        <div className={`w-full max-w-[32px] rounded-t-sm transition-all duration-500 ${tiklananAy === i ? 'bg-gradient-to-b from-cyan-300 to-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'bg-gradient-to-b from-slate-600 to-slate-800 hover:from-cyan-400'}`} style={{ height: `${item.yuzde}%` }}></div>
                      </div>
                      <span className={`text-[9px] font-black mt-2 uppercase ${tiklananAy === i ? 'text-cyan-400' : 'text-slate-500'}`}>{item.etiket}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. HARCAMA DAĞILIMI (GERÇEK PASTA) */}
              <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-center gap-8">
                <div className="shrink-0 space-y-1.5 text-center sm:text-left">
                  <h3 className="text-white font-bold text-base">Harcama Dağılımı</h3>
                  <p className="text-[10px] text-slate-500">Kategorik harcama analizi</p>
                </div>
                <div className="flex-1 flex flex-col sm:flex-row items-center justify-center sm:justify-end gap-10 w-full">
                  {/* CANLI SVG PASTA */}
                  <div className="relative w-32 h-32 shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 42 42">
                      <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="5"></circle>
                      {/* Her dilim, bir öncekinin offseti kadar dönerek çizilir */}
                      <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f59e0b" strokeWidth="5" strokeDasharray={`${pastaVerisi.kendinTopla.yuzde} ${100 - pastaVerisi.kendinTopla.yuzde}`} strokeDashoffset={-pastaVerisi.kendinTopla.offset}></circle>
                      <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#06b6d4" strokeWidth="5" strokeDasharray={`${pastaVerisi.bilesen.yuzde} ${100 - pastaVerisi.bilesen.yuzde}`} strokeDashoffset={-pastaVerisi.bilesen.offset}></circle>
                      <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#fb7185" strokeWidth="5" strokeDasharray={`${pastaVerisi.cevre.yuzde} ${100 - pastaVerisi.cevre.yuzde}`} strokeDashoffset={-pastaVerisi.cevre.offset}></circle>
                      <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#c084fc" strokeWidth="5" strokeDasharray={`${pastaVerisi.sistem.yuzde} ${100 - pastaVerisi.sistem.yuzde}`} strokeDashoffset={-pastaVerisi.sistem.offset}></circle>
                      <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#34d399" strokeWidth="5" strokeDasharray={`${pastaVerisi.aksesuar.yuzde} ${100 - pastaVerisi.aksesuar.yuzde}`} strokeDashoffset={-pastaVerisi.aksesuar.offset}></circle>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center mt-1">
                      <span className="text-xl font-black text-white">{Math.max(pastaVerisi.kendinTopla.yuzde, pastaVerisi.bilesen.yuzde, pastaVerisi.cevre.yuzde, pastaVerisi.sistem.yuzde, pastaVerisi.aksesuar.yuzde)}%</span>
                    </div>
                  </div>
                  {/* KATEGORİ ETİKETLERİ */}
                  <div className="flex flex-col gap-2 shrink-0">
                    <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500"></span><span className="text-[11px] text-slate-300 font-bold">Kendin Topla: {pastaVerisi.kendinTopla.yuzde}%</span></div>
                    <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cyan-500"></span><span className="text-[11px] text-slate-300">Bileşenler: {pastaVerisi.bilesen.yuzde}%</span></div>
                    <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-rose-500"></span><span className="text-[11px] text-slate-300">Çevre Bir. & Oyuncu: {pastaVerisi.cevre.yuzde}%</span></div>
                    <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500"></span><span className="text-[11px] text-slate-300">Sistem & Laptop: {pastaVerisi.sistem.yuzde}%</span></div>
                    <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span><span className="text-[11px] text-slate-300">Aksesuar & Kablo: {pastaVerisi.aksesuar.yuzde}%</span></div>
                  </div>
                </div>
              </div>

              {/* 3. METRİKLER (4'LÜ KUTU) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Link href="/adreslerim" className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col items-center gap-1.5 transition-all hover:border-cyan-500/30">
                  <MapPin className="w-6 h-6 text-cyan-400" /><p className="text-xl font-black">2</p><p className="text-[9px] text-slate-500 font-black uppercase">Adresler</p>
                </Link>
                <Link href="/siparis-takip" className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col items-center gap-1.5 transition-all hover:border-rose-500/30">
                  <Truck className="w-6 h-6 text-rose-400" /><p className="text-xl font-black">{hamSiparisler.filter(s => s.status?.toLowerCase().includes("kargo") || s.durum?.toLowerCase().includes("kargo")).length}</p><p className="text-[9px] text-slate-500 font-black uppercase">Kargolar</p>
                </Link>
                <Link href="/favorilerim" className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col items-center gap-1.5 transition-all hover:border-purple-500/30">
                  <Star className="w-6 h-6 text-purple-400" /><p className="text-xl font-black">12</p><p className="text-[9px] text-slate-500 font-black uppercase">Favoriler</p>
                </Link>
                <Link href="/sistemlerim" className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col items-center gap-1.5 transition-all hover:border-emerald-500/30">
                  <Server className="w-6 h-6 text-emerald-400" /><p className="text-xl font-black">3</p><p className="text-[9px] text-slate-500 font-black uppercase">Sistemler</p>
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}