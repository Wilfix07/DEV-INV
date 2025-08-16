/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deb-red': '#DC2626',
        'deb-yellow': '#F59E0B',
        'deb-blue': '#2563EB',
        'deb-dark': '#1F2937',
        'deb-light': '#F9FAFB'
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
