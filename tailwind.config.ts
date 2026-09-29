import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "brand-navy": "#0B2038",
        "brand-navy-soft": "#173652",
        "brand-teal": "#4EA685",
        "brand-teal-deep": "#2F705D",
        "brand-teal-soft": "#EAF5EF",
        "brand-amber": "#F7B538",
        "brand-amber-soft": "#FBEDC8",
        "brand-terracotta": "#E05A36",
        "brand-terracotta-soft": "#F7E4DC",
        "brand-alabaster": "#FDFBF7",
        "brand-sand": "#F4EFE7",
        "brand-mist": "#EDF4EF",
        "brand-border": "#EAE6DF",
        "brand-white": "#FFFFFF"
      },
      boxShadow: {
        soft: "0 24px 70px rgba(11, 32, 56, 0.10)",
        lift: "0 14px 40px rgba(11, 32, 56, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
