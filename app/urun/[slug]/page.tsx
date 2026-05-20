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

  // Ürün Bulunamazsa Çıkacak Sayfa
  if (!urun) {
    return (
      <main style={{ padding: "100px 20px", textAlign: "center", background: "#050505", color: "white", minHeight: "100vh" }}>
        <h1 style={{ fontSize: "3rem", marginBottom: "20px" }}>Sistemde Bulunamadı</h1>
        <Link href="/" style={{ color: "#00e5ff", textDecoration: "none", fontSize: "1.2rem" }}>&larr; Veritabanına Geri Dön</Link>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#09090b", color: "#ededed", padding: "40px 20px", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* Üst Kısım: Menü Yolu (Breadcrumb) */}
        <div style={{ marginBottom: "30px", fontSize: "0.9rem", color: "#a1a1aa", fontWeight: "500" }}>
          <Link href="/" style={{ color: "#00e5ff", textDecoration: "none" }}>&larr; Tüm Donanımlar</Link>
          <span style={{ margin: "0 10px" }}>/</span>
          <span style={{ color: "#fff" }}>{urun.kategori || "Üst Düzey Bileşenler"}</span>
        </div>

        {/* Ana Vitrin (Hero Section) */}
        <div style={{ display: "flex", gap: "50px", flexWrap: "wrap", marginBottom: "60px" }}>

          {/* Sol: Neon Parlamalı Resim Sahnesi */}
          <div style={{ flex: "1 1 500px", position: "relative" }}>
            <div style={{
              width: "100%",
              height: "500px",
              backgroundColor: "#121214",
              borderRadius: "24px",
              border: "1px solid #27272a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 60px rgba(0, 229, 255, 0.05)", 
              padding: "20px",
              position: "relative",
              overflow: "hidden"
            }}>
              {urun.resim ? (
                <img src={urun.resim} alt={urun.isim} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", filter: "drop-shadow(0px 20px 30px rgba(0,0,0,0.8))" }} />
              ) : (
                <div style={{ color: "#52525b", fontSize: "1.2rem", letterSpacing: "2px" }}>[ GÖRSEL_VERİSİ_BEKLENİYOR ]</div>
              )}
            </div>
          </div>

          {/* Sağ: Siberpunk Bilgi Paneli */}
          <div style={{ flex: "1 1 400px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            
            <h1 style={{ fontSize: "3rem", fontWeight: "900", lineHeight: "1.1", marginBottom: "16px", background: "linear-gradient(to right, #ffffff, #888)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {urun.isim}
            </h1>

            <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "30px" }}>
              <div style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10b981", padding: "6px 12px", borderRadius: "8px", fontWeight: "600", fontSize: "0.9rem", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                {urun.stok_durumu || "STOKTA VAR"}
              </div>
              <span style={{ color: "#a1a1aa", fontSize: "0.9rem" }}>Hızlı Gönderim</span>
            </div>

            <p style={{ fontSize: "3rem", fontWeight: "bold", color: "#00e5ff", marginBottom: "30px", textShadow: "0 0 20px rgba(0, 229, 255, 0.4)" }}>
              {urun.fiyat} TL
            </p>

            {/* Öne Çıkan Özellikler Paneli */}
            <div style={{ background: "#121214", border: "1px solid #27272a", borderRadius: "16px", padding: "20px", marginBottom: "30px" }}>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "12px", color: "#d4d4d8", fontSize: "1rem" }}>
                <li style={{ display: "flex", alignItems: "center", gap: "10px" }}><span style={{ color: "#00e5ff" }}>■</span> Üst Düzey Oyun ve Render Performansı</li>
                <li style={{ display: "flex", alignItems: "center", gap: "10px" }}><span style={{ color: "#00e5ff" }}>■</span> Gelişmiş Termal Soğutma Mimarisi</li>
                <li style={{ display: "flex", alignItems: "center", gap: "10px" }}><span style={{ color: "#00e5ff" }}>■</span> 2 Yıl Resmi Bilgin PC Garantisi</li>
              </ul>
            </div>

            {/* Aksiyon Butonu */}
            <button style={{
              width: "100%",
              padding: "20px",
              fontSize: "1.3rem",
              fontWeight: "900",
              background: "linear-gradient(45deg, #00e5ff, #007acc)",
              color: "#000",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              boxShadow: "0 10px 40px rgba(0, 229, 255, 0.3)",
              textTransform: "uppercase",
              letterSpacing: "2px"
            }}>
              Sisteme Ekle
            </button>
          </div>

        </div>

        {/* Alt Kısım: Performans ve Teknik Veriler */}
        <div style={{ borderTop: "1px solid #27272a", paddingTop: "40px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "40px" }}>
           
           {/* Açıklama Paneli */}
           <div style={{ background: "#121214", padding: "30px", borderRadius: "20px", border: "1px solid #27272a" }}>
              <h3 style={{ color: "#00e5ff", marginBottom: "20px", fontSize: "1.5rem", letterSpacing: "1px" }}>Teknik Mimari</h3>
              <p style={{ color: "#a1a1aa", lineHeight: "1.8", fontSize: "1.05rem" }}>
                {urun.aciklama || "Bu ürünün detaylı teknik analizi sistem tarafından veritabanından çekilecektir. Gelecek olan veriler bu alanda sergilenecek."}
              </p>
           </div>

           {/* FPS Simülasyon Paneli */}
           <div style={{ background: "#121214", padding: "30px", borderRadius: "20px", border: "1px solid #27272a" }}>
              <h3 style={{ color: "#00e5ff", marginBottom: "20px", fontSize: "1.5rem", letterSpacing: "1px" }}>Canlı FPS Testleri</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#09090b", padding: "20px", borderRadius: "12px", border: "1px solid #1f1f22" }}>
                   <span style={{ fontWeight: "600", fontSize: "1.1rem" }}>Cyberpunk 2077</span>
                   <span style={{ color: "#10b981", fontWeight: "900", fontSize: "1.2rem", textShadow: "0 0 10px rgba(16,185,129,0.4)" }}>120 FPS</span>
                 </div>
                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#09090b", padding: "20px", borderRadius: "12px", border: "1px solid #1f1f22" }}>
                   <span style={{ fontWeight: "600", fontSize: "1.1rem" }}>Valorant</span>
                   <span style={{ color: "#10b981", fontWeight: "900", fontSize: "1.2rem", textShadow: "0 0 10px rgba(16,185,129,0.4)" }}>450 FPS</span>
                 </div>
              </div>
           </div>

        </div>
      </div>
    </main>
  );
}