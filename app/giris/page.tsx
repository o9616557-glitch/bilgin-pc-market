"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowLeft, ArrowRight, UserCircle2, Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast"; // 🚀 Modern bildirim motorumuz!

export default function GirisPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 🚀 Şifre göster/gizle motoru
  
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Yükleniyor bildirimi başlat
    const loadingToast = toast.loading("Giriş yapılıyor...");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        // Hata varsa çarpı işaretiyle şık mesaj
        toast.dismiss(loadingToast);
        toast.error(res.error);
      } else {
        // Başarılıysa tik işaretiyle şık mesaj
        toast.dismiss(loadingToast);
        toast.success("Giriş başarılı! Yönlendiriliyorsunuz...");
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Sunucuya bağlanırken bir hata oluştu.");
    }
  };

  return (
    <div className="min-h-screen bg-[#050814] text-white flex items-center justify-center p-0 md:p-4 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#3b82f6] rounded-full mix-blend-screen filter blur-[150px] opacity-10"></div>
      
     <div className="w-full max-w-md bg-[#09090b] border-none md:border border-white/10 rounded-none md:rounded-2xl p-6 md:p-8 min-h-screen md:min-h-[auto] flex flex-col justify-center shadow-2xl relative z-10">
        
        {/* BİLGİN PC LOGO (Orijinal İki Renkli Tasarım) */}
          <div className="flex flex-col items-center justify-center w-full mb-8 shrink-0 mt-8 md:mt-0">
            <div className="flex items-center gap-2 text-3xl font-black uppercase tracking-tight drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]">
              <span className="text-white">BİLGİN</span>
              <span className="text-[#3b82f6]">PC</span>
            </div>
            <div className="h-[2px] w-12 bg-[#3b82f6]/50 mt-2"></div>
          </div>

          {/* GİRİŞ YAP BAŞLIĞI VE ALT YAZISI (Eski Kibar Haline Döndü, Hiçbir Şey Silinmedi) */}
         <h1 className="text-lg sm:text-xl font-bold uppercase tracking-wide text-white drop-shadow-md mb-2 border-l-4 border-[#3b82f6] pl-4">
           GİRİŞ <span className="text-[#3b82f6] font-black">YAP</span>
          </h1>
          <p className="text-slate-400 text-sm mb-8 font-medium">
            Güvenli alışveriş ve sipariş takibi için hesabınıza giriş yapın.Eger hesabınız yoksa hızlıca kayıt olabilirsiniz.
          </p>
       {/* ✅ TERTEMİZ VE RENKLİ GOOGLE GİRİŞ MOTORU ✅ */}
    <div className="w-full mb-6">
      <button
        type="button"
        onClick={() => signIn('google', { callbackUrl: '/' })}
        className="w-full hover:bg-white/5 border border-white/10 py-3.5 rounded-xl flex items-center justify-center gap-3 transition-all group shadow-md hover:shadow-white/5 hover:border-white/30"
      >
        {/* 🔥 ŞEFİN İSTEĞİ ÜZERİNE 4 RENKLİ ORİJİNAL GOOGLE SİMGESİ 🔥 */}
        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 19.34 0 24s.92 7.54 2.56 10.78l7.97-6.19z"/>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          <path fill="none" d="M0 0h48v48H0z"/>
        </svg>
        <span className="text-sm font-bold text-white tracking-wide">Google ile Giriş Yap</span>
      </button>
    </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="h-px bg-white/10 flex-1"></div>
          <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Veya E-Posta İle</span>
          <div className="h-px bg-white/10 flex-1"></div>
        </div>

        {/* GİRİŞ FORMU */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4 mb-2">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-Posta Adresiniz" 
              className="w-full bg-[#050814] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#3b82f6]/50 transition-colors"
              required 
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type={showPassword ? "text" : "password"} // 🚀 Şifre göster/gizle dinamiği
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifreniz" 
              className="w-full bg-[#050814] border border-white/10 rounded-xl py-3 pl-12 pr-12 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#3b82f6]/50 transition-colors"
              required 
            />
            {/* GÖZ İKONU BUTONU */}
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* ŞİFREMİ UNUTTUM LİNKİ */}
          <div className="flex justify-end mb-2">
             <Link href="/sifre-sifirla" className="text-xs text-slate-400 hover:text-[#3b82f6] transition-colors">
                Şifremi unuttum
             </Link>
          </div>

          <button type="submit" className="w-full bg-[#3b82f6] text-black rounded-xl py-3.5 font-black uppercase tracking-widest hover:bg-[#00c4db] transition-all shadow-[0_0_20px_rgba(0,229,255,0.2)]">
            GİRİŞ YAP
          </button>
        </form>

        <div className="text-center mb-6 mt-4">
          <p className="text-slate-400 text-sm">
            Hesabınız yok mu? <Link href="/kayit" className="text-[#3b82f6] font-bold hover:underline">Yeni Kayıt Oluştur</Link>
          </p>
        </div>

     <div className="pt-6 border-t border-white/10 mt-6">
      <Link 
        href="/" 
        prefetch={true} 
        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 flex items-center justify-center gap-2 group hover:bg-white/10 transition-all duration-100 active:scale-95"
      >
        <UserCircle2 size={18} className="text-slate-400 group-hover:text-[#3b82f6] transition-colors duration-100" />
        <span className="text-slate-300 group-hover:text-white font-medium transition-colors duration-100">
          Üye Olmadan Devam Et
        </span>
        <ArrowRight size={16} className="text-slate-500 group-hover:translate-x-1 group-hover:text-[#3b82f6] transition-all duration-100" />
      </Link>
    </div>
    </div>
    </div>
  );
}