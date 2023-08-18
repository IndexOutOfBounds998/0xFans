/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreBuildErrors: true,
    ignoreDuringBuilds: true,
    rules: {
      quotes: [2, 'single', { avoidEscape: true }]
    }
  },
  reactStrictMode: true,
  swcMinify: true,
  images: {
    minimumCacheTTL: 30,
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**'
      },
      {
        protocol: 'http',
        hostname: '**'
      }
    ]
  },
  experimental: {
    newNextLinkBehavior: false
  },
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
  transpilePackages: ['@lens-protocol']
};

module.exports = nextConfig;
