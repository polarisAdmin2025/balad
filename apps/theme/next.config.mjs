/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui"],
  swcMinify: false,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@next/swc-linux-x64-gnu': false,
      '@next/swc-linux-x64-musl': false
    }
    return config
  },
  experimental: {
    forceSwcTransforms: false,
    swcTraceProfiling: false
  }
};

export default nextConfig;