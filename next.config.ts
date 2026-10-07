import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Pre-existing lint errors in the original codebase — ignore during build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Type checking is done separately via `tsc --noEmit`
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  async rewrites() {
    return [
      ...(process.env.NEXT_PUBLIC_UMAMI_SRC
        ? [
            {
              source: "/script.js",
              destination: process.env.NEXT_PUBLIC_UMAMI_SRC,
            },
          ]
        : []),
      ...(process.env.NEXT_PUBLIC_ANALYTICS_URL
        ? [
            {
              source: "/api/send",
              destination: process.env.NEXT_PUBLIC_ANALYTICS_URL,
            },
          ]
        : []),
    ];
  },
};

export default nextConfig;
