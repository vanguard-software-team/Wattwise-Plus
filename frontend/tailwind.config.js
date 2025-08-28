/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/tailwind-datepicker-react/dist/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        play: ["Play", "sans-serif"],
        jetbrains: ["JetBrains Mono", "monospace"],
        robotoflex: ["Roboto Flex", "sans-serif"],
        ubuntu: ["Ubuntu", "sans-serif"],
        cairo: ["Cairo", "sans-serif"],
      },
      backgroundImage: {
        lines: "url('/src/assets/images/background/lines.jpg')",
        orangelimits: "url('/src/assets/images/background/orangelimits.png')",
      },
    },
  },
  plugins: [require("flowbite/plugin"), require("tailwindcss-animate")],
};
