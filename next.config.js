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
};

module.exports = withBundleAnalyzer(nextConfig);
