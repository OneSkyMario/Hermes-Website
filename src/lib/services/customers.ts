/**
 * Customers & delivery addresses service.
 */
import api from "@/lib/api";

/* ── Types ────────────────────────────────────────────────────────── */

export interface DeliveryAddress {
  id: number;
  customer: number;
  label: string;
  address_line: string;
  latitude: number | null;
  longitude: number | null;
  is_default: boolean;
}

export interface Customer {
  id: number;
  user: number | null;
  name: string;
  email: string;
  phone: string;
  created_at: string;
  delivery_addresses: DeliveryAddress[];
}

export interface CreateAddressPayload {
  label: string;
  address_line: string;
  latitude?: number;
  longitude?: number;
  is_default?: boolean;
}

/* ── API ──────────────────────────────────────────────────────────── */

export const customerService = {
  /** GET /api/customers/me/ — current user's profile */
  me: () => api.get<Customer>("/api/customers/me/"),

  /** PATCH /api/customers/me/ — update own profile */
  updateMe: (data: Partial<Pick<Customer, "name" | "email" | "phone">>) =>
    api.patch<Customer>("/api/customers/me/", data),

  /** GET /api/customers/:id/ */
  getById: (id: number) => api.get<Customer>(`/api/customers/${id}/`),

  /** GET /api/customers/ (admin) */
  list: () => api.get<Customer[]>("/api/customers/"),
};

export const addressService = {
  /** GET /api/addresses/ — list my addresses */
  list: () => api.get<DeliveryAddress[]>("/api/addresses/"),

  /** POST /api/addresses/ — create new address */
  create: (data: CreateAddressPayload) =>
    api.post<DeliveryAddress>("/api/addresses/", data),

  /** PATCH /api/addresses/:id/ */
  update: (id: number, data: Partial<CreateAddressPayload>) =>
    api.patch<DeliveryAddress>(`/api/addresses/${id}/`, data),

  /** DELETE /api/addresses/:id/ */
  remove: (id: number) => api.del(`/api/addresses/${id}/`),
};
