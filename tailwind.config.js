/** @type {import('tailwindcss').Config} */
export default {
   content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary:"#f8b784ff",
        secondary:"rgba(191, 247, 200, 1)",
        gradient_1:"rgba(221, 247, 221, 1)",
        button_primary:"#6EBCF7",
      },
      size:{
        icon: '20px',
      },
      borderRadius: { 'button': '10px' },
      fontFamily: {
        kameron: ['Kameron', 'serif'],
      },
    },
  },
  plugins: [],
}

