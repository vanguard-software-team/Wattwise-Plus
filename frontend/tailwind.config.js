/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    "./node_modules/tailwind-datepicker-react/dist/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily:{
        'play': ['Play', 'sans-serif'],
        'jetbrains': ['JetBrains Mono', 'monospace'],
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

