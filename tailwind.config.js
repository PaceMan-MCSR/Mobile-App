/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
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
