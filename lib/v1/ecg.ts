/**
 * Gerador de tracado de ECG sintetico.
 *
 * O sinal e a soma de gaussianas em dominio de tempo, uma por deflexao
 * (P, Q, R, S, T), com temporizacao fixa em segundos a partir do pico R.
 * Isso e fisiologicamente mais correto do que escalar as deflexoes com o
 * intervalo RR: em repouso os intervalos PR e QT sao praticamente constantes
 * e a variacao de frequencia e absorvida pela diastole.
 *
 * A saida esta em MILIMETROS de papel de ECG, para que o grid clinico
 * (1 mm menor / 5 mm maior) seja geometricamente real:
 *   eixo X — 25 mm/s   (padrao de velocidade)
 *   eixo Y — 10 mm/mV  (padrao de ganho)
 *
 * Todos os dados sao sinteticos. Nenhum sinal de paciente real foi usado.
 */

/** Deflexao gaussiana: amplitude em mV, centro e sigma em segundos. */
type Deflection = { amp: number; center: number; sigma: number };

/**
 * Morfologia de um batimento sinusal normal, referenciada ao pico R (t = 0).
 * Amplitudes em mV para a derivacao II; as demais derivacoes escalam estes
 * valores (ver LEAD_PROFILES).
 */
const NORMAL_BEAT: Deflection[] = [
  { amp: 0.14, center: -0.16, sigma: 0.022 }, // onda P
  { amp: -0.09, center: -0.022, sigma: 0.008 }, // onda Q
  { amp: 1.0, center: 0.0, sigma: 0.0095 }, // onda R
  { amp: -0.25, center: 0.026, sigma: 0.0105 }, // onda S
  { amp: 0.32, center: 0.22, sigma: 0.048 }, // onda T
];

export type LeadName =
  | "I" | "II" | "III"
  | "aVR" | "aVL" | "aVF"
  | "V1" | "V2" | "V3" | "V4" | "V5" | "V6";

export const LEAD_ORDER: LeadName[] = [
  "I", "II", "III",
  "aVR", "aVL", "aVF",
  "V1", "V2", "V3", "V4", "V5", "V6",
];

/**
 * Escalas por derivacao. P, QRS e T recebem fatores independentes porque a
 * progressao real nao e um simples ganho: em V1 o QRS e negativo (padrao rS)
 * mas a onda T permanece positiva, e em aVR todas as deflexoes se invertem.
 */
const LEAD_PROFILES: Record<LeadName, { p: number; qrs: number; t: number }> = {
  I:   { p: 0.8,  qrs: 0.72, t: 0.8 },
  II:  { p: 1.0,  qrs: 1.0,  t: 1.0 },
  III: { p: 0.45, qrs: 0.44, t: 0.5 },
  aVR: { p: -0.8, qrs: -0.6, t: -0.7 },
  aVL: { p: 0.4,  qrs: 0.42, t: 0.45 },
  aVF: { p: 0.7,  qrs: 0.68, t: 0.7 },
  V1:  { p: 0.35, qrs: -0.5, t: 0.4 },
  V2:  { p: 0.5,  qrs: -0.3, t: 0.9 },
  V3:  { p: 0.6,  qrs: 0.55, t: 1.0 },
  V4:  { p: 0.7,  qrs: 1.15, t: 1.0 },
  V5:  { p: 0.7,  qrs: 1.0,  t: 0.9 },
  V6:  { p: 0.65, qrs: 0.78, t: 0.75 },
};

/**
 * Achados sinteticos usados apenas para ilustrar estados de interface.
 * Nao constituem afirmacao clinica: sao formas de onda geradas para o
 * prototipo, nao exames reais.
 */
export type Morphology =
  | "normal"
  | "stDepression" // segmento ST deprimido — usado na visao de stress ECG
  | "flatT"        // onda T achatada — usado na comparacao longitudinal
  | "lowAmplitude";

/** PRNG deterministico (LCG). Determinismo evita divergencia de hidratacao. */
function makeRandom(seed: number) {
  let state = (seed * 1103515245 + 12345) & 0x7fffffff;
  return () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  };
}

function beatFor(morphology: Morphology, profile: { p: number; qrs: number; t: number }): Deflection[] {
  const scaled = NORMAL_BEAT.map((d, i) => ({
    ...d,
    amp: d.amp * (i === 0 ? profile.p : i === 4 ? profile.t : profile.qrs),
  }));

  switch (morphology) {
    case "stDepression":
      // desloca o segmento ST para baixo com uma gaussiana larga e negativa
      return [...scaled, { amp: -0.11 * Math.abs(profile.qrs), center: 0.11, sigma: 0.035 }];
    case "flatT":
      return scaled.map((d, i) => (i === 4 ? { ...d, amp: d.amp * 0.28 } : d));
    case "lowAmplitude":
      return scaled.map((d) => ({ ...d, amp: d.amp * 0.62 }));
    default:
      return scaled;
  }
}

export type EcgOptions = {
  lead?: LeadName;
  /** frequencia cardiaca em bpm */
  bpm?: number;
  /** duracao do trecho em segundos */
  seconds?: number;
  /** velocidade do papel, mm/s (padrao clinico: 25) */
  mmPerSecond?: number;
  /** ganho, mm/mV (padrao clinico: 10) */
  mmPerMv?: number;
  /** amostras por segundo do tracado gerado */
  sampleRate?: number;
  morphology?: Morphology;
  /** semente do PRNG — mesma semente produz sempre o mesmo tracado */
  seed?: number;
  /** variabilidade batimento-a-batimento (arritmia sinusal respiratoria) */
  rrVariation?: number;
  /** oscilacao lenta da linha de base */
  baselineWander?: number;
  /**
   * Forca a altura da area de plotagem em mm. Necessario no visualizador de
   * 12 derivacoes: sem isso a altura acompanharia a amplitude do QRS de cada
   * derivacao e os paineis ficariam desalinhados entre si.
   */
  plotHeightMm?: number;
  /** posicao da linha isoeletrica como fracao da altura (0 = topo) */
  baselineRatio?: number;
};

export type EcgTrace = {
  /** atributo d de um <path> SVG, em milimetros */
  d: string;
  /** largura do tracado em mm */
  widthMm: number;
  /** altura da area de plotagem em mm */
  heightMm: number;
  /** posicao vertical da linha isoeletrica, em mm a partir do topo */
  baselineMm: number;
  /** medidas derivadas do sinal gerado, para exibir na interface */
  measurements: EcgMeasurements;
};

export type EcgMeasurements = {
  hr: number;
  prMs: number;
  qrsMs: number;
  qtMs: number;
  qtcMs: number;
  axisDeg: number;
  rrMs: number;
};

/**
 * Gera o tracado. Retorna geometria em mm mais as medidas correspondentes,
 * de modo que os numeros mostrados na interface sejam consistentes com a
 * onda desenhada em vez de constantes soltas.
 */
export function buildEcg(options: EcgOptions = {}): EcgTrace {
  const {
    lead = "II",
    bpm = 68,
    seconds = 5,
    mmPerSecond = 25,
    mmPerMv = 10,
    sampleRate = 400,
    morphology = "normal",
    seed = 7,
    rrVariation = 0.03,
    baselineWander = 0.012,
    plotHeightMm,
    baselineRatio = 0.62,
  } = options;

  const profile = LEAD_PROFILES[lead];
  const beat = beatFor(morphology, profile);
  const rrBase = 60 / bpm;
  const random = makeRandom(seed);

  // Posiciona os picos R ao longo do trecho, com leve variabilidade de RR.
  // Comeca antes de 0 e termina depois do fim para que nao haja batimento
  // truncado de forma artificial nas bordas.
  const rPeaks: number[] = [];
  let t = -rrBase * 0.55;
  while (t < seconds + rrBase) {
    rPeaks.push(t);
    t += rrBase * (1 + (random() - 0.5) * 2 * rrVariation);
  }

  const totalSamples = Math.round(seconds * sampleRate);
  const heightMm = plotHeightMm ?? 3.2 * mmPerMv * Math.max(0.5, Math.abs(profile.qrs));
  const baselineMm = heightMm * baselineRatio;
  const widthMm = seconds * mmPerSecond;

  const parts: string[] = [];
  for (let i = 0; i <= totalSamples; i += 1) {
    const time = (i / totalSamples) * seconds;
    let mv = Math.sin(time * 0.9) * baselineWander + Math.sin(time * 2.7 + 1.1) * baselineWander * 0.4;

    for (const peak of rPeaks) {
      const dt = time - peak;
      if (dt < -0.35 || dt > 0.5) continue; // fora do alcance de qualquer deflexao
      for (const d of beat) {
        const z = (dt - d.center) / d.sigma;
        if (z > 4.5 || z < -4.5) continue;
        mv += d.amp * Math.exp(-0.5 * z * z);
      }
    }

    const x = time * mmPerSecond;
    const y = baselineMm - mv * mmPerMv;
    parts.push(`${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`);
  }

  // Medidas derivadas da morfologia efetivamente desenhada.
  const rrMs = Math.round(rrBase * 1000);
  const pCenter = beat[0].center;
  const qCenter = beat[1].center;
  const sCenter = beat[3].center;
  const tDef = beat[4];
  const prMs = Math.round((qCenter - pCenter - beat[0].sigma * 2) * 1000 + 40);
  const qrsMs = Math.round((sCenter - qCenter + beat[1].sigma * 2 + beat[3].sigma * 2) * 1000);
  const qtMs = Math.round((tDef.center + tDef.sigma * 2 - qCenter + beat[1].sigma * 2) * 1000);
  const qtcMs = Math.round(qtMs / Math.sqrt(rrBase)); // correcao de Bazett

  return {
    d: parts.join(""),
    widthMm,
    heightMm,
    baselineMm,
    measurements: {
      hr: bpm,
      prMs,
      qrsMs,
      qtMs,
      qtcMs,
      axisDeg: morphology === "normal" ? 34 : 41,
      rrMs,
    },
  };
}
