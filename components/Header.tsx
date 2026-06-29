"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/app/CartContext";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { Search, X, Clock, Flame, ArrowRight, ChevronRight, ChevronDown, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
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
  "https://res.cloudinary.com/dtnbkoa9s/image/upload/v1782760508/Ads%C4%B1z_512_x_512_piksel_36_b43ahm.png";

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

const KATALOG_TUM_URUNLER = KATALOG_SERIT.flatMap((kat) =>
  kat.altlar.map((a) => ({ name: a.isim, slug: a.slug }))
);

function akilliKategoriBul(metin: string) {
  if (!metin) return null;
  const k = metin.toLowerCase();

  if (k.includes("topla") || k.includes("kendin") || k.includes("sihirbaz")) return { isim: "Kendin Topla", slug: "kendin-topla" };
  if (k.includes("ekran") || k.includes("rtx") || k.includes("gtx") || k.includes("rx ") || k.includes("4070") || k.includes("4080") || k.includes("4090") || k.includes("5070") || k.includes("5080") || k.includes("5090") || k.includes("vga")) return { isim: "Ekran Kartları", slug: "ekran-karti" };
  if (k.includes("işlemci") || k.includes("islemci") || k.includes("intel") || k.includes("ryzen") || k.includes("cpu")) return { isim: "İşlemciler", slug: "islemci" };
  if (k.includes("anakart") || k.includes("motherboard") || k.includes("z790") || k.includes("b650") || k.includes("x670")) return { isim: "Anakartlar", slug: "anakart" };
  if (k.includes("laptop") || k.includes("notebook")) return { isim: "Laptoplar", slug: "laptop" };
  if (k.includes("kasa") || k.includes("kabin")) return { isim: "Kasalar", slug: "kasa" };
  if (k.includes("ram") || k.includes("bellek") || k.includes("ddr")) return { isim: "RAM Bellekler", slug: "ram" };
  if (k.includes("monitör") || k.includes("monitor") || k.includes("ekran")) return { isim: "Monitörler", slug: "monitor" };

  return null;
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
    <Image
      src={cloudinaryKatalogResim(src, displayPx)}
      alt={alt}
      fill
      sizes={`${displayPx}px`}
      className="object-contain p-1"
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
      prefetch={false}
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
      prefetch={false}
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

function MobilKatalogMenusu({ onClose }: { onClose: () => void }) {
  const [acikAna, setAcikAna] = useState<string | null>(null);

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

              <div
                className="grid transition-[grid-template-rows] duration-300 ease-in-out"
                style={{ gridTemplateRows: acik ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden min-h-0">
                  <div className="grid grid-cols-3 gap-2 py-2.5 px-0.5">
                    {ana.altlar.map((k) => (
                      <MobilAltKategoriKarti
                        key={`${k.slug}-${k.isim}`}
                        k={k}
                        onClose={onClose}
                      />
                    ))}
                  </div>
                </div>
              </div>
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
        className={`rounded-full bg-white/[0.08] animate-pulse ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  if (userImage) {
    return (
      <Image
        src={userImage}
        alt={userName}
        width={size}
        height={size}
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

function MobilLogoAlani({ menuAcik }: { menuAcik: boolean }) {
  const { data: session, status } = useSession();
  const href = session ? "/hesabim" : "/giris";

  if (status === "loading") {
    return <div className="md:hidden w-9 h-9 rounded-full bg-white/[0.06] animate-pulse" />;
  }

  return (
    <Link
      href={href}
      prefetch={false}
      className={`md:hidden relative z-[100] transition-all ${menuAcik ? "opacity-20 pointer-events-none" : ""}`}
    >
      <ProfilAvatar size={36} />
    </Link>
  );
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const gizlenecekSayfalar = ["/sepet", "/odeme", "/giris", "/kayit", "/checkout"];
  if (gizlenecekSayfalar.includes(pathname)) return null; 

  const { sepet } = useCart();
  const [menuAcik, setMenuAcik] = useState(false);
  const [hesabimAcik, setHesabimAcik] = useState(false);
  const [acikSeritKatalog, setAcikSeritKatalog] = useState<string | null>(null);
  const seritRef = useRef<HTMLDivElement>(null);
  
  const [aramaAcik, setAramaAcik] = useState(false);
  const [aramaMetni, setAramaMetni] = useState("");
  const [canliSonuclar, setCanliSonuclar] = useState<any[]>([]);
  const [populerUrunler, setPopulerUrunler] = useState<any[]>([]);
  const [sonAramalar, setSonAramalar] = useState<string[]>([]);
  const [aramaYukleniyor, setAramaYukleniyor] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const hesabimRef = useRef<HTMLDivElement>(null);
  
  const sepetAdedi = sepet.reduce((toplam: number, urun: any) => toplam + (urun.adet || 1), 0);
  const { data: session } = useSession();
  const isAdmin = session?.user?.email?.toLowerCase() === "o9616557@gmail.com";
  const [cikisOnayAcik, setCikisOnayAcik] = useState(false); // 🚀 YENİ EKLEDİĞİMİZ MERKEZİ ONAY MOTORU
  // 🚀 GÜVENLİK MOTORU: Çıkış yaparken çırağın defterini yakar
  const guvenliCikisYap = async () => {
    localStorage.removeItem("bilgin_kayitli_sistemler");
    await signOut(); 
  };
  // 🚀 KAPIDAKİ AKILLI ÇIRAK MOTORU (SADECE GİRİŞ YAPINCA ÇALIŞIR)
  useEffect(() => {
    // Şefim giriş yapmadıysa çırak yerinden kıpırdamaz, bekler.
    if (!session?.user?.email) return;

    const cirakDepoyaKossun = async () => {
      try {
        const res = await fetch("/api/sistemlerim?t=" + new Date().getTime());
        
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            localStorage.setItem("bilgin_kayitli_sistemler", JSON.stringify(data.systems));
          }
        }
      } catch (error) {}
    };

    cirakDepoyaKossun();
  }, [session]);
// 🔥 ŞEFİN KUSURSUZ KATEGORİ BULUCU MOTORU 🔥
const kelimeTemizle = (metin: string) => {
  return metin.toLowerCase()
    .replace(/[\s-]/g, '') 
    .replace(/ı/g, 'i').replace(/ü/g, 'u').replace(/ö/g, 'o')
    .replace(/ş/g, 's').replace(/ç/g, 'c').replace(/ğ/g, 'g');
};

const aramaMetniTemiz = kelimeTemizle(aramaMetni);

const bulunanKategoriler = aramaMetniTemiz.length > 1 
  ? KATALOG_TUM_URUNLER.filter(item => 
      kelimeTemizle(item.name).includes(aramaMetniTemiz) || 
      kelimeTemizle(item.slug).includes(aramaMetniTemiz)
    )
  : [];
  useEffect(() => {
    if (!acikSeritKatalog) return;
    const disariTikla = (e: MouseEvent) => {
      if (seritRef.current && !seritRef.current.contains(e.target as Node)) {
        setAcikSeritKatalog(null);
      }
    };
    document.addEventListener("mousedown", disariTikla);
    return () => document.removeEventListener("mousedown", disariTikla);
  }, [acikSeritKatalog]);

  const seciliKatalog = KATALOG_SERIT.find((k) => k.id === acikSeritKatalog);

  useEffect(() => {
    const kayitliAramalar = localStorage.getItem("sonAramalar");
    if (kayitliAramalar) setSonAramalar(JSON.parse(kayitliAramalar));
  }, []);

  useEffect(() => {
    fetch("/api/arama?init=true")
      .then(res => res.json())
      .then(data => setPopulerUrunler(data))
      .catch(() => setPopulerUrunler([]));
  }, []);

  useEffect(() => {
    if (aramaAcik) {
      setTimeout(() => searchInputRef.current?.focus(), 30);
      document.body.style.overflow = "hidden";
    } else {
      setAramaMetni("");
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [aramaAcik]);

  useEffect(() => {
    if (aramaMetni.trim().length >= 2) {
      setAramaYukleniyor(true);
      const timer = setTimeout(async () => {
        try {
          const res = await fetch("/api/arama?q=" + encodeURIComponent(aramaMetni));
          const data = await res.json();
          setCanliSonuclar(data);
        } catch (e) { 
          setCanliSonuclar([]); 
        }
        setAramaYukleniyor(false);
      }, 150); 
      return () => clearTimeout(timer);
    } else {
      setCanliSonuclar([]);
    }
  }, [aramaMetni]);

  useEffect(() => {
    function disariTiklandi(event: any) {
      if (hesabimRef.current && !hesabimRef.current.contains(event.target)) setHesabimAcik(false);
    }
    document.addEventListener("mousedown", disariTiklandi);
    return () => document.removeEventListener("mousedown", disariTiklandi);
  }, []);
// 🚀 HAMBURGER VEYA HESABIM AÇILINCA SAYFAYI BETON GİBİ DONDURAN KİLİT
  useEffect(() => {
    if (menuAcik || hesabimAcik) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuAcik, hesabimAcik]);
const handleAramaSubmit = (e?: React.FormEvent, ozelKelime?: string) => {
    if (e) e.preventDefault();
    const aranacak = ozelKelime || aramaMetni;
    
    if (aranacak.trim()) {
      const yeniAramalar = [aranacak, ...sonAramalar.filter(k => k !== aranacak)].slice(0, 3);
      setSonAramalar(yeniAramalar);
      localStorage.setItem("sonAramalar", JSON.stringify(yeniAramalar));
      
      setAramaAcik(false);
      
      // ❌ ESKİ KOD: Sayfayı tamamen yenileyip loading ekranına düşürüyordu
      // window.location.href = "/arama?q=" + encodeURIComponent(aranacak);
      
      // ✅ YENİ KOD: Sayfa yenilenmeden, fişek gibi arama sonuçlarına geçer
      router.push("/arama?q=" + encodeURIComponent(aranacak));
    }
  };

  const gecmisAramayiSil = (kelime: string) => {
    const yeni = sonAramalar.filter(k => k !== kelime);
    setSonAramalar(yeni);
    localStorage.setItem("sonAramalar", JSON.stringify(yeni));
  };

  return (
    <>
      <header className="sticky top-0 left-0 w-full z-[99] bg-[#050814]/90 backdrop-blur-md border-b border-white/5 transition-all duration-300 relative">
        <div
          ref={seritRef}
          onMouseLeave={() => setAcikSeritKatalog(null)}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Mobil üst satır */}
            <div className="flex md:hidden items-center justify-between h-20 gap-2 sm:gap-4">
              <div className="flex-shrink-0 flex items-center gap-3">
                <button className="flex flex-col justify-center items-center w-10 h-10 focus:outline-none z-[100]" onClick={() => setMenuAcik(!menuAcik)}>
                  <span className={"block w-6 h-0.5 bg-white transition-all duration-300 " + (menuAcik ? "rotate-45 translate-y-1.5" : "")}></span>
                  <span className={"block w-6 h-0.5 bg-white mt-1 transition-all duration-300 " + (menuAcik ? "opacity-0" : "")}></span>
                  <span className={"block w-6 h-0.5 bg-white mt-1 transition-all duration-300 " + (menuAcik ? "-rotate-45 -translate-y-1.5" : "")}></span>
                </button>
                <MobilLogoAlani menuAcik={menuAcik} />
              </div>
              <div className={`flex items-center gap-1 shrink-0 ${menuAcik ? "pointer-events-none opacity-20" : ""}`}>
                <button type="button" onClick={() => setAramaAcik(true)} className="p-2 text-white hover:text-[#3b82f6] transition-colors" aria-label="Ara">
                  <Search className="w-5 h-5 shrink-0" />
                </button>
                <Link href="/sepet" prefetch={false} className="relative p-2 text-white hover:text-[#3b82f6] transition-colors" aria-label="Sepet">
                  <div className="relative">
                    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    {sepetAdedi > 0 && (
                      <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#050814] shadow-[0_0_4px_rgba(239,68,68,0.4)] select-none leading-none pt-[0.5px]">
                        {sepetAdedi}
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            </div>

            {/* Masaüstü: logo + arama + sağ ikonlar aynı hizada */}
            <div className="hidden md:flex items-center justify-between gap-4 py-3 min-h-[72px]">
              <Link href="/" prefetch={false} className="text-white font-black text-2xl tracking-tight items-center shrink-0">
                BİLGİN <span className="text-[#3b82f6] ml-1">PC</span>
              </Link>

              <form onSubmit={handleAramaSubmit} className="relative flex-1 min-w-0 mx-1 lg:mx-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Ürün, marka veya kategori ara..."
                  value={aramaMetni}
                  onChange={(e) => setAramaMetni(e.target.value)}
                  onFocus={() => setAramaAcik(true)}
                  className="w-full h-10 bg-white/[0.06] border border-white/[0.1] rounded-lg pl-9 pr-3 text-sm text-white placeholder-slate-500 outline-none focus:border-[#3b82f6]/50 focus:bg-white/[0.08] transition-colors"
                />
              </form>

              <div className="flex items-center gap-1 lg:gap-2 shrink-0">
                <Link
                  href="/kendin-topla"
                  prefetch={false}
                  className="flex items-center gap-2 px-2 lg:px-3 py-1.5 text-white hover:text-[#3b82f6] text-xs lg:text-sm font-semibold transition-colors whitespace-nowrap"
                >
                  <span className="relative w-7 h-7 lg:w-8 lg:h-8 rounded-lg shrink-0 overflow-hidden hidden sm:block">
                    <KatalogGorsel src={KENDIN_TOPLA_KATALOG_IMG} alt="" displayPx={32} />
                  </span>
                  Kendin Topla
                </Link>
                <Link
                  href={session ? "/hesabim" : "/giris"}
                  prefetch={false}
                  className="p-1 rounded-full hover:ring-2 hover:ring-[#3b82f6]/30 transition-all"
                  aria-label="Hesabım"
                >
                  <ProfilAvatar size={34} />
                </Link>
                <Link href="/sepet" prefetch={false} className="relative p-2 text-white hover:text-[#3b82f6] transition-colors" aria-label="Sepet">
                  <div className="relative">
                    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    {sepetAdedi > 0 && (
                      <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#050814] shadow-[0_0_4px_rgba(239,68,68,0.4)] select-none leading-none pt-[0.5px]">
                        {sepetAdedi}
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            </div>

            {/* Masaüstü: 6 kategori — arama altında */}
            <div className="hidden md:flex items-stretch gap-0.5 pb-2.5 pt-1 border-t border-white/[0.04]">
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

          {/* Overlay panel — sabit boy, eşit aralık */}
          {seciliKatalog && (
            <div className="hidden md:block absolute top-full left-0 w-full border-t border-white/[0.06] bg-[#050814]/98 backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.55)] z-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[180px] flex items-center">
                <div className="flex flex-wrap justify-start items-start gap-x-5 gap-y-4 w-full overflow-hidden">
                  {seciliKatalog.altlar.map((k) => (
                    <ResimliKategoriKarti
                      key={`${k.slug}-${k.isim}`}
                      k={k}
                      onNavigate={() => setAcikSeritKatalog(null)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* 📱 MOBİL MENÜ */}
      <div className={`md:hidden fixed top-[80px] left-0 w-full h-[calc(100vh-80px)] bg-[#050814] z-[98] overflow-y-auto transition-transform duration-300 ${menuAcik ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="px-3 py-4 pb-32">

          {/* Kendin Topla */}
          <Link
            href="/kendin-topla"
            prefetch={false}
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
          <MobilKatalogMenusu onClose={() => setMenuAcik(false)} />

        </div>
      </div>

      {/* Arama paneli — site tasarımına uyumlu */}
      {aramaAcik && (
        <div className="fixed inset-0 z-[99999] site-page flex flex-col overflow-hidden animate-in fade-in duration-200">
          <div className="site-glow-top top-0 left-1/2 -translate-x-1/2 w-[min(700px,100vw)] h-[200px] pointer-events-none" />

          <div className="glass-panel border-b border-white/[0.06] rounded-none shrink-0 relative z-10">
            <div className="site-container max-w-4xl py-4 flex items-center gap-3 sm:gap-4">
              <form onSubmit={handleAramaSubmit} className="relative flex-1 w-full">
                <button type="submit" className="absolute inset-y-0 left-0 pl-4 flex items-center z-10">
                  <Search className="w-5 h-5 text-site-accent" />
                </button>

                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Ürün, marka veya kategori ara..."
                  value={aramaMetni}
                  onChange={(e) => setAramaMetni(e.target.value)}
                  className="w-full h-12 sm:h-14 bg-site-shell/60 border border-white/[0.08] focus:border-site-accent/50 focus:bg-site-shell rounded-xl pl-12 pr-12 text-base sm:text-lg text-white placeholder-slate-500 outline-none transition-all"
                />

                {aramaMetni && (
                  <button type="button" onClick={() => setAramaMetni("")} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white z-10">
                    <X className="w-5 h-5" />
                  </button>
                )}
              </form>

              <button onClick={() => setAramaAcik(false)} className="text-slate-400 hover:text-white p-2 font-medium text-xs sm:text-sm shrink-0 transition-colors">
                Kapat
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto site-container max-w-4xl py-6 sm:py-8 pb-28 relative z-10 site-content-in">
         {aramaMetni.length > 0 ? (
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 w-full items-start">
                <div className="w-full md:w-[280px] shrink-0">
                  <h3 className="site-label flex items-center gap-2 border-b border-white/[0.06] pb-3 mb-4">
                    <Search className="w-3.5 h-3.5 text-site-accent" /> İlgili kategoriler
                  </h3>

                  {bulunanKategoriler.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {bulunanKategoriler.map((kat) => (
                        <Link
                          key={kat.slug}
                          href={"/kategori/" + kat.slug}
                          prefetch={false}
                          onClick={() => setAramaAcik(false)}
                          className="glass-panel px-4 py-3 hover:border-site-accent/30 text-slate-300 hover:text-white rounded-xl transition-all flex items-center gap-3 text-sm font-medium group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] group-hover:border-site-accent/30 flex items-center justify-center shrink-0 transition-all">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-500 group-hover:bg-site-accent transition-all" />
                          </div>
                          <span className="flex-1">{kat.name}</span>
                          <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-site-accent transition-all" />
                        </Link>
                      ))}
                    </div>
                 ) : null}
                </div>
                <div className="w-full flex-1 min-w-0">
                  <h3 className="site-label flex items-center gap-2 border-b border-white/[0.06] pb-3 mb-4">
                    {aramaYukleniyor ? <Loader2 className="w-3.5 h-3.5 animate-spin text-site-accent" /> : <Search className="w-3.5 h-3.5" />}
                    Ürün sonuçları
                  </h3>

                  {canliSonuclar.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                      {canliSonuclar.map((urun) => (
                        <Link
                          key={urun._id}
                          href={"/product/" + urun.slug}
                          prefetch={false}
                          onClick={() => setAramaAcik(false)}
                          className="glass-card p-4 hover:border-site-accent/25 rounded-xl transition-all flex items-center gap-4 group"
                        >
                          <div className="w-16 h-16 bg-site-shell rounded-xl p-2 flex shrink-0 items-center justify-center border border-white/[0.06]">
                            <img src={urun.resim} alt={urun.isim} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-medium text-white line-clamp-2 leading-snug mb-1">{urun.isim}</span>
                            <span className="text-base font-semibold text-site-accent">{Number(urun.fiyat).toLocaleString("tr-TR")} ₺</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    !aramaYukleniyor && (
                      <div className="text-center py-16 flex flex-col items-center justify-center glass-card border-dashed">
                        <span className="text-3xl mb-3 opacity-30">🔍</span>
                        <span className="site-body text-sm">Aradığınız kriterde ürün bulunamadı.</span>
                      </div>
                    )
                  )}
                </div>

              </div>
            ) : (
              <div className="space-y-8">
                {sonAramalar.length > 0 && (
                  <div>
                    <h3 className="site-label flex items-center gap-2 mb-4">
                      <Clock className="w-4 h-4" /> Son aramalar
                    </h3>
                    <div className="flex flex-col glass-card overflow-hidden divide-y divide-white/[0.06]">
                      {sonAramalar.map((kelime, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 hover:bg-white/[0.03] transition-colors group cursor-pointer" onClick={() => handleAramaSubmit(undefined, kelime)}>
                          <span className="text-slate-300 group-hover:text-site-accent text-sm">&ldquo;{kelime}&rdquo;</span>
                          <button onClick={(e) => { e.stopPropagation(); gecmisAramayiSil(kelime); }} className="text-slate-500 hover:text-red-400 p-1">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {populerUrunler.length > 0 && (
                  <div>
                    <h3 className="site-label mb-4">En çok satanlar</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {populerUrunler.map((urun) => (
                        <Link
                          key={urun._id}
                          href={"/product/" + urun.slug}
                          prefetch={false}
                          onClick={() => setAramaAcik(false)}
                          className="glass-card p-3 hover:border-site-accent/25 group transition-all flex flex-col"
                        >
                          <div className="aspect-square bg-site-shell rounded-xl mb-3 flex items-center justify-center p-2 border border-white/[0.06]">
                             <img src={urun.resim} alt={urun.isim} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform" />
                          </div>
                          <h4 className="text-xs text-slate-300 font-medium line-clamp-2 flex-1 mb-2">{urun.isim}</h4>
                          <span className="text-sm font-semibold text-site-accent">{Number(urun.fiyat).toLocaleString("tr-TR")} ₺</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
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