import { headers } from "next/headers";
import SiparisClient from "./SiparisClient";

// Sayfanın her zaman sunucuda taze olarak oluşturulmasını sağlar
export const dynamic = "force-dynamic";

export default async function SiparislerimServer() {
  let initialOrders = [];

  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
    
    // Kullanıcının giriş yaptığını (çerezleri) alıyoruz
    const reqHeaders = await headers();
    const cookieHeader = reqHeaders.get("cookie") || "";
    
    // 🚀 ÖNBELLEK KIRICI: Her istekte değişen benzersiz bir zaman damgası oluşturuyoruz
    const zamanDamgasi = new Date().getTime();
    
    // API'ye giderken URL'nin sonuna zaman damgasını ekleyerek Vercel'in hafızasını atlatıyoruz
    const res = await fetch(`${baseUrl}/api/orders?t=${zamanDamgasi}`, {
      cache: "no-store",
      headers: {
        "cookie": cookieHeader,
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache"
      }
    });

    if (res.ok) {
      const data = await res.json();
      initialOrders = data.orders || [];
    }
  } catch (error) {
    console.error("Siparişler sunucudan çekilirken hata:", error);
  }

  return <SiparisClient initialOrders={initialOrders} />;
}