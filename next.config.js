const { i18n } = require('./next-i18next.config');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n,
  images: {
    domains: ['raw.githubusercontent.com'],
  },
};

module.exports = withBundleAnalyzer(nextConfig);
