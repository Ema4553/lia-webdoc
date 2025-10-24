/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './**/*.html', 
    './src/**/*.js',
    "./dist/**/*.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        'archivo': ['Archivo', 'sans-serif'],
        'monda': ['Monda', 'sans-serif'],
      },
      colors: {
        'vertClair': '#00C469',
        'vertFonce': '#004625',
      },
    },
  },
  plugins: [],
}

