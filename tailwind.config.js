/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#d81b60',
          light: '#fce4ec',
          dark: '#ad1457',
        },
        secondary: '#1a1a1a',
      },
      borderRadius: {
        'martha': '12px',
      }
    },
  },
  plugins: [],
}
