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
  price?: number;
  fiyat?: number;
  kategoriSlug?: string;
  kategori?: string;
}

export interface OrderLike {
  _id?: string;
  siparisKodu?: string;
  orderNumber?: string;
  durum?: string;
  status?: string;
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
  totalPrice?: number;
  toplamTutar?: number;
  genelToplam?: number;
  items?: OrderItemLike[];
  sepet?: OrderItemLike[];
  customerDetails?: Record<string, unknown>;
  shippingAddress?: Record<string, unknown>;
  musteri?: Record<string, any>;
  email?: string;
  userEmail?: string;
  gizlendi?: boolean;
}
