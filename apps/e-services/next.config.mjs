/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: false,
  experimental: {
    serverActions: true
  }
};

export default nextConfig;