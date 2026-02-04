'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Make sure to define your API_URL
const API_URL = process.env.NEXT_PUBLIC_NOT_OUR_VULNERABLE_API_URL || 'http://127.0.0.1:8000';

// 1. Unified Product Interface (Use this instead of separate Coffee/Food interfaces)
export interface ProductItem {
  productID: number;
  name: string;
  subtitle: string;
  description: string;
  imagestr: string;
  price: string;
  category: 'COFFEE' | 'FOOD';
  // Optional fields (present on some items, missing on others)
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

// 2. Updated Context Type to use ProductItem
interface ShopContextType {
  coffees: ProductItem[]; // Changed from Coffee[] to ProductItem[]
  foods: ProductItem[];   // Added foods array
  stores: Store[];
  loading: boolean;
  error: string | null;
  getProductById: (id: number) => ProductItem | undefined; // Renamed for clarity
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: ReactNode }) {
  // Fixed state setter name (setProducts instead of setProduct)
  const [products, setProducts] = useState<ProductItem[]>([]); 
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products/`);
        if (!res.ok) throw new Error('Terminal Error: Could not fetch catalog');
        const data = await res.json();
        
        // FIX: You forgot to set the state here in your previous code!
        setProducts(data); 

      } catch (err: any) {
        setError(err.message);
      }
      // Note: We don't turn off loading here yet, we wait for both fetches
    };

    const fetchStoresData = async () => {
      try {
        const res = await fetch(`${API_URL}/api/stores/`);
        if (!res.ok) throw new Error('Terminal Error: Could not fetch stores');
        const data = await res.json();
        setStores(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    // Run both, then turn off loading
    Promise.all([fetchProductData(), fetchStoresData()]).finally(() => {
        setLoading(false);
    });

  }, []);

  // Filter products for specific uses
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