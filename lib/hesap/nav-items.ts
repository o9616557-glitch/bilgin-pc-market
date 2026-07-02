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
