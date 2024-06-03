/** @type {import('tailwindcss').Config} */
const { nextui } = require("@nextui-org/react");
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "dodger-blue": {
          50: "#f0f8ff",
          100: "#e0f0fe",
          200: "#bae1fd",
          300: "#7cc8fd",
          400: "#37adf9",
          500: "#0f99f2",
          600: "#0174c8",
          700: "#025ca2",
          800: "#064f86",
          900: "#0b426f",
          950: "#082a49",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
