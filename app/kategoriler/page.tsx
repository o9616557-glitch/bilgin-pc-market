"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

const KATEGORILER = [
  {
    slug: "islemci",
    isim: "İşlemciler",
    aciklama: "Intel & AMD tüm modeller",
    renk: "from-blue-600 to-blue-900",
    resim: "",
  },
  {
    slug: "ekran-karti",
    isim: "Ekran Kartları",
    aciklama: "RTX, RX ve Pro seriler",
    renk: "from-green-600 to-emerald-900",
    resim: "",
  },
  {
    slug: "anakart",
    isim: "Anakartlar",
    aciklama: "Intel & AMD platformları",
    renk: "from-purple-600 to-purple-900",
    resim: "",
  },
  {
    slug: "ram",
    isim: "RAM Bellek",
    aciklama: "DDR4 & DDR5 seçenekleri",
    renk: "from-cyan-600 to-cyan-900",
    resim: "",
  },
  {
    slug: "ssd",
    isim: "SSD & M.2 Disk",
    aciklama: "NVMe ve SATA diskler",
    renk: "from-orange-600 to-orange-900",
    resim: "",
  },
  {
    slug: "kasa",
    isim: "Bilgisayar Kasası",
    aciklama: "Mid-tower, full-tower modeller",
    renk: "from-slate-600 to-slate-900",
    resim: "",
  },
  {
    slug: "psu",
    isim: "Güç Kaynakları",
    aciklama: "80+ Bronze'dan Platinum'a",
    renk: "from-yellow-600 to-yellow-900",
    resim: "",
  },
  {
    slug: "sogutma",
    isim: "Soğutma Sistemleri",
    aciklama: "Hava ve sıvı soğutma",
    renk: "from-sky-600 to-sky-900",
    resim: "",
  },
  {
    slug: "monitor",
    isim: "Monitörler",
    aciklama: "144Hz, 4K oyun monitörleri",
    renk: "from-indigo-600 to-indigo-900",
    resim: "",
  },
  {
    slug: "klavye",
    isim: "Klavye",
    aciklama: "Mekanik ve membran klavyeler",
    renk: "from-rose-600 to-rose-900",
    resim: "",
  },
  {
    slug: "mouse",
    isim: "Mouse & Mousepad",
    aciklama: "Gaming ve profesyonel fareler",
    renk: "from-teal-600 to-teal-900",
    resim: "https://res.cloudinary.com/dtnbkoa9s/image/upload/v1782720094/Ads%C4%B1z_tasar%C4%B1m_-_2026-06-29T105744.333_xnstan.png",
  },
  {
    slug: "laptop",
    isim: "Laptop & Notebook",
    aciklama: "Gaming ve iş laptopları",
    renk: "from-violet-600 to-violet-900",
    resim: "",
  },
];

export default function KategorilerSayfasi() {
  return (
    <div className="min-h-screen bg-[#020617] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">

        {/* SECENEK A — Max genişlik daraltılmış (max-w-xl, ortada) */}
        <div className="mb-2">
          <span className="bg-cyan-500 text-black text-xs font-black px-3 py-1 rounded-full">A — Ortada dar</span>
        </div>
        <div className="max-w-xl mx-auto w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mb-12">
          {KATEGORILER.filter(k => k.slug === "mouse" || k.slug === "klavye" || k.slug === "monitor").map((k) => (
            <Link key={k.slug} href={`/kategori/${k.slug}`}
              className="group flex items-center gap-3 bg-[#0f172a] border border-slate-800 hover:border-slate-700 rounded-xl px-3 py-2 transition-colors">
              <div className={`relative w-12 h-12 shrink-0 overflow-hidden rounded-lg ${!k.resim ? `bg-gradient-to-br ${k.renk}` : ""}`}>
                {k.resim && <Image src={k.resim} alt={k.isim} fill className="object-contain p-0.5" unoptimized />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm truncate">{k.isim}</p>
                <p className="text-slate-500 text-xs mt-0.5 truncate">{k.aciklama}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" />
            </Link>
          ))}
        </div>

        <div className="border-t border-slate-800 mb-12" />

        {/* SECENEK B — Tek kolon, tam genişlik */}
        <div className="mb-2">
          <span className="bg-purple-500 text-white text-xs font-black px-3 py-1 rounded-full">B — Tek kolon</span>
        </div>
        <div className="grid grid-cols-1 gap-2 mb-12">
          {KATEGORILER.filter(k => k.slug === "mouse" || k.slug === "klavye" || k.slug === "monitor").map((k) => (
            <Link key={k.slug} href={`/kategori/${k.slug}`}
              className="group flex items-center gap-3 bg-[#0f172a] border border-slate-800 hover:border-slate-700 rounded-xl px-3 py-2 transition-colors">
              <div className={`relative w-12 h-12 shrink-0 overflow-hidden rounded-lg ${!k.resim ? `bg-gradient-to-br ${k.renk}` : ""}`}>
                {k.resim && <Image src={k.resim} alt={k.isim} fill className="object-contain p-0.5" unoptimized />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm truncate">{k.isim}</p>
                <p className="text-slate-500 text-xs mt-0.5 truncate">{k.aciklama}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" />
            </Link>
          ))}
        </div>

        <div className="border-t border-slate-800 mb-12" />

        {/* SECENEK C — Padding artırılmış, daha çerçeveli */}
        <div className="mb-2">
          <span className="bg-emerald-500 text-white text-xs font-black px-3 py-1 rounded-full">C — Geniş padding</span>
        </div>
        <div className="px-4 sm:px-10 grid grid-cols-1 sm:grid-cols-2 gap-3 mb-12">
          {KATEGORILER.filter(k => k.slug === "mouse" || k.slug === "klavye" || k.slug === "monitor").map((k) => (
            <Link key={k.slug} href={`/kategori/${k.slug}`}
              className="group flex items-center gap-3 bg-[#0f172a] border border-slate-800 hover:border-slate-700 rounded-xl px-3 py-2 transition-colors">
              <div className={`relative w-12 h-12 shrink-0 overflow-hidden rounded-lg ${!k.resim ? `bg-gradient-to-br ${k.renk}` : ""}`}>
                {k.resim && <Image src={k.resim} alt={k.isim} fill className="object-contain p-0.5" unoptimized />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm truncate">{k.isim}</p>
                <p className="text-slate-500 text-xs mt-0.5 truncate">{k.aciklama}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" />
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
