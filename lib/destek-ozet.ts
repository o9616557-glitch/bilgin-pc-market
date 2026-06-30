export type DestekOzet = {
  sayi: number;
  acil: boolean;
  okunmamis: number;
};

const SESSION_KEY = "bilgin_destek_ozet";

function localKey(email: string) {
  return `bilgin_destek_ozet_${email.toLowerCase()}`;
}

export function destekOzetOku(email?: string | null): DestekOzet {
  const bos: DestekOzet = { sayi: 0, acil: false, okunmamis: 0 };
  if (typeof window === "undefined") return bos;

  try {
    const session = sessionStorage.getItem(SESSION_KEY);
    if (session) {
      const parsed = JSON.parse(session);
      if ((parsed.okunmamis || 0) > 0 || parsed.acil || (parsed.sayi || 0) > 0) return parsed;
    }
  } catch {}

  if (email) {
    try {
      const local = localStorage.getItem(localKey(email));
      if (local) return JSON.parse(local);
    } catch {}
  }

  try {
    const session = sessionStorage.getItem(SESSION_KEY);
    if (session) return JSON.parse(session);
  } catch {}

  return bos;
}

export function destekOzetYaz(ozet: DestekOzet, email?: string | null) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(ozet));
  if (email) {
    localStorage.setItem(localKey(email), JSON.stringify(ozet));
  }
}

export function destekOzetTemizle(email?: string | null) {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_KEY);
  if (email) localStorage.removeItem(localKey(email));
}
