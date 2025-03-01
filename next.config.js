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
    domains: ['raw.githubusercontent.com', 'assets.coingecko.com', 'defillama.com', 'coin-images.coingecko.com'],
  },
  async redirects() {
    return [
      {
        source: '/create',
        destination: '/salaries/create',
        permanent: true,
      },
      {
        source: '/withdraw',
        destination: '/salaries/withdraw',
        permanent: true,
      },
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);
