/** @type {import('tailwindcss').Config} */
export default {
   content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary:"#f8b784ff",
        secondary:"#f8b784ff",
        gradient_1:"rgba(138, 190, 146,1)",
        gradient_2:"rgba(155, 190, 160, 1)",
        button_primary:"rgba(29, 166, 208, 1)"
      },
      borderRadius: { 'button': '10px' },
      fontFamily: {
        kameron: ['Kameron', 'serif'],
      },
    },
  },
  plugins: [],
}

