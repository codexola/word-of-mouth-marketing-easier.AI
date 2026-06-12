const DEFAULT_API_PORT = process.env.NEXT_PUBLIC_API_PORT || "4000";

function normalizeApiUrl(url: string): string {
  return url.replace(/\/$/, "");
}

function isProxyApiUrl(url?: string): boolean {
  if (!url) return false;
  const normalized = normalizeApiUrl(url);
  return normalized === "/api" || normalized.endsWith("/api") && normalized.startsWith("/");
}

/**
 * Browser (dev): same host as the page + port 4000.
 * Browser (Vercel): /api via Next.js rewrite → BACKEND_URL (see next.config.ts).
 * Direct API URL: set NEXT_PUBLIC_API_URL to full https URL (requires HTTPS backend).
 */
export function getApiBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_API_URL
    ? normalizeApiUrl(process.env.NEXT_PUBLIC_API_URL)
    : undefined;

  if (typeof window !== "undefined") {
    if (process.env.NODE_ENV === "production") {
      if (isProxyApiUrl(fromEnv) || (!fromEnv && process.env.NEXT_PUBLIC_USE_API_PROXY === "true")) {
        return "/api";
      }
      if (fromEnv) return fromEnv;
      return "/api";
    }
    const { protocol, hostname } = window.location;
    return `${protocol}//${hostname}:${DEFAULT_API_PORT}/api`;
  }

  if (process.env.NODE_ENV === "production") {
    if (isProxyApiUrl(fromEnv)) return "/api";
    if (fromEnv) return fromEnv;
  }

  return fromEnv || `http://localhost:${DEFAULT_API_PORT}/api`;
}

export function getFrontendOrigin(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  if (process.env.NEXT_PUBLIC_FRONTEND_URL) {
    return process.env.NEXT_PUBLIC_FRONTEND_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}
