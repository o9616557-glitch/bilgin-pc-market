"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MyAccountPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"orders" | "addresses">("orders");
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState("Değerli Şefimiz");
  
  // Adres Düzenleme Modları: null (liste), "billing" (fatura), "shipping" (teslimat)
  const [editMode, setEditMode] = useState<null | "billing" | "shipping">(null);

  // FORM STATES (Adres Kayıtları İçin)
  const [addressForm, setAddressForm] = useState({
    firstName: "Sevgi",
    lastName: "Bilgin",
    phone: "0555 555 55 55",
    city: "İstanbul",
    district: "Kadıköy",
    fullAddress: "Moda Caddesi, No: 104, Daire: 5"
  });

  // MOCK DATA (Canlı API entegrasyonu için şablon hazır şefim)
  const mockOrders = [
    { id: "#4592", date: "12 Mayıs 2026", total: "48.500 TL", status: "Hazırlanıyor", color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
    { id: "#4310", date: "28 Nisan 2026", total: "3.200 TL", status: "Tamamlandı", color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
    { id: "#3988", date: "15 Mart 2026", total: "14.900 TL", status: "Kargoya Verildi", color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
  ];

  // 🛡️ GİRİŞ KONTROLÜ
  useEffect(() => {
    const token = localStorage.getItem("user_token");
    const displayName = localStorage.getItem("user_display_name");
    
    if (!token) {
      // Giriş yapmamışsa kapıdan çevir, direkt giriş sayfasına yolla
      router.push("/giris");
    } else {
      if (displayName) setUserName(displayName);
      setIsLoading(false);
    }
  }, [router]);

  const handleLogOut = () => {
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_display_name");
    router.push("/giris");
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Burada WooCommerce API'sine adres güncelleme isteği atılacak şefim
    setTimeout(() => {
      setIsLoading(false);
      setEditMode(null); // Listeye geri dön
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#050810] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Komuta Merkezi Yükleniyor...</span>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#050810] text-white py-10 px-4 font-sans relative overflow-hidden">
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
        
        {/* 🛠️ SOL PANEL: KULLANICI KARTI VE SEÇENEKLER */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-[#0b1120] border border-white/5 p-6 rounded-3xl text-center shadow-xl">
            <div className="w-16 h-16 bg-blue-600/10 border border-blue-500/30 text-blue-500 rounded-full flex items-center justify-center mx-auto text-2xl font-black italic shadow-[0_0_20px_rgba(37,99,235,0.15)] uppercase">
              {userName.substring(0, 2)}
            </div>
            <h2 className="mt-4 text-white font-black uppercase tracking-wide line-clamp-1">{userName}</h2>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mt-1">Premium Üye</span>
          </div>

          {/* MENÜ BUTONLARI */}
          <div className="bg-[#0b1120] border border-white/5 p-3 rounded-3xl space-y-1 shadow-xl">
            <button
              onClick={() => { setActiveTab("orders"); setEditMode(null); }}
              className={`w-full text-left px-5 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-between ${activeTab === "orders" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10 italic" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}
            >
              <span>Siparişlerim</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            </button>

            <button
              onClick={() => { setActiveTab("addresses"); }}
              className={`w-full text-left px-5 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-between ${activeTab === "addresses" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10 italic" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}
            >
              <span>Adres Bilgilerim</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0 antiquewhite" /></svg>
            </button>

            <button
              onClick={handleLogOut}
              className="w-full text-left px-5 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider text-amber-500 hover:bg-amber-500/10 border border-transparent hover:border-amber-500/10 transition-all flex items-center justify-between"
            >
              <span>Güvenli Çıkış</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </button>
          </div>
        </div>

        {/* 🛠️ SAĞ PANEL: SEÇİLEN SEKMENİN İÇERİĞİ */}
        <div className="lg:col-span-3">
          
          {/* SECENEK 1: SİPARİŞLERİM */}
          {activeTab === "orders" && (
            <div className="bg-[#0b1120] border border-white/5 p-6 md:p-8 rounded-3xl shadow-xl space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-white/5 pb-4">
                <h1 className="text-xl font-black uppercase italic tracking-wide">Sipariş Geçmişi</h1>
                <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mt-1">Son donanım siparişlerinizin durumunu buradan takip edebilirsiniz şefim.</p>
              </div>

              <div className="space-y-4">
                {mockOrders.map((order) => (
                  <div key={order.id} className="p-5 bg-[#050810] border border-white/5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all hover:border-white/10 group">
                    <div className="flex items-center gap-6">
                      <div className="p-3 bg-white/5 rounded-xl text-white font-black text-xs italic tracking-wider group-hover:text-blue-500 transition-colors">
                        {order.id}
                      </div>
                      <div>
                        <div className="text-white text-xs font-black uppercase tracking-wider">{order.total}</div>
                        <div className="text-slate-500 text-[10px] font-medium mt-0.5">{order.date}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${order.color}`}>
                        {order.status}
                      </span>
                      <button className="px-4 py-2 bg-white/5 hover:bg-blue-600 text-slate-300 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                        Detaylar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECENEK 2: ADRESLERİM */}
          {activeTab === "addresses" && (
            <div className="bg-[#0b1120] border border-white/5 p-6 md:p-8 rounded-3xl shadow-xl space-y-6 animate-in fade-in duration-300">
              
              {editMode === null ? (
                /* ADRES LİSTELEME EKRANI */
                <>
                  <div className="border-b border-white/5 pb-4">
                    <h1 className="text-xl font-black uppercase italic tracking-wide">Adres Kayıtları</h1>
                    <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mt-1">Kargo ve fatura adreslerinizi güncel tutarak sipariş hızınızı artırın.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* FATURA ADRESİ KARTI */}
                    <div className="p-6 bg-[#050810] border border-white/5 rounded-2xl relative group flex flex-col justify-between min-h-[220px]">
                      <div>
                        <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                          <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Fatura Adresi</span>
                          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        </div>
                        <p className="text-white text-xs font-black uppercase">{addressForm.firstName} {addressForm.lastName}</p>
                        <p className="text-slate-400 text-xs mt-2 font-medium leading-relaxed">{addressForm.fullAddress}</p>
                        <p className="text-slate-500 text-[10px] font-bold mt-1 uppercase tracking-wide">{addressForm.district} / {addressForm.city}</p>
                      </div>
                      <button 
                        onClick={() => setEditMode("billing")}
                        className="mt-6 w-full py-2.5 bg-white/5 border border-white/5 group-hover:border-blue-500/30 text-slate-400 group-hover:text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                      >
                        Adresi Düzenle
                      </button>
                    </div>

                    {/* TESLİMAT ADRESİ KARTI */}
                    <div className="p-6 bg-[#050810] border border-white/5 rounded-2xl relative group flex flex-col justify-between min-h-[220px]">
                      <div>
                        <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Teslimat Adresi</span>
                          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                        </div>
                        <p className="text-white text-xs font-black uppercase">{addressForm.firstName} {addressForm.lastName}</p>
                        <p className="text-slate-400 text-xs mt-2 font-medium leading-relaxed">{addressForm.fullAddress}</p>
                        <p className="text-slate-500 text-[10px] font-bold mt-1 uppercase tracking-wide">{addressForm.district} / {addressForm.city}</p>
                      </div>
                      <button 
                        onClick={() => setEditMode("shipping")}
                        className="mt-6 w-full py-2.5 bg-white/5 border border-white/5 group-hover:border-emerald-500/30 text-slate-400 group-hover:text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                      >
                        Adresi Düzenle
                      </button>
                    </div>

                  </div>
                </>
              ) : (
                /* 🛠️ ADRES DEĞİŞİKLİK / KAYIT FORMU EKRANI */
                <div className="animate-in slide-in-from-bottom-4 duration-300">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                    <div>
                      <h1 className="text-xl font-black uppercase italic tracking-wide">
                        {editMode === "billing" ? "Fatura Adresini Güncelle" : "Teslimat Adresini Güncelle"}
                      </h1>
                      <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mt-1">Lütfen alanları eksiksiz doldurun şefim.</p>
                    </div>
                    <button 
                      onClick={() => setEditMode(null)}
                      className="px-3 py-1.5 bg-white/5 text-slate-400 hover:text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                      İptal Et
                    </button>
                  </div>

                  <form onSubmit={handleAddressSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Adınız</label>
                        <input type="text" value={addressForm.firstName} onChange={(e) => setAddressForm({...addressForm, firstName: e.target.value})} className="w-full bg-[#050810] border border-white/5 rounded-xl px-5 py-4 text-white font-medium focus:outline-none focus:border-blue-500/50 transition-all text-xs" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Soyadınız</label>
                        <input type="text" value={addressForm.lastName} onChange={(e) => setAddressForm({...addressForm, lastName: e.target.value})} className="w-full bg-[#050810] border border-white/5 rounded-xl px-5 py-4 text-white font-medium focus:outline-none focus:border-blue-500/50 transition-all text-xs" required />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Telefon Numarası</label>
                        <input type="text" value={addressForm.phone} onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})} className="w-full bg-[#050810] border border-white/5 rounded-xl px-5 py-4 text-white font-medium focus:outline-none focus:border-blue-500/50 transition-all text-xs" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Şehir</label>
                        <input type="text" value={addressForm.city} onChange={(e) => setAddressForm({...addressForm, city: e.target.value})} className="w-full bg-[#050810] border border-white/5 rounded-xl px-5 py-4 text-white font-medium focus:outline-none focus:border-blue-500/50 transition-all text-xs" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">İlçe</label>
                        <input type="text" value={addressForm.district} onChange={(e) => setAddressForm({...addressForm, district: e.target.value})} className="w-full bg-[#050810] border border-white/5 rounded-xl px-5 py-4 text-white font-medium focus:outline-none focus:border-blue-500/50 transition-all text-xs" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Açık Adres</label>
                      <textarea rows={3} value={addressForm.fullAddress} onChange={(e) => setAddressForm({...addressForm, fullAddress: e.target.value})} className="w-full bg-[#050810] border border-white/5 rounded-xl px-5 py-4 text-white font-medium focus:outline-none focus:border-blue-500/50 transition-all text-xs resize-none" required />
                    </div>

                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-xs py-4 rounded-xl transition-all shadow-lg shadow-blue-500/10">
                      Değişiklikleri Kaydet (Sistemi Güncelle)
                    </button>
                  </form>
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}