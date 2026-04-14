/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        treasury: {
          dark: '#020817',
          accent: '#22d3ee',
          warm: '#fbbf24',
        },
      },
    },
  },
  plugins: [],
}
