import { headers } from "next/headers";
import SiparisClient from "./SiparisClient";

export const dynamic = "force-dynamic";

export default async function SiparislerimServer() {
  let initialOrders = [];

  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
    
    // 🚀 İŞTE EKSİK KABLO BURASIYDI: Kullanıcının giriş yaptığını (çerezleri) alıyoruz!
    const reqHeaders = await headers();
    const cookieHeader = reqHeaders.get("cookie") || "";
    
    // API'ye giderken "Ben giriş yapmış biriyim, al bu da çerezim" diyoruz.
    const res = await fetch(`${baseUrl}/api/orders`, {
      cache: "no-store",
      headers: {
        "cookie": cookieHeader
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