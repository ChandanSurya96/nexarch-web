/**
 * Typed API client for the Nexarch backend.
 *
 * Requests always go to the relative /api/v1 path, which next.config.ts's
 * rewrites() proxies to the real backend — never the absolute backend URL
 * from the browser (see ADR-016). That keeps browser requests same-origin
 * so the httpOnly refresh cookie is sent without needing CORS configured
 * on the Flask side.
 *
 * See docs/api.md for the response envelope spec: { data, meta, error }.
 */

const API_BASE = "/api/v1";

/**
 * In-memory access token, synced from AuthProvider (ADR-017: never
 * localStorage). A module-level var, not React state, so apiFetch can reach
 * it without every call site threading the token through.
 */
let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export interface ApiResponse<T> {
  data: T | null;
  meta: Record<string, unknown>;
  error: {
    code: string;
    message: string;
    status: number;
  } | null;
}

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const url = `${API_BASE}${path}`;
  const resp = await fetch(url, {
    credentials: "include", // send httpOnly cookies (refresh token)
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...options.headers,
    },
  });

  const body: ApiResponse<T> = await resp.json();

  if (body.error !== null) {
    throw new ApiError(body.error.code, body.error.message, body.error.status);
  }

  return body;
}

/**
 * Core fetch wrapper.
 * Throws ApiError if the response envelope contains an error.
 */
export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const body = await request<T>(path, options);
  return body.data as T;
}

/**
 * Same as apiFetch, but also returns `meta` — needed for the Discovery
 * Feed's pagination info, which apiFetch's callers don't otherwise need.
 */
export async function apiFetchWithMeta<T>(
  path: string,
  options: RequestInit = {}
): Promise<{ data: T; meta: Record<string, unknown> }> {
  const body = await request<T>(path, options);
  return { data: body.data as T, meta: body.meta };
}
