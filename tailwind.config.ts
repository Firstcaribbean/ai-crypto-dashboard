import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        night: "#050711",
        ink: "#080b16",
        panel: "rgba(13, 18, 35, 0.74)",
        cyan: "#23e6ff",
        bluefire: "#3b82ff",
        violet: "#a855f7",
        magenta: "#ff4ecd",
        mint: "#44ffb1"
      },
      boxShadow: {
        glow: "0 0 40px rgba(35, 230, 255, 0.22)",
        violet: "0 0 38px rgba(168, 85, 247, 0.22)"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "Segoe UI", "Arial", "sans-serif"]
      },
      backgroundImage: {
        "grid-radial":
          "radial-gradient(circle at top left, rgba(35,230,255,.18), transparent 30%), radial-gradient(circle at 75% 20%, rgba(168,85,247,.22), transparent 34%), linear-gradient(180deg, #050711 0%, #080b16 54%, #050711 100%)"
      }
    }
  },
  plugins: []
};

export default config;
