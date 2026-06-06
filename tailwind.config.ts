import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        /* ── Luxury palette ── */
        ivory:     "#fffaf0",
        champagne: "#f2d38a",
        gold:      "#d4a853",
        rose:      "#b96c74",
        blush:     "#f0c8cc",
        plum:      "#341a2d",
        "plum-dark": "#21101d",
        sage:      "#8ca58a",
        "sage-dark": "#5a7a58"
      },
      fontFamily: {
        sans:    ["var(--font-sans)",    "Inter",             "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Cormorant Garamond","Playfair Display", "serif"]
      },
      borderRadius: {
        DEFAULT: "var(--radius)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },
      boxShadow: {
        aura:   "0 24px 80px rgba(52,26,45,0.18)",
        glass:  "0 4px 24px rgba(52,26,45,0.08), 0 1px 4px rgba(52,26,45,0.04)",
        luxury: "0 32px 96px rgba(52,26,45,0.22), 0 8px 24px rgba(52,26,45,0.10)",
        "inner-gold": "inset 0 1px 0 rgba(242,211,138,0.40)"
      },
      keyframes: {
        shimmer: {
          "0%":   { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(-14px)" }
        },
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(28px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "fade-in": {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" }
        },
        "scale-in": {
          "0%":   { opacity: "0", transform: "scale(0.94)" },
          "100%": { opacity: "1", transform: "scale(1)" }
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.4" }
        },
        "spin-slow": {
          "0%":   { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" }
        }
      },
      animation: {
        shimmer:    "shimmer 2.6s linear infinite",
        float:      "float 7s ease-in-out infinite",
        "fade-up":  "fade-up 0.8s cubic-bezier(0.22,1,0.36,1) both",
        "fade-in":  "fade-in 0.6s ease both",
        "scale-in": "scale-in 0.5s cubic-bezier(0.22,1,0.36,1) both",
        "spin-slow":"spin-slow 20s linear infinite"
      },
      backgroundImage: {
        "gold-shimmer": "linear-gradient(135deg, #d4a853 0%, #f2d38a 40%, #c8903a 100%)",
        "rose-shimmer": "linear-gradient(135deg, #b96c74 0%, #e8a4ab 50%, #9b4a52 100%)",
        "ivory-fade":   "linear-gradient(180deg, #fffaf0 0%, rgba(255,250,240,0) 100%)",
        "plum-fade":    "linear-gradient(180deg, #341a2d 0%, rgba(52,26,45,0) 100%)"
      }
    }
  },
  plugins: [animate]
};

export default config;
