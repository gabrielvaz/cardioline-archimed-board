/**
 * Registry dos 10 slides da versão Archimed.
 *
 * Existe ao lado de `slides.ts` em vez de substituí-lo: o deck de 22 slides
 * continua vivo em `/vision`, e a evolução do argumento é parte do material.
 *
 * Por que 10 e não 22. A reunião tem 15 minutos e o board interrompe. Um deck
 * longo pressupõe que a ordem será respeitada, e aqui ela não vai: o pedido está
 * no slide 2, logo depois da capa, e não no fim, e cada slide sobrevive sozinho
 * porque provavelmente vai ser aberto fora de ordem pelo mapa (G). Um único
 * slide é navy, o oitavo, o que muda o valor da empresa, porque é o único momento
 * em que a narrativa sobe. A capa é branca com o wordmark laranja, como a dos 22 slides.
 */

import type { SlideMeta } from "./slides";

export const SLIDES_ARCHIMED: readonly SlideMeta[] = [
  { n: 1, id: "cover", title: "Cover", theme: "white" },
  { n: 2, id: "the-ask", title: "The ask", theme: "white" },
  { n: 3, id: "structural-problem", title: "Structural problem", theme: "white" },
  { n: 4, id: "installed-base", title: "Installed base", theme: "white" },
  { n: 5, id: "recurring-use", title: "Recurring use", theme: "white" },
  { n: 6, id: "exam-volume", title: "Exam volume", theme: "white" },
  { n: 7, id: "recurring-model", title: "Recurring model", theme: "white" },
  { n: 8, id: "what-it-changes", title: "What it changes", theme: "ink" },
  { n: 9, id: "what-must-be-true", title: "What must be true", theme: "white" },
  { n: 10, id: "decision", title: "The decision", theme: "white" },
] as const;

export const TOTAL_SLIDES_ARCHIMED = SLIDES_ARCHIMED.length;

export const ARCHIMED_LABEL = "Cardioline · Archimed board";
