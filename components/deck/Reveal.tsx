"use client";

import type { CSSProperties, ElementType, ReactNode } from "react";
import { useSlideActive } from "./DeckContext";
import styles from "./Reveal.module.css";

type Props = {
  children: ReactNode;
  /** Atraso em ms, para escalonar irmãos. */
  delay?: number;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
};

/** Envolve um elemento e o anima quando o slide entra. Só opacity e transform. */
export function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className,
  style,
}: Props) {
  const active = useSlideActive();
  return (
    <Tag
      className={[styles.reveal, active && styles.revealed, className]
        .filter(Boolean)
        .join(" ")}
      style={{ ...style, "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
