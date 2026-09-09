/**
 * Registry dos 10 slides da versão de grupo, para o board da Archimed.
 *
 * Mesma arquitetura da versão `slides-archimed.ts`, mesmo arco, mesmos ids. O
 * que muda é a evidência: esta agrega os dados mundiais da Cardioline aos da
 * Cardios, e cada slide com dado carrega um marcador de procedência dizendo se
 * o número é do Brasil, do mundo, ou dos dois.
 *
 * As duas rotas convivem de propósito. `/archimed` é a versão só-Brasil, que já
 * foi vista; esta é a versão melhor embasada. A evolução do argumento é parte do
 * material, como nas landings v0, v1 e v2.
 */

import type { SlideMeta } from "./slides";

export const SLIDES_ARCHIMED_GROUP: readonly SlideMeta[] = [
  { n: 1, id: "cover", title: "Cover", theme: "white" },
  { n: 2, id: "the-ask", title: "The ask", theme: "white" },
  { n: 3, id: "structural-problem", title: "Structural problem", theme: "white" },
  { n: 4, id: "installed-base", title: "What the group has", theme: "white" },
  { n: 5, id: "recurring-use", title: "Recurring use", theme: "white" },
  { n: 6, id: "exam-volume", title: "Exam volume", theme: "white" },
  { n: 7, id: "recurring-model", title: "Recurring model", theme: "white" },
  { n: 8, id: "what-it-changes", title: "What it changes", theme: "ink" },
  { n: 9, id: "what-must-be-true", title: "What must be true", theme: "white" },
  { n: 10, id: "decision", title: "The decision", theme: "white" },
] as const;

export const TOTAL_SLIDES_ARCHIMED_GROUP = SLIDES_ARCHIMED_GROUP.length;

export const ARCHIMED_GROUP_LABEL = "Cardioline · Archimed board · group";
