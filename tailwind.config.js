/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      /* ===================== */
      /* FONT */
      /* ===================== */
      fontFamily: {
        sans: ["'Golos Text'", "system-ui", "sans-serif"],
      },

      /* ===================== */
      /* COLORS */
      /* ===================== */
      colors: {
        brand: {
          blue: "#3B82F6",
          violet: "#7C3AED",
          red: "#DC2626",
          dark: "#1F2937",
        },
      },

      /* ===================== */
      /* BACKGROUND */
      /* ===================== */
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(135deg, #3B82F6 0%, #7C3AED 50%, #DC2626 100%)",
      },

      /* ===================== */
      /* ANIMATIONS */
      /* ===================== */
      keyframes: {
        toast: {
          "0%": { opacity: 0, transform: "translateY(12px) scale(0.95)" },
          "100%": { opacity: 1, transform: "translateY(0) scale(1)" },
        },
      },
      animation: {
        toast: "toast 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};
