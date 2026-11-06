import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        midnight: "#0A1A36",
        deep: "#132A4F",
        aqua: "#8ADFD8",
        lilac: "#ECE5F4",
        peach: "#F7DCCB",
        lime: "#DDF16A",
        ink: "#15213B",
        muted: "#55617E",
        paper: "#FBFAFD",
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
