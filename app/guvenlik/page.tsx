"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  User, ShieldCheck, CreditCard, Lock, KeyRound, 
  Smartphone, Laptop, Mail, PowerOff, AlertTriangle, 
  Snowflake, Trash2, MapPin, Loader2, CheckCircle2, XCircle, Eye, EyeOff, LogIn, 
  UserPlus
} from "lucide-react";
import { useSession, signOut } from "next-auth/react"; 

export default function GuvenlikPage() {
  // 🚀 STATUS MOTORU EKLENDİ (Misafir mi değil mi anlamak için)
  const { data: session, status } = useSession(); 
  const mevcutCihazId = (session?.user as any)?.deviceId; 

  // 🚀 MİSAFİRLERİ ENGELLEYEN ŞIK UYARI MODALI
  const [girisSartModal, setGirisSartModal] = useState(false);

  const kilitliIslem = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setGirisSartModal(true);
  };

  const [mevcutSifre, setMevcutSifre] = useState("");
  const [sifre, setSifre] = useState("");
  const [sifreTekrar, setSifreTekrar] = useState("");
  const [gosterMevcut, setGosterMevcut] = useState(false);
  const [gosterYeni, setGosterYeni] = useState(false);
  const [gosterTekrar, setGosterTekrar] = useState(false);
  const [islemDurumu, setIslemDurumu] = useState({ tip: "", mesaj: "" });
  const [yukleniyor, setYukleniyor] = useState(false);

  const [ikiAdimEmail, setIkiAdimEmail] = useState(false);
  const [bildirimTercihi, setBildirimTercihi] = useState('new_device'); 
  const [ikiAdimDurum, setIkiAdimDurum] = useState({ tip: "", mesaj: "" });
  const [ikiAdimYukleniyor, setIkiAdimYukleniyor] = useState(false);

  const [aktifCihazlar, setAktifCihazlar] = useState<any[]>([]);
  const [cihazlarYukleniyor, setCihazlarYukleniyor] = useState(false);
  const [cikisYukleniyor, setCikisYukleniyor] = useState(false);

  const [islemModali, setIslemModali] = useState<{acik: boolean, tur: 'dondur' | 'sil'}>({acik: false, tur: 'dondur'});
  const [islemSifresi, setIslemSifresi] = useState("");
  const [islemYukleniyor, setIslemYukleniyor] = useState(false);
  const [islemBasariliMesaj, setIslemBasariliMesaj] = useState("");
  const [islemHata, setIslemHata] = useState("");

  // 🚀 KESKİN NİŞANCI ÇIRAK (Misafir ise boşuna sunucuyu yormaz, sıfır çeker!)
  useEffect(() => {
    if (status === "unauthenticated") {
      setCihazlarYukleniyor(false);
      return;
    }

    if (status !== "authenticated") return;

    const ayarlariGetir = async (ilkYukleme = false) => {
      if (ilkYukleme) setCihazlarYukleniyor(true);
      try {
        const res = await fetch("/api/user/get-2fa", { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          
          if (ilkYukleme) {
            setIkiAdimEmail(data.twoFactorEmail);
            setBildirimTercihi(data.notificationPreference || 'none'); 
          }
          
          if (data.activeDevices) {
            if (mevcutCihazId) {
              const benimCihaz = data.activeDevices.find((c: any) => c.deviceId === mevcutCihazId);
              if (!benimCihaz || benimCihaz.isActive === false) {
                 signOut({ callbackUrl: '/giris?alert=security_breach' });
                 return; 
              }
            }

            const yasayanCihazlar = data.activeDevices.filter((c: any) => c.isActive !== false);
            const siraliCihazlar = yasayanCihazlar.sort((a: any, b: any) => 
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
    
    ayarlariGetir(true); 

    const cirak = setInterval(() => {
      ayarlariGetir(false);
    }, 5000); 

    return () => clearInterval(cirak); 
  }, [mevcutCihazId, status]); 

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
    // 🚀 MİSAFİR KONTROLÜ
    if (status === "unauthenticated") return kilitliIslem();

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

  const handleOtomatikKaydet = async (yeniEmail: boolean, yeniBildirim: string) => {
    setIkiAdimYukleniyor(true);
    setIkiAdimDurum({ tip: "", mesaj: "" });

    try {
      const res = await fetch("/api/user/update-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          twoFactorEmail: yeniEmail, 
          twoFactorSms: false,
          notificationPreference: yeniBildirim 
        }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        setIkiAdimDurum({ tip: "hata", mesaj: data.message || "Ayarlar kaydedilemedi." });
      } else {
        setIkiAdimDurum({ tip: "basari", mesaj: "Ayar kaydedildi!" });
        setTimeout(() => setIkiAdimDurum({ tip: "", mesaj: "" }), 3000); 
      }
    } catch (error) {
      setIkiAdimDurum({ tip: "hata", mesaj: "Sunucu bağlantı hatası." });
    } finally {
      setIkiAdimYukleniyor(false);
    }
  };

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
        setAktifCihazlar(aktifCihazlar.filter(c => c.deviceId === mevcutCihazId));
        setIslemDurumu({ tip: "basari", mesaj: "Diğer tüm cihazlardaki oturumlarınız sonlandırıldı." });
      }
    } catch (error) {
      console.error("Çıkış işlemi başarısız:", error);
    } finally {
      setCikisYukleniyor(false);
    }
  };

 return (
    <> 
      <div className="min-h-screen bg-[#020617] text-white font-sans p-4 sm:p-6 lg:p-8 relative overflow-clip">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-[#00d2ff] blur-[250px] opacity-[0.05] pointer-events-none rounded-full"></div>

        <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-5 lg:gap-8 relative z-10 items-start">
          
          {/* SOL MENÜ */}
          <div className="w-full lg:w-[280px] shrink-0 flex flex-col gap-2 static lg:sticky lg:top-28 z-10">
            <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-xl">
              <nav className="flex flex-col gap-1.5">
                <Link href="/hesabim" className="flex items-center gap-3 px-4 py-3 sm:py-3.5 text-sm sm:text-base text-slate-400 hover:text-white hover:bg-white/[0.02] rounded-xl transition-all font-medium">
                  <User className="w-4 h-4 sm:w-5 sm:h-5" /> Profil
                </Link>
                
                <Link href="/cuzdan" className="flex items-center gap-3 px-4 py-3 sm:py-3.5 text-sm sm:text-base text-slate-400 hover:text-white hover:bg-white/[0.02] rounded-xl transition-all font-medium">
                  <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" /> Dijital Cüzdanım
                </Link>
                
                <Link href="/guvenlik" className="flex items-center gap-3 px-4 py-3 sm:py-3.5 bg-white/[0.05] border border-white/10 rounded-xl text-white font-bold shadow-inner transition-all text-sm sm:text-base">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" /> Güvenlik
                </Link>
              </nav>

              {/* MİSAFİR İSE GİRİŞ/KAYIT BUTONLARI ÇIKAR */}
              {status === "unauthenticated" && (
                <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col gap-2">
                  <Link href="/giris" className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-widest text-center transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                    <LogIn className="w-4 h-4" /> Giriş Yap
                  </Link>
                  <Link href="/kayit" className="w-full py-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-slate-700 hover:border-slate-500 text-slate-300 font-bold text-xs uppercase tracking-widest text-center transition-all flex items-center justify-center gap-2">
                    <UserPlus className="w-4 h-4" /> Kayıt Ol
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* SAĞ İÇERİK */}
          <div className="flex-1 flex flex-col min-w-0 gap-5 lg:gap-6 w-full">
            
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 sm:p-6 lg:p-8 shadow-xl relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/10 blur-[50px] pointer-events-none rounded-full"></div>
              <div className="flex items-center gap-3 sm:gap-4 relative z-10">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#020617] border border-cyan-500/30 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.2)] shrink-0">
                  <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />
                </div>
              <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight mb-0.5 sm:mb-1">Güvenlik Merkezi</h1>
                  {status === "unauthenticated" ? (
                    <p className="text-cyan-400/90 text-xs sm:text-sm font-medium">
                      Ayarlarınızı görüntülemek ve işlem yapabilmek için lütfen giriş yapınız.
                    </p>
                  ) : (
                    <p className="text-slate-400 text-xs sm:text-sm font-medium">
                      Hesabınızı 256-bit şifreleme ile koruyun.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
              
              {/* ŞİFRE YÖNETİMİ */}
              <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col h-full">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-slate-800/80">
                  <KeyRound className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                  <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">Şifre Yönetimi</h2>
                </div>

                <form onSubmit={handleSifreGuncelle} className="flex flex-col gap-3 sm:gap-4 flex-1">
                  <div>
                    <label className="block text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 sm:mb-1.5 ml-1">Mevcut Şifreniz</label>
                    <div className="relative">
                      <input 
                        type={gosterMevcut ? "text" : "password"} 
                        placeholder="••••••••" 
                        value={mevcutSifre}
                        onChange={(e) => setMevcutSifre(e.target.value)}
                        className="w-full bg-[#020617] border border-slate-800 focus:border-cyan-500/50 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 pr-10 text-white text-xs sm:text-sm outline-none transition-all focus:shadow-[0_0_15px_rgba(6,182,212,0.1)]" 
                      />
                      <button type="button" onClick={() => setGosterMevcut(!gosterMevcut)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition-colors">
                        {gosterMevcut ? <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 sm:mb-1.5 ml-1">Yeni Şifre</label>
                    <div className="relative">
                      <input 
                        type={gosterYeni ? "text" : "password"} 
                        placeholder="••••••••" 
                        value={sifre}
                        onChange={(e) => setSifre(e.target.value)}
                        className="w-full bg-[#020617] border border-slate-800 focus:border-cyan-500/50 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 pr-10 text-white text-xs sm:text-sm outline-none transition-all focus:shadow-[0_0_15px_rgba(6,182,212,0.1)]" 
                      />
                      <button type="button" onClick={() => setGosterYeni(!gosterYeni)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition-colors">
                        {gosterYeni ? <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                      </button>
                    </div>
                    <div className="h-1 sm:h-1.5 w-full bg-[#020617] rounded-full mt-1.5 sm:mt-2 overflow-hidden border border-slate-800">
                      <div className={`h-full transition-all duration-300 ${gucRengi}`} style={{ width: `${gucYuzdesi}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 sm:mb-1.5 ml-1">Yeni Şifre (Tekrar)</label>
                    <div className="relative">
                      <input 
                        type={gosterTekrar ? "text" : "password"} 
                        placeholder="••••••••" 
                        value={sifreTekrar}
                        onChange={(e) => setSifreTekrar(e.target.value)}
                        className="w-full bg-[#020617] border border-slate-800 focus:border-cyan-500/50 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 pr-10 text-white text-xs sm:text-sm outline-none transition-all focus:shadow-[0_0_15px_rgba(6,182,212,0.1)]" 
                      />
                      <button type="button" onClick={() => setGosterTekrar(!gosterTekrar)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition-colors">
                        {gosterTekrar ? <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="h-[44px] sm:h-[48px] mt-1 sm:mt-2 mb-1">
                    <div 
                      className={`h-full px-3 rounded-xl border flex items-center gap-2 text-[10px] sm:text-xs font-bold transition-colors duration-300 overflow-hidden ${
                        islemDurumu.mesaj 
                          ? (islemDurumu.tip === "hata" 
                              ? "bg-rose-500/10 border-rose-500/20 text-rose-400" 
                              : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400")
                          : "bg-emerald-500/5 border-emerald-500/10 text-emerald-400/60" 
                      }`}
                    >
                      {islemDurumu.mesaj ? (
                        <>
                          {islemDurumu.tip === "hata" ? <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" /> : <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />}
                          <span className="truncate">{islemDurumu.mesaj}</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 opacity-70" />
                          <span className="truncate">Öneri: Büyük harf, rakam ve sembol kullanın.</span>
                        </>
                      )}
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    disabled={yukleniyor}
                    className="mt-1 sm:mt-2 w-full py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-[10px] sm:text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)] disabled:opacity-50 flex justify-center items-center gap-2"
                  >
                    {yukleniyor ? <><Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" /> İŞLENİYOR...</> : "ŞİFREYİ GÜNCELLE"}
                  </button>
                </form>
              </div>

              {/* 2FA BÖLÜMÜ */}
              <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col h-full relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-[60px] pointer-events-none rounded-full"></div>
                
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-slate-800/80 relative min-h-[44px] sm:min-h-[52px]">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                  <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider pr-20 sm:pr-0">İki Adımlı Doğrulama</h2>
                  
                  <div className={`absolute right-0 top-0 sm:top-1 flex items-center gap-1.5 text-[9px] sm:text-[10px] text-cyan-400 font-bold uppercase tracking-widest bg-cyan-500/10 px-2 py-1 rounded-md border border-cyan-500/20 transition-all duration-300 ${
                    ikiAdimYukleniyor ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
                  }`}>
                    <Loader2 className="w-3 h-3 animate-spin" /> 
                    <span className="hidden sm:inline">Kaydediliyor...</span>
                    <span className="inline sm:hidden">Kayıt...</span>
                  </div>
                </div>

                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6">
                  Hesabınıza giriş yapıldığında şifrenize ek ekstra güvenlik katmanı sağlar. Tüm ayarlar anında otomatik kaydedilir.
                </p>

                <div className="flex flex-col gap-3 sm:gap-4 flex-1">
                  
                  {/* E-POSTA ONAYI */}
                  <div className={`flex items-center justify-between p-3 sm:p-4 rounded-xl border transition-all duration-300 ${ikiAdimEmail ? "bg-emerald-500/10 border-emerald-500/50" : "bg-[#020617] border-slate-800"}`}>
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${ikiAdimEmail ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800/50 text-slate-400"}`}>
                        <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-white">E-Posta Onayı</p>
                        <p className="text-[9px] sm:text-[10px] text-slate-500 font-medium">Girişlerde e-postanıza kod gelir.</p>
                      </div>
                    </div>
                    <button 
                      disabled={ikiAdimYukleniyor}
                      onClick={(e) => {
                        if (status === "unauthenticated") return kilitliIslem(e);
                        const yeniDurum = !ikiAdimEmail;
                        setIkiAdimEmail(yeniDurum);
                        handleOtomatikKaydet(yeniDurum, bildirimTercihi); 
                      }} 
                      className={`w-10 h-5 sm:w-12 sm:h-6 rounded-full relative transition-all duration-300 outline-none disabled:opacity-50 ${ikiAdimEmail ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]" : "bg-slate-700"}`}
                    >
                      <div className={`absolute top-0.5 sm:top-1 left-0.5 sm:left-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${ikiAdimEmail ? "translate-x-5 sm:translate-x-6" : "translate-x-0"}`}></div>
                    </button>
                  </div>
                </div>

                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-800">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300" />
                    <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">Giriş Bildirim Ayarları</h3>
                  </div>

                  <div className="flex flex-col gap-2 sm:gap-3">
                    
                    {/* TAM KARANTİNA */}
                    <button 
                      type="button"
                      disabled={ikiAdimYukleniyor}
                      onClick={(e) => {
                        if (status === "unauthenticated") return kilitliIslem(e);
                        const yeniDurum = bildirimTercihi === 'all' ? 'none' : 'all';
                        setBildirimTercihi(yeniDurum);
                        handleOtomatikKaydet(ikiAdimEmail, yeniDurum); 
                      }}
                      className={`flex items-center justify-between p-3 sm:p-4 rounded-xl border transition-all duration-300 disabled:opacity-50 ${bildirimTercihi === 'all' ? "bg-blue-500/10 border-blue-500/50" : "bg-[#020617] border-slate-800 hover:border-slate-700"}`}
                    >
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 ${bildirimTercihi === 'all' ? "bg-blue-500/20 text-blue-400" : "bg-slate-800 text-slate-500"}`}>
                          <i className="fa-solid fa-bell text-xs sm:text-sm"></i>
                        </div>
                        <div className="text-left">
                          <p className="text-xs sm:text-sm font-bold text-white">Tam Karantina</p>
                          <p className="text-[9px] sm:text-[10px] text-slate-500 font-medium">Kim girerse girsin anında mail at.</p>
                        </div>
                      </div>
                      <div className={`relative inline-flex h-5 sm:h-6 w-9 sm:w-11 items-center rounded-full transition-all duration-300 ${bildirimTercihi === 'all' ? 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.4)]' : 'bg-slate-700'}`}>
                        <span className={`inline-block h-3.5 sm:h-4 w-3.5 sm:w-4 transform rounded-full bg-white transition-transform duration-300 ${bildirimTercihi === 'all' ? 'translate-x-4 sm:translate-x-6' : 'translate-x-1'}`} />
                      </div>
                    </button>

                    {/* AKILLI MUHAFIZ */}
                    <button 
                      type="button"
                      disabled={ikiAdimYukleniyor}
                      onClick={(e) => {
                        if (status === "unauthenticated") return kilitliIslem(e);
                        const yeniDurum = bildirimTercihi === 'new_device' ? 'none' : 'new_device';
                        setBildirimTercihi(yeniDurum);
                        handleOtomatikKaydet(ikiAdimEmail, yeniDurum); 
                      }}
                      className={`flex items-center justify-between p-3 sm:p-4 rounded-xl border transition-all duration-300 disabled:opacity-50 ${bildirimTercihi === 'new_device' ? "bg-emerald-500/10 border-emerald-500/50" : "bg-[#020617] border-slate-800 hover:border-slate-700"}`}
                    >
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 ${bildirimTercihi === 'new_device' ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-500"}`}>
                          <i className="fa-solid fa-shield-halved text-xs sm:text-sm"></i>
                        </div>
                        <div className="text-left">
                          <p className="text-xs sm:text-sm font-bold text-white">Akıllı Muhafız</p>
                          <p className="text-[9px] sm:text-[10px] text-slate-500 font-medium">Sadece tanınmayan cihazda mail at.</p>
                        </div>
                      </div>
                      <div className={`relative inline-flex h-5 sm:h-6 w-9 sm:w-11 items-center rounded-full transition-all duration-300 ${bildirimTercihi === 'new_device' ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-slate-700'}`}>
                        <span className={`inline-block h-3.5 sm:h-4 w-3.5 sm:w-4 transform rounded-full bg-white transition-transform duration-300 ${bildirimTercihi === 'new_device' ? 'translate-x-4 sm:translate-x-6' : 'translate-x-1'}`} />
                      </div>
                    </button>
                  </div>
                </div>

                <div className="h-[48px] sm:h-[52px] mt-3 sm:mt-4">
                  <div 
                    className={`h-full px-3 rounded-xl border flex items-center gap-2 text-[10px] sm:text-xs font-bold transition-colors duration-300 overflow-hidden ${
                      ikiAdimDurum.mesaj 
                        ? (ikiAdimDurum.tip === "hata" 
                            ? "bg-rose-500/10 border-rose-500/20 text-rose-400" 
                            : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400")
                        : "bg-emerald-500/5 border-emerald-500/10 text-emerald-400/60" 
                    }`}
                  >
                    {ikiAdimDurum.mesaj ? (
                      <>
                        {ikiAdimDurum.tip === "hata" ? <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" /> : <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />}
                        <span className="truncate">{ikiAdimDurum.mesaj}</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 opacity-70" />
                        <span className="truncate">Ayarlar arasında geçiş yapın.</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* AKTİF CİHAZLAR RADARI */}
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-slate-800/80">
                <Laptop className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">Aktif Cihazlar Radarı</h2>
                <span className="ml-auto text-[8px] sm:text-[10px] bg-slate-800 text-slate-400 px-1.5 py-1 rounded font-bold uppercase tracking-widest">Son 30 Gün</span>
              </div>

              <div className="flex flex-col gap-2 sm:gap-3 max-h-[260px] overflow-y-auto pr-1 sm:pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-500">
                {cihazlarYukleniyor ? (
                  <div className="flex justify-center p-6 sm:p-8">
                    <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-500 animate-spin" />
                  </div>
       ) : aktifCihazlar.length === 0 ? (
                  <div className="text-center p-6 sm:p-8 text-xs sm:text-sm text-slate-500 font-medium">
                    {status === "unauthenticated" ? "Cihazlarınızı görüntülemek için lütfen giriş yapınız." : "Kayıtlı cihaz bulunamadı."}
                  </div>
                ) : (
                  (() => {
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
                      const enYeniMi = aktifSayilacakIdler.includes(cihaz.deviceId);
                      const aktifGozuksun = (buCihazMi || enYeniMi) && cihaz.isActive !== false;
                      
                      const isMobile = cihaz.deviceInfo.toLowerCase().includes('mobile') || cihaz.deviceInfo.toLowerCase().includes('android') || cihaz.deviceInfo.toLowerCase().includes('iphone');
                      
                      return (
                        <div key={cihaz.deviceId || index} className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-[#020617] border rounded-xl relative overflow-hidden group shrink-0 ${aktifGozuksun ? "border-emerald-500/30" : "border-slate-800"}`}>
                          {aktifGozuksun && <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>}
                          
                          <div className="flex items-start sm:items-center gap-3 sm:gap-4 pl-2 sm:pl-3">
                            <div className="relative shrink-0 mt-0.5 sm:mt-0">
                              {isMobile ? (
                                <Smartphone className={`w-6 h-6 sm:w-8 sm:h-8 ${aktifGozuksun ? "text-emerald-400" : "text-slate-600"}`} />
                              ) : (
                                <Laptop className={`w-6 h-6 sm:w-8 sm:h-8 ${aktifGozuksun ? "text-emerald-400" : "text-slate-600"}`} />
                              )}
                              
                              {aktifGozuksun && (
                                <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5 sm:h-3 sm:w-3">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-emerald-500 border border-[#020617]"></span>
                                </span>
                              )}
                            </div>
                            <div>
                              <p className={`text-xs sm:text-sm font-bold flex flex-wrap items-center gap-1.5 sm:gap-2 ${aktifGozuksun ? "text-white" : "text-slate-500"}`}>
                                {cihazAdiniCevir(cihaz.deviceInfo)}
                                {buCihazMi && <span className="text-[8px] sm:text-[9px] bg-emerald-500/10 text-emerald-400 px-1 sm:px-1.5 py-0.5 rounded font-black uppercase tracking-widest border border-emerald-500/20">Bu Cihaz</span>}
                              </p>
                              <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1 flex items-center gap-1 sm:gap-3 flex-wrap">
                                <span className="flex items-center gap-1 sm:gap-1.5">
                                  <MapPin className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${aktifGozuksun ? "text-emerald-400" : "text-slate-600"}`} /> 
                                  {cihaz.location || "Bilinmeyen Konum"} ({cihaz.ipAddress})
                                </span>
                                <span className="hidden sm:inline">|</span>
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
                <div className="mt-4 sm:mt-6 flex justify-end">
                  <button 
                    onClick={() => {
                      if (status === "unauthenticated") return kilitliIslem();
                      handleDigerCihazlardanCikis();
                    }}
                    disabled={cikisYukleniyor}
                    className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-red-950/40 border border-red-900/50 hover:bg-red-900/60 text-red-400 transition-all font-black text-[9px] sm:text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(220,38,38,0.1)] disabled:opacity-50"
                  >
                    {cikisYukleniyor ? <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" /> : <PowerOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                    Diğer Tüm Cihazlardan Çıkış Yap
                  </button>
                </div>
              )}
            </div>

            {/* HESAP İŞLEMLERİ */}
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-slate-800/80">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">Hesap İşlemleri</h2>
              </div>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 max-w-2xl">
                Hesabınızı geçici olarak dondurabilir veya kişisel verilerinizle birlikte kalıcı olarak silebilirsiniz. Silme işlemi geri alınamaz; sipariş kayıtlarınız yasal zorunluluk gereği saklanır.
              </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button 
                  onClick={(e) => {
                    if (status === "unauthenticated") return kilitliIslem(e);
                    setIslemModali({acik: true, tur: 'dondur'})
                  }}
                  className="flex-1 flex justify-center items-center gap-1.5 sm:gap-2 py-3 sm:py-4 rounded-xl bg-[#020617] border border-slate-800 hover:bg-slate-800/50 text-white font-bold text-[10px] sm:text-xs uppercase tracking-wider transition-all group"
                >
                  <Snowflake className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500 group-hover:text-blue-400 transition-colors" /> 
                  Hesabımı Dondur
                </button>

                <button 
                  onClick={(e) => {
                    if (status === "unauthenticated") return kilitliIslem(e);
                    setIslemModali({acik: true, tur: 'sil'})
                  }}
                  className="flex-1 flex justify-center items-center gap-1.5 sm:gap-2 py-3 sm:py-4 rounded-xl bg-red-950/20 border border-red-900/30 hover:bg-red-900/50 text-red-400 transition-all font-bold text-[9px] sm:text-xs uppercase tracking-widest group"
                >
                  <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" /> 
                  Hesabımı Kalıcı Olarak Sil
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
      
      {/* 🚀 ŞİFRELİ GÜVENLİK ONAY PENCERESİ */}
      <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        islemModali.acik ? 'opacity-100 pointer-events-auto backdrop-blur-md bg-black/70' : 'opacity-0 pointer-events-none'
      }`}>
        <div className={`bg-[#0f172a] border ${islemModali.tur === 'sil' ? 'border-red-900/50' : 'border-slate-800'} rounded-2xl p-5 sm:p-6 max-w-md w-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform transition-all duration-300 relative overflow-hidden ${
          islemModali.acik ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}>
          
          <div className={`absolute -top-10 -right-10 w-32 h-32 blur-[40px] rounded-full pointer-events-none ${islemModali.tur === 'sil' ? 'bg-red-500/10' : 'bg-blue-500/10'}`}></div>

          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${
              islemModali.tur === 'sil' ? 'bg-red-500/10 border-red-500/20' : 'bg-blue-500/10 border-blue-500/20'
            }`}>
              {islemModali.tur === 'sil' ? (
                <Trash2 className="w-5 h-5 text-red-400 animate-pulse" />
              ) : (
                <Snowflake className="w-5 h-5 text-blue-400 animate-pulse" />
              )}
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-wider">
                {islemModali.tur === 'sil' ? 'Hesabı Kalıcı Olarak Sil' : 'Hesabınızı Dondurun'}
              </h3>
              <p className={`text-[10px] sm:text-xs font-medium ${islemModali.tur === 'sil' ? 'text-red-400' : 'text-slate-400'}`}>
                {islemModali.tur === 'sil' ? 'Bu işlem geri alınamaz!' : 'Geçici bir süre aramızdan ayrılın.'}
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed bg-[#020617] p-3 rounded-xl border border-slate-900 mb-5 relative z-10">
            {islemModali.tur === 'sil' 
              ? 'Profiliniz, adresleriniz, favorileriniz, yorumlarınız, sepetiniz, destek talepleriniz ve kayıtlı sistemleriniz kalıcı olarak silinecektir. Sipariş kayıtlarınız yasal zorunluluk gereği korunur. Devam etmek için mevcut şifrenizi girin.' 
              : 'Hesabınız geçici olarak dondurulacaktır. Devam etmek için lütfen şifrenizi girerek bu işlemin size ait olduğunu doğrulayın.'}
          </p>

          {islemBasariliMesaj ? (
            <div className="flex flex-col items-center justify-center py-6 text-center relative z-10">
              <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-emerald-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-wider mb-2">İŞLEM ONAYLANDI</h3>
              <p className="text-sm font-medium text-emerald-400">{islemBasariliMesaj}</p>
            </div>
          ) : (
            <>
              <div className="mb-6 relative z-10">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Mevcut Şifreniz</label>
                <input 
                  type="password" 
                  value={islemSifresi}
                  onChange={(e) => {
                    setIslemSifresi(e.target.value);
                    setIslemHata(""); 
                  }}
                  placeholder="Şifrenizi girin..."
                  className={`w-full bg-[#020617] border ${islemHata ? 'border-red-500/50 focus:border-red-500' : islemModali.tur === 'sil' ? 'focus:border-red-500 border-slate-800' : 'focus:border-blue-500 border-slate-800'} rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors`}
                />
                
                {islemHata && (
                  <div className="mt-3 p-2.5 rounded-lg bg-red-950/40 border border-red-900/50 text-red-400 text-[11px] font-medium flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {islemHata}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2.5 relative z-10">
                <button 
                  onClick={() => {
                    setIslemModali({acik: false, tur: 'dondur'});
                    setIslemSifresi("");
                    setIslemHata(""); 
                  }}
                  disabled={islemYukleniyor}
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-800 bg-transparent hover:bg-slate-800/30 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-all disabled:opacity-50"
                >
                  İptal
                </button>
                <button 
                  disabled={islemYukleniyor || islemSifresi.length < 6}
                  onClick={async () => {
                    setIslemYukleniyor(true);
                    setIslemHata(""); 
                    
                    try {
                      const response = await fetch('/api/guvenlik/hesap-islem', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ islem: islemModali.tur, sifre: islemSifresi })
                      });

                      const data = await response.json();

                      if (!response.ok) {
                        throw new Error(data.hata || "Bir hata oluştu şefim!");
                      }

                      setIslemBasariliMesaj(
                        islemModali.tur === 'sil' 
                        ? (data.mesaj || "Hesabınız silindi. Sipariş kayıtlarınız yasal zorunluluk gereği korunmaktadır.")
                        : "Hesabınız başarıyla dondurulmuştur. İyi günler dileriz."
                      );
                      
                      setTimeout(async () => {
                        await signOut({ redirect: false });
                        window.location.href = '/giris'; 
                      }, 2000);
                      
                    } catch (error: any) {
                      setIslemHata(error.message); 
                    } finally {
                      setIslemYukleniyor(false);
                    }
                  }}
                  className={`flex-1 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2 ${
                    islemModali.tur === 'sil' 
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500' 
                    : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500'
                  }`}
                >
                  {islemYukleniyor 
                    ? <Loader2 className="w-4 h-4 animate-spin" /> 
                    : (islemModali.tur === 'sil' ? 'Kalıcı Olarak Sil' : 'Hesabı Dondur')}
                </button>
              </div>
            </>
          )}

        </div>
      </div>
      
      {/* 🚀 MİSAFİRLERİ ENGELLEYEN ŞIK UYARI MODALI (KİLİT EKRANI) */}
      {girisSartModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-8 max-w-sm w-full text-center shadow-[0_0_50px_rgba(6,182,212,0.15)] relative animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-[#020617] rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-500/30">
              <ShieldCheck className="w-8 h-8 text-cyan-400" />
            </div>
            <h3 className="text-xl font-black text-white mb-2 tracking-tight">Erişim Kısıtlı</h3>
            <p className="text-slate-400 text-sm mb-6">
              Lütfen işlem yapabilmek ve hesap detaylarınızı görüntüleyebilmek için giriş yapınız.
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/giris" className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                <LogIn className="w-4 h-4" /> Giriş Yap
              </Link>
              <button onClick={() => setGirisSartModal(false)} className="w-full py-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-slate-700 text-slate-300 font-bold text-xs uppercase tracking-widest transition-all">
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}