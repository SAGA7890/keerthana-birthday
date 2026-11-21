/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cosmic: {
          950: '#0b0716',
          900: '#130c26',
          800: '#1f143d',
          700: '#2e1d59',
        },
        lavender: {
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
        },
        blush: {
          200: '#fbcfe8',
          300: '#f9a8d4',
        },
        stardust: '#f9f6ff',
        moonGold: '#f5d08a',
      },
      fontFamily: {
        display: ['"Cinzel Decorative"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        handwriting: ['"Caveat"', 'cursive'],
      },
      boxShadow: {
        glow: '0 0 40px -10px rgba(216, 180, 254, 0.35)',
        goldGlow: '0 0 32px -6px rgba(245, 208, 138, 0.4)',
      },
    },
  },
  plugins: [],
};