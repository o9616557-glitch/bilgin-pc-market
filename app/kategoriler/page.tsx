"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Grid3X3 } from "lucide-react";

const KATEGORILER = [
  {
    slug: "islemci",
    isim: "İşlemciler",
    aciklama: "Intel & AMD tüm modeller",
    renk: "from-blue-600 to-blue-900",
    renk2: "#1d4ed8",
    emoji: "⚡",
  },
  {
    slug: "ekran-karti",
    isim: "Ekran Kartları",
    aciklama: "RTX, RX ve Pro seriler",
    renk: "from-green-600 to-emerald-900",
    renk2: "#16a34a",
    emoji: "🎮",
  },
  {
    slug: "anakart",
    isim: "Anakartlar",
    aciklama: "Intel & AMD platformları",
    renk: "from-purple-600 to-purple-900",
    renk2: "#7c3aed",
    emoji: "🔧",
  },
  {
    slug: "ram",
    isim: "RAM Bellek",
    aciklama: "DDR4 & DDR5 seçenekleri",
    renk: "from-cyan-600 to-cyan-900",
    renk2: "#0891b2",
    emoji: "💾",
  },
  {
    slug: "ssd",
    isim: "SSD & M.2 Disk",
    aciklama: "NVMe ve SATA diskler",
    renk: "from-orange-600 to-orange-900",
    renk2: "#ea580c",
    emoji: "💿",
  },
  {
    slug: "kasa",
    isim: "Bilgisayar Kasası",
    aciklama: "Mid-tower, full-tower modeller",
    renk: "from-slate-600 to-slate-900",
    renk2: "#475569",
    emoji: "🖥️",
  },
  {
    slug: "psu",
    isim: "Güç Kaynakları",
    aciklama: "80+ Bronze'dan Platinum'a",
    renk: "from-yellow-600 to-yellow-900",
    renk2: "#ca8a04",
    emoji: "⚡",
  },
  {
    slug: "sogutma",
    isim: "Soğutma Sistemleri",
    aciklama: "Hava ve sıvı soğutma",
    renk: "from-sky-600 to-sky-900",
    renk2: "#0284c7",
    emoji: "❄️",
  },
  {
    slug: "monitor",
    isim: "Monitörler",
    aciklama: "144Hz, 4K oyun monitörleri",
    renk: "from-indigo-600 to-indigo-900",
    renk2: "#4338ca",
    emoji: "🖥️",
  },
  {
    slug: "klavye",
    isim: "Klavye",
    aciklama: "Mekanik ve membran klavyeler",
    renk: "from-rose-600 to-rose-900",
    renk2: "#e11d48",
    emoji: "⌨️",
  },
  {
    slug: "mouse",
    isim: "Mouse & Mousepad",
    aciklama: "Gaming ve profesyonel fareler",
    renk: "from-teal-600 to-teal-900",
    renk2: "#0d9488",
    emoji: "🖱️",
  },
  {
    slug: "laptop",
    isim: "Laptop & Notebook",
    aciklama: "Gaming ve iş laptopları",
    renk: "from-violet-600 to-violet-900",
    renk2: "#7c3aed",
    emoji: "💻",
  },
];

/* ──────────────────────────────────────────────────── */
/* MODEL 1 — Büyük gradient kart, resim placeholder    */
/* ──────────────────────────────────────────────────── */
function Model1({ kategoriler }: { kategoriler: typeof KATEGORILER }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {kategoriler.map((k) => (
        <Link
          key={k.slug}
          href={`/kategori/${k.slug}`}
          className="group relative rounded-2xl overflow-hidden aspect-square shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all duration-300"
        >
          {/* Resim alanı — Cloudinary URL buraya gelecek */}
          <div className={`absolute inset-0 bg-gradient-to-br ${k.renk} opacity-90`} />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 text-white">
            <span className="text-4xl sm:text-5xl">{k.emoji}</span>
            <p className="text-sm sm:text-base font-black text-center leading-tight drop-shadow">{k.isim}</p>
            <p className="text-[10px] sm:text-xs text-white/70 text-center">{k.aciklama}</p>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/40 transition-colors">
            <ChevronRight className="w-3.5 h-3.5 text-white" />
          </div>
        </Link>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────────── */
/* MODEL 2 — Yatay kart, sol resim + sağ yazı          */
/* ──────────────────────────────────────────────────── */
function Model2({ kategoriler }: { kategoriler: typeof KATEGORILER }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {kategoriler.map((k) => (
        <Link
          key={k.slug}
          href={`/kategori/${k.slug}`}
          className="group flex items-center gap-4 bg-[#0f172a] border border-slate-800 hover:border-slate-600 rounded-2xl p-3 transition-all hover:bg-[#1e293b]"
        >
          {/* Resim kutusu */}
          <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br ${k.renk} shrink-0 flex items-center justify-center text-2xl sm:text-3xl shadow-lg`}>
            {k.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-sm sm:text-base truncate group-hover:text-cyan-300 transition-colors">{k.isim}</p>
            <p className="text-slate-500 text-xs mt-0.5 truncate">{k.aciklama}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 shrink-0 transition-colors" />
        </Link>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────────── */
/* MODEL 3 — Dikey kart, üstte ince renkli çizgi       */
/* ──────────────────────────────────────────────────── */
function Model3({ kategoriler }: { kategoriler: typeof KATEGORILER }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {kategoriler.map((k) => (
        <Link
          key={k.slug}
          href={`/kategori/${k.slug}`}
          className="group flex flex-col bg-[#0f172a] rounded-2xl overflow-hidden border border-slate-800 hover:border-slate-600 hover:scale-[1.02] transition-all duration-300 shadow-md"
        >
          {/* Resim / placeholder alanı */}
          <div className={`h-28 sm:h-36 bg-gradient-to-br ${k.renk} flex items-center justify-center text-4xl sm:text-5xl`}>
            {k.emoji}
          </div>
          {/* Renkli ince çizgi */}
          <div className="h-[3px] w-full" style={{ backgroundColor: k.renk2 }} />
          <div className="p-3 flex-1">
            <p className="text-white font-bold text-xs sm:text-sm leading-tight">{k.isim}</p>
            <p className="text-slate-500 text-[10px] sm:text-xs mt-1">{k.aciklama}</p>
          </div>
          <div className="px-3 pb-3">
            <span className="text-[10px] font-bold tracking-wider uppercase text-cyan-500 group-hover:text-cyan-300 transition-colors">
              İncele →
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────────── */
/* MODEL 4 — Geniş banner kart (2 kolon)               */
/* ──────────────────────────────────────────────────── */
function Model4({ kategoriler }: { kategoriler: typeof KATEGORILER }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {kategoriler.map((k) => (
        <Link
          key={k.slug}
          href={`/kategori/${k.slug}`}
          className="group relative rounded-2xl overflow-hidden h-32 sm:h-40 shadow-lg hover:scale-[1.02] transition-all duration-300"
        >
          {/* Resim alanı — Cloudinary URL buraya */}
          <div className={`absolute inset-0 bg-gradient-to-r ${k.renk}`} />
          {/* Sağda büyük emoji / illüstrasyon */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-6xl sm:text-7xl opacity-30 group-hover:opacity-50 transition-opacity select-none">
            {k.emoji}
          </div>
          {/* Sol yazı */}
          <div className="relative z-10 h-full flex flex-col justify-center px-5 sm:px-6">
            <p className="text-white font-black text-lg sm:text-xl drop-shadow">{k.isim}</p>
            <p className="text-white/70 text-xs sm:text-sm mt-1">{k.aciklama}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-white/90 text-xs font-bold bg-white/10 px-3 py-1 rounded-full w-fit group-hover:bg-white/20 transition-colors">
              Tümünü Gör <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────────── */
/* ANA SAYFA                                           */
/* ──────────────────────────────────────────────────── */
export default function KategorilerSayfasi() {
  return (
    <div className="min-h-screen bg-[#020617] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-16">

        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 mb-4">
            <Grid3X3 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-cyan-400 text-xs font-semibold tracking-wide">Katalog Modelleri — Birini seçin</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Hangi model olsun?</h1>
          <p className="text-slate-400 text-sm mt-2">4 farklı tasarım — beğendiğinizi söyleyin, o kalsın</p>
        </div>

        {/* MODEL 1 */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-cyan-500 text-black text-xs font-black px-3 py-1 rounded-full">MODEL 1</div>
            <p className="text-slate-400 text-sm">Kare kart · Gradient arka plan · Tam dolu görsel</p>
          </div>
          <Model1 kategoriler={KATEGORILER} />
        </section>

        <div className="border-t border-slate-800" />

        {/* MODEL 2 */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-500 text-white text-xs font-black px-3 py-1 rounded-full">MODEL 2</div>
            <p className="text-slate-400 text-sm">Yatay kart · Sol küçük resim + sağ açıklama</p>
          </div>
          <Model2 kategoriler={KATEGORILER} />
        </section>

        <div className="border-t border-slate-800" />

        {/* MODEL 3 */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-500 text-white text-xs font-black px-3 py-1 rounded-full">MODEL 3</div>
            <p className="text-slate-400 text-sm">Dikey kart · Üstte resim · Altta yazı · Renkli çizgi</p>
          </div>
          <Model3 kategoriler={KATEGORILER} />
        </section>

        <div className="border-t border-slate-800" />

        {/* MODEL 4 */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-orange-500 text-white text-xs font-black px-3 py-1 rounded-full">MODEL 4</div>
            <p className="text-slate-400 text-sm">Geniş banner · Yatay · İki kolon</p>
          </div>
          <Model4 kategoriler={KATEGORILER} />
        </section>

      </div>
    </div>
  );
}
