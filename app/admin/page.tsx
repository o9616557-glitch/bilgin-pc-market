"use client";
import { useState, useEffect } from "react";

export default function AdminPaneli() {
  const [sifre, setSifre] = useState("");
  const [girisYapildi, setGirisYapildi] = useState(false);
  const [siparisler, setSiparisler] = useState<any[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);

  const PATRON_SIFRESI = "Bilgin123";

  // ŞEFİM: Sayfa açıldığında tarayıcı hafızasına bakar, giriş yapılmışsa şifre sormaz!
  useEffect(() => {
    const patronGirdiMi = sessionStorage.getItem("patronGiris");
    if (patronGirdiMi === "basarili") {
      setGirisYapildi(true);
      siparisleriGetir();
    } else {
      setYukleniyor(false);
    }
  }, []);

  const girisYap = (e: React.FormEvent) => {
    e.preventDefault();
    if (sifre === PATRON_SIFRESI) {
      sessionStorage.setItem("patronGiris", "basarili"); // Hafızaya kazıdık
      setGirisYapildi(true);
      siparisleriGetir();
    } else {
      alert("Hatalı Şifre! Giriş Reddedildi.");
    }
  };

  const cikisYap = () => {
    sessionStorage.removeItem("patronGiris");
    setGirisYapildi(false);
    setSiparisler([]);
  };

  const siparisleriGetir = async () => {
    setYukleniyor(true);
    try {
      const res = await fetch(`/api/admin/siparisler?v=${Date.now()}`, { 
        method: "GET",
        cache: "no-store",
        headers: { "Pragma": "no-cache", "Cache-Control": "no-cache" }
      });
      const data = await res.json();
      if (data.success) {
        setSiparisler(data.siparisler);
      }
    } catch (error) {
      console.error("Hata:", error);
    } finally {
      setYukleniyor(false);
    }
  };

  const durumGuncelle = async (id: string, yeniDurum: string) => {
    try {
      const res = await fetch("/api/admin/siparisler", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, yeniDurum })
      });
      const data = await res.json();
      
      if (data.success) {
        setSiparisler(siparisler.map(s => s._id === id ? { ...s, durum: yeniDurum } : s));
      } else {
        alert("Güncelleme başarısız!");
      }
    } catch (error) {
      alert("Sistemsel hata oluştu.");
    }
  };

  const durumRengi = (durum: string) => {
    if (durum === "Ödendi / Hazırlanıyor" || durum.includes("Başarılı")) return "#10b981"; 
    if (durum === "Kargoya Verildi") return "#00e5ff"; 
    if (durum === "İptal Edildi") return "#ef4444"; 
    return "#f59e0b"; 
  };

  if (yukleniyor && !girisYapildi) {
    return <div style={{ textAlign: "center", padding: "100px", color: "#00e5ff" }}>Yükleniyor...</div>;
  }

  if (!girisYapildi) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", padding: "20px" }}>
        <form onSubmit={girisYap} style={{ background: "#121214", border: "1px solid #27272a", padding: "40px", borderRadius: "20px", textAlign: "center", maxWidth: "400px", width: "100%", boxShadow: "0 10px 40px rgba(0,0,0,0.5)" }}>
          <span style={{ fontSize: "3rem", display: "block", marginBottom: "15px" }}>🕵️‍♂️</span>
          <h2 style={{ color: "#fff", marginBottom: "25px", fontWeight: "900" }}>Patron Girişi</h2>
          <input 
            type="password" 
            value={sifre} 
            onChange={(e) => setSifre(e.target.value)} 
            placeholder="Şifreyi Girin..." 
            style={{ width: "100%", padding: "15px", background: "#09090b", border: "1px solid #27272a", borderRadius: "10px", color: "#fff", marginBottom: "20px", outline: "none", boxSizing: "border-box" }}
            required
          />
          <button type="submit" style={{ width: "100%", padding: "15px", background: "#00e5ff", color: "#000", border: "none", borderRadius: "10px", fontWeight: "900", cursor: "pointer", fontSize: "1rem" }}>
            Kilidi Aç
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "15px" }}>
        <h1 style={{ color: "#fff", fontSize: "2rem", fontWeight: "900", borderLeft: "6px solid #00e5ff", paddingLeft: "15px" }}>
          SİPARİŞ <span style={{ color: "#00e5ff" }}>YÖNETİMİ</span>
        </h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={siparisleriGetir} style={{ background: "#27272a", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "700" }}>🔄 Yenile</button>
          <button onClick={cikisYap} style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.3)", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "700" }}>Çıkış Yap</button>
        </div>
      </div>

      {yukleniyor ? (
        <div style={{ textAlign: "center", padding: "50px", color: "#00e5ff", fontWeight: "900" }}>Siparişler Çekiliyor...</div>
      ) : siparisler.length === 0 ? (
        <div style={{ background: "#121214", border: "1px dashed #27272a", padding: "50px", textAlign: "center", borderRadius: "16px", color: "#a1a1aa" }}>
          Henüz hiç sipariş yok.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {siparisler.map((siparis) => (
            <div key={siparis._id} style={{ background: "#121214", border: "1px solid #27272a", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "15px", borderBottom: "1px solid #27272a", paddingBottom: "15px" }}>
                <div>
                  <h3 style={{ color: "#fff", fontSize: "1.2rem", fontWeight: "800", marginBottom: "5px" }}>{siparis.siparisKodu}</h3>
                  <p style={{ color: "#a1a1aa", fontSize: "0.85rem" }}>{new Date(siparis.tarih).toLocaleString("tr-TR")}</p>
                </div>
                
                <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "#09090b", padding: "8px", borderRadius: "10px", border: "1px solid #27272a" }}>
                  <span style={{ color: durumRengi(siparis.durum), fontWeight: "900", fontSize: "0.9rem", marginRight: "10px" }}>Mevcut: {siparis.durum}</span>
                  <select 
                    onChange={(e) => durumGuncelle(siparis._id, e.target.value)}
                    value={siparis.durum}
                    style={{ background: "#18181b", color: "#fff", border: "1px solid #27272a", padding: "8px", borderRadius: "6px", outline: "none", cursor: "pointer", fontSize: "0.85rem" }}
                  >
                    <option value="Ödeme Bekliyor (Havale)">Ödeme Bekliyor (Havale)</option>
                    <option value="Ödendi / Hazırlanıyor">Ödendi / Hazırlanıyor</option>
                    <option value="Kargoya Verildi">Kargoya Verildi</option>
                    <option value="Tamamlandı">Tamamlandı</option>
                    <option value="İptal Edildi">İptal Edildi</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
                <div>
                  <p style={{ color: "#a1a1aa", fontSize: "0.75rem", textTransform: "uppercase", marginBottom: "5px" }}>Müşteri Bilgileri</p>
                  <p style={{ color: "#fff", fontSize: "0.9rem", lineHeight: "1.5" }}>
                    <strong>{siparis.musteri.ad} {siparis.musteri.soyad}</strong><br />
                    📞 {siparis.musteri.telefon} | ✉️ {siparis.musteri.eposta}<br />
                    📍 {siparis.musteri.adres} - {siparis.musteri.ilce}/{siparis.musteri.sehir}
                  </p>
                </div>

                <div>
                  <p style={{ color: "#a1a1aa", fontSize: "0.75rem", textTransform: "uppercase", marginBottom: "5px" }}>Ödeme Detayı</p>
                  <p style={{ color: "#fff", fontSize: "0.9rem", lineHeight: "1.5" }}>
                    Yöntem: <strong>{siparis.odemeYontemi === "kart" ? "Kredi Kartı / Iyzico" : "Havale / EFT"}</strong><br />
                    Tutar: <strong style={{ color: "#00e5ff", fontSize: "1.1rem" }}>{siparis.toplamTutar.toLocaleString()} TL</strong>
                  </p>
                </div>

                <div>
                  <p style={{ color: "#a1a1aa", fontSize: "0.75rem", textTransform: "uppercase", marginBottom: "5px" }}>Satın Alınanlar</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                    {siparis.sepet.map((urun: any, i: number) => (
                      <div key={i} style={{ color: "#fff", fontSize: "0.85rem", background: "#09090b", padding: "6px 10px", borderRadius: "6px", border: "1px solid #27272a" }}>
                        <span style={{ color: "#00e5ff", fontWeight: "800" }}>{urun.adet}x</span> {urun.isim}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}