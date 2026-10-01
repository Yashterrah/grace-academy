import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        sm: "1.5rem",
        lg: "2rem",
      },
    },
    extend: {
      colors: {
        cream: {
          DEFAULT: "#FAF7F1",
          50: "#FFFFFF",
          100: "#FAF7F1",
          200: "#F1ECE1",
        },
        ink: {
          DEFAULT: "#12181B",
          soft: "#3A444A",
          faint: "#6B767C",
        },
        teal: {
          50: "#E7F3F1",
          100: "#C4E1DC",
          200: "#8FC4BB",
          300: "#59A79A",
          400: "#2E8A79",
          500: "#106B63",
          600: "#0B4F4A",
          700: "#093F3B",
          800: "#062E2B",
          900: "#041F1D",
        },
        violet: {
          50: "#EEEAFB",
          100: "#D3C8F4",
          200: "#AC96E8",
          300: "#8567D9",
          400: "#6647C4",
          500: "#4A3AA8",
          600: "#3A2E86",
          700: "#2C2266",
          800: "#1F1849",
          900: "#140F30",
        },
        azure: {
          50: "#E9F1FC",
          100: "#C4DBF7",
          200: "#8FBBEF",
          300: "#5A9BE6",
          400: "#357FD6",
          500: "#2C6ECB",
          600: "#2455A0",
          700: "#1B3F79",
          800: "#122A52",
          900: "#0A172F",
        },
        gold: {
          50: "#FDF3E3",
          100: "#FAE2B7",
          200: "#F4C877",
          300: "#EDAD42",
          400: "#E8A33D",
          500: "#D48A20",
          600: "#A96B18",
          700: "#7E4F12",
        },
        surface: {
          night: "#0B1622",
          dusk: "#101B2D",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        body: ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "grace-mesh":
          "radial-gradient(120% 120% at 10% 0%, #0B4F4A 0%, #093F3B 28%, #2C2266 62%, #1B3F79 100%)",
        "grace-mesh-soft":
          "radial-gradient(120% 120% at 90% 0%, rgba(232,163,61,0.16) 0%, rgba(74,58,168,0.10) 35%, rgba(11,79,74,0) 70%)",
      },
      boxShadow: {
        card: "0 4px 24px -6px rgba(11, 79, 74, 0.14)",
        "card-hover": "0 16px 40px -12px rgba(11, 79, 74, 0.28)",
        glow: "0 0 0 1px rgba(232,163,61,0.35), 0 8px 30px -4px rgba(232,163,61,0.35)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "draw-line": {
          "0%": { strokeDashoffset: "1000" },
          "100%": { strokeDashoffset: "0" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both",
        "float-slow": "float-slow 6s ease-in-out infinite",
        "draw-line": "draw-line 2.4s ease forwards",
        marquee: "marquee 28s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
