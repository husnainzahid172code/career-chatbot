/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81"
        },
        surface: {
          page: "#F8F9FA",
          card: "#FFFFFF",
          muted: "#F4F5F6"
        },
        sage: {
          bg: "#DCFCE7",
          text: "#166534",
          border: "#BBF7D0"
        },
        amber: {
          bg: "#FFFBEB",
          fg: "#D97706",
          border: "#FDE68A"
        },
        slate: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A"
        }
      }
    }
  },
  plugins: []
};

