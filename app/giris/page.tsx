"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, ArrowLeft, ArrowRight, UserCircle2, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import AuthShell, { authBtnPrimaryClass, authBtnSecondaryClass, authDividerClass, authFormGapClass, authInputClass, authSubtitleClass, authTitleClass } from "@/components/auth/AuthShell";

// 🚀 BÜTÜN KODLARINI GÜVENLİ BİR KUTUYA ALDIK
function GirisIcerik() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
  
  const [step, setStep] = useState(1);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [waitingForApproval, setWaitingForApproval] = useState(false); 
  const [otoGirisTetikle, setOtoGirisTetikle] = useState(false); 
  
  const router = useRouter();

  const searchParams = useSearchParams();
  const urlMessage = searchParams?.get("message");
  const urlError = searchParams?.get("error");
  const urlAlert = searchParams?.get("alert");
  
  // 🚀 YENİ SİNYALLER: Google ile mi gelmiş? E-postası neymiş?
  const urlProvider = searchParams?.get("provider"); 
  const urlUserMail = searchParams?.get("userMail"); 

  const toastAyari = { 
    position: 'top-center' as const, 
    style: { textAlign: 'center' as const } 
  };

  useEffect(() => {
    if (urlMessage === "device_approved") {
      toast.success("Cihazınız başarıyla doğrulandı. Sisteme güvenle giriş yapabilirsiniz.", { ...toastAyari, duration: 5000 });
    }
    if (urlAlert === "security_breach") {
      toast.error("Güvenliğiniz için bu giriş işlemi sistem tarafından iptal edilmiştir.", { ...toastAyari, duration: 5000 });
    }
    if (urlError === "token_expired") {
      toast.error("Doğrulama bağlantısının süresi dolmuştur. Lütfen tekrar giriş yapmayı deneyiniz.", { ...toastAyari, duration: 5000 });
    }
    if (urlError && (urlError.includes("Cihaz") || urlError.includes("Karantina"))) {
      toast.error("Güvenliğiniz için cihaz onayı gerekiyor. Lütfen e-postanıza gönderilen bağlantıya tıklayınız.", { ...toastAyari, duration: 8000 });
    }
    if (urlError?.includes("dondurulmus")) {
      toast.error("Hesabınız dondurulmuş. Yeniden erişim için destek ekibiyle iletişime geçin.", { ...toastAyari, duration: 6000 });
    }
  }, [urlMessage, urlAlert, urlError]);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault(); 

    const loadingToast = toast.loading(step === 1 ? "Bilgileriniz kontrol ediliyor..." : "Güvenlik kodu doğrulanıyor...", toastAyari);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        code: step === 2 ? twoFactorCode : undefined,
        redirect: false,
      });

      if (res?.error) {
        toast.dismiss(loadingToast);
        
        if (res.error === "2FA_REQUIRED") {
          setStep(2); 
          toast.success("E-posta adresinize 6 haneli güvenlik kodunuz gönderilmiştir.", { ...toastAyari, duration: 5000 });
        } 
        else if (res.error.includes("Cihaz") || res.error.includes("KARANTINA")) {
          setWaitingForApproval(true); 
          toast.error("Güvenliğiniz için cihaz onayı gerekiyor. Lütfen e-postanıza gönderilen bağlantıya tıklayınız. (Bağlantı 15 dakika geçerlidir)", { ...toastAyari, duration: 8000 });
        } 
        else {
          toast.error(res.error, { ...toastAyari, duration: 4000 }); 
        }
      } else {
        toast.dismiss(loadingToast);
        toast.success("Giriş işlemi başarılı. Hesabınıza yönlendiriliyorsunuz...", { ...toastAyari, duration: 3000 });
        router.refresh();
        router.push("/");
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Sunucuya bağlanırken beklenmeyen bir hata oluştu.", toastAyari);
    }
  };

  useEffect(() => {
    if (otoGirisTetikle) {
      handleLogin(); 
      setOtoGirisTetikle(false); 
    }
  }, [otoGirisTetikle]);

  // 🚀 ROBOTUN GOOGLE VERSİYONU: Artık Google girişlerinde de alarm zili çalıyor!
  useEffect(() => {
    let kontrolAraligi: NodeJS.Timeout;

    const onayBekliyorMu = waitingForApproval || (urlError && (urlError.includes("Cihaz") || urlError.includes("Karantina")));
    
    // Kutudaki e-posta boşsa (Google girişiyse), URL'den gelen gizli e-postayı takip et!
    const takipEdilecekEmail = email || urlUserMail; 

    if (onayBekliyorMu && takipEdilecekEmail) {
      kontrolAraligi = setInterval(async () => {
        try {
          const res = await fetch(`/api/auth/check-device-status?email=${encodeURIComponent(takipEdilecekEmail)}`);
          if (res.ok) {
            const data = await res.json();

            if (data.approved) {
              clearInterval(kontrolAraligi); 
              setWaitingForApproval(false);
              toast.success("Cihaz onayı telefondan alındı! Otomatik giriş yapılıyor...", { ...toastAyari, duration: 4000 });
              
              // 🎯 SİHİR BURADA: Adam Google ile geldiyse robot Google'ı tetikler!
              if (urlProvider === "google") {
                signIn('google', { callbackUrl: '/' });
              } else if (urlProvider === "facebook") {
                signIn('facebook', { callbackUrl: '/' });
              } else {
                setOtoGirisTetikle(true); // Normal e-postaysa normal robotu uyandır
              }
            }
          }
        } catch (err) {
          console.error("Cihaz durumu sorgulanırken hata oluştu.");
        }
      }, 2500); 
    }

    return () => {
      if (kontrolAraligi) clearInterval(kontrolAraligi);
    };
  }, [urlError, waitingForApproval, email, urlUserMail, urlProvider]); 

  return (
    <AuthShell>
      <div className="flex flex-col h-full min-h-0 lg:h-auto lg:block">
        <div className="shrink-0">
          <h1 className={`${authTitleClass} mb-1 border-l-2 border-white/30 pl-3`}>
            GİRİŞ <span className="text-white/60">YAP</span>
          </h1>
          <p className={`${authSubtitleClass} mb-2 lg:mb-6`}>
            <span className="lg:hidden">
              {step === 1 ? "Hesabınıza giriş yapın." : "Ek güvenlik doğrulaması gerekli."}
            </span>
            <span className="hidden lg:inline">
              {step === 1
                ? "Güvenli alışveriş ve sipariş takibi için hesabınıza giriş yapın. Eğer hesabınız yoksa hızlıca kayıt olabilirsiniz."
                : "Hesabınızın güvenliği için ekstra doğrulama gerekiyor."}
            </span>
          </p>
        </div>

        <div className="flex-1 min-h-0 flex flex-col justify-center lg:flex-none lg:block">
{/* SADECE 1. ADIMDA (ŞİFRE EKRANINDA) GÖRÜNEN GOOGLE BUTONU */}
       {step === 1 && (
        <div className="w-full mb-1 lg:mb-4">
          <button
            type="button"
          onClick={() => {
  toast.loading("Google ile güvenli bağlantı kuruluyor. Lütfen bekleyin...", { duration: 5000, position: 'top-center', style: { textAlign: 'center' } });
  setTimeout(() => {
    signIn('google', { callbackUrl: '/' });
  }, 150);
}}
            className={authBtnSecondaryClass}
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 19.34 0 24s.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              <path fill="none" d="M0 0h48v48H0z"/>
            </svg>
            <span className="text-xs lg:text-sm font-bold text-white tracking-wide">Google ile Giriş Yap</span>
          </button>
          
          <div className={authDividerClass}>
            <div className="h-px bg-white/10 flex-1"></div>
            <span className="text-slate-500 text-[10px] lg:text-xs font-bold uppercase tracking-widest">Veya E-Posta</span>
            <div className="h-px bg-white/10 flex-1"></div>
          </div>
        </div>
       )}

        <form onSubmit={handleLogin} className={`${authFormGapClass} mb-0 lg:mb-2`}>
          
          {/* 🚀 VİTES 1: NORMAL ŞİFRE KUTULARI */}
          {step === 1 && (
            <div className={`${authFormGapClass}`}>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-Posta Adresiniz" 
                  className={authInputClass}
                  required 
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Şifreniz" 
                  className={`${authInputClass} pr-12`}
                  required 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="flex justify-end">
                 <Link href="/sifre-sifirla" className="text-xs text-slate-400 hover:text-white transition-colors">
                    Şifremi unuttum
                 </Link>
              </div>
            </div>
          )}

          {/* 🚀 VİTES 2: GİZLİ 2FA KOD KUTUSU */}
          {step === 2 && (
            <div className={`${authFormGapClass} bg-white/[0.03] border border-white/10 p-4 lg:p-6 rounded-2xl backdrop-blur-sm`}>
              <div className="flex justify-center">
                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 lg:w-8 lg:h-8 text-white/80" />
                </div>
              </div>
              <p className="text-center text-xs lg:text-sm text-slate-300">
                <strong className="text-white">{email}</strong> adresine gönderdiğimiz 6 haneli kodu girin.
              </p>
              
              <div className="relative">
                <input 
                  type="text" 
                  maxLength={6}
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))} // Sadece sayı girmesine izin verir
                  placeholder="000000" 
                  className="w-full bg-black/40 border border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] rounded-xl py-3 lg:py-4 text-center tracking-[0.5em] text-xl lg:text-2xl font-black text-white placeholder-slate-600 focus:outline-none focus:border-white/40 focus:shadow-[0_0_25px_rgba(255,255,255,0.06)] transition-all"
                  required 
                />
              </div>

              <button 
                type="button" 
                onClick={() => setStep(1)} 
                className="flex items-center justify-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft size={14} /> Geri Dön ve Şifreyi Değiştir
              </button>
            </div>
          )}

       {/* AKILLI BUTON (Vitese Göre Yazısı Değişir) */}
       <button
         type="submit"
         className={`${authBtnPrimaryClass} mt-1 lg:mt-2`}
       >
         {step === 1 ? "GİRİŞ YAP" : "KODU DOĞRULA VE GİRİŞ YAP"}
       </button>
        </form>
        </div>

        {step === 1 && (
          <div className="shrink-0 pt-2 lg:pt-0">
            <div className="text-center mb-2 lg:mb-4 lg:mt-4">
              <p className="text-slate-400 text-xs lg:text-sm">
                Hesabınız yok mu? <Link href="/kayit" className="text-white font-bold hover:underline underline-offset-4">Kayıt Ol</Link>
              </p>
            </div>

            <div className="pt-2 lg:pt-6 border-t border-white/10 lg:mt-6">
              <Link
                href="/"
                prefetch={true}
                className={`${authBtnSecondaryClass} py-2.5 lg:py-3`}
              >
                <UserCircle2 size={16} className="text-slate-400 group-hover:text-white transition-colors" />
                <span className="text-slate-300 group-hover:text-white font-medium text-xs lg:text-sm transition-colors">
                  Üye Olmadan Devam Et
                </span>
                <ArrowRight size={14} className="text-slate-500 group-hover:translate-x-1 group-hover:text-white transition-all" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </AuthShell>
  );
}

// 🚀 VERCEL'İ ÇÖKMEKTEN KURTARAN ANA KALKAN (SUSPENSE)
export default function GirisPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white/60 font-black uppercase tracking-widest text-sm animate-pulse">Güvenli Bağlantı Kuruluyor...</div>}>
      <GirisIcerik />
    </Suspense>
  );
}