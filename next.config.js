/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreBuildErrors: true
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
