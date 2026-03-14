import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        coffee: {
          50: "#faf7f5",
          100: "#f2ebe6",
          200: "#e8d9ce",
          300: "#d4bfab",
          400: "#bea088",
          500: "#ac876e",
          600: "#9e7364",
          700: "#835d52",
          800: "#6c4e46",
          900: "#59423c",
          950: "#2f211d",
        },
        cream: {
          50: "#fefdfb",
          100: "#fcf9f3",
          200: "#f8f2e8",
          300: "#f2e6d5",
          400: "#e8d4bc",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
