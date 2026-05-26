"use client";
import { useCart } from "../CartContext";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function OdemeSayfasi() {
  const { data: session } = useSession(); // 🚀 ŞEFİN KİMLİĞİ
  const { sepet } = useCart();
  const [odemeYontemi, setOdemeYontemi] = useState("kart");
  const [yukleniyor, setYukleniyor] = useState(false);
  const [iyzicoFormHtml, setIyzicoFormHtml] = useState<string>("");

  const [faturaAyni, setFaturaAyni] = useState(true);
  const [sozlesmeKabul, setSozlesmeKabul] = useState(false);

  const [form, setForm] = useState({
    ad: "", soyad: "", telefon: "", eposta: "", adres: "", sehir: "", ilce: ""
  });

  const [faturaForm, setFaturaForm] = useState({
    ad: "", soyad: "", telefon: "", adres: "", sehir: "", ilce: ""
  });
// 🚀 ŞEFİM: KASADA OTOMATİK ADRES DOLDURMA (JET MOTORU)
  useEffect(() => {
    const fetchKayitliAdresler = async () => {
      try {
        const res = await fetch("/api/addresses");
        if (res.ok) {
          const data = await res.json();
          const adresler = data.addresses || [];

          // 1. Varsa "Varsayılan Teslimat" adresini bul ve kutuları doldur!
          const varsayilanTeslimat = adresler.find((a: any) => a.isDefaultDelivery);
          if (varsayilanTeslimat) {
            // İsim ve Soyismi ayırıyoruz (Örn: "Özkan Bilgin" -> ad: "Özkan", soyad: "Bilgin")
            const nameParts = varsayilanTeslimat.fullName.trim().split(" ");
            const soyad = nameParts.length > 1 ? nameParts.pop() : "";
            const ad = nameParts.join(" ");

            setForm((prev: any) => ({
              ...prev,
              ad: ad,
              soyad: soyad,
              telefon: varsayilanTeslimat.phone,
              sehir: varsayilanTeslimat.city,
              ilce: varsayilanTeslimat.district,
              adres: varsayilanTeslimat.fullAddress,
            }));
          }

          // 2. Varsa "Varsayılan Fatura" adresini bul ve fatura kutularını doldur!
          const varsayilanFatura = adresler.find((a: any) => a.isDefaultBilling);
          if (varsayilanFatura) {
            const nameParts = varsayilanFatura.fullName.trim().split(" ");
            const soyad = nameParts.length > 1 ? nameParts.pop() : "";
            const ad = nameParts.join(" ");

            setFaturaForm({
              ad: ad,
              soyad: soyad,
              telefon: varsayilanFatura.phone,
              sehir: varsayilanFatura.city,
              ilce: varsayilanFatura.district,
              adres: varsayilanFatura.fullAddress,
            });
            
            // Fatura adresi farklıysa "Fatura Aynı" tikini otomatik kaldır ki müşteri görsün
            setFaturaAyni(false); 
          }
        }
      } catch (error) {
        console.error("Adresleri çekerken hata oluştu:", error);
      }
    };

    fetchKayitliAdresler();
  }, []);
  const araToplam = sepet.reduce((toplam: number, urun: any) => toplam + (urun.fiyat * urun.adet), 0);
  const kargo = araToplam > 5000 ? 0 : 150;
  const havaleIndirimi = araToplam * 0.05;
  const genelToplam = odemeYontemi === "havale" ? (araToplam - havaleIndirimi + kargo) : (araToplam + kargo);

  const inputDegis = (e: any) => { setForm({ ...form, [e.target.name]: e.target.value }); };
  const faturaInputDegis = (e: any) => { setFaturaForm({ ...faturaForm, [e.target.name]: e.target.value }); };

  useEffect(() => {
    if (iyzicoFormHtml) {
      const gonderilenScript = document.getElementById("iyzico-script");
      if (gonderilenScript) gonderilenScript.remove();
      
      const icerik = document.createRange().createContextualFragment(iyzicoFormHtml);
      document.getElementById("iyzipay-checkout-form")?.appendChild(icerik);
    }
  }, [iyzicoFormHtml]);

  const siparisTamamla = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sozlesmeKabul) {
      alert("Lütfen Mesafeli Satış Sözleşmesi ve KVKK metnini onaylayın.");
      return;
    }
    
    setYukleniyor(true);
    setIyzicoFormHtml("");

   // 🚀 ŞEFİM: APİ REDDETMESİN DİYE HEM ESKİ HEM YENİ TÜM KELİMELERİ BURAYA GÖMÜYORUZ!
    const siparisVerisi = {
      musteri: {
        ...form,
        eposta: session?.user?.email || form.eposta, // Şefin e-posta mührü
        faturaBilgileri: faturaAyni ? form : faturaForm
      },
      // Sepet kelimeleri (Hangisini isterse dükkan onun olsun)
      sepet: sepet.map((item: any) => ({ id: item.id, isim: item.isim, miktar: item.adet, adet: item.adet, fiyat: item.fiyat, varyasyon: item.varyasyon })),
      cartItems: sepet.map((item: any) => ({ id: item.id, isim: item.isim, miktar: item.adet, adet: item.adet, fiyat: item.fiyat, varyasyon: item.varyasyon })),
      items: sepet.map((item: any) => ({ id: item.id, isim: item.isim, miktar: item.adet, adet: item.adet, fiyat: item.fiyat, varyasyon: item.varyasyon })),
      
      odemeYontemi,
      
      // Tutar kelimeleri (API ne ararsa burada bulacak)
      toplamTutar: genelToplam,
      totalPrice: genelToplam,
      genelToplam: genelToplam
    };

    try {
      const response = await fetch("/api/siparis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(siparisVerisi)
      });

      const data = await response.json();

      if (data.success) {
        localStorage.removeItem("bilgin-sepet");
  if (data.odemeYontemi === "havale") {
    window.location.href = "/siparis-basarili?kodu=" + data.siparisKodu;
  } else {
    setIyzicoFormHtml(data.checkoutFormContent);
  }
} else {
        alert("Hata oluştu: " + data.error);
      }
    } catch (hata) {
      console.error(hata);
      alert("Sistemsel bir hata meydana geldi.");
    } finally {
      setYukleniyor(false);
    }
  };

  // ==========================================
  // 🛒 1. BÖLÜM: EĞER SEPET BOŞ İSE
  // ==========================================
  if (sepet.length === 0) {
    return (
      <div className="min-h-[80vh] bg-[#03050a] text-white flex flex-col items-center justify-center relative overflow-hidden px-4">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#00e5ff] blur-[160px] opacity-20 pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#00e5ff] blur-[150px] opacity-10 pointer-events-none"></div>
        
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 md:p-16 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col items-center relative z-10 max-w-lg w-full text-center">
          <h2 className="text-2xl md:text-3xl font-black mb-4 uppercase tracking-wider text-white">
            Ödeme İçin Sepetinizde <span className="text-[#00e5ff]">Ürün Olmalı</span>
          </h2>
          <Link href="/" className="bg-[#00e5ff] text-black font-black py-4 px-10 rounded-xl hover:bg-[#00c4db] transition-all duration-300 shadow-[0_0_20px_rgba(0,229,255,0.2)]">
            Alışverişe Başla
          </Link>
        </div>
      </div>
    );
  }

  // ==========================================
  // 💳 2. BÖLÜM: ÖDEME FORMU VE SİPARİŞ ÖZETİ (ŞEFFAF CAM TASARIMI)
  // ==========================================
  return (
    <div className="min-h-screen bg-[#03050a] text-white relative overflow-hidden pb-12 pt-8 md:pt-12">
      
      {/* 🔮 ARKADAKİ NEON MAVİ PARLAMA EFEKTLERİ */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#00e5ff] blur-[160px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#00e5ff] blur-[150px] opacity-10 pointer-events-none"></div>

      <div className="ana-konteynir relative z-10" style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
        
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-white drop-shadow-md mb-8 border-l-4 border-[#00e5ff] pl-4">
          KASA / <span className="text-[#00e5ff]">ÖDEME</span>
        </h1>

        <div className="odeme-konteynir" style={{ display: "flex", gap: "30px" }}>
          
          {/* ========================================= */}
          {/* ⬅️ SOL TARAF: FORM KUTUSU (CAM EFEKTİ) */}
          {/* ========================================= */}
          <div style={{ flex: "2", display: "flex", flexDirection: "column", gap: "20px" }}>
            
            <form onSubmit={siparisTamamla} className="form-kutu bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
              
              <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
                <span className="text-[#00e5ff]">📍</span> Teslimat Bilgileri
              </h3>

              <div className="form-grid-2" style={{ display: "grid", gap: "15px", marginBottom: "15px" }}>
                <div>
                  <label className="text-slate-400 text-sm block mb-1.5">Adınız *</label>
                  <input type="text" name="ad" value={form.ad} onChange={inputDegis} required className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-white outline-none focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff] transition-all" />
                </div>
                <div>
                  <label className="text-slate-400 text-sm block mb-1.5">Soyadınız *</label>
                  <input type="text" name="soyad" value={form.soyad} onChange={inputDegis} required className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-white outline-none focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff] transition-all" />
                </div>
              </div>

              <div className="form-grid-2" style={{ display: "grid", gap: "15px", marginBottom: "15px" }}>
                <div>
                  <label className="text-slate-400 text-sm block mb-1.5">Telefon Numarası *</label>
                  <input type="tel" name="telefon" placeholder="05xx xxx xx xx" value={form.telefon} onChange={inputDegis} required className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-white outline-none focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff] transition-all" />
                </div>
                <div>
                  <label className="text-slate-400 text-sm block mb-1.5">E-Posta Adresi *</label>
                  <input type="email" name="eposta" value={form.eposta} onChange={inputDegis} required className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-white outline-none focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff] transition-all" />
                </div>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label className="text-slate-400 text-sm block mb-1.5">Açık Adres *</label>
                <textarea rows={3} name="adres" value={form.adres} onChange={inputDegis} required placeholder="Mahalle, sokak, kapı numarası..." className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-white outline-none focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff] transition-all"></textarea>
              </div>

              <div className="form-grid-2" style={{ display: "grid", gap: "15px", marginBottom: "25px" }}>
                <div>
                  <label className="text-slate-400 text-sm block mb-1.5">Şehir *</label>
                  <input type="text" name="sehir" value={form.sehir} onChange={inputDegis} required className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-white outline-none focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff] transition-all" />
                </div>
                <div>
                  <label className="text-slate-400 text-sm block mb-1.5">İlçe *</label>
                  <input type="text" name="ilce" value={form.ilce} onChange={inputDegis} required className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-white outline-none focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff] transition-all" />
                </div>
              </div>

              <hr className="border-white/10 mb-5" />

              {/* FATURA ADRESİ AYNI MI CHECKBOX */}
              <div className="flex items-center gap-2 mb-5">
                <input type="checkbox" id="faturaAyni" checked={faturaAyni} onChange={(e) => setFaturaAyni(e.target.checked)} className="w-5 h-5 cursor-pointer accent-[#00e5ff]" />
                <label htmlFor="faturaAyni" className="text-slate-300 text-sm cursor-pointer">Fatura/Teslimat adresim yukarıdaki ile aynıdır.</label>
              </div>

              {/* FARKLI FATURA ADRESİ BÖLÜMÜ */}
              {!faturaAyni && (
                <div className="bg-black/20 border border-white/5 rounded-2xl p-5 mb-6">
                  <h4 className="text-[#00e5ff] font-bold mb-4">Farklı Adres Bilgileri</h4>
                  
                  <div className="form-grid-2" style={{ display: "grid", gap: "15px", marginBottom: "15px" }}>
                    <div>
                      <label className="text-slate-400 text-sm block mb-1.5">Adınız *</label>
                      <input type="text" name="ad" value={faturaForm.ad} onChange={faturaInputDegis} required={!faturaAyni} className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-white outline-none focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff] transition-all" />
                    </div>
                    <div>
                      <label className="text-slate-400 text-sm block mb-1.5">Soyadınız *</label>
                      <input type="text" name="soyad" value={faturaForm.soyad} onChange={faturaInputDegis} required={!faturaAyni} className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-white outline-none focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff] transition-all" />
                    </div>
                  </div>

                  <div style={{ marginBottom: "15px" }}>
                    <label className="text-slate-400 text-sm block mb-1.5">Telefon Numarası *</label>
                    <input type="tel" name="telefon" value={faturaForm.telefon} onChange={faturaInputDegis} required={!faturaAyni} className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-white outline-none focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff] transition-all" />
                  </div>

                  <div style={{ marginBottom: "15px" }}>
                    <label className="text-slate-400 text-sm block mb-1.5">Açık Adres *</label>
                    <textarea rows={2} name="adres" value={faturaForm.adres} onChange={faturaInputDegis} required={!faturaAyni} className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-white outline-none focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff] transition-all"></textarea>
                  </div>

                  <div className="form-grid-2" style={{ display: "grid", gap: "15px" }}>
                    <div>
                      <label className="text-slate-400 text-sm block mb-1.5">Şehir *</label>
                      <input type="text" name="sehir" value={faturaForm.sehir} onChange={faturaInputDegis} required={!faturaAyni} className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-white outline-none focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff] transition-all" />
                    </div>
                    <div>
                      <label className="text-slate-400 text-sm block mb-1.5">İlçe *</label>
                      <input type="text" name="ilce" value={faturaForm.ilce} onChange={faturaInputDegis} required={!faturaAyni} className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-white outline-none focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff] transition-all" />
                    </div>
                  </div>
                </div>
              )}

              <hr className="border-white/10 mb-6" />

              {/* ÖDEME YÖNTEMİ SEÇİMİ */}
              <h3 className="text-lg font-black text-white mb-4">Ödeme Yöntemi</h3>
              <div className="flex gap-4 mb-6">
                <button 
                  type="button" 
                  onClick={() => { setIyzicoFormHtml(""); setOdemeYontemi("kart"); }} 
                  className={`flex-1 py-3.5 rounded-xl font-bold transition-all border ${odemeYontemi === "kart" ? "bg-[#00e5ff] text-black border-[#00e5ff] shadow-[0_0_15px_rgba(0,229,255,0.4)]" : "bg-black/40 text-slate-300 border-white/10 hover:border-white/30"}`}
                >
                  Kredi / Banka Kartı
                </button>
                <button 
                  type="button" 
                  onClick={() => { setIyzicoFormHtml(""); setOdemeYontemi("havale"); }} 
                  className={`flex-1 py-3.5 rounded-xl font-bold transition-all border ${odemeYontemi === "havale" ? "bg-[#00e5ff] text-black border-[#00e5ff] shadow-[0_0_15px_rgba(0,229,255,0.4)]" : "bg-black/40 text-slate-300 border-white/10 hover:border-white/30"}`}
                >
                  Havale / EFT
                </button>
              </div>

              {/* HAVALE TALİMATLARI BİLGİ KUTUSU */}
              {odemeYontemi === "havale" && (
                <div className="bg-black/40 border border-white/10 rounded-2xl p-5 text-slate-300 text-sm mb-6 leading-relaxed">
                  <p className="text-[#10b981] font-bold mb-3">💡 Havale Ödeme Talimatı:</p>
                  Açıklama kısmına <span className="text-[#00e5ff]">adınızı</span> yazarak IBAN hesabımıza gönderim yapabilirsiniz:
                  <div className="mt-3 border-t border-white/10 pt-3 font-mono">
                    <strong>Banka:</strong> Bilgin PC Akıllı Banka<br />
                    <strong>Alıcı:</strong> BİLGİN PC MARKET LTD. ŞTİ.<br />
                    <strong className="text-white">IBAN:</strong> TR99 0001 0002 0003 0004 0005 06
                  </div>
                </div>
              )}

              {/* SÖZLEŞME KABUL */}
              <div className="flex items-start gap-3 bg-white/5 border border-white/10 p-4 rounded-xl mb-6">
                <input type="checkbox" id="sozlesmeKabul" checked={sozlesmeKabul} onChange={(e) => setSozlesmeKabul(e.target.checked)} className="w-5 h-5 mt-0.5 cursor-pointer accent-[#00e5ff]" />
                <label htmlFor="sozlesmeKabul" className="text-slate-300 text-sm cursor-pointer leading-snug">
                  Ön Bilgilendirme Formu'nu, <span className="text-[#00e5ff] underline">Mesafeli Satış Sözleşmesi</span>'ni ve <span className="text-[#00e5ff] underline">KVKK Aydınlatma Metni</span>'ni okudum, onaylıyorum.
                </label>
              </div>

              {/* ANA SUBMİT BUTONU */}
              {!iyzicoFormHtml && (
                <button 
                  type="submit" 
                  disabled={yukleniyor || !sozlesmeKabul} 
                  style={{
                    background: odemeYontemi === "havale" ? "linear-gradient(45deg, #10b981, #059669)" : "linear-gradient(45deg, #00e5ff, #007acc)",
                    opacity: (yukleniyor || !sozlesmeKabul) ? 0.5 : 1
                  }}
                  className="w-full text-black font-black uppercase tracking-wider py-4 rounded-xl text-lg transition-all shadow-[0_0_20px_rgba(0,229,255,0.2)]"
                >
                  {yukleniyor ? "Lütfen Bekleyin..." : (!sozlesmeKabul ? "Sözleşmeyi Onaylayın" : (odemeYontemi === "havale" ? "Siparişi Onayla" : "Kart Ödemesine İlerle"))}
                </button>
              )}
            </form>

            {/* IYZICO MODAL (MOTORA DOKUNULMADI, SADECE TASARIM KAPORTASI AYNI BIRAKILDI) */}
            <div style={{
              display: (odemeYontemi === "kart" && iyzicoFormHtml) ? "flex" : "none",
              position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "#ffffff", zIndex: 999999,
              flexDirection: "column", alignItems: "center", justifyContent: "flex-start", overflowY: "auto"
            }}>
              <button type="button" onClick={() => {
                setIyzicoFormHtml("");
                const kutu = document.getElementById("iyzipay-checkout-form");
                if (kutu) kutu.innerHTML = "";
                if (typeof window !== "undefined") { (window as any).iyziInit = undefined; }
              }} style={{
                position: "fixed", top: "10px", right: "10px", background: "#f4f4f5", color: "#000", border: "2px solid #e4e4e7", borderRadius: "50%", width: "40px", height: "40px", fontSize: "1.2rem", cursor: "pointer", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 15px rgba(0,0,0,0.3)", zIndex: 2147483647
              }}>X</button>
              
              {/* IYZICO'NUN KENDİ İÇİNE YAZDIĞI DİV BURADA OLMALI (Resimde kesilmiş, sende varsa silme) */}
              <div id="iyzipay-checkout-form" className="w-full max-w-2xl mt-16 p-4"></div>
            </div>

          </div>

          {/* ========================================= */}
          {/* ➡️ SAĞ TARAF: SİPARİŞ ÖZETİ (CAM EFEKTİ) */}
          {/* ========================================= */}
          <div style={{ flex: "1" }} className="w-full lg:w-[380px] shrink-0">
            
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 lg:p-8 sticky top-24 shadow-2xl">
              <h2 className="font-black text-xl mb-6 pb-4 border-b border-white/10 text-white uppercase tracking-wide">
                Sipariş <span className="text-[#00e5ff]">Özetiniz</span>
              </h2>

              <div style={{ maxHeight: "280px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
                {sepet.map((urun: any, index: number) => (
                  <div key={index} style={{ display: "flex", gap: "10px", alignItems: "center", background: "rgba(0,0,0,0.2)", padding: "8px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <img src={urun.resim} alt={urun.isim} style={{ width: "45px", height: "45px", objectFit: "cover", borderRadius: "6px" }} />
                    <div style={{ flex: "1", minWidth: 0 }}>
                      <h4 style={{ color: "#fff", fontSize: "0.85rem", fontWeight: "700", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{urun.isim}</h4>
                      <p style={{ color: "#a1a1aa", fontSize: "0.75rem" }}>{urun.adet} Adet x {urun.varyasyon || "Standart"}</p>
                    </div>
                    <span style={{ color: "#fff", fontSize: "0.85rem", fontWeight: "700" }}>{(urun.fiyat * urun.adet).toLocaleString()} TL</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between text-slate-300 mb-3 text-sm border-t border-white/10 pt-4">
                <span>Ara Toplam</span>
                <span className="text-white font-bold">{araToplam.toLocaleString("tr-TR")} TL</span>
              </div>

              <div className="flex justify-between text-slate-300 mb-3 text-sm">
                <span>Kargo</span>
                <span>{kargo === 0 ? <span className="text-[#00e5ff] font-bold drop-shadow-[0_0_5px_rgba(0,229,255,0.4)]">BEDAVA</span> : <span className="text-white font-bold">{kargo} TL</span>}</span>
              </div>

              {odemeYontemi === "havale" && (
                <div className="flex justify-between text-[#10b981] mb-3 text-sm font-bold">
                  <span>%5 Havale İndirimi</span>
                  <span>-{havaleIndirimi.toLocaleString("tr-TR")} TL</span>
                </div>
              )}

              <div className="flex justify-between items-center text-white font-black border-t border-white/10 pt-5 mt-2">
                <span className="text-lg">ÖDENECEK TUTAR</span>
                <span className="text-2xl text-[#00e5ff] drop-shadow-[0_0_15px_rgba(0,229,255,0.3)]">
                  {genelToplam.toLocaleString("tr-TR")} <span className="text-sm text-slate-400 font-bold">TL</span>
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ŞEFİM: MOBİLDE BOŞLUKLARI SİLEN SİHİRLİ KODLAR BURADA KORUNDU! */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 992px) { .odeme-konteynir { flex-direction: column !important; } }
        @media (max-width: 550px) {
          .form-grid-2 { grid-template-columns: 1fr !important; }
          .ana-konteynir { padding: 10px !important; }
          .form-kutu { padding: 15px !important; }
        }
      `}} />
    </div>
  );
}