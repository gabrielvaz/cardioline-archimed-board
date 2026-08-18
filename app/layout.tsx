import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Inter } from "next/font/google";
import "../styles/tokens.css";
import "./globals.css";

/**
 * Inter é a tipografia do site oficial da Cardioline.
 * next/font faz self-host no build — a apresentação funciona sem internet,
 * que é o que importa num projetor de sala de reunião.
 */
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--cl-font-inter",
});

/**
 * Registro técnico. IBM Plex Mono foi desenhada para documentação de
 * engenharia; carrega valores medidos e rótulos de canal, onde a numeração
 * tabular importa mais que o estilo.
 */
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--cl-font-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Cardioline Vision 2028",
    template: "%s | Cardioline Vision 2028",
  },
  description:
    "The future of cardiology is not another device. It's intelligence.",
};

export const viewport: Viewport = {
  themeColor: "#040a2a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
