import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        background: "#0a0a0a",
        foreground: "#ffffff",
        accent: "#00ff88",
        muted: "rgba(255,255,255,0.45)",
        surface: "rgba(255,255,255,0.06)",
        border: "rgba(255,255,255,0.1)",
      },
    },
  },
  plugins: [],
};
export default config;
