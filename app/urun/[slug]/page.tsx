import clientPromise from "@/lib/mongodb";
import Link from "next/link";
import EtkilesimliButonlar from "./EtkilesimliButonlar"; // Yeni butonlarımızı çağırdık

export default async function UrunDetaySayfasi({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  let urun = null;

  try {
    const client = await clientPromise;
    const db = client.db("bilginpcmarket");
    urun = await db.collection("products").findOne({ slug: slug });
  } catch (e) {
    console.error("HATA:", e);
  }

  if (!urun) {
    return (
      <main style={{ padding: "100px 20px", textAlign: "center", background: "#09090b", color: "white", minHeight: "100vh" }}>
        <h1 style={{ fontSize: "3rem", marginBottom: "20px" }}>Bileşen Bulunamadı</h1>
        <Link href="/" style={{ color: "#00e5ff", textDecoration: "none", fontSize: "1.2rem" }}>&larr; Ana Sayfaya Dön</Link>
      </main>
    );
  }

  const anaFiyat = Number(urun.fiyat) || 0;
  const havaleFiyati = (anaFiyat * 0.95).toFixed(0);

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#09090b", color: "#ededed", padding: "20px", fontFamily: "'Inter', sans-serif" }}>
      
      {/* Mobil ve Masaüstü Görünüm İçin CSS Kuralları */}
      <style dangerouslySetInnerHTML={{__html: `
        .mobil-alt-bar { display: none !important; }
        @media (max-width: 768px) {
          .mobil-alt-bar { display: flex !important; }
          .masaustu-sepet { display: none !important; }
          .urun-ana-blok { flex-direction: column; }
        }
      `}} />

      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        <div style={{ marginBottom: "20px", fontSize: "0.85rem", color: "#a1a1aa", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <Link href="/" style={{ color: "#00e5ff", textDecoration: "none" }}>Ana Sayfa</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#fff" }}>{urun.kategori || "Donanım"}</span>
          </div>
          <span style={{ color: "#52525b" }}>Kod: {urun._id.toString().substring(0, 8).toUpperCase()}</span>
        </div>

        {/* Ana Blok */}
        <div className="urun-ana-blok" style={{ display: "flex", gap: "24px", marginBottom: "40px" }}>
          
          {/* Sol Görsel */}
          <div style={{ flex: "1 1 50%", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ width: "100%", height: "450px", backgroundColor: "#121214", borderRadius: "20px", border: "1px solid #27272a", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", position: "relative" }}>
              <div style={{ position: "absolute", top: "16px", left: "16px", backgroundColor: "#ef4444", color: "white", padding: "6px 14px", borderRadius: "30px", fontWeight: "800", fontSize: "0.85rem", boxShadow: "0 0 15px rgba(239,68,68,0.4)" }}>
                İNDİRİM
              </div>
              {urun.resim ? (
                <img src={urun.resim} alt={urun.isim} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
              ) : (
                <div style={{ color: "#52525b" }}>[ GÖRSEL_YOK ]</div>
              )}
            </div>
            
            {/* Kalp ve Kopyala Butonları (İstemci Bileşeni) */}
            <EtkilesimliButonlar />
          </div>

          {/* Sağ Detaylar */}
          <div style={{ flex: "1 1 50%", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <span style={{ color: "#f59e0b", fontSize: "1.2rem" }}>★★★★★</span>
              <span style={{ color: "#00e5ff", fontSize: "0.85rem", fontWeight: "600" }}>(24 Değerlendirme)</span>
            </div>

            <h1 style={{ fontSize: "2rem", fontWeight: "900", color: "#ffffff", lineHeight: "1.2", marginBottom: "16px" }}>
              {urun.isim}
            </h1>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "16px" }}>
              <div style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10b981", padding: "6px 12px", borderRadius: "8px", fontWeight: "700", fontSize: "0.8rem", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                {urun.stok_durumu || "STOKTA VAR"}
              </div>
              <div style={{ background: "rgba(0, 229, 255, 0.1)", color: "#00e5ff", padding: "6px 12px", borderRadius: "8px", fontWeight: "700", fontSize: "0.8rem", border: "1px solid rgba(0, 229, 255, 0.2)" }}>
                HIZLI GÖNDERİM
              </div>
              <div style={{ width: "100%", background: "#18181b", padding: "10px", borderRadius: "10px", border: "1px solid #27272a", fontSize: "0.85rem", color: "#e4e4e7", marginTop: "4px" }}>
                🚚 <strong style={{ color: "#00e5ff" }}>16:00'a kadar</strong> sipariş verin, bugün kargoya verilsin.
              </div>
            </div>

            {/* Fiyat Alanı */}
            <div style={{ background: "#121214", border: "1px solid #27272a", borderRadius: "16px", padding: "20px", marginBottom: "20px" }}>
              <div style={{ marginBottom: "16px" }}>
                <span style={{ fontSize: "0.9rem", color: "#a1a1aa", display: "block" }}>Kredi Kartı Tek Çekim</span>
                <div style={{ fontSize: "2.2rem", fontWeight: "900", color: "#ffffff" }}>{anaFiyat.toLocaleString()} TL</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", borderTop: "1px solid #27272a", paddingTop: "16px" }}>
                <div>
                  <span style={{ fontSize: "0.8rem", color: "#10b981", fontWeight: "700", display: "block" }}>%5 Havale İndirimi</span>
                  <div style={{ fontSize: "1.2rem", fontWeight: "800", color: "#10b981" }}>{Number(havaleFiyati).toLocaleString()} TL</div>
                </div>
                <div>
                  <span style={{ fontSize: "0.8rem", color: "#a1a1aa", display: "block" }}>9 - 12 Taksit Seçenekleri</span>
                </div>
              </div>
            </div>

            {/* Masaüstü Sepete Ekle Butonu */}
            <button className="masaustu-sepet" style={{ width: "100%", padding: "18px", fontSize: "1.2rem", fontWeight: "900", background: "linear-gradient(45deg, #00e5ff, #007acc)", color: "#000", border: "none", borderRadius: "12px", cursor: "pointer", textTransform: "uppercase", letterSpacing: "1px" }}>
              Sepete Ekle
            </button>
          </div>
        </div>

        {/* Alt Bilgi Panelleri */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginTop: "20px", paddingBottom: "40px" }}>
          <section style={{ background: "#121214", border: "1px solid #27272a", borderRadius: "16px", padding: "24px" }}>
            <h3 style={{ color: "#00e5ff", fontSize: "1.2rem", fontWeight: "800", marginBottom: "12px" }}>⚙️ Ürün Açıklaması</h3>
            <p style={{ color: "#d4d4d8", lineHeight: "1.6", fontSize: "0.95rem" }}>{urun.aciklama || "Bu canavar donanım, en yüksek ayarlarda akıcı bir deneyim sunmak için özel olarak optimize edildi."}</p>
          </section>

          <section style={{ background: "#121214", border: "1px solid #27272a", borderRadius: "16px", padding: "24px" }}>
            <h3 style={{ color: "#00e5ff", fontSize: "1.2rem", fontWeight: "800", marginBottom: "16px" }}>📊 Teknik Bilgiler</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
              <div style={{ background: "#09090b", padding: "12px", borderRadius: "10px", border: "1px solid #1f1f22" }}>
                <span style={{ color: "#71717a", fontSize: "0.8rem" }}>Garanti</span>
                <div style={{ fontWeight: "700", marginTop: "2px", fontSize: "0.9rem" }}>2 Yıl Distribütör</div>
              </div>
              <div style={{ background: "#09090b", padding: "12px", borderRadius: "10px", border: "1px solid #1f1f22" }}>
                <span style={{ color: "#71717a", fontSize: "0.8rem" }}>Durum</span>
                <div style={{ fontWeight: "700", marginTop: "2px", fontSize: "0.9rem" }}>Sıfır, Orijinal Kutu</div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* MOBİL YAPIŞKAN SEPET BUTONU */}
      <div className="mobil-alt-bar" style={{
        position: "fixed", bottom: 0, left: 0, right: 0, backgroundColor: "rgba(18, 18, 20, 0.98)", borderTop: "1px solid #27272a", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 9999
      }}>
        <div>
          <span style={{ fontSize: "0.75rem", color: "#a1a1aa", display: "block" }}>Toplam Tutar</span>
          <span style={{ fontSize: "1.3rem", fontWeight: "900", color: "#00e5ff" }}>{anaFiyat.toLocaleString()} TL</span>
        </div>
        <button style={{ padding: "12px 24px", background: "linear-gradient(45deg, #00e5ff, #007acc)", color: "#000", border: "none", borderRadius: "8px", fontWeight: "900", cursor: "pointer" }}>
          Sepete Ekle
        </button>
      </div>

    </main>
  );
}