/**
 * Centralized API client for Otto Coffee backend.
 *
 * Every service module imports `api` from here instead of calling
 * fetch() directly.  This gives us:
 *   - one place for the base URL
 *   - automatic Bearer token injection
 *   - automatic 401 → token refresh → retry (once)
 *   - typed JSON helpers
 */

const API_URL =
  process.env.NEXT_PUBLIC_NOT_OUR_VULNERABLE_API_URL ||
  "http://127.0.0.1:8000";

/* ── helpers ─────────────────────────────────────────────────────── */

function authHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  };
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

async function refreshToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  const refresh = localStorage.getItem("refresh");
  if (!refresh) return null;

  try {
    const res = await fetch(`${API_URL}/api/auth/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    localStorage.setItem("access", data.access);
    if (data.refresh) localStorage.setItem("refresh", data.refresh);
    return data.access as string;
  } catch {
    return null;
  }
}

/* ── core request ────────────────────────────────────────────────── */

export type ApiError = {
  status: number;
  detail: string;
  body: Record<string, unknown>;
};

/**
 * Low-level request wrapper.
 * - Attaches auth header automatically.
 * - On 401, refreshes the token and retries once.
 * - Returns the parsed JSON or throws an `ApiError`.
 */
async function request<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_URL}${path}`;

  let res = await fetch(url, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers as Record<string, string>) },
  });

  // auto-refresh on 401
  if (res.status === 401) {
    const newToken = await refreshToken();
    if (newToken) {
      const retryHeaders = {
        ...authHeaders(),
        Authorization: `Bearer ${newToken}`,
        ...(options.headers as Record<string, string>),
      };
      res = await fetch(url, { ...options, headers: retryHeaders });
    }
  }

  // 204 No Content (e.g. DELETE)
  if (res.status === 204) return undefined as T;

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    const detail =
      body.detail ||
      (typeof body === "object"
        ? Object.values(body).flat().join(" ")
        : "Request failed");

    const err: ApiError = { status: res.status, detail, body };
    throw err;
  }

  return body as T;
}

/* ── convenience verbs ───────────────────────────────────────────── */

export const api = {
  get: <T = unknown>(path: string) =>
    request<T>(path, { method: "GET" }),

  post: <T = unknown>(path: string, data?: unknown) =>
    request<T>(path, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T = unknown>(path: string, data?: unknown) =>
    request<T>(path, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T = unknown>(path: string, data?: unknown) =>
    request<T>(path, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    }),

  del: <T = unknown>(path: string) =>
    request<T>(path, { method: "DELETE" }),
};

/**
 * Un-authenticated POST (for login / registration / OTP).
 * Skips the Bearer header entirely.
 */
export async function publicPost<T = unknown>(
  path: string,
  data: unknown,
): Promise<T> {
  const url = `${API_URL}${path}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
    body: JSON.stringify(data),
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    const detail =
      body.detail ||
      (typeof body === "object"
        ? Object.values(body).flat().join(" ")
        : "Request failed");
    const err: ApiError = { status: res.status, detail, body };
    throw err;
  }

  return body as T;
}

export default api;
