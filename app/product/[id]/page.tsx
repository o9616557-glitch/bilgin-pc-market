// app/product/[id]/page.tsx

// @ts-ignore
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import dynamic from 'next/dynamic'; 
import ProductGallery from "./productgallery";

const FpsMotoru = dynamic(() => import("./fpsmotoru"), { 
  loading: () => <p className="text-slate-500 p-4 animate-pulse">Performans analizi yükleniyor...</p> 
});
const ProductCompare = dynamic(() => import("./productcompare"), { 
  loading: () => <p className="text-slate-500 p-4 animate-pulse">Kıyaslama motoru hazırlanıyor...</p> 
});

export const revalidate = 3600; 

const api = new (WooCommerceRestApi as any)({
  url: process.env.NEXT_PUBLIC_WC_URL || "",
  consumerKey: process.env.WC_CONSUMER_KEY || "",
  consumerSecret: process.env.WC_CONSUMER_SECRET || "",
  version: "wc/v3"
});

export async function generateStaticParams() {
  try {
    let allProducts: any[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore && page <= 4) {
      const res = await api.get('products', { per_page: 100, page: page, status: 'publish' });
      if (res.data.length === 0) {
        hasMore = false;
      } else {
        allProducts = [...allProducts, ...res.data];
        page++;
      }
    }
    return allProducts.map((product: any) => ({ id: product.id.toString() }));
  } catch (error) {
    return []; 
  }
}

const turkceSozluk: Record<string, string> = {
  "model": "Model", "grafik_motoru": "Grafik Motoru", "ai_performansi": "AI Performansı",
  "bus_standarti": "Veri Yolu Standartı", "opengl": "OpenGL", "bellek": "Bellek",
  "saat_hizi": "Saat Hızı", "cuda_cekirdegi": "CUDA Çekirdeği", "bellek_hizi": "Bellek Hızı",
  "bellek_arayuzu": "Bellek Arayüzü", "cozunurluk": "Çözünürlük", "boyutlar": "Boyutlar"
};

export default async function UrunDetay({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [wcRes, wpRes, allProductsRes] = await Promise.all([
    api.get(`products/${id}`).catch(() => ({ data: {} })),
    fetch(`${process.env.NEXT_PUBLIC_WC_URL}/wp-json/wp/v2/product/${id}`).then(res => res.json()).catch(() => ({})),
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
    <div className="bg-[#050810] min-h-screen pb-24 text-white font-sans text-left selection:bg-blue-500/30">
      
      {/* BÖLÜM 1: BAŞLIK (Genişlik max-w-5xl yapıldı) */}
      <div className="max-w-5xl mx-auto px-5 pt-8 pb-6">
        <span className="text-blue-500 text-[11px] font-black uppercase tracking-widest bg-blue-500/10 px-3 py-1.5 rounded-full">
          Performance Series
        </span>
        <h1 className="text-2xl md:text-4xl font-black text-white mt-4 leading-tight">{product.name}</h1>
        
        <div className="flex flex-wrap items-center gap-3 mt-3 text-sm">
          <div className="flex text-yellow-400 text-lg">★★★★★</div>
          <span className="text-slate-300 font-medium">5 üzerinden 5</span>
          <span className="text-blue-400 hover:text-blue-300 transition-colors cursor-pointer underline underline-offset-4 decoration-blue-500/30">
            Tüm Yorumları Görüntüle
          </span>
        </div>
      </div>

      {/* BÖLÜM 2: GALERİ */}
      <div className="max-w-5xl mx-auto px-5 mb-8">
        <ProductGallery images={product.images} productName={product.name} />
      </div>

      {/* BÖLÜM 3: GÜVEN ROZETLERİ */}
      <div className="max-w-4xl mx-auto px-5 mb-12">
        <div className="flex justify-center gap-6 md:gap-16 border-y border-slate-800/60 py-6">
          <div className="flex flex-col items-center text-center gap-3 group cursor-default">
            <div className="w-12 h-12 rounded-full border border-slate-700 bg-[#0b0f1a] flex items-center justify-center text-xl group-hover:border-blue-500 transition-colors">🚚</div>
            <span className="text-[11px] text-slate-400 font-semibold tracking-wide">HIZLI<br/>KARGO</span>
          </div>
          <div className="flex flex-col items-center text-center gap-3 group cursor-default">
            <div className="w-12 h-12 rounded-full border border-slate-700 bg-[#0b0f1a] flex items-center justify-center text-xl group-hover:border-blue-500 transition-colors">🛡️</div>
            <span className="text-[11px] text-slate-400 font-semibold tracking-wide">GÜVENLİ<br/>ALIŞVERİŞ</span>
          </div>
          <div className="flex flex-col items-center text-center gap-3 group cursor-default">
            <div className="w-12 h-12 rounded-full border border-slate-700 bg-[#0b0f1a] flex items-center justify-center text-xl group-hover:border-blue-500 transition-colors">💬</div>
            <span className="text-[11px] text-slate-400 font-semibold tracking-wide">MÜŞTERİ<br/>DESTEĞİ</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 space-y-8">
        
        {/* FİYAT VE SEPETE EKLE BUTONU */}
        <div className="bg-[#0b0f1a] p-6 md:p-8 rounded-[2rem] border border-slate-800/60 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div>
            <span className="text-slate-500 text-xs font-bold uppercase tracking-widest block mb-1">Peşin Fiyatına</span>
            <div className="text-4xl md:text-5xl font-black text-white">{product.price} <span className="text-blue-500 text-2xl md:text-3xl">TL</span></div>
          </div>
          <button className="w-full md:w-auto bg-green-500 hover:bg-green-400 text-[#050810] py-4 px-12 rounded-2xl font-black text-base md:text-lg uppercase tracking-widest shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] active:scale-95 transition-all">
            SEPETE EKLE
          </button>
        </div>

        {/* TEKNİK DETAYLAR */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(acf).map(([key, value]: any) => {
            if (!value || typeof value === 'object' || key.toLowerCase().includes('fps')) return null;
            return (
              <div key={key} className="bg-[#0b0f1a] p-5 rounded-2xl border border-slate-800/40 flex flex-col justify-center text-center">
                <span className="text-[10px] text-slate-500 font-bold uppercase mb-1 truncate" title={turkceSozluk[key.toLowerCase()] || key}>
                  {turkceSozluk[key.toLowerCase()] || key}
                </span>
                <span className="text-blue-400 font-bold text-xs md:text-sm break-words">{String(value)}</span>
              </div>
            );
          })}
        </div>

        {/* UZUN AÇIKLAMA */}
        <details className="group bg-[#0b0f1a] rounded-[2rem] border border-slate-800/60 overflow-hidden" open>
          <summary className="p-6 md:p-8 cursor-pointer list-none flex justify-between items-center select-none">
            <span className="text-white font-bold uppercase tracking-wider text-sm md:text-base">📄 Detaylı İnceleme</span>
            <span className="text-blue-500 group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div 
            className="p-6 md:p-8 pt-0 text-sm md:text-base text-slate-400 leading-relaxed
              [&>p]:mb-4 
              [&>h1]:text-xl [&>h1]:font-black [&>h1]:text-white [&>h1]:mb-4 [&>h1]:mt-6
              [&>h2]:text-lg [&>h2]:font-bold [&>h2]:text-blue-400 [&>h2]:mb-3 [&>h2]:mt-6
              [&>ul]:list-disc [&>ul]:ml-5 [&>ul]:mb-4 [&>ul>li]:mb-2
              [&>strong]:text-slate-200" 
            dangerouslySetInnerHTML={{ __html: uzunAciklama }} 
          />
        </details>

        {/* OYUN FPS MOTORU */}
        <div className="bg-[#0b0f1a] rounded-[2rem] border border-slate-800/60 p-6 md:p-8 shadow-xl">
           <h3 className="text-white font-bold text-sm md:text-base uppercase tracking-wider mb-6 flex items-center gap-2">
             <span className="text-green-500 text-xl">⚡</span> Oyun Performansı
           </h3>
           {acf && <FpsMotoru acf={acf} />}
        </div>

        {/* KIYASLAMA MOTORU */}
        <div className="bg-[#0b0f1a] rounded-[2rem] border border-slate-800/60 p-6 md:p-8 shadow-xl overflow-x-auto">
           <h3 className="text-white font-bold text-sm md:text-base uppercase tracking-wider mb-6 flex items-center gap-2">
             <span className="text-blue-500 text-xl">⚖️</span> Teknik Kıyaslama
           </h3>
           <ProductCompare currentProduct={{ name: product.name, acf }} productList={productList} />
        </div>

      </div>
    </div>
  );
}