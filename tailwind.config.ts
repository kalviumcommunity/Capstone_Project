import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/**/*.{ts,tsx}"],
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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
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
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        calm: {
          50: "hsl(var(--calm-50))",
          100: "hsl(var(--calm-100))",
          200: "hsl(var(--calm-200))",
          300: "hsl(var(--calm-300))",
          400: "hsl(var(--calm-400))",
          500: "hsl(var(--calm-500))",
          600: "hsl(var(--calm-600))",
          700: "hsl(var(--calm-700))",
          800: "hsl(var(--calm-800))",
          900: "hsl(var(--calm-900))",
        },
        healing: {
          50: "hsl(var(--healing-50))",
          100: "hsl(var(--healing-100))",
          200: "hsl(var(--healing-200))",
          300: "hsl(var(--healing-300))",
          400: "hsl(var(--healing-400))",
          500: "hsl(var(--healing-500))",
          600: "hsl(var(--healing-600))",
          700: "hsl(var(--healing-700))",
          800: "hsl(var(--healing-800))",
          900: "hsl(var(--healing-900))",
        },
        serenity: {
          50: "hsl(var(--serenity-50))",
          100: "hsl(var(--serenity-100))",
          200: "hsl(var(--serenity-200))",
          300: "hsl(var(--serenity-300))",
          400: "hsl(var(--serenity-400))",
          500: "hsl(var(--serenity-500))",
          600: "hsl(var(--serenity-600))",
          700: "hsl(var(--serenity-700))",
          800: "hsl(var(--serenity-800))",
          900: "hsl(var(--serenity-900))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
