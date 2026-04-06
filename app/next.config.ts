import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Point turbopack root to the `app` directory to avoid workspace-root warnings
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
