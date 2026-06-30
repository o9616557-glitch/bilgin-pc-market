"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, ArrowLeft, Eye, EyeOff, Info, X, CheckCircle2 } from "lucide-react";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import AuthShell, { authBtnPrimaryClass, authBtnSecondaryClass, authInputClass, authSubtitleClass, authTitleClass } from "@/components/auth/AuthShell";

export default function KayitPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
  const [isLoading, setIsLoading] = useState(false);
  
  const [showInfoModal, setShowInfoModal] = useState(false);
  
  const router = useRouter();

  // 🚀 YENİ EKLENDİ: Google Butonuna Tıklanınca Çalışacak Motor 🚀
  const handleGoogleSignIn = () => {
    setIsLoading(true); // Tüm butonları kilitle ki çift tıklamasın
   toast.loading("Google ile güvenli bağlantı kuruluyor. Lütfen bekleyin...", { position: "top-center", style: { marginTop: "40vh" } });
    signIn('google', { callbackUrl: '/' }); // Google'a yönlendir
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🚀 ŞİFRE GÜVENLİK RADARI 🚀
    if (password.length < 5) {
      toast.error("Şifreniz en az 5 karakter uzunluğunda olmalıdır!");
      return; 
    }
    if (!/[a-zA-Z]/.test(password)) {
      toast.error("Şifrenizde en az bir tane harf bulunmalıdır!");
      return; 
    }
    if (!/[0-9]/.test(password)) {
      toast.error("Şifrenizde en az bir tane rakam bulunmalıdır!");
      return; 
    }
    const siraliKontrol = /(0123|1234|2345|3456|4567|5678|6789|9876|8765|7654|6543|5432|4321|3210|abcd|bcde|cdef|defg|efgh|fghi|ghij|hijk|ijkl|jklm|klmn|lmno|mnop|nopq|opqr|pqrs|qrst|rstu|stuv|tuvw|uvwx|vwxy|wxyz|zyxw|yxwv|xwvu|wvut|vuts|utsr|tsrq|srqp|rqpo|qpon|ponm|onml|nmlk|mlkj|lkji|kjih|jihg|ihgf|hgfe|gfed|fedc|edcb|dcba)/i;
    
    if (siraliKontrol.test(password)) {
      toast.error("Şifreniz '1234' veya 'abcd' gibi peş peşe sıralı karakterler içeremez!");
      return;
    }
    // 🚀 RADAR BİTİŞİ 🚀

    setIsLoading(true);
    const loadingToast = toast.loading("Kayıt oluşturuluyor...");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.dismiss(loadingToast);
        toast.success("Kayıt başarılı! Lütfen e-postanıza giderek hesabınızı onaylayın.", { duration: 5000 });
        router.push("/giris");
      } else {
        toast.dismiss(loadingToast);
        toast.error(data.message || "Bir hata oluştu.");
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Sunucuya bağlanırken bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
    <AuthShell>
        <h1 className={`${authTitleClass} mb-2 border-l-2 border-white/30 pl-4`}>
          YENİ <span className="text-white/60">KAYIT</span>
        </h1>
        <p className={`${authSubtitleClass} mb-6 sm:mb-8`}>
          Bilgin PC Market'e katılın ve avantajlardan yararlanın.
        </p>
        
        {/* ✅ GOOGLE KAYIT MOTORU (Yükleme Animasyonlu ve Kilit Korumalı) ✅ */}
        <div className="w-full mb-6">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className={`${authBtnSecondaryClass} disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 19.34 0 24s.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              <path fill="none" d="M0 0h48v48H0z"/>
            </svg>
            <span className="text-sm font-bold text-white tracking-wide">Google ile Kayıt Ol</span>
          </button>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="h-px bg-white/10 flex-1"></div>
          <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Veya E-Posta İle</span>
          <div className="h-px bg-white/10 flex-1"></div>
        </div>

        {/* KAYIT FORMU */}
        <form onSubmit={handleRegister} className="flex flex-col gap-4 mb-6">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Adınız Soyadınız" 
              className={authInputClass}
              required 
            />
          </div>

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
              className={`${authInputClass} pr-20`}
              required 
            />
            
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
              <button 
                type="button" 
                onClick={() => setShowInfoModal(true)} 
                className="text-slate-500 hover:text-white transition-colors"
                title="Şifre Kuralları"
              >
                <Info size={18} />
              </button>
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`${authBtnPrimaryClass} mt-2`}
          >
            {isLoading ? "KAYIT OLUŞTURULUYOR..." : "KAYIT OL"}
          </button>
        </form>

        <div className="text-center">
          <p className="text-slate-400 text-sm">
            Zaten hesabınız var mı? <Link href="/giris" className="text-white font-bold hover:underline underline-offset-4">Giriş Yap</Link>
          </p>
        </div>
      </AuthShell>

      {/* 🚀 ŞİFRE KURALLARI BİLGİLENDİRME PENCERESİ (MODAL) 🚀 */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative overflow-hidden border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-black/80 backdrop-blur-2xl">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
            <button 
              onClick={() => setShowInfoModal(false)} 
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <Lock className="text-white/70" size={20} />
              Şifre Kuralları
            </h3>
            
            <p className="text-sm text-slate-400 mb-5 leading-relaxed">
              Hesabınızın güvenliği bizim için önemli. Lütfen şifrenizi belirlerken aşağıdaki kurallara dikkat ediniz:
            </p>
            
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2 text-sm text-slate-300">
                <CheckCircle2 size={16} className="text-white/60 mt-0.5 shrink-0" />
                <span>En az <strong className="text-white font-semibold">5 karakter</strong> uzunluğunda olmalıdır.</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-300">
                <CheckCircle2 size={16} className="text-white/60 mt-0.5 shrink-0" />
                <span>İçerisinde en az <strong className="text-white font-semibold">bir harf</strong> bulunmalıdır.</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-300">
                <CheckCircle2 size={16} className="text-white/60 mt-0.5 shrink-0" />
                <span>İçerisinde en az <strong className="text-white font-semibold">bir rakam</strong> bulunmalıdır.</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-300">
                <CheckCircle2 size={16} className="text-white/60 mt-0.5 shrink-0" />
                <span>"1234" veya "abcd" gibi <strong className="text-white font-semibold">ardışık sıralı</strong> karakterler içermemelidir.</span>
              </li>
            </ul>
            
            <button 
              onClick={() => setShowInfoModal(false)} 
              className="w-full py-3 bg-white/[0.06] hover:bg-white/10 text-white border border-white/15 rounded-xl text-sm font-bold transition-colors"
            >
              Tamamdır, Teşekkürler
            </button>
          </div>
        </div>
      )}

    </>
  );
}