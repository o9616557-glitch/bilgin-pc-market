"use client";

import useSWR from "swr";
import { useSession } from "next-auth/react";

// SWR'nin verileri çekebilmesi için gereken standart okuma (fetch) aracı
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useUserData() {
  // 1. Müşterinin giriş yapıp yapmadığını kontrol ediyoruz
  const { data: session, status } = useSession();
  const girisYapildi = status === "authenticated";

  // 2. SWR MOTORU: Sadece giriş yapıldıysa '/api/favorites' adresine sessizce istek atar
  const { data: favoriVerisi, error, mutate } = useSWR(
    girisYapildi ? "/api/favorites" : null, // Giriş yoksa API'yi yorma (null döner)
    fetcher,
    {
      revalidateOnFocus: false, // Müşteri başka sekmeye gidip gelirse veriyi baştan çekmeyi engeller
      dedupingInterval: 5000,   // 5 saniye içinde art arda istek gelirse sadece 1 tanesini işler
    }
  );

  // 3. Kullanacağımız verileri dışarı aktarıyoruz
  return {
    // Veri henüz gelmediyse veya çekiliyorsa yükleniyor durumunu true yap
    yukleniyor: !error && !favoriVerisi && girisYapildi,
    
    // API'den gelen favorites dizisini dışarı aktar, yoksa çökmeyi önlemek için boş dizi [] ver
    favoriler: favoriVerisi?.favorites || [],
    
    // Herhangi bir sunucu hatası varsa bunu bildir
    hata: error,
    
    // Ürün eklendiğinde/silindiğinde ekrandaki listeyi "anında" güncellemek için tetikleyici
    favorileriGuncelle: mutate,
  };
}