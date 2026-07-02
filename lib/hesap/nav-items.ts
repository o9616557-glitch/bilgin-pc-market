import {
  User,
  ShieldCheck,
  CreditCard,
  MessageSquare,
  Database,
  Mail,
  Star,
  MapPin,
  Server,
  Headset,
  Search,
  Truck,
} from "lucide-react";

export const NAV_ITEMS = [
  { href: "/hesabim",            label: "Profil",             icon: User,          id: "hesabim" },
  { href: "/cuzdan",             label: "Cüzdan",              icon: CreditCard,    id: "cuzdan" },
  { href: "/guvenlik",           label: "Güvenlik",            icon: ShieldCheck,   id: "guvenlik" },
  { href: "/favorilerim",        label: "Favoriler",           icon: Star,          id: "favoriler" },
  { href: "/sistemlerim",        label: "Sistemler",           icon: Server,        id: "sistemler" },
  { href: "/destek-taleplerim",  label: "Destek",              icon: Headset,       id: "destek" },
  { href: "/siparis-takip",      label: "Sorgula",             icon: Search,        id: "sorgula" },
  { href: "/kargolarim",         label: "Kargolar",            icon: Truck,         id: "kargolar" },
  { href: "/mesajlarim",         label: "Mesajlar",            icon: MessageSquare, id: "mesajlarim" },
  { href: "/veri-talebi",        label: "Veri Talebi",         icon: Database,      id: "veri-talebi" },
  { href: "/eposta-degistir",    label: "E-posta Değiştir",    icon: Mail,          id: "eposta-degistir" },
  { href: "/yorumlarim",         label: "Ürün Yorumları",      icon: Star,          id: "yorumlarim" },
  { href: "/siparis-yorumlarim", label: "Sipariş Yorumları",   icon: Star,          id: "siparis-yorumlarim" },
  { href: "/adreslerim",         label: "Adreslerim",          icon: MapPin,        id: "adreslerim" },
] as const;

export type NavItemId = (typeof NAV_ITEMS)[number]["id"];

/** Mobil hesap menüsü — gruplu kutular (Amazon tarzı) */
export const NAV_MENU_GRUPLARI: { baslik: string; ids: NavItemId[] }[] = [
  {
    baslik: "Profil & Ödeme",
    ids: ["hesabim", "cuzdan"],
  },
  {
    baslik: "Siparişler",
    ids: ["kargolar", "sorgula"],
  },
  {
    baslik: "Alışverişim",
    ids: ["favoriler", "sistemler"],
  },
  {
    baslik: "Müşteri Hizmetleri",
    ids: ["destek", "mesajlarim"],
  },
  {
    baslik: "Hesap Ayarları",
    ids: ["guvenlik", "adreslerim", "eposta-degistir", "veri-talebi", "yorumlarim", "siparis-yorumlarim"],
  },
];

export function navItemBul(id: NavItemId) {
  return NAV_ITEMS.find((i) => i.id === id);
}
