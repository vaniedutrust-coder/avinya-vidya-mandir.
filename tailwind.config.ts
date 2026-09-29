import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "brand-navy": "#112A3A",
        "brand-navy-soft": "#294656",
        "brand-teal": "#6F8F84",
        "brand-teal-deep": "#2F5D50",
        "brand-teal-soft": "#E8F0EC",
        "brand-amber": "#B78B43",
        "brand-amber-deep": "#8E6A2E",
        "brand-amber-soft": "#F3EBDD",
        "brand-terracotta": "#B66A55",
        "brand-terracotta-soft": "#F4E6E0",
        "brand-alabaster": "#FAF7F0",
        "brand-sand": "#EEE7DD",
        "brand-mist": "#EEF3F0",
        "brand-border": "#DED6C9",
        "brand-white": "#FFFFFF"
      },
      boxShadow: {
        soft: "0 24px 70px rgba(17, 42, 58, 0.10)",
        lift: "0 14px 42px rgba(17, 42, 58, 0.10)",
        card: "0 8px 24px rgba(17, 42, 58, 0.07)"
      }
    }
  },
  plugins: []
};

export default config;
