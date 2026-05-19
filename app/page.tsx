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
    <main style={{ minHeight: "100vh", backgroundColor: "#f9fafb", padding: "40px 20px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* Başlık Bölümü */}
        <header style={{ marginBottom: "40px" }}>
          <h1 style={{ fontSize: "2rem", color: "#111827", fontWeight: "800" }}>Bilgin PC Market</h1>
          <p style={{ color: "#6b7280", marginTop: "8px" }}>Stoktaki en iyi donanımlar</p>
        </header>

        {/* Modern Grid Yapısı */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
          gap: "24px" 
        }}>
          {urunler.length > 0 ? (
            urunler.map((urun: any) => (
              <div key={urun._id.toString()} style={{ 
                background: "#ffffff",
                border: "1px solid #e5e7eb", 
                borderRadius: "20px",
                padding: "24px",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}>
                <div>
                  <h2 style={{ fontSize: "1.1rem", color: "#1f2937", marginBottom: "12px", height: "48px", overflow: "hidden" }}>
                    {urun.isim}
                  </h2>
                  <div style={{ 
                    display: "inline-block", 
                    backgroundColor: "#dcfce7", 
                    color: "#166534", 
                    padding: "4px 12px", 
                    borderRadius: "20px", 
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    marginBottom: "16px"
                  }}>
                    {urun.stok_durumu}
                  </div>
                </div>

                <div>
                  <p style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginBottom: "20px" }}>
                    {urun.fiyat} TL
                  </p>
                  <button style={{ 
                    width: "100%", 
                    padding: "14px", 
                    backgroundColor: "#000000", 
                    color: "#ffffff", 
                    border: "none", 
                    borderRadius: "12px", 
                    fontSize: "1rem",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}>
                    Sepete Ekle
                  </button>
                </div>
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