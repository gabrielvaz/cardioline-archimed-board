"use client";

import { useEffect } from "react";
import { SLIDES, type SlideMeta } from "@/lib/slides";
import styles from "./GridOverview.module.css";

type Props = {
  active: number;
  onPick: (n: number) => void;
  onClose: () => void;
  slides?: readonly SlideMeta[];
  /** Nome do deck no cabeçalho do mapa. */
  label?: string;
};

/**
 * Mapa dos slides.
 *
 * Numa reunião executiva alguém sempre pede "volta no slide dos três layers".
 * Título e número são o que torna isso resolvível em um segundo — miniaturas
 * renderizadas seriam mais bonitas e menos legíveis nesse tamanho. Na versão da
 * Archimed este mapa deixa de ser conveniência e passa a ser o modo normal de
 * navegar: a reunião é curta e a ordem dos slides não vai ser respeitada.
 */
export function GridOverview({
  active,
  onPick,
  onClose,
  slides = SLIDES,
  label = "Cardioline 2028",
}: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className={styles.overlay} role="dialog" aria-label="All slides">
      <div className={styles.head}>
        <span className={styles.title}>
          {label} — {slides.length} slides
        </span>
        <span className={styles.title}>G or Esc to close</span>
      </div>
      <div className={styles.grid}>
        {slides.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onPick(s.n)}
            className={`${styles.tile} ${s.n === active ? styles.tileActive : ""}`}
          >
            <span className={styles.num} data-numeric>
              {String(s.n).padStart(2, "0")}
            </span>
            <span className={styles.name}>{s.title}</span>
            <span
              className={`${styles.swatch} ${s.theme === "ink" ? styles.swatchInk : ""}`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
