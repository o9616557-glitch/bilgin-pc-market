"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MyAccountPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"orders" | "addresses">("orders");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userName, setUserName] = useState("Değerli Şefimiz");
  
  const [orders, setOrders] = useState<any[]>([]);
  const [customerData, setCustomerData] = useState<any>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  const [editMode, setEditMode] = useState<null | "billing" | "shipping">(null);
  const [toastMessage, setToastMessage] = useState("");

  const [addressForm, setAddressForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    city: "",
    district: "",
    fullAddress: ""
  });

  // CANLI VERİLERİ ÇEKEN MOTOR
  useEffect(() => {
    const fetchAccountData = async () => {
      const token = localStorage.getItem("user_token");
      const displayName = localStorage.getItem("user_display_name");
      
      if (!token) {
        router.push("/giris");
        return;
      }
      if (displayName) setUserName(displayName);

      try {
        const res = await fetch("/api/account", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const data = await res.json();

        if (res.ok) {
          setOrders(data.orders || []);
          setCustomerData(data.customer || null);
        }
      } catch (err) {
        console.error("Veri çekme hatası");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccountData();
  }, [router]);

  // Formu eski verilerle doldurma radarı
  useEffect(() => {
    if (editMode) {
      const addr = editMode === "billing" ? customerData?.billing : customerData?.shipping;
      setAddressForm({
        firstName: addr?.first_name || "",
        lastName: addr?.last_name || "",
        phone: addr?.phone || "",
        city: addr?.city || "",
        district: addr?.state || "",
        fullAddress: addr?.address_1 || ""
      });
    }
  }, [editMode, customerData]);

  const handleLogOut = () => {
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_display_name");
    router.push("/giris");
  };

  // GERÇEK ADRES KAYDETME MOTORU
  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const userId = customerData?.id;

    if (!userId) {
      setToastMessage("Hata: Kullanıcı kimliği tam yüklenemedi şefim.");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/account/update-address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          type: editMode,
          address: addressForm
        }),
      });

      const data = await res.json();

      if (res.ok) {
        const currentCustomer = customerData || { billing: {}, shipping: {} };
        const updated = { ...currentCustomer };
        const addrKey = editMode === "billing" ? "billing" : "shipping";
        
        updated[addrKey] = {
          first_name: addressForm.firstName,
          last_name: addressForm.lastName,
          phone: addressForm.phone,
          city: addressForm.city,
          state: addressForm.district,
          address_1: addressForm.fullAddress
        };
        
        setCustomerData(updated);
        setEditMode(null);
        
        setToastMessage("Adresiniz başarıyla veritabanına kaydedildi şefim! ✓");
        setTimeout(() => setToastMessage(""), 4000);

      } else {
        setToastMessage("WordPress Engeli: " + (data.error || "Sunucu güncellemeyi reddetti."));
        setTimeout(() => setToastMessage(""), 4000);
      }
    } catch (err) {
      setToastMessage("Bağlantı Hatası: API hattına ulaşılamadı.");
      setTimeout(() => setToastMessage(""), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusMeta = (status: string) => {
    switch (status) {
      case "on-hold": return { text: "Beklemede", color: "text-blue-400 bg-blue-500/10 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.05)]" };
      case "processing": return { text: "Hazırlanıyor", color: "text-amber-500 bg-amber-500/10 border-amber-500/20" };
      case "completed": return { text: "Tamamlandı", color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" };
      case "pending": return { text: "Ödeme Bekliyor", color: "text-orange-500 bg-orange-500/10 border-orange-500/20" };
      case "cancelled": return { text: "İptal Edildi", color: "text-rose-500 bg-rose-500/10 border-rose-500/20" };
      default: return { text: status.toUpperCase(), color: "text-slate-400 bg-slate-500/10 border-slate-500/20" };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#050810] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Komuta Merkezi Bağlanıyor...</span>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#050810] text-white py-10 px-4 font-sans relative overflow-hidden">
      
      {/* PREMIUM TOAST BİLDİRİM PENCERESİ */}
      {toastMessage && (
        <div className="fixed top-24 right-4 z-[9999] bg-[#0b1120] border border-emerald-500/30 text-emerald-400 font-black uppercase text-[11px] tracking-wider px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>
          {toastMessage}
        </div>
      )}

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
        
        {/* SOL MENU */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-[#0b1120] border border-white/5 p-6 rounded-3xl text-center shadow-xl">
            <div className="w-16 h-16 bg-blue-600/10 border border-blue-500/30 text-blue-500 rounded-full flex items-center justify-center mx-auto text-2xl font-black shadow-[0_0_20px_rgba(37,99,235,0.15)] uppercase">
              {userName.substring(0, 2)}
            </div>
            <h2 className="mt-4 text-white font-black uppercase tracking-wide line-clamp-1">{userName}</h2>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mt-1">Premium Üye</span>
          </div>

          <div className="bg-[#0b1120] border border-white/5 p-3 rounded-3xl space-y-1 shadow-xl">
            <button onClick={() => { setActiveTab("orders"); setEditMode(null); }} className={`w-full text-left px-5 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all ${activeTab === "orders" ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:bg-white/5"}`}>
              Siparişlerim
            </button>
            <button onClick={() => { setActiveTab("addresses"); }} className={`w-full text-left px-5 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all ${activeTab === "addresses" ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:bg-white/5"}`}>
              Adres Bilgilerim
            </button>
            <button onClick={handleLogOut} className="w-full text-left px-5 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider text-amber-500 hover:bg-amber-500/10 transition-all">
              <span>Güvenli Çıkış</span>
            </button>
          </div>
        </div>

        {/* SAĞ PANEL */}
        <div className="lg:col-span-3">
          
          {/* SİPARİŞLERİM */}
          {activeTab === "orders" && (
            <div className="bg-[#0b1120] border border-white/5 p-6 md:p-8 rounded-3xl shadow-xl space-y-6">
              <h1 className="text-xl font-black uppercase italic tracking-wide border-b border-white/5 pb-4">Sipariş Geçmişi</h1>
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="text-center py-10 text-slate-500 text-xs uppercase font-bold tracking-widest italic">Henüz hiç siparişiniz bulunmuyor şefim.</div>
                ) : (
                  orders.map((order) => {
                    const statusMeta = getStatusMeta(order.status);
                    const isExpanded = expandedOrderId === order.id;
                    return (
                      <div key={order.id} className="bg-[#050810] border border-white/5 rounded-2xl overflow-hidden transition-all hover:border-white/10">
                        <div className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                          <div className="flex items-center gap-6">
                            <div className="p-3 bg-white/5 rounded-xl text-white font-black text-xs italic">#{order.id}</div>
                            <div>
                              <div className="text-white text-xs font-black uppercase">{order.total} {order.currency}</div>
                              <div className="text-slate-500 text-[10px] font-medium mt-0.5">{new Date(order.date_created).toLocaleDateString('tr-TR')}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase border ${statusMeta.color}`}>{statusMeta.text}</span>
                            <button onClick={() => setExpandedOrderId(isExpanded ? null : order.id)} className="px-4 py-2 bg-white/5 hover:bg-blue-600 text-slate-300 text-[10px] font-black uppercase rounded-xl transition-all">
                              {isExpanded ? "Kapat" : "Detaylar"}
                            </button>
                          </div>
                        </div>
                        {isExpanded && (
                          <div className="border-t border-white/5 bg-[#080d1a] p-5 space-y-3">
                            <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Satın Alınan Donanımlar</div>
                            {order.line_items?.map((item: any) => (
                              <div key={item.id} className="flex justify-between text-xs">
                                <div className="text-white font-bold uppercase">{item.name} <span className="text-blue-500 font-black">x{item.quantity}</span></div>
                                <div className="text-slate-400 font-black">{item.total} TL</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* ADRESLERİM */}
          {activeTab === "addresses" && (
            <div className="bg-[#0b1120] border border-white/5 p-6 md:p-8 rounded-3xl shadow-xl space-y-6">
              {editMode === null ? (
                <>
                  <h1 className="text-xl font-black uppercase italic tracking-wide border-b border-white/5 pb-4">Adres Kayıtları</h1>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* FATURA */}
                    <div className="p-6 bg-[#050810] border border-white/5 rounded-2xl flex flex-col justify-between min-h-[220px]">
                      <div>
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest block border-b border-white/5 pb-2 mb-3">Fatura Adresi</span>
                        {customerData?.billing?.first_name ? (
                          <>
                            <p className="text-white text-xs font-black uppercase">{customerData.billing.first_name} {customerData.billing.last_name}</p>
                            <p className="text-slate-400 text-xs mt-2 font-medium">{customerData.billing.address_1}</p>
                            <p className="text-slate-500 text-[10px] font-bold mt-1 uppercase">{customerData.billing.state} / {customerData.billing.city}</p>
                          </>
                        ) : (
                          <p className="text-slate-500 text-xs font-bold italic uppercase pt-4">Adres bilgisi girilmemiş.</p>
                        )}
                      </div>
                      <button onClick={() => setEditMode("billing")} className="mt-6 w-full py-2.5 bg-white/5 border border-white/5 text-slate-400 text-[10px] font-black uppercase rounded-xl transition-all">Adresi Düzenle</button>
                    </div>
                    {/* TESLİMAT */}
                    <div className="p-6 bg-[#050810] border border-white/5 rounded-2xl flex flex-col justify-between min-h-[220px]">
                      <div>
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest block border-b border-white/5 pb-2 mb-3">Teslimat Adresi</span>
                        {customerData?.shipping?.first_name ? (
                          <>
                            <p className="text-white text-xs font-black uppercase">{customerData.shipping.first_name} {customerData.shipping.last_name}</p>
                            <p className="text-slate-400 text-xs mt-2 font-medium">{customerData.shipping.address_1}</p>
                            <p className="text-slate-500 text-[10px] font-bold mt-1 uppercase">{customerData.shipping.state} / {customerData.shipping.city}</p>
                          </>
                        ) : (
                          <p className="text-slate-500 text-xs font-bold italic uppercase pt-4">Adres bilgisi girilmemiş.</p>
                        )}
                      </div>
                      <button onClick={() => setEditMode("shipping")} className="mt-6 w-full py-2.5 bg-white/5 border border-white/5 text-slate-400 text-[10px] font-black uppercase rounded-xl transition-all">Adresi Düzenle</button>
                    </div>
                  </div>
                </>
              ) : (
                /* 🚀 DÜZENLEME FORMU - SABİT BAŞLIKLAR (LABELS) EKLENDİ ŞEFİM */
                <div className="animate-in slide-in-from-bottom-4 duration-300">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                    <h1 className="text-xl font-black uppercase italic tracking-wide">{editMode === "billing" ? "Fatura Adresini Güncelle" : "Teslimat Adresini Güncelle"}</h1>
                    <button onClick={() => setEditMode(null)} className="px-3 py-1.5 bg-white/5 text-slate-400 text-[10px] font-black uppercase rounded-lg hover:text-white transition-all">İptal Et</button>
                  </div>
                  
                  <form onSubmit={handleAddressSubmit} className="space-y-5">
                    
                    {/* AD VE SOYAD ALANI */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Adınız</label>
                        <input type="text" value={addressForm.firstName} onChange={(e) => setAddressForm({...addressForm, firstName: e.target.value})} className="w-full bg-[#050810] border border-white/5 rounded-xl px-5 py-4 text-white text-xs focus:outline-none focus:border-blue-500/30 transition-all" placeholder="Örn: Özkan" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Soyadınız</label>
                        <input type="text" value={addressForm.lastName} onChange={(e) => setAddressForm({...addressForm, lastName: e.target.value})} className="w-full bg-[#050810] border border-white/5 rounded-xl px-5 py-4 text-white text-xs focus:outline-none focus:border-blue-500/30 transition-all" placeholder="Örn: Bilgin" required />
                      </div>
                    </div>

                    {/* TELEFON, ŞEHİR VE İLÇE ALANI */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Telefon Numarası</label>
                        <input type="text" value={addressForm.phone} onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})} className="w-full bg-[#050810] border border-white/5 rounded-xl px-5 py-4 text-white text-xs focus:outline-none focus:border-blue-500/30 transition-all" placeholder="+90532..." />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Şehir</label>
                        <input type="text" value={addressForm.city} onChange={(e) => setAddressForm({...addressForm, city: e.target.value})} className="w-full bg-[#050810] border border-white/5 rounded-xl px-5 py-4 text-white text-xs focus:outline-none focus:border-blue-500/30 transition-all" placeholder="Örn: İstanbul" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">İlçe</label>
                        <input type="text" value={addressForm.district} onChange={(e) => setAddressForm({...addressForm, district: e.target.value})} className="w-full bg-[#050810] border border-white/5 rounded-xl px-5 py-4 text-white text-xs focus:outline-none focus:border-blue-500/30 transition-all" placeholder="Örn: Kadıköy" required />
                      </div>
                    </div>

                    {/* AÇIK ADRES ALANI */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Açık Adres</label>
                      <textarea rows={3} value={addressForm.fullAddress} onChange={(e) => setAddressForm({...addressForm, fullAddress: e.target.value})} className="w-full bg-[#050810] border border-white/5 rounded-xl px-5 py-4 text-white text-xs focus:outline-none focus:border-blue-500/30 transition-all resize-none" placeholder="Mahalle, Cadde, Sokak, Kapı No..." required />
                    </div>

                    <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase text-xs py-4 rounded-xl transition-all shadow-lg shadow-blue-500/10">
                      {isSubmitting ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
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