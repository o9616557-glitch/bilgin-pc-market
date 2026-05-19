import clientPromise from "@/lib/mongodb";

export default async function HomePage() {
  let urunler: any[] = [];
  
  try {
    const client = await clientPromise;
    const db = client.db("bilginpcmarket"); 
    urunler = await db.collection("products").find({}).toArray();
  } catch (e) {
    console.error("HATA:", e);
  }

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#f4f4f5", padding: "40px 20px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        <header style={{ marginBottom: "40px", textAlign: "center" }}>
          <h1 style={{ fontSize: "2.5rem", color: "#111827", fontWeight: "800" }}>Bilgin PC Market</h1>
        </header>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
          gap: "24px" 
        }}>
          {urunler.length > 0 ? (
            urunler.map((urun: any) => (
              <div key={urun._id.toString()} style={{ 
                background: "#ffffff",
                borderRadius: "16px",
                padding: "16px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                display: "flex",
                flexDirection: "column"
              }}>
                {/* Resim Alanı */}
                <div style={{ width: "100%", height: "200px", backgroundColor: "#f9fafb", borderRadius: "12px", overflow: "hidden", marginBottom: "16px" }}>
                  {urun.resim ? (
                    <img src={urun.resim} alt={urun.isim} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#ccc" }}>Görsel Yok</div>
                  )}
                </div>

                {/* İçerik */}
                <div style={{ flexGrow: 1 }}>
                  <h2 style={{ fontSize: "1.1rem", color: "#1f2937", marginBottom: "8px" }}>{urun.isim}</h2>
                  <p style={{ fontSize: "1.25rem", fontWeight: "700", color: "#000", marginBottom: "16px" }}>{urun.fiyat} TL</p>
                </div>

                <button style={{ 
                  width: "100%", 
                  padding: "12px", 
                  backgroundColor: "#000", 
                  color: "#fff", 
                  border: "none", 
                  borderRadius: "8px", 
                  cursor: "pointer"
                }}>
                  Sepete Ekle
                </button>
              </div>
            ))
          ) : (
            <p>Ürün bulunamadı.</p>
          )}
        </div>
      </div>
    </main>
  );
}