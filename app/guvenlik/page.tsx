"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  User, ShieldCheck, CreditCard, Lock, KeyRound, 
  Smartphone, Laptop, Mail, PowerOff, AlertTriangle, 
  Snowflake, Trash2, MapPin, Loader2, CheckCircle2, XCircle, Eye, EyeOff
} from "lucide-react";
import { useSession } from "next-auth/react";

export default function GuvenlikPage() {
  const { data: session } = useSession(); 
  
  const [mevcutSifre, setMevcutSifre] = useState("");
  const [sifre, setSifre] = useState("");
  const [sifreTekrar, setSifreTekrar] = useState("");
  const [gosterMevcut, setGosterMevcut] = useState(false);
  const [gosterYeni, setGosterYeni] = useState(false);
  const [gosterTekrar, setGosterTekrar] = useState(false);
  const [islemDurumu, setIslemDurumu] = useState({ tip: "", mesaj: "" });
  const [yukleniyor, setYukleniyor] = useState(false);

  const [ikiAdimEmail, setIkiAdimEmail] = useState(false);
  const [ikiAdimDurum, setIkiAdimDurum] = useState({ tip: "", mesaj: "" });
  const [ikiAdimYukleniyor, setIkiAdimYukleniyor] = useState(false);

  const [aktifCihazlar, setAktifCihazlar] = useState<any[]>([]);
  const [cihazlarYukleniyor, setCihazlarYukleniyor] = useState(true);
  const [cikisYukleniyor, setCikisYukleniyor] = useState(false);

  useEffect(() => {
    const ayarlariGetir = async () => {
      try {
        const res = await fetch("/api/user/get-2fa", { cache: 'no-store' }); 
        if (res.ok) {
          const data = await res.json();
          setIkiAdimEmail(data.twoFactorEmail);
          
          if (data.activeDevices) {
            const siraliCihazlar = data.activeDevices.sort((a: any, b: any) => 
              new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime()
            );
            setAktifCihazlar(siraliCihazlar);
          }
        }
      } catch (error) {
        console.error("Ayarlar çekilemedi:", error);
      } finally {
        setCihazlarYukleniyor(false);
      }
    };
    
    ayarlariGetir();
  }, []); 

  const sifreGucuHesapla = (s: string) => {
    let guc = 0;
    if (s.length > 5) guc += 1;
    if (s.length > 8) guc += 1;
    if (/[A-Z]/.test(s)) guc += 1;
    if (/[0-9!@#$%^&*]/.test(s)) guc += 1;
    return guc;
  };
  const gucSeviyesi = sifreGucuHesapla(sifre);
  const gucYuzdesi = gucSeviyesi === 0 ? 0 : (gucSeviyesi / 4) * 100;
  const gucRengi = gucSeviyesi < 2 ? "bg-rose-500 shadow-[0_0_10px_#f43f5e]" : gucSeviyesi === 2 ? "bg-amber-500 shadow-[0_0_10px_#f59e0b]" : "bg-emerald-500 shadow-[0_0_10px_#10b981]";

  const cihazAdiniCevir = (userAgent: string) => {
    if (!userAgent) return "Bilinmeyen Cihaz";
    let isletimSistemi = "Bilinmeyen OS";
    if (userAgent.includes("Windows")) isletimSistemi = "Windows PC";
    else if (userAgent.includes("Mac")) isletimSistemi = "Macintosh";
    else if (userAgent.includes("iPhone")) isletimSistemi = "iPhone";
    else if (userAgent.includes("Android")) isletimSistemi = "Android Telefon";

    let tarayici = "Bilinmeyen Tarayıcı";
    if (userAgent.includes("Edg")) tarayici = "Microsoft Edge";
    else if (userAgent.includes("Chrome")) tarayici = "Google Chrome";
    else if (userAgent.includes("Firefox")) tarayici = "Mozilla Firefox";
    else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) tarayici = "Apple Safari";

    return `${isletimSistemi} - ${tarayici}`;
  };

  const handleSifreGuncelle = async (e: React.FormEvent) => {
    e.preventDefault(); 
    if (!mevcutSifre || !sifre || !sifreTekrar) {
      setIslemDurumu({ tip: "hata", mesaj: "Lütfen tüm şifre alanlarını doldurun." });
      return;
    }
    if (sifre !== sifreTekrar) {
      setIslemDurumu({ tip: "hata", mesaj: "Yeni şifreler birbiriyle eşleşmiyor." });
      return;
    }
    if (gucSeviyesi < 2) {
      setIslemDurumu({ tip: "hata", mesaj: "Lütfen daha güçlü bir yeni şifre belirleyin." });
      return;
    }

    setYukleniyor(true);
    setIslemDurumu({ tip: "", mesaj: "" });

    try {
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mevcutSifre, yeniSifre: sifre }),
      });
      const data = await res.json();
      if (!res.ok) {
        setIslemDurumu({ tip: "hata", mesaj: data.message || "Şifre güncellenemedi." });
      } else {
        setIslemDurumu({ tip: "basari", mesaj: "Şifreniz başarıyla güncellendi!" });
        setMevcutSifre(""); setSifre(""); setSifreTekrar("");
      }
    } catch (error) {
      setIslemDurumu({ tip: "hata", mesaj: "Sunucuya bağlanılamadı. Lütfen tekrar deneyin." });
    } finally {
      setYukleniyor(false);
    }
  };

  const handle2FAKaydet = async () => {
    setIkiAdimYukleniyor(true);
    setIkiAdimDurum({ tip: "", mesaj: "" });

    try {
      const res = await fetch("/api/user/update-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ twoFactorEmail: ikiAdimEmail, twoFactorSms: false }), 
      });
      const data = await res.json();
      
      if (!res.ok) {
        setIkiAdimDurum({ tip: "hata", mesaj: data.message || "Ayarlar kaydedilemedi." });
      } else {
        setIkiAdimDurum({ tip: "basari", mesaj: "Güvenlik ayarları kaydedildi!" });
        setTimeout(() => setIkiAdimDurum({ tip: "", mesaj: "" }), 3000);
      }
    } catch (error) {
      setIkiAdimDurum({ tip: "hata", mesaj: "Sunucu bağlantı hatası." });
    } finally {
      setIkiAdimYukleniyor(false);
    }
  };

  // 🚀 DİĞER CİHAZLARDAN ÇIKIŞ YAP (KIRMIZI BUTON)
  const handleDigerCihazlardanCikis = async () => {
    const mevcutCihazId = (session?.user as any)?.deviceId;
    if (!mevcutCihazId) return;

    setCikisYukleniyor(true);
    try {
      const res = await fetch("/api/user/remove-other-devices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentDeviceId: mevcutCihazId }),
      });

      if (res.ok) {
        // Ekranda (vitrinde) anında temizlik yap: Sadece bu cihazı bırak!
        setAktifCihazlar(aktifCihazlar.filter(c => c.deviceId === mevcutCihazId));
        // Başarı mesajı verebiliriz (veya silebilirsin)
        setIslemDurumu({ tip: "basari", mesaj: "Diğer tüm cihazlardaki oturumlarınız sonlandırıldı." });
      }
    } catch (error) {
      console.error("Çıkış işlemi başarısız:", error);
    } finally {
      setCikisYukleniyor(false);
    }
  };
  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-[#00d2ff] blur-[250px] opacity-[0.05] pointer-events-none rounded-full"></div>

      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-6 relative z-10 items-start">
        
        {/* SOL MENÜ */}
        <div className="w-full lg:w-64 shrink-0 flex flex-col gap-2 sticky top-28 z-20">
          <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 shadow-xl">
            <nav className="flex flex-col gap-1.5">
              <Link href="/hesabim" className="flex items-center gap-3 px-4 py-3.5 text-slate-400 hover:text-white hover:bg-white/[0.02] rounded-xl transition-all font-medium">
                <User className="w-5 h-5" /> Profil
              </Link>
              <Link href="/hesabim" className="flex items-center gap-3 px-4 py-3.5 text-slate-400 hover:text-white hover:bg-white/[0.02] rounded-xl transition-all font-medium">
                <CreditCard className="w-5 h-5" /> Ödeme Yöntemleri
              </Link>
              <Link href="/guvenlik" className="flex items-center gap-3 px-4 py-3.5 bg-white/[0.05] border border-white/10 rounded-xl text-white font-bold shadow-inner transition-all">
                <ShieldCheck className="w-5 h-5 text-cyan-400" /> Güvenlik
              </Link>
            </nav>
          </div>
        </div>

        {/* SAĞ İÇERİK */}
        <div className="flex-1 flex flex-col min-w-0 gap-6 w-full">
          
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/10 blur-[50px] pointer-events-none rounded-full"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-16 h-16 bg-[#020617] border border-cyan-500/30 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.2)] shrink-0">
                <Lock className="w-8 h-8 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1">Güvenlik Merkezi</h1>
                <p className="text-slate-400 text-sm font-medium">Hesabınızı 256-bit şifreleme standartlarıyla yönetin ve koruyun.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* ŞİFRE YÖNETİMİ */}
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col h-full">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800/80">
                <KeyRound className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg font-black text-white uppercase tracking-wider">Şifre Yönetimi</h2>
              </div>

              <form onSubmit={handleSifreGuncelle} className="flex flex-col gap-4 flex-1">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Mevcut Şifreniz</label>
                  <div className="relative">
                    <input 
                      type={gosterMevcut ? "text" : "password"} 
                      placeholder="••••••••" 
                      value={mevcutSifre}
                      onChange={(e) => setMevcutSifre(e.target.value)}
                      className="w-full bg-[#020617] border border-slate-800 focus:border-cyan-500/50 rounded-xl px-4 py-3 pr-10 text-white text-sm outline-none transition-all focus:shadow-[0_0_15px_rgba(6,182,212,0.1)]" 
                    />
                    <button type="button" onClick={() => setGosterMevcut(!gosterMevcut)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition-colors">
                      {gosterMevcut ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Yeni Şifre</label>
                  <div className="relative">
                    <input 
                      type={gosterYeni ? "text" : "password"} 
                      placeholder="••••••••" 
                      value={sifre}
                      onChange={(e) => setSifre(e.target.value)}
                      className="w-full bg-[#020617] border border-slate-800 focus:border-cyan-500/50 rounded-xl px-4 py-3 pr-10 text-white text-sm outline-none transition-all focus:shadow-[0_0_15px_rgba(6,182,212,0.1)]" 
                    />
                    <button type="button" onClick={() => setGosterYeni(!gosterYeni)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition-colors">
                      {gosterYeni ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="h-1.5 w-full bg-[#020617] rounded-full mt-2 overflow-hidden border border-slate-800">
                    <div className={`h-full transition-all duration-300 ${gucRengi}`} style={{ width: `${gucYuzdesi}%` }}></div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Yeni Şifre (Tekrar)</label>
                  <div className="relative">
                    <input 
                      type={gosterTekrar ? "text" : "password"} 
                      placeholder="••••••••" 
                      value={sifreTekrar}
                      onChange={(e) => setSifreTekrar(e.target.value)}
                      className="w-full bg-[#020617] border border-slate-800 focus:border-cyan-500/50 rounded-xl px-4 py-3 pr-10 text-white text-sm outline-none transition-all focus:shadow-[0_0_15px_rgba(6,182,212,0.1)]" 
                    />
                    <button type="button" onClick={() => setGosterTekrar(!gosterTekrar)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition-colors">
                      {gosterTekrar ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {islemDurumu.mesaj && (
                  <div className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-bold ${
                    islemDurumu.tip === "hata" ? "bg-rose-500/10 border-rose-500/20 text-rose-400" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  }`}>
                    {islemDurumu.tip === "hata" ? <XCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
                    {islemDurumu.mesaj}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={yukleniyor}
                  className="mt-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)] disabled:opacity-50 disabled:pointer-events-none flex justify-center items-center gap-2"
                >
                  {yukleniyor ? <><Loader2 className="w-4 h-4 animate-spin" /> İŞLENİYOR...</> : "ŞİFREYİ GÜNCELLE"}
                </button>
              </form>
            </div>

            {/* 2FA BÖLÜMÜ */}
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col h-full relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-[60px] pointer-events-none rounded-full"></div>
              
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800/80">
                <ShieldCheck className="w-5 h-5 text-purple-400" />
                <h2 className="text-lg font-black text-white uppercase tracking-wider">İki Adımlı Doğrulama</h2>
              </div>

              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Hesabınıza yeni bir cihazdan giriş yapıldığında şifrenize ek olarak ekstra bir güvenlik katmanı sağlar.
              </p>

              <div className="flex flex-col gap-4 flex-1">
                <div className="flex items-center justify-between p-4 bg-[#020617] border border-slate-800 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800/50 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-slate-300" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">E-Posta Onayı</p>
                      <p className="text-[10px] text-slate-500 font-medium">Girişlerde e-postanıza kod gelir.</p>
                    </div>
                  </div>
                  <button onClick={() => setIkiAdimEmail(!ikiAdimEmail)} className={`w-12 h-6 rounded-full relative transition-colors duration-300 outline-none ${ikiAdimEmail ? "bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]" : "bg-slate-700"}`}>
                    <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${ikiAdimEmail ? "translate-x-6" : "translate-x-0"}`}></div>
                  </button>
                </div>
              </div>

              {ikiAdimDurum.mesaj && (
                <div className={`mt-4 p-3 rounded-xl border flex items-center gap-2 text-xs font-bold ${
                  ikiAdimDurum.tip === "hata" ? "bg-rose-500/10 border-rose-500/20 text-rose-400" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                }`}>
                  {ikiAdimDurum.tip === "hata" ? <XCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
                  {ikiAdimDurum.mesaj}
                </div>
              )}

              <button 
                onClick={handle2FAKaydet}
                disabled={ikiAdimYukleniyor}
                className="mt-6 w-full py-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-slate-700 hover:border-slate-500 text-slate-300 font-black text-xs uppercase tracking-widest transition-all flex justify-center items-center gap-2 disabled:opacity-50"
              >
                {ikiAdimYukleniyor ? <><Loader2 className="w-4 h-4 animate-spin" /> KAYDEDİLİYOR...</> : "AYARLARI KAYDET"}
              </button>
            </div>
          </div>

          {/* 💻 CANLI AKTİF CİHAZLAR RADARI */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800/80">
              <Laptop className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-black text-white uppercase tracking-wider">Aktif Cihazlar Radarı</h2>
              <span className="ml-auto text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded font-bold uppercase tracking-widest">Son 30 Gün</span>
            </div>
<div className="flex flex-col gap-3">
              {cihazlarYukleniyor ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                </div>
              ) : aktifCihazlar.length === 0 ? (
                <div className="text-center p-8 text-slate-500 font-medium">Kayıtlı cihaz bulunamadı.</div>
              ) : (
                (() => {
                  // 🚀 SENİN EFSANE MANTIĞIN: Her cihaz tipinin (PC, Telefon) sadece EN YENİ olanını bul!
                  const gorulenTipler = new Set();
                  const aktifSayilacakIdler = aktifCihazlar.map(c => {
                    const tip = cihazAdiniCevir(c.deviceInfo);
                    if (!gorulenTipler.has(tip)) {
                      gorulenTipler.add(tip);
                      return c.deviceId;
                    }
                    return null;
                  }).filter(Boolean);

                  return aktifCihazlar.map((cihaz, index) => {
                    const buCihazMi = (session?.user as any)?.deviceId === cihaz.deviceId;
                    
                    // Eğer bu cihaz, kendi türünün (PC veya Telefon) en son gireni ise aktif say!
                    const enYeniMi = aktifSayilacakIdler.includes(cihaz.deviceId);
                    
                    // İkisinden biri varsa cihaz "Aktif" (Yeşil) görünecek, yoksa sönük kalacak!
                    const aktifGozuksun = buCihazMi || enYeniMi;
                    
                    const isMobile = cihaz.deviceInfo.toLowerCase().includes('mobile') || cihaz.deviceInfo.toLowerCase().includes('android') || cihaz.deviceInfo.toLowerCase().includes('iphone');
                    
                    return (
                      <div key={cihaz.deviceId || index} className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#020617] border rounded-xl relative overflow-hidden group ${aktifGozuksun ? "border-emerald-500/30" : "border-slate-800"}`}>
                        {aktifGozuksun && <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>}
                        
                        <div className="flex items-start sm:items-center gap-4 pl-3">
                          <div className="relative shrink-0 mt-1 sm:mt-0">
                            {/* 🚀 SADECE EN YENİLER YEŞİL YANSIN, ESKİLER GRİ (SÖNÜK) KALSIN */}
                            {isMobile ? (
                              <Smartphone className={`w-8 h-8 ${aktifGozuksun ? "text-emerald-400" : "text-slate-600"}`} />
                            ) : (
                              <Laptop className={`w-8 h-8 ${aktifGozuksun ? "text-emerald-400" : "text-slate-600"}`} />
                            )}
                            
                            {/* 🚀 YEŞİL YANIP SÖNME IŞIĞI SADECE AKTİF OLANLARDA ÇALIŞSIN */}
                            {aktifGozuksun && (
                              <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-[#020617]"></span>
                              </span>
                            )}
                          </div>
                          <div>
                            <p className={`text-sm font-bold flex flex-wrap items-center gap-2 ${aktifGozuksun ? "text-white" : "text-slate-500"}`}>
                              {cihazAdiniCevir(cihaz.deviceInfo)}
                              {/* 🚀 "BU CİHAZ" etiketi her zaman SADECE senin elindekinde çıksın */}
                              {buCihazMi && <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-black uppercase tracking-widest border border-emerald-500/20">Bu Cihaz</span>}
                            </p>
                            <p className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                              <span className="flex items-center gap-1.5">
                                <MapPin className={`w-3 h-3 ${aktifGozuksun ? "text-emerald-400" : "text-slate-600"}`} /> 
                                {cihaz.location || "Bilinmeyen Konum"} ({cihaz.ipAddress})
                              </span>
                              <span>|</span>
                              <span>{new Date(cihaz.lastActive).toLocaleDateString("tr-TR", {day: 'numeric', month: 'short', hour: '2-digit', minute:'2-digit'})}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()
              )}
            </div>

            {aktifCihazlar.length > 1 && (
              <div className="mt-6 flex justify-end">
                <button 
                  onClick={handleDigerCihazlardanCikis}
                  disabled={cikisYukleniyor}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-950/40 border border-red-900/50 hover:bg-red-900/60 text-red-400 hover:text-red-300 hover:border-red-500/50 transition-all font-black text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(220,38,38,0.1)] disabled:opacity-50"
                >
                  {cikisYukleniyor ? <Loader2 className="w-4 h-4 animate-spin" /> : <PowerOff className="w-4 h-4" />}
                  Diğer Tüm Cihazlardan Çıkış Yap
                </button>
              </div>
            )}
          </div>

          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-800/80">
              <AlertTriangle className="w-5 h-5 text-slate-400" />
              <h2 className="text-lg font-black text-white uppercase tracking-wider">Hesap İşlemleri</h2>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-2xl">
              Hesabınızı geçici olarak dondurabilir veya kişisel verilerinizle birlikte kalıcı olarak silebilirsiniz. Silme işlemi geri alınamaz.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex-1 flex justify-center items-center gap-2 py-4 rounded-xl bg-[#020617] border border-slate-800 hover:bg-slate-800/50 hover:text-white text-slate-300 transition-all font-bold text-xs uppercase tracking-widest">
                <Snowflake className="w-4 h-4" /> Hesabımı Dondur
              </button>
              <button className="flex-1 flex justify-center items-center gap-2 py-4 rounded-xl bg-red-950/20 border border-red-900/30 hover:bg-red-900/50 hover:border-red-500/50 text-red-400 transition-all font-bold text-xs uppercase tracking-widest">
                <Trash2 className="w-4 h-4" /> Hesabımı Kalıcı Olarak Sil
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}