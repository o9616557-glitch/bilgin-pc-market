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
        
        // 🚀 ESKİ YAZIYI SİLDİK, YERİNE BU UYARIYI KOYDUK (Ekranda 5 saniye kalacak)
        toast.success("Kayıt başarılı! Lütfen e-postanıza giderek hesabınızı onaylayın.", { duration: 5000 });
        
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
    <div className="min-h-screen bg-[#050814] text-white flex items-center justify-center p-0 sm:p-4 relative overflow-hidden">
      {/* Arka Plan Efekti */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#3b82f6] rounded-full mix-blend-screen filter blur-[150px] opacity-10"></div>
      
      <div className="w-full max-w-md bg-[#09090b] border-none sm:border border-white/10 rounded-none sm:rounded-2xl p-6 sm:p-8 min-h-[100dvh] sm:min-h-[auto] flex flex-col justify-center shadow-2xl relative z-10 box-border overflow-y-auto">

  {/* BİLGİN PC LOGO (Orijinal İki Renkli Tasarım) */}
  <div className="flex flex-col items-center justify-center w-full mb-8 shrink-0 mt-8 sm:mt-0">
    <div className="flex items-center gap-2 text-3xl font-black uppercase tracking-tight drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]">
      <span className="text-white">BİLGİN</span>
      <span className="text-[#3b82f6]">PC</span>
    </div>
    <div className="h-[2px] w-12 bg-[#3b82f6]/50 mt-2"></div>
  </div>

  {/* YENİ KAYIT BAŞLIĞI VE ALT YAZISI (uppercase silindi, kibarlaştırıldı) */}
  <h1 className="text-lg sm:text-xl font-bold uppercase tracking-wide text-white drop-shadow-md mb-2 border-l-4 border-[#3b82f6] pl-4">
    YENİ <span className="text-[#3b82f6] font-black">KAYIT</span>
   </h1>
  <p className="text-slate-400 text-sm mb-8 font-medium">
    Bilgin PC Market'e katılın ve avantajlardan yararlanın.
  </p>
       {/* ✅ TERTEMİZ VE RENKLİ GOOGLE KAYIT MOTORU ✅ */}
        <div className="w-full mb-6">
          <button
            type="button"
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className="w-full hover:bg-white/5 border border-white/10 py-3.5 rounded-xl flex items-center justify-center gap-3 transition-all group shadow-md hover:shadow-white/5 hover:border-white/30"
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
              className="w-full bg-[#050814] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#3b82f6]/50 transition-colors"
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
              className="w-full bg-[#050814] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#3b82f6]/50 transition-colors"
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
              className="w-full bg-[#050814] border border-white/10 rounded-xl py-3 pl-12 pr-12 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#3b82f6]/50 transition-colors"
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

       {/* 🚀 KAYIT OL BUTONU (YÜKLENİYOR MOTORU VE PREMIUM RENKLER İLE) 🚀 */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 mt-2 bg-[#3b82f6] text-white text-sm font-black uppercase tracking-widest rounded-xl transition-all duration-300 hover:bg-[#1e40af] hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "KAYIT OLUŞTURULUYOR..." : "KAYIT OL"}
        </button>
        </form>

        <div className="text-center">
          <p className="text-slate-400 text-sm">
            Zaten hesabınız var mı? <Link href="/giris" className="text-[#3b82f6] font-bold hover:underline">Giriş Yap</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
