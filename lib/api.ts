/**
 * Typed API client for the Nexarch backend.
 *
 * All requests go through this module so the base URL is configured in one
 * place (NEXT_PUBLIC_API_BASE_URL) and the response envelope shape is handled
 * consistently.
 *
 * See docs/api.md for the response envelope spec: { data, meta, error }.
 */

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api/v1";

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

/**
 * Core fetch wrapper.
 * Throws ApiError if the response envelope contains an error.
 */
export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${path}`;
  const resp = await fetch(url, {
    credentials: "include", // send httpOnly cookies (refresh token)
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const body: ApiResponse<T> = await resp.json();

  if (body.error !== null) {
    throw new ApiError(body.error.code, body.error.message, body.error.status);
  }

  return body.data as T;
}
