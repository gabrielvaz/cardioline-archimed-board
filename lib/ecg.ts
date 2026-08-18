/**
 * Gerador determinístico de traçado ECG.
 *
 * Determinístico de propósito: `Math.random()` em render quebra a hidratação do
 * Next e deixa o desenho animado instável entre navegações. Toda variação vem
 * da seed.
 *
 * A morfologia é emitida como polilinha a partir dos pontos de controle da
 * batida — que é como um eletrocardiógrafo real desenha. Sai um path curto
 * (~13 pontos por batida) e com os ângulos vivos do traçado clínico, em vez de
 * uma curva suavizada que pareceria decorativa.
 */

export type EcgOptions = {
  width: number;
  height: number;
  beats: number;
  seed: number;
  /** Altura do pico R como fração de metade da caixa. Padrão 0.8. */
  amplitude?: number;
  /** Deriva de linha de base, 0 a 1. Padrão 0 (traçado limpo). */
  noise?: number;
  /** Índice da batida que recebe morfologia alterada (onda T invertida). */
  anomalyAt?: number;
};

/** PRNG mulberry32 — pequeno, rápido e reprodutível. */
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Pontos de controle de uma batida: [fração do ciclo, amplitude relativa ao R]. */
const BEAT: readonly (readonly [number, number])[] = [
  [0.0, 0],
  [0.08, 0],
  [0.12, 0.15], // onda P
  [0.16, 0],
  [0.24, 0], // segmento PQ
  [0.26, -0.1], // Q
  [0.29, 1.0], // R
  [0.32, -0.28], // S
  [0.35, 0],
  [0.45, 0], // segmento ST
  [0.55, 0.3], // onda T
  [0.65, 0],
  [1.0, 0], // segmento TP
];

/** Mesma batida com onda T invertida e S mais profundo. */
const BEAT_ANOMALOUS = BEAT.map(([f, a]) => {
  if (f === 0.55) return [f, -0.12] as const;
  if (f === 0.32) return [f, -0.38] as const;
  return [f, a] as const;
});

function samples(o: EcgOptions): [number, number][] {
  const { width, height, beats, seed } = o;
  const amplitude = o.amplitude ?? 0.8;
  const noise = o.noise ?? 0;
  const mid = height / 2;
  const unit = (height / 2) * amplitude;
  const beatWidth = width / beats;
  const random = rng(seed);

  // Fases de ruído sorteadas uma vez, para a deriva ser suave em vez de granulada.
  const drift = [random(), random(), random()].map((r) => r * Math.PI * 2);

  const out: [number, number][] = [];
  for (let b = 0; b < beats; b++) {
    const shape = b === o.anomalyAt ? BEAT_ANOMALOUS : BEAT;
    for (let i = b === 0 ? 0 : 1; i < shape.length; i++) {
      const [fraction, amp] = shape[i];
      const x = (b + fraction) * beatWidth;
      let y = mid - amp * unit;
      if (noise > 0) {
        const t = x / width;
        const wobble =
          Math.sin(t * 6.3 + drift[0]) * 0.5 +
          Math.sin(t * 17.1 + drift[1]) * 0.3 +
          Math.sin(t * 41.7 + drift[2]) * 0.2;
        y += wobble * noise * height * 0.04;
      }
      out.push([
        Math.min(width, Math.max(0, x)),
        Math.min(height, Math.max(0, y)),
      ]);
    }
  }
  return out;
}

/** Atributo `d` de um `<path>` com o traçado. */
export function ecgPath(o: EcgOptions): string {
  const pts = samples(o);
  return pts
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`)
    .join("");
}

/** Comprimento do traçado — alimenta stroke-dasharray no desenho animado. */
export function ecgPathLength(o: EcgOptions): number {
  const pts = samples(o);
  let total = 0;
  for (let i = 1; i < pts.length; i++) {
    total += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  }
  return total;
}
