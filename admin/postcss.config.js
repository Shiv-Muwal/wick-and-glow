/** PostCSS config for Vite + Tailwind (uses new @tailwindcss/postcss plugin) */
const tailwindcss = require('@tailwindcss/postcss');
const autoprefixer = require('autoprefixer');

module.exports = {
  plugins: [tailwindcss, autoprefixer],
};

