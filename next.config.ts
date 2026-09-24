import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  serverExternalPackages: ["pdf-parse"],
  experimental: {
    optimizePackageImports: ["shaders/react"],
  },
};

export default nextConfig;
