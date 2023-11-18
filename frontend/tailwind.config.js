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
      }
    },
  },
  plugins: [
      require('flowbite/plugin')
  ],
}

