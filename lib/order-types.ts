export interface CustomerLike {
  ad?: string;
  isim?: string;
  soyad?: string;
  telefon?: string;
  eposta?: string;
  email?: string;
  adres?: string;
  ilce?: string;
  sehir?: string;
}

export interface OrderItemLike {
  _id?: string;
  id?: string;
  productId?: string;
  slug?: string;
  seoUrl?: string;
  url?: string;
  title?: string;
  isim?: string;
  name?: string;
  image?: string;
  resim?: string;
  gorsel?: string;
  quantity?: number;
  adet?: number;
  miktar?: number;
  price?: number | string;
  fiyat?: number | string;
  kategoriSlug?: string;
  kategori?: string;
}

export interface OrderLike {
  _id?: string;
  siparisKodu?: string;
  orderNumber?: string;
  durum?: string;
  status?: string;
  odemeDurumu?: string;
  createdAt?: string | Date;
  tarih?: string | Date;
  odemeYontemi?: string;
  paymentMethod?: string;
  siparisNotu?: string;
  musteriMesaji?: string;
  takipNo?: string;
  kargoTakipNo?: string;
  trackingNumber?: string;
  kargoFirmasi?: string;
  shippingCompany?: string;
  totalPrice?: number | string;
  toplamTutar?: number | string;
  genelToplam?: number | string;
  Tutar?: number | string;
  items?: OrderItemLike[];
  sepet?: OrderItemLike[];
  cartItems?: OrderItemLike[];
  customerDetails?: CustomerLike;
  shippingAddress?: CustomerLike;
  musteri?: CustomerLike;
  email?: string;
  userEmail?: string;
  gizlendi?: boolean;
  musteriyeGoster?: boolean;
  rezervIadeEdildi?: boolean;
}
