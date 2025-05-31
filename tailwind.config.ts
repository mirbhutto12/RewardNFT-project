import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Dark Theme Palette
        "theme-dark-background": "hsl(var(--theme-dark-background))", // #121212
        "theme-dark-surface": "hsl(var(--theme-dark-surface))", // #1E1E1E
        "theme-dark-primary": "hsl(var(--theme-dark-primary))", // #BB86FC
        "theme-dark-primary-hover": "hsl(var(--theme-dark-primary-hover))", // #A169E0
        "theme-dark-secondary": "hsl(var(--theme-dark-secondary))", // #03DAC6
        "theme-dark-text-primary": "hsl(var(--theme-dark-text-primary))", // #E0E0E0
        "theme-dark-text-secondary": "hsl(var(--theme-dark-text-secondary))", // #A0A0A0
        "theme-dark-border": "hsl(var(--theme-dark-border))", // #333333
        "theme-dark-error": "hsl(var(--theme-dark-error))", // #CF6679

        // Shadcn UI Dark Theme (ensure these align or are overridden)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))", // This will be our theme-dark-background
        foreground: "hsl(var(--foreground))", // This will be our theme-dark-text-primary
        primary: {
          DEFAULT: "hsl(var(--primary))", // theme-dark-primary
          foreground: "hsl(var(--primary-foreground))", // A contrasting color for text on primary, e.g., black or dark gray
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))", // theme-dark-secondary
          foreground: "hsl(var(--secondary-foreground))", // A contrasting color for text on secondary
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))", // theme-dark-error
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))", // theme-dark-surface
          foreground: "hsl(var(--card-foreground))", // theme-dark-text-primary
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
