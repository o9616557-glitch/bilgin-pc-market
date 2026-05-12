import React from 'react';
import Link from 'next/link';
// @ts-ignore
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

export const revalidate = 3600; 

const api = new (WooCommerceRestApi as any)({
  url: process.env.NEXT_PUBLIC_WC_URL || "",
  consumerKey: process.env.WC_CONSUMER_KEY || "",
  consumerSecret: process.env.WC_CONSUMER_SECRET || "",
  version: "wc/v3"
});

export default async function HomePage() {
  const res = await api.get('products', { per_page: 20, status: 'publish' }).catch(() => ({ data: [] }));
  const urunler = res.data.map((item: any) => ({
    id: item.id,
    ad: item.name,
    fiyat: item.price ? Number(item.price).toLocaleString('tr-TR') + " TL" : "Fiyat Sorunuz",
    resim: item.images?.[0]?.src || "https://via.placeholder.com/300?text=Bilgin+PC",
    ozellik: item.short_description ? item.short_description.replace(/(<([^>]+)>)/gi, "").substring(0, 60) + "..." : "Sistem özellikleri için tıklayın."
  }));

  const kurumsalLinkler = [
    { title: "Hakkımızda", path: "/hakkimizda", icon: "📄" },
    { title: "Gizlilik Politikası", path: "/gizlilik-politikasi", icon: "🔒" },
    { title: "Mesafeli Satış", path: "/mesafeli-satis", icon: "📜" },
    { title: "İade Şartları", path: "/iade-sartlari", icon: "📦" },
    { title: "Garanti Şartları", path: "/garanti-sartlari", icon: "🛡️" },
    { title: "İletişim", path: "/iletisim", icon: "📞" }
  ];

  return (
    <div className="bg-[#0b1120] min-h-screen text-white font-sans selection:bg-blue-500/30 flex flex-col">
      <nav className="flex items-center justify-between px-6 md:px-10 py-4 border-b border-white/5 sticky top-0 bg-[#0b1120]/90 backdrop-blur-xl z-50">
        <div className="flex items-center gap-4 md:gap-8">
          <span className="text-lg md:text-xl font-black tracking-tighter uppercase italic">
            BİLGİN <span className="text-blue-600 underline decoration-2 underline-offset-4">PC MARKET</span>
          </span>
        </div>
        <button className="bg-white/5 border border-white/10 px-6 py-2 rounded-full text-[10px] font-black uppercase hover:bg-blue-600 transition-all">GİRİŞ YAP</button>
      </nav>

      <main className="flex-grow">
        <section className="relative px-6 py-10 md:py-24 max-w-[1300px] mx-auto overflow-hidden text-center lg:text-left">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="z-10 space-y-6">
              <h1 className="text-4xl md:text-7xl font-black leading-[1.1] tracking-tighter uppercase">SAF <span className="text-blue-600">GÜÇ</span><br />LABORATUVARI.</h1>
              <p className="text-slate-400 text-sm md:text-lg max-w-lg mx-auto lg:mx-0">Bilgin PC Market güvencesiyle donanım dünyasının zirvesini keşfedin.</p>
              <button className="bg-blue-600 px-10 py-5 rounded-2xl font-black text-xs uppercase shadow-2xl active:scale-95 transition-all">VİTRİNİ KEŞFET</button>
            </div>
            <div className="text-9xl animate-bounce">🖥️</div>
          </div>
        </section>

        <section className="px-6 py-20 bg-white/[0.02] border-y border-white/5">
          <div className="max-w-[1300px] mx-auto">
            <h2 className="text-3xl font-black mb-12 uppercase italic text-white">ÖNE ÇIKAN <span className="text-blue-600">CANAVARLAR</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {urunler.map((pc: any) => (
                <Link href={`/product/${pc.id}`} key={pc.id} prefetch={true} className="group bg-[#0b1120] border border-white/5 p-6 rounded-[2rem] hover:border-blue-600/50 transition-all flex flex-col h-full">
                  <div className="h-48 bg-white/5 rounded-2xl mb-6 overflow-hidden flex items-center justify-center relative">
                    <img src={pc.resim} alt={pc.ad} className="absolute w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="font-black text-lg mb-2 uppercase tracking-tighter line-clamp-2">{pc.ad}</h3>
                  <div className="mb-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest flex-grow">{pc.ozellik}</div>
                  <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/5">
                    <span className="text-blue-500 font-black text-lg">{pc.fiyat}</span>
                    <div className="bg-white/5 p-3 rounded-xl group-hover:bg-blue-600 text-white">🛒</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-20 max-w-[1300px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="grid grid-cols-2 gap-4">
            {kurumsalLinkler.map((item, idx) => (
              <Link key={idx} href={item.path} className="flex items-center gap-3 p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-blue-600/10 transition-all group">
                <span className="text-xl">{item.icon}</span>
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-300">{item.title}</span>
              </Link>
            ))}
          </div>
          <div className="space-y-4">
            <a href="tel:08503055968" className="flex items-center justify-between p-6 bg-blue-500/10 border border-blue-500/20 rounded-3xl hover:bg-blue-600 transition-all group font-black">
               <span>📞 MÜŞTERİ HATTI</span><span>0850 305 59 68</span>
            </a>
          </div>
        </section>
      </main>
      <footer className="border-t border-white/5 py-8 text-center text-slate-600 text-[10px] font-black uppercase">© 2026 BİLGİN PC MARKET</footer>
    </div>
  );
}