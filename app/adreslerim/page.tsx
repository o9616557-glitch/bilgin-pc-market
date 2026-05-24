"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, Plus, Trash2, Loader2, Home, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

interface Address {
  _id: string;
  title: string;
  fullName: string;
  phone: string;
  city: string;
  district: string;
  fullAddress: string;
  isDefaultDelivery?: boolean; // 🚀 ŞEFİM YENİ EKLENDİ
  isDefaultBilling?: boolean;  // 🚀 ŞEFİM YENİ EKLENDİ
}

export default function AdreslerimPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    fullName: "",
    phone: "",
    city: "",
    district: "",
    fullAddress: "",
    isDefaultDelivery: false, // 🚀 ŞEFİM YENİ EKLENDİ
    isDefaultBilling: false,  // 🚀 ŞEFİM YENİ EKLENDİ
  });

  // Adresleri Veritabanından Çek
  const fetchAddresses = async () => {
    try {
      const res = await fetch("/api/addresses");
      const data = await res.json();

      if (res.ok) {
        setAddresses(data.addresses);
      } else if (res.status === 401) {
        toast.error("Adreslerinizi görmek için giriş yapmalısınız.");
      }
    } catch (error) {
      toast.error("Adresler yüklenirken hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // Yeni Adres Ekle
  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const loadingToast = toast.loading("Adres ekleniyor...");

    try {
      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.dismiss(loadingToast);
        toast.success("Adres başarıyla eklendi.");
        setAddresses(data.addresses); // Listeyi güncelle
        setShowForm(false); // Formu kapat
        setFormData({ title: "", fullName: "", phone: "", city: "", district: "", fullAddress: "", isDefaultDelivery: false, isDefaultBilling: false }); // Formu temizle
      } else {
        toast.dismiss(loadingToast);
        toast.error(data.message || "Adres eklenirken bir hata oluştu.");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Sunucuya bağlanılamadı.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Adres Sil
  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Bu adresi silmek istediğinize emin misiniz?")) return;

    const loadingToast = toast.loading("Adres siliniyor...");

    try {
      const res = await fetch(`/api/addresses?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        toast.dismiss(loadingToast);
        toast.success("Adres silindi.");
        setAddresses(data.addresses); // Listeyi güncelle
      } else {
        toast.dismiss(loadingToast);
        toast.error(data.message || "Silme işlemi başarısız.");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Sunucuya bağlanılamadı.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#050814] text-white p-6 md:p-12 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-white/10 pb-4 gap-4">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-white drop-shadow-[0_0_10px_rgba(0,229,255,0.2)]">
              ADRESLERİM
            </h1>
            <p className="text-slate-400 text-sm mt-1">Kayıtlı teslimat ve fatura adreslerinizi yönetin.</p>
          </div>
          
          {!showForm && (
            <button 
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-[#00e5ff] text-black px-6 py-2.5 rounded-xl font-bold uppercase text-sm hover:bg-[#00c4db] transition-all shadow-[0_0_15px_rgba(0,229,255,0.2)]"
            >
              <Plus size={18} /> Yeni Adres Ekle
            </button>
          )}
        </div>

        {/* Yeni Adres Ekleme Formu */}
        {showForm && (
          <div className="bg-[#09090b] border border-white/10 rounded-2xl p-6 mb-8 animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold flex items-center gap-2"><MapPin className="text-[#00e5ff]" /> Yeni Adres Bilgileri</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white transition-colors text-sm font-medium">
                İptal Et
              </button>
            </div>

            <form onSubmit={handleAddAddress} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-400 font-bold uppercase">Adres Başlığı (Örn: Evim, İş Yerim)</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="bg-[#050814] border border-white/10 rounded-lg p-3 text-sm focus:border-[#00e5ff]/50 outline-none transition-colors" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-400 font-bold uppercase">Ad Soyad</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required className="bg-[#050814] border border-white/10 rounded-lg p-3 text-sm focus:border-[#00e5ff]/50 outline-none transition-colors" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-400 font-bold uppercase">Telefon</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required className="bg-[#050814] border border-white/10 rounded-lg p-3 text-sm focus:border-[#00e5ff]/50 outline-none transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-400 font-bold uppercase">İl</label>
                  <input type="text" name="city" value={formData.city} onChange={handleInputChange} required className="bg-[#050814] border border-white/10 rounded-lg p-3 text-sm focus:border-[#00e5ff]/50 outline-none transition-colors" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-400 font-bold uppercase">İlçe</label>
                  <input type="text" name="district" value={formData.district} onChange={handleInputChange} required className="bg-[#050814] border border-white/10 rounded-lg p-3 text-sm focus:border-[#00e5ff]/50 outline-none transition-colors" />
                </div>
              </div>
              <div className="flex flex-col gap-1 md:col-span-2">
                <label className="text-xs text-slate-400 font-bold uppercase">Açık Adres</label>
                <textarea name="fullAddress" value={formData.fullAddress} onChange={handleInputChange} required rows={3} className="bg-[#050814] border border-white/10 rounded-lg p-3 text-sm focus:border-[#00e5ff]/50 outline-none transition-colors resize-none"></textarea>
              </div>
              
              <div className="md:col-span-2 flex justify-end mt-2">
                <button type="submit" disabled={isSubmitting} className="bg-[#00e5ff] text-black px-8 py-3 rounded-xl font-black uppercase tracking-widest hover:bg-[#00c4db] transition-all disabled:opacity-50">
                  {isSubmitting ? "KAYDEDİLİYOR..." : "ADRESİ KAYDET"}
                </button>
              </div>
            </form>
          </div>
        )}
{/* 🚀 ŞEFİM: KASADA OTOMATİK DOLDURMA KUTUCUKLARI */}
        <div className="md:col-span-2 flex flex-col md:flex-row gap-6 mt-2 mb-4">
          <label className="flex items-center gap-3 cursor-pointer text-sm text-slate-300 hover:text-white transition-colors">
            <input 
              type="checkbox" 
              className="w-5 h-5 rounded border-white/10 bg-[#050B14] checked:bg-[#00e5ff] focus:ring-[#00e5ff] cursor-pointer"
              checked={formData.isDefaultDelivery}
              onChange={(e) => setFormData({ ...formData, isDefaultDelivery: e.target.checked })}
            />
            Bu benim varsayılan teslimat adresim olsun
          </label>

          <label className="flex items-center gap-3 cursor-pointer text-sm text-slate-300 hover:text-white transition-colors">
            <input 
              type="checkbox" 
              className="w-5 h-5 rounded border-white/10 bg-[#050B14] checked:bg-[#00e5ff] focus:ring-[#00e5ff] cursor-pointer"
              checked={formData.isDefaultBilling}
              onChange={(e) => setFormData({ ...formData, isDefaultBilling: e.target.checked })}
            />
            Fatura adresi olarak da bunu kullan
          </label>
        </div>

        {/* Adres Listesi */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-[#00e5ff] animate-spin" />
            <p className="text-slate-400">Adresleriniz yükleniyor...</p>
          </div>
        ) : addresses.length === 0 && !showForm ? (
          <div className="flex flex-col items-center justify-center py-20 bg-[#09090b] border border-white/10 rounded-3xl">
            <Home className="w-16 h-16 text-slate-600 mb-4" />
            <h2 className="text-xl font-bold mb-2">Kayıtlı Adresiniz Yok</h2>
            <p className="text-slate-400 mb-6">Siparişlerinizde kullanmak için hemen bir adres ekleyin.</p>
            <button onClick={() => setShowForm(true)} className="bg-[#00e5ff] text-black px-8 py-3 rounded-xl font-black uppercase tracking-widest hover:bg-[#00c4db] transition-all">
              İlk Adresini Ekle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {addresses.map((address) => (
              <div key={address._id} className="bg-[#09090b] border border-white/10 rounded-2xl p-6 relative group hover:border-[#00e5ff]/30 transition-colors">
                <div className="flex justify-between items-start mb-4 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2 text-[#00e5ff] font-bold">
                    <MapPin size={18} /> {address.title}
                  </div>
                  <button 
                    onClick={() => handleDeleteAddress(address._id)}
                    className="text-slate-500 hover:text-rose-500 transition-colors"
                    title="Adresi Sil"
                  >
                    <Trash2 size={18} />
                  </button>
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