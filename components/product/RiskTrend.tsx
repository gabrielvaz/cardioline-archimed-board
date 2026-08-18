"use client";

import type { CSSProperties } from "react";
import { useSlideActive } from "@/components/deck/DeckContext";
import styles from "./RiskTrend.module.css";

type Props = {
  /** Série observada, valores de 0 a 1. Ilustrativa. */
  past?: number[];
  width?: number;
  height?: number;
  /** Quantas trajetórias possíveis desenhar à direita do marcador. */
  branches?: number;
};

const DEFAULT_PAST = [0.42, 0.4, 0.46, 0.44, 0.5, 0.48, 0.55];

/**
 * Passado observado, marcador de hoje, e um leque de futuros possíveis dentro
 * de um cone de incerteza.
 *
 * A forma é deliberada: previsão honesta é um cone que se abre, não uma seta
 * apontando para uma certeza. É a mesma convenção da meteorologia, e é o que
 * permite falar de risco sem afirmar desfecho.
 */
export function RiskTrend({
  past = DEFAULT_PAST,
  width = 900,
  height = 300,
  branches = 5,
}: Props) {
  const active = useSlideActive();
  const splitX = width * 0.52;
  const pad = 26;
  const y = (v: number) => pad + (1 - v) * (height - pad * 2);

  const pastPoints = past.map((v, i) => [
    (i / (past.length - 1)) * splitX,
    y(v),
  ]);
  const [lastX, lastY] = pastPoints[pastPoints.length - 1];
  const last = past[past.length - 1];

  // Espalhamento simétrico ao redor de uma leve tendência de alta. Determinístico.
  const spread = 0.34;
  const ends = Array.from({ length: branches }, (_, i) => {
    const t = branches === 1 ? 0.5 : i / (branches - 1);
    return Math.min(0.96, Math.max(0.04, last + (t - 0.5) * 2 * spread + 0.06));
  });

  const curve = (endV: number) => {
    const ex = width;
    const ey = y(endV);
    const c1x = lastX + (ex - lastX) * 0.42;
    const c2x = lastX + (ex - lastX) * 0.7;
    return `M${lastX} ${lastY}C${c1x} ${lastY} ${c2x} ${ey} ${ex} ${ey}`;
  };

  // O cone é a curva extrema de cima seguida da extrema de baixo invertida.
  // Inverter uma cúbica é trocar os pontos de controle de lado: M P0 C P1 P2 P3
  // vira, de volta, C P2 P1 P0.
  const cone = (() => {
    const ex = width;
    const c1x = lastX + (ex - lastX) * 0.42;
    const c2x = lastX + (ex - lastX) * 0.7;
    const yTop = y(ends[ends.length - 1]);
    const yBottom = y(ends[0]);
    return (
      `M${lastX} ${lastY}` +
      `C${c1x} ${lastY} ${c2x} ${yTop} ${ex} ${yTop}` +
      `L${ex} ${yBottom}` +
      `C${c2x} ${yBottom} ${c1x} ${lastY} ${lastX} ${lastY}Z`
    );
  })();

  return (
    <svg
      className={styles.svg}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Illustrative risk trend with a cone of possible futures"
    >
      {/* Cone de incerteza */}
      <path className={`${styles.cone} ${active ? styles.coneOn : ""}`} d={cone} />

      {/* Futuros possíveis */}
      {ends.map((v, i) => (
        <path
          key={i}
          className={`${styles.future} ${active ? styles.futureOn : ""}`}
          d={curve(v)}
          style={
            {
              "--f-delay": `${900 + i * 110}ms`,
              "--f-opacity": 1 - Math.abs(i - (branches - 1) / 2) * 0.22,
            } as CSSProperties
          }
        />
      ))}

      {/* Passado observado */}
      <path
        className={styles.past}
        d={pastPoints.map(([px, py], i) => `${i ? "L" : "M"}${px} ${py}`).join("")}
      />

      {/* Marcador de hoje */}
      <line className={styles.marker} x1={lastX} y1={8} x2={lastX} y2={height - 8} />
      <circle className={styles.dot} cx={lastX} cy={lastY} r={5} />

      <text className={styles.tick} x={0} y={height - 2}>
        Past
      </text>
      <text className={styles.tick} x={lastX} y={height - 2} textAnchor="middle">
        Today
      </text>
      <text className={styles.tick} x={width} y={height - 2} textAnchor="end">
        Possible futures
      </text>
    </svg>
  );
}
