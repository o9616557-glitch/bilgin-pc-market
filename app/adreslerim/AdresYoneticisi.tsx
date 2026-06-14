"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Plus, Trash2, ArrowLeft, Mail, Phone, Edit2, X } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Address {
  _id: string;
  title: string;
  fullName: string;
  phone: string;
  email: string;
  city: string;
  district: string;
  fullAddress: string;
  isDefaultDelivery?: boolean;
  isDefaultBilling?: boolean;
}

interface Props {
  initialAddresses: Address[];
}

export default function AdresYoneticisi({ initialAddresses }: Props) {
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
  const router = useRouter();
  
  // 🚀 ADRESLERİ SIKI SIKIYA TUTAN HAFIZA
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Veritabanı yenilendiğinde hafızayı senkronize et
  useEffect(() => {
    setAddresses(initialAddresses);
  }, [initialAddresses]);

  const formBaslangic = {
    title: "", fullName: "", phone: "", email: "", city: "", district: "", fullAddress: "", isDefaultDelivery: false, isDefaultBilling: false
  };
  const [formData, setFormData] = useState(formBaslangic);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Form kapatıldığında veya kaydedildiğinde düzenleme modu biter
    setShowForm(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    const loadingToast = toast.loading(editingId ? "Adres güncelleniyor..." : "Adres ekleniyor...");

    try {
      if (editingId) {
        // Eski adresi sil
        await fetch("/api/addresses?id=" + editingId, { method: "DELETE" });
      }

      // Yeni/Güncel adresi ekle
      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.dismiss(loadingToast);
        toast.success(editingId ? "Adres başarıyla güncellendi." : "Adres başarıyla eklendi.");
        setFormData(formBaslangic);
        setEditingId(null);
        
        // 🚀 BİNGO: Sayfayı yenile ki veritabanından en güncel liste gelsin!
        router.refresh(); 
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

  const handleDeleteAddress = async (id: string) => {
    // Sadece ekrandan anlık sil (Hızlı tepki hissi için)
    setAddresses(prev => prev.filter(addr => addr._id !== id)); 
    try {
      await fetch("/api/addresses?id=" + id, { method: "DELETE" });
      toast.success("Adres silindi.");
      router.refresh(); 
    } catch (error) {
      toast.error("Silme işlemi başarısız.");
      router.refresh(); 
    }
  };

  const handleEditClick = (address: Address) => {
    setFormData({
      title: address.title, 
      fullName: address.fullName, 
      phone: address.phone, 
      email: address.email || "", 
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

  // Form Kapatıldığında her şeyi sıfırla (Adreslerin kaybolmasını engeller)
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(formBaslangic);
  }

  return (
   <div className="w-full max-w-4xl mx-auto relative z-10 pt-8 md:pt-0 px-0 md:px-0">
      
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-slate-800 pb-6 mb-10">
        <div>
          <Link href="/" prefetch={true} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-[#3b82f6] transition-all mb-3">
            <ArrowLeft className="w-4 h-4" /> Mağazaya Geri Dön
          </Link>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white">
            KAYITLI <span className="text-[#00dM2ff] drop-shadow-[0_0_15px_rgba(0,210,255,0.2)]">ADRESLERİM</span>
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="text-slate-300 text-xs font-black uppercase tracking-wider bg-[#09090b] border border-slate-800/80 py-3 px-5 rounded-xl shadow-lg w-full sm:w-auto text-center">
            Kayıtlı: <span className="text-[#3b82f6] font-black text-sm">{addresses.length}</span> Adres
          </div>
          {!showForm && (
            <button
              onClick={() => { setFormData(formBaslangic); setEditingId(null); setShowForm(true); }}
              className="w-full sm:w-auto flex justify-center items-center gap-2 bg-[#3b82f6] text-black px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-[#00c4db] transition-all shadow-[0_0_15px_rgba(0,210,255,0.2)]"
            >
              <Plus size={16} /> YENİ EKLE
            </button>
          )}
        </div>
      </div>

      {showForm && (
        <div className="bg-[#080d1a] border border-white/10 rounded-2xl p-6 mb-8 animate-in fade-in slide-in-from-top-4 shadow-2xl">
         <div className="mb-6 border-b border-white/10 pb-4 flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2 text-[#3b82f6]">
              <MapPin /> {editingId ? "Adresi Düzenle" : "Yeni Adres Bilgileri"}
            </h2>
            <button onClick={handleCloseForm} className="text-slate-500 hover:text-red-500 text-xs font-bold uppercase flex items-center gap-1">
              <X size={14}/> Kapat
            </button>
          </div>

          <form onSubmit={handleAddAddress} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-400 font-bold uppercase">Adres Başlığı</label>
              <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="bg-[#050B14] border border-white/10 rounded-lg p-3 text-sm focus:border-[#3b82f6]/50 outline-none transition-colors text-white" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-400 font-bold uppercase">Ad Soyad</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required className="bg-[#050B14] border border-white/10 rounded-lg p-3 text-sm focus:border-[#3b82f6]/50 outline-none transition-colors text-white" />
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-400 font-bold uppercase">Telefon</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required className="bg-[#050B14] border border-white/10 rounded-lg p-3 text-sm focus:border-[#3b82f6]/50 outline-none transition-colors text-white" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-400 font-bold uppercase">E-Posta</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="bg-[#050B14] border border-white/10 rounded-lg p-3 text-sm focus:border-[#3b82f6]/50 outline-none transition-colors text-white" />
            </div>

            <div className="grid grid-cols-2 gap-4 md:col-span-2">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-400 font-bold uppercase">İl</label>
                <input type="text" name="city" value={formData.city} onChange={handleInputChange} required className="bg-[#050B14] border border-white/10 rounded-lg p-3 text-sm focus:border-[#3b82f6]/50 outline-none transition-colors text-white" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-400 font-bold uppercase">İlçe</label>
                <input type="text" name="district" value={formData.district} onChange={handleInputChange} required className="bg-[#050B14] border border-white/10 rounded-lg p-3 text-sm focus:border-[#3b82f6]/50 outline-none transition-colors text-white" />
              </div>
            </div>
            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-xs text-slate-400 font-bold uppercase">Açık Adres</label>
              <textarea name="fullAddress" value={formData.fullAddress} onChange={handleInputChange} required rows={3} className="bg-[#050B14] border border-white/10 rounded-lg p-3 text-sm focus:border-[#3b82f6]/50 outline-none transition-colors text-white"></textarea>
            </div>

            <div className="md:col-span-2 flex flex-col md:flex-row gap-6 mt-2 mb-4">
              <label className="flex items-center gap-3 cursor-pointer text-sm text-slate-300 hover:text-white transition-colors">
                <input type="checkbox" className="w-5 h-5 rounded border-white/10 bg-[#050B14] checked:bg-[#3b82f6] focus:ring-[#3b82f6] cursor-pointer" checked={formData.isDefaultDelivery} onChange={(e) => setFormData({ ...formData, isDefaultDelivery: e.target.checked })} />
                Bu benim varsayılan teslimat adresim 
              </label>
              <label className="flex items-center gap-3 cursor-pointer text-sm text-slate-300 hover:text-white transition-colors">
                <input type="checkbox" className="w-5 h-5 rounded border-white/10 bg-[#050B14] checked:bg-[#3b82f6] focus:ring-[#3b82f6] cursor-pointer" checked={formData.isDefaultBilling} onChange={(e) => setFormData({ ...formData, isDefaultBilling: e.target.checked })} />
                Bu benim fatura adresim
              </label>
            </div>

            <div className="md:col-span-2 flex justify-end mt-2">
              <button type="submit" disabled={isSubmitting} className="bg-[#3b82f6] text-black px-8 py-3 rounded-xl font-black uppercase tracking-widest hover:bg-[#00c4db] transition-all disabled:opacity-50">
                {isSubmitting ? "İŞLENİYOR..." : editingId ? "DEĞİŞİKLİKLERİ KAYDET" : "ADRESİ KAYDET"}
              </button>
            </div>
          </form>
        </div>
      )}

      {addresses.length === 0 && !showForm && (
        <div className="text-center p-10 sm:p-16 bg-transparent relative">
          <div className="w-20 h-20 rounded-full bg-[#121215]/50 border border-slate-800/50 flex items-center justify-center mx-auto mb-6 shadow-inner">
            <MapPin className="w-10 h-10 text-slate-500" />
          </div>
          <h2 className="text-xl font-black uppercase tracking-wide mb-2 text-white">Kayıtlı Adres Yok</h2>
          <p className="text-slate-400 text-sm max-w-sm mx-auto mb-8 font-medium leading-relaxed">
            Hesabınıza henüz bir adres eklemediniz. Daha hızlı ve güvenli alışveriş deneyimi için hemen yeni bir adres oluşturabilirsiniz.
          </p>
          <button onClick={() => setShowForm(true)} className="inline-block bg-[#3b82f6] text-black px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-[#00c4db] transition-all shadow-[0_0_20px_rgba(0,210,255,0.2)] hover:shadow-[0_0_30px_rgba(0,210,255,0.4)] hover:-translate-y-0.5">
            Yeni Adres Ekle
          </button>
        </div>
      )}

      {addresses.length > 0 && !showForm && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {addresses.map((address) => (
            <div key={address._id} className="bg-[#09090b] border border-white/10 rounded-2xl p-6 relative group hover:border-[#3b82f6]/30 transition-colors">
              <div className="flex justify-between items-start mb-4 border-b border-white/10 pb-3">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-[#3b82f6] font-bold">
                    <MapPin size={18} />
                    <span>{address.title}</span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {address.isDefaultDelivery && <span className="px-2 py-1 bg-[#3b82f6]/10 text-[#3b82f6] text-[10px] rounded border border-[#3b82f6]/20 font-medium tracking-wider">VARS. TESLİMAT</span>}
                    {address.isDefaultBilling && <span className="px-2 py-1 bg-amber-500/10 text-amber-400 text-[10px] rounded border border-amber-500/20 font-medium tracking-wider">FATURA ADRESİ</span>}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={() => handleEditClick(address)} className="text-slate-400 hover:text-[#3b82f6] transition-colors" title="Bu Adresi Düzenle">
                    <Edit2 className="w-[18px] h-[18px]" />
                  </button>
                  <button onClick={() => setAddressToDelete(address._id)} className="text-slate-400 hover:text-rose-500 transition-colors" title="Adresi Sil">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="space-y-2 text-sm text-slate-300">
                <p className="font-bold text-white">{address.fullName}</p>
                <div className="flex flex-col gap-1 text-slate-400 text-xs">
                   <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {address.phone}</p>
                   {address.email && <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {address.email}</p>}
                </div>
                <p className="mt-2 line-clamp-2 pt-2 border-t border-slate-800/50" title={address.fullAddress}>{address.fullAddress}</p>
                <p className="text-[#3b82f6]/80 font-medium">{address.district} / {address.city}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {addressToDelete && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-[#09090b] border border-slate-800/80 rounded-3xl p-6 sm:p-8 max-w-sm w-full flex flex-col items-center text-center shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full border border-slate-800 flex items-center justify-center mb-4 bg-[#121215] shadow-inner">
              <Trash2 className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-lg font-black text-white uppercase tracking-wider mb-2">Adresi Sil</h3>
            <p className="text-slate-400 text-sm mb-8 font-medium leading-relaxed">Bu adresi kalıcı olarak silmek istediğinize emin misiniz?</p>
            <div className="flex w-full gap-3">
              <button onClick={() => setAddressToDelete(null)} className="flex-1 bg-[#121215] border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white font-bold py-3.5 rounded-xl transition-all text-xs uppercase tracking-wider">İptal</button>
              <button 
                onClick={() => { handleDeleteAddress(addressToDelete); setAddressToDelete(null); }} 
                className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold py-3.5 rounded-xl transition-all text-xs uppercase tracking-wider shadow-lg"
              >
                Evet, Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}