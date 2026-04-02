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
        /** Dark mode: near-black canvas */
        background: "#0a0a0a",
        /** Primary text: white */
        foreground: "#ffffff",
        /** CTAs: white fill, use with `text-background` for black label */
        accent: "#ffffff",
        muted: "rgba(255,255,255,0.5)",
        surface: "rgba(255,255,255,0.06)",
        border: "rgba(255,255,255,0.12)",
      },
    },
  },
  plugins: [],
};
export default config;
