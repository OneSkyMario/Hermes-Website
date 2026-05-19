"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { orderService } from "@/lib/services";
import type { Order, OrderStatus, PlaceOrderPayload } from "@/lib/services";
import { useAuth } from "./AuthContext";

/* ── Context shape ────────────────────────────────────────────────── */

interface OrderContextType {
  orders: Order[];
  loading: boolean;
  error: string | null;

  /** Fetch (or re-fetch) the user's orders. Optional status filter. */
  fetchOrders: (status?: OrderStatus) => Promise<void>;

  /** Place a new order and prepend it to the list. */
  placeOrder: (data: PlaceOrderPayload) => Promise<Order>;

  /** Cancel an order and update the list in-place. */
  cancelOrder: (id: number) => Promise<void>;

  /** Get a single order by id (from local cache or remote). */
  getOrder: (id: number) => Promise<Order>;
}

const OrderContext = createContext<OrderContextType | null>(null);

/* ── Provider ─────────────────────────────────────────────────────── */

export function OrderProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async (status?: OrderStatus) => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderService.list(status ? { status } : undefined);
      setOrders(data);
    } catch (err: any) {
      setError(err.detail || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  const placeOrder = useCallback(async (data: PlaceOrderPayload) => {
    const order = await orderService.place(data);
    setOrders((prev) => [order, ...prev]);
    return order;
  }, []);

  const cancelOrder = useCallback(async (id: number) => {
    const updated = await orderService.cancel(id);
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? updated : o)),
    );
  }, []);

  const getOrder = useCallback(
    async (id: number) => {
      const cached = orders.find((o) => o.id === id);
      if (cached) return cached;
      return orderService.getById(id);
    },
    [orders],
  );

  return (
    <OrderContext.Provider
      value={{ orders, loading, error, fetchOrders, placeOrder, cancelOrder, getOrder }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export const useOrders = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be inside OrderProvider");
  return ctx;
};
