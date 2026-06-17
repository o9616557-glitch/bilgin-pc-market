import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import clientPromise from "@/lib/mongodb";
import SiparisClient from "./SiparisClient";

// Sayfanın her zaman sunucuda taze olarak oluşturulmasını sağlar
export const dynamic = "force-dynamic";

export default async function SiparislerimServer() {
  const session = await getServerSession(authOptions);

  // Kullanıcı giriş yapmamışsa anında kapı dışarı (Login'e)
  if (!session || !session.user?.email) {
    redirect("/login"); 
  }

  let initialOrders: any[] = [];

  try {
    const client = await clientPromise;
    const db = client.db("bilginpcmarket");

    // Önce kimin siparişine bakacağımızı buluyoruz (Güvenlik)
    const user = await db.collection("users").findOne({ email: session.user.email });

    if (user) {
      // 🚀 HAMALLIK BİTTİ: Kendi API'mize internetten bağlanmak yerine direkt veritabanına dalıyoruz!
      // (Hem email hem de userId ile kaydedilmiş olma ihtimaline karşı ikisini de tarıyoruz)
      const rawOrders = await db.collection("orders").find({
        $or: [
          { email: session.user.email },
          { userId: user._id.toString() },
          { userId: user._id }
        ]
      })
      .sort({ createdAt: -1 }) // 🚀 Siparişleri en yeniden en eskiye (ters) sıralar
      .toArray();

      // İstemci (Client) bileşeninin hata vermemesi için MongoDB ID'lerini düz string'e çeviriyoruz
      initialOrders = rawOrders.map(order => ({
        ...order,
        _id: order._id.toString(),
        userId: order.userId?.toString() || order.userId,
      }));
    }

  } catch (error) {
    console.error("Siparişler doğrudan veritabanından çekilirken hata:", error);
  }

  // Veri saniyesinde hazır, ekrana basıyoruz!
  return <SiparisClient initialOrders={initialOrders} />;
}