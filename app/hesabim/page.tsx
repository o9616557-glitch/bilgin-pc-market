"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MyAccountPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"orders" | "addresses">("orders");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userName, setUserName] = useState("Değerli Şefimiz");
  
  // Canlı Veritabanından Gelecek Durumlar
  const [orders, setOrders] = useState<any[]>([]);
  const [customerData, setCustomerData] = useState<any>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  const [editMode, setEditMode] = useState<null | "billing" | "shipping">(null);
  const [addressForm, setAddressForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    city: "",
    district: "",
    fullAddress: ""
  });

  // CANLI VERİLERİ WOOCOMMERCE'DEN ÇEKEN MOTOR
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
        console.error("Veri bağlantı hatası şefim");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccountData();
  }, [router]);

  // Düzenleme modu açıldığında form alanlarını doldurur (Güvenli hale getirildi)
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

  // GERÇEK ADRES KAYDETME FONKSİYONU
  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem("user_token");

    try {
      const res = await fetch("/api/account/update-address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          type: editMode,
          address: addressForm
        }),
      });

      if (res.ok) {
        // Yerel durumu güncelle
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
      }
    } catch (err) {
      alert("Adres kaydedilirken bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusMeta = (status: string) => {
    switch (status) {
      case "processing": return { text: "Hazırlanıyor", color: "text-amber-500 bg-amber-500/10 border-amber-500/20" };
      case "completed": return { text: "Tamamlandı", color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" };
      case "on-hold": return { text: "Beklemede", color: "text-blue-500 bg-blue-500/10 border-blue-500/20" };
      default: return { text: status, color: "text-slate-400 bg-slate-500/10 border-slate-500/20" };
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
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
        
        {/* SOL MENU KARTI */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-[#0b1120] border border-white/5 p-6 rounded-3xl text-center shadow-xl">
            <div className="w-16 h-16 bg-blue-600/10 border border-blue-500/30 text-blue-500 rounded-full flex items-center justify-center mx-auto text-2xl font-black shadow-[0_0_20px_rgba(37,99,235,0.15)] uppercase">
              {userName.substring(0, 2)}
            </div>
            <h2 className="mt-4 text-white font-black uppercase tracking-wide line-clamp-1">{userName}</h2>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mt-1">Premium Üye</span>
          </div>

          <div className="bg-[#0b1120] border border-white/5 p-3 rounded-3xl space-y-1 shadow-xl">
            <button
              onClick={() => { setActiveTab("orders"); setEditMode(null); }}
              className={`w-full text-left px-5 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-between ${activeTab === "orders" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}
            >
              <span>Siparişlerim</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            </button>

            <button
              onClick={() => { setActiveTab("addresses"); }}
              className={`w-full text-left px-5 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-between ${activeTab === "addresses" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}
            >
              <span>Adres Bilgilerim</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0" /></svg>
            </button>

            <button onClick={handleLogOut} className="w-full text-left px-5 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider text-amber-500 hover:bg-amber-500/10 border border-transparent hover:border-amber-500/10 transition-all flex items-center justify-between">
              <span>Güvenli Çıkış</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </button>
          </div>
        </div>

        {/* SAĞ PANEL İÇERİK ALANI */}
        <div className="lg:col-span-3">
          
          {/* SİPARİŞ LİSTESİ */}
          {activeTab === "orders" && (
            <div className="bg-[#0b1120] border border-white/5 p-6 md:p-8 rounded-3xl shadow-xl space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-white/5 pb-4">
                <h1 className="text-xl font-black uppercase italic tracking-wide">Sipariş Geçmişi</h1>
                <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mt-1">Sistemdeki tüm gerçek donanım siparişleriniz listelenmiştir şefim.</p>
              </div>

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
                            <div className="p-3 bg-white/5 rounded-xl text-white font-black text-xs italic tracking-wider">
                              #{order.id}
                            </div>
                            <div>
                              <div className="text-white text-xs font-black uppercase tracking-wider">{order.total} {order.currency}</div>
                              <div className="text-slate-500 text-[10px] font-medium mt-0.5">{new Date(order.date_created).toLocaleDateString('tr-TR')}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4">
                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${statusMeta.color}`}>
                              {statusMeta.text}
                            </span>
                            <button 
                              onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                              className="px-4 py-2 bg-white/5 hover:bg-blue-600 text-slate-300 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                            >
                              {isExpanded ? "Kapat" : "Detaylar"}
                            </button>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="border-t border-white/5 bg-[#080d1a] p-5 space-y-3 animate-in fade-in duration-200">
                            <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">Satın Alınan Donanımlar</div>
                            {order.line_items?.map((item: any) => (
                              <div key={item.id} className="flex justify-between items-center text-xs py-1">
                                <div className="text-white font-bold uppercase">{item.name} <span className="text-blue-500 font-black ml-1">x{item.quantity}</span></div>
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

          {/* 🚀 GÜVENLİ VE ASLA BOŞ KALMAYAN ADRES BÖLÜMÜ */}
          {activeTab === "addresses" && (
            <div className="bg-[#0b1120] border border-white/5 p-6 md:p-8 rounded-3xl shadow-xl space-y-6 animate-in fade-in duration-300">
              
              {editMode === null ? (
                <>
                  <div className="border-b border-white/5 pb-4">
                    <h1 className="text-xl font-black uppercase italic tracking-wide">Adres Kayıtları</h1>
                    <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mt-1">Gerçek kargo ve fatura adresleriniz veritabanından çekilmiştir şefim.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* FATURA ADRESİ */}
                    <div className="p-6 bg-[#050810] border border-white/5 rounded-2xl relative group flex flex-col justify-between min-h-[220px]">
                      <div>
                        <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                          <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Fatura Adresi</span>
                        </div>
                        {customerData?.billing?.first_name || customerData?.billing?.last_name ? (
                          <>
                            <p className="text-white text-xs font-black uppercase">{customerData.billing.first_name} {customerData.billing.last_name}</p>
                            <p className="text-slate-400 text-xs mt-2 font-medium leading-relaxed">{customerData.billing.address_1}</p>
                            <p className="text-slate-500 text-[10px] font-bold mt-1 uppercase tracking-wide">{customerData.billing.state} {customerData.billing.city}</p>
                            <p className="text-slate-600 text-[10px] font-medium mt-1">{customerData.billing.phone}</p>
                          </>
                        ) : (
                          <p className="text-slate-500 text-xs font-bold italic uppercase tracking-wider pt-4">Adres bilgisi girilmemiş.</p>
                        )}
                      </div>
                      <button onClick={() => setEditMode("billing")} className="mt-6 w-full py-2.5 bg-white/5 border border-white/5 group-hover:border-blue-500/30 text-slate-400 group-hover:text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">
                        Adresi Düzenle
                      </button>
                    </div>

                    {/* TESLİMAT ADRESİ */}
                    <div className="p-6 bg-[#050810] border border-white/5 rounded-2xl relative group flex flex-col justify-between min-h-[220px]">
                      <div>
                        <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Teslimat Adresi</span>
                        </div>
                        {customerData?.shipping?.first_name || customerData?.shipping?.last_name ? (
                          <>
                            <p className="text-white text-xs font-black uppercase">{customerData.shipping.first_name} {customerData.shipping.last_name}</p>
                            <p className="text-slate-400 text-xs mt-2 font-medium leading-relaxed">{customerData.shipping.address_1}</p>
                            <p className="text-slate-500 text-[10px] font-bold mt-1 uppercase tracking-wide">{customerData.shipping.state} {customerData.shipping.city}</p>
                          </>
                        ) : (
                          <p className="text-slate-500 text-xs font-bold italic uppercase tracking-wider pt-4">Adres bilgisi girilmemiş.</p>
                        )}
                      </div>
                      <button onClick={() => setEditMode("shipping")} className="mt-6 w-full py-2.5 bg-white/5 border border-white/5 group-hover:border-emerald-500/30 text-slate-400 group-hover:text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">
                        Adresi Düzenle
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* ADRES DÜZENLEME FORMU */
                <div className="animate-in slide-in-from-bottom-4 duration-300">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                    <div>
                      <h1 className="text-xl font-black uppercase italic tracking-wide">
                        {editMode === "billing" ? "Fatura Adresini Güncelle" : "Teslimat Adresini Güncelle"}
                      </h1>
                    </div>
                    <button onClick={() => setEditMode(null)} className="px-3 py-1.5 bg-white/5 text-slate-400 hover:text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">İptal Et</button>
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
                        <input type="text" value={addressForm.phone} onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})} className="w-full bg-[#050810] border border-white/5 rounded-xl px-5 py-4 text-white font-medium focus:outline-none focus:border-blue-500/50 transition-all text-xs" />
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

                    <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-xs py-4 rounded-xl transition-all shadow-lg shadow-blue-500/10">
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