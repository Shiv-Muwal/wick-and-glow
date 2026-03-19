/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: 'var(--cream)',
        blush: 'var(--blush)',
        sage: 'var(--sage)',
        gold: 'var(--gold)',
        deep: 'var(--deep)',
        text: 'var(--text)',
        lightText: 'var(--light-text)',
      },
      boxShadow: {
        soft: 'var(--shadow)',
        hover: 'var(--shadow-hover)',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
    },
  },
  plugins: [],
};

