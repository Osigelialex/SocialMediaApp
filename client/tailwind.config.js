/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
      },
      colors: {
        darkBg: '#1a1a1b',
        darkthemetext: '#d7dadc',
        field: '#272729'
      }
    },
  },
  plugins: [],
}