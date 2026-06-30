"use client";

import React, { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { MapPin, Plus, Trash2, Loader2, Home, Edit2, X } from "lucide-react";
import toast from "react-hot-toast";

interface Address {
  _id: string;
  title: string;
  fullName: string;
  phone: string;
  email: string;
  city: string;
  district: string;
  fullAddress: string;
}

const BOSH_FORM = { title: "", fullName: "", phone: "", email: "", city: "", district: "", fullAddress: "" };
const CACHE_KEY = "bilgin_adresler_cache";

/* ── Tam ekran form modal ── */
function AdresModal({
  mode,
  initialData,
  onSave,
  onClose,
}: {
  mode: "add" | "edit";
  initialData?: Address;
  onSave: (data: Omit<Address, "_id"> & { _id?: string }) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState(initialData ? { ...initialData } : { ...BOSH_FORM });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave(form as any);
    setSaving(false);
  };

  const ALANLAR = [
    { name: "title",       label: "Adres Başlığı",      placeholder: "Evim, İş Yerim...", col: 1 },
    { name: "fullName",    label: "Ad Soyad",            placeholder: "Ahmet Yılmaz",      col: 1 },
    { name: "phone",       label: "Telefon",             placeholder: "0555 000 00 00",    col: 1 },
    { name: "email",       label: "E-posta",             placeholder: "adres@eposta.com",  col: 1 },
    { name: "city",        label: "İl",                  placeholder: "Ankara",            col: 1 },
    { name: "district",    label: "İlçe",                placeholder: "Çankaya",           col: 1 },
  ];

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex flex-col sm:items-center sm:justify-center bg-black/70 backdrop-blur-sm">
      <div className="h-full sm:h-auto w-full sm:max-w-lg bg-[#0b1121] border-0 sm:border border-white/[0.08] sm:rounded-2xl flex flex-col sm:max-h-[90vh]">

        {/* Modal başlık */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] shrink-0">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-site-accent" />
            <span className="text-white font-semibold text-sm">
              {mode === "add" ? "Yeni Adres Ekle" : "Adresi Düzenle"}
            </span>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form scroll alanı */}
        <div className="overflow-y-auto flex-1 min-h-0 px-5 py-4 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/10">
          <form id="adres-form" onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
            {ALANLAR.map(({ name, label, placeholder }) => (
              <div key={name} className="flex flex-col gap-1.5 col-span-1">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
                <input
                  type={name === "email" ? "email" : "text"}
                  name={name}
                  value={(form as any)[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  required
                  className="w-full bg-[#060f1e] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-site-accent/50 placeholder:text-slate-700 transition-all"
                />
              </div>
            ))}
            <div className="col-span-2 flex flex-col gap-1.5">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Açık Adres</label>
              <textarea
                name="fullAddress"
                value={form.fullAddress}
                onChange={handleChange}
                required
                rows={3}
                placeholder="Mahalle, sokak, bina no, daire..."
                className="w-full bg-[#060f1e] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-site-accent/50 placeholder:text-slate-700 transition-all resize-none"
              />
            </div>
          </form>
        </div>

        {/* Kaydet butonu */}
        <div className="px-5 py-4 border-t border-white/[0.06] shrink-0">
          <button
            type="submit"
            form="adres-form"
            disabled={saving}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-site-accent-strong to-blue-600 hover:opacity-90 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Kaydediliyor...</> : mode === "add" ? "Adresi Kaydet" : "Değişiklikleri Kaydet"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ── Ana sayfa ── */
export default function AdreslerimPage() {
  const [addresses, setAddresses]   = useState<Address[]>([]);
  const [isLoading, setIsLoading]   = useState(true);
  const [modalMode, setModalMode]   = useState<"add" | "edit" | null>(null);
  const [editTarget, setEditTarget] = useState<Address | null>(null);
  const [portalReady, setPortalReady]   = useState(false);
  const [silinecekId, setSilinecekId]   = useState<string | null>(null);

  useEffect(() => { setPortalReady(true); }, []);

  /* Cache-first fetch — sadece ilk açılışta API'ye gider */
  const fetchAddresses = useCallback(async (force = false) => {
    if (!force) {
      try {
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
          setAddresses(JSON.parse(cached));
          setIsLoading(false);
          return;
        }
      } catch { /* sessionStorage erişimi yoksa devam */ }
    }
    try {
      const res  = await fetch("/api/addresses");
      const data = await res.json();
      if (res.ok) {
        setAddresses(data.addresses);
        try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(data.addresses)); } catch {}
      } else if (res.status === 401) toast.error("Adreslerinizi görmek için giriş yapmalısınız.");
    } catch { toast.error("Adresler yüklenirken hata oluştu."); }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => { fetchAddresses(); }, [fetchAddresses]);

  const updateCache = (list: Address[]) => {
    setAddresses(list);
    try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(list)); } catch {}
  };

  /* Adres Ekle */
  const handleAdd = async (form: Omit<Address, "_id">) => {
    const t = toast.loading("Adres ekleniyor...");
    try {
      const res  = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      toast.dismiss(t);
      if (res.ok) { toast.success("Adres eklendi."); updateCache(data.addresses); setModalMode(null); }
      else toast.error(data.message || "Eklenirken hata oluştu.");
    } catch { toast.dismiss(t); toast.error("Sunucuya bağlanılamadı."); }
  };

  /* Adres Düzenle */
  const handleEdit = async (form: Address) => {
    const t = toast.loading("Güncelleniyor...");
    try {
      const res  = await fetch("/api/addresses", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      toast.dismiss(t);
      if (res.ok) { toast.success("Adres güncellendi."); updateCache(data.addresses); setModalMode(null); setEditTarget(null); }
      else toast.error(data.message || "Güncellenirken hata oluştu.");
    } catch { toast.dismiss(t); toast.error("Sunucuya bağlanılamadı."); }
  };

  /* Adres Sil */
  const handleDelete = async (id: string) => {
    const t = toast.loading("Siliniyor...");
    setSilinecekId(null);
    try {
      const res  = await fetch(`/api/addresses?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      toast.dismiss(t);
      if (res.ok) { toast.success("Adres silindi."); updateCache(data.addresses); }
      else toast.error(data.message || "Silme işlemi başarısız.");
    } catch { toast.dismiss(t); toast.error("Sunucuya bağlanılamadı."); }
  };

  return (
    <>
      <div className="flex flex-col gap-5">

        {/* Başlık */}
        <div className="account-card rounded-2xl p-5 sm:p-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-site-accent/[0.04] blur-[50px] pointer-events-none rounded-full" />
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-site-shell border border-white/[0.08] rounded-full flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6 text-cyan-400/80" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-white mb-0.5 truncate">Adreslerim</h1>
                <p className="text-slate-400 text-xs sm:text-sm">Teslimat ve fatura adreslerinizi yönetin</p>
              </div>
            </div>
            <button
              onClick={() => setModalMode("add")}
              className="flex items-center gap-1.5 text-xs font-semibold text-site-accent border border-site-accent/30 rounded-xl px-2.5 py-2 sm:px-3 hover:bg-site-accent/10 transition-colors shrink-0"
            >
              <Plus className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Adres Ekle</span>
            </button>
          </div>
        </div>

        {/* İçerik */}
        {isLoading ? (
          <div className="account-card rounded-2xl p-12 flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-site-accent/50 animate-spin" />
            <p className="text-slate-500 text-sm">Yükleniyor...</p>
          </div>
        ) : addresses.length === 0 ? (
          <div className="account-card rounded-2xl p-12 flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-site-shell border border-white/[0.06] flex items-center justify-center">
              <Home className="w-7 h-7 text-slate-600" />
            </div>
            <div>
              <p className="text-white font-semibold">Kayıtlı adres yok</p>
              <p className="text-slate-500 text-sm mt-1">Siparişlerinizde kullanmak için adres ekleyin.</p>
            </div>
            <button
              onClick={() => setModalMode("add")}
              className="flex items-center gap-2 py-2.5 px-5 rounded-xl bg-gradient-to-r from-site-accent-strong to-blue-600 hover:opacity-90 text-white font-semibold text-sm transition-all"
            >
              <Plus className="w-4 h-4" /> İlk Adresini Ekle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addresses.map((address) => (
              <div key={address._id} className="account-card rounded-2xl p-5 flex flex-col gap-3 hover:border-site-accent/20 transition-colors">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                  <div className="flex items-center gap-2 text-site-accent font-semibold text-sm">
                    <MapPin className="w-4 h-4" /> {address.title}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => { setEditTarget(address); setModalMode("edit"); }}
                      className="text-slate-600 hover:text-blue-400 transition-colors p-1.5 rounded-lg hover:bg-blue-500/10"
                      title="Düzenle"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setSilinecekId(silinecekId === address._id ? null : address._id)}
                      className="text-slate-600 hover:text-rose-400 transition-colors p-1.5 rounded-lg hover:bg-rose-500/10"
                      title="Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Inline silme onayı */}
                {silinecekId === address._id && (
                  <div className="flex items-center justify-between bg-rose-500/10 border border-rose-500/20 rounded-xl px-3 py-2.5">
                    <p className="text-rose-300 text-xs font-medium">Bu adresi silmek istediğine emin misin?</p>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <button
                        onClick={() => setSilinecekId(null)}
                        className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded-lg transition-colors"
                      >
                        İptal
                      </button>
                      <button
                        onClick={() => handleDelete(address._id)}
                        className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold px-3 py-1 rounded-lg transition-colors"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-1 text-sm">
                  <p className="text-white font-medium">{address.fullName}</p>
                  <p className="text-slate-500 text-xs">{address.phone}</p>
                  {address.email && <p className="text-slate-500 text-xs">{address.email}</p>}
                  <p className="text-slate-400 text-xs mt-1 line-clamp-2">{address.fullAddress}</p>
                  <p className="text-site-accent/70 text-xs font-medium">{address.district} / {address.city}</p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Modaller */}
      {portalReady && modalMode === "add" && (
        <AdresModal
          mode="add"
          onSave={(form) => handleAdd(form as Omit<Address, "_id">)}
          onClose={() => setModalMode(null)}
        />
      )}
      {portalReady && modalMode === "edit" && editTarget && (
        <AdresModal
          mode="edit"
          initialData={editTarget}
          onSave={(form) => handleEdit(form as Address)}
          onClose={() => { setModalMode(null); setEditTarget(null); }}
        />
      )}
    </>
  );
}
