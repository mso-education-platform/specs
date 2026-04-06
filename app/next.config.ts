import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Point turbopack root to the `app` directory to avoid workspace-root warnings
  turbopack: {
    root: __dirname,
  },
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
