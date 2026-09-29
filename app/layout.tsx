import type { Metadata } from "next";
import { Cinzel, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel", display: "swap" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });

export const metadata: Metadata = {
  title: "Avinya Vidya Mandir | Rooted in Values, Rising in Excellence",
  description: "Avinya Vidya Mandir is a boutique foundational school in Delhi, growing toward a complete CBSE K–12 journey.",
  metadataBase: new URL("https://avinyaschool.com")
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={cinzel.variable + " " + jakarta.variable}>{children}</body>
    </html>
  );
}
