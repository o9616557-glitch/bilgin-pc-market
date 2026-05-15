"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Yönlendirme için

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState(""); // E-posta veya Kullanıcı Adı
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(""); // Hata mesajları için

  // 1. GERÇEK GİRİŞ FONKSİYONU
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Şefim buraya Adım 2'deki kuryeyi (API Route) bağlayacağız.
      // Şimdilik sistemin çalıştığını görmen için simülasyon yapıyoruz.
      console.log("Giriş Denemesi:", { identifier, password });
      
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 saniye bekle
      
      // Eğer bilgiler boş değilse (şimdilik) ana sayfaya salla gitsin
      if(identifier && password) {
          router.push("/");
      } else {
          setError("Lütfen bilgilerinizi eksiksiz girin.");
      }
    } catch (err) {
      setError("Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  // 2. ÜYE OLMADAN DEVAM ET FONKSİYONU
  const handleGuestContinue = () => {
    setIsLoading(true);
    // Üye olmadan doğrudan ana sayfaya veya sepete yönlendirir
    setTimeout(() => {
        router.push("/");
    }, 1000);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 relative overflow-hidden bg-[#050810]">
      
      {/* NEON ARKA PLAN EFEKTLERİ */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-green-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        
        <div className="text-center mb-10">
          <Link href="/" className="inline-block text-3xl font-black italic tracking-tighter mb-4">
            BİLGİN<span className="text-blue-500 not-italic uppercase">PC</span>
          </Link>
          <h1 className="text-2xl font-black text-white uppercase tracking-widest mb-2">Hoş Geldiniz</h1>
          <p className="text-slate-400 text-sm font-medium">Bilgin PC Market'e giriş yapın.</p>
        </div>

        <div className="bg-[#0b1120] p-8 md:p-10 rounded-3xl border border-white/5 shadow-2xl">
          
          {/* HATA MESAJI (Eğer bilgiler yanlışsa burada çıkar) */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold text-center animate-bounce">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">E-Posta veya Kullanıcı Adı</label>
              <input 
                type="text" 
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                placeholder="E-posta veya kullanıcı adınız..." 
                className="w-full bg-[#050810] border border-white/5 rounded-xl px-5 py-4 text-white font-medium focus:outline-none focus:border-blue-500/50 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Şifre</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••" 
                  className="w-full bg-[#050810] border border-white/5 rounded-xl px-5 py-4 text-white font-medium focus:outline-none focus:border-blue-500/50 transition-all"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors">
                  {showPassword ? <i className="fa-solid fa-eye-slash"></i> : <i className="fa-solid fa-eye"></i>}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded bg-[#050810] border-white/5 text-blue-500 focus:ring-0" />
                <span className="text-xs font-medium text-slate-400 group-hover:text-white transition-colors">Beni Hatırla</span>
              </label>
              <Link href="#" className="text-xs font-medium text-blue-500 hover:text-blue-400 transition-colors">Şifremi Unuttum</Link>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-green-500 hover:bg-green-400 text-black font-black uppercase tracking-widest text-sm py-4 rounded-xl transition-all hover:scale-[1.02] flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isLoading ? <div className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full"></div> : "Giriş Yap"}
            </button>
          </form>

          {/* VEYA ÇİZGİSİ */}
          <div className="relative flex items-center py-6 mt-2">
            <div className="flex-grow border-t border-white/5"></div>
            <span className="flex-shrink-0 mx-4 text-slate-600 text-[10px] font-black uppercase tracking-widest">Veya</span>
            <div className="flex-grow border-t border-white/5"></div>
          </div>

          {/* SOSYAL MEDYA VE MİSAFİR GİRİŞİ */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <button type="button" className="flex items-center justify-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/5 py-3 rounded-xl transition-all">
                    <i className="fa-brands fa-google text-white text-lg"></i>
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Google</span>
                </button>
                <button type="button" className="flex items-center justify-center space-x-2 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border border-[#1877F2]/20 py-3 rounded-xl transition-all">
                    <i className="fa-brands fa-facebook text-[#1877F2] text-lg"></i>
                    <span className="text-[10px] font-bold text-[#1877F2] uppercase tracking-widest">Facebook</span>
                </button>
            </div>

            {/* ŞEFİM: İşte o can alıcı "Üye Olmadan Devam Et" butonu */}
            <button 
                onClick={handleGuestContinue}
                className="w-full py-3.5 bg-white/5 hover:bg-blue-600/10 border border-white/5 hover:border-blue-500/30 text-slate-400 hover:text-blue-400 rounded-xl transition-all text-[11px] font-black uppercase tracking-[0.2em]"
            >
                Üye Olmadan Devam Et
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 text-center text-sm font-medium text-slate-400">
            Hesabınız yok mu? <Link href="#" className="text-white font-bold hover:text-blue-500 transition-colors uppercase ml-1">Kayıt Ol</Link>
          </div>
        </div>
        
      </div>
    </div>
  );
}