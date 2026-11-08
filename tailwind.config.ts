import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        abyss: "#04201A",
        forest: "#0B3328",
        mint: "#72F2B0",
        jade: "#06BF62",
        coral: "#E5402B",
        mist: "rgb(var(--mist) / <alpha-value>)",
        sand: "rgb(var(--sand) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        card: "rgb(var(--card) / <alpha-value>)",
        paper: "rgb(var(--paper) / <alpha-value>)",
      },
      fontFamily: {
        display: ["Gloock", "Georgia", "serif"],
        sans: ['"Plus Jakarta Sans Variable"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
