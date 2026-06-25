"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface OrderContextType {
  orders: any[];
  loading: boolean;
  refreshOrders: () => void;
}

// 1. Odayı tasarlıyoruz (İçi şimdilik boş)
const OrderContext = createContext<OrderContextType>({
  orders: [],
  loading: true,
  refreshOrders: () => {},
});

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const { status } = useSession();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 2. Kurye Motoru: Veritabanına gidip siparişleri TEK SEFERDE çeker ve rafa dizer
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders?t=" + new Date().getTime(), { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        
        // Veriyi gelir gelmez en yeni tarihe göre sıralayıp gizlenenleri ayıklıyoruz (Sayfalar bir daha yorulmasın)
        const sirali = (data.orders || [])
          .filter((o: any) => o.gizlendi !== true)
          .sort((a: any, b: any) => new Date(b.createdAt || b.tarih).getTime() - new Date(a.createdAt || a.tarih).getTime());
        
        setOrders(sirali);
      }
    } catch (error) {
      console.error("Siparişler hafızaya alınırken hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  };

  // 3. Şalter: Kullanıcı siteye giriş yaptığı an (sayfa neresi olursa olsun) motor çalışır!
  useEffect(() => {
    if (status === "authenticated") {
      fetchOrders();
    } else if (status === "unauthenticated") {
      setLoading(false);
      setOrders([]);
    }
  }, [status]);

  return (
    <OrderContext.Provider value={{ orders, loading, refreshOrders: fetchOrders }}>
      {children}
    </OrderContext.Provider>
  );
};

// Sayfaların bu odaya kolayca ulaşması için kestirme anahtarımız
export const useOrders = () => useContext(OrderContext);