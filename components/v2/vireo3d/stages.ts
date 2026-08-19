/**
 * Roteiro da animação do VIREO AM.
 *
 * Único lugar para mexer no tempo e na coreografia. Cada etapa tem início e fim em
 * progresso normalizado de 0 a 1, então mudar a duração de uma é mover um número,
 * sem tocar no componente.
 */

export type StageKey = "hold" | "undock" | "rotate" | "dock" | "power";

export type Stage = {
  key: StageKey;
  /** Início e fim em progresso global, 0 a 1. */
  from: number;
  to: number;
  caption: { title: string; body: string } | null;
};

/**
 * Os limites somam 1 e não têm lacuna. A separação recebe uma fatia larga porque o
 * módulo não some por esmaecimento: ele desce e SAI DE CENA, e sair de cena
 * devagar consome rolagem.
 */
export const STAGES: readonly Stage[] = [
  {
    key: "hold",
    from: 0,
    to: 0.1,
    caption: {
      title: "VIREO AM",
      body: "Twelve leads in the hand, acquiring.",
    },
  },
  {
    key: "undock",
    from: 0.1,
    to: 0.36,
    caption: { title: "One dock", body: "The lead cable module releases." },
  },
  // Durante o giro nada compete com o produto.
  { key: "rotate", from: 0.36, to: 0.66, caption: null },
  {
    key: "dock",
    from: 0.66,
    to: 0.86,
    caption: {
      title: "Air module",
      body: "Wireless transmission clicks into the same dock.",
    },
  },
  {
    key: "power",
    from: 0.86,
    to: 1,
    caption: {
      title: "Ready",
      body: "The exam opens in Anchor before the patient stands up.",
    },
  },
] as const;

/**
 * Distância de rolagem que a seção consome enquanto fixada, em alturas de
 * viewport. Maior = transformação mais lenta e mais controlável.
 */
export const SCROLL_LENGTH = 4;

/** Voltas completas na etapa de rotação. */
export const TURNS = 1;

/**
 * Curso do módulo até SAIR DO QUADRO, em larguras de corpo. O módulo não esmaece:
 * ele desce e deixa a cena, como uma peça que alguém tirou da mão. Com a escala
 * atual a borda inferior do quadro está a 1,44 do centro do corpo, e o bloco
 * acoplado termina em 1,15. Com 0,95 a língua do conector ainda encostava na borda
 * de baixo do quadro; 1,16 dá folga para o conjunto todo deixar a cena.
 */
export const MODULE_EXIT = 1.16;

/**
 * Altura do CONJUNTO MONTADO na cena, em unidades de mundo. É o único número de
 * enquadramento: a escala do modelo sai dele dividido pela proporção medida do
 * conjunto, então mudar o tamanho do produto no quadro é mudar isto.
 */
export const ASSEMBLY_UNITS = 2.24;

/**
 * Deslocamento vertical do conjunto. O feixe de derivações sai por cima e o módulo
 * se separa por baixo; este empurrão equilibra os dois no quadro. Puxado para baixo
 * o bastante para sobrar um trecho de cabo visível acima do alívio de tensão — sem
 * ele a curva do feixe some antes de poder ser lida.
 */
export const FRAME_LIFT = -0.14;

/**
 * Pose de repouso. O produto NÃO fica de frente chapado: um render de produto
 * frontal puro perde a espessura e a linha dos trilhos, e lê como desenho. Vinte
 * graus de guinada e sete de inclinação bastam para o volume aparecer sem que a
 * arte da face deixe de ser legível.
 */
export const REST_YAW = (-20 * Math.PI) / 180;
export const REST_TILT = (-7 * Math.PI) / 180;

/** Piscadas por segundo do LED ao acoplar o módulo. */
export const LED_BLINK_HZ = 2.2;

/** Fração da etapa power em que o LED ainda pisca antes de firmar aceso. */
export const LED_BLINK_UNTIL = 0.55;

export function stageAt(progress: number): Stage {
  for (const s of STAGES) {
    if (progress < s.to) return s;
  }
  return STAGES[STAGES.length - 1];
}

/** Progresso local dentro de uma etapa, 0 a 1. */
export function localProgress(progress: number, stage: Stage): number {
  const span = stage.to - stage.from;
  if (span <= 0) return 1;
  return Math.min(1, Math.max(0, (progress - stage.from) / span));
}

/** Suavização de entrada e saída, para nada partir nem chegar em velocidade máxima. */
export function easeInOut(t: number): number {
  return t * t * (3 - 2 * t);
}

/** Parte devagar e acelera. Deixa a separação do encaixe visível antes da saída. */
export function easeIn(t: number): number {
  return t * t;
}

/** Chega devagar. O módulo que entra desacelera antes de encostar no aparelho. */
export function easeOut(t: number): number {
  return 1 - (1 - t) * (1 - t);
}
