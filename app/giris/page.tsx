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
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#00e5ff] rounded-full mix-blend-screen filter blur-[150px] opacity-10"></div>
      
     <div className="w-full max-w-md bg-[#09090b] border-none md:border border-white/10 rounded-none md:rounded-2xl p-6 md:p-8 min-h-screen md:min-h-[auto] flex flex-col justify-center shadow-2xl relative z-10">
        
        {/* BİLGİN PC LOGO (Orijinal İki Renkli Tasarım) */}
          <div className="flex flex-col items-center justify-center w-full mb-8 shrink-0 mt-8 md:mt-0">
            <div className="flex items-center gap-2 text-3xl font-black uppercase tracking-tight drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]">
              <span className="text-white">BİLGİN</span>
              <span className="text-[#00e5ff]">PC</span>
            </div>
            <div className="h-[2px] w-12 bg-[#00e5ff]/50 mt-2"></div>
          </div>

          {/* GİRİŞ YAP BAŞLIĞI VE ALT YAZISI (Eski Kibar Haline Döndü, Hiçbir Şey Silinmedi) */}
         <h1 className="text-2xl sm:text-3xl font-black tracking-tighter mb-2 text-white">
            Giriş Yap
          </h1>
          <p className="text-slate-400 text-sm mb-8 font-medium">
            Güvenli alışveriş ve sipariş takibi için hesabınıza giriş yapın.Eger hesabınız yoksa hızlıca kayıt olabilirsiniz.
          </p>
        {/* SOSYAL MEDYA BUTONLARI */}
        <div className="flex gap-3 mb-6">
          <button 
            type="button" 
            onClick={() => signIn('google', { callbackUrl: '/' })} 
            className="flex-1 hover:bg-white/10 border border-white/10 py-3 rounded-xl flex items-center justify-center gap-2 transition-all group"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1 2.53-2 3.46v2.87h3.18c1.86-1.71 2.94-4.23 2.94-7.34z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.18-2.87c-.98.66-2.23 1.05-4.1 1.05-3.16 0-5.84-2.14-6.8-5.01H1.93v2.92C3.76 20.08 7.55 23 12 23z" fill="#34A853"/><path d="M5.2 13.51c-.24-.71-.38-1.47-.38-2.26s.14-1.55.38-2.26V6.07H1.93C1.34 7.25 1 8.58 1 10s.34 2.75.93 3.93l3.27-2.42z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.55 1 3.76 3.92 1.93 7.5l3.27 2.42c.96-2.87 3.64-5.01 6.8-5.01z" fill="#EA4335"/></svg>
            <span className="text-sm font-bold text-white">Google</span>
          </button>
          <button 
            type="button" 
            onClick={() => signIn('facebook', { callbackUrl: '/' })} 
            className="flex-1 hover:bg-white/10 border border-white/10 py-3 rounded-xl flex items-center justify-center gap-2 transition-all group text-[#1877F2]"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            <span className="text-sm font-bold text-white">Facebook</span>
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
              className="w-full bg-[#050814] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00e5ff]/50 transition-colors"
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
              className="w-full bg-[#050814] border border-white/10 rounded-xl py-3 pl-12 pr-12 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00e5ff]/50 transition-colors"
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
             <Link href="/sifre-sifirla" className="text-xs text-slate-400 hover:text-[#00e5ff] transition-colors">
                Şifremi unuttum
             </Link>
          </div>

          <button type="submit" className="w-full bg-[#00e5ff] text-black rounded-xl py-3.5 font-black uppercase tracking-widest hover:bg-[#00c4db] transition-all shadow-[0_0_20px_rgba(0,229,255,0.2)]">
            GİRİŞ YAP
          </button>
        </form>

        <div className="text-center mb-6 mt-4">
          <p className="text-slate-400 text-sm">
            Hesabınız yok mu? <Link href="/kayit" className="text-[#00e5ff] font-bold hover:underline">Yeni Kayıt Oluştur</Link>
          </p>
        </div>

     <div className="pt-6 border-t border-white/10 mt-6">
      <Link 
        href="/" 
        prefetch={true} 
        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 flex items-center justify-center gap-2 group hover:bg-white/10 transition-all duration-100 active:scale-95"
      >
        <UserCircle2 size={18} className="text-slate-400 group-hover:text-[#00e5ff] transition-colors duration-100" />
        <span className="text-slate-300 group-hover:text-white font-medium transition-colors duration-100">
          Üye Olmadan Devam Et
        </span>
        <ArrowRight size={16} className="text-slate-500 group-hover:translate-x-1 group-hover:text-[#00e5ff] transition-all duration-100" />
      </Link>
    </div>
    </div>
    </div>
  );
}