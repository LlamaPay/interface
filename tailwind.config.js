const plugin = require('tailwindcss/plugin');

module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {},
    debugScreens: {
      position: ['bottom', 'right'],
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwindcss-debug-screens'),
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
