// @ts-ignore
import Iyzipay from "iyzipay";
// @ts-ignore
import "postman-request";
import { iyzicoConfig } from "@/lib/iyzico-config";

function iyzipayOrnegi() {
  return new Iyzipay(iyzicoConfig());
}

function iyzicoCagri<T>(fn: (cb: (err: unknown, result: T) => void) => void): Promise<T> {
  return new Promise((resolve, reject) => {
    fn((err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

export function sktYilIyzico(yil: string): string {
  const temiz = String(yil).trim();
  if (temiz.length === 4) return temiz;
  if (temiz.length === 2) return `20${temiz}`;
  return temiz;
}

export interface IyzicoKartSonuc {
  cardUserKey: string;
  cardToken: string;
  lastFourDigits?: string;
  cardAssociation?: string;
}

/** İyzico hata kodu 3007 — hesapta Kart Saklama eklentisi aktif değil */
export class IyzicoKartHata extends Error {
  errorCode?: string;
  kartSaklamaKapali: boolean;

  constructor(message: string, errorCode?: string) {
    super(message);
    this.name = "IyzicoKartHata";
    this.errorCode = errorCode;
    this.kartSaklamaKapali =
      errorCode === "3007" || /kart saklama.*tanımlı değil/i.test(message);
  }
}

export const IYZICO_KART_SAKLAMA_UYARI =
  "İyzico hesabınızda Kart Saklama eklentisi aktif değil. Panel → Eklentiler → Kart Saklama'yı satın alıp aktifleştirin (hata kodu: 3007). Eklenti açılana kadar kart yalnızca cüzdanda görünür; ödemede İyzico'ya taşınamaz.";

export async function iyzicoKartKaydet(opts: {
  email: string;
  cardNumber: string;
  holderName: string;
  expiryMonth: string;
  expiryYear: string;
  cardUserKey?: string;
  externalId?: string;
}): Promise<IyzicoKartSonuc> {
  const iyzipay = iyzipayOrnegi();
  const talep: Record<string, unknown> = {
    locale: "tr",
    conversationId: crypto.randomUUID(),
    card: {
      cardAlias: opts.holderName.trim().slice(0, 50),
      cardHolderName: opts.holderName.trim().toUpperCase(),
      cardNumber: opts.cardNumber.replace(/\D/g, ""),
      expireMonth: String(opts.expiryMonth).padStart(2, "0"),
      expireYear: sktYilIyzico(opts.expiryYear),
    },
  };

  if (opts.cardUserKey) {
    talep.cardUserKey = opts.cardUserKey;
  } else {
    talep.email = opts.email;
    if (opts.externalId) talep.externalId = opts.externalId;
  }

  const sonuc: any = await iyzicoCagri((cb) => iyzipay.card.create(talep, cb));

  if (sonuc.status !== "success" || !sonuc.cardUserKey || !sonuc.cardToken) {
    throw new IyzicoKartHata(
      sonuc.errorMessage || "Kart İyzico'ya kaydedilemedi.",
      sonuc.errorCode
    );
  }

  return {
    cardUserKey: sonuc.cardUserKey,
    cardToken: sonuc.cardToken,
    lastFourDigits: sonuc.lastFourDigits,
    cardAssociation: sonuc.cardAssociation,
  };
}

export async function iyzicoKartSil(cardUserKey: string, cardToken: string): Promise<void> {
  const iyzipay = iyzipayOrnegi();
  const sonuc: any = await iyzicoCagri((cb) =>
    iyzipay.card.delete({ locale: "tr", conversationId: crypto.randomUUID(), cardUserKey, cardToken }, cb)
  );

  if (sonuc.status !== "success") {
    throw new Error(sonuc.errorMessage || "Kart İyzico'dan silinemedi.");
  }
}
