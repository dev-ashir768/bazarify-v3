import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";

/**
 * Creates a configured Axios instance with predefined interceptors for request/response handling.
 * 
 * @param baseURL - The main domain of the API (e.g., https://api.example.com)
 * @param apiRoute - The base path for API calls (e.g., /api)
 * @param apiVersion - Optional version segment for the API (e.g., /v1)
 * @param token - Optional Bearer token for authentication
 * @returns A configured AxiosInstance
 */
const createApiInstance = (
  baseURL: string,
  apiRoute: string,
  apiVersion: string = "",
  token?: string,
): AxiosInstance => {
  const instance = axios.create({
    baseURL: `${baseURL}${apiRoute}${apiVersion}`,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  // Request Interceptor: Injects Authorization token if available
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (typeof window !== "undefined") {
        if (token) {
          config.headers.Authorization = token.startsWith("Bearer")
            ? token
            : `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  // Response Interceptor: Handles global error states
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      if (error.response?.status === 500) {
        console.error("Critical Server Error in API call");
      }

      return Promise.reject(error);
    },
  );

  return instance;
};

/**
 * API instance for Marketplace related operations.
 * Uses Orio Digital base URL and specific marketplace authorization.
 */
export const marketplaceApi = createApiInstance(
  process.env.NEXT_PUBLIC_API_BASE_URL_GET_ORIO!,
  process.env.NEXT_PUBLIC_API_ROUTE!,
  "", // apiVersion
  process.env.NEXT_PUBLIC_MARKETPLACE_AUTHORIZATION_TOKEN!,
);

/**
 * API instance for External/OMS related operations.
 * Uses specific Orio Digital base URL, V2 route, and external authorization.
 */
export const externalApi = createApiInstance(
  process.env.NEXT_PUBLIC_API_BASE_URL_ORIO_DIGITAL!,
  process.env.NEXT_PUBLIC_API_ROUTE!,
  process.env.NEXT_PUBLIC_API_VERSION_2!,
  process.env.NEXT_PUBLIC_EXTERNAL_AUTHORIZATION_TOKEN!,
);

// ─── Type-safe Helpers ───────────────────────────────────

/**
 * Generic GET helper for any API instance.
 */
export async function apiGet<T>(
  api: AxiosInstance,
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  const { data } = await api.get<T>(url, config);
  return data;
}

/**
 * Generic POST helper for any API instance.
 */
export async function apiPost<T, D = unknown>(
  api: AxiosInstance,
  url: string,
  payload?: D,
  config?: AxiosRequestConfig,
): Promise<T> {
  const { data } = await api.post<T>(url, payload, config);
  return data;
}

/**
 * Generic PUT helper for any API instance.
 */
export async function apiPut<T, D = unknown>(
  api: AxiosInstance,
  url: string,
  payload?: D,
  config?: AxiosRequestConfig,
): Promise<T> {
  const { data } = await api.put<T>(url, payload, config);
  return data;
}

/**
 * Generic PATCH helper for any API instance.
 */
export async function apiPatch<T, D = unknown>(
  api: AxiosInstance,
  url: string,
  payload?: D,
  config?: AxiosRequestConfig,
): Promise<T> {
  const { data } = await api.patch<T>(url, payload, config);
  return data;
}

/**
 * Generic DELETE helper for any API instance.
 */
export async function apiDelete<T>(
  api: AxiosInstance,
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  const { data } = await api.delete<T>(url, config);
  return data;
}
