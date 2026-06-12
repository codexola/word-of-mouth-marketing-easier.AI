const DEFAULT_API_PORT = process.env.NEXT_PUBLIC_API_PORT || "4000";

function normalizeApiUrl(url: string): string {
  return url.replace(/\/$/, "");
}

function isProxyApiUrl(url?: string): boolean {
  if (!url) return false;
  const normalized = normalizeApiUrl(url);
  return normalized === "/api" || (normalized.startsWith("/") && normalized.endsWith("/api"));
}

function isVercelHost(hostname: string): boolean {
  return hostname === "vercel.app" || hostname.endsWith(".vercel.app");
}

/**
 * HTTPS フロントから HTTP バックエンドへ直接 fetch すると Mixed Content でブロックされる。
 * Vercel 上では常に同一オリジンの /api プロキシを使う。
 */
function shouldUseApiProxy(hostname: string, protocol: string, fromEnv?: string): boolean {
  if (isVercelHost(hostname)) return true;
  if (isProxyApiUrl(fromEnv)) return true;
  if (protocol === "https:" && fromEnv?.startsWith("http://")) return true;
  if (process.env.NEXT_PUBLIC_USE_API_PROXY === "true") return true;
  return false;
}

/**
 * Browser (dev): same host as the page + port 4000.
 * Browser (Vercel): /api via Next.js rewrite → BACKEND_URL.
 */
export function getApiBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_API_URL
    ? normalizeApiUrl(process.env.NEXT_PUBLIC_API_URL)
    : undefined;

  if (typeof window !== "undefined") {
    const { protocol, hostname } = window.location;
    if (shouldUseApiProxy(hostname, protocol, fromEnv)) {
      return "/api";
    }
    if (process.env.NODE_ENV === "production" && fromEnv) {
      return fromEnv;
    }
    return `${protocol}//${hostname}:${DEFAULT_API_PORT}/api`;
  }

  if (process.env.VERCEL || isProxyApiUrl(fromEnv)) {
    return "/api";
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
