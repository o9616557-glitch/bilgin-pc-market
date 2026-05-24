"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast"; // 🚀 Modern bildirim motoru devrede!

export default function KayitPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 🚀 Şifre göster/gizle motoru
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // 🚀 Eski alert() yerine şık Toast bildirimi
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
        toast.success("Kayıt başarılı! Giriş yapabilirsiniz.");
        router.push("/giris");
      } else {
        toast.dismiss(loadingToast);
        // 🚀 Zaten kayıtlı hatasını sağ üstten kırmızı şık bir şekilde çıkarır
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
    <div className="min-h-screen bg-[#050814] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Arka Plan Efekti */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#00e5ff] rounded-full mix-blend-screen filter blur-[150px] opacity-10"></div>
      
      <div className="w-full max-w-md bg-[#09090b] border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,229,255,0.05)] p-8 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-[#00e5ff] transition-colors mb-6 text-sm font-bold uppercase tracking-wider">
          <ArrowLeft size={16} /> Mağazaya Dön
        </Link>

        <h1 className="text-3xl font-black uppercase tracking-tighter mb-2 text-white drop-shadow-[0_0_10px_rgba(0,229,255,0.2)]">
          YENİ KAYIT
        </h1>
        <p className="text-slate-400 text-sm mb-8 font-medium">Bilgin PC Market'e üye olun, hızlı ve güvenli alışverişin tadını çıkarın.</p>

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

        {/* KAYIT FORMU */}
        <form onSubmit={handleRegister} className="flex flex-col gap-4 mb-6">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Adınız Soyadınız" 
              className="w-full bg-[#050814] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00e5ff]/50 transition-colors"
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
              className="w-full bg-[#050814] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00e5ff]/50 transition-colors"
              required 
            />
          </div>

          {/* 🚀 ŞİFRE KUTUSU VE GÖZ İKONU */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type={showPassword ? "text" : "password"} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifreniz" 
              className="w-full bg-[#050814] border border-white/10 rounded-xl py-3 pl-12 pr-12 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00e5ff]/50 transition-colors"
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

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#00e5ff] text-black rounded-xl py-3.5 font-black uppercase tracking-widest hover:bg-[#00c4db] transition-all shadow-[0_0_20px_rgba(0,229,255,0.2)] disabled:opacity-50 mt-2"
          >
            {isLoading ? "KAYIT OLUŞTURULUYOR..." : "KAYIT OL"}
          </button>
        </form>

        <div className="text-center">
          <p className="text-slate-400 text-sm">
            Zaten hesabınız var mı? <Link href="/giris" className="text-[#00e5ff] font-bold hover:underline">Giriş Yap</Link>
          </p>
        </div>
      </div>
    </div>
  );
}