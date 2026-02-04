'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
const API_URL = process.env.NEXT_PUBLIC_NOT_OUR_VULNERABLE_API_URL || 'http://127.0.0.1:8000';

export interface Coffee {
  productID: number;
  name: string;
  subtitle: string;
  description: string;
  imagestr: string;
  price: string;
  origin: string;
  volume: string;
  caffeine: string;
}

interface ShopContextType {
  coffees: Coffee[];
  stores: Store[];
  loading: boolean;
  error: string | null;
  getCoffeeById: (id: number) => Coffee | undefined;
}

export interface Store {
   id: string; // Serializer sends 'id', not 'store_id'
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

export interface ProductItem {
  productID: number;
  name: string;
  subtitle: string;
  description: string;
  imagestr: string;
  price: string;
  category: 'COFFEE' | 'FOOD';
  // Optional specific fields
  origin?: string;
  volume?: string;
  caffeine?: string;
  weight?: string;
  calories?: string;
}


const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [coffees, setCoffees] = useState<Coffee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [stores, setStores] = useState<Store[]>([]);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const res = await fetch(`${API_URL}/api/stores/`);
        if (!res.ok) throw new Error('Terminal Error: Could not fetch catalog');
        const data = await res.json();
        setCoffees(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    const fetchStoresData = async () => {
      try {
        const res = await fetch(`${API_URL}/api/stores/`);
        if (!res.ok) throw new Error('Terminal Error: Could not fetch stores');
        const data = await res.json();
        setStores(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
    fetchStoresData();
  }, []);

  const getCoffeeById = (id: number) => {
    return coffees.find((c) => c.productID === id);
  };

  return (
    <ShopContext.Provider value={{ coffees, stores, loading, error, getCoffeeById }}>
      {children}
    </ShopContext.Provider>
  );
}

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within a ShopProvider');
  return context;
};