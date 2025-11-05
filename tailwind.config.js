/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './**/*.html', 
    './src/**/*.js',
    "./dist/**/*.html"
  ],
  safelist: [
    'w-5', 'h-5', 'w-10', 'h-10',
    'rounded-full',
    'object-cover',
    'flex', 'items-center', 'gap-2',
    'font-century-gothic',
    'text-gray-800'
  ],
  theme: {
    extend: {
      fontFamily: {
        'archivo': ['Archivo', 'sans-serif'],
        'monda': ['Monda', 'sans-serif'],
        'century-gothic': ['Century Gothic', 'sans-serif'],
      },
      colors: {
        'vertClair': '#00C469',
        'vertFonce': '#004625',
      },
    },
  },
  plugins: [],
}

