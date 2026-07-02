export interface RefundItemLike {
  urunId: string;
  isim?: string;
  adet: number;
  birimFiyat?: number;
  iadeEdilebilirAdet?: number;
}

export interface SupportMessageLike {
  gonderen?: "admin" | "musteri" | string;
  mesaj?: string;
  tarih?: string | Date;
}

export interface SupportRequestLike {
  _id: string;
  konu?: "iade" | "iptal" | "teknik" | string;
  durum?: string;
  iadeOdendi?: boolean;
  onerilenIadeTutar?: number;
  kalanIadeEdilebilir?: number;
  siparisTutari?: number;
  iadeKalemleri?: RefundItemLike[];
  siparisKalemleri?: RefundItemLike[];
  iadeBaslangicSecim?: Record<string, number>;
  iadeBaslangicTutar?: number;
  iadeKismiTalep?: boolean;
  mesajlar?: SupportMessageLike[];
  musteriAdi?: string;
  musteriEmail?: string;
  siparisNo?: string;
  mesaj?: string;
  createdAt?: string | Date;
}

export interface ReviewLike {
  _id: string;
  onaylandi?: boolean;
  answer?: string;
  cevap?: string;
  rating?: number;
  puan?: number;
  userName?: string;
  kullaniciAdi?: string;
  name?: string;
  comment?: string;
  yorum?: string;
  productName?: string;
  urunAdi?: string;
  createdAt?: string | Date;
}

