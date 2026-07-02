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
  Package,
} from "lucide-react";

export const NAV_ITEMS = [
  { href: "/hesabim",            label: "Profilim ve Hesap Özeti",        icon: User,          id: "hesabim" },
  { href: "/cuzdan",             label: "Cüzdanım ve Kayıtlı Kartlar",    icon: CreditCard,    id: "cuzdan" },
  { href: "/siparislerim",       label: "Siparişlerim",                   icon: Package,       id: "siparisler" },
  { href: "/kargolarim",         label: "Kargoya Verilen Siparişlerim",   icon: Truck,         id: "kargolar" },
  { href: "/siparis-takip",      label: "Sipariş Numarası ile Sorgula",   icon: Search,        id: "sorgula" },
  { href: "/favorilerim",        label: "Favori Ürünlerim",               icon: Star,          id: "favoriler" },
  { href: "/sistemlerim",        label: "Toplama Bilgisayar Sistemlerim", icon: Server,        id: "sistemler" },
  { href: "/destek-taleplerim",  label: "Destek Taleplerim",              icon: Headset,       id: "destek" },
  { href: "/mesajlarim",         label: "Gelen Mesajlarım",               icon: MessageSquare, id: "mesajlarim" },
  { href: "/guvenlik",           label: "Güvenlik ve Oturum Açma",        icon: ShieldCheck,   id: "guvenlik" },
  { href: "/adreslerim",         label: "Teslimat Adreslerim",            icon: MapPin,        id: "adreslerim" },
  { href: "/eposta-degistir",    label: "E-posta Adresimi Değiştir",      icon: Mail,          id: "eposta-degistir" },
  { href: "/veri-talebi",        label: "Kişisel Veri Talebi",            icon: Database,      id: "veri-talebi" },
  { href: "/yorumlarim",         label: "Ürün Yorumlarım",                icon: Star,          id: "yorumlarim" },
  { href: "/siparis-yorumlarim", label: "Sipariş Yorumlarım",             icon: Star,          id: "siparis-yorumlarim" },
] as const;

export type NavItemId = (typeof NAV_ITEMS)[number]["id"];

/** Mobil hesap menüsü — gruplu kutular (Amazon tarzı) */
export const NAV_MENU_GRUPLARI: { baslik: string; ids: NavItemId[] }[] = [
  {
    baslik: "Hesabım ve Ödemeler",
    ids: ["hesabim", "cuzdan"],
  },
  {
    baslik: "Siparişlerim",
    ids: ["siparisler", "kargolar", "sorgula"],
  },
  {
    baslik: "Favoriler ve Toplama Sistemlerim",
    ids: ["favoriler", "sistemler"],
  },
  {
    baslik: "Yardım ve İletişim",
    ids: ["destek", "mesajlarim"],
  },
  {
    baslik: "Güvenlik ve Hesap Ayarları",
    ids: ["guvenlik", "adreslerim", "eposta-degistir", "veri-talebi", "yorumlarim", "siparis-yorumlarim"],
  },
];

export function navItemBul(id: NavItemId) {
  return NAV_ITEMS.find((i) => i.id === id);
}
