"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { deliveryService, robotService } from "@/lib/services";
import type {
  Delivery,
  DeliveryStatus,
  Robot,
  ETABreakdown,
} from "@/lib/services";
import { useAuth } from "./AuthContext";

/* ── Context shape ────────────────────────────────────────────────── */

interface DeliveryContextType {
  deliveries: Delivery[];
  robots: Robot[];
  loading: boolean;
  error: string | null;

  /** Fetch / refresh deliveries (optional filters). */
  fetchDeliveries: (filters?: {
    status?: DeliveryStatus;
    order?: number;
  }) => Promise<void>;

  /** Fetch available robots. */
  fetchRobots: () => Promise<void>;

  /** Get a single delivery by id. */
  getDelivery: (id: number) => Promise<Delivery>;

  /** Get ETA breakdown for a delivery. */
  getETA: (deliveryId: number) => Promise<ETABreakdown>;

  /**
   * Start polling a delivery every `intervalMs` (default 5 s).
   * Returns a stop function.
   */
  pollDelivery: (id: number, intervalMs?: number) => () => void;
}

const DeliveryContext = createContext<DeliveryContextType | null>(null);

/* ── Provider ─────────────────────────────────────────────────────── */

export function DeliveryProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [robots, setRobots] = useState<Robot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ── deliveries ──────────────────────────────────────────── */

  const fetchDeliveries = useCallback(
    async (filters?: { status?: DeliveryStatus; order?: number }) => {
      setLoading(true);
      setError(null);
      try {
        const data = await deliveryService.list(filters);
        setDeliveries(data);
      } catch (err: any) {
        setError(err.detail || "Failed to load deliveries");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const getDelivery = useCallback(
    async (id: number) => {
      const cached = deliveries.find((d) => d.id === id);
      if (cached) return cached;
      return deliveryService.getById(id);
    },
    [deliveries],
  );

  const getETA = useCallback(
    (deliveryId: number) => deliveryService.getETA(deliveryId),
    [],
  );

  /* ── polling (for live tracking) ─────────────────────────── */

  const pollDelivery = useCallback(
    (id: number, intervalMs = 5000) => {
      const timer = setInterval(async () => {
        try {
          const updated = await deliveryService.getById(id);
          setDeliveries((prev) =>
            prev.map((d) => (d.id === id ? updated : d)),
          );

          // auto-stop when terminal
          if (["delivered", "failed"].includes(updated.status)) {
            clearInterval(timer);
          }
        } catch {
          // swallow — will retry next tick
        }
      }, intervalMs);

      return () => clearInterval(timer);
    },
    [],
  );

  /* ── robots ──────────────────────────────────────────────── */

  const fetchRobots = useCallback(async () => {
    try {
      const data = await robotService.list();
      setRobots(data);
    } catch (err: any) {
      setError(err.detail || "Failed to load robots");
    }
  }, []);

  return (
    <DeliveryContext.Provider
      value={{
        deliveries,
        robots,
        loading,
        error,
        fetchDeliveries,
        fetchRobots,
        getDelivery,
        getETA,
        pollDelivery,
      }}
    >
      {children}
    </DeliveryContext.Provider>
  );
}

export const useDeliveries = () => {
  const ctx = useContext(DeliveryContext);
  if (!ctx) throw new Error("useDeliveries must be inside DeliveryProvider");
  return ctx;
};
