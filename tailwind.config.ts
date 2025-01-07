import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#2196F3",
          hover: "#1976D2",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#6C757D",
          foreground: "#FFFFFF",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#1E293B",
        },
        muted: {
          DEFAULT: "#F8F9FA",
          foreground: "#6B7280",
        },
        chat: {
          input: {
            border: "#E0E0E0",
          },
          status: {
            online: "#10B981",
            time: "#6B7280",
          },
          selected: "#F3F4F6",
          hover: "#F5F5F5",
        },
        text: {
          primary: "#111827",
          secondary: "#6B7280",
          placeholder: "#9CA3AF",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
      boxShadow: {
        card: "0 2px 4px rgba(0,0,0,0.1)",
        "card-hover": "0 4px 6px rgba(0,0,0,0.1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;