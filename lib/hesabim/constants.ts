import {
  User,
  ShieldCheck,
  CreditCard,
  Package,
  Server,
  Truck,
  Star,
  MapPin,
  Search,
  Headset,
} from "lucide-react";

export const RENK_SECENEKLERI = [
  { text: "text-white", bg: "bg-white border-slate-300", badge: "bg-white/10 text-white border-white/20", hex: "#ffffff" },
  { text: "text-slate-400", bg: "bg-slate-400 border-slate-300", badge: "bg-slate-400/10 text-slate-400 border-slate-400/20", hex: "#94a3b8" },
  { text: "text-red-500", bg: "bg-red-500 border-red-400", badge: "bg-red-500/10 text-red-500 border-red-500/20", hex: "#ef4444" },
  { text: "text-orange-500", bg: "bg-orange-500 border-orange-400", badge: "bg-orange-500/10 text-orange-500 border-orange-500/20", hex: "#f97316" },
  { text: "text-amber-500", bg: "bg-amber-500 border-amber-400", badge: "bg-amber-500/10 text-amber-500 border-amber-500/20", hex: "#f59e0b" },
  { text: "text-yellow-400", bg: "bg-yellow-400 border-yellow-300", badge: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20", hex: "#facc15" },
  { text: "text-green-500", bg: "bg-green-500 border-green-400", badge: "bg-green-500/10 text-green-500 border-green-500/20", hex: "#22c55e" },
  { text: "text-emerald-400", bg: "bg-emerald-400 border-emerald-300", badge: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20", hex: "#34d399" },
  { text: "text-cyan-400", bg: "bg-cyan-400 border-cyan-300", badge: "bg-cyan-400/10 text-cyan-400 border-cyan-400/20", hex: "#22d3ee" },
  { text: "text-blue-500", bg: "bg-blue-500 border-blue-400", badge: "bg-blue-500/10 text-blue-500 border-blue-500/20", hex: "#3b82f6" },
  { text: "text-indigo-400", bg: "bg-indigo-400 border-indigo-300", badge: "bg-indigo-400/10 text-indigo-400 border-indigo-400/20", hex: "#818cf8" },
  { text: "text-purple-500", bg: "bg-purple-500 border-purple-400", badge: "bg-purple-500/10 text-purple-500 border-purple-500/20", hex: "#a855f7" },
  { text: "text-rose-500", bg: "bg-rose-500 border-rose-400", badge: "bg-rose-500/10 text-rose-500 border-rose-500/20", hex: "#f43f5e" },
];

export const VARSAYILAN_UST_MENU = [
  { id: "siparisler", isim: "Siparişler", ikon: Package, renk: "text-blue-400", isLink: true, href: "/siparislerim" },
  { id: "favoriler", isim: "Favoriler", ikon: Star, renk: "text-purple-400", isLink: true, href: "/favorilerim" },
  { id: "adresler", isim: "Adresler", ikon: MapPin, renk: "text-cyan-400", isLink: true, href: "/adreslerim" },
  { id: "sistemler", isim: "Sistemler", ikon: Server, renk: "text-emerald-400", isLink: true, href: "/sistemlerim" },
];

export const VARSAYILAN_ALT_MENU = [
  { id: "favoriler", isim: "Favoriler", ikon: Star, renk: "text-purple-400", isLink: true, href: "/favorilerim" },
  { id: "sistemler", isim: "Sistemler", ikon: Server, renk: "text-emerald-400", isLink: true, href: "/sistemlerim" },
  { id: "destek", isim: "Destek", ikon: Headset, renk: "text-orange-400", isLink: true, href: "/destek-taleplerim" },
  { id: "sorgula", isim: "Sorgula", ikon: Search, renk: "text-blue-400", isLink: true, href: "/siparis-takip" },
  { id: "kargolar", isim: "Kargolar", ikon: Truck, renk: "text-rose-400", isLink: true, href: "/kargolarim" },
];

export function ikonEslestir(liste: any[]) {
  return liste.map((item: any) => {
    let ikonBileseni = Star;
    if (item.id === "profil") ikonBileseni = User;
    if (item.id === "cuzdan") ikonBileseni = CreditCard;
    if (item.id === "guvenlik") ikonBileseni = ShieldCheck;
    if (item.id === "adresler") ikonBileseni = MapPin;
    if (item.id === "sistemler") ikonBileseni = Server;
    if (item.id === "kargolar") ikonBileseni = Truck;
    if (item.id === "destek") ikonBileseni = Headset;
    if (item.id === "sorgula") ikonBileseni = Search;
    return { ...item, ikon: ikonBileseni };
  });
}
