"use client";

import { useEffect } from "react";
import { SLIDES } from "@/lib/slides";
import styles from "./GridOverview.module.css";

type Props = { active: number; onPick: (n: number) => void; onClose: () => void };

/**
 * Mapa dos 22 slides.
 *
 * Numa reunião executiva alguém sempre pede "volta no slide dos três layers".
 * Título e número são o que torna isso resolvível em um segundo — miniaturas
 * renderizadas seriam mais bonitas e menos legíveis nesse tamanho.
 */
export function GridOverview({ active, onPick, onClose }: Props) {
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
        <span className={styles.title}>Cardioline 2028 — 22 slides</span>
        <span className={styles.title}>G or Esc to close</span>
      </div>
      <div className={styles.grid}>
        {SLIDES.map((s) => (
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
