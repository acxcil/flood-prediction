/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        // makes `bg-water-light` refer to our wave.svg
        'water-light': "url('/wave.svg')",
      },
    },
  },
  plugins: [],
}
