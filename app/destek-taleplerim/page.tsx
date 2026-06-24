"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { 
  User, ShieldCheck, CreditCard, Headset, 
  PlusCircle, MessageSquare, CheckCircle2, Clock, 
  AlertCircle, ChevronRight, ChevronDown, PackageX, Wrench, Send, X, Loader2, Trash2
} from "lucide-react";
import toast from "react-hot-toast";

export default function DestekIadePage() {
  const { data: session, status } = useSession();
  const sohbetSonuRef = useRef<HTMLDivElement>(null); 
  
  const [talepler, setTalepler] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const cirakHafizasi = localStorage.getItem("bilgin_destek_talepleri");
      if (cirakHafizasi) return JSON.parse(cirakHafizasi);
    }
    return [];
  });

  const [yukleniyor, setYukleniyor] = useState(() => {
    if (typeof window !== "undefined") {
      return !localStorage.getItem("bilgin_destek_talepleri");
    }
    return true;
  });
  
  const [yeniTalepModal, setYeniTalepModal] = useState(false);
  const [aktifTab, setAktifTab] = useState<'acik' | 'gecmis'>('acik');
  const [talepGonderiliyor, setTalepGonderiliyor] = useState(false);

  const [seciliTalepId, setSeciliTalepId] = useState<string | null>(null);
  const [cevapMesajlari, setCevapMesajlari] = useState<Record<string, string>>({});
  const [cevapGonderiliyor, setCevapGonderiliyor] = useState(false);

  const [talepKonusu, setTalepKonusu] = useState("");
  const [talepBaslik, setTalepBaslik] = useState("");
  const [talepMesaji, setTalepMesaji] = useState("");
  const [silinecekTalepId, setSilinecekTalepId] = useState<string | null>(null);

  // 🚀 BİNGO 1: MODAL AÇILINCA ARKA PLANI (SAYFAYI) DONDURAN MOTOR
  useEffect(() => {
    if (yeniTalepModal || silinecekTalepId) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }; // Sayfadan çıkarsa kilidi aç
  }, [yeniTalepModal, silinecekTalepId]);

  const talepleriGetir = async () => {
    if (!session?.user?.email) return;
    try {
      const res = await fetch("/api/destek?t=" + new Date().getTime(), { cache: "no-store" });
      const data = await res.json();
      if (res.ok && data.success) {
        const yeniDurum = JSON.stringify(data.talepler || []);
        const eskiDurum = localStorage.getItem("bilgin_destek_talepleri");
        
        if (eskiDurum !== yeniDurum) {
          setTalepler(data.talepler || []);
          localStorage.setItem("bilgin_destek_talepleri", yeniDurum);
        }
      }
    } catch (error) {} finally { setYukleniyor(false); }
  };

  useEffect(() => {
    if (status === "authenticated") {
      talepleriGetir(); 
      const radar = setInterval(talepleriGetir, 10000); 
      return () => clearInterval(radar); 
    } else if (status === "unauthenticated") {
      setYukleniyor(false);
    }
  }, [status]);

  useEffect(() => {
    if (seciliTalepId) {
      sohbetSonuRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [seciliTalepId, talepler]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("siparisNo")) {
        setTalepBaslik(params.get("siparisNo") || "");
        setTalepKonusu(params.get("konu") || "iade");
        setYeniTalepModal(true);
      }
    }
  }, [status]);

  const handleTalepGonder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!talepKonusu || !talepMesaji || !talepBaslik) return;
    
    setTalepGonderiliyor(true);
    const toastId = toast.loading("Destek talebiniz iletiliyor...");

    try {
      const res = await fetch("/api/destek", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ konu: talepKonusu, mesaj: `[Başlık: ${talepBaslik}]\n\n${talepMesaji}` })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Talebiniz başarıyla oluşturuldu! 🚀", { id: toastId });
        setYeniTalepModal(false);
        setTalepKonusu(""); setTalepBaslik(""); setTalepMesaji("");
        setTalepler(prev => {
          const yeniListe = [data.talep, ...prev];
          localStorage.setItem("bilgin_destek_talepleri", JSON.stringify(yeniListe));
          return yeniListe;
        });
      } else { toast.error(data.message || "Talep iletilemedi.", { id: toastId }); }
    } catch (error) { toast.error("Bağlantı hatası.", { id: toastId }); } 
    finally { setTalepGonderiliyor(false); }
  };

  const handleCevapGonder = async (talepId: string) => {
    const mesajMetni = cevapMesajlari[talepId];
    if (!mesajMetni?.trim()) return;
    
    setCevapGonderiliyor(true);
    const toastId = toast.loading("Cevabınız iletiliyor...");

    try {
      const res = await fetch("/api/destek", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ talepId, mesaj: mesajMetni })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Cevabınız iletildi!", { id: toastId });
        setCevapMesajlari(prev => ({...prev, [talepId]: ""})); 
        setTalepler(prev => {
          const yeniListe = prev.map(t => t._id === talepId ? data.talep : t);
          localStorage.setItem("bilgin_destek_talepleri", JSON.stringify(yeniListe));
          return yeniListe;
        });
      } else { toast.error(data.message || "İletilemedi.", { id: toastId }); }
    } catch (error) { toast.error("Bağlantı hatası.", { id: toastId }); } 
    finally { setCevapGonderiliyor(false); }
  };

  const handleTalepSilOnay = (talepId: string, e: React.MouseEvent) => {
    e.stopPropagation(); 
    setSilinecekTalepId(talepId);
  };

  const gercektenSil = async () => {
    if (!silinecekTalepId) return;
    
    const toastId = toast.loading("Talep siliniyor...");
    try {
      const res = await fetch(`/api/destek?id=${silinecekTalepId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Talep başarıyla silindi.", { id: toastId });
        setTalepler(prev => {
          const yeniListe = prev.filter(t => t._id !== silinecekTalepId);
          localStorage.setItem("bilgin_destek_talepleri", JSON.stringify(yeniListe));
          return yeniListe;
        });
        if (seciliTalepId === silinecekTalepId) setSeciliTalepId(null);
        setSilinecekTalepId(null); 
      } else { toast.error("Silinemedi.", { id: toastId }); }
    } catch (error) { toast.error("Bağlantı hatası.", { id: toastId }); }
  };

  if (yukleniyor) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="w-16 h-16 border-4 border-slate-800 border-t-indigo-500 rounded-full animate-spin shadow-[0_0_30px_rgba(99,102,241,0.3)]"></div>
        <p className="mt-6 text-indigo-400 font-bold uppercase tracking-widest text-sm animate-pulse">Destek Ağına Bağlanılıyor...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    if (typeof window !== "undefined") window.location.href = "/giris";
    return null;
  }

  const acikTalepler = talepler.filter(t => t.durum !== "Çözüldü");
  const gecmisTalepler = talepler.filter(t => t.durum === "Çözüldü");
  const gosterilenTalepler = aktifTab === 'acik' ? acikTalepler : gecmisTalepler;

  const getGuzelKonuAdi = (konuKey: string) => {
    switch(konuKey) {
      case "iade": return "Kolay İade İşlemi";
      case "teknik": return "Teknik Destek / Arıza";
      case "kargo": return "Kargo / Teslimat Sorunu";
      default: return "Diğer Konular";
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#020617] text-white font-sans p-4 sm:p-6 lg:p-8 relative overflow-clip">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-indigo-600 blur-[250px] opacity-[0.07] pointer-events-none rounded-full"></div>

        <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-5 lg:gap-8 relative z-10 items-start">
          
          <div className="w-full lg:w-[280px] shrink-0 flex flex-col gap-2 static lg:sticky lg:top-28 z-10">
            <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-xl">
              <nav className="flex flex-col gap-1.5">
                <Link href="/hesabim" className="flex items-center gap-3 px-4 py-3 sm:py-3.5 text-sm sm:text-base text-slate-400 hover:text-white hover:bg-white/[0.02] rounded-xl transition-all font-medium"><User className="w-4 h-4 sm:w-5 sm:h-5" /> Profil</Link>
                <Link href="/cuzdan" className="flex items-center gap-3 px-4 py-3 sm:py-3.5 text-sm sm:text-base text-slate-400 hover:text-white hover:bg-white/[0.02] rounded-xl transition-all font-medium"><CreditCard className="w-4 h-4 sm:w-5 sm:h-5" /> Dijital Cüzdanım</Link>
                <Link href="/guvenlik" className="flex items-center gap-3 px-4 py-3 sm:py-3.5 text-sm sm:text-base text-slate-400 hover:text-white hover:bg-white/[0.02] rounded-xl transition-all font-medium"><ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" /> Güvenlik</Link>
              </nav>
            </div>
          </div>

          <div className="flex-1 flex flex-col min-w-0 gap-5 lg:gap-6 w-full">
            
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 sm:p-6 lg:p-8 shadow-xl relative overflow-hidden group flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/10 blur-[60px] pointer-events-none rounded-full"></div>
              <div className="flex items-center gap-3 sm:gap-4 relative z-10">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#020617] border border-indigo-500/30 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.2)] shrink-0"><Headset className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-400" /></div>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight mb-0.5 sm:mb-1">Destek Çözüm Merkezi</h1>
                  <p className="text-indigo-400/80 text-xs sm:text-sm font-medium tracking-wide">Sorunlarınızı en hızlı şekilde çözmek için buradayız.</p>
                </div>
              </div>
              <button onClick={() => setYeniTalepModal(true)} className="relative z-10 w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-black text-xs sm:text-sm uppercase tracking-widest transition-all shrink-0"><PlusCircle className="w-4 h-4 sm:w-5 sm:h-5" /> YENİ TALEP</button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col gap-2"><div className="flex items-center gap-2 text-amber-400"><Clock className="w-4 h-4" /><span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Açık İşlemler</span></div><p className="text-2xl sm:text-3xl font-black text-white">{acikTalepler.length}</p></div>
              <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col gap-2"><div className="flex items-center gap-2 text-emerald-400"><CheckCircle2 className="w-4 h-4" /><span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Çözülenler</span></div><p className="text-2xl sm:text-3xl font-black text-white">{gecmisTalepler.length}</p></div>
              <div className="col-span-2 lg:col-span-1 bg-[#0f172a] border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col gap-2 relative overflow-hidden"><div className="flex items-center gap-2 text-indigo-400"><MessageSquare className="w-4 h-4" /><span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Ortalama Yanıt</span></div><p className="text-xl sm:text-2xl font-black text-white">15 <span className="text-sm text-slate-400 font-medium">Dakika</span></p></div>
            </div>

            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl shadow-xl flex flex-col overflow-hidden">
              <div className="flex items-center gap-2 sm:gap-4 border-b border-slate-800/80 p-2 sm:p-3">
                <button onClick={() => setAktifTab('acik')} className={`flex-1 sm:flex-none px-6 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-black uppercase tracking-widest transition-all duration-300 border ${aktifTab === 'acik' ? 'bg-[#020617] text-indigo-400 border-slate-800 shadow-md' : 'bg-transparent text-slate-500 border-transparent hover:text-slate-300 hover:bg-white/[0.02]'}`}>Açık Talepler</button>
                <button onClick={() => setAktifTab('gecmis')} className={`flex-1 sm:flex-none px-6 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-black uppercase tracking-widest transition-all duration-300 border ${aktifTab === 'gecmis' ? 'bg-[#020617] text-indigo-400 border-slate-800 shadow-md' : 'bg-transparent text-slate-500 border-transparent hover:text-slate-300 hover:bg-white/[0.02]'}`}>Geçmiş İşlemler</button>
              </div>

              <div key={aktifTab} className="flex flex-col p-3 sm:p-5 gap-3 animate-in fade-in duration-300 ease-out">
                {gosterilenTalepler.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 opacity-50"><CheckCircle2 className="w-12 h-12 text-slate-500 mb-3" /><p className="text-sm font-bold text-slate-400">Bekleyen hiçbir işleminiz yok.</p></div>
                ) : (
                  gosterilenTalepler.map((talep) => (
                    <div key={talep._id} className={`bg-[#020617] border rounded-xl flex flex-col transition-all ${seciliTalepId === talep._id ? 'border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.1)]' : 'border-slate-800 hover:border-slate-700'}`}>
                      
                      <div onClick={() => setSeciliTalepId(seciliTalepId === talep._id ? null : talep._id)} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 cursor-pointer group">
                        <div className="flex items-start sm:items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border transition-colors ${talep.konu === 'iade' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : talep.konu === 'teknik' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
                            {talep.konu === 'iade' ? <PackageX className="w-5 h-5" /> : talep.konu === 'teknik' ? <Wrench className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs sm:text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">{getGuzelKonuAdi(talep.konu)}</span>
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-bold">{talep.talepNo}</span>
                            </div>
                            <p className="text-[10px] sm:text-xs text-slate-400 truncate max-w-[250px] sm:max-w-md">Son mesaj: {talep.mesajlar?.[talep.mesajlar.length - 1]?.metin || "Mesaj detayları..."}</p>
                          </div>
                        </div>

                        {/* 🚀 BİNGO 2: BUTONLARI BİRLEŞTİRDİK (KOPMASINLAR DİYE) */}
                        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 w-full sm:w-auto mt-2 sm:mt-0 border-t sm:border-0 border-slate-800 pt-3 sm:pt-0">
                          <div className="flex flex-col sm:items-end">
                            <span className={`text-[10px] font-black uppercase tracking-widest mb-1 ${talep.durum === 'Çözüldü' ? 'text-emerald-400' : talep.durum === 'Yanıt Bekleniyor' ? 'text-amber-400' : 'text-indigo-400'}`}>{talep.durum}</span>
                            <span className="text-[9px] text-slate-500">{new Date(talep.createdAt).toLocaleDateString("tr-TR")}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 shrink-0">
                            <button onClick={(e) => handleTalepSilOnay(talep._id, e)} title="Talebi Sil" className="w-9 h-9 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center bg-rose-500/10 text-rose-400 border border-transparent hover:border-rose-500/30 hover:bg-rose-500/20 transition-all z-10">
                              <Trash2 className="w-4 h-4 sm:w-4 sm:h-4" />
                            </button>
                            
                            <button className={`w-9 h-9 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-all ${seciliTalepId === talep._id ? 'bg-indigo-600 text-white' : 'bg-[#0f172a] border border-slate-700 text-slate-400 group-hover:bg-indigo-500/10 group-hover:text-indigo-400'}`}>
                              {seciliTalepId === talep._id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      {seciliTalepId === talep._id && (
                        <div className="border-t border-slate-800 bg-[#0f172a]/50 p-4 sm:p-6 animate-in slide-in-from-top-2 duration-300 rounded-b-xl flex flex-col gap-5">
                          <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                            {talep.mesajlar?.map((msg: any, index: number) => {
                              const isMusteri = msg.gonderen === 'Musteri';
                              return (
                                <div key={index} className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${isMusteri ? 'self-end items-end' : 'self-start items-start'}`}>
                                  <div className={`text-[9px] font-bold uppercase tracking-widest mb-1 px-1 ${isMusteri ? 'text-indigo-400' : 'text-slate-500'}`}>{isMusteri ? 'Siz' : 'Mağaza Temsilcisi'}</div>
                                  <div className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${isMusteri ? 'bg-indigo-600 text-white rounded-tr-sm shadow-[0_4px_15px_rgba(79,70,229,0.2)]' : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-sm'}`}>
                                    {msg.metin.split('\n').map((satir: string, i: number) => <span key={i}>{satir}<br/></span>)}
                                  </div>
                                  <div className="text-[9px] text-slate-500 mt-1 font-medium">{new Date(msg.tarih).toLocaleString("tr-TR")}</div>
                                </div>
                              );
                            })}
                            <div ref={sohbetSonuRef} />
                          </div>

                          {talep.durum !== 'Çözüldü' ? (
                            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-800/80">
                              <textarea 
                                value={cevapMesajlari[talep._id] || ""}
                                onChange={(e) => setCevapMesajlari(prev => ({...prev, [talep._id]: e.target.value}))}
                                placeholder="Cevabınızı yazın..." 
                                className="flex-1 bg-[#020617] border border-slate-700 focus:border-indigo-500 rounded-xl p-3 sm:p-4 text-xs sm:text-sm text-white focus:outline-none transition-colors min-h-[60px] sm:min-h-[80px] resize-none" 
                              />
                              {/* 🚀 BİNGO 3: GÖNDER BUTONUNA KALINLIK EKLENDİ (min-h-[48px]) */}
                              <button onClick={() => handleCevapGonder(talep._id)} disabled={cevapGonderiliyor || !(cevapMesajlari[talep._id] || "").trim()} className="sm:w-[140px] w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-xl font-black uppercase text-[11px] sm:text-xs tracking-widest transition-all shadow-lg disabled:opacity-50 min-h-[48px] sm:min-h-[80px]">
                                {cevapGonderiliyor ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4 sm:w-5 sm:h-5" /> GÖNDER</>}
                              </button>
                            </div>
                          ) : (
                            <div className="pt-6 border-t border-slate-800/80 flex flex-col items-center justify-center gap-2 text-center bg-slate-800/20 rounded-xl p-4 mt-2">
                              <CheckCircle2 className="w-8 h-8 text-emerald-500/60 mb-1" />
                              <p className="text-sm font-black text-emerald-400 uppercase tracking-widest">Bu talep çözüldü olarak kapatılmıştır</p>
                              <p className="text-xs text-slate-400 font-medium max-w-md">Farklı bir sorunuz veya talebiniz varsa, lütfen yukarıdan yeni bir talep oluşturun veya müşteri hizmetlerimizle iletişime geçin.</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {yeniTalepModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full flex flex-col shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-blue-500"></div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2"><PlusCircle className="w-6 h-6 text-indigo-400" /> YENİ TALEP OLUŞTUR</h3>
              <button onClick={() => setYeniTalepModal(false)} className="text-slate-500 hover:text-white bg-[#020617] p-1.5 rounded-xl border border-slate-800 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleTalepGonder} className="flex flex-col gap-4">
              <div><label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">İşlem Konusu</label><select value={talepKonusu} onChange={(e) => setTalepKonusu(e.target.value)} className="w-full bg-[#020617] border border-slate-800 focus:border-indigo-500/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors appearance-none" required><option value="" disabled>Lütfen bir konu seçin</option><option value="iade">Kolay İade İşlemi</option><option value="teknik">Teknik Destek / Arıza</option><option value="kargo">Kargo / Teslimat Sorunu</option><option value="diger">Diğer Konular</option></select></div>
              <div><label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Talep Başlığı / Sipariş No</label><input type="text" value={talepBaslik} onChange={(e) => setTalepBaslik(e.target.value)} placeholder="Kısa bir başlık veya Sipariş Numarası girin..." className="w-full bg-[#020617] border border-slate-800 focus:border-indigo-500/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors" required /></div>
              <div><label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Mesajınız</label><textarea value={talepMesaji} onChange={(e) => setTalepMesaji(e.target.value)} placeholder="Sorununuzu veya talebinizi detaylıca açıklayın..." className="w-full bg-[#020617] border border-slate-800 focus:border-indigo-500/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors min-h-[120px] resize-none" required></textarea></div>
              <div className="bg-indigo-500/5 border border-indigo-500/10 p-3 rounded-xl flex gap-3 mt-2"><AlertCircle className="w-5 h-5 text-indigo-400 shrink-0" /><p className="text-[10px] sm:text-xs text-slate-400 font-medium leading-relaxed">Talepleriniz ortalama 15 dakika içerisinde uzman ekibimiz tarafından yanıtlanmaktadır. İade işlemleri için kargo kodu tarafınıza iletilecektir.</p></div>
              <button type="submit" disabled={talepGonderiliyor || !talepKonusu || !talepMesaji || !talepBaslik} className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-black text-sm uppercase tracking-widest transition-all disabled:opacity-50">{talepGonderiliyor ? <><Loader2 className="w-5 h-5 animate-spin" /> İŞLENİYOR...</> : <><Send className="w-5 h-5" /> TALEBİ GÖNDER</>}</button>
            </form>
          </div>
        </div>
      )}

      {silinecekTalepId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full flex flex-col items-center text-center shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-red-500"></div>
            <div className="w-16 h-16 rounded-full border border-rose-500/20 flex items-center justify-center mb-5 bg-rose-500/10">
              <Trash2 className="w-7 h-7 text-rose-400" />
            </div>
            <h3 className="text-lg font-black text-white uppercase tracking-wider mb-2">Talebi Sil</h3>
            <p className="text-slate-400 text-sm mb-8 font-medium leading-relaxed">Bu talebi kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.</p>
            <div className="flex w-full gap-3">
              <button onClick={() => setSilinecekTalepId(null)} className="flex-1 bg-[#020617] border border-slate-700 hover:border-slate-500 hover:text-white text-slate-400 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all">İptal</button>
              <button onClick={gercektenSil} className="flex-1 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(244,63,94,0.15)]">Evet, Sil</button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #4f46e5; }
      `}</style>
    </>
  );
}