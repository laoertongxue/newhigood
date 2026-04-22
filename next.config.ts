import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable Edge Runtime optimizations that may cause middleware issues
  experimental: {
    // Ensure middleware uses Node.js runtime compatibility
  },
  // Ensure middleware runs in Node.js runtime
  serverExternalPackages: [],
};

export default nextConfig;
