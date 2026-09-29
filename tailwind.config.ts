import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "brand-navy": "#0B2038",
        "brand-teal": "#4EA685",
        "brand-amber": "#F7B538",
        "brand-terracotta": "#E05A36",
        "brand-alabaster": "#FDFBF7",
        "brand-border": "#EAE6DF"
      },
      boxShadow: {
        soft: "0 20px 60px rgba(11, 32, 56, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
