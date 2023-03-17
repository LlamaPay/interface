const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ['en', 'fr-FR', 'pt-PT', 'es-ES', 'el-GR', 'ja-JP'],
    defaultLocale: 'en',
  },
  images: {
    domains: ['raw.githubusercontent.com', 'assets.coingecko.com', 'defillama.com'],
  },
  async redirects() {
    return [
      {
        source: '/salaries/create',
        destination: '/create',
        permanent: true,
      },
      {
        source: '/incoming',
        destination: '/incoming/dashboard',
        permanent: true,
      },
      {
        source: '/dashboard',
        destination: '/incoming/dashboard',
        permanent: true,
      },
      {
        source: '/outgoing',
        destination: '/outgoing/dashboard',
        permanent: true,
      },
      {
        source: '/token-salaries/incoming',
        destination: '/incoming/token-salaries',
        permanent: true,
      },
      {
        source: '/token-salaries/outgoing',
        destination: '/outgoing/token-salaries',
        permanent: true,
      },
      {
        source: '/vesting',
        destination: '/incoming/vesting',
        permanent: true,
      },
      {
        source: '/payments',
        destination: '/incoming/payments',
        permanent: true,
      },
      {
        source: '/salaries/:path*',
        destination: '/incoming/dashboard/:path*',
        permanent: true,
      },
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);
