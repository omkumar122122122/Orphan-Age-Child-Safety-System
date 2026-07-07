/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        ink: "#0f172a",
        // Primary blue
        civic: {
          50:  "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          950: "#172554"
        },
        // Secondary indigo
        indigo: {
          50:  "#eef2ff",
          100: "#e0e7ff",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca"
        },
        // Accent cyan
        accent: {
          50:  "#ecfeff",
          100: "#cffafe",
          500: "#06b6d4",
          600: "#0891b2"
        },
        // Surface
        surface: "#F5F7FB",
        // Sidebar
        sidebar: "#0F172A",
        // Borders
        border: "#E5E7EB",
        // Status
        success: "#22C55E",
        warning: "#F59E0B",
        danger:  "#EF4444",
        // Legacy aliases kept for compatibility
        saffron: "#f59e0b",
        safety:  "#22c55e",
        alert:   "#ef4444"
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.25rem",
        "4xl": "1.5rem"
      },
      boxShadow: {
        card:   "0 1px 3px rgba(15,23,42,0.06), 0 4px 16px rgba(15,23,42,0.06)",
        "card-hover": "0 4px 12px rgba(15,23,42,0.08), 0 12px 32px rgba(15,23,42,0.10)",
        glass:  "0 8px 32px rgba(15,23,42,0.10)",
        modal:  "0 24px 64px rgba(15,23,42,0.20)",
        sidebar: "4px 0 24px rgba(15,23,42,0.18)"
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
        "gradient-accent":  "linear-gradient(135deg, #06b6d4 0%, #2563eb 100%)",
        "gradient-success": "linear-gradient(135deg, #22c55e 0%, #06b6d4 100%)",
        "gradient-dark":    "linear-gradient(160deg, #0f172a 0%, #1e293b 100%)"
      }
    }
  },
  plugins: []
};
