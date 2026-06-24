"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { 
  User, ShieldCheck, CreditCard, LogOut, Headset, 
  PlusCircle, MessageSquare, CheckCircle2, Clock, 
  AlertCircle, ChevronRight, PackageX, Wrench, Send, X, Loader2
} from "lucide-react";

export default function DestekIadePage() {
  const { data: session, status } = useSession();
  const [yukleniyor, setYukleniyor] = useState(true);
  
  // MODAL VE TAB STATE'LERİ
  const [yeniTalepModal, setYeniTalepModal] = useState(false);
  const [aktifTab, setAktifTab] = useState<'acik' | 'gecmis'>('acik');
  const [talepGonderiliyor, setTalepGonderiliyor] = useState(false);

  // FORM STATE'LERİ
  const [talepKonusu, setTalepKonusu] = useState("");
  const [talepMesaji, setTalepMesaji] = useState("");

  // SAHTE VERİ MOTORU (Sistemi kurana kadar görsel şölen için)
  const [talepler, setTalepler] = useState([
    {
      id: "DST-847291",
      konu: "İade Talebi (Vazgeçme)",
      urun: "ASUS ROG Strix G16 Laptop",
      durum: "İnceleniyor", // İşlemde, Kargo Bekleniyor, Çözüldü
      tarih: "24 Haziran 2026",
      sonGuncelleme: "2 saat önce",
      tip: "iade"
    },
    {
      id: "DST-847155",
      konu: "Teknik Destek",
      urun: "Intel Core i5 14400F İşlemci",
      durum: "Yanıt Bekleniyor",
      tarih: "22 Haziran 2026",
      sonGuncelleme: "1 gün önce",
      tip: "teknik"
    },
    {
      id: "DST-839002",
      konu: "Kargo Gecikmesi",
      urun: "Sipariş #SP-106",
      durum: "Çözüldü",
      tarih: "10 Mayıs 2026",
      sonGuncelleme: "12 Mayıs 2026",
      tip: "kargo"
    }
  ]);

  useEffect(() => {
    // Giriş kontrolü (Gerçek sisteme bağladığında burayı API ile beslersin)
    if (status !== "loading") {
      setYukleniyor(false);
    }
  }, [status]);

  const handleCikisYap = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const handleTalepGonder = (e: React.FormEvent) => {
    e.preventDefault();
    if(!talepKonusu || !talepMesaji) return;
    
    setTalepGonderiliyor(true);
    // API simülasyonu
    setTimeout(() => {
      setTalepGonderiliyor(false);
      setYeniTalepModal(false);
      setTalepKonusu("");
      setTalepMesaji("");
      // Buraya tatlı bir toast mesajı eklenebilir
    }, 1500);
  };

  if (yukleniyor) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="w-16 h-16 border-4 border-slate-800 border-t-indigo-500 rounded-full animate-spin shadow-[0_0_30px_rgba(99,102,241,0.5)]"></div>
        <p className="mt-6 text-indigo-400 font-bold uppercase tracking-widest text-sm animate-pulse">Destek Ağına Bağlanılıyor...</p>
      </div>
    );
  }

  // SADECE GİRİŞ YAPANLAR GÖREBİLİR (Misafir Kontrolü)
  if (status === "unauthenticated") {
    if (typeof window !== "undefined") window.location.href = "/giris";
    return null;
  }

  const acikTalepler = talepler.filter(t => t.durum !== "Çözüldü");
  const gecmisTalepler = talepler.filter(t => t.durum === "Çözüldü");
  const gosterilenTalepler = aktifTab === 'acik' ? acikTalepler : gecmisTalepler;

  return (
    <>
      <div className="min-h-screen bg-[#020617] text-white font-sans p-4 sm:p-6 lg:p-8 relative overflow-clip">
        {/* ARKA PLAN İNDİGO PARLAMASI (Güven Veren Renk) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-indigo-600 blur-[250px] opacity-[0.07] pointer-events-none rounded-full"></div>

        <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-5 lg:gap-8 relative z-10 items-start">
          
          {/* ⬅️ SOL MENÜ (Standart ve Sabit) */}
          <div className="w-full lg:w-[280px] shrink-0 flex flex-col gap-2 static lg:sticky lg:top-28 z-10">
            <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-xl">
              <nav className="flex flex-col gap-1.5">
                <Link href="/hesabim" className="flex items-center gap-3 px-4 py-3 sm:py-3.5 text-sm sm:text-base text-slate-400 hover:text-white hover:bg-white/[0.02] rounded-xl transition-all font-medium">
                  <User className="w-4 h-4 sm:w-5 sm:h-5" /> Profil
                </Link>
                <Link href="/cuzdan" className="flex items-center gap-3 px-4 py-3 sm:py-3.5 text-sm sm:text-base text-slate-400 hover:text-white hover:bg-white/[0.02] rounded-xl transition-all font-medium">
                  <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" /> Dijital Cüzdanım
                </Link>
                <Link href="/guvenlik" className="flex items-center gap-3 px-4 py-3 sm:py-3.5 text-sm sm:text-base text-slate-400 hover:text-white hover:bg-white/[0.02] rounded-xl transition-all font-medium">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" /> Güvenlik
                </Link>
                <Link href="/destek-taleplerim" className="flex items-center gap-3 px-4 py-3 sm:py-3.5 bg-white/[0.05] border border-white/10 rounded-xl text-white font-bold shadow-inner transition-all text-sm sm:text-base">
                  <Headset className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" /> Destek & İade
                </Link>
              </nav>
            </div>
          </div>

          {/* ➡️ SAĞ İÇERİK (Destek Merkezi) */}
          <div className="flex-1 flex flex-col min-w-0 gap-5 lg:gap-6 w-full">
            
            {/* HERO ALANI */}
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 sm:p-6 lg:p-8 shadow-xl relative overflow-hidden group flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/10 blur-[60px] pointer-events-none rounded-full"></div>
              
              <div className="flex items-center gap-3 sm:gap-4 relative z-10">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#020617] border border-indigo-500/30 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.2)] shrink-0">
                  <Headset className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-400" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight mb-0.5 sm:mb-1">Destek Çözüm Merkezi</h1>
                  <p className="text-indigo-400/80 text-xs sm:text-sm font-medium tracking-wide">Sorunlarınızı en hızlı şekilde çözmek için buradayız.</p>
                </div>
              </div>

              <button 
                onClick={() => setYeniTalepModal(true)}
                className="relative z-10 w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-black text-xs sm:text-sm uppercase tracking-widest transition-all shadow-[0_0_25px_rgba(99,102,241,0.3)] shrink-0"
              >
                <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5" /> YENİ TALEP
              </button>
            </div>

            {/* METRİKLER (Kurumsal Duruş) */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-amber-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest">Açık İşlemler</span>
                </div>
                <p className="text-2xl sm:text-3xl font-black text-white">{acikTalepler.length}</p>
              </div>
              <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest">Çözülenler</span>
                </div>
                <p className="text-2xl sm:text-3xl font-black text-white">{gecmisTalepler.length}</p>
              </div>
              <div className="col-span-2 lg:col-span-1 bg-[#0f172a] border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col gap-2 relative overflow-hidden group">
                <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none"></div>
                <div className="flex items-center gap-2 text-indigo-400 relative z-10">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest">Ortalama Yanıt</span>
                </div>
                <p className="text-xl sm:text-2xl font-black text-white relative z-10">15 <span className="text-sm text-slate-400 font-medium">Dakika</span></p>
              </div>
            </div>

            {/* LİSTE ALANI */}
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl shadow-xl flex flex-col overflow-hidden">
              
              {/* TABLAR */}
              <div className="flex items-center border-b border-slate-800/80 p-2 sm:p-3">
                <button 
                  onClick={() => setAktifTab('acik')}
                  className={`flex-1 sm:flex-none px-6 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-black uppercase tracking-widest transition-all ${aktifTab === 'acik' ? 'bg-[#020617] text-indigo-400 shadow-inner border border-slate-800' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Açık Talepler
                </button>
                <button 
                  onClick={() => setAktifTab('gecmis')}
                  className={`flex-1 sm:flex-none px-6 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-black uppercase tracking-widest transition-all ${aktifTab === 'gecmis' ? 'bg-[#020617] text-indigo-400 shadow-inner border border-slate-800' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Geçmiş İşlemler
                </button>
              </div>

              {/* TALEPLER LİSTESİ */}
              <div className="flex flex-col p-3 sm:p-5 gap-3">
                {gosterilenTalepler.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 opacity-50">
                    <CheckCircle2 className="w-12 h-12 text-slate-500 mb-3" />
                    <p className="text-sm font-bold text-slate-400">Harika! Bekleyen hiçbir işleminiz yok.</p>
                  </div>
                ) : (
                  gosterilenTalepler.map((talep) => (
                    <div key={talep.id} className="bg-[#020617] border border-slate-800 hover:border-indigo-500/30 p-4 rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition-all group">
                      
                      <div className="flex items-start sm:items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${
                          talep.tip === 'iade' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
                          talep.tip === 'teknik' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                          'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        }`}>
                          {talep.tip === 'iade' ? <PackageX className="w-5 h-5" /> : 
                           talep.tip === 'teknik' ? <Wrench className="w-5 h-5" /> : 
                           <AlertCircle className="w-5 h-5" />}
                        </div>
                        
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs sm:text-sm font-bold text-white">{talep.konu}</span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-bold">{talep.id}</span>
                          </div>
                          <p className="text-[10px] sm:text-xs text-slate-400 truncate max-w-[250px] sm:max-w-md">{talep.urun}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 mt-2 sm:mt-0 border-t sm:border-0 border-slate-800 pt-3 sm:pt-0">
                        <div className="flex flex-col sm:items-end">
                          <span className={`text-[10px] font-black uppercase tracking-widest mb-1 ${
                            talep.durum === 'Çözüldü' ? 'text-emerald-400' : 
                            talep.durum === 'Yanıt Bekleniyor' ? 'text-amber-400' : 
                            'text-indigo-400'
                          }`}>
                            {talep.durum}
                          </span>
                          <span className="text-[9px] text-slate-500">{talep.tarih}</span>
                        </div>
                        <button className="w-8 h-8 rounded-lg bg-[#0f172a] border border-slate-700 flex items-center justify-center text-slate-400 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/30 group-hover:text-indigo-400 transition-colors">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 🚀 YENİ TALEP OLUŞTURMA MODALI */}
      {yeniTalepModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-blue-500"></div>
            
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
                <PlusCircle className="w-6 h-6 text-indigo-400" /> YENİ TALEP OLUŞTUR
              </h3>
              <button onClick={() => setYeniTalepModal(false)} className="text-slate-500 hover:text-white bg-[#020617] p-1.5 rounded-xl border border-slate-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTalepGonder} className="flex flex-col gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">İşlem Konusu</label>
                <select 
                  value={talepKonusu}
                  onChange={(e) => setTalepKonusu(e.target.value)}
                  className="w-full bg-[#020617] border border-slate-800 focus:border-indigo-500/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors appearance-none"
                  required
                >
                  <option value="" disabled>Lütfen bir konu seçin</option>
                  <option value="iade">Kolay İade İşlemi</option>
                  <option value="teknik">Teknik Destek / Arıza</option>
                  <option value="kargo">Kargo / Teslimat Sorunu</option>
                  <option value="diger">Diğer Konular</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Mesajınız</label>
                <textarea 
                  value={talepMesaji}
                  onChange={(e) => setTalepMesaji(e.target.value)}
                  placeholder="Sorununuzu veya talebinizi detaylıca açıklayın..."
                  className="w-full bg-[#020617] border border-slate-800 focus:border-indigo-500/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors min-h-[120px] resize-none"
                  required
                ></textarea>
              </div>

              <div className="bg-indigo-500/5 border border-indigo-500/10 p-3 rounded-xl flex gap-3 mt-2">
                <AlertCircle className="w-5 h-5 text-indigo-400 shrink-0" />
                <p className="text-[10px] sm:text-xs text-slate-400 font-medium leading-relaxed">
                  Talepleriniz ortalama 15 dakika içerisinde uzman ekibimiz tarafından yanıtlanmaktadır. İade işlemleri için kargo kodu tarafınıza iletilecektir.
                </p>
              </div>

              <button 
                type="submit" 
                disabled={talepGonderiliyor || !talepKonusu || !talepMesaji}
                className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-black text-sm uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(99,102,241,0.2)] disabled:opacity-50"
              >
                {talepGonderiliyor ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> İŞLENİYOR...</>
                ) : (
                  <><Send className="w-5 h-5" /> TALEBİ GÖNDER</>
                )}
              </button>
            </form>

          </div>
        </div>
      )}
    </>
  );
}