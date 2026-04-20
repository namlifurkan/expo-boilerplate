/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // CSS-variable-backed semantic tokens — flip via .dark class
        surface: {
          primary: "var(--color-surface-primary)",
          secondary: "var(--color-surface-secondary)",
          tertiary: "var(--color-surface-tertiary)",
          card: "var(--color-surface-card)",
          cardAlt: "var(--color-surface-cardAlt)",
        },
        content: {
          primary: "var(--color-content-primary)",
          secondary: "var(--color-content-secondary)",
          tertiary: "var(--color-content-tertiary)",
          muted: "var(--color-content-muted)",
        },
        stroke: {
          primary: "var(--color-stroke-primary)",
          secondary: "var(--color-stroke-secondary)",
        },
        accent: {
          primary: "var(--color-accent-primary)",
        },
      },
      fontFamily: {
        sans: ["system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
      },
    },
  },
  plugins: [],
};
