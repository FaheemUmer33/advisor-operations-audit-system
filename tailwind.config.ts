import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#07182f",
        ink: "#132238",
        accent: "#2563eb",
        surface: "#f5f7fb",
      },
      boxShadow: {
        soft: "0 12px 30px rgba(7, 24, 47, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
