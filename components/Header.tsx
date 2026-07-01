"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import { destekOzetOku } from "@/lib/destek-ozet";
import { useCart } from "@/app/CartContext";
import { useOrders } from "@/app/OrderContext";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Search, ChevronDown, Mail, Bell } from "lucide-react";
import { cloudinaryKatalogResim } from "@/lib/cloudinary";

const KATALOG_ICON_DESKTOP = 72;
const KATALOG_ICON_MOBILE = 56;
const KATALOG_ICON_MOBILE_ANA = 48;

const MOUSE_KATALOG_IMG =
  "https://res.cloudinary.com/dtnbkoa9s/image/upload/v1782751550/Ads%C4%B1z_512_x_512_piksel_18_pjwq8q.png";

const MONITOR_KATALOG_IMG =
  "https://res.cloudinary.com/dtnbkoa9s/image/upload/v1782753137/Ads%C4%B1z_512_x_512_piksel_21_cynuut.png";

const KLAVYE_KATALOG_IMG =
  "https://res.cloudinary.com/dtnbkoa9s/image/upload/v1782751322/Ads%C4%B1z_512_x_512_piksel_12_cwxp29.png";

const KULAKLIK_KATALOG_IMG =
  "https://res.cloudinary.com/dtnbkoa9s/image/upload/v1782751323/Ads%C4%B1z_512_x_512_piksel_13_djx3aw.png";

const MIKROFON_KATALOG_IMG =
  "https://res.cloudinary.com/dtnbkoa9s/image/upload/v1782751325/Ads%C4%B1z_512_x_512_piksel_14_dyprt5.png";

const OYUN_KOLU_KATALOG_IMG =
  "https://res.cloudinary.com/dtnbkoa9s/image/upload/v1782751326/Ads%C4%B1z_512_x_512_piksel_15_fm8hup.png";

const HOPARLOR_KATALOG_IMG =
  "https://res.cloudinary.com/dtnbkoa9s/image/upload/v1782751324/Ads%C4%B1z_512_x_512_piksel_16_nk9ymv.png";

const BLUETOOTH_HOPARLOR_KATALOG_IMG =
  "https://res.cloudinary.com/dtnbkoa9s/image/upload/v1782751323/Ads%C4%B1z_512_x_512_piksel_17_cxwexo.png";

const OYUN_DIREKSIYONU_KATALOG_IMG =
  "https://res.cloudinary.com/dtnbkoa9s/image/upload/v1782751328/Ads%C4%B1z_512_x_512_piksel_11_qjhttw.png";

const MONITOR_CEVRE_KATALOG_IMG =
  "https://res.cloudinary.com/dtnbkoa9s/image/upload/v1782753137/Ads%C4%B1z_512_x_512_piksel_20_ngyp7e.png";

const HAZIR_SISTEM_KATALOG_IMG =
  "https://res.cloudinary.com/dtnbkoa9s/image/upload/v1782735204/Ads%C4%B1z_tasar%C4%B1m_-_2026-06-29T151248.316_ssq63p.png";

const OYUN_BILGISAYARI_IMG =
  "https://res.cloudinary.com/dtnbkoa9s/image/upload/v1782735887/Ads%C4%B1z_tasar%C4%B1m_-_2026-06-29T152421.391_oipvj2.png";

const OEM_PAKET_IMG =
  "https://res.cloudinary.com/dtnbkoa9s/image/upload/v1782737605/Ads%C4%B1z_800_x_800_piksel_1_cl9nap.png";

const PREMIUM_LAPTOP_IMG =
  "https://res.cloudinary.com/dtnbkoa9s/image/upload/v1782739109/Ads%C4%B1z_tasar%C4%B1m_-_2026-06-29T153328.342_etyv3p.png";

const MASAUSTU_BILGISAYAR_IMG =
  "https://res.cloudinary.com/dtnbkoa9s/image/upload/v1782740729/Ads%C4%B1z_tasar%C4%B1m_-_2026-06-29T164506.176_wmdnyw.png";

const RAM_KATALOG_IMG =
  "https://res.cloudinary.com/dtnbkoa9s/image/upload/v1782747323/Ads%C4%B1z_512_x_512_piksel_4_xt9jwu.png";

const ISLEMCI_KATALOG_IMG =
  "https://res.cloudinary.com/dtnbkoa9s/image/upload/v1782749478/Ads%C4%B1z_512_x_512_piksel_9_tcnxa2.png";

const ANAKART_KATALOG_IMG =
  "https://res.cloudinary.com/dtnbkoa9s/image/upload/v1782748642/Ads%C4%B1z_512_x_512_piksel_8_dd768b.png";

const PERFORMANS_KATALOG_IMG =
  "https://res.cloudinary.com/dtnbkoa9s/image/upload/v1782748641/Ads%C4%B1z_512_x_512_piksel_6_kqk1md.png";

const EKRAN_KARTI_KATALOG_IMG =
  "https://res.cloudinary.com/dtnbkoa9s/image/upload/v1782748641/Ads%C4%B1z_512_x_512_piksel_7_gdqvft.png";

const KASA_GUC_KATALOG_IMG =
  "https://res.cloudinary.com/dtnbkoa9s/image/upload/v1782754372/Ads%C4%B1z_512_x_512_piksel_23_od4r19.png";

const KASA_KATALOG_IMG =
  "https://res.cloudinary.com/dtnbkoa9s/image/upload/v1782754373/Ads%C4%B1z_512_x_512_piksel_25_brw6fj.png";

const PSU_KATALOG_IMG =
  "https://res.cloudinary.com/dtnbkoa9s/image/upload/v1782754373/omzoxfhysdfqkoor2kcu.png";

const SOGUTMA_KATALOG_IMG =
  "https://res.cloudinary.com/dtnbkoa9s/image/upload/v1782754371/Ads%C4%B1z_512_x_512_piksel_24_heqxch.png";

const TERMAL_MACUN_KATALOG_IMG =
  "https://res.cloudinary.com/dtnbkoa9s/image/upload/v1782754370/Ads%C4%B1z_512_x_512_piksel_22_x7jmm7.png";

const DEPOLAMA_AG_KATALOG_IMG =
  "https://res.cloudinary.com/dtnbkoa9s/image/upload/v1782756664/Ads%C4%B1z_512_x_512_piksel_28_ytjqlv.png";

const SSD_KATALOG_IMG =
  "https://res.cloudinary.com/dtnbkoa9s/image/upload/v1782756744/Ads%C4%B1z_512_x_512_piksel_512_x_512_piksel_p9pwkp.png";

const HDD_KATALOG_IMG =
  "https://res.cloudinary.com/dtnbkoa9s/image/upload/v1782756603/Ads%C4%B1z_512_x_512_piksel_26_myvjzr.png";

const MODEM_KATALOG_IMG =
  "https://res.cloudinary.com/dtnbkoa9s/image/upload/v1782756601/Ads%C4%B1z_512_x_512_piksel_25_ztvfob.png";

const USB_KATALOG_IMG =
  "https://res.cloudinary.com/dtnbkoa9s/image/upload/v1782756603/Ads%C4%B1z_512_x_512_piksel_27_rzjzlp.png";

const YAZILIM_KABLO_KATALOG_IMG =
  "https://res.cloudinary.com/dtnbkoa9s/image/upload/v1782759665/Ads%C4%B1z_512_x_512_piksel_35_kpw4r5.png";

const ISLETIM_SISTEMI_KATALOG_IMG =
  "https://res.cloudinary.com/dtnbkoa9s/image/upload/v1782759677/Ads%C4%B1z_512_x_512_piksel_33_sb7qxe.png";

const OFFICE_YAZILIM_KATALOG_IMG =
  "https://res.cloudinary.com/dtnbkoa9s/image/upload/v1782759676/Ads%C4%B1z_512_x_512_piksel_34_bvkh5j.png";

const KABLOLAR_KATALOG_IMG =
  "https://res.cloudinary.com/dtnbkoa9s/image/upload/v1782759675/Ads%C4%B1z_512_x_512_piksel_29_rqnciv.png";

const AKIM_KORUYUCU_KATALOG_IMG =
  "https://res.cloudinary.com/dtnbkoa9s/image/upload/v1782759671/Ads%C4%B1z_512_x_512_piksel_32_oypfvv.png";

const NOTEBOOK_SOGUTUCU_KATALOG_IMG =
  "https://res.cloudinary.com/dtnbkoa9s/image/upload/v1782759674/Ads%C4%B1z_512_x_512_piksel_30_hvevbw.png";

const SARJ_POWERBANK_KATALOG_IMG =
  "https://res.cloudinary.com/dtnbkoa9s/image/upload/v1782759673/Ads%C4%B1z_512_x_512_piksel_31_qwxhsn.png";

const KENDIN_TOPLA_KATALOG_IMG =
  "https://res.cloudinary.com/dtnbkoa9s/image/upload/v1782835438/Ads%C4%B1z_512_x_512_piksel_37_xcmo81.png";

type AltKategori = { slug: string; isim: string; renk: string; resim: string };

// Header — 6 ana kategori
const KATALOG_SERIT: { id: string; isim: string; kisaIsim: string; renk: string; resim: string; altlar: AltKategori[] }[] = [
  {
    id: "hazir-sistem",
    isim: "Hazır Sistem & Laptop",
    kisaIsim: "Hazır Sistem",
    renk: "from-violet-700 to-violet-950",
    resim: HAZIR_SISTEM_KATALOG_IMG,
    altlar: [
      { slug: "oyun-bilgisayari", isim: "Oyun Bilgisayarı", renk: "from-violet-600 to-violet-900", resim: OYUN_BILGISAYARI_IMG },
      { slug: "laptop", isim: "Premium Laptop & Notebook", renk: "from-purple-600 to-purple-900", resim: PREMIUM_LAPTOP_IMG },
      { slug: "oem-paket", isim: "OEM Paketler", renk: "from-indigo-600 to-indigo-900", resim: OEM_PAKET_IMG },
      { slug: "masaustu", isim: "Masaüstü Bilgisayar", renk: "from-fuchsia-600 to-fuchsia-900", resim: MASAUSTU_BILGISAYAR_IMG },
    ],
  },
  {
    id: "performans",
    isim: "Temel Performans Bileşenleri",
    kisaIsim: "Performans",
    renk: "from-blue-700 to-blue-950",
    resim: PERFORMANS_KATALOG_IMG,
    altlar: [
      { slug: "ekran-karti", isim: "Ekran Kartı", renk: "from-green-600 to-emerald-900", resim: EKRAN_KARTI_KATALOG_IMG },
      { slug: "islemci", isim: "İşlemci (CPU)", renk: "from-blue-600 to-blue-900", resim: ISLEMCI_KATALOG_IMG },
      { slug: "anakart", isim: "Anakart", renk: "from-purple-600 to-purple-900", resim: ANAKART_KATALOG_IMG },
      { slug: "ram", isim: "RAM Bellek", renk: "from-cyan-600 to-cyan-900", resim: RAM_KATALOG_IMG },
    ],
  },
  {
    id: "kasa-guc",
    isim: "Kasa, Güç & Soğutma",
    kisaIsim: "Kasa & Soğutma",
    renk: "from-slate-700 to-slate-950",
    resim: KASA_GUC_KATALOG_IMG,
    altlar: [
      { slug: "kasa", isim: "Bilgisayar Kasası", renk: "from-slate-600 to-slate-900", resim: KASA_KATALOG_IMG },
      { slug: "psu", isim: "Güç Kaynakları (PSU)", renk: "from-yellow-600 to-yellow-900", resim: PSU_KATALOG_IMG },
      { slug: "sogutma", isim: "Soğutma Sistemleri", renk: "from-sky-600 to-sky-900", resim: SOGUTMA_KATALOG_IMG },
      { slug: "termal-macun", isim: "Termal Macun", renk: "from-zinc-600 to-zinc-900", resim: TERMAL_MACUN_KATALOG_IMG },
      { slug: "notebook-aksesuar", isim: "Notebook Soğutucu", renk: "from-slate-600 to-slate-800", resim: NOTEBOOK_SOGUTUCU_KATALOG_IMG },
    ],
  },
  {
    id: "monitor-cevre",
    isim: "Monitör & Çevre Birimleri",
    kisaIsim: "Monitör & Çevre",
    renk: "from-indigo-700 to-indigo-950",
    resim: MONITOR_CEVRE_KATALOG_IMG,
    altlar: [
      { slug: "monitor", isim: "Oyuncu Monitörleri", renk: "from-indigo-600 to-indigo-900", resim: MONITOR_KATALOG_IMG },
      { slug: "mouse", isim: "Mouse & Mouse Pad", renk: "from-teal-600 to-teal-900", resim: MOUSE_KATALOG_IMG },
      { slug: "klavye", isim: "Klavye", renk: "from-rose-600 to-rose-900", resim: KLAVYE_KATALOG_IMG },
      { slug: "kulaklik", isim: "Oyuncu Kulaklıkları", renk: "from-pink-600 to-pink-900", resim: KULAKLIK_KATALOG_IMG },
      { slug: "mikrofon", isim: "Yayıncı Mikrofonları", renk: "from-red-600 to-red-900", resim: MIKROFON_KATALOG_IMG },
      { slug: "oyun-kolu", isim: "Oyun Kolu", renk: "from-orange-600 to-orange-900", resim: OYUN_KOLU_KATALOG_IMG },
      { slug: "oyun-direksiyonu", isim: "Oyun Direksiyonu", renk: "from-amber-600 to-amber-900", resim: OYUN_DIREKSIYONU_KATALOG_IMG },
      { slug: "hoparlor", isim: "Hoparlör (Speaker)", renk: "from-violet-600 to-violet-900", resim: HOPARLOR_KATALOG_IMG },
      { slug: "bluetooth-ses", isim: "Bluetooth Hoparlör", renk: "from-cyan-600 to-cyan-900", resim: BLUETOOTH_HOPARLOR_KATALOG_IMG },
    ],
  },
  {
    id: "depolama",
    isim: "Depolama & Ağ",
    kisaIsim: "Depolama",
    renk: "from-emerald-700 to-emerald-950",
    resim: DEPOLAMA_AG_KATALOG_IMG,
    altlar: [
      { slug: "ssd", isim: "SSD & M.2 Disk", renk: "from-orange-600 to-orange-900", resim: SSD_KATALOG_IMG },
      { slug: "hdd", isim: "Sabit Disk (HDD)", renk: "from-amber-600 to-amber-900", resim: HDD_KATALOG_IMG },
      { slug: "modem", isim: "Modem", renk: "from-emerald-600 to-emerald-900", resim: MODEM_KATALOG_IMG },
      { slug: "usb", isim: "USB Bellek & Hafıza Kartı", renk: "from-teal-600 to-teal-900", resim: USB_KATALOG_IMG },
    ],
  },
  {
    id: "yazilim",
    isim: "Yazılım & Kablo Çözümleri",
    kisaIsim: "Yazılım & Kablo",
    renk: "from-cyan-700 to-cyan-950",
    resim: YAZILIM_KABLO_KATALOG_IMG,
    altlar: [
      { slug: "isletim-sistemi", isim: "İşletim Sistemi", renk: "from-blue-600 to-blue-900", resim: ISLETIM_SISTEMI_KATALOG_IMG },
      { slug: "yazilim", isim: "Microsoft Office & Yazılım", renk: "from-cyan-600 to-cyan-900", resim: OFFICE_YAZILIM_KATALOG_IMG },
      { slug: "kablolar", isim: "Kablolar & Çeviriciler", renk: "from-green-600 to-green-900", resim: KABLOLAR_KATALOG_IMG },
      { slug: "akim-koruyucu", isim: "Akım Koruyucu Priz", renk: "from-yellow-600 to-yellow-900", resim: AKIM_KORUYUCU_KATALOG_IMG },
      { slug: "sarj-powerbank", isim: "Şarj Aletleri & Powerbank", renk: "from-lime-600 to-lime-900", resim: SARJ_POWERBANK_KATALOG_IMG },
    ],
  },
];

function katalogResimUrlSeti(): Set<string> {
  const urls = new Set<string>();
  for (const kat of KATALOG_SERIT) {
    if (kat.resim) {
      urls.add(cloudinaryKatalogResim(kat.resim, KATALOG_ICON_DESKTOP));
      urls.add(cloudinaryKatalogResim(kat.resim, KATALOG_ICON_MOBILE_ANA));
    }
    for (const alt of kat.altlar) {
      if (alt.resim) {
        urls.add(cloudinaryKatalogResim(alt.resim, KATALOG_ICON_DESKTOP));
        urls.add(cloudinaryKatalogResim(alt.resim, KATALOG_ICON_MOBILE));
      }
    }
  }
  urls.add(cloudinaryKatalogResim(KENDIN_TOPLA_KATALOG_IMG, KATALOG_ICON_DESKTOP));
  urls.add(cloudinaryKatalogResim(KENDIN_TOPLA_KATALOG_IMG, KATALOG_ICON_MOBILE_ANA));
  return urls;
}

function katalogResimleriniOnYukle() {
  for (const url of katalogResimUrlSeti()) {
    const img = new window.Image();
    img.decoding = "async";
    img.src = url;
  }
}

function kategoriResimKutusuSinifi(k: AltKategori) {
  if (!k.resim) return `bg-gradient-to-br ${k.renk}`;
  return "";
}

function KatalogGorsel({
  src,
  alt,
  displayPx,
}: {
  src: string;
  alt: string;
  displayPx: number;
}) {
  return (
    <img
      src={cloudinaryKatalogResim(src, displayPx)}
      alt={alt}
      width={displayPx}
      height={displayPx}
      loading="eager"
      decoding="async"
      className="absolute inset-0 w-full h-full object-contain p-1"
    />
  );
}

function ResimliKategoriKarti({
  k,
  onNavigate,
}: {
  k: AltKategori;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={`/kategori/${k.slug}`}
      prefetch
      onClick={onNavigate}
      className="group flex flex-col items-center w-[100px] shrink-0 h-[104px]"
    >
      <div
        className={`relative w-[72px] h-[72px] rounded-xl overflow-hidden shrink-0 mb-1.5 ${kategoriResimKutusuSinifi(k)}`}
      >
        {k.resim && (
          <KatalogGorsel src={k.resim} alt={k.isim} displayPx={KATALOG_ICON_DESKTOP} />
        )}
      </div>
      <span className="text-[10px] font-semibold text-white text-center leading-tight line-clamp-2 w-full h-[26px] flex items-start justify-center">
        {k.isim}
      </span>
    </Link>
  );
}

function MobilAltKategoriKarti({
  k,
  onClose,
}: {
  k: AltKategori;
  onClose: () => void;
}) {
  return (
    <Link
      href={`/kategori/${k.slug}`}
      prefetch
      onClick={onClose}
      className="flex flex-col items-center gap-1 p-1.5 rounded-lg hover:bg-white/[0.05] transition-colors"
    >
      <div
        className={`relative w-14 h-14 rounded-lg overflow-hidden shrink-0 ${kategoriResimKutusuSinifi(k)}`}
      >
        {k.resim && (
          <KatalogGorsel src={k.resim} alt={k.isim} displayPx={KATALOG_ICON_MOBILE} />
        )}
      </div>
      <span className="text-[10px] font-medium text-slate-300 text-center leading-tight line-clamp-2 w-full">
        {k.isim}
      </span>
    </Link>
  );
}

function MobilKatalogMenusu({ onClose, hazir }: { onClose: () => void; hazir: boolean }) {
  const [acikAna, setAcikAna] = useState<string | null>(null);
  const panellerHazir = hazir || acikAna !== null;

  return (
    <div>
      <div className="mb-3 px-0.5">
        <h2 className="text-[10px] font-semibold text-[#3b82f6]/90 uppercase tracking-[0.18em]">
          Kategoriler
        </h2>
      </div>

      <div className="space-y-2.5">
        {KATALOG_SERIT.map((ana) => {
          const acik = acikAna === ana.id;
          return (
            <div key={ana.id}>
              <div
                className={`rounded-xl border transition-colors ${
                  acik
                    ? "border-white/[0.14] bg-white/[0.05]"
                    : "border-white/[0.08] bg-white/[0.03]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setAcikAna(acik ? null : ana.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/[0.04] transition-colors rounded-xl"
                >
                  <div
                    className={`relative w-12 h-12 rounded-lg shrink-0 overflow-hidden ${ana.resim ? "" : `bg-gradient-to-br ${ana.renk}`}`}
                  >
                    {ana.resim && (
                      <KatalogGorsel src={ana.resim} alt={ana.isim} displayPx={KATALOG_ICON_MOBILE_ANA} />
                    )}
                  </div>
                  <span className="flex-1 text-left text-sm font-bold text-white leading-tight">{ana.isim}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 transition-transform duration-300 ease-out shrink-0 ${acik ? "rotate-180" : ""}`}
                  />
                </button>
              </div>

              {panellerHazir && (
                <div
                  className="grid transition-[grid-template-rows] duration-[380ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
                  style={{ gridTemplateRows: acik ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden min-h-0">
                    <div
                      className={`grid grid-cols-3 gap-2 py-2.5 px-0.5 transition-opacity duration-[380ms] ease-out ${
                        acik ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      {ana.altlar.map((k) => (
                        <MobilAltKategoriKarti
                          key={`${ana.id}-${k.slug}-${k.isim}`}
                          k={k}
                          onClose={onClose}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProfilAvatar({ size = 36, className = "" }: { size?: number; className?: string }) {
  const { data: session, status } = useSession();
  const userImage = session?.user?.image;
  const userName = session?.user?.name || "";

  if (status === "loading") {
    return (
      <div
        className={`rounded-full bg-white/[0.06] border border-white/[0.12] flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
      >
        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
    );
  }

  if (userImage) {
    return (
      <img
        src={userImage}
        alt={userName}
        width={size}
        height={size}
        style={{ width: size, height: size }}
        className={`rounded-full object-cover ring-2 ring-[#3b82f6]/40 ${className}`}
      />
    );
  }

  if (status === "authenticated") {
    const basHarf = (userName[0] || "U").toUpperCase();
    return (
      <div
        className={`rounded-full bg-gradient-to-b from-cyan-800 to-[#020617] border border-cyan-500/30 flex items-center justify-center text-cyan-300 font-black ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.38 }}
      >
        {basHarf}
      </div>
    );
  }

  return (
    <div
      className={`rounded-full bg-white/[0.06] border border-white/[0.12] flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    </div>
  );
}

function HeaderIkonBadge({ sayi, children }: { sayi: number; children: ReactNode }) {
  return (
    <div className="relative">
      {children}
      {sayi > 0 && (
        <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] font-black min-w-5 h-5 px-1 flex items-center justify-center rounded-full border-2 border-[#050814] shadow-[0_0_4px_rgba(239,68,68,0.4)] select-none leading-none">
          {sayi > 9 ? "9+" : sayi}
        </span>
      )}
    </div>
  );
}

function BilginPcMarka({
  className = "",
  size = "md",
  variant = "stacked",
  glow = false,
}: {
  className?: string;
  size?: "sm" | "md";
  variant?: "stacked" | "horizontal";
  glow?: boolean;
}) {
  const textSize = size === "sm" ? "text-[15px] sm:text-base" : "text-2xl";
  const glowClass = glow
    ? "relative drop-shadow-[0_0_10px_rgba(59,130,246,0.95)] before:absolute before:inset-[-6px] before:-z-10 before:rounded-lg before:bg-[#3b82f6]/20 before:blur-md before:animate-pulse"
    : "";

  if (variant === "horizontal") {
    return (
      <Link
        href="/"
        className={`inline-flex items-center font-black tracking-tight leading-none select-none shrink-0 ${textSize} ${glowClass} ${className}`}
        aria-label="Bilgin PC Ana Sayfa"
      >
        <span className="text-white">BİLGİN</span>
        <span className="text-[#3b82f6] ml-0.5">PC</span>
      </Link>
    );
  }

  return (
    <Link
      href="/"
      className={`inline-flex flex-col items-center justify-center font-black tracking-tight leading-none select-none gap-1 ${textSize} ${glowClass} ${className}`}
      aria-label="Bilgin PC Ana Sayfa"
    >
      <span className="flex items-baseline gap-0.5 leading-none">
        <span className="text-white">BİLGİN</span>
        <span className="text-[#3b82f6]">PC</span>
      </span>
      <span className="h-px w-8 bg-gradient-to-r from-transparent via-[#3b82f6]/70 to-transparent shrink-0" />
    </Link>
  );
}

function MobilProfilLink({ size = 42, onNavigate }: { size?: number; onNavigate?: () => void }) {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <div
        className="lg:hidden rounded-full bg-white/[0.06] border border-white/[0.12] shrink-0"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <Link href="/hesabim" onClick={onNavigate} className="lg:hidden shrink-0 transition-all" aria-label="Hesabım">
      <ProfilAvatar size={size} />
    </Link>
  );
}

export default function Header() {
  const pathname = usePathname();

  const gizlenecekSayfalar = ["/sepet", "/odeme", "/giris", "/kayit", "/sifre-sifirla", "/yeni-sifre", "/checkout"];
  const headerGizli = gizlenecekSayfalar.includes(pathname);

  const { sepet } = useCart();
  const { orders } = useOrders();
  const [okunmamisMesaj, setOkunmamisMesaj] = useState(() => {
    if (typeof window === "undefined") return 0;
    return destekOzetOku().okunmamis || 0;
  });
  const [menuAcik, setMenuAcik] = useState(false);
  const [hesabimAcik, setHesabimAcik] = useState(false);
  const [acikSeritKatalog, setAcikSeritKatalog] = useState<string | null>(null);
  const katalogRef = useRef<HTMLDivElement>(null);
  const hesabimRef = useRef<HTMLDivElement>(null);
  
  const sepetAdedi = sepet.reduce((toplam: number, urun: any) => toplam + (urun.adet || 1), 0);
  const { data: session, status } = useSession();
  const kargoBildirimSayisi = orders.filter((o) =>
    (o.durum || o.status || "").toLocaleLowerCase("tr-TR").includes("kargo")
  ).length;

  useEffect(() => {
    const destekOzetOkuHandler = () => {
      const ozet = destekOzetOku(session?.user?.email);
      setOkunmamisMesaj(ozet.okunmamis || 0);
    };
    if (status !== "loading") destekOzetOkuHandler();
    window.addEventListener("bilgin-hesap-guncellendi", destekOzetOkuHandler);
    return () => window.removeEventListener("bilgin-hesap-guncellendi", destekOzetOkuHandler);
  }, [status, session?.user?.email]);
  const isAdmin = session?.user?.email?.toLowerCase() === "o9616557@gmail.com";
  const [cikisOnayAcik, setCikisOnayAcik] = useState(false); // 🚀 YENİ EKLEDİĞİMİZ MERKEZİ ONAY MOTORU
  // 🚀 GÜVENLİK MOTORU: Çıkış yaparken çırağın defterini yakar
  const guvenliCikisYap = async () => {
    localStorage.removeItem("bilgin_kayitli_sistemler");
    await signOut(); 
  };

  useEffect(() => {
    setAcikSeritKatalog(null);
    setMenuAcik(false);
  }, [pathname]);

  useEffect(() => {
    if (!acikSeritKatalog) return;
    const disariTikla = (e: MouseEvent) => {
      if (katalogRef.current && !katalogRef.current.contains(e.target as Node)) {
        setAcikSeritKatalog(null);
      }
    };
    document.addEventListener("mousedown", disariTikla);
    return () => document.removeEventListener("mousedown", disariTikla);
  }, [acikSeritKatalog]);

  useEffect(() => {
    const onYukle = () => katalogResimleriniOnYukle();

    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(onYukle, { timeout: 1500 });
      return () => window.cancelIdleCallback(id);
    }

    const timer = window.setTimeout(onYukle, 400);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!menuAcik) return;
    katalogResimleriniOnYukle();
  }, [menuAcik]);

  useEffect(() => {
    function disariTiklandi(event: any) {
      if (hesabimRef.current && !hesabimRef.current.contains(event.target)) setHesabimAcik(false);
    }
    document.addEventListener("mousedown", disariTiklandi);
    return () => document.removeEventListener("mousedown", disariTiklandi);
  }, []);

  useEffect(() => {
    if (menuAcik || hesabimAcik) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuAcik, hesabimAcik]);

  const mesajLink = (
    <Link
      href="/mesajlarim"
      className="relative p-2 text-white hover:text-[#3b82f6] transition-colors"
      aria-label="Mesajlarım"
      title="Mesajlarım"
    >
      <HeaderIkonBadge sayi={okunmamisMesaj}>
        <Mail className="w-5 h-5 shrink-0" strokeWidth={2} />
      </HeaderIkonBadge>
    </Link>
  );

  const bildirimLink = (
    <Link
      href="/bildirimler"
      className="relative p-2 text-white hover:text-[#3b82f6] transition-colors"
      aria-label="Bildirimler"
      title="Bildirimler"
    >
      <HeaderIkonBadge sayi={kargoBildirimSayisi}>
        <Bell className="w-5 h-5 shrink-0" strokeWidth={2} />
      </HeaderIkonBadge>
    </Link>
  );

  const sepetLink = (
    <Link href="/sepet" className="relative p-2 text-white hover:text-[#3b82f6] transition-colors" aria-label="Sepet">
      <HeaderIkonBadge sayi={sepetAdedi}>
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </HeaderIkonBadge>
    </Link>
  );

  if (headerGizli) return null;

  return (
    <>
      <header className="sticky top-0 left-0 w-full bg-[#050814]/90 lg:bg-[#050814] backdrop-blur-md border-b border-white/5 transition-all duration-300 relative z-[100]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Mobil + tablet — logo üstte, arama fasulyesi altta */}
            <div className="lg:hidden w-full">
              <div className="grid grid-cols-[1fr_auto_1fr] items-center h-16 w-full">
              <div className="flex items-center gap-0.5 justify-self-start z-10">
                <button className="flex flex-col justify-center items-center w-10 h-10 focus:outline-none z-[100]" onClick={() => setMenuAcik(!menuAcik)} aria-label="Menü">
                  <span className={"block w-6 h-0.5 bg-white transition-all duration-300 " + (menuAcik ? "rotate-45 translate-y-1.5" : "")}></span>
                  <span className={"block w-6 h-0.5 bg-white mt-1 transition-all duration-300 " + (menuAcik ? "opacity-0" : "")}></span>
                  <span className={"block w-6 h-0.5 bg-white mt-1 transition-all duration-300 " + (menuAcik ? "-rotate-45 -translate-y-1.5" : "")}></span>
                </button>
                <div className={menuAcik ? "opacity-20 pointer-events-none" : ""}>
                  {mesajLink}
                </div>
              </div>

              <div
                className={`flex items-center justify-center justify-self-center self-center z-[5] transition-opacity ${menuAcik ? "opacity-20 pointer-events-none" : ""}`}
              >
                <BilginPcMarka size="sm" variant="horizontal" glow className="px-0.5 shrink-0" />
              </div>

              <div className={`flex items-center gap-0.5 justify-self-end z-10 ${menuAcik ? "pointer-events-none opacity-20" : ""}`}>
                {bildirimLink}
                {sepetLink}
              </div>
              </div>

              <div className={`flex items-center gap-2.5 px-3 sm:px-4 pb-3 pt-0.5 ${menuAcik ? "opacity-20 pointer-events-none" : ""}`}>
                <MobilProfilLink size={42} onNavigate={() => setMenuAcik(false)} />
                <Link
                  href="/arama"
                  aria-label="Ara"
                  className="flex flex-1 min-w-0 items-center gap-2.5 h-10 pl-3.5 pr-4 rounded-full bg-white/[0.05] border border-white/[0.09] text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-all duration-200 hover:bg-white/[0.08] hover:border-white/[0.14] active:scale-[0.99]"
                >
                  <Search className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="text-[13px] text-slate-500 truncate font-normal">Ürün, marka veya kategori ara...</span>
                </Link>
              </div>
            </div>

            {/* Masaüstü: logo + arama + sağ ikonlar aynı hizada */}
            <div className="hidden lg:flex items-center justify-between gap-4 py-3 min-h-[72px]">
              <BilginPcMarka size="md" variant="horizontal" />

              <Link
                href="/arama"
                className="relative flex-1 min-w-0 mx-1 lg:mx-3 flex items-center h-10 bg-white/[0.06] border border-white/[0.1] rounded-lg pl-9 pr-4 text-sm text-slate-500 hover:border-[#3b82f6]/50 hover:bg-white/[0.08] transition-colors"
              >
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <span className="truncate">Ürün, marka veya kategori ara...</span>
              </Link>

              <div className="flex items-center gap-1 lg:gap-2 shrink-0">
                <Link
                  href="/kendin-topla"
                  className="flex items-center gap-2 px-2 lg:px-3 py-1.5 text-white hover:text-[#3b82f6] text-xs lg:text-sm font-semibold transition-colors whitespace-nowrap"
                >
                  <span className="relative w-7 h-7 lg:w-8 lg:h-8 rounded-lg shrink-0 overflow-hidden hidden sm:block">
                    <KatalogGorsel src={KENDIN_TOPLA_KATALOG_IMG} alt="" displayPx={32} />
                  </span>
                  Kendin Topla
                </Link>
                <Link
                  href="/hesabim"
                  className="p-2 text-white hover:text-[#3b82f6] transition-colors"
                  aria-label="Hesabım"
                >
                  <ProfilAvatar size={28} />
                </Link>
                {mesajLink}
                {bildirimLink}
                {sepetLink}
              </div>
            </div>

          </div>

          {/* Katalog — sadece şerit + panel alanında açık kalır */}
          <div
            ref={katalogRef}
            className="hidden lg:block relative"
            onMouseLeave={() => setAcikSeritKatalog(null)}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-stretch gap-0.5 pb-2.5 pt-1 border-t border-white/[0.04]">
                {KATALOG_SERIT.map((kat) => {
                  const aktif = acikSeritKatalog === kat.id;
                  return (
                    <button
                      key={kat.id}
                      type="button"
                      title={kat.isim}
                      onMouseEnter={() => setAcikSeritKatalog(kat.id)}
                      className={`flex-1 min-w-0 px-1 py-1.5 text-center transition-colors border-b-2 text-white ${
                        aktif ? "border-[#3b82f6]" : "border-transparent hover:border-white/30"
                      }`}
                    >
                      <span className="text-[11px] lg:text-xs font-medium tracking-wide truncate block px-0.5">
                        {kat.kisaIsim}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {acikSeritKatalog && (
              <div className="absolute top-full left-0 w-full border-t border-white/[0.06] bg-[#050814]/98 backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.55)] z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[180px] flex items-center">
                  {KATALOG_SERIT.map((kat) => (
                    <div
                      key={kat.id}
                      className={`flex flex-wrap justify-start items-start gap-x-5 gap-y-4 w-full overflow-hidden ${
                        acikSeritKatalog === kat.id ? "" : "hidden"
                      }`}
                    >
                      {kat.altlar.map((k) => (
                        <ResimliKategoriKarti
                          key={`${kat.id}-${k.slug}-${k.isim}`}
                          k={k}
                          onNavigate={() => setAcikSeritKatalog(null)}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
      </header>

      {/* 📱 MOBİL MENÜ */}
      <div className={`lg:hidden fixed top-[7.25rem] left-0 w-full h-[calc(100vh-7.25rem)] bg-[#050814] z-[98] overflow-y-auto transition-transform duration-300 ${menuAcik ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="px-3 py-4 pb-32">

          {/* Kendin Topla */}
          <Link
            href="/kendin-topla"
            onClick={() => setMenuAcik(false)}
            className="flex items-center gap-2.5 px-2.5 py-2 mb-2 rounded-xl overflow-hidden border border-emerald-500/25 bg-white/[0.03] hover:bg-white/[0.06] transition-colors group"
          >
            <div className="relative w-12 h-12 rounded-lg shrink-0 overflow-hidden">
              <KatalogGorsel src={KENDIN_TOPLA_KATALOG_IMG} alt="Kendin Topla" displayPx={KATALOG_ICON_MOBILE_ANA} />
            </div>
            <span className="flex-1 text-left text-[13px] font-bold text-white">Kendin Topla</span>
            <ChevronDown className="w-4 h-4 text-emerald-500/70 shrink-0" />
          </Link>

          {/* Kategoriler — 6 ana, resimli accordion */}
          <MobilKatalogMenusu onClose={() => setMenuAcik(false)} hazir={menuAcik} />

        </div>
      </div>

      {/* 🚀 HEM PC HEM MOBİLDE EKRANIN TAM ORTASINA ÇÖKEN ULTRA LÜKS ONAY PANELİ */}
      {cikisOnayAcik && (
        <div className="fixed inset-0 z-[100005] flex items-center justify-center bg-[#050814]/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
          
          <div className="bg-[#09090b] border border-white/10 shadow-[0_0_50px_rgba(239,68,68,0.2)] rounded-2xl w-full max-w-[320px] overflow-hidden animate-in zoom-in-95 duration-150">
            
            <div className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 text-xl mb-4 shadow-[0_0_15px_rgba(239,68,68,0.15)]">
                🚪
              </div>
              <h3 className="text-white font-bold text-base mb-1 tracking-wide">Çıkış Yapılıyor</h3>
              <p className="text-gray-400 text-xs leading-relaxed px-2">Hesabınızdan güvenli bir şekilde ayrılmak istediğinize emin misiniz?</p>
            </div>

            <div className="flex border-t border-white/5 bg-[#121215]">
              <button onClick={() => setCikisOnayAcik(false)} className="w-full border-r border-white/5 px-4 py-3 text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors tracking-wide">
                İptal Et
              </button>
              <button onClick={async () => { 
                setCikisOnayAcik(false); 
                setHesabimAcik(false); 
                localStorage.removeItem("bilgin_kayitli_sistemler"); 
                await signOut({ redirect: false }); 
              }} className="w-full px-4 py-3 text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors tracking-wide uppercase">
                Çıkış Yap
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}