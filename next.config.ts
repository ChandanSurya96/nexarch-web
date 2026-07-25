import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // API requests are proxied through Next.js to avoid CORS issues in development.
  // Source is pinned to /api/v1 (not just /api) because NEXT_PUBLIC_API_BASE_URL
  // already includes the /api/v1 suffix — matching only /api/ here would append
  // :path* after that suffix and double it (/api/v1/v1/...).
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api/v1"}/:path*`,
      },
    ];
  },
};

export default nextConfig;
