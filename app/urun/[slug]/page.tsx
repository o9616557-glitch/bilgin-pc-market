import clientPromise from "@/lib/mongodb";
import Link from "next/link";

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

  // Hesaplamalar
  const anaFiyat = Number(urun.fiyat) || 0;
  const havaleFiyati = (anaFiyat * 0.95).toFixed(0);

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#09090b", color: "#ededed", padding: "20px 20px 100px 20px", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: "1300px", margin: "0 auto" }}>

        {/* ÜST: Kategori ve Navigasyon (Suluk Devamı Yapısı) */}
        <div style={{ marginBottom: "24px", fontSize: "0.85rem", color: "#a1a1aa", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <Link href="/" style={{ color: "#00e5ff", textDecoration: "none" }}>Ana Sayfa</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#fff" }}>{urun.kategori || "Donanım"}</span>
          </div>
          <span style={{ color: "#52525b" }}>Kod: {urun._id.toString().substring(0, 8).toUpperCase()}</span>
        </div>

        {/* ANA BLOK: Sol Görsel - Sağ Detaylar */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "40px", marginBottom: "60px" }}>
          
          {/* SOL: Görsel Sahnesi ve Paylaş/Favori */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{
              width: "100%",
              height: "480px",
              backgroundColor: "#121214",
              borderRadius: "24px",
              border: "1px solid #27272a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
              position: "relative"
            }}>
              {/* İndirim Rozeti */}
              <div style={{ position: "absolute", top: "20px", left: "20px", backgroundColor: "#ef4444", color: "white", padding: "6px 14px", borderRadius: "30px", fontWeight: "800", fontSize: "0.85rem", boxShadow: "0 0 15px rgba(239,68,68,0.4)" }}>
                FİYATI DÜŞTÜ
              </div>
              
              {urun.resim ? (
                <img src={urun.resim} alt={urun.isim} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
              ) : (
                <div style={{ color: "#52525b" }}>[ GÖRSEL_YOK ]</div>
              )}
            </div>

            {/* Paylaş ve Favorilere Ekle Aksiyonları */}
            <div style={{ display: "flex", gap: "12px" }}>
              <button style={{ flex: 1, padding: "14px", background: "#18181b", border: "1px solid #27272a", borderRadius: "12px", color: "#a1a1aa", cursor: "pointer", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                <span>❤️</span> Favorilere Ekle
              </button>
              <button style={{ padding: "14px 20px", background: "#18181b", border: "1px solid #27272a", borderRadius: "12px", color: "#a1a1aa", cursor: "pointer" }}>
                🔗 Paylaş
              </button>
            </div>
          </div>

          {/* SAĞ: Bilgi ve Fiyat Matrisi */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {/* Yıldızlar ve Yorum Sayısı */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <span style={{ color: "#f59e0b", fontSize: "1.2rem" }}>★★★★★</span>
              <span style={{ color: "#00e5ff", fontSize: "0.85rem", fontWeight: "600" }}>(24 Değerlendirme)</span>
            </div>

            <h1 style={{ fontSize: "2.4rem", fontWeight: "900", color: "#ffffff", lineHeight: "1.2", marginBottom: "16px" }}>
              {urun.isim}
            </h1>

            {/* Rozetler ve Kargo Sayacı */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "24px" }}>
              <div style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10b981", padding: "6px 12px", borderRadius: "8px", fontWeight: "700", fontSize: "0.8rem", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                {urun.stok_durumu || "STOKTA VAR"}
              </div>
              <div style={{ background: "rgba(0, 229, 255, 0.1)", color: "#00e5ff", padding: "6px 12px", borderRadius: "8px", fontWeight: "700", fontSize: "0.8rem", border: "1px solid rgba(0, 229, 255, 0.2)" }}>
                HIZLI GÖNDERİM
              </div>
              <div style={{ width: "100%", background: "#18181b", padding: "12px", borderRadius: "12px", border: "1px solid #27272a", fontSize: "0.85rem", color: "#e4e4e7", marginTop: "10px" }}>
                🚚 <strong style={{ color: "#00e5ff" }}>Saat 16:00'ya kadar</strong> verilen siparişler bugün, sonrası yarın kargoda!
              </div>
            </div>

            {/* FİYAT ALANI MATRİSİ */}
            <div style={{ background: "#121214", border: "1px solid #27272a", borderRadius: "20px", padding: "24px", marginBottom: "24px" }}>
              <div style={{ marginBottom: "16px" }}>
                <span style={{ fontSize: "0.9rem", color: "#a1a1aa", display: "block" }}>Kredi Kartı Tek Çekim</span>
                <div style={{ fontSize: "2.5rem", fontWeight: "900", color: "#ffffff" }}>{anaFiyat.toLocaleString()} TL</div>
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", borderTop: "1px solid #27272a", paddingTop: "16px" }}>
                <div>
                  <span style={{ fontSize: "0.8rem", color: "#10b981", fontWeight: "700" }}>%5 Havale İndirimi</span>
                  <div style={{ fontSize: "1.3rem", fontWeight: "800", color: "#10b981" }}>{Number(havaleFiyati).toLocaleString()} TL</div>
                </div>
                <div>
                  <span style={{ fontSize: "0.8rem", color: "#a1a1aa" }}>9 - 12 Taksit Seçenekleri</span>
                  <div style={{ fontSize: "1.1rem", fontWeight: "700", color: "#00e5ff", marginTop: "4px" }}>Vade Farksız Fırsat</div>
                </div>
              </div>
            </div>

            {/* Masaüstü Sepet Butonu */}
            <button style={{
              width: "100%",
              padding: "18px",
              fontSize: "1.2rem",
              fontWeight: "900",
              background: "linear-gradient(45deg, #00e5ff, #007acc)",
              color: "#000",
              border: "none",
              borderRadius: "14px",
              cursor: "pointer",
              boxShadow: "0 10px 30px rgba(0, 229, 255, 0.2)",
              textTransform: "uppercase",
              letterSpacing: "1px"
            }}>
              Sepete Ekle
            </button>
          </div>
        </div>

        {/* ALT KISIM: Razer/Monster Tarzı Tıklanabilir Yapılandırılmış Bölümler */}
        <div style={{ display: "flex", flexDirection: "column", gap: "32px", marginTop: "80px" }}>
          
          {/* 1. Ürün Açıklaması */}
          <section style={{ background: "#121214", border: "1px solid #27272a", borderRadius: "20px", padding: "32px" }}>
            <h3 style={{ color: "#00e5ff", fontSize: "1.4rem", fontWeight: "800", marginBottom: "16px" }}>⚙️ Ürün Açıklaması</h3>
            <p style={{ color: "#d4d4d8", lineHeight: "1.8" }}>{urun.aciklama || "Bu canavar donanım, en yüksek ayarlarda akıcı bir deneyim sunmak için özel olarak optimize edildi. Bilgin PC Market güvencesiyle kutusunda hazır."}</p>
          </section>

          {/* 2. Teknik Bilgiler */}
          <section style={{ background: "#121214", border: "1px solid #27272a", borderRadius: "20px", padding: "32px" }}>
            <h3 style={{ color: "#00e5ff", fontSize: "1.4rem", fontWeight: "800", marginBottom: "20px" }}>📊 Teknik Bilgiler</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
              <div style={{ background: "#09090b", padding: "16px", borderRadius: "12px", border: "1px solid #1f1f22" }}>
                <span style={{ color: "#71717a", fontSize: "0.85rem" }}>Kategori</span>
                <div style={{ fontWeight: "700", marginTop: "4px" }}>{urun.kategori || "Üst Segment"}</div>
              </div>
              <div style={{ background: "#09090b", padding: "16px", borderRadius: "12px", border: "1px solid #1f1f22" }}>
                <span style={{ color: "#71717a", fontSize: "0.85rem" }}>Garanti</span>
                <div style={{ fontWeight: "700", marginTop: "4px" }}>2 Yıl Distribütör</div>
              </div>
              <div style={{ background: "#09090b", padding: "16px", borderRadius: "12px", border: "1px solid #1f1f22" }}>
                <span style={{ color: "#71717a", fontSize: "0.85rem" }}>Durum</span>
                <div style={{ fontWeight: "700", marginTop: "4px" }}>Sıfır, Orijinal Kutu</div>
              </div>
            </div>
          </section>

          {/* 3. Oyun Performans Testi */}
          <section style={{ background: "#121214", border: "1px solid #27272a", borderRadius: "20px", padding: "32px" }}>
            <h3 style={{ color: "#00e5ff", fontSize: "1.4rem", fontWeight: "800", marginBottom: "20px" }}>🎮 Oyun Performans Testleri (4K / Ultra)</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "0.95rem" }}>
                  <span>Cyberpunk 2077 (DLSS On)</span>
                  <span style={{ color: "#10b981", fontWeight: "900" }}>145 FPS</span>
                </div>
                <div style={{ width: "100%", height: "8px", background: "#18181b", borderRadius: "4px" }}><div style={{ width: "85%", height: "100%", background: "#10b981", borderRadius: "4px" }}></div></div>
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "0.95rem" }}>
                  <span>Valorant</span>
                  <span style={{ color: "#10b981", fontWeight: "900" }}>520 FPS</span>
                </div>
                <div style={{ width: "100%", height: "8px", background: "#18181b", borderRadius: "4px" }}><div style={{ width: "98%", height: "100%", background: "#10b981", borderRadius: "4px" }}></div></div>
              </div>
            </div>
          </section>

          {/* 4. Ürün Karşılaştırma */}
          <section style={{ background: "#121214", border: "1px solid #27272a", borderRadius: "20px", padding: "32px" }}>
            <h3 style={{ color: "#00e5ff", fontSize: "1.4rem", fontWeight: "800", marginBottom: "16px" }}>⚔️ Donanım Karşılaştırma</h3>
            <p style={{ color: "#a1a1aa", fontSize: "0.95rem" }}>Bu bileşen, bir önceki nesle kıyasla <strong style={{ color: "#fff" }}>%38 daha az güç tüketirken</strong>, saf performans kasında <strong style={{ color: "#10b981" }}>%42 artış</strong> sağlamaktadır.</p>
          </section>

          {/* 5. Topluluk, Yorumlar ve Değerlendirmeler */}
          <section style={{ background: "#121214", border: "1px solid #27272a", borderRadius: "20px", padding: "32px" }}>
            <h3 style={{ color: "#00e5ff", fontSize: "1.4rem", fontWeight: "800", marginBottom: "20px" }}>👥 Topluluk ve Değerlendirmeler</h3>
            <div style={{ borderBottom: "1px solid #27272a", paddingBottom: "16px", marginBottom: "16px" }}>
              <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "6px" }}>
                <span style={{ fontWeight: "700" }}>Özkan B.</span>
                <span style={{ color: "#f59e0b", fontSize: "0.85rem" }}>★★★★★</span>
              </div>
              <p style={{ color: "#a1a1aa", fontSize: "0.95rem", margin: 0 }}>Paketleme kusursuzdu, saat 15:30'da aldım akşamına kargoya verildi. Performans akıl almaz.</p>
            </div>
          </section>

          {/* 6. Soru & Cevap */}
          <section style={{ background: "#121214", border: "1px solid #27272a", borderRadius: "20px", padding: "32px" }}>
            <h3 style={{ color: "#00e5ff", fontSize: "1.4rem", fontWeight: "800", marginBottom: "20px" }}>❓ Soru & Cevap</h3>
            <div style={{ background: "#09090b", padding: "16px", borderRadius: "12px", border: "1px solid #27272a" }}>
              <p style={{ margin: "0 0 8px 0", fontWeight: "700" }}>Soru: Güç kaynağı kaç watt olmalı?</p>
              <p style={{ margin: 0, color: "#a1a1aa", fontSize: "0.95rem" }}><strong style={{ color: "#00e5ff" }}>Bilgin PC Yanıtı:</strong> En az 650W kaliteli bir PSU kullanmanızı öneririz.</p>
            </div>
          </section>

        </div>
      </div>

      {/* TELEFONLAR İÇİN: Altta Sabitlenen (Sticky) Fiyat ve Sepet Paneli */}
      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(18, 18, 20, 0.95)",
        backdropFilter: "blur(10px)",
        borderTop: "1px solid #27272a",
        padding: "16px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 9999,
        boxShadow: "0 -10px 30px rgba(0,0,0,0.5)"
      }}>
        <div>
          <span style={{ fontSize: "0.75rem", color: "#a1a1aa", display: "block" }}>Toplam Tutar</span>
          <span style={{ fontSize: "1.4rem", fontWeight: "900", color: "#00e5ff" }}>{anaFiyat.toLocaleString()} TL</span>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button style={{ padding: "14px", background: "#27272a", border: "none", borderRadius: "10px", color: "white", cursor: "pointer" }}>
            ❤️
          </button>
          <button style={{
            padding: "14px 28px",
            background: "linear-gradient(45deg, #00e5ff, #007acc)",
            color: "#000",
            border: "none",
            borderRadius: "10px",
            fontWeight: "900",
            cursor: "pointer",
            textTransform: "uppercase",
            fontSize: "0.9rem"
          }}>
            Sepete Ekle
          </button>
        </div>
      </div>

    </main>
  );
}