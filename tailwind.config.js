/** @type {import('tailwindcss').Config} */
export default {
   content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary:"#f8b784ff",
        contrast:"#0BA6DF",
        secondary:"rgba(204, 248, 211, 1)",
        gradient_1:"rgba(232, 247, 232, 1)",
        button_primary:"#6EBCF7",
        button_secondary:"rgba(144, 245, 163, 1)",
        button_bookings:"#C6E4CB"
      },
      size:{
        icon: '20px',
      },
      borderRadius: { 'button': '10px' },
      fontFamily: {
        kameron: ['Kameron', 'serif'],
        primary: ['Open Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

