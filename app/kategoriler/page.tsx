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

        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-white">Tüm Kategoriler</h1>
          <p className="text-slate-400 text-sm mt-1">İstediğin kategoriye gir, ürünleri incele</p>
        </div>

        <div className="grid grid-cols-1 gap-1.5">
          {KATEGORILER.map((k) => (
            <Link key={k.slug} href={`/kategori/${k.slug}`}
              className="group flex items-center gap-3 bg-[#0f172a] border border-slate-800 hover:border-slate-700 rounded-xl px-3 py-2 transition-colors">
              <div className={`relative w-10 h-10 shrink-0 overflow-hidden rounded-lg ${!k.resim ? `bg-gradient-to-br ${k.renk}` : ""}`}>
                {k.resim && <Image src={k.resim} alt={k.isim} fill className="object-contain" unoptimized />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm truncate">{k.isim}</p>
                <p className="text-slate-500 text-[11px] truncate">{k.aciklama}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" />
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
