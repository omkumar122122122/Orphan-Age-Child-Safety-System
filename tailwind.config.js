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
        ink: "#101828",
        civic: {
          50: "#eef7ff",
          100: "#d8ecff",
          500: "#1c74d8",
          600: "#155fba",
          700: "#174f96"
        },
        saffron: "#f59e0b",
        safety: "#0f9f6e",
        alert: "#dc2626"
      },
      boxShadow: {
        glass: "0 18px 60px rgba(15, 23, 42, 0.12)"
      }
    }
  },
  plugins: []
};
