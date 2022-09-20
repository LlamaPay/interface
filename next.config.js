const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    legacyBrowsers: false,
    browsersListForSwc: true,
  },
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
        source: '/salaries',
        destination: '/',
        permanent: true,
      },
      {
        source: '/salaries/create',
        destination: '/create',
        permanent: true,
      },
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);
