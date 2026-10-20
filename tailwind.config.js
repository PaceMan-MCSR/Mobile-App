/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/app/**/*.{js,jsx,ts,tsx}", "./src/components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        rank: {
          gold: "#daa520",
          silver: "#929292",
          bronze: "#cd7f32",
        },
      },
    },
  },
  plugins: [],
};
