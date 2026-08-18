"use client";

import type { CSSProperties } from "react";
import { useSlideActive } from "@/components/deck/DeckContext";
import { ecgPath, ecgPathLength, type EcgOptions } from "@/lib/ecg";
import styles from "./EcgTrace.module.css";

type Props = EcgOptions & {
  /** Cor do traço. Padrão: laranja da marca. */
  stroke?: string;
  strokeWidth?: number;
  /** Desenha a linha ao entrar no slide, em vez de já aparecer pronta. */
  draw?: boolean;
  /** Ocupa a caixa do pai em vez de usar width/height fixos. */
  fluid?: boolean;
  drawDuration?: number;
  delay?: number;
  className?: string;
  style?: CSSProperties;
};

/** Traçado ECG em SVG. Determinístico por seed. */
export function EcgTrace({
  stroke = "var(--cl-orange)",
  strokeWidth = 2,
  draw = false,
  fluid = false,
  drawDuration = 2200,
  delay = 0,
  className,
  style,
  ...options
}: Props) {
  const active = useSlideActive();
  const d = ecgPath(options);
  const length = Math.ceil(ecgPathLength(options));

  return (
    <svg
      className={`${styles.svg} ${fluid ? styles.fluid : ""} ${className ?? ""}`}
      width={fluid ? undefined : options.width}
      height={fluid ? undefined : options.height}
      viewBox={`0 0 ${options.width} ${options.height}`}
      preserveAspectRatio={fluid ? "none" : undefined}
      aria-hidden
      style={style}
    >
      <path
        d={d}
        className={`${styles.path} ${draw ? styles.draw : ""} ${
          draw && active ? styles.drawOn : ""
        }`}
        stroke={stroke}
        strokeWidth={strokeWidth}
        style={
          draw
            ? ({
                "--len": length,
                "--draw-duration": `${drawDuration}ms`,
                "--draw-delay": `${delay}ms`,
                strokeDasharray: length,
              } as CSSProperties)
            : undefined
        }
      />
    </svg>
  );
}
