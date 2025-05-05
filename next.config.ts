import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig: NextConfig = {
  output: 'export', // Enables static exports
  distDir: 'out',
  basePath,
  assetPrefix: basePath,
  images: {
    unoptimized: true, // Required for static export
  },
  // Ensure data files are copied to the output directory
  webpack: (config) => {
    // No need for empty plugin push if there's no custom handling
    return config;
  },
};

export default nextConfig;
