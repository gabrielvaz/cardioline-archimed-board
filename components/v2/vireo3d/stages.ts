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
 * quadro: com o corpo em BODY_UNITS e o módulo abaixo dele, passar de ~0,40 joga
 * o módulo fora da câmera no ponto de separação máxima.
 */
export const MODULE_TRAVEL = 0.4;

/** Altura do CORPO na cena. É o que define o quanto o produto ocupa o quadro. */
export const BODY_UNITS = 1.62;

/**
 * Deslocamento vertical do conjunto. O módulo pendura abaixo do corpo, então sem
 * este empurrão o produto lê baixo demais no quadro.
 */
export const FRAME_LIFT = 0.18;

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
