/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: {
          DEFAULT: "#0B0714",
          soft: "#120B22",
          card: "#170F2B",
        },
        amethyst: {
          DEFAULT: "#7C3AED",
          600: "#6D28D9",
          700: "#5B21B6",
        },
        orchid: "#C084FC",
        pulse: "#E879F9",
        ember: "#FBBF24",
        mist: "#A78BFA",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      backgroundImage: {
        "vault-gradient":
          "radial-gradient(120% 120% at 50% -10%, #2A1454 0%, #0B0714 55%)",
        "keyhole-glow":
          "radial-gradient(circle, rgba(232,121,249,0.35) 0%, rgba(124,58,237,0.15) 45%, transparent 70%)",
        "card-gradient":
          "linear-gradient(160deg, rgba(124,58,237,0.14) 0%, rgba(23,15,43,0.6) 60%)",
      },
      boxShadow: {
        glow: "0 0 40px -8px rgba(192,132,252,0.55)",
        "glow-sm": "0 0 18px -4px rgba(192,132,252,0.45)",
        card: "0 8px 32px -12px rgba(0,0,0,0.6)",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.6" },
          "80%,100%": { transform: "scale(1.6)", opacity: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "spark-rise": {
          "0%": { transform: "translateY(0) scale(1)", opacity: "0" },
          "10%": { opacity: "1" },
          "100%": { transform: "translateY(-60px) scale(0.4)", opacity: "0" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-ring": "pulse-ring 2.4s cubic-bezier(0.4,0,0.6,1) infinite",
        shimmer: "shimmer 2.5s linear infinite",
        "spark-rise": "spark-rise 1.6s ease-out infinite",
      },
    },
  },
  plugins: [],
};
