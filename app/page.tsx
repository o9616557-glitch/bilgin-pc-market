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
    <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px", fontFamily: "'Inter', sans-serif" }}>
      <header style={{ marginBottom: "50px", textAlign: "center" }}>
        <h1 style={{ fontSize: "2.5rem", color: "#1a1a1a" }}>Bilgin PC Market</h1>
        <p style={{ color: "#666" }}>En güncel donanımlar, en iyi fiyatlarla.</p>
      </header>

      {/* Modern Grid Tasarımı */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", 
        gap: "2rem" 
      }}>
        {urunler.length > 0 ? (
          urunler.map((urun: any) => (
            <div key={urun._id.toString()} style={{ 
              background: "#fff",
              border: "1px solid #eee", 
              padding: "20px", 
              borderRadius: "16px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
              transition: "transform 0.2s ease"
            }}>
              <h2 style={{ fontSize: "1.2rem", margin: "0 0 10px 0", color: "#333" }}>{urun.isim}</h2>
              <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#0070f3", margin: "10px 0" }}>{urun.fiyat} TL</p>
              <div style={{ padding: "5px 10px", background: "#f0f0f0", borderRadius: "8px", display: "inline-block", fontSize: "0.8rem" }}>
                {urun.stok_durumu}
              </div>
              <button style={{ 
                marginTop: "20px", 
                width: "100%", 
                padding: "12px", 
                background: "#0070f3", 
                color: "white", 
                border: "none", 
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600"
              }}>
                Sepete Ekle
              </button>
            </div>
          ))
        ) : (
          <p>Henüz ürün eklenmemiş. Lütfen veritabanını kontrol edin.</p>
        )}
      </div>
    </main>
  );
}