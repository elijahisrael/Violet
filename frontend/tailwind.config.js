/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: { 
      colors: {
        "violet-color": "#8888f8",
        "light-violet-color": "#bdbfee",
     },
    },
  },
  plugins: [],
}

