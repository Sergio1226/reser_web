/** @type {import('tailwindcss').Config} */
export default {
   content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#F8AD74",
        gradient_1:"#8ABE92F0",
        gradient_2:"#FFFFFF",
      },
      borderRadius: { 'button': '10px' },
      fontFamily: {
        kameron: ['Kameron', 'serif'],
      },
    },
  },
  plugins: [],
}

