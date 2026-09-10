import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FAFAFA",
        brand: {
          purple: "#7C3AED",
          pink: "#EC4899",
          blue: "#2563EB",
          dark: "#1E1B4B",
          light: "#F5F3FF",
        },
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)",
        "gradient-subtle": "linear-gradient(135deg, #F5F3FF 0%, #FCE7F3 100%)",
        "gradient-card": "linear-gradient(180deg, #FFFFFF 0%, #FAF5FF 100%)",
      },
      boxShadow: {
        card: "0 4px 20px -2px rgba(124, 58, 237, 0.08)",
        glow: "0 0 25px rgba(236, 72, 153, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
