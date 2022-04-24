const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  i18n: {
    locales: ['en-US', 'fr'],
    defaultLocale: 'en-US',
  },
  images: {
    domains: ['raw.githubusercontent.com'],
  },
};

module.exports = withBundleAnalyzer(nextConfig);
