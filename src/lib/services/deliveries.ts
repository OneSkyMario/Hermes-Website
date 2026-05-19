/**
 * Deliveries & robots service.
 */
import api from "@/lib/api";

/* ── Types ────────────────────────────────────────────────────────── */

export type DeliveryStatus =
  | "pending"
  | "assigned"
  | "picked_up"
  | "in_transit"
  | "delivered"
  | "failed";

export interface Robot {
  id: number;
  name: string;
  model: string;
  status: "idle" | "active" | "charging" | "maintenance";
  battery_level: number;
  latitude: number | null;
  longitude: number | null;
}

export interface Delivery {
  id: number;
  order: number;
  robot: Robot | null;
  address: {
    id: number;
    label: string;
    address_line: string;
    latitude: number | null;
    longitude: number | null;
  } | null;
  status: DeliveryStatus;
  estimated_arrival: string | null;
  picked_up_at: string | null;
  delivered_at: string | null;
  failed_at: string | null;
  failure_reason: string;
  created_at: string;
}

export interface ETABreakdown {
  robot_to_store_min: number;
  prep_min: number;
  store_to_address_min: number;
  total_min: number;
}

/* ── API ──────────────────────────────────────────────────────────── */

export const deliveryService = {
  /** GET /api/deliveries/ */
  list: (filters?: { status?: DeliveryStatus; order?: number }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.set("status", filters.status);
    if (filters?.order) params.set("order", String(filters.order));
    const qs = params.toString();
    return api.get<Delivery[]>(`/api/deliveries/${qs ? `?${qs}` : ""}`);
  },

  /** GET /api/deliveries/:id/ */
  getById: (id: number) => api.get<Delivery>(`/api/deliveries/${id}/`),

  /** POST /api/deliveries/:id/dispatch/ (staff) */
  dispatch: (id: number, robotId?: number) =>
    api.post<Delivery>(
      `/api/deliveries/${id}/dispatch/`,
      robotId ? { robot: robotId } : {},
    ),

  /** POST /api/deliveries/:id/advance/ (staff) */
  advance: (id: number, status: DeliveryStatus) =>
    api.post<Delivery>(`/api/deliveries/${id}/advance/`, { status }),

  /** POST /api/deliveries/:id/fail/ (staff) */
  fail: (id: number, reason?: string) =>
    api.post<Delivery>(`/api/deliveries/${id}/fail/`, { reason: reason || "" }),

  /** GET /api/deliveries/:id/eta/ */
  getETA: (id: number) =>
    api.get<ETABreakdown>(`/api/deliveries/${id}/eta/`),
};

export const robotService = {
  /** GET /api/robots/ */
  list: () => api.get<Robot[]>("/api/robots/"),

  /** GET /api/robots/available/ */
  available: () => api.get<Robot[]>("/api/robots/available/"),

  /** GET /api/robots/:id/ */
  getById: (id: number) => api.get<Robot>(`/api/robots/${id}/`),
};
