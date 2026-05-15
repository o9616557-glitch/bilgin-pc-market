"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // GİRİŞ İŞLEMİ (Sade ve Hızlı)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Şefim buraya sadece yönlendirme koydum, hata vermez.
    setTimeout(() => {
      setIsLoading(false);
      router.push("/");
    }, 1500);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-[#050810] relative overflow-hidden">
      
      {/* ARKA PLAN IŞIKLARI */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-green-600/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        
        <div className="text-center mb-10">
          <Link href="/" className="inline-block text-3xl font-black italic tracking-tighter mb-4 text-white">
            BİLGİN<span className="text-blue-500 not-italic uppercase">PC</span>
          </Link>
          <h1 className="text-2xl font-black text-white uppercase tracking-widest mb-2">Giriş Yap</h1>
          <p className="text-slate-500 text-sm font-medium italic">Hesabınıza erişim sağlayın.</p>
        </div>

        <div className="bg-[#0b1120] p-8 md:p-10 rounded-3xl border border-white/5 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">E-Posta veya Kullanıcı Adı</label>
              <input 
                type="text" 
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                placeholder="E-posta veya kullanıcı adı" 
                className="w-full bg-[#050810] border border-white/5 rounded-xl px-5 py-4 text-white font-medium focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-800"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Şifre</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••" 
                  className="w-full bg-[#050810] border border-white/5 rounded-xl px-5 py-4 text-white font-medium focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-800"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white text-xs font-bold uppercase transition-colors">
                  {showPassword ? "Gizle" : "Göster"}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-sm py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)]"
            >
              {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
            </button>
          </form>

          <div className="relative flex items-center py-8">
            <div className="flex-grow border-t border-white/5"></div>
            <span className="flex-shrink-0 mx-4 text-slate-700 text-[10px] font-black uppercase tracking-widest">Veya</span>
            <div className="flex-grow border-t border-white/5"></div>
          </div>

          {/* SOSYAL VE MİSAFİR GİRİŞİ */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center bg-white/5 border border-white/5 py-3.5 rounded-xl text-[10px] font-black text-slate-300 uppercase tracking-widest hover:bg-white/10 transition-all">Google</button>
                <button className="flex items-center justify-center bg-blue-600/10 border border-blue-600/20 py-3.5 rounded-xl text-[10px] font-black text-blue-500 uppercase tracking-widest hover:bg-blue-600/20 transition-all">Facebook</button>
            </div>

            {/* ŞEFİM: ÜYE OLMADAN DEVAM ET BUTONU */}
            <button 
                onClick={() => router.push("/")}
                className="w-full py-4 bg-white/5 border border-white/5 hover:border-green-500/30 text-slate-500 hover:text-green-500 rounded-xl transition-all text-[11px] font-black uppercase tracking-[0.2em]"
            >
                Üye Olmadan Devam Et
            </button>
          </div>

          <div className="mt-10 pt-6 border-t border-white/5 text-center">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">
              Hesabınız yok mu? <Link href="/kayit" className="text-white font-black hover:text-blue-500 ml-2">Kayıt Ol</Link>
            </p>
          </div>
        </div>
        
      </div>
    </div>
  );
}