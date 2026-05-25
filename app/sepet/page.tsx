"use client";
import { useCart } from "../CartContext";
import Link from "next/link";

export default function SepetSayfasi() {
  const { sepet, sepettenSil, adetGuncelle } = useCart();

  const araToplam = sepet.reduce((toplam: number, urun: any) => toplam + (urun.fiyat * urun.adet), 0);
  const kargo = araToplam > 5000 ? 0 : 150; 
  const havaleIndirimi = (araToplam * 0.05);
  const genelToplam = araToplam + kargo;

  if (sepet.length === 0) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px", textAlign: "center" }}>
        <span style={{ fontSize: "5rem", marginBottom: "20px" }}>🛒</span>
        <h2 style={{ color: "#fff", fontSize: "2rem", fontWeight: "900", marginBottom: "10px" }}>Sepetiniz şu an boş</h2>
        <p style={{ color: "#a1a1aa", marginBottom: "30px" }}>İhtiyacınıza en uygun hazır bilgisayar modellerini veya sisteminizi güçlendirecek yüksek performanslı bilgisayar bileşenlerini inceleyerek alışverişe başlayabilirsiniz.</p>
        <Link href="/" style={{ background: "#00e5ff", color: "#000", padding: "15px 40px", borderRadius: "12px", fontWeight: "900", textDecoration: "none", textTransform: "uppercase" }}>Alışverişe Başla</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ color: "#fff", fontSize: "2rem", fontWeight: "900", marginBottom: "30px", borderLeft: "6px solid #00e5ff", paddingLeft: "15px", marginTop: "20px" }}>
        SEPETİM <span style={{ color: "#00e5ff", fontSize: "1.2rem", fontWeight: "400" }}>({sepet.length} Ürün)</span>
      </h1>

      <div style={{ display: "flex", flexDirection: "row", gap: "30px" }} className="sepet-konteynir">
        
        <div style={{ flex: "2" }}>
          {sepet.map((urun: any, index: number) => (
            <div key={index} style={{ background: "#121214", border: "1px solid #27272a", borderRadius: "16px", padding: "16px", display: "flex", gap: "15px", marginBottom: "15px" }}>
              <img src={urun.resim} alt={urun.isim} style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "12px", flexShrink: 0 }} />
              <div style={{ flex: "1", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px" }} className="urun-ust-kisim">
                  <div>
                    <h3 style={{ color: "#fff", fontSize: "1rem", fontWeight: "700", marginBottom: "4px", lineHeight: "1.3" }}>{urun.isim}</h3>
                    <p style={{ color: "#00e5ff", fontSize: "0.8rem", fontWeight: "600" }}>{urun.varyasyon || "Standart Model"}</p>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ color: "#fff", fontSize: "1.1rem", fontWeight: "900" }}>{(urun.fiyat * urun.adet).toLocaleString()} TL</div>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", background: "#09090b", borderRadius: "8px", border: "1px solid #27272a" }}>
                    <button onClick={() => adetGuncelle(urun.id, urun.varyasyon, -1)} style={{ padding: "6px 12px", color: "#fff", border: "none", background: "none", cursor: "pointer" }}>-</button>
                    <span style={{ color: "#fff", fontWeight: "800", minWidth: "24px", textAlign: "center" }}>{urun.adet}</span>
                    <button onClick={() => adetGuncelle(urun.id, urun.varyasyon, 1)} style={{ padding: "6px 12px", color: "#fff", border: "none", background: "none", cursor: "pointer" }}>+</button>
                  </div>
                  <button onClick={() => sepettenSil(urun.id, urun.varyasyon)} style={{ color: "#ef4444", background: "none", border: "none", fontSize: "0.85rem", cursor: "pointer", fontWeight: "700" }}>Kaldır</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ flex: "1" }}>
          <div style={{ background: "#121214", border: "1px solid #00e5ff", borderRadius: "20px", padding: "24px", position: "sticky", top: "100px" }}>
            <h2 style={{ color: "#fff", fontSize: "1.4rem", fontWeight: "800", marginBottom: "20px" }}>Sipariş Özeti</h2>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", color: "#a1a1aa" }}><span>Ara Toplam</span><span style={{ color: "#fff" }}>{araToplam.toLocaleString()} TL</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", color: "#a1a1aa" }}><span>Kargo</span><span style={{ color: kargo === 0 ? "#10b981" : "#fff" }}>{kargo === 0 ? "BEDAVA" : kargo + " TL"}</span></div>
            <div style={{ background: "rgba(16, 185, 129, 0.1)", padding: "12px", borderRadius: "10px", margin: "20px 0", border: "1px dashed #10b981" }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#10b981", fontWeight: "700", fontSize: "0.9rem" }}><span>Havale İndirimi (%5)</span><span>-{havaleIndirimi.toLocaleString()} TL</span></div>
            </div>
            <div style={{ borderTop: "1px solid #27272a", paddingTop: "20px", marginBottom: "30px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}><span style={{ color: "#fff", fontWeight: "600" }}>TOPLAM</span><span style={{ color: "#00e5ff", fontSize: "1.8rem", fontWeight: "900" }}>{genelToplam.toLocaleString()} TL</span></div>
            </div>

            {/* ŞEFİM: İŞTE BAĞLANTIYI BURADA KURDUK! */}
            <Link href="/odeme" style={{ textDecoration: "none" }}>
              <button style={{ width: "100%", padding: "18px", background: "linear-gradient(45deg, #00e5ff, #007acc)", color: "#000", border: "none", borderRadius: "12px", fontWeight: "900", fontSize: "1.1rem", cursor: "pointer", textTransform: "uppercase", letterSpacing: "1px", boxShadow: "0 10px 20px rgba(0, 229, 255, 0.2)" }}>
                Alışverişi Tamamla
              </button>
            </Link>

          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 992px) { .sepet-konteynir { flex-direction: column !important; } }
        @media (max-width: 480px) { .urun-ust-kisim { flex-direction: column !important; } .urun-ust-kisim > div:nth-child(2) { text-align: left !important; margin-top: 5px; } }
      `}} />
    </div>
  );
}