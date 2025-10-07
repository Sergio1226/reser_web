/** @type {import('tailwindcss').Config} */
export default {
   content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary:"#f8b784ff",
        primary_light:"#fcc9a0",
        primary_dark:"#f5a566",
        contrast:"#0BA6DF",
        secondary:"rgba(204, 248, 211, 1)",
        gradient_1:"rgba(232, 247, 232, 1)",
        button_primary:"#6EBCF7",
        button_primary_dark:"#5aa8e3",
        button_secondary:"rgba(144, 245, 163, 1)",
        button_secondary_light:"#7ce89d",
        button_exit: "#F87171",
        button_exit_dark: "#ef5a5a",
        button_bookings:"#C6E4CB",
        button_bookings_dark:"#b0d4b5",
        header_bg_light: "#fcc9a0",
        header_bg_medium: "#f8b784",
        header_bg_dark: "#f5a566",
        header_text_accent: "#fff5eb"
      },
      size:{
        icon: '20px',
        item: '40px'
      },
      borderRadius: { 'button': '10px' },
      fontFamily: {
        primary: ['Open Sans', 'sans-serif'],
      },
      boxShadow: {
        'button-primary': '0 4px 14px 0 rgba(110, 188, 247, 0.4)',
        'button-primary-hover': '0 6px 20px 0 rgba(110, 188, 247, 0.5)',
        'button-secondary': '0 4px 14px 0 rgba(144, 245, 163, 0.4)',
        'button-secondary-hover': '0 6px 20px 0 rgba(144, 245, 163, 0.5)',
        'button-exit': '0 4px 14px 0 rgba(248, 113, 113, 0.4)',
        'button-exit-hover': '0 6px 20px 0 rgba(248, 113, 113, 0.5)',
        'button-bookings': '0 4px 14px 0 rgba(198, 228, 203, 0.4)',
        'button-bookings-hover': '0 6px 20px 0 rgba(198, 228, 203, 0.5)',
      }
    },
  },
  plugins: [],
}