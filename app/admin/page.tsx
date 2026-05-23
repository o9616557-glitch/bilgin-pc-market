"use client";
import { useState, useEffect } from "react";

export default function AdminPaneli() {
  const [sifre, setSifre] = useState("");
  const [girisYapildi, setGirisYapildi] = useState(false);
  const [aktifSekme, setAktifSekme] = useState<"siparisler" | "urunler">("siparisler");
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
  const [formStokAdedi, setFormStokAdedi] = useState("10"); 
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
      setBildirim({tip: "hata", mesaj: "Hatalı Şifre! Giriş Reddedildi."});
    }
  };

  const cikisYap = () => {
    sessionStorage.removeItem("patronGiris");
    setGirisYapildi(false);
  };

  const siparisleriGetir = async () => {
    try {
      const res = await fetch(`/api/admin/siparisler?v=${Date.now()}`, { 
        method: "GET", headers: { "x-patron-anahtar": PATRON_SIFRESI }
      });
      const data = await res.json();
      if (data.success) setSiparisler(data.siparisler);
    } catch (e) { console.error(e); }
  };

  const durumGuncelle = async (id: string, yeniDurum: string) => {
    try {
      const res = await fetch("/api/admin/siparisler", {
        method: "PUT", headers: { "Content-Type": "application/json", "x-patron-anahtar": PATRON_SIFRESI },
        body: JSON.stringify({ id, yeniDurum })
      });
      if ((await res.json()).success) {
        setSiparisler(siparisler.map(s => s._id === id ? { ...s, durum: yeniDurum } : s));
        setBildirim({tip: "basari", mesaj: "Sipariş durumu başarıyla güncellendi!"});
      }
    } catch (e) { setBildirim({tip: "hata", mesaj: "Durum güncellenirken bir hata oluştu."}); }
  };

  const mesajGuncelle = async (id: string, musteriMesaji: string) => {
    try {
      const res = await fetch("/api/admin/siparisler", {
        method: "PUT", headers: { "Content-Type": "application/json", "x-patron-anahtar": PATRON_SIFRESI },
        body: JSON.stringify({ id, musteriMesaji })
      });
      if ((await res.json()).success) {
        setBildirim({tip: "basari", mesaj: "Mesaj müşterinin takip ekranına iletildi! 🚀"});
      }
    } catch (e) { setBildirim({tip: "hata", mesaj: "Mesaj iletilemedi."}); }
  };

  const siparisSilmeIslemi = async () => {
    if (!silinecekSiparisID) return;
    try {
      const res = await fetch(`/api/admin/siparisler?id=${silinecekSiparisID}`, {
        method: "DELETE", headers: { "x-patron-anahtar": PATRON_SIFRESI }
      });
      if ((await res.json()).success) {
        setSiparisler(siparisler.filter(s => s._id !== silinecekSiparisID));
        setSilinecekSiparisID(null);
        setBildirim({tip: "basari", mesaj: "Sipariş sistemden tamamen silindi!"});
      }
    } catch (e) { setBildirim({tip: "hata", mesaj: "Silme işlemi başarısız oldu."}); }
  };

  const urunleriGetir = async () => {
    try {
      const res = await fetch(`/api/admin/products?v=${Date.now()}`, {
        method: "GET", headers: { "x-patron-anahtar": PATRON_SIFRESI }
      });
      const data = await res.json();
      if (data.success) setUrunler(data.urunler);
    } catch (e) { console.error(e); }
  };

  const urunKaydet = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const gonderilecekVeri: any = {
        isim: formIsim, fiyat: formFiyat, indirimliFiyat: formIndirimliFiyat, havaleIndirimi: formHavaleIndirimi, stokDurumu: formStok, stokAdedi: formStokAdedi, resim: formResim, kategori: formKategori
      };
      if (duzenlenenUrun) gonderilecekVeri.id = duzenlenenUrun._id;

      const res = await fetch("/api/admin/products", {
        method: "PUT", headers: { "Content-Type": "application/json", "x-patron-anahtar": PATRON_SIFRESI },
        body: JSON.stringify(gonderilecekVeri)
      });
      
      if ((await res.json()).success) {
        setBildirim({tip: "basari", mesaj: duzenlenenUrun ? "Ürün başarıyla güncellendi!" : "Yeni ürün dükkana eklendi! 🚀"});
        formuKapat();
        urunleriGetir();
      }
    } catch (e) { setBildirim({tip: "hata", mesaj: "Ürün kaydedilirken hata oluştu."}); }
  };

  const urunSilmeIslemi = async (id: string) => {
    if (!window.confirm("Bu ürünü silmek istediğine emin misin şefim? Siteden tamamen kalkacak!")) return;
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: "DELETE", headers: { "x-patron-anahtar": PATRON_SIFRESI }
      });
      if ((await res.json()).success) {
        setUrunler(urunler.filter(u => u._id !== id));
        setBildirim({tip: "basari", mesaj: "Ürün dükkandan kaldırıldı."});
      }
    } catch (e) { setBildirim({tip: "hata", mesaj: "Ürün silinemedi."}); }
  };

  const urunDuzenleModunuAc = (urun: any) => {
    setDuzenlenenUrun(urun);
    setFormIsim(urun.isim || urun.name || "");
    // Eğer regular_price varsa o normal fiyattır, yoksa kendi fiyatıdır
    const orjFiyat = urun.regular_price || urun.fiyat || urun.price || 0;
    setFormFiyat(orjFiyat.toString());
    setFormIndirimliFiyat(urun.indirimliFiyat ? urun.indirimliFiyat.toString() : ""); 
    setFormHavaleIndirimi(urun.havaleIndirimi !== undefined ? urun.havaleIndirimi.toString() : "5");
    setFormStok(urun.stokDurumu || "Stokta Var");
    setFormStokAdedi(urun.stokAdedi ? urun.stokAdedi.toString() : "10");
    setFormResim(urun.resim || "");
    setFormKategori(urun.kategori || "Bilgisayar");
    setYeniUrunModu(true);
  };

  const yeniUrunModunuAc = () => {
    setDuzenlenenUrun(null);
    setFormIsim(""); setFormFiyat(""); setFormIndirimliFiyat(""); setFormHavaleIndirimi("5"); setFormStok("Stokta Var"); setFormStokAdedi("10"); setFormResim(""); setFormKategori("Bilgisayar");
    setYeniUrunModu(true);
  };

  const formuKapat = () => {
    setYeniUrunModu(false);
    setDuzenlenenUrun(null);
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
        {bildirim && (
          <div style={{ position: "fixed", top: 20, right: 20, background: "#121214", border: `1px solid ${bildirim.tip === "basari" ? "#00e5ff" : "#ef4444"}`, borderRadius: "10px", padding: "15px 25px", color: "#fff", display: "flex", alignItems: "center", gap: "10px", zIndex: 99999 }}>
            <span>{bildirim.tip === "basari" ? "✅" : "❌"}</span>
            <span style={{ fontWeight: "700" }}>{bildirim.mesaj}</span>
            <button onClick={() => setBildirim(null)} style={{ background: "transparent", color: "#a1a1aa", border: "none", cursor: "pointer" }}>×</button>
          </div>
        )}
        <form onSubmit={girisYap} style={{ background: "#121214", border: "1px solid #27272a", padding: "40px", borderRadius: "20px", textAlign: "center", maxWidth: "400px", width: "100%" }}>
          <span style={{ fontSize: "3rem", display: "block", marginBottom: "15px" }}>🕵️‍♂️</span>
          <h2 style={{ color: "#fff", marginBottom: "25px", fontWeight: "900" }}>Patron Girişi</h2>
          <input type="password" value={sifre} onChange={(e) => setSifre(e.target.value)} placeholder="Şifreyi Girin..." style={{ width: "100%", padding: "15px", background: "#09090b", border: "1px solid #27272a", borderRadius: "10px", color: "#fff", marginBottom: "20px", outline: "none" }} required />
          <button type="submit" style={{ width: "100%", padding: "15px", background: "#00e5ff", color: "#000", border: "none", borderRadius: "10px", fontWeight: "900", cursor: "pointer" }}>Kilidi Aç</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      
      {/* SEFİM: ÖZEL NEON BİLDİRİM MASASI */}
      {bildirim && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0, 0, 0, 0.7)", zIndex: 99999, display: "flex", justifyContent: "center", alignItems: "center", backdropFilter: "blur(4px)" }}>
          <div style={{ background: "#121214", border: `1px solid ${bildirim.tip === "basari" ? "#00e5ff" : "#ef4444"}`, borderRadius: "16px", padding: "30px", maxWidth: "400px", width: "90%", textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "10px" }}>{bildirim.tip === "basari" ? "✅" : "⚠️"}</div>
            <h3 style={{ color: "#fff", fontWeight: "900", fontSize: "1.4rem", marginBottom: "15px" }}>{bildirim.tip === "basari" ? "İşlem Başarılı" : "Bir Sorun Var"}</h3>
            <p style={{ color: "#a1a1aa", fontSize: "0.95rem", marginBottom: "25px", lineHeight: "1.5" }}>{bildirim.mesaj}</p>
            <button onClick={() => setBildirim(null)} style={{ width: "100%", background: bildirim.tip === "basari" ? "#00e5ff" : "#ef4444", color: bildirim.tip === "basari" ? "#000" : "#fff", border: "none", padding: "12px", borderRadius: "8px", fontWeight: "900", cursor: "pointer" }}>Tamam</button>
          </div>
        </div>
      )}

      {/* SİPARİŞ SİLME ONAY MODAL */}
      {silinecekSiparisID && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0, 0, 0, 0.8)", zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "center", backdropFilter: "blur(5px)" }}>
          <div style={{ background: "#121214", border: "1px solid #ef4444", borderRadius: "16px", padding: "30px", maxWidth: "400px", textAlign: "center", width: "90%" }}>
            <div style={{ fontSize: "3rem", marginBottom: "10px" }}>⚠️</div>
            <h3 style={{ color: "#fff", fontWeight: "900", marginBottom: "15px" }}>Siparişi Sil?</h3>
            <p style={{ color: "#a1a1aa", fontSize: "0.95rem", marginBottom: "25px" }}>Bu sipariş veritabanından kalıcı olarak silinecek. Emin misin şefim?</p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setSilinecekSiparisID(null)} style={{ flex: 1, background: "#27272a", color: "#fff", border: "none", padding: "12px", borderRadius: "8px", fontWeight: "800", cursor: "pointer" }}>Vazgeç</button>
              <button onClick={siparisSilmeIslemi} style={{ flex: 1, background: "#ef4444", color: "#fff", border: "none", padding: "12px", borderRadius: "8px", fontWeight: "900", cursor: "pointer" }}>Evet, Sil</button>
            </div>
          </div>
        </div>
      )}

      {/* ÜRÜN EKLEME / DÜZENLEME MODAL */}
      {yeniUrunModu && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0, 0, 0, 0.85)", zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "center", backdropFilter: "blur(5px)" }}>
          <form onSubmit={urunKaydet} style={{ background: "#121214", border: "1px solid #00e5ff", borderRadius: "16px", padding: "20px", maxWidth: "520px", width: "90%", display: "flex", flexDirection: "column", gap: "12px", maxHeight: "95vh", overflowY: "auto" }}>
            <h3 style={{ color: "#fff", fontSize: "1.2rem", fontWeight: "900", borderBottom: "1px solid #27272a", paddingBottom: "10px", margin: 0 }}>
              {duzenlenenUrun ? "⚙️ ÜRÜNÜ DÜZENLE" : "🚀 YENİ ÜRÜN EKLE"}
            </h3>
            
            <div>
              <label style={{ color: "#a1a1aa", fontSize: "0.75rem", display: "block", marginBottom: "3px" }}>Ürün Adı</label>
              <input type="text" value={formIsim} onChange={(e) => setFormIsim(e.target.value)} required style={{ width: "100%", padding: "10px", background: "#09090b", border: "1px solid #27272a", borderRadius: "6px", color: "#fff", outline: "none" }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div>
                <label style={{ color: "#a1a1aa", fontSize: "0.75rem", display: "block", marginBottom: "3px" }}>Normal Fiyat (TL)</label>
                <input type="number" value={formFiyat} onChange={(e) => setFormFiyat(e.target.value)} required style={{ width: "100%", padding: "10px", background: "#09090b", border: "1px solid #27272a", borderRadius: "6px", color: "#fff", outline: "none" }} />
              </div>
              <div>
                <label style={{ color: "#ffb300", fontSize: "0.75rem", display: "block", marginBottom: "3px" }}>İndirimli Fiyat (TL) - *Boş Kalabilir</label>
                <input type="number" value={formIndirimliFiyat} onChange={(e) => setFormIndirimliFiyat(e.target.value)} placeholder="İndirim yoksa boş bırak" style={{ width: "100%", padding: "10px", background: "#09090b", border: "1px solid #27272a", borderRadius: "6px", color: "#ffb300", outline: "none", fontWeight: "bold" }} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div>
                <label style={{ color: "#00e5ff", fontSize: "0.75rem", display: "block", marginBottom: "3px" }}>Stok Adedi (Sayı)</label>
                <input type="number" value={formStokAdedi} onChange={(e) => setFormStokAdedi(e.target.value)} required style={{ width: "100%", padding: "10px", background: "#09090b", border: "1px solid #27272a", borderRadius: "6px", color: "#00e5ff", fontWeight: "900", outline: "none" }} />
              </div>
              <div>
                <label style={{ color: "#10b981", fontSize: "0.75rem", display: "block", marginBottom: "3px" }}>Özel Havale İndirimi (%)</label>
                <input type="number" value={formHavaleIndirimi} onChange={(e) => setFormHavaleIndirimi(e.target.value)} min="0" max="100" style={{ width: "100%", padding: "10px", background: "#09090b", border: "1px solid #27272a", borderRadius: "6px", color: "#10b981", fontWeight: "900", outline: "none" }} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div>
                <label style={{ color: "#a1a1aa", fontSize: "0.75rem", display: "block", marginBottom: "3px" }}>Stok Durumu</label>
                <select value={formStok} onChange={(e) => setFormStok(e.target.value)} style={{ width: "100%", padding: "10px", background: "#09090b", border: "1px solid #27272a", borderRadius: "6px", color: "#fff", outline: "none" }}>
                  <option value="Stokta Var">Stokta Var</option>
                  <option value="Tükendi">Tükendi</option>
                  <option value="Sınırlı Stok">Sınırlı Stok</option>
                </select>
              </div>
              <div>
                <label style={{ color: "#a1a1aa", fontSize: "0.75rem", display: "block", marginBottom: "3px" }}>Kategori</label>
                <input type="text" value={formKategori} onChange={(e) => setFormKategori(e.target.value)} style={{ width: "100%", padding: "10px", background: "#09090b", border: "1px solid #27272a", borderRadius: "6px", color: "#fff", outline: "none" }} />
              </div>
            </div>

            <div>
              <label style={{ color: "#a1a1aa", fontSize: "0.75rem", display: "block", marginBottom: "3px" }}>Resim URL Yolu</label>
              <input type="text" value={formResim} onChange={(e) => setFormResim(e.target.value)} style={{ width: "100%", padding: "10px", background: "#09090b", border: "1px solid #27272a", borderRadius: "6px", color: "#fff", outline: "none" }} />
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button type="button" onClick={formuKapat} style={{ flex: 1, padding: "12px", background: "#27272a", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "800", cursor: "pointer" }}>Kapat</button>
              <button type="submit" style={{ flex: 1, padding: "12px", background: "#00e5ff", color: "#000", border: "none", borderRadius: "8px", fontWeight: "900", cursor: "pointer" }}>Kaydet</button>
            </div>
          </form>
        </div>
      )}

      {/* SEKMELER */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "30px", borderBottom: "1px solid #27272a", paddingBottom: "15px" }}>
        <button onClick={() => setAktifSekme("siparisler")} style={{ flex: "1 1 auto", background: aktifSekme === "siparisler" ? "#00e5ff" : "transparent", color: aktifSekme === "siparisler" ? "#000" : "#a1a1aa", border: aktifSekme === "siparisler" ? "none" : "1px solid #27272a", padding: "12px", borderRadius: "8px", fontWeight: "900", cursor: "pointer", textAlign: "center" }}>
          📦 Sipariş Yönetimi ({siparisler.length})
        </button>
        <button onClick={() => setAktifSekme("urunler")} style={{ flex: "1 1 auto", background: aktifSekme === "urunler" ? "#00e5ff" : "transparent", color: aktifSekme === "urunler" ? "#000" : "#a1a1aa", border: aktifSekme === "urunler" ? "none" : "1px solid #27272a", padding: "12px", borderRadius: "8px", fontWeight: "900", cursor: "pointer", textAlign: "center" }}>
          💻 Ürün Yönetimi ({urunler.length})
        </button>
      </div>

      {yukleniyor ? (
        <div style={{ textAlign: "center", padding: "50px", color: "#00e5ff", fontWeight: "900" }}>Veriler Çekiliyor Patron...</div>
      ) : aktifSekme === "siparisler" ? (
        
        // SİPARİŞLER SEKMESİ
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {siparisler.map((siparis) => (
            <div key={siparis._id} style={{ background: "#121214", border: "1px solid #27272a", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "15px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px", borderBottom: "1px solid #27272a", paddingBottom: "15px" }}>
                <div style={{ width: "100%", maxWidth: "300px" }}>
                  <h3 style={{ color: "#fff", fontSize: "1.2rem", fontWeight: "800", marginBottom: "5px" }}>{siparis.siparisKodu}</h3>
                  <p style={{ color: "#a1a1aa", fontSize: "0.85rem" }}>{new Date(siparis.tarih).toLocaleString("tr-TR")}</p>
                </div>
                
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", width: "100%", flex: 1, justifyContent: "flex-end" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px", background: "#09090b", padding: "8px", borderRadius: "10px", border: "1px solid #27272a", flex: "1 1 auto" }}>
                    <span style={{ color: durumRengi(siparis.durum), fontWeight: "900", fontSize: "0.85rem", whiteSpace: "nowrap" }}>Mevcut: {siparis.durum}</span>
                    <select onChange={(e) => durumGuncelle(siparis._id, e.target.value)} value={siparis.durum} style={{ flex: 1, minWidth: "120px", background: "#18181b", color: "#fff", border: "1px solid #27272a", padding: "8px", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem" }}>
                      <option value="Ödeme Bekliyor (Havale)">Ödeme Bekliyor (Havale)</option>
                      <option value="Ödendi / Hazırlanıyor">Ödendi / Hazırlanıyor</option>
                      <option value="Kargoya Verildi">Kargoya Verildi</option>
                      <option value="Tamamlandı">Tamamlandı</option>
                      <option value="İptal Edildi">İptal Edildi</option>
                    </select>
                  </div>
                  <button onClick={() => setSilinecekSiparisID(siparis._id)} style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.3)", padding: "10px 15px", borderRadius: "8px", fontWeight: "900", cursor: "pointer", flex: "0 0 auto" }}>🗑️ Sil</button>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }}>
                <div>
                  <p style={{ color: "#a1a1aa", fontSize: "0.75rem", textTransform: "uppercase", marginBottom: "5px" }}>Müşteri Bilgileri</p>
                  <p style={{ color: "#fff", fontSize: "0.85rem", lineHeight: "1.5" }}>
                    <strong>{siparis.musteri?.ad} {siparis.musteri?.soyad}</strong><br />
                    📞 {siparis.musteri?.telefon}<br />
                    📍 {siparis.musteri?.ilce}/{siparis.musteri?.sehir}
                  </p>
                </div>
                <div>
                  <p style={{ color: "#a1a1aa", fontSize: "0.75rem", textTransform: "uppercase", marginBottom: "5px" }}>Ödeme Detayı</p>
                  <p style={{ color: "#fff", fontSize: "0.85rem" }}>
                    Yöntem: <strong>{siparis.odemeYontemi === "kart" ? "Kredi Kartı" : "Havale"}</strong><br />
                    Tutar: <strong style={{ color: "#00e5ff", fontSize: "1rem" }}>{Number((siparis.toplamTutar) || (siparis.Tutar) || 0).toLocaleString("tr-TR")} TL</strong>
                  </p>
                </div>
                <div>
                  <p style={{ color: "#a1a1aa", fontSize: "0.75rem", textTransform: "uppercase", marginBottom: "5px" }}>Satın Alınanlar</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                    {siparis.sepet?.map((urun: any, i: number) => (
                      <div key={i} style={{ color: "#fff", fontSize: "0.8rem", background: "#09090b", padding: "6px 10px", borderRadius: "6px", border: "1px solid #27272a" }}>
                        <span style={{ color: "#00e5ff", fontWeight: "800" }}>{urun.adet}x</span> {urun.isim || urun.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        
        // ÜRÜNLER SEKMESİ
        <div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
            <button onClick={yeniUrunModunuAc} style={{ width: "100%", maxWidth: "200px", background: "#00e5ff", color: "#000", border: "none", padding: "12px", borderRadius: "8px", fontWeight: "900", cursor: "pointer", fontSize: "0.95rem" }}>
              ➕ Yeni Ürün Ekle
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "15px" }}>
            {urunler.map((urun, index) => {
              const normalFiyat = Number(urun.regular_price || urun.fiyat || urun.price || 0);
              const gecerliFiyat = Number(urun.price || urun.fiyat || 0);
              const indirimVarMi = normalFiyat > gecerliFiyat;

              return (
                <div key={urun._id || index} style={{ background: "#121214", border: "1px solid #27272a", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "15px" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px", flexWrap: "wrap", gap: "10px" }}>
                      <span style={{ background: "#27272a", color: "#a1a1aa", fontSize: "0.7rem", padding: "4px 8px", borderRadius: "4px", textTransform: "uppercase" }}>{urun.kategori || "Genel"}</span>
                      
                      <div style={{display: "flex", alignItems: "center", gap: "6px"}}>
                        <span style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10b981", fontSize: "0.7rem", padding: "4px 6px", borderRadius: "4px", fontWeight: "900" }}>
                          Havale: %{urun.havaleIndirimi !== undefined ? urun.havaleIndirimi : 5}
                        </span>
                        <span style={{ background: "rgba(0, 229, 255, 0.1)", color: "#00e5ff", fontSize: "0.7rem", padding: "4px 6px", borderRadius: "4px", fontWeight: "900" }}>{urun.stokAdedi || 0} Adet</span>
                        <span style={{ color: urun.stokDurumu === "Tükendi" ? "#ef4444" : "#10b981", fontWeight: "800", fontSize: "0.75rem" }}>● {urun.stokDurumu || "Stokta Var"}</span>
                      </div>
                    </div>

                    <h3 style={{ color: "#fff", fontSize: "1rem", fontWeight: "700", lineHeight: "1.4", margin: "5px 0" }}>{urun.isim || urun.name || "İsimsiz Ürün"}</h3>
                    
                    <div style={{ margin: "10px 0 0 0" }}>
                      {indirimVarMi ? (
                        <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                          <span style={{ color: "#ef4444", fontSize: "0.9rem", textDecoration: "line-through", opacity: 0.6 }}>
                            {normalFiyat.toLocaleString("tr-TR")} TL
                          </span>
                          <span style={{ color: "#00e5ff", fontSize: "1.3rem", fontWeight: "900" }}>
                            {gecerliFiyat.toLocaleString("tr-TR")} TL
                          </span>
                        </div>
                      ) : (
                        <span style={{ color: "#00e5ff", fontSize: "1.3rem", fontWeight: "900" }}>
                          {gecerliFiyat.toLocaleString("tr-TR")} TL
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "10px", borderTop: "1px solid #27272a", paddingTop: "15px", marginTop: "5px" }}>
                    <button onClick={() => urunDuzenleModunuAc(urun)} style={{ flex: 1, background: "rgba(0, 229, 255, 0.1)", color: "#00e5ff", border: "1px solid rgba(0, 229, 255, 0.2)", padding: "8px", borderRadius: "6px", fontWeight: "800", cursor: "pointer", fontSize: "0.85rem" }}>⚙️ Düzenle</button>
                    <button onClick={() => urunSilmeIslemi(urun._id)} style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.2)", padding: "8px 12px", borderRadius: "6px", fontWeight: "800", cursor: "pointer", fontSize: "0.85rem" }}>🗑️ Sil</button>
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