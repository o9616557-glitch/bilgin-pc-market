"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminPaneli() {
  // 👑 1. GÜVENLİK DUVARI: GOOGLE VIP KONTROLÜ
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // 🚨 BURAYA KENDİ GOOGLE E-POSTA ADRESİNİ YAZMAYI UNUTMA!
  const ADMIN_EMAIL = "o9616557@gmail.com"; 

  useEffect(() => {
    if (status !== "loading") {
      if (!session || session?.user?.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        router.push("/"); 
      }
    }
  }, [session, status, router]);

  const [sifre, setSifre] = useState("");
  const [girisYapildi, setGirisYapildi] = useState(false);
  const [aktifSekme, setAktifSekme] = useState<"siparisler" | "urunler">("urunler");
  const [yukleniyor, setYukleniyor] = useState(true);

  const [bildirim, setBildirim] = useState<{tip: "basari" | "hata", mesaj: string} | null>(null);

  const [siparisler, setSiparisler] = useState<any[]>([]);
  const [silinecekSiparisID, setSilinecekSiparisID] = useState<string | null>(null);

  const [urunler, setUrunler] = useState<any[]>([]);
  const [duzenlenenUrun, setDuzenlenenUrun] = useState<any | null>(null);
  const [yeniUrunModu, setYeniUrunModu] = useState(false);

  const [formIsim, setFormIsim] = useState("");
  const [formFiyat, setFormFiyat] = useState("");
  const [formIndirimliFiyat, setFormIndirimliFiyat] = useState(""); 
  const [formHavaleIndirimi, setFormHavaleIndirimi] = useState("5"); 
  const [formStok, setFormStok] = useState("Stokta Var");
  const [formStokAdedi, setFormStokAdedi] = useState(""); 
  const [formResim, setFormResim] = useState("");
  const [formKategori, setFormKategori] = useState("Bilgisayar");

  const PATRON_SIFRESI = "Bilgin123";

  useEffect(() => {
    const patronGirdiMi = sessionStorage.getItem("patronGiris");
    if (patronGirdiMi === "basarili") {
      setGirisYapildi(true);
      verileriYukle();
    } else {
      setYukleniyor(false);
    }
  }, []);

  const verileriYukle = async () => {
    setYukleniyor(true);
    await siparisleriGetir();
    await urunleriGetir();
    setYukleniyor(false);
  };

  const girisYap = (e: React.FormEvent) => {
    e.preventDefault();
    if (sifre === PATRON_SIFRESI) {
      sessionStorage.setItem("patronGiris", "basarili"); 
      setGirisYapildi(true);
      verileriYukle();
    } else {
      setBildirim({tip: "hata", mesaj: "Hatalı Şifre!"});
    }
  };

  const cikisYap = () => { sessionStorage.removeItem("patronGiris"); setGirisYapildi(false); };

  const siparisleriGetir = async () => {
    try {
      const res = await fetch(`/api/admin/siparisler?v=${Date.now()}`, { headers: { "x-patron-anahtar": PATRON_SIFRESI }});
      const data = await res.json();
      if (data.success) setSiparisler(data.siparisler);
    } catch (e) {}
  };

  const durumGuncelle = async (id: string, yeniDurum: string) => {
    try {
      const res = await fetch("/api/admin/siparisler", { method: "PUT", headers: { "Content-Type": "application/json", "x-patron-anahtar": PATRON_SIFRESI }, body: JSON.stringify({ id, yeniDurum }) });
      if ((await res.json()).success) {
        setSiparisler(siparisler.map(s => s._id === id ? { ...s, durum: yeniDurum } : s));
        setBildirim({tip: "basari", mesaj: "Durum Güncellendi!"});
      }
    } catch (e) {}
  };

  const mesajGuncelle = async (id: string, musteriMesaji: string) => {
    try {
      const res = await fetch("/api/admin/siparisler", { method: "PUT", headers: { "Content-Type": "application/json", "x-patron-anahtar": PATRON_SIFRESI }, body: JSON.stringify({ id, musteriMesaji }) });
      if ((await res.json()).success) setBildirim({tip: "basari", mesaj: "Mesaj İletildi!"});
    } catch (e) {}
  };

  // 🚀 İŞTE KARGO MOTORU BURADA (SENİN ESKİ SİSTEME HİÇ DOKUNMADIK)
  const kargoGuncelle = async (id: string, kargoFirmasi: string, takipNo: string) => {
    try {
      const res = await fetch("/api/admin/siparisler", { 
        method: "PUT", 
        headers: { "Content-Type": "application/json", "x-patron-anahtar": PATRON_SIFRESI }, 
        body: JSON.stringify({ id, kargoFirmasi, takipNo }) 
      });
      if ((await res.json()).success) {
        setSiparisler(siparisler.map(s => s._id === id ? { ...s, kargoFirmasi, takipNo } : s));
        setBildirim({tip: "basari", mesaj: "Kargo Bilgileri Başarıyla Kaydedildi!"});
      }
    } catch (e) {
      setBildirim({tip: "hata", mesaj: "Kargo kaydedilemedi."});
    }
  };

  const siparisSilmeIslemi = async () => {
    if (!silinecekSiparisID) return;
    try {
      const res = await fetch(`/api/admin/siparisler?id=${silinecekSiparisID}`, { method: "DELETE", headers: { "x-patron-anahtar": PATRON_SIFRESI }});
      if ((await res.json()).success) {
        setSiparisler(siparisler.filter(s => s._id !== silinecekSiparisID));
        setSilinecekSiparisID(null);
        setBildirim({tip: "basari", mesaj: "Silindi!"});
      }
    } catch (e) {}
  };

  const urunleriGetir = async () => {
    try {
      const res = await fetch(`/api/admin/products?v=${Date.now()}`, { headers: { "x-patron-anahtar": PATRON_SIFRESI }});
      const data = await res.json();
      if (data.success) setUrunler(data.urunler);
    } catch (e) {}
  };

  const urunKaydet = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const gonderilecekVeri: any = {
        isim: formIsim, fiyat: formFiyat, indirimliFiyat: formIndirimliFiyat, havaleIndirimi: formHavaleIndirimi, stokDurumu: formStok, stokAdedi: formStokAdedi, resim: formResim, kategori: formKategori
      };
      if (duzenlenenUrun) gonderilecekVeri.id = duzenlenenUrun._id;

      const res = await fetch("/api/admin/products", { method: "PUT", headers: { "Content-Type": "application/json", "x-patron-anahtar": PATRON_SIFRESI }, body: JSON.stringify(gonderilecekVeri) });
      if ((await res.json()).success) {
        setBildirim({tip: "basari", mesaj: "Ürün Kaydedildi!"});
        formuKapat();
        urunleriGetir();
      }
    } catch (e) { setBildirim({tip: "hata", mesaj: "Hata oluştu."}); }
  };

  const urunSilmeIslemi = async (id: string) => {
    if (!window.confirm("Bu ürünü silmek istediğine emin misin şefim?")) return;
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE", headers: { "x-patron-anahtar": PATRON_SIFRESI }});
      if ((await res.json()).success) {
        setUrunler(urunler.filter(u => u._id !== id));
        setBildirim({tip: "basari", mesaj: "Silindi!"});
      }
    } catch (e) {}
  };

  const urunDuzenleModunuAc = (urun: any) => {
    setDuzenlenenUrun(urun);
    setFormIsim(urun.isim || urun.name || "");
    
    const orjFiyat = urun.regular_price || urun.fiyat || urun.price || 0;
    setFormFiyat(orjFiyat.toString());
    
    setFormIndirimliFiyat(urun.indirimliFiyat ? urun.indirimliFiyat.toString() : ""); 
    setFormHavaleIndirimi(urun.havaleIndirimi !== undefined ? urun.havaleIndirimi.toString() : "5");
    setFormStok(urun.stokDurumu || "Stokta Var");
    
    const temizAdet = (urun.stokAdedi !== null && urun.stokAdedi !== undefined && urun.stokAdedi !== "" && Number(urun.stokAdedi) !== 10) ? urun.stokAdedi.toString() : "";
    setFormStokAdedi(temizAdet);
    
    setFormResim(urun.resim || "");
    setFormKategori(urun.kategori || "Bilgisayar");
    setYeniUrunModu(true);
  };

  const yeniUrunModunuAc = () => {
    setDuzenlenenUrun(null);
    setFormIsim(""); setFormFiyat(""); setFormIndirimliFiyat(""); setFormHavaleIndirimi("5"); setFormStok("Stokta Var"); setFormStokAdedi(""); setFormResim(""); setFormKategori("Bilgisayar");
    setYeniUrunModu(true);
  };

  const formuKapat = () => {
    setYeniUrunModu(false);
    setDuzenlenenUrun(null);
  };

  const durumRengi = (durum: string) => {
    if (!durum) return "#d97706";
    if (durum === "Ödendi / Hazırlanıyor" || durum.includes("Başarılı")) return "#059669"; 
    if (durum === "Kargoya Verildi") return "#2563eb"; 
    if (durum === "İptal Edildi") return "#dc2626"; 
    return "#d97706"; 
  };

  if (yukleniyor && !girisYapildi) return <div style={{ textAlign: "center", padding: "100px", color: "#64748b", fontFamily: "sans-serif" }}>Sistem Yükleniyor...</div>;

  if (!girisYapildi) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", padding: "20px", fontFamily: "sans-serif", backgroundColor: "#0f172a" }}>
        {bildirim && <div style={{ position: "fixed", top: 20, right: 20, background: "#1e293b", border: `1px solid ${bildirim.tip === "basari" ? "#3b82f6" : "#ef4444"}`, borderRadius: "8px", padding: "15px 20px", color: "#f8fafc", zIndex: 99999, fontSize: "14px" }}>{bildirim.mesaj}</div>}
        <form onSubmit={girisYap} style={{ background: "#1e293b", border: "1px solid #334155", padding: "40px", borderRadius: "12px", textAlign: "center", width: "100%", maxWidth: "360px" }}>
          <h2 style={{ color: "#f8fafc", marginBottom: "25px", fontWeight: "600", fontSize: "20px" }}>Yönetim Girişi</h2>
          <input type="password" value={sifre} onChange={(e) => setSifre(e.target.value)} placeholder="Şifrenizi Girin..." style={{ width: "100%", padding: "12px", background: "#0f172a", border: "1px solid #334155", borderRadius: "6px", color: "#f8fafc", marginBottom: "20px", outline: "none", fontSize: "14px" }} required />
          <button type="submit" style={{ width: "100%", padding: "12px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "500", cursor: "pointer", fontSize: "14px" }}>Giriş Yap</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px", fontFamily: "system-ui, -apple-system, sans-serif", color: "#e2e8f0" }}>
      
      {/* BİLDİRİM POPUP */}
      {bildirim && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(15, 23, 42, 0.7)", zIndex: 99999, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ background: "#1e293b", border: `1px solid ${bildirim.tip === "basari" ? "#3b82f6" : "#ef4444"}`, borderRadius: "8px", padding: "24px", maxWidth: "320px", width: "90%", textAlign: "center", boxShadow: "0 10px 25px rgba(0,0,0,0.5)" }}>
            <h3 style={{ color: "#f8fafc", fontWeight: "600", marginBottom: "10px", fontSize: "16px" }}>{bildirim.tip === "basari" ? "İşlem Başarılı" : "Hata Oluştu"}</h3>
            <p style={{ color: "#cbd5e1", marginBottom: "20px", fontSize: "14px" }}>{bildirim.mesaj}</p>
            <button onClick={() => setBildirim(null)} style={{ width: "100%", background: bildirim.tip === "basari" ? "#3b82f6" : "#ef4444", color: "#fff", border: "none", padding: "10px", borderRadius: "6px", fontWeight: "500", cursor: "pointer", fontSize: "14px" }}>Kapat</button>
          </div>
        </div>
      )}

      {/* SİLME ONAYI */}
      {silinecekSiparisID && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(15, 23, 42, 0.7)", zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", padding: "24px", maxWidth: "320px", textAlign: "center", width: "90%", boxShadow: "0 10px 25px rgba(0,0,0,0.5)" }}>
            <h3 style={{ color: "#f8fafc", fontWeight: "600", marginBottom: "15px", fontSize: "16px" }}>Siparişi Silmek İstediğinize Emin Misiniz?</h3>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setSilinecekSiparisID(null)} style={{ flex: 1, background: "#334155", color: "#f8fafc", border: "none", padding: "10px", borderRadius: "6px", fontWeight: "500", cursor: "pointer", fontSize: "14px" }}>İptal</button>
              <button onClick={siparisSilmeIslemi} style={{ flex: 1, background: "#ef4444", color: "#fff", border: "none", padding: "10px", borderRadius: "6px", fontWeight: "500", cursor: "pointer", fontSize: "14px" }}>Sil</button>
            </div>
          </div>
        </div>
      )}

      {/* YENİ ÜRÜN / DÜZENLEME FORMU */}
      {yeniUrunModu && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(15, 23, 42, 0.8)", zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <form onSubmit={urunKaydet} style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "12px", padding: "24px", maxWidth: "500px", width: "90%", display: "flex", flexDirection: "column", gap: "12px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 10px 25px rgba(0,0,0,0.5)" }}>
            <h3 style={{ color: "#f8fafc", fontSize: "16px", fontWeight: "600", borderBottom: "1px solid #334155", paddingBottom: "10px", margin: "0 0 5px 0" }}>{duzenlenenUrun ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}</h3>
            
            <div><label style={{ color: "#cbd5e1", fontSize: "12px", display: "block", marginBottom:"4px" }}>Ürün Adı</label><input type="text" value={formIsim} onChange={(e) => setFormIsim(e.target.value)} required style={{ width: "100%", padding: "10px", background: "#0f172a", border: "1px solid #334155", borderRadius: "6px", color: "#f8fafc", outline: "none", fontSize: "14px" }} /></div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div><label style={{ color: "#cbd5e1", fontSize: "12px", display: "block", marginBottom:"4px" }}>Normal Fiyat (TL)</label><input type="number" value={formFiyat} onChange={(e) => setFormFiyat(e.target.value)} required style={{ width: "100%", padding: "10px", background: "#0f172a", border: "1px solid #334155", borderRadius: "6px", color: "#f8fafc", outline: "none", fontSize: "14px" }} /></div>
              <div><label style={{ color: "#cbd5e1", fontSize: "12px", display: "block", marginBottom:"4px" }}>İndirimli Fiyat (TL)</label><input type="number" value={formIndirimliFiyat} onChange={(e) => setFormIndirimliFiyat(e.target.value)} placeholder="İsteğe bağlı" style={{ width: "100%", padding: "10px", background: "#0f172a", border: "1px solid #334155", borderRadius: "6px", color: "#f8fafc", outline: "none", fontSize: "14px" }} /></div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={{ color: "#cbd5e1", fontSize: "12px", display: "block", marginBottom:"4px" }}>Stok Adedi</label>
                <input type="number" value={formStokAdedi} onChange={(e) => setFormStokAdedi(e.target.value)} placeholder="Boş = Sınırsız" style={{ width: "100%", padding: "10px", background: "#0f172a", border: "1px solid #334155", borderRadius: "6px", color: "#f8fafc", outline: "none", fontSize: "14px" }} />
              </div>
              <div><label style={{ color: "#cbd5e1", fontSize: "12px", display: "block", marginBottom:"4px" }}>Havale İndirimi (%)</label><input type="number" value={formHavaleIndirimi} onChange={(e) => setFormHavaleIndirimi(e.target.value)} min="0" max="100" style={{ width: "100%", padding: "10px", background: "#0f172a", border: "1px solid #334155", borderRadius: "6px", color: "#f8fafc", outline: "none", fontSize: "14px" }} /></div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={{ color: "#cbd5e1", fontSize: "12px", display: "block", marginBottom:"4px" }}>Stok Durumu</label>
                <select value={formStok} onChange={(e) => setFormStok(e.target.value)} style={{ width: "100%", padding: "10px", background: "#0f172a", border: "1px solid #334155", borderRadius: "6px", color: "#f8fafc", outline: "none", fontSize: "14px" }}>
                  <option value="Stokta Var">Stokta Var</option>
                  <option value="Tükendi">Tükendi</option>
                </select>
              </div>
              <div><label style={{ color: "#cbd5e1", fontSize: "12px", display: "block", marginBottom:"4px" }}>Kategori</label><input type="text" value={formKategori} onChange={(e) => setFormKategori(e.target.value)} style={{ width: "100%", padding: "10px", background: "#0f172a", border: "1px solid #334155", borderRadius: "6px", color: "#f8fafc", outline: "none", fontSize: "14px" }} /></div>
            </div>

            <div><label style={{ color: "#cbd5e1", fontSize: "12px", display: "block", marginBottom:"4px" }}>Resim URL Yolu</label><input type="text" value={formResim} onChange={(e) => setFormResim(e.target.value)} style={{ width: "100%", padding: "10px", background: "#0f172a", border: "1px solid #334155", borderRadius: "6px", color: "#f8fafc", outline: "none", fontSize: "14px" }} /></div>

            <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
              <button type="button" onClick={formuKapat} style={{ flex: 1, padding: "10px", background: "#334155", color: "#f8fafc", border: "none", borderRadius: "6px", fontWeight: "500", cursor: "pointer", fontSize: "14px" }}>İptal</button>
              <button type="submit" style={{ flex: 1, padding: "10px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "500", cursor: "pointer", fontSize: "14px" }}>Kaydet</button>
            </div>
          </form>
        </div>
      )}

      {/* ÜST BİLGİ & ÇIKIŞ */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", paddingBottom: "16px", borderBottom: "1px solid #334155" }}>
        <h1 style={{ color: "#f8fafc", fontSize: "20px", fontWeight: "600", margin: 0 }}>Yönetim Paneli</h1>
        <button onClick={cikisYap} style={{ background: "transparent", color: "#94a3b8", border: "1px solid #334155", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontWeight: "500" }}>Çıkış Yap</button>
      </div>

      {/* SEKMELER (TABS) */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
        <button onClick={() => setAktifSekme("siparisler")} style={{ background: aktifSekme === "siparisler" ? "#e2e8f0" : "transparent", color: aktifSekme === "siparisler" ? "#0f172a" : "#94a3b8", border: "1px solid", borderColor: aktifSekme === "siparisler" ? "#e2e8f0" : "#334155", padding: "8px 16px", borderRadius: "6px", fontWeight: "500", cursor: "pointer", fontSize: "14px", transition: "all 0.2s" }}>
          📦 Siparişler ({siparisler.length})
        </button>
        <button onClick={() => setAktifSekme("urunler")} style={{ background: aktifSekme === "urunler" ? "#e2e8f0" : "transparent", color: aktifSekme === "urunler" ? "#0f172a" : "#94a3b8", border: "1px solid", borderColor: aktifSekme === "urunler" ? "#e2e8f0" : "#334155", padding: "8px 16px", borderRadius: "6px", fontWeight: "500", cursor: "pointer", fontSize: "14px", transition: "all 0.2s" }}>
          💻 Ürünler ({urunler.length})
        </button>
        <button onClick={() => window.location.href = "/admin/reviews"} style={{ background: "transparent", color: "#94a3b8", border: "1px solid #334155", padding: "8px 16px", borderRadius: "6px", fontWeight: "500", cursor: "pointer", fontSize: "14px", marginLeft: "auto", transition: "all 0.2s" }}>
          ⭐ Yorumlar
        </button>
      </div>
      
      {yukleniyor ? <div style={{ padding: "40px 0", color: "#94a3b8", fontSize: "14px" }}>Veriler yükleniyor...</div> : aktifSekme === "siparisler" ? (
        
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {siparisler.map((siparis) => (
            <div key={siparis._id} style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "15px", borderBottom: "1px solid #334155", paddingBottom: "12px" }}>
                <div>
                  <div style={{ color: "#f8fafc", fontSize: "16px", fontWeight: "600", marginBottom: "4px" }}>{siparis.siparisKodu}</div>
                  <div style={{ color: "#94a3b8", fontSize: "12px" }}>{new Date(siparis.tarih).toLocaleString("tr-TR")}</div>
                </div>
                
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#0f172a", padding: "6px 10px", borderRadius: "6px", border: "1px solid #334155" }}>
                    <span style={{ color: durumRengi(siparis.durum), fontSize: "12px", fontWeight: "500" }}>{siparis.durum}</span>
                    <span style={{ color: "#334155" }}>|</span>
                    <select onChange={(e) => durumGuncelle(siparis._id, e.target.value)} value={siparis.durum} style={{ background: "transparent", color: "#cbd5e1", border: "none", cursor: "pointer", fontSize: "13px", outline: "none" }}>
                      <option value="Ödeme Bekliyor (Havale)">Bekliyor (Havale)</option>
                      <option value="Ödendi / Hazırlanıyor">Hazırlanıyor</option>
                      <option value="Kargoya Verildi">Kargoya Verildi</option>
                      <option value="Tamamlandı">Tamamlandı</option>
                      <option value="İptal Edildi">İptal Edildi</option>
                    </select>
                  </div>
                  <button onClick={() => setSilinecekSiparisID(siparis._id)} style={{ background: "transparent", color: "#ef4444", border: "1px solid #ef4444", padding: "6px 12px", borderRadius: "6px", fontSize: "13px", cursor: "pointer" }}>Sil</button>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px" }}>
                
                {/* SÜTUN 1: MÜŞTERİ */}
                <div>
                  <div style={{ color: "#94a3b8", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px", fontWeight: "600" }}>Müşteri Bilgileri</div>
                  <div style={{ color: "#e2e8f0", fontSize: "13px", lineHeight: "1.6" }}>
                    <span style={{ fontWeight: "600", color: "#f8fafc" }}>{siparis.musteri?.ad} {siparis.musteri?.soyad}</span><br />
                    {siparis.musteri?.telefon} <span style={{color: "#475569"}}>•</span> {siparis.musteri?.eposta}<br />
                    <span style={{ color: "#cbd5e1" }}>{siparis.musteri?.adres ? `${siparis.musteri.adres}, ` : ""}{siparis.musteri?.ilce} / {siparis.musteri?.sehir}</span>
                  </div>
                  
                  {siparis.siparisNotu && siparis.siparisNotu !== "Not eklenmemiş" && (
                    <div style={{ marginTop: "12px", padding: "10px", background: "#0f172a", borderLeft: "3px solid #3b82f6", borderRadius: "4px" }}>
                      <div style={{ color: "#94a3b8", fontSize: "11px", marginBottom: "4px" }}>Sipariş Notu:</div>
                      <div style={{ color: "#e2e8f0", fontSize: "13px", fontStyle: "italic" }}>"{siparis.siparisNotu}"</div>
                    </div>
                  )}
                </div>

                {/* SÜTUN 2: ÖDEME */}
                <div>
                  <div style={{ color: "#94a3b8", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px", fontWeight: "600" }}>Ödeme Özeti</div>
                  <div style={{ color: "#e2e8f0", fontSize: "13px", lineHeight: "1.6" }}>
                    Yöntem: <span style={{ color: "#f8fafc" }}>{siparis.odemeYontemi === "kart" ? "Kredi Kartı" : "Havale / EFT"}</span><br />
                    Tutar: <span style={{ color: "#f8fafc", fontWeight: "600" }}>{Number((siparis.toplamTutar) || (siparis.Tutar) || 0).toLocaleString("tr-TR")} TL</span>
                  </div>
                </div>

                {/* SÜTUN 3: ÜRÜNLER */}
                <div>
                  <div style={{ color: "#94a3b8", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px", fontWeight: "600" }}>Sipariş İçeriği</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {siparis.sepet?.map((urun: any, i: number) => (
                      <div key={i} style={{ background: "#0f172a", padding: "8px 10px", borderRadius: "6px", border: "1px solid #334155" }}>
                        <div style={{ color: "#e2e8f0", fontSize: "13px", marginBottom: "4px" }}>
                          <span style={{ color: "#94a3b8", marginRight: "6px" }}>{urun.adet}x</span>{urun.isim || urun.name}
                        </div>
                        <div style={{ color: "#64748b", fontSize: "11px", fontFamily: "monospace" }}>
                          KOD: {urun.id || urun._id || "Tanımsız"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* MÜŞTERİ MESAJI ALANI */}
              <div style={{ borderTop: "1px solid #334155", paddingTop: "12px" }}>
                <div style={{ color: "#94a3b8", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px", fontWeight: "600" }}>Müşteri Takip Ekranı Mesajı</div>
                <input type="text" defaultValue={siparis.musteriMesaji || ""} onBlur={(e) => mesajGuncelle(siparis._id, e.target.value)} placeholder="Müşteriye iletilecek notu yazıp boşluğa tıklayın..." style={{ width: "100%", padding: "10px 12px", background: "#0f172a", color: "#e2e8f0", border: "1px solid #334155", borderRadius: "6px", outline: "none", fontSize: "13px" }} />
              </div>

              {/* 🚀 EN BASİT, SORUNSUZ KARGO KUTUSU 🚀 */}
              {siparis.durum === "Kargoya Verildi" && (
                <div style={{ borderTop: "1px dashed #3b82f6", paddingTop: "12px", marginTop: "12px", background: "#3b82f610", padding: "12px", borderRadius: "8px" }}>
                  <div style={{ color: "#3b82f6", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px", fontWeight: "800" }}>
                    Kargo Takip Bilgilerini Gir
                  </div>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                    <input 
                      id={`firma-${siparis._id}`} 
                      defaultValue={siparis.kargoFirmasi || ""} 
                      placeholder="Firma (Örn: Yurtiçi)" 
                      style={{ flex: 1, minWidth: "120px", padding: "10px", background: "#0f172a", color: "#f8fafc", border: "1px solid #3b82f650", borderRadius: "6px", outline: "none", fontSize: "13px" }} 
                    />
                    <input 
                      id={`takip-${siparis._id}`} 
                      defaultValue={siparis.takipNo || ""} 
                      placeholder="Takip Numarası" 
                      style={{ flex: 2, minWidth: "180px", padding: "10px", background: "#0f172a", color: "#f8fafc", border: "1px solid #3b82f650", borderRadius: "6px", outline: "none", fontSize: "13px", letterSpacing: "1px" }} 
                    />
                    <button 
                      onClick={() => {
                        const f = (document.getElementById(`firma-${siparis._id}`) as HTMLInputElement).value;
                        const t = (document.getElementById(`takip-${siparis._id}`) as HTMLInputElement).value;
                        if(!f || !t) return alert("Şefim, Firma ve Takip Numarası boş olamaz!");
                        kargoGuncelle(siparis._id, f, t);
                      }} 
                      style={{ background: "#3b82f6", color: "#fff", padding: "10px 20px", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "13px" }}
                    >
                      KAYDET
                    </button>
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>
        
      ) : (
        
        <div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
            <button onClick={yeniUrunModunuAc} style={{ background: "#f8fafc", color: "#0f172a", border: "none", padding: "8px 16px", borderRadius: "6px", fontWeight: "500", cursor: "pointer", fontSize: "14px" }}>+ Yeni Ürün</button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
            {urunler.map((urun, index) => {
              
              const normalFiyat = Number(urun.regular_price || urun.fiyat || urun.price || 0);
              const indirimliFiyat = urun.indirimliFiyat ? Number(urun.indirimliFiyat) : null;
              const gosterilenFiyat = indirimliFiyat ? indirimliFiyat : normalFiyat;

              const stokSifirMi = urun.stokAdedi === 0 || urun.stokAdedi === "0";
              const gosterilecekDurum = (urun.stokDurumu === "Tükendi" || stokSifirMi) ? "Tükendi" : "Stokta Var";
              
              const adetGosterilecekMi = urun.stokAdedi !== null && urun.stokAdedi !== undefined && urun.stokAdedi !== "" && Number(urun.stokAdedi) !== 10 && Number(urun.stokAdedi) > 0;

              return (
                <div key={urun._id || index} style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", padding: "16px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "16px" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px", gap: "8px" }}>
                      
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <span style={{ color: "#94a3b8", fontSize: "11px", textTransform: "uppercase" }}>{urun.kategori || "Genel"}</span>
                        <span style={{ color: "#64748b", fontSize: "10px", fontFamily: "monospace" }}>ID: {urun._id}</span>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: gosterilecekDurum === "Tükendi" ? "#ef4444" : "#10b981" }}></span>
                          <span style={{ color: "#cbd5e1", fontSize: "12px" }}>{gosterilecekDurum}</span>
                        </div>
                        {adetGosterilecekMi && (
                          <span style={{ color: "#94a3b8", fontSize: "11px" }}>{urun.stokAdedi} Adet Kaldı</span>
                        )}
                      </div>
                    </div>
                    
                    <div style={{ color: "#f8fafc", fontSize: "14px", fontWeight: "500", lineHeight: "1.4" }}>{urun.isim || urun.name}</div>

                    <div style={{ marginTop: "12px" }}>
                      {indirimliFiyat ? (
                        <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                          <span style={{ color: "#64748b", fontSize: "12px", textDecoration: "line-through" }}>{normalFiyat.toLocaleString("tr-TR")} TL</span>
                          <span style={{ color: "#f8fafc", fontSize: "16px", fontWeight: "600" }}>{gosterilenFiyat.toLocaleString("tr-TR")} TL</span>
                        </div>
                      ) : (
                        <div style={{ color: "#f8fafc", fontSize: "16px", fontWeight: "600" }}>{gosterilenFiyat.toLocaleString("tr-TR")} TL</div>
                      )}
                      
                      <div style={{ color: "#94a3b8", fontSize: "11px", marginTop: "4px" }}>
                        Havale İndirimi: %{urun.havaleIndirimi !== undefined ? urun.havaleIndirimi : 5}
                      </div>
                    </div>

                  </div>
                  <div style={{ display: "flex", gap: "8px", borderTop: "1px solid #334155", paddingTop: "12px" }}>
                    <button onClick={() => urunDuzenleModunuAc(urun)} style={{ flex: 1, background: "transparent", color: "#e2e8f0", border: "1px solid #475569", padding: "6px", borderRadius: "4px", fontSize: "13px", cursor: "pointer" }}>Düzenle</button>
                    <button onClick={() => urunSilmeIslemi(urun._id)} style={{ flex: 1, background: "transparent", color: "#ef4444", border: "1px solid #ef4444", padding: "6px", borderRadius: "4px", fontSize: "13px", cursor: "pointer" }}>Sil</button>
                  </div>
                  
                </div>
              );
            })}
          </div>
          
        </div>
      )}

    </div>
    
  );
}