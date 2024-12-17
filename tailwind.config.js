/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        text: {
          primary: "rgb(var(--color-text-primary) / <alpha-value>)",
          secondary: "rgb(var(--color-text-secondary) / <alpha-value>)",
        },
        background: {
          primary: "rgb(var(--color-background-primary) / <alpha-value>)",
          secondary: "rgb(var(--color-background-secondary) / <alpha-value>)",
        },
        pickerTint: "rgb(var(--color-picker-tint) / <alpha-value>)",
        tint: "rgb(var(--color-tint) / <alpha-value>)",
        icon: "rgb(var(--color-icon) / <alpha-value>)",
        tabIconDefault: "rgb(var(--color-tab-icon-default) / <alpha-value>)",
        tabIconSelected: "rgb(var(--color-tab-icon-selected) / <alpha-value>)",
        rank: {
          gold: "#daa520",
          silver: "#929292",
          bronze: "#cd7f32",
        },
      },
    },
  },
  darkMode: "media", // Automatically switch based on prefers-color-scheme
  plugins: [],
};
