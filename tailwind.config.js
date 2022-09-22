const plugin = require('tailwindcss/plugin');

module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'lp-primary': '#23BD8F',
        'lp-secondary': '#1BDBAD',
        'lp-white': '#FFFFFF',
        'lp-silver': '#FCFCFC',
        'lp-black': '#000000',
        'lp-gray-1': '#CBCBCB',
        'lp-gray-2': '#666666',
        'lp-gray-3': '#444446',
        'lp-gray-4': '#3D3D3D',
        'lp-gray-5': '#333336',
        'lp-gray-6': '#303030',
        'lp-gray-7': '#30313D',
        'lp-gray-8': '#161818',
        'lp-green-1': '#DCF5F0',
        'lp-green-2': '#BFF1E7',
        'lp-green-3': '#55E2C3',
        'lp-green-4': '#525A5A',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    plugin(({ addVariant }) => {
      addVariant('enter', '&[data-enter]');
      addVariant('leave', '&[data-leave]');
      addVariant('active-item', '&[data-active-item]');
      addVariant('active', ['&:active', '&[data-active]']);
      addVariant('focus-visible', ['&:focus-visible', '&[data-focus-visible]']);
      addVariant('aria-invalid', '&[aria-invalid="true"]');
      addVariant('aria-disabled', '&[aria-disabled="true"]');
      addVariant('aria-selected', '&[aria-selected="true"]');
      addVariant('aria-expanded', '&[aria-expanded="true"]');
      addVariant('aria-checked', '&[aria-checked="true"]');
    }),
  ],
};
