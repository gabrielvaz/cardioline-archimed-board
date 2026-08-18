import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "../styles/tokens.css";
import "./globals.css";

/**
 * Inter é a tipografia do site oficial da Cardioline.
 * next/font faz self-host no build — a apresentação funciona sem internet,
 * que é o que importa num projetor de sala de reunião.
 */
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--cl-font-inter",
});

export const metadata: Metadata = {
  title: "Cardioline 2028 — Product Vision",
  description:
    "The future of cardiology is not another device. It's intelligence.",
};

export const viewport: Viewport = {
  themeColor: "#040a2a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
