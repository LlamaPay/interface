const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['en', 'fr-FR', 'pt-PT', 'es-ES', 'el-GR', 'ja-JP'],
    defaultLocale: 'en',
  },
  images: {
    domains: ['raw.githubusercontent.com', 'assets.coingecko.com'],
  },
  async redirects() {
    return [
      {
        source: '/salaries',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);
