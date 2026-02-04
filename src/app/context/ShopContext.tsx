'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const API_URL = process.env.NEXT_PUBLIC_NOT_OUR_VULNERABLE_API_URL || 'http://127.0.0.1:8000';

export interface ProductItem {
  productID: number;
  name: string;
  subtitle: string;
  description: string;
  imagestr: string;
  price: string;
  category: 'COFFEE' | 'FOOD';
  origin?: string;
  volume?: string;
  caffeine?: string;
  weight?: string;
  calories?: string;
}

export interface Store {
   id: string;
   name: string;
   image: string;
   rating: number;
   price: number;
   speed: string;
   tag: string;
   type: string | null;
   address: string;
   distance: string;
}

interface ShopContextType {
  coffees: ProductItem[];
  foods: ProductItem[];
  stores: Store[];
  loading: boolean;
  error: string | null;
  getProductById: (id: number) => ProductItem | undefined;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Общие заголовки для обхода защиты Ngrok
    const headers = {
      "ngrok-skip-browser-warning": "true",
      "Content-Type": "application/json"
    };

    const fetchProductData = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products/`, { headers });
        if (!res.ok) throw new Error(`Products Error: ${res.status}`);
        const data = await res.json();
        setProducts(data);
      } catch (err: any) {
        console.error("Products fetch failed:", err);
        setError(err.message);
      }
    };

    const fetchStoresData = async () => {
      try {
        const res = await fetch(`${API_URL}/api/stores/`, { headers });
        if (!res.ok) throw new Error(`Stores Error: ${res.status}`);
        const data = await res.json();
        setStores(data);
      } catch (err: any) {
        console.error("Stores fetch failed:", err);
        setError(err.message);
      }
    };

    // Запускаем оба запроса
    Promise.all([fetchProductData(), fetchStoresData()]).finally(() => {
        setLoading(false);
    });

  }, []);

  const coffees = products.filter(p => p.category === 'COFFEE');
  const foods = products.filter(p => p.category === 'FOOD');

  const getProductById = (id: number) => {
    return products.find((c) => c.productID === id);
  };

  return (
    <ShopContext.Provider value={{ coffees, foods, stores, loading, error, getProductById }}>
      {children}
    </ShopContext.Provider>
  );
}

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within a ShopProvider');
  return context;
};