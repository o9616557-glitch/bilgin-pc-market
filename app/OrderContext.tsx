"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

interface OrderContextType {
  orders: any[];
  loading: boolean;
  refreshOrders: () => void;
}

const CACHE_KEY = "bilgin_siparisler";

function cacheOku(): any[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function cacheYaz(siparisler: any[]) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(siparisler));
  } catch {}
}

const OrderContext = createContext<OrderContextType>({
  orders: [],
  loading: false,
  refreshOrders: () => {},
});

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const { status } = useSession();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hafizaHazir, setHafizaHazir] = useState(false);

  useEffect(() => {
    const cached = cacheOku();
    if (cached.length > 0) setOrders(cached);
    setHafizaHazir(true);
  }, []);

  const fetchOrders = useCallback(async (ilkYukleme = false) => {
    const cached = cacheOku();
    if (ilkYukleme && cached.length === 0) setLoading(true);

    try {
      const res = await fetch("/api/orders?t=" + Date.now(), { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        const sirali = (data.orders || [])
          .filter((o: any) => o.gizlendi !== true)
          .sort((a: any, b: any) => new Date(b.createdAt || b.tarih).getTime() - new Date(a.createdAt || a.tarih).getTime());

        setOrders(sirali);
        cacheYaz(sirali);
      }
    } catch (error) {
      console.error("Siparişler hafızaya alınırken hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!hafizaHazir || status === "loading") return;

    if (status === "authenticated") {
      fetchOrders(true);
    } else if (status === "unauthenticated") {
      setOrders([]);
      setLoading(false);
      if (typeof window !== "undefined") sessionStorage.removeItem(CACHE_KEY);
    }
  }, [status, hafizaHazir, fetchOrders]);

  return (
    <OrderContext.Provider value={{ orders, loading, refreshOrders: () => fetchOrders(false) }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);
