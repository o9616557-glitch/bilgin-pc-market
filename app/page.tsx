import clientPromise from "@/lib/mongodb";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  let urunler: any[] = [];
  try {
    const client = await clientPromise;
    const db = client.db("bilginpcmarket");
    urunler = await db.collection("products").find({}).toArray();
  } catch (e) { console.error("HATA:", e); }

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#09090b", color: "#ededed", padding: "40px 20px", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <header style={{ marginBottom: "50px", textAlign: "center" }}>
          <h1 style={{ fontSize: "3rem", fontWeight: "900", letterSpacing: "-1px", background: "linear-gradient(to right, #ffffff, #00e5ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0 }}>
            BİLGİN PC MARKET
          </h1>
          <p style={{ color: "#a1a1aa", marginTop: "10px", fontSize: "1.1rem", letterSpacing: "1px" }}>[ GELECEĞİN TEKNOLOJİSİ, BUGÜNÜN PERFORMANSI ]</p>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
          {urunler.length > 0 ? (
            urunler.map((urun: any) => {
              const vitrinResmi = urun.resimler && urun.resimler.length > 0 ? urun.resimler[0] : urun.resim;
              
              const normalFiyat = Number(urun.regular_price || urun.fiyat || urun.price || 0);
              const gecerliFiyat = Number(urun.indirimliFiyat || urun.price || urun.fiyat || 0);
              const indirimVarMi = normalFiyat > gecerliFiyat;
              const indirimOrani = indirimVarMi ? Math.round(((normalFiyat - gecerliFiyat) / normalFiyat) * 100) : 0;
              
              // ŞEFİM: İŞTE HAYAT KURTARAN FİLTRE! Boşlukları artık 0 saymayacak!
              const stokSifirMi = urun.stokAdedi === 0 || urun.stokAdedi === "0";
              const tukendiMi = urun.stokDurumu === "Tükendi" || stokSifirMi;
              
              const havaleOrani = urun.havaleIndirimi !== undefined ? urun.havaleIndirimi : 5;

              return (
                <Link href={`/product/${urun.slug || urun._id}`} key={urun._id.toString()} style={{ textDecoration: "none", color: "inherit", display: "block", height: "100%" }}>
                  <div style={{ background: "#121214", borderRadius: "20px", border: "1px solid #27272a", padding: "20px", display: "flex", flexDirection: "column", height: "100%", cursor: "pointer", transition: "all 0.3s ease", position: "relative", overflow: "hidden" }}>
                    
                    {indirimOrani > 0 && !tukendiMi && (
                      <div style={{ position: "absolute", top: "15px", left: "15px", background: "#f59e0b", color: "#000", padding: "4px 8px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: "900", zIndex: 10, boxShadow: "0 4px 10px rgba(245, 158, 11, 0.4)" }}>
                        %{indirimOrani} İNDİRİM
                      </div>
                    )}

                    {tukendiMi && (
                      <div style={{ position: "absolute", top: "15px", right: "15px", background: "#3f3f46", color: "#fff", padding: "4px 8px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: "900", zIndex: 10 }}>
                        TÜKENDİ
                      </div>
                    )}

                    <div style={{ width: "100%", height: "220px", backgroundColor: "#09090b", borderRadius: "14px", border: "1px solid #1f1f22", overflow: "hidden", marginBottom: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {vitrinResmi ? (
                        <img src={vitrinResmi} alt={urun.isim || urun.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", filter: tukendiMi ? "grayscale(100%) opacity(50%)" : "none", transition: "0.3s" }} />
                      ) : ( <div style={{ color: "#52525b", fontSize: "0.9rem", letterSpacing: "1px" }}>[ GÖRSEL YOK ]</div> )}
                    </div>

                    <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ color: "#00e5ff", fontSize: "0.7rem", fontWeight: "900", textTransform: "uppercase", letterSpacing: "1px" }}>{urun.kategori || "Donanım"}</span>
                        {havaleOrani > 0 && !tukendiMi && (
                          <span style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10b981", fontSize: "0.65rem", padding: "3px 6px", borderRadius: "4px", fontWeight: "900", border: "1px solid rgba(16, 185, 129, 0.2)", letterSpacing: "0.5px" }}>
                            💳 HAVALE %{havaleOrani}
                          </span>
                        )}
                      </div>

                      <h2 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#ffffff", margin: 0, lineHeight: "1.4", minHeight: "50px" }}>{urun.isim || urun.name}</h2>
                      
                      <div style={{ marginTop: "10px" }}>
                        {indirimVarMi ? (
                          <div style={{ display: "flex", flexDirection: "column" }}>
                            <span style={{ color: "#71717a", fontSize: "0.9rem", textDecoration: "line-through", fontWeight: "600" }}>{normalFiyat.toLocaleString("tr-TR")} TL</span>
                            <span style={{ fontSize: "1.6rem", fontWeight: "900", color: "#00e5ff", textShadow: "0 0 10px rgba(0, 229, 255, 0.4)" }}>{gecerliFiyat.toLocaleString("tr-TR")} TL</span>
                          </div>
                        ) : (
                          <div style={{ fontSize: "1.6rem", fontWeight: "900", color: "#ffffff", marginTop: "10px", textShadow: "0 0 10px rgba(255, 255, 255, 0.05)" }}>{gecerliFiyat.toLocaleString("tr-TR")} TL</div>
                        )}
                      </div>
                    </div>

                    <button style={{ width: "100%", padding: "14px", backgroundColor: tukendiMi ? "#27272a" : "#18181b", color: tukendiMi ? "#a1a1aa" : "#ffffff", border: `1px solid ${tukendiMi ? "#3f3f46" : "#27272a"}`, borderRadius: "10px", cursor: tukendiMi ? "not-allowed" : "pointer", fontWeight: "900", marginTop: "20px", textTransform: "uppercase", letterSpacing: "1px", transition: "0.2s" }}>
                      {tukendiMi ? "Stokta Yok" : "Detayları İncele →"}
                    </button>
                  </div>
                </Link>
              )
            })
          ) : ( <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "50px", color: "#a1a1aa" }}>Ürün bulunamadı.</div> )}
        </div>
      </div>
    </main>
  );
}