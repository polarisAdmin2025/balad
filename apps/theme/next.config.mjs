/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui"],
  swcMinify: false,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@next/swc-linux-x64-gnu': false,
      '@next/swc-linux-x64-musl': false,
      '@next/swc-darwin-x64': false,
      '@next/swc-darwin-arm64': false
    }
    return config
  },
  experimental: {
    forceSwcTransforms: false,
    swcTraceProfiling: false
  }
};

export default nextConfig;