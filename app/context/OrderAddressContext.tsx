"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface Address {
  _id: string;
  title: string;
  fullName: string;
  phone: string;
  city: string;
  district: string;
  fullAddress: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  products: any[];
}

// 🚀 YENİ: Favoriler için veri tipi ekledik
interface OrderAddressContextType {
  addresses: Address[];
  orders: Order[];
  favorites: any[]; // Favori ürünleri tutacak depo
  isLoading: boolean;
  refreshAllData: () => Promise<void>;
  updateFavoritesLocally: (newFavorites: any[]) => void; // Ekrandan anında silmek için
}

const OrderAddressContext = createContext<OrderAddressContextType | undefined>(undefined);

export function OrderAddressProvider({ children }: { children: React.ReactNode }) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]); // Favoriler State'i
  const [isLoading, setIsLoading] = useState(true);

  const refreshAllData = async () => {
    try {
      // 🚀 YENİ: Favorileri de arkadan gizlice çekiyoruz
      const [addressRes, orderRes, favRes] = await Promise.all([
        fetch("/api/addresses"),
        fetch("/api/orders"),
        fetch("/api/favorites") 
      ]);

      if (addressRes.ok) {
        const addressData = await addressRes.json();
        setAddresses(addressData);
      }
      
      if (orderRes.ok) {
        const orderData = await orderRes.json();
        setOrders(orderData);
      }

      if (favRes.ok) {
        const favData = await favRes.json();
        setFavorites(favData);
      }
    } catch (error) {
      console.error("Hafıza motoru veri çekemedi:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Müşteri sildiğinde ekranı anında temizlemek için ufak bir yardımcı
  const updateFavoritesLocally = (newFavorites: any[]) => {
    setFavorites(newFavorites);
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  return (
    <OrderAddressContext.Provider value={{ addresses, orders, favorites, isLoading, refreshAllData, updateFavoritesLocally }}>
      {children}
    </OrderAddressContext.Provider>
  );
}

export function useOrderAddress() {
  const context = useContext(OrderAddressContext);
  if (!context) {
    throw new Error("useOrderAddress bir OrderAddressProvider içinde kullanılmalıdır!");
  }
  return context;
}