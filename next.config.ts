import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for Cloud Run deployment
  output: 'standalone',

  // Disable image optimization for standalone (use external service if needed)
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
