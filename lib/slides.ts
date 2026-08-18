/**
 * Registry dos 22 slides.
 *
 * Fonte única da ordem, dos ids de deep-link e do tema de fundo. O ritmo de cor
 * é deliberado: branco é a norma e três slides são navy — a ambição (05), o
 * reveal do Anchor (14) e a provocação (20). Os três momentos altos da narrativa
 * são também os três respiros escuros.
 */

export type SlideTheme = "white" | "ink";

export type SlideMeta = {
  n: number;
  id: string;
  title: string;
  theme: SlideTheme;
};

export const SLIDES: readonly SlideMeta[] = [
  { n: 1, id: "opening", title: "Opening", theme: "white" },
  { n: 2, id: "legacy", title: "Legacy", theme: "white" },
  { n: 3, id: "what-changes", title: "What changes", theme: "white" },
  { n: 4, id: "transformation", title: "The transformation", theme: "white" },
  { n: 5, id: "ambition", title: "The ambition", theme: "ink" },
  { n: 6, id: "product-quality", title: "Product quality", theme: "white" },
  { n: 7, id: "in-their-hands", title: "In their hands", theme: "white" },
  { n: 8, id: "in-their-minds", title: "In their minds", theme: "white" },
  { n: 9, id: "digital-layer", title: "The digital layer", theme: "white" },
  { n: 10, id: "anchor", title: "Anchor", theme: "white" },
  { n: 11, id: "free-changes-everything", title: "Free changes everything", theme: "white" },
  { n: 12, id: "business-model", title: "Business model", theme: "white" },
  { n: 13, id: "three-layers", title: "Three layers", theme: "white" },
  { n: 14, id: "prototype-reveal", title: "Prototype reveal", theme: "ink" },
  { n: 15, id: "intelligence", title: "Intelligence", theme: "white" },
  { n: 16, id: "depth", title: "Depth", theme: "white" },
  { n: 17, id: "prediction", title: "Prediction", theme: "white" },
  { n: 18, id: "speed", title: "Speed", theme: "white" },
  { n: 19, id: "invisible-complexity", title: "Invisible complexity", theme: "white" },
  { n: 20, id: "the-standard", title: "The standard", theme: "ink" },
  { n: 21, id: "what-must-be-true", title: "What must be true", theme: "white" },
  { n: 22, id: "closing", title: "Closing", theme: "white" },
] as const;

export const TOTAL_SLIDES = SLIDES.length;

/** Hash de deep-link de um slide: #01 … #22. */
export const slideHash = (n: number) => `#${String(n).padStart(2, "0")}`;
