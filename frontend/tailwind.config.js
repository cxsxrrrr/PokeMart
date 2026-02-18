const { heroui } = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@heroui/**/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // paleta de GlobalStyle
        poke: {
          red: "#be1f1f",
          yellow: "#FFCC00",
          blue: "#14113a",
          darkBlue: "#141f41",
          light: "#e6e6ee",
          darkBg: "#0b1021"
        }
      }
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          layout: {},
          colors: {
             background: "#e6e6ee",
             foreground: "#333333",
             primary: {
               DEFAULT: "#be1f1f",
               foreground: "#ffffff",
             }
          },
        },
        dark: {
          layout: {},
          colors: {
            background: "#0b1021",
            foreground: "#e5e7eb",
            content1: "#17233f",
            content2: "#1f2937",
            content3: "#0f172a",
            content4: "#0b1220",

            primary: {
              DEFAULT: "#be1f1f",
              foreground: "#ffffff",
            },
            focus: "#FFCC00",
          },
        },
      },
    }),
  ],
};