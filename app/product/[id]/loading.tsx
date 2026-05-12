// 1. ADIM: React kütüphanesini içeri aktarıyoruz. (Bileşenin çalışması için şarttır)
import React from 'react';

// 2. ADIM: "export default" ile ana bileşenimizi dışarı aktarıyoruz. 
// Next.js sayfa yüklenirken bu ismi arar.
export default function Loading() {
  
  // 3. ADIM: Ekrana çizilecek olan Görsel Arayüz (HTML ve Tailwind CSS)
  return (
    <div className="bg-[#0b1120] min-h-screen flex flex-col items-center justify-center text-white p-10">
      
      {/* Animasyonlu Dönen Halkalar */}
      <div className="relative flex justify-center items-center">
        {/* Dışarıya doğru yayılan şeffaf mavi halka */}
        <div className="absolute animate-ping w-16 h-16 rounded-full border-4 border-blue-500/30"></div>
        {/* Sürekli dönen ana yükleme halkası */}
        <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-blue-500 animate-spin z-10"></div>
      </div>
      
      {/* Kullanıcıyı Bekletirken Gösterilen Bilgi Mesajları */}
      <div className="mt-8 text-center space-y-2">
        <h2 className="text-xl font-black tracking-widest text-white uppercase animate-pulse">
          SİSTEM BAĞLANTISI KURULUYOR
        </h2>
        <p className="text-sm font-bold text-slate-500 tracking-widest uppercase">
          Donanım Verileri Çekiliyor...
        </p>
      </div>
      
    </div>
  );
}