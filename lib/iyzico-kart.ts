// @ts-ignore
import Iyzipay from "iyzipay";
// @ts-ignore
import "postman-request";

function iyzipayOrnegi() {
  return new Iyzipay({
    apiKey: process.env.IYZICO_API_KEY,
    secretKey: process.env.IYZICO_SECRET_KEY,
    uri: process.env.IYZICO_URI,
  });
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
    throw new Error(sonuc.errorMessage || "Kart İyzico'ya kaydedilemedi.");
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
