/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        'ruin-gold': '#c9a66b',
        'ruin-moss': '#4a5d4e',
        'ruin-brick': '#8b5e4b',
        'ruin-ash': '#3d3a36',
      },
    },
  },
  plugins: [],
}
