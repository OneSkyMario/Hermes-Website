/**
 * Orders service — place, list, cancel orders.
 */
import api from "@/lib/api";

/* ── Types ────────────────────────────────────────────────────────── */

export interface OrderItem {
  id: number;
  coffee_item: number;
  coffee_item_name?: string;
  quantity: number;
  unit_price: string;
  line_total: string;
  customization_notes: string;
}

export interface Order {
  id: number;
  customer: number;
  customer_name?: string;
  store: number;
  store_name?: string;
  status: OrderStatus;
  total: string;
  notes: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export interface PlaceOrderPayload {
  store: number;
  address?: number;
  items: {
    coffee_item: number;
    quantity: number;
    customization_notes?: string;
  }[];
}

/* ── API ──────────────────────────────────────────────────────────── */

export const orderService = {
  /** POST /api/orders/ — place a new order */
  place: (data: PlaceOrderPayload) =>
    api.post<Order>("/api/orders/", data),

  /** GET /api/orders/ — list my orders */
  list: (filters?: { status?: OrderStatus }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.set("status", filters.status);
    const qs = params.toString();
    return api.get<Order[]>(`/api/orders/${qs ? `?${qs}` : ""}`);
  },

  /** GET /api/orders/:id/ */
  getById: (id: number) => api.get<Order>(`/api/orders/${id}/`),

  /** GET /api/orders/:id/items/ */
  getItems: (id: number) => api.get<OrderItem[]>(`/api/orders/${id}/items/`),

  /** POST /api/orders/:id/cancel/ */
  cancel: (id: number) => api.post<Order>(`/api/orders/${id}/cancel/`),
};
