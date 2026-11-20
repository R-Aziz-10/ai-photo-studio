/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Nama kunci tetap sama; hanya warnanya diganti ke teal/biru laut (tema Dies Natalis)
        brand: { 50: '#E6F7F7', 500: '#12A3A8', 600: '#0B7F86', 700: '#096A72', 900: '#0A444B' },
        cyber: { neon: '#0B7F86', purple: '#1B6FA8', pink: '#FF7A59', dark: '#0E3B4F' },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'], display: ['Fredoka', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
};
