import { getApiBaseUrl } from "./api-url";

/** Extract `/uploads/...` path from any absolute or relative URL. */
export function extractUploadsPath(url: string): string | null {
  const match = url.match(/\/uploads\/[^?#]+/);
  return match ? match[0] : null;
}

/**
 * Resolve image URLs for display in the browser.
 * Upload files are served via same-origin `/uploads/*` (Next.js rewrite → backend).
 */
export function resolveMediaUrl(url: string | undefined | null): string | undefined {
  if (!url?.trim()) return undefined;
  const trimmed = url.trim();

  if (trimmed.startsWith("data:")) return trimmed;

  if (trimmed.startsWith("/uploads/")) return trimmed;

  const uploadsPath = extractUploadsPath(trimmed);
  if (uploadsPath) {
    if (typeof window !== "undefined") {
      return uploadsPath;
    }
    const apiBase = getApiBaseUrl();
    const origin = apiBase.replace(/\/api\/?$/, "");
    return `${origin}${uploadsPath}`;
  }

  return trimmed;
}

export function resolveMediaUrls(urls: (string | null | undefined)[]): string[] {
  return urls.map((u) => resolveMediaUrl(u)).filter((u): u is string => !!u);
}
