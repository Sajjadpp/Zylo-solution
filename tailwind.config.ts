import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

/** Neutral colours are CSS variables (see globals.css) so a `.theme-dark` block can flip them. */
const v = (name: string) => `rgb(var(--c-${name}) / <alpha-value>)`;

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: { DEFAULT: "1rem", sm: "1.5rem", lg: "2rem" }, screens: { "2xl": "1240px" } },
    extend: {
      colors: {
        bg: v("bg"),
        surface: v("surface"),
        card: v("card"),
        ink: v("ink"),
        muted: v("muted"),
        hl: v("hl"), // highlight: blue on light, yellow on dark
        line: "rgb(var(--c-ink) / 0.09)",
        primary: { DEFAULT: "#2541F5", 600: "#1B30C9", 400: "#4C66FF", 50: "#EEF1FF" },
        accent: { DEFAULT: "#FFC914", 600: "#E5AE00", 50: "#FFF7D6" },
        black: "#0B0B0F",
        whatsapp: "#25D366",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(11,11,15,0.04), 0 30px 70px -30px rgba(37,65,245,0.45)",
        card: "0 1px 2px rgba(11,11,15,0.04), 0 14px 34px -18px rgba(11,11,15,0.22)",
      },
      keyframes: {
        pulseRing: { "0%": { transform: "scale(1)", opacity: "0.55" }, "100%": { transform: "scale(1.7)", opacity: "0" } },
        shimmer: { "100%": { transform: "translateX(100%)" } },
      },
      animation: {
        pulseRing: "pulseRing 2.2s cubic-bezier(0.2,0.6,0.3,1) infinite",
        shimmer: "shimmer 1.6s infinite",
      },
    },
  },
  plugins: [typography],
};

export default config;
