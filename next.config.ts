import type { NextConfig } from "next";

const backendUrl = process.env.BACKEND_URL?.replace(/\/$/, "");

const nextConfig: NextConfig = {
  allowedDevOrigins: ["103.179.45.111"],
  async rewrites() {
    if (!backendUrl) return [];
    return [
      { source: "/api/:path*", destination: `${backendUrl}/api/:path*` },
      { source: "/uploads/:path*", destination: `${backendUrl}/uploads/:path*` },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "drive.google.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "**.googleusercontent.com" },
      { protocol: "https", hostname: "api-data.line.me" },
      { protocol: "http", hostname: "localhost", port: "4000", pathname: "/uploads/**" },
      { protocol: "https", hostname: "**", pathname: "/uploads/**" },
      ...(backendUrl
        ? (() => {
            try {
              const u = new URL(backendUrl);
              return [
                {
                  protocol: u.protocol.replace(":", "") as "http" | "https",
                  hostname: u.hostname,
                  ...(u.port ? { port: u.port } : {}),
                  pathname: "/uploads/**",
                },
              ];
            } catch {
              return [];
            }
          })()
        : []),
    ],
    unoptimized: true,
  },
};

export default nextConfig;
