'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 1. Check your Vercel Env Variable. If it fails, fallback to localhost.
const API_URL = process.env.NEXT_PUBLIC_NOT_OUR_VULNERABLE_API_URL || 'http://127.0.0.1:8000';

// 2. UNIFIED INTERFACES
// We deleted 'interface Coffee' because it caused conflicts.
// We use ProductItem for everything now.
export interface ProductItem {
  productID: number;
  name: string;
  subtitle: string;
  description: string;
  imagestr: string;
  price: string;
  category: 'COFFEE' | 'FOOD';
  // All specific fields must be optional (?) because a Pizza doesn't have caffeine
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
  coffees: ProductItem[]; // CHANGED: Now uses ProductItem
  foods: ProductItem[];   // CHANGED: Now uses ProductItem
  stores: Store[];
  loading: boolean;
  error: string | null;
  getProductById: (id: number) => ProductItem | undefined; // Renamed for clarity
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Fetch Products
        console.log(`Fetching products from: ${API_URL}/api/products/`);
        const prodRes = await fetch(`${API_URL}/api/products/`);
        if (!prodRes.ok) throw new Error(`Product Fetch Error: ${prodRes.status}`);
        const prodData = await prodRes.json();
        setProducts(prodData); // <--- YOU MISSED THIS LINE BEFORE

        // 2. Fetch Stores
        console.log(`Fetching stores from: ${API_URL}/api/stores/`);
        const storeRes = await fetch(`${API_URL}/api/stores/`);
        if (!storeRes.ok) throw new Error(`Store Fetch Error: ${storeRes.status}`);
        const storeData = await storeRes.json();
        setStores(storeData);

      } catch (err: any) {
        console.error("ShopProvider Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter the unified list
  const coffees = products.filter(p => p.category === 'COFFEE');
  const foods = products.filter(p => p.category === 'FOOD');

  const getProductById = (id: number) => {
    return products.find((p) => p.productID === id);
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