/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily:{
        'play': ['Play', 'sans-serif'],
      },
      backgroundImage: {
        'lines': "url('/src/assets/images/background/lines.jpg')",
        'orangelimits': "url('/src/assets/images/background/orangelimits.png')",
      }
    },
  },
  plugins: [
      require('flowbite/plugin')
  ],
}

