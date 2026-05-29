import { headers } from "next/headers";
import SiparisClient from "./SiparisClient";

export const dynamic = "force-dynamic";

export default async function SiparislerimServer() {
  let initialOrders = [];

  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
    
    // Güvenlik (Çerez) başlıklarını API'ye aktarıyoruz ki kimin siparişi olduğunu bilsin
    const reqHeaders = await headers();
    
    // Veritabanından siparişleri çekerken HAYALET EKRAN DEVREYE GİRER!
    const res = await fetch(`${baseUrl}/api/orders`, {
      cache: "no-store",
      headers: reqHeaders
    });

    if (res.ok) {
      const data = await res.json();
      initialOrders = data.orders || [];
    }
  } catch (error) {
    console.error("Siparişler sunucudan çekilirken hata:", error);
  }

  // Veriler gelince hayalet kapanır ve arayüz ekrana basılır
  return <SiparisClient initialOrders={initialOrders} />;
}