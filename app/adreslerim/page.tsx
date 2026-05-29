import React from "react";
import mongoose from "mongoose";
import User from "@/models/User"; // Kendi model yoluna göre düzenle
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Kendi yoluna göre düzenle
import { redirect } from "next/navigation";
import AdresYoneticisi from "./AdresYoneticisi";

// Bu sayfa artık bir Server Component. "use client" yok!
// Veritabanına direkt bağlanıp veriyi şak diye çeker.
export default async function AdreslerimPage() {
  const session = await getServerSession(authOptions);

  // Kullanıcı giriş yapmamışsa, login sayfasına fırlat
  if (!session || !session.user?.email) {
    redirect("/login"); 
  }

  // Veritabanı bağlantısı
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGODB_URI as string);
  }

  // Kullanıcının adreslerini sunucuda (jet hızıyla) bul
  const user = await User.findOne({ email: session.user.email }).lean();
  
  // Veriyi Client bileşeninin anlayacağı düz (plain) objeye çeviriyoruz
  const addresses = user?.addresses ? JSON.parse(JSON.stringify(user.addresses)) : [];

  return (
    <div className="min-h-screen bg-[#050B14] text-white p-6 md:p-12 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* İşlem bileşenini (Client) çağırıyor ve veriyi içine atıyoruz */}
        <AdresYoneticisi initialAddresses={addresses} />
      </div>
    </div>
  );
}