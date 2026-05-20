import clientPromise from "@/lib/mongodb";
import Link from "next/link";

export default async function HomePage() {
  let urunler: any[] = [];
  
  try {
    const client = await clientPromise;
    const db = client.db("bilginpcmarket"); 
    
    // ŞEFİM: Orijinal adına (products) geri döndük!
    urunler = await db.collection("products").find({}).toArray();
  } catch (e) {
    console.error("HATA:", e);
  }

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#09090b", color: "#ededed", padding: "40px 20px", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        <header style={{ marginBottom: "50px", textAlign: "center" }}>
          <h1 style={{ fontSize: "3rem", fontWeight: "900", letterSpacing: "-1px", background: "linear-gradient(to right, #ffffff, #00e5ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0 }}>
            BILGIN PC MARKET
          </h1>
          <p style={{ color: "#a1a1aa", marginTop: "10px", fontSize: "1.1rem", letterSpacing: "1px" }}>
            [ GELECEĞİN TEKNOLOJİSİ, BUGÜNÜN PERFORMANSI ]
          </p>
        </header>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
          gap: "24px" 
        }}>
          {urunler.length > 0 ? (
            urunler.map((urun: any) => {
              
              const vitrinResmi = urun.resimler && urun.resimler.length > 0 ? urun.resimler[0] : urun.resim;
              const anaFiyat = Number(urun.fiyat) || 0;

              return (
                <Link 
                  href={`/urun/${urun.slug || ""}`} 
                  key={urun._id.toString()} 
                  style={{ textDecoration: "none", color: "inherit", display: "block", height: "100%" }}
                >
                  <div style={{ 
                    background: "#121214",
                    borderRadius: "20px",
                    border: "1px solid #27272a",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.4)"
                  }}>
                    
                    <div style={{ width: "100%", height: "220px", backgroundColor: "#09090b", borderRadius: "14px", border: "1px solid #1f1f22", overflow: "hidden", marginBottom: "16px", display: "flex", alignItems: "center", justifyContent: "center", padding: "10px" }}>
                      {vitrinResmi ? (
                        <img src={vitrinResmi} alt={urun.isim} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                      ) : (
                        <div style={{ color: "#52525b", fontSize: "0.9rem", letterSpacing: "1px" }}>[ GÖRSEL_YOK ]</div>
                      )}
                    </div>

                    <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                      <span style={{ color: "#00e5ff", fontSize: "0.8rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>
                        {urun.kategori || "Donanım"}
                      </span>
                      <h2 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#ffffff", margin: 0, lineHeight: "1.4", minHeight: "50px" }}>
                        {urun.isim}
                      </h2>
                      <div style={{ fontSize: "1.6rem", fontWeight: "900", color: "#ffffff", marginTop: "10px", textShadow: "0 0 10px rgba(255,255,255,0.05)" }}>
                        {anaFiyat.toLocaleString()} TL
                      </div>
                    </div>

                    <button style={{ 
                      width: "100%", 
                      padding: "14px", 
                      backgroundColor: "#18181b", 
                      color: "#00e5ff", 
                      border: "1px solid #27272a", 
                      borderRadius: "10px", 
                      cursor: "pointer",
                      fontWeight: "800",
                      marginTop: "20px",
                      textTransform: "uppercase",
                      letterSpacing: "1px"
                    }}>
                      Detayları İncele &rarr;
                    </button>
                  </div>
                </Link>
              );
            })
          ) : (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px", color: "#71717a" }}>
              <p style={{ fontSize: "1.2rem", margin: "0 0 10px 0" }}>Veritabanında sergilenecek ürün bulunamadı.</p>
              <p style={{ fontSize: "0.9rem", margin: 0 }}>MongoDB Atlas panelinden ürün eklemeyi unutmayın şef.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}