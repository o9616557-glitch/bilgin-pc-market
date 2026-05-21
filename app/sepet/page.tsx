"use client";
import { useCart } from "../CartContext";
import Link from "next/link";

export default function SepetSayfasi() {
  const { sepet, sepettenSil, adetGuncelle } = useCart();

  // Toplam Fiyat Hesaplama
  const araToplam = sepet.reduce((toplam: number, urun: any) => toplam + (urun.fiyat * urun.adet), 0);
  const kargo = araToplam > 5000 ? 0 : 150; // 5000 TL üzeri kargo bedava
  const havaleIndirimi = (araToplam * 0.05);
  const genelToplam = araToplam + kargo;

  if (sepet.length === 0) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px", textAlign: "center" }}>
        <span style={{ fontSize: "5rem", marginBottom: "20px" }}>🛒</span>
        <h2 style={{ color: "#fff", fontSize: "2rem", fontWeight: "900", marginBottom: "10px" }}>Sepetin Bomboş Şef!</h2>
        <p style={{ color: "#a1a1aa", marginBottom: "30px" }}>Dükkanda seni bekleyen canavar gibi donanımlar var.</p>
        <Link href="/" style={{ background: "#00e5ff", color: "#000", padding: "15px 40px", borderRadius: "12px", fontWeight: "900", textDecoration: "none", textTransform: "uppercase" }}>Alışverişe Başla</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ color: "#fff", fontSize: "2.5rem", fontWeight: "900", marginBottom: "40px", borderLeft: "6px solid #00e5ff", paddingLeft: "20px" }}>
        SEPETİM <span style={{ color: "#00e5ff", fontSize: "1.2rem", fontWeight: "400" }}>({sepet.length} Ürün)</span>
      </h1>

      {/* ŞEFİM: HATALI OLAN lg: "row" KISMI BURADAN KALDIRILDI VE DÜZELTİLDİ */}
      <div style={{ display: "flex", flexDirection: "row", gap: "30px" }} className="sepet-konteynir">
        
        {/* SOL TARAF: ÜRÜN LİSTESİ */}
        <div style={{ flex: "2" }}>
          {sepet.map((urun: any, index: number) => (
            <div key={index} style={{ background: "#121214", border: "1px solid #27272a", borderRadius: "16px", padding: "20px", display: "flex", gap: "20px", alignItems: "center", marginBottom: "15px" }}>
              <img src={urun.resim} alt={urun.isim} style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "12px" }} />
              
              <div style={{ flex: "1" }}>
                <h3 style={{ color: "#fff", fontSize: "1.1rem", fontWeight: "700", marginBottom: "4px" }}>{urun.isim}</h3>
                <p style={{ color: "#00e5ff", fontSize: "0.85rem", fontWeight: "600", marginBottom: "10px" }}>{urun.varyasyon || "Standart Model"}</p>
                <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                  <div style={{ display: "flex", alignItems: "center", background: "#09090b", borderRadius: "8px", border: "1px solid #27272a" }}>
                    <button onClick={() => adetGuncelle(urun.id, urun.varyasyon, -1)} style={{ padding: "8px 12px", color: "#fff", border: "none", background: "none", cursor: "pointer" }}>-</button>
                    <span style={{ color: "#fff", fontWeight: "800", minWidth: "20px", textAlign: "center" }}>{urun.adet}</span>
                    <button onClick={() => adetGuncelle(urun.id, urun.varyasyon, 1)} style={{ padding: "8px 12px", color: "#fff", border: "none", background: "none", cursor: "pointer" }}>+</button>
                  </div>
                  <button onClick={() => sepettenSil(urun.id, urun.varyasyon)} style={{ color: "#ef4444", background: "none", border: "none", fontSize: "0.8rem", cursor: "pointer", fontWeight: "600" }}>Kaldır</button>
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ color: "#fff", fontSize: "1.2rem", fontWeight: "900" }}>{(urun.fiyat * urun.adet).toLocaleString()} TL</div>
                <div style={{ color: "#71717a", fontSize: "0.8rem" }}>{urun.fiyat.toLocaleString()} TL / adet</div>
              </div>
            </div>
          ))}
        </div>

        {/* SAĞ TARAF: SİPARİŞ ÖZETİ */}
        <div style={{ flex: "1" }}>
          <div style={{ background: "#121214", border: "1px solid #00e5ff", borderRadius: "20px", padding: "24px", position: "sticky", top: "100px" }}>
            <h2 style={{ color: "#fff", fontSize: "1.4rem", fontWeight: "800", marginBottom: "20px" }}>Sipariş Özeti</h2>
            
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", color: "#a1a1aa" }}>
              <span>Ara Toplam</span>
              <span style={{ color: "#fff" }}>{araToplam.toLocaleString()} TL</span>
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", color: "#a1a1aa" }}>
              <span>Kargo</span>
              <span style={{ color: kargo === 0 ? "#10b981" : "#fff" }}>{kargo === 0 ? "BEDAVA" : kargo + " TL"}</span>
            </div>

            <div style={{ background: "rgba(16, 185, 129, 0.1)", padding: "12px", borderRadius: "10px", margin: "20px 0", border: "1px dashed #10b981" }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#10b981", fontWeight: "700" }}>
                <span>Havale İndirimi (%5)</span>
                <span>-{havaleIndirimi.toLocaleString()} TL</span>
              </div>
            </div>

            <div style={{ borderTop: "1px solid #27272a", paddingTop: "20px", marginBottom: "30px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <span style={{ color: "#fff", fontWeight: "600" }}>TOPLAM</span>
                <span style={{ color: "#00e5ff", fontSize: "2rem", fontWeight: "900" }}>{genelToplam.toLocaleString()} TL</span>
              </div>
            </div>

            <button style={{ width: "100%", padding: "18px", background: "linear-gradient(45deg, #00e5ff, #007acc)", color: "#000", border: "none", borderRadius: "12px", fontWeight: "900", fontSize: "1.1rem", cursor: "pointer", textTransform: "uppercase", letterSpacing: "1px", boxShadow: "0 10px 20px rgba(0, 229, 255, 0.2)" }}>
              Alışverişi Tamamla
            </button>
            
            <p style={{ color: "#71717a", fontSize: "0.75rem", textAlign: "center", marginTop: "15px" }}>
              Güvenli ödeme altyapısı ile 256-bit koruma.
            </p>
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 992px) {
          .sepet-konteynir { flex-direction: column !important; }
        }
      `}} />
    </div>
  );
}