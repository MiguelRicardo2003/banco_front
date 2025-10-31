/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bbva-blue': '#043263',
        'bbva-light-blue': '#1973B8',
        'bbva-sky': '#5BBEFF',
        'bbva-gray': '#F4F4F4',
      },
    },
  },
  plugins: [],
}
