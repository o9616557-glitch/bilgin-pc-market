"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Şefim burası WooCommerce API'sine kayıt gönderir
      const res = await fetch("https://bilginpcmarket.com/wp-json/wp/v2/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/giris?success=true");
      } else {
        setError(data.message || "Kayıt sırasında bir hata oluştu. E-posta veya kullanıcı adı kullanımda olabilir.");
      }
    } catch (err) {
      setError("Sunucuya bağlanılamadı. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-[#050810] relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="w-full max-w-md relative z-10 bg-[#0b1120] p-8 md:p-10 rounded-3xl border border-white/5 shadow-2xl">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-black italic tracking-tighter text-white uppercase">
            BİLGİN<span className="text-blue-500 not-italic">PC</span>
          </Link>
          <h1 className="text-xl font-black text-white uppercase tracking-widest mt-4">Yeni Hesap Oluştur</h1>
        </div>

        {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[10px] font-bold text-center uppercase">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Kullanıcı Adı</label>
            <input type="text" required onChange={(e) => setFormData({...formData, username: e.target.value})} className="w-full bg-[#050810] border border-white/5 rounded-xl px-5 py-4 text-white focus:border-blue-500/50 outline-none transition-all" placeholder="bilgin_gamer" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-500 ml-1">E-Posta Adresi</label>
            <input type="email" required onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-[#050810] border border-white/5 rounded-xl px-5 py-4 text-white focus:border-blue-500/50 outline-none transition-all" placeholder="posta@adres.com" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Şifre</label>
            <input type="password" required onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full bg-[#050810] border border-white/5 rounded-xl px-5 py-4 text-white focus:border-blue-500/50 outline-none transition-all" placeholder="••••••••" />
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase py-4 rounded-xl transition-all shadow-lg shadow-blue-500/20">
            {isLoading ? "HESAP OLUŞTURULUYOR..." : "HESABI OLUŞTUR"}
          </button>
        </form>

        <p className="mt-8 text-center text-[11px] font-medium text-slate-500 uppercase tracking-widest">
          Zaten üye misin? <Link href="/giris" className="text-white font-black hover:text-blue-500 ml-2 transition-colors">GİRİŞ YAP</Link>
        </p>
      </div>
    </div>
  );
}