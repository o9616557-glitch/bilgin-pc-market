import Link from "next/link";
import SiteShell from "@/components/layout/SiteShell";

export const metadata = {
  title: "Hakkımızda | Bilgin PC Market",
  description: "Bilgin PC Market - Yüksek performanslı donanımlar ve geleceğin teknoloji çözümleri.",
};

export default function HakkimizdaPage() {
  return (
    <SiteShell container="default" className="pb-16">
      <section className="relative pt-16 sm:pt-24 pb-12 sm:pb-16 text-center">
        <span className="site-label inline-flex items-center text-site-accent bg-site-accent/10 border border-site-accent/20 px-3 py-1 rounded-full">
          Geleceğin Performans Merkezi
        </span>
        <h1 className="mt-6 site-h-hero">
          Bilgin PC <span className="site-accent-gradient">Market</span>
        </h1>
        <p className="mt-6 site-body max-w-3xl mx-auto">
          Biz sadece bir e-ticaret platformu değil; dijital dünyanın sınırlarını zorlayanların, rekabetçi arenada zirveyi hedefleyenlerin ve donanım tutkusunu profesyonellikle birleştirenlerin ortak noktasıyız.
        </p>
      </section>

      <section className="py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-site-accent-strong to-site-accent rounded-lg text-site-shell">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h2 className="site-h2">Performansın Ne Demek Olduğunu Biliyoruz</h2>
            </div>
            <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
              E-spor dünyasının tam kalbinden gelen, yüksek performansın ve <span className="text-site-accent font-medium">1 milisaniyelik tepkime süresinin</span> bile ne kadar kritik olduğunu bilen bir ekibiz. Bu yüzden kataloğumuza eklediğimiz her bir ekran kartını, işlemciyi ve bileşeni özenle seçiyoruz.
            </p>
            <p className="site-body">
              Amacımız; standart donanımlar satmak değil, amiral gemisi teknolojileri oyun ve iş istasyonlarına entegre edecek doğru çözümleri sunmaktır.
            </p>
          </div>

          <div className="md:col-span-5 glass-card p-6 sm:p-8 relative group hover:border-white/[0.12] transition-all">
            <div className="absolute inset-0 bg-gradient-to-r from-site-accent-strong/5 to-site-accent/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none" />
            <div className="space-y-6 relative z-10">
              <div>
                <div className="text-2xl sm:text-3xl font-semibold text-site-accent">%100</div>
                <div className="site-body mt-1">Orijinal ve resmi Türkiye garantili ürünler</div>
              </div>
              <div className="border-t border-white/[0.08]" />
              <div>
                <div className="text-2xl sm:text-3xl font-semibold text-site-accent-strong">0 ms</div>
                <div className="site-body mt-1">Gri market toleransı</div>
              </div>
              <div className="border-t border-white/[0.08]" />
              <div>
                <div className="text-2xl sm:text-3xl font-semibold text-white">7/24</div>
                <div className="site-body mt-1">Güvenli yazılım ve ödeme altyapısı</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <h2 className="site-h2">Şeffaflık, Güven ve Kurumsal Taahhüdümüz</h2>
          <p className="site-body mt-3">
            Türkiye&apos;nin ve dünyanın önde gelen teknoloji distribütörleriyle kurduğumuz dürüst bağlar sayesinde, markaların değerini kendi değerimiz gibi koruyoruz.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="glass-card p-5 sm:p-6 hover:border-site-accent-strong/30 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-site-accent-strong/10 flex items-center justify-center text-site-accent-muted mb-4 group-hover:bg-site-accent-strong group-hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-white">Sıfır gri market toleransı</h3>
            <p className="site-body mt-3 text-sm">
              Yalnızca resmi distribütör çıkışlı ürünler satarak, markaların Türkiye&apos;deki fiyat ve hizmet politikalarına tam uyum sağlarız.
            </p>
          </div>

          <div className="glass-card p-5 sm:p-6 hover:border-site-accent/30 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-site-accent/10 flex items-center justify-center text-site-accent mb-4 group-hover:bg-site-accent group-hover:text-site-shell transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-white">Modern dijital altyapı</h3>
            <p className="site-body mt-3 text-sm">
              Platformumuz en güncel web teknolojileri ile yüksek veri güvenliği ve kullanıcı deneyimi standartlarına göre geliştirilmiştir.
            </p>
          </div>

          <div className="glass-card p-5 sm:p-6 hover:border-purple-400/30 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 mb-4 group-hover:bg-purple-500 group-hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-white">Yetkin teknik destek</h3>
            <p className="site-body mt-3 text-sm">
              Üst düzey donanımların uyumluluğu konusunda müşterilerimize doğru teknik rehberlik sunarak memnuniyeti artırırız.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 text-center">
        <div className="glass-card p-8 md:p-12 max-w-4xl mx-auto">
          <blockquote className="text-base sm:text-lg italic text-slate-200 font-normal leading-relaxed">
            &ldquo;Teknolojinin zirvesine giden yolda, doğru donanım ve güvenilir kurumsal hizmet için Bilgin PC Market daima yanınızda.&rdquo;
          </blockquote>
          <Link href="/" className="btn-primary mt-8 inline-flex">
            Mağazaya Dön
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
