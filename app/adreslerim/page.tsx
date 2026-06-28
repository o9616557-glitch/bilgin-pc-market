"use client";

import React, { useEffect, useState } from "react";
import AccountShell from "@/components/layout/AccountShell";
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
}

export default function AdreslerimPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "", fullName: "", phone: "", city: "", district: "", fullAddress: "",
  });

  const fetchAddresses = async () => {
    try {
      const res = await fetch("/api/addresses");
      const data = await res.json();
      if (res.ok) setAddresses(data.addresses);
      else if (res.status === 401) toast.error("Adreslerinizi görmek için giriş yapmalısınız.");
    } catch { toast.error("Adresler yüklenirken hata oluştu."); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchAddresses(); }, []);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const t = toast.loading("Adres ekleniyor...");
    try {
      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      toast.dismiss(t);
      if (res.ok) {
        toast.success("Adres başarıyla eklendi.");
        setAddresses(data.addresses);
        setShowForm(false);
        setFormData({ title: "", fullName: "", phone: "", city: "", district: "", fullAddress: "" });
      } else toast.error(data.message || "Adres eklenirken bir hata oluştu.");
    } catch { toast.dismiss(t); toast.error("Sunucuya bağlanılamadı."); }
    finally { setIsSubmitting(false); }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Bu adresi silmek istediğinize emin misiniz?")) return;
    const t = toast.loading("Adres siliniyor...");
    try {
      const res = await fetch(`/api/addresses?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      toast.dismiss(t);
      if (res.ok) { toast.success("Adres silindi."); setAddresses(data.addresses); }
      else toast.error(data.message || "Silme işlemi başarısız.");
    } catch { toast.dismiss(t); toast.error("Sunucuya bağlanılamadı."); }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <AccountShell active="adreslerim">
      <div className="flex flex-col gap-5">

        {/* Başlık */}
        <div className="account-card rounded-2xl p-5 sm:p-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-site-accent/[0.04] blur-[50px] pointer-events-none rounded-full" />
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-site-shell border border-white/[0.08] rounded-full flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6 text-cyan-400/80" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-white mb-0.5">Adreslerim</h1>
                <p className="text-slate-400 text-xs sm:text-sm">Teslimat ve fatura adreslerinizi yönetin</p>
              </div>
            </div>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-1.5 text-xs font-semibold text-site-accent border border-site-accent/30 rounded-xl px-3 py-2 hover:bg-site-accent/10 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Adres Ekle
              </button>
            )}
          </div>
        </div>

        {/* Yeni Adres Formu */}
        {showForm && (
          <div className="account-card rounded-2xl p-5 sm:p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-semibold flex items-center gap-2">
                <MapPin className="w-4 h-4 text-site-accent" /> Yeni Adres
              </h2>
              <button onClick={() => setShowForm(false)} className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
                İptal
              </button>
            </div>
            <form onSubmit={handleAddAddress} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { name: "title", label: "Adres Başlığı (Evim, İş Yerim...)" },
                { name: "fullName", label: "Ad Soyad" },
                { name: "phone", label: "Telefon" },
                { name: "city", label: "İl" },
                { name: "district", label: "İlçe" },
              ].map(({ name, label }) => (
                <div key={name} className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
                  <input
                    type="text"
                    name={name}
                    value={(formData as any)[name]}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-site-shell border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-site-accent/50 placeholder:text-slate-600 transition-all"
                  />
                </div>
              ))}
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Açık Adres</label>
                <textarea
                  name="fullAddress"
                  value={formData.fullAddress}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full bg-site-shell border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-site-accent/50 placeholder:text-slate-600 transition-all resize-none"
                />
              </div>
              <div className="sm:col-span-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-site-accent-strong to-blue-600 hover:opacity-90 text-white font-semibold text-sm transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" />Kaydediliyor...</> : "Adresi Kaydet"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Adres Listesi */}
        {isLoading ? (
          <div className="account-card rounded-2xl p-12 flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-site-accent/50 animate-spin" />
            <p className="text-slate-500 text-sm">Adresleriniz yükleniyor...</p>
          </div>
        ) : addresses.length === 0 && !showForm ? (
          <div className="account-card rounded-2xl p-12 flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-site-shell border border-white/[0.06] flex items-center justify-center">
              <Home className="w-7 h-7 text-slate-600" />
            </div>
            <div>
              <p className="text-white font-semibold">Kayıtlı adres yok</p>
              <p className="text-slate-500 text-sm mt-1">Siparişlerinizde kullanmak için adres ekleyin.</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 py-2.5 px-5 rounded-xl bg-gradient-to-r from-site-accent-strong to-blue-600 hover:opacity-90 text-white font-semibold text-sm transition-all"
            >
              <Plus className="w-4 h-4" /> İlk Adresini Ekle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addresses.map((address) => (
              <div
                key={address._id}
                className="account-card rounded-2xl p-5 flex flex-col gap-3 hover:border-site-accent/20 transition-colors"
              >
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                  <div className="flex items-center gap-2 text-site-accent font-semibold text-sm">
                    <MapPin className="w-4 h-4" /> {address.title}
                  </div>
                  <button
                    onClick={() => handleDeleteAddress(address._id)}
                    className="text-slate-600 hover:text-rose-400 transition-colors"
                    title="Adresi Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-col gap-1 text-sm">
                  <p className="text-white font-medium">{address.fullName}</p>
                  <p className="text-slate-500">{address.phone}</p>
                  <p className="text-slate-400 text-xs mt-1 line-clamp-2">{address.fullAddress}</p>
                  <p className="text-site-accent/70 text-xs font-medium">{address.district} / {address.city}</p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </AccountShell>
  );
}
