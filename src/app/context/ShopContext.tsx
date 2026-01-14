'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  loading: boolean;
  error: string | null;
  getCoffeeById: (id: number) => Coffee | undefined;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [coffees, setCoffees] = useState<Coffee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/coffee/');
        if (!res.ok) throw new Error('Terminal Error: Could not fetch catalog');
        const data = await res.json();
        setCoffees(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShopData();
  }, []);

  const getCoffeeById = (id: number) => {
    return coffees.find((c) => c.productID === id);
  };

  return (
    <ShopContext.Provider value={{ coffees, loading, error, getCoffeeById }}>
      {children}
    </ShopContext.Provider>
  );
}

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within a ShopProvider');
  return context;
};