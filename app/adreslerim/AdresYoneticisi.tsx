"use client";

import React, { useState, useEffect } from "react";
import { 
  MapPin, Plus, Trash2, Mail, Phone, Edit2, X, 
  User, ShieldCheck, CreditCard, Loader2,
  Truck, Search, Star, Monitor, Package, Calendar, PackageX, Copy,
  Headphones
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { useOrders } from "@/app/OrderContext";
// 🚀 DİKKAT: router.refresh() belasını tekrar tamamen kaldırdık!

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
  
  const [kargoPopupAcik, setKargoPopupAcik] = useState(false);
  const { orders: localOrders } = useOrders();
  
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // 🚀 SESSİZ ÇIRAK FONKSİYONU: Veritabanındaki en güncel adresleri arkadan çeker
  const adresleriGuncelle = async () => {
    try {
      const zamanDamgasi = new Date().getTime();
      const res = await fetch("/api/addresses?t=" + zamanDamgasi, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache", "Pragma": "no-cache" }
      });
      if (res.ok) {
        const data = await res.json();
        const guncelListe = data.addresses || data.data || (Array.isArray(data) ? data : []);
        
        // Ekranı güncelle ve anında Tarayıcı Hafızasına (sessionStorage) kaydet!
        setAddresses(guncelListe);
        sessionStorage.setItem("bilgin-adresler", JSON.stringify(guncelListe));
      }
    } catch (error) {
      console.error("Adresler arka planda güncellenemedi", error);
    }
  };

  // 🚀 BİNGO: HAFIZA MOTORU! (Sepet mantığının aynısı)
  useEffect(() => {
    // 1. Sayfa açılır açılmaz Next.js'in eski verisi yerine TARAYICI HAFIZASINA bakıyoruz
    const hafiza = sessionStorage.getItem("bilgin-adresler");
    
    if (hafiza) {
      // Eğer hafızada güncel liste varsa, göz kırpma olmasın diye anında onu basıyoruz
      setAddresses(JSON.parse(hafiza));
    } else {
      // İlk defa giriyorsa sunucudan geleni kullanıyoruz
      setAddresses(initialAddresses);
    }

    // 2. Ardından her ihtimale karşı arka planda güncel listeyi çekip kontrol ediyoruz
    adresleriGuncelle();
  }, []); // Sadece sayfa yüklendiğinde çalışır

  // 🚀 MODAL VE FORM AÇILINCA ARKA PLANI DONDURAN MOTOR
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (showForm || addressToDelete || kargoPopupAcik) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }
    }
    return () => { document.body.style.overflow = 'unset'; }; 
  }, [showForm, addressToDelete, kargoPopupAcik]);

  const formBaslangic = {
    title: "", fullName: "", phone: "", email: "", city: "", district: "", fullAddress: "", isDefaultDelivery: false, isDefaultBilling: false
  };
  const [formData, setFormData] = useState(formBaslangic);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setShowForm(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    const loadingToast = toast.loading(editingId ? "Adres güncelleniyor..." : "Adres ekleniyor...");

    try {
      if (editingId) {
        await fetch("/api/addresses?id=" + editingId, { method: "DELETE" });
      }

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

        // İşlem biter bitmez Çırak arkadan veriyi günceller ve HAFIZAYA yazar.
        // router.refresh() OLMADIĞI İÇİN ASLA KASMA YAPMAZ!
        adresleriGuncelle();
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
    // 1. Önce kullanıcı beklememesi için ekrandan anında ışık hızında sileriz
    const yeniListe = addresses.filter(addr => addr._id !== id);
    setAddresses(yeniListe); 
    
    // 2. Sildiğimiz yeni durumu anında Tarayıcı Hafızasına yazıyoruz ki başka sayfaya gidince hortlamasın!
    sessionStorage.setItem("bilgin-adresler", JSON.stringify(yeniListe));
    
    // 3. Ardından arkadan veritabanına silme isteğini atarız
    try {
      const res = await fetch("/api/addresses?id=" + id, { method: "DELETE" });
      if(res.ok) {
         toast.success("Adres silindi.");
         // Arka planı tam senkronize etmek için çırağı çalıştır
         adresleriGuncelle(); 
      } else {
         toast.error("Veritabanından silinemedi.");
      }
    } catch (error) {
      toast.error("Silme işlemi başarısız.");
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

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(formBaslangic);
  }

  return (
    <>
      <div className="min-h-screen bg-[#020617] text-white font-sans p-4 sm:p-6 lg:p-8 relative overflow-clip">
        {/* 🚀 ARKA PLAN PARLAMASI */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-cyan-600 blur-[250px] opacity-[0.05] pointer-events-none rounded-full z-0"></div>

        <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-5 lg:gap-8 relative z-10 items-start">
          
          {/* ⬅️ SOL MENÜ */}
          <div className="w-full lg:w-[280px] shrink-0 flex flex-col gap-2 static lg:sticky lg:top-28 z-10">
            <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-slate-800 rounded-xl p-2 sm:p-4 shadow-xl overflow-x-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
             <nav className="flex flex-row lg:flex-col gap-1.5 min-w-max lg:min-w-0">
                <Link href="/hesabim" prefetch={false} className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-[11px] sm:text-sm text-slate-400 hover:text-white hover:bg-[#020617] rounded-lg transition-all font-medium">
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Profil
                </Link>
                <Link href="/cuzdan" prefetch={false} className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-[11px] sm:text-sm text-slate-400 hover:text-white hover:bg-[#020617] rounded-lg transition-all font-medium">
                  <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Dijital Cüzdanım
                </Link>
                <Link href="/guvenlik" prefetch={false} className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-[11px] sm:text-sm text-slate-400 hover:text-white hover:bg-[#020617] rounded-lg transition-all font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Güvenlik
                </Link>
              </nav>
            </div>
          </div>

          {/* ➡️ SAĞ İÇERİK */}
          <div className="flex-1 flex flex-col min-w-0 w-full relative gap-5 lg:gap-6 animate-in fade-in duration-300">
            
         {/* 🚀 FASULYE MENÜ */}
           <div className="flex flex-nowrap items-center gap-3 w-full overflow-x-auto pt-2 pb-2 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
              
              <Link href="/siparislerim" prefetch={false} className="flex items-center justify-center gap-2 px-5 py-3 bg-[#0f172a] hover:bg-cyan-600/10 border border-slate-800 hover:border-cyan-500/30 rounded-full transition-all text-xs font-black text-slate-300 hover:text-cyan-400 whitespace-nowrap shadow-sm flex-1 sm:flex-none">
                <Package className="w-4 h-4 text-cyan-500" /> Siparişler
              </Link>

              <Link href="/favorilerim" prefetch={false} className="flex items-center justify-center gap-2 px-5 py-3 bg-[#0f172a] hover:bg-cyan-600/10 border border-slate-800 hover:border-cyan-500/30 rounded-full transition-all text-xs font-black text-slate-300 hover:text-cyan-400 whitespace-nowrap shadow-sm flex-1 sm:flex-none">
                <Star className="w-4 h-4 text-cyan-500" /> Favoriler
              </Link>

              <Link href="/sistemlerim" prefetch={false} className="flex items-center justify-center gap-2 px-5 py-3 bg-[#0f172a] hover:bg-cyan-600/10 border border-slate-800 hover:border-cyan-500/30 rounded-full transition-all text-xs font-black text-slate-300 hover:text-cyan-400 whitespace-nowrap shadow-sm flex-1 sm:flex-none">
                <Monitor className="w-4 h-4 text-cyan-500" /> Sistemler
              </Link>

              <Link href="/destek-taleplerim" prefetch={false} className="flex items-center justify-center gap-2 px-5 py-3 bg-[#0f172a] hover:bg-cyan-600/10 border border-slate-800 hover:border-cyan-500/30 rounded-full transition-all text-xs font-black text-slate-300 hover:text-cyan-400 whitespace-nowrap shadow-sm flex-1 sm:flex-none">
                <Headphones className="w-4 h-4 text-cyan-500" /> Destek / İade
              </Link>

              <Link href="/siparis-takip" prefetch={false} className="flex items-center justify-center gap-2 px-5 py-3 bg-[#0f172a] hover:bg-cyan-600/10 border border-slate-800 hover:border-cyan-500/30 rounded-full transition-all text-xs font-black text-slate-300 hover:text-cyan-400 whitespace-nowrap shadow-sm flex-1 sm:flex-none">
                <Search className="w-4 h-4 text-cyan-500" /> Sorgula
              </Link>

              <button onClick={() => setKargoPopupAcik(true)} className="flex items-center justify-center gap-2 px-5 py-3 bg-[#0f172a] hover:bg-cyan-600/10 border border-slate-800 hover:border-cyan-500/30 rounded-full transition-all text-xs font-black text-slate-300 hover:text-cyan-400 whitespace-nowrap shadow-sm flex-1 sm:flex-none relative">
                <Truck className="w-4 h-4 text-cyan-500" /> Kargolar
                {localOrders.filter(o => (o.durum || o.status || "").toLocaleLowerCase("tr-TR").includes("kargo")).length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-[9px] font-bold text-white shadow-lg">
                    {localOrders.filter(o => (o.durum || o.status || "").toLocaleLowerCase("tr-TR").includes("kargo")).length}
                  </span>
                )}
              </button>

            </div>

            {/* 🚀 BAŞLIK KUTUSU */}
            <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 sm:p-6 shadow-xl relative flex flex-col gap-5 z-40">
              <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-500/10 blur-[60px] rounded-full"></div>
              </div>
              
              <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-5 relative z-10">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-12 h-12 bg-[#020617] border border-cyan-500/30 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.2)] shrink-0">
                    <MapPin className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-0.5">Adres Yönetimi</h1>
                    <p className="text-cyan-400/80 text-xs font-medium tracking-wide">
                      Kayıtlı: <span className="font-black text-cyan-400">{addresses.length}</span> Adres
                    </p>
                  </div>
                </div>

                {!showForm && (
                  <div className="flex flex-row items-center gap-2 sm:gap-3 w-full xl:w-auto relative z-50">
                    <button 
                      onClick={() => { setFormData(formBaslangic); setEditingId(null); setShowForm(true); }}
                      className="w-full xl:w-auto flex items-center justify-center gap-1.5 sm:gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 border border-cyan-500/30 rounded-lg px-4 sm:px-6 py-3 transition-colors text-[10px] sm:text-xs text-white font-black uppercase tracking-widest shadow-lg"
                    >
                      <Plus className="w-4 h-4 shrink-0" /> YENİ ADRES EKLE
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 🚀 FORM ALANI */}
            {showForm && (
              <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 sm:p-8 shadow-xl relative overflow-hidden animate-in fade-in slide-in-from-top-4">
                <div className="mb-6 border-b border-slate-800/80 pb-4 flex justify-between items-center">
                  <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-cyan-400" /> {editingId ? "Adresi Düzenle" : "Yeni Adres Bilgileri"}
                  </h2>
                  <button onClick={handleCloseForm} className="text-slate-500 hover:text-rose-500 text-xs font-bold uppercase tracking-widest flex items-center gap-1 transition-colors bg-[#020617] px-3 py-1.5 rounded-lg border border-slate-800">
                    <X className="w-3.5 h-3.5"/> Kapat
                  </button>
                </div>

                <form onSubmit={handleAddAddress} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] sm:text-xs text-slate-500 font-black uppercase tracking-widest ml-1">Adres Başlığı</label>
                    <input type="text" name="title" value={formData.title} onChange={handleInputChange} required placeholder="Ev, İş, Ofis vb." className="bg-[#020617] border border-slate-800 focus:border-cyan-500/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] sm:text-xs text-slate-500 font-black uppercase tracking-widest ml-1">Ad Soyad</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required placeholder="Teslim alacak kişi" className="bg-[#020617] border border-slate-800 focus:border-cyan-500/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors" />
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] sm:text-xs text-slate-500 font-black uppercase tracking-widest ml-1">Telefon</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="05XX XXX XX XX" className="bg-[#020617] border border-slate-800 focus:border-cyan-500/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] sm:text-xs text-slate-500 font-black uppercase tracking-widest ml-1">E-Posta</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="E-posta adresiniz" className="bg-[#020617] border border-slate-800 focus:border-cyan-500/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 sm:gap-5 md:col-span-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] sm:text-xs text-slate-500 font-black uppercase tracking-widest ml-1">İl</label>
                      <input type="text" name="city" value={formData.city} onChange={handleInputChange} required placeholder="Şehir seçin" className="bg-[#020617] border border-slate-800 focus:border-cyan-500/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] sm:text-xs text-slate-500 font-black uppercase tracking-widest ml-1">İlçe</label>
                      <input type="text" name="district" value={formData.district} onChange={handleInputChange} required placeholder="İlçe seçin" className="bg-[#020617] border border-slate-800 focus:border-cyan-500/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-[10px] sm:text-xs text-slate-500 font-black uppercase tracking-wider ml-1">Açık Adres</label>
                    <textarea name="fullAddress" value={formData.fullAddress} onChange={handleInputChange} required rows={3} placeholder="Mahalle, sokak, bina ve daire numarası..." className="bg-[#020617] border border-slate-800 focus:border-cyan-500/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors resize-none"></textarea>
                  </div>

                  <div className="md:col-span-2 flex flex-col md:flex-row gap-4 sm:gap-6 mt-2 mb-4 bg-[#020617] p-4 rounded-xl border border-slate-800">
                    <label className="flex items-center gap-3 cursor-pointer text-xs sm:text-sm text-slate-300 hover:text-white transition-colors font-medium">
                      <input type="checkbox" className="w-5 h-5 rounded border-slate-700 bg-[#0f172a] checked:bg-cyan-500 focus:ring-cyan-500 cursor-pointer accent-cyan-500" checked={formData.isDefaultDelivery} onChange={(e) => setFormData({ ...formData, isDefaultDelivery: e.target.checked })} />
                      Varsayılan Teslimat Adresi
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer text-xs sm:text-sm text-slate-300 hover:text-white transition-colors font-medium">
                      <input type="checkbox" className="w-5 h-5 rounded border-slate-700 bg-[#0f172a] checked:bg-blue-500 focus:ring-blue-500 cursor-pointer accent-blue-500" checked={formData.isDefaultBilling} onChange={(e) => setFormData({ ...formData, isDefaultBilling: e.target.checked })} />
                      Varsayılan Fatura Adresi
                    </label>
                  </div>
                  <div className="md:col-span-2 flex justify-end mt-2">
                    <button 
                      type="submit" 
                      disabled={isSubmitting} 
                      className="w-full sm:w-auto flex justify-center items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-10 py-3.5 rounded-xl font-black uppercase tracking-widest shadow-[0_0_10px_rgba(6,182,212,0.1)] hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 ease-out disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> İŞLENİYOR...</>
                      ) : editingId ? (
                        "DEĞİŞİKLİKLERİ KAYDET"
                      ) : (
                        "ADRESİ KAYDET"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* 🚀 BOŞ DURUM TEMA UYUMU */}
            {addresses.length === 0 && !showForm && (
              <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-10 sm:p-16 flex flex-col items-center justify-center text-center shadow-xl">
                <div className="w-20 h-20 rounded-full bg-[#020617] border border-cyan-500/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
                  <MapPin className="w-10 h-10 text-cyan-400" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-wide mb-2 text-white">Kayıtlı Adres Yok</h2>
                <p className="text-slate-400 text-sm max-w-sm mx-auto mb-8 font-medium leading-relaxed">
                  Hesabınıza henüz bir adres eklemediniz. Daha hızlı ve güvenli alışveriş deneyimi için hemen yeni bir adres oluşturabilirsiniz.
                </p>
                <button 
                  onClick={() => setShowForm(true)} 
                  className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-8 py-3.5 rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                >
                  <Plus className="w-4 h-4" /> Yeni Adres Ekle
                </button>
              </div>
            )}

            {/* 🚀 ADRES KARTLARI LİSTESİ */}
            {addresses.length > 0 && !showForm && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                {addresses.map((address) => (
                  <div key={address._id} className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 sm:p-6 relative group hover:border-cyan-500/40 transition-all hover:shadow-[0_0_30px_rgba(6,182,212,0.05)] flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4 border-b border-slate-800/80 pb-4">
                      <div className="flex flex-col gap-2.5">
                        <div className="flex items-center gap-2 text-white font-black text-sm sm:text-base tracking-wide uppercase">
                          <MapPin className="w-4 h-4 text-cyan-400" />
                          {address.title}
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {address.isDefaultDelivery && <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 text-[9px] rounded border border-cyan-500/20 font-black tracking-widest uppercase">VARS. TESLİMAT</span>}
                          {address.isDefaultBilling && <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[9px] rounded border border-blue-500/20 font-black tracking-widest uppercase">FATURA ADRESİ</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-[#020617] border border-slate-800 rounded-lg p-1">
                        <button onClick={() => handleEditClick(address)} className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-md transition-colors" title="Bu Adresi Düzenle">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <div className="w-px h-4 bg-slate-800"></div>
                        <button onClick={() => setAddressToDelete(address._id)} className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-md transition-colors" title="Adresi Sil">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-3 flex-1">
                      <p className="font-bold text-slate-200 text-sm">{address.fullName}</p>
                      <div className="flex flex-col gap-1.5 text-slate-400 text-[11px] sm:text-xs font-medium">
                        <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-500" /> {address.phone}</p>
                        {address.email && <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-slate-500" /> {address.email}</p>}
                      </div>
                      <p className="mt-3 text-xs text-slate-300 leading-relaxed pt-3 border-t border-slate-800/50 line-clamp-2" title={address.fullAddress}>
                        {address.fullAddress}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-800/50 flex items-center gap-1.5">
                      <span className="text-cyan-400 text-xs font-black uppercase tracking-wider">{address.district}</span>
                      <span className="text-slate-600 text-xs font-black">/</span>
                      <span className="text-cyan-400/70 text-xs font-black uppercase tracking-wider">{address.city}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🚀 KÜRESEL SİLME MODALI (Z-Index ve Tema Tam Uyumlu) */}
      {addressToDelete && (
        <div style={{ zIndex: 999999 }} className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full flex flex-col items-center text-center shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-red-500"></div>
            <div className="w-16 h-16 rounded-full border border-red-500/20 bg-red-500/10 flex items-center justify-center mb-5">
              <Trash2 className="w-7 h-7 text-red-400 animate-pulse" />
            </div>
            <h3 className="text-lg font-black text-white uppercase tracking-wider mb-2">Adresi Sil</h3>
            <p className="text-slate-400 text-sm mb-8 font-medium leading-relaxed">Bu adresi kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.</p>
            
            <div className="flex w-full gap-3">
              <button onClick={() => setAddressToDelete(null)} className="flex-1 bg-[#020617] border border-slate-700 hover:border-slate-500 hover:text-white text-slate-400 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all">İptal</button>
              <button 
                onClick={() => { handleDeleteAddress(addressToDelete); setAddressToDelete(null); }} 
                className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black py-3.5 rounded-xl transition-all text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(220,38,38,0.2)]"
              >
                Evet, Sil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🚀 MİLİMETRİK KARGOLAR POPUP'I */}
      {kargoPopupAcik && (
        <div style={{ zIndex: 999999 }} className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.9)] relative overflow-hidden animate-in zoom-in-95 duration-200 max-h-[85vh]">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/10 blur-[40px] pointer-events-none rounded-full"></div>
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4 relative z-10 shrink-0">
              <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Truck className="w-5 h-5 text-cyan-400" /> Aktif Kargolarınız
              </h3>
              <button 
                onClick={() => setKargoPopupAcik(false)} 
                className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-white bg-[#020617] border border-slate-800 hover:border-slate-700 rounded-xl transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 space-y-4 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
              {(() => {
                const kargoSiparisleri = localOrders.filter(o => (o.durum || o.status || "").toLocaleLowerCase("tr-TR").includes("kargo"));
                
                if (kargoSiparisleri.length === 0) {
                  return (
                    <div className="text-center py-10 flex flex-col items-center justify-center relative z-10">
                      <div className="w-16 h-16 rounded-full border border-slate-800 flex items-center justify-center mb-4 bg-[#020617]">
                        <PackageX className="w-7 h-7 text-slate-600" />
                      </div>
                      <p className="text-slate-400 font-medium text-sm">Şu an yolda olan aktif kargonuz bulunmuyor.</p>
                    </div>
                  );
                }

                return kargoSiparisleri.map((siparis: any, idx: number) => {
                  const siparisKodu = siparis.siparisKodu || siparis.orderNumber || siparis._id?.slice(-8).toUpperCase() || "SİPARİŞ";
                  const tarih = siparis.createdAt ? new Date(siparis.createdAt).toLocaleDateString("tr-TR") : siparis.tarih ? new Date(siparis.tarih).toLocaleDateString("tr-TR") : "";
                  const firma = siparis.kargoFirmasi || siparis.shippingCompany || "Belirtilmemiş";
                  const takipNo = siparis.takipNo || siparis.kargoTakipNo || siparis.trackingNumber || "Takip No Girilmemiş";

                  return (
                    <div key={siparis._id || idx} className="bg-[#020617] border border-slate-800/80 p-4 rounded-2xl flex flex-col gap-4 group hover:border-cyan-500/30 transition-colors relative z-10 mb-2">
                      <div className="flex justify-between items-center border-b border-slate-800/50 pb-3">
                        <span className="text-xs font-black text-cyan-400 uppercase tracking-widest">#{siparisKodu}</span>
                        <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1"><Calendar className="w-3 h-3"/> {tarih}</span>
                      </div>

                      <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500 font-medium">Kargo Firması</span>
                          <span className="font-bold text-white px-2 py-1 bg-[#0f172a] rounded-md border border-slate-800">{firma}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500 font-medium">Takip Numarası</span>
                          <div className="flex items-center gap-2 px-2 py-1 bg-cyan-950/20 rounded-md border border-cyan-500/20">
                            <span className="font-black text-cyan-400">{takipNo}</span>
                            {takipNo !== "Takip No Girilmemiş" && (
                              <button onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(takipNo);
                                toast.success("Takip numarası kopyalandı!");
                              }} className="text-cyan-600 hover:text-cyan-300 transition-colors">
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #4f46e5; }
      `}</style>
    </>
  );
}