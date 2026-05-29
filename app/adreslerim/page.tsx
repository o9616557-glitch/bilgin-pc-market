"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, Plus, Trash2, Loader2, Home } from "lucide-react";
import toast from "react-hot-toast";

interface Address {
  _id: string;
  title: string;
  fullName: string;
  phone: string;
  city: string;
  district: string;
  fullAddress: string;
  isDefaultDelivery?: boolean;
  isDefaultBilling?: boolean;
}

export default function AdreslerimPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null); // 🚀 ŞEFİM: Düzenleme takibi için eklendi

  const formBaslangic = {
    title: "", fullName: "", phone: "", city: "", district: "", fullAddress: "", isDefaultDelivery: false, isDefaultBilling: false
  };
  const [formData, setFormData] = useState(formBaslangic);

  // Adresleri Getir
  const fetchAddresses = async () => {
    try {
      const res = await fetch("/api/addresses");
      const data = await res.json();
      if (res.ok) setAddresses(data.addresses || []);
    } catch (error) {
      console.error("Adres çekme hatası", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // Adres Kaydet veya Düzenle (Sihirbazlık Motoru)
  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const loadingToast = toast.loading(editingId ? "Adres güncelleniyor..." : "Adres ekleniyor...");

    try {
      // 🚀 EĞER DÜZENLEME YAPILIYORSA ÖNCE ESKİSİNİ SİLERİZ (Çünkü arkada Update API'si yok)
      if (editingId) {
        await fetch(`/api/addresses?id=${editingId}`, { method: "DELETE" });
      }

      // Yeni veya güncellenmiş adresi kaydet
      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.dismiss(loadingToast);
        toast.success(editingId ? "Adres başarıyla güncellendi." : "Adres başarıyla eklendi.");
        setShowForm(false);
        setEditingId(null);
        setFormData(formBaslangic);
        fetchAddresses(); // Listeyi yenile
      } else {
        toast.dismiss(loadingToast);
        toast.error(data.message || "İşlem başarısız oldu.");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Sunucuya bağlanılamadı.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🚀 JET HIZINDA SİLME MOTORU (Tıkladığın an ekrandan uçurur, sayfayı yenilemek gerekmez)
  const handleDeleteAddress = async (id: string) => {
    // 1. Ekrandan anında gizle (Optimistic UI)
    setAddresses(prev => prev.filter(addr => addr._id !== id));
    
    // 2. Arka planda sil
    try {
      await fetch(`/api/addresses?id=${id}`, { method: "DELETE" });
      toast.success("Adres silindi.");
    } catch (error) {
      toast.error("Silme işlemi başarısız.");
      fetchAddresses(); // Hata olursa listeyi geri getir
    }
  };

  // Düzenleme Butonuna Basıldığında Formu Dolduran Fonksiyon
  const handleEditClick = (address: Address) => {
    setFormData({
      title: address.title,
      fullName: address.fullName,
      phone: address.phone,
      city: address.city,
      district: address.district,
      fullAddress: address.fullAddress,
      isDefaultDelivery: address.isDefaultDelivery || false,
      isDefaultBilling: address.isDefaultBilling || false,
    });
    setEditingId(address._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#050B14] text-white p-6 md:p-12 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Üst Başlık ve Yeni Ekle Butonu */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-white/10 pb-4 gap-4">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-white drop-shadow-[0_0_10px_rgba(0,229,255,0.2)]">
              ADRESLERİM
            </h1>
            <p className="text-slate-400 text-sm mt-1">Kayıtlı teslimat ve fatura adreslerinizi yönetin.</p>
          </div>

          {!showForm && (
            <button
              onClick={() => {
                setFormData(formBaslangic);
                setEditingId(null);
                setShowForm(true);
              }}
              className="flex items-center gap-2 bg-[#00e5ff] text-black px-6 py-2.5 rounded-xl font-bold uppercase text-sm hover:bg-[#00c4db] transition-all shadow-[0_0_15px_rgba(0,229,255,0.2)]"
            >
              <Plus size={18} /> YENİ ADRES EKLE
            </button>
          )}
        </div>

        {/* Adres Ekleme / Düzenleme Formu */}
        {showForm && (
          <div className="bg-[#09090b] border border-white/10 rounded-2xl p-6 mb-8 animate-in fade-in slide-in-from-top-4">
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold flex items-center gap-2 text-[#00e5ff]">
                <MapPin /> {editingId ? "Adresi Düzenle" : "Yeni Adres Bilgileri"}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white transition-colors text-sm font-medium">
                İptal Et
              </button>
            </div>

            <form onSubmit={handleAddAddress} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-400 font-bold uppercase">Adres Başlığı</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="bg-[#050B14] border border-white/10 rounded-lg p-3 text-sm focus:border-[#00e5ff]/50 outline-none transition-colors" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-400 font-bold uppercase">Ad Soyad</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required className="bg-[#050B14] border border-white/10 rounded-lg p-3 text-sm focus:border-[#00e5ff]/50 outline-none transition-colors" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-400 font-bold uppercase">Telefon</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required className="bg-[#050B14] border border-white/10 rounded-lg p-3 text-sm focus:border-[#00e5ff]/50 outline-none transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-400 font-bold uppercase">İl</label>
                  <input type="text" name="city" value={formData.city} onChange={handleInputChange} required className="bg-[#050B14] border border-white/10 rounded-lg p-3 text-sm focus:border-[#00e5ff]/50 outline-none transition-colors" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-400 font-bold uppercase">İlçe</label>
                  <input type="text" name="district" value={formData.district} onChange={handleInputChange} required className="bg-[#050B14] border border-white/10 rounded-lg p-3 text-sm focus:border-[#00e5ff]/50 outline-none transition-colors" />
                </div>
              </div>
              <div className="flex flex-col gap-1 md:col-span-2">
                <label className="text-xs text-slate-400 font-bold uppercase">Açık Adres</label>
                <textarea name="fullAddress" value={formData.fullAddress} onChange={handleInputChange} required rows={3} className="bg-[#050B14] border border-white/10 rounded-lg p-3 text-sm focus:border-[#00e5ff]/50 outline-none transition-colors"></textarea>
              </div>

              {/* Tık Kutucukları - Tam Yerinde */}
              <div className="md:col-span-2 flex flex-col md:flex-row gap-6 mt-2 mb-4">
                <label className="flex items-center gap-3 cursor-pointer text-sm text-slate-300 hover:text-white transition-colors">
                  <input type="checkbox" className="w-5 h-5 rounded border-white/10 bg-[#050B14] checked:bg-[#00e5ff] focus:ring-[#00e5ff] cursor-pointer" checked={formData.isDefaultDelivery} onChange={(e) => setFormData({ ...formData, isDefaultDelivery: e.target.checked })} />
                  Bu benim varsayılan teslimat adresim olsun
                </label>
                <label className="flex items-center gap-3 cursor-pointer text-sm text-slate-300 hover:text-white transition-colors">
                  <input type="checkbox" className="w-5 h-5 rounded border-white/10 bg-[#050B14] checked:bg-[#00e5ff] focus:ring-[#00e5ff] cursor-pointer" checked={formData.isDefaultBilling} onChange={(e) => setFormData({ ...formData, isDefaultBilling: e.target.checked })} />
                  Fatura adresi olarak da bunu kullan
                </label>
              </div>

              <div className="md:col-span-2 flex justify-end mt-2">
                <button type="submit" disabled={isSubmitting} className="bg-[#00e5ff] text-black px-8 py-3 rounded-xl font-black uppercase tracking-widest hover:bg-[#00c4db] transition-all disabled:opacity-50">
                  {isSubmitting ? "KAYDEDİLİYOR..." : editingId ? "DEĞİŞİKLİKLERİ KAYDET" : "ADRESİ KAYDET"}
                </button>
              </div>
            </form>
          </div>
        )}

       {/* Yükleniyor (Görseldeki Gibi Premium Koyu Hayalet Ekran) */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-[#09090b]/50 border border-white/5 rounded-2xl p-6 animate-pulse">
              
              {/* Üst Geniş Kutu */}
              <div className="w-full h-28 bg-white/5 rounded-xl mb-6"></div>
              
              {/* Orta İnce Çizgiler */}
              <div className="space-y-3 mb-8">
                <div className="w-1/2 h-3 bg-white/5 rounded-md"></div>
                <div className="w-1/3 h-3 bg-white/5 rounded-md"></div>
              </div>
              
              {/* Alt Buton ve İkon Gölgeleri */}
              <div className="flex gap-3 mt-auto">
                <div className="w-10 h-10 bg-white/5 rounded-xl shrink-0"></div>
                <div className="w-full h-10 bg-white/5 rounded-xl"></div>
              </div>

            </div>
          </div>
        ) : addresses.length === 0 && !showForm ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4 mt-8 animate-in fade-in zoom-in duration-300">
            
            {/* Soluk İkon Kutusu (Sitenin Orijinal Saydam Siyah Rengi) */}
            <div className="w-24 h-24 rounded-full bg-[#121215]/50 border border-slate-800/50 flex items-center justify-center mb-6 shadow-inner">
              <MapPin className="w-10 h-10 text-slate-500" />
            </div>

            {/* Başlık (Bir tık ufaltıldı ve kibarlaştırıldı) */}
            <h2 className="text-xl sm:text-2xl font-black uppercase text-white mb-3 tracking-wide">
              HENÜZ KAYITLI ADRES YOK
            </h2>

            {/* Gri Bilgi Yazısı */}
            <p className="text-slate-400 text-sm font-medium max-w-md mb-8 leading-relaxed">
              Sistemde teslimat veya fatura adresiniz bulunmuyor. Canavar donanımları size ulaştırabilmemiz için hemen yeni bir adres ekleyin.
            </p>

            {/* Neon Mavi Buton */}
            <button 
              onClick={() => setShowForm(true)}
              className="bg-[#00e5ff] text-black font-black uppercase tracking-wide py-4 px-10 rounded-xl hover:bg-white hover:scale-105 transition-all duration-100 active:scale-95 shadow-[0_0_20px_rgba(0,229,255,0.15)]"
            >
              YENİ ADRES EKLE
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {addresses.map((address) => (
              <div key={address._id} className="bg-[#09090b] border border-white/10 rounded-2xl p-6 relative group hover:border-[#00e5ff]/30 transition-colors">
                
                {/* Rozetler ve Butonlar (Kalem ve Çöp) */}
                <div className="flex justify-between items-start mb-4 border-b border-white/10 pb-3">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-[#00e5ff] font-bold">
                      <MapPin size={18} />
                      <span>{address.title}</span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {address.isDefaultDelivery && (
                        <span className="px-2 py-1 bg-[#00e5ff]/10 text-[#00e5ff] text-[10px] rounded border border-[#00e5ff]/20 font-medium tracking-wider">VARS. TESLİMAT</span>
                      )}
                      {address.isDefaultBilling && (
                        <span className="px-2 py-1 bg-amber-500/10 text-amber-400 text-[10px] rounded border border-amber-500/20 font-medium tracking-wider">FATURA ADRESİ</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <button onClick={() => handleEditClick(address)} className="text-slate-400 hover:text-[#00e5ff] transition-colors" title="Bu Adresi Düzenle">
                      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    </button>
                    <button onClick={() => handleDeleteAddress(address._id)} className="text-slate-400 hover:text-rose-500 transition-colors" title="Adresi Sil">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-slate-300">
                  <p className="font-bold text-white">{address.fullName}</p>
                  <p className="text-slate-400">{address.phone}</p>
                  <p className="mt-2 line-clamp-2" title={address.fullAddress}>{address.fullAddress}</p>
                  <p className="text-[#00e5ff]/80 font-medium">{address.district} / {address.city}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}