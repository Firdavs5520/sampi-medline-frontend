/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#3B82F6",
          violet: "#7C3AED",
          red: "#DC2626",
          dark: "#1F2937",
        },
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(135deg, #3B82F6 0%, #7C3AED 50%, #DC2626 100%)",
      },
    },
  },
  animation: {
    toast: "toast 0.35s ease-out",
  },
  keyframes: {
    toast: {
      "0%": { opacity: 0, transform: "translateY(-10px)" },
      "100%": { opacity: 1, transform: "translateY(0)" },
    },
  },
  plugins: [],
};
