// app/product/[id]/page.tsx

// @ts-ignore
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import dynamic from 'next/dynamic'; 
import ProductGallery from "./productgallery";

// Ağır bileşenleri sayfa açılışını yavaşlatmamak için sonradan yüklüyoruz
const FpsMotoru = dynamic(() => import("./fpsmotoru"), { 
  loading: () => <p className="text-slate-500 p-4">Performans analizi yükleniyor...</p> 
});
const ProductCompare = dynamic(() => import("./productcompare"), { 
  loading: () => <p className="text-slate-500 p-4">Kıyaslama motoru hazırlanıyor...</p> 
});

// Sayfanın arkada 1 saatte bir kendini sessizce güncellemesini sağlar
export const revalidate = 3600; 

// WooCommerce Bağlantı Ayarları
const api = new (WooCommerceRestApi as any)({
  url: process.env.NEXT_PUBLIC_WC_URL || "",
  consumerKey: process.env.WC_CONSUMER_KEY || "",
  consumerSecret: process.env.WC_CONSUMER_SECRET || "",
  version: "wc/v3"
});

// =================================================================
// EĞİTİM BÖLÜMÜ: TÜM ÜRÜNLERİ ÖNCEDEN İNŞA ETME (IŞIK HIZI MOTORU)
// Eskiden sadece 100 ürün çekiyorduk. Şimdi bir "While" döngüsü ile 
// sayfaları 100'er 100'er dolaşıp tüm ürünleri önceden hazırlıyoruz.
// =================================================================
export async function generateStaticParams() {
  try {
    let allProducts: any[] = [];
    let page = 1;
    let hasMore = true;

    // Vercel çökmesin diye verileri 100'erli paketler halinde (Maksimum 4 sayfa = 400 ürün) çekiyoruz
    while (hasMore && page <= 4) {
      const res = await api.get('products', { per_page: 100, page: page, status: 'publish' });
      
      // Eğer çekilen sayfada ürün kalmadıysa döngüyü bitir
      if (res.data.length === 0) {
        hasMore = false;
      } else {
        // Gelen ürünleri ana listemize ekle ve bir sonraki sayfaya geç
        allProducts = [...allProducts, ...res.data];
        page++;
      }
    }

    return allProducts.map((product: any) => ({
      id: product.id.toString(),
    }));
  } catch (error) {
    return []; 
  }
}

// Özellik isimlerini Türkçeleştirme sözlüğü
const turkceSozluk: Record<string, string> = {
  "model": "Model", "grafik_motoru": "Grafik Motoru", "ai_performansi": "AI Performansı",
  "bus_standarti": "Veri Yolu Standartı", "opengl": "OpenGL", "bellek": "Bellek",
  "saat_hizi": "Saat Hızı", "cuda_cekirdegi": "CUDA Çekirdeği", "bellek_hizi": "Bellek Hızı",
  "bellek_arayuzu": "Bellek Arayüzü", "cozunurluk": "Çözünürlük", "boyutlar": "Boyutlar"
};

export default async function UrunDetay({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Verileri çekiyoruz
  const [wcRes, wpRes, allProductsRes] = await Promise.all([
    api.get(`products/${id}`).catch(() => ({ data: {} })),
    fetch(`${process.env.NEXT_PUBLIC_WC_URL}/wp-json/wp/v2/product/${id}`).then(res => res.json()).catch(() => ({})),
    // Alttaki listede sadece ilk 50 ürünü göstermek sayfa hızı için yeterlidir (Canlı arama motorumuz zaten tüm ürünleri bulabiliyor)
    api.get('products', { per_page: 50, status: 'publish' }).catch(() => ({ data: [] }))
  ]);

  const product = wcRes.data;
  const acf = product.acf || wpRes.acf || {};
  const uzunAciklama = product.description || "<p>Teknik detaylar bulunamadı.</p>";

  const productList = allProductsRes.data
    .map((p: any) => ({ id: p.id, name: p.name }))
    .filter((p: any) => p.id.toString() !== id.toString());

  if (!product.id) return <div className="text-white p-10">Ürün bulunamadı...</div>;

  return (
    <div className="bg-[#0b1120] min-h-screen p-4 md:p-10 text-white font-sans text-left">
      <div className="max-w-5xl mx-auto space-y-4">
        
        {/* ANA ÜRÜN KARTI */}
        <div className="bg-[#111827] rounded-[25px] border border-slate-800/50 grid grid-cols-1 lg:grid-cols-2 overflow-hidden shadow-2xl">
          <div className="p-4 md:p-10 bg-[#0b0f1a] flex items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-800/50">
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          <div className="p-6 md:p-10 space-y-6 flex flex-col justify-center min-w-0">
            <div>
              <span className="text-blue-500 text-[10px] font-black uppercase">Performance Series</span>
              <h1 className="text-xl md:text-3xl font-bold text-white capitalize break-words">{product.name}</h1>
              <div className="text-2xl font-black text-blue-500 mt-2">{product.price} TL</div>
            </div>

            {/* TEKNİK DETAYLAR */}
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(acf).map(([key, value]: any) => {
                if (!value || typeof value === 'object' || key.toLowerCase().includes('fps')) return null;
                return (
                  <div key={key} className="bg-[#0b0f1a] p-3 rounded-lg border border-slate-800/50 flex flex-col justify-center min-w-0">
                    <span className="text-[10px] text-slate-400 block uppercase mb-1 truncate" title={turkceSozluk[key.toLowerCase()] || key}>
                      {turkceSozluk[key.toLowerCase()] || key}
                    </span>
                    <span className="text-blue-400 font-bold text-xs block break-words">
                      {String(value)}
                    </span>
                  </div>
                );
              })}
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-black text-lg shadow-lg active:scale-95 transition-all">
              SİSTEME DAHİL ET
            </button>
          </div>
        </div>

        {/* DETAYLAR BÖLÜMÜ */}
        <details className="group bg-[#111827] rounded-[20px] border border-slate-800/50 overflow-hidden shadow-xl" open>
          <summary className="p-4 md:p-5 cursor-pointer list-none hover:bg-white/5 flex justify-between items-center select-none">
            <span className="text-blue-500 font-black uppercase tracking-wider">📄 Cihaz Detayları</span>
            <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div 
            className="p-4 md:p-8 pt-0 border-t border-slate-800/30 text-xs md:text-sm text-slate-300 break-words leading-relaxed
              [&>p]:mb-4 
              [&>h1]:text-2xl [&>h1]:font-black [&>h1]:text-white [&>h1]:mb-4 [&>h1]:mt-6
              [&>h2]:text-lg [&>h2]:font-bold [&>h2]:text-blue-400 [&>h2]:mb-3 [&>h2]:mt-6
              [&>h3]:text-base [&>h3]:font-bold [&>h3]:text-slate-200 [&>h3]:mb-2 [&>h3]:mt-4
              [&>ul]:list-disc [&>ul]:ml-5 [&>ul]:mb-4 [&>ul>li]:mb-1 [&>ul>li]:pl-1
              [&>ol]:list-decimal [&>ol]:ml-5 [&>ol]:mb-4 [&>ol>li]:mb-1
              [&>strong]:text-white [&>strong]:font-bold" 
            dangerouslySetInnerHTML={{ __html: uzunAciklama }} 
          />
        </details>

        {/* FPS MOTORU */}
        <div className="bg-[#111827] rounded-[20px] border border-slate-800/50 p-4 md:p-8 shadow-xl">
           <h3 className="text-green-500 font-black mb-4 uppercase tracking-wider flex items-center gap-2">
             <span>⚡</span> Performans Analizi
           </h3>
           {acf && <FpsMotoru acf={acf} />}
        </div>

        {/* KIYASLAMA MOTORU */}
        <div className="bg-[#111827] rounded-[20px] border border-slate-800/50 p-4 md:p-8 shadow-xl overflow-x-auto">
           <h3 className="text-slate-400 font-black mb-4 uppercase tracking-wider flex items-center gap-2">
             <span>⚖️</span> Teknik Kıyaslama
           </h3>
           <ProductCompare currentProduct={{ name: product.name, acf }} productList={productList} />
        </div>

      </div>
    </div>
  );
}