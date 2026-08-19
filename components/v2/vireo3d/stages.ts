/**
 * Roteiro da animação do VIREO AM.
 *
 * Único lugar para mexer no tempo e na coreografia. Cada etapa tem início e fim
 * em progresso normalizado de 0 a 1, então mudar a duração de uma é mover um
 * número, sem tocar no componente.
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
 * Os limites somam 1 e não têm lacuna. A rotação recebe a maior fatia porque é
 * o movimento que precisa de tempo para ser lido como volta completa.
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
    to: 0.3,
    caption: { title: "One dock", body: "The lead cable module releases." },
  },
  // Durante o giro nada compete com o produto.
  { key: "rotate", from: 0.3, to: 0.64, caption: null },
  {
    key: "dock",
    from: 0.64,
    to: 0.85,
    caption: {
      title: "Air module",
      body: "Wireless transmission clicks into the same dock.",
    },
  },
  {
    key: "power",
    from: 0.85,
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
 * Curso do módulo ao se separar, em unidades de largura do corpo. Limitado pelo
 * quadro: o conjunto já ocupa quase toda a altura visível, e passar de ~0,34 joga
 * o módulo fora da câmera no ponto de separação máxima.
 */
export const MODULE_TRAVEL = 0.3;

/**
 * Altura do CONJUNTO MONTADO na cena, em unidades de mundo. É o único número de
 * enquadramento: a escala do modelo sai dele dividido pela proporção medida do
 * conjunto, então mudar o tamanho do produto no quadro é mudar isto.
 */
export const ASSEMBLY_UNITS = 2.24;

/**
 * Deslocamento vertical do conjunto. O feixe de derivações sai por cima e o
 * módulo se separa por baixo; este empurrão equilibra os dois no quadro.
 */
export const FRAME_LIFT = -0.06;

/**
 * Pose de repouso. O produto NÃO fica de frente chapado: um render de produto
 * frontal puro perde a espessura e a linha dos trilhos, e lê como desenho. Vinte
 * graus de guinada e sete de inclinação bastam para o volume aparecer sem que a
 * arte da face deixe de ser legível.
 */
export const REST_YAW = (-20 * Math.PI) / 180;
export const REST_TILT = (-7 * Math.PI) / 180;

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
