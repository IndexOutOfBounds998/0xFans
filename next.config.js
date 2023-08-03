/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['lh3.googleusercontent.com', 'firebasestorage.googleapis.com']
  },
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
  transpilePackages: ['@lens-protocol']
};

module.exports = nextConfig;
