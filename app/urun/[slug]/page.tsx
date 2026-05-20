import clientPromise from "@/lib/mongodb";
import Link from "next/link";
import EtkilesimliButonlar from "./EtkilesimliButonlar";
import UrunGorselGalerisi from "./UrunGorselGalerisi";
import VaryasyonluSepet from "./VaryasyonluSepet"; // YENİ AKILLI SİSTEMİMİZİ İÇERİ ALDIK!

export const revalidate = 60; // 60 saniyede bir güncellenir, süper hızlı açılır.

export default async function UrunDetaySayfasi({ params }: { params: any }) {
  const resolvedParams = await params;
  const rawSlug = resolvedParams.slug || "";
  const slug = decodeURIComponent(rawSlug).trim();

  let urun = null;

  try {
    const client = await clientPromise;
    const db = client.db("bilginpcmarket");
    urun = await db.collection("products").findOne({
      slug: { $regex: new RegExp(`^\\s*${slug}\\s*$`, "i") }
    });
  } catch (e) {
    console.error("HATA:", e);
  }

  if (!urun) {
    return (
      <main style={{ padding: "100px 20px", textAlign: "center", background: "#09090b", color: "white", minHeight: "100vh" }}>
        <h1 style={{ fontSize: "3rem", marginBottom: "20px" }}>Bileşen Bulunamadı</h1>
        <p style={{ color: "#a1a1aa", marginBottom: "30px" }}>Aranan Adres: "{slug}"</p>
        <Link href="/" style={{ color: "#00e5ff", textDecoration: "none", fontSize: "1.2rem" }}>&larr; Ana Sayfaya Dön</Link>
      </main>
    );
  }

  let resimListesi: string[] = [];
  if (urun.resimler && Array.isArray(urun.resimler)) {
    resimListesi = urun.resimler;
  } else if (urun.resim) {
    resimListesi = [urun.resim];
  }

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#09090b", color: "#ededed", padding: "20px", fontFamily: "'Inter', sans-serif" }}>
      
      <style dangerouslySetInnerHTML={{__html: `
        .urun-baslik { font-size: 2.2rem; font-weight: 900; color: #ffffff; line-height: 1.2; margin-bottom: 16px; }
        .mobil-alt-bar { display: none !important; }
        @media (max-width: 768px) {
          .urun-baslik { font-size: 1.35rem !important; margin-bottom: 12px; } 
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
          <span style={{ color: "#52525b" }}>Kod: {urun._id ? urun._id.toString().substring(0, 8).toUpperCase() : "BİLİNMEYEN"}</span>
        </div>

        <div className="urun-ana-blok" style={{ display: "flex", gap: "30px", marginBottom: "40px" }}>
          
          <div style={{ flex: "1 1 50%", display: "flex", flexDirection: "column", gap: "16px", minWidth: 0 }}>
            <UrunGorselGalerisi resimler={resimListesi} />
            <EtkilesimliButonlar />
          </div>

          <div style={{ flex: "1 1 50%", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <span style={{ color: "#f59e0b", fontSize: "1.2rem" }}>★★★★★</span>
              <span style={{ color: "#00e5ff", fontSize: "0.85rem", fontWeight: "600" }}>({urun.degerlendirme_sayisi || 0} Değerlendirme)</span>
            </div>

            <h1 className="urun-baslik">{urun.isim}</h1>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "16px" }}>
              <div style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10b981", padding: "6px 12px", borderRadius: "8px", fontWeight: "700", fontSize: "0.8rem", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                {urun.stok_durumu || "STOKTA VAR"}
              </div>
              <div style={{ background: "rgba(0, 229, 255, 0.1)", color: "#00e5ff", padding: "6px 12px", borderRadius: "8px", fontWeight: "700", fontSize: "0.8rem", border: "1px solid rgba(0, 229, 255, 0.2)" }}>
                HIZLI GÖNDERİM
              </div>
            </div>

            {/* ŞEFİM: ESKİ STATİK FİYAT KODUNU SİLDİK, YERİNE YENİ AKILLI VARYASYON DOSYAMIZI KOYDUK */}
            <VaryasyonluSepet urun={urun} />

          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px", paddingBottom: "80px" }}>
          <section style={{ background: "#121214", border: "1px solid #27272a", borderRadius: "16px", padding: "24px" }}>
            <h3 style={{ color: "#00e5ff", fontSize: "1.2rem", fontWeight: "800", marginBottom: "12px" }}>⚙️ Ürün Açıklaması</h3>
            <p style={{ color: "#d4d4d8", lineHeight: "1.6", fontSize: "0.95rem" }}>
              {urun.aciklama || "Bu ürünün detaylı açıklaması yakında eklenecektir."}
            </p>
          </section>

          <section style={{ background: "#121214", border: "1px solid #27272a", borderRadius: "16px", padding: "24px" }}>
            <h3 style={{ color: "#00e5ff", fontSize: "1.2rem", fontWeight: "800", marginBottom: "16px" }}>📊 Teknik Bilgiler</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
              <div style={{ background: "#09090b", padding: "12px", borderRadius: "10px", border: "1px solid #1f1f22" }}>
                <span style={{ color: "#71717a", fontSize: "0.8rem" }}>Kategori</span>
                <div style={{ fontWeight: "700", marginTop: "2px", fontSize: "0.9rem" }}>{urun.kategori || "Bileşen"}</div>
              </div>
              <div style={{ background: "#09090b", padding: "12px", borderRadius: "10px", border: "1px solid #1f1f22" }}>
                <span style={{ color: "#71717a", fontSize: "0.8rem" }}>Garanti</span>
                <div style={{ fontWeight: "700", marginTop: "2px", fontSize: "0.9rem" }}>{urun.garanti || "2 Yıl Distribütör"}</div>
              </div>
              <div style={{ background: "#09090b", padding: "12px", borderRadius: "10px", border: "1px solid #1f1f22" }}>
                <span style={{ color: "#71717a", fontSize: "0.8rem" }}>Durum</span>
                <div style={{ fontWeight: "700", marginTop: "2px", fontSize: "0.9rem" }}>{urun.durum || "Sıfır, Kapalı Kutu"}</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}