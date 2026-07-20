import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: "#1E3A2A",
          light: "#2C5240",
          dark: "#132318",
        },
        gold: {
          DEFAULT: "#C9A24B",
          light: "#E0C179",
          dark: "#A9822F",
        },
        cream: "#F5F1E8",
        ivory: "#FAF8F3",
        charcoal: "#232323",
      },
      fontFamily: {
        serif: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #E0C179 0%, #C9A24B 45%, #A9822F 100%)",
        "forest-gradient": "linear-gradient(160deg, #1E3A2A 0%, #132318 100%)",
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(30,58,42,0.25)",
        gold: "0 8px 24px -6px rgba(201,162,75,0.45)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      letterSpacing: {
        label: "0.22em",
      },
    },
  },
  plugins: [],
};
export default config;
