/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily:{
        'play': ['Play', 'sans-serif'],
      },
      backgroundImage: {
        'lines': "url('/src/assets/images/background/lines.jpg')",
      }
    },
  },
  plugins: [
      require('flowbite/plugin')
  ],
}

