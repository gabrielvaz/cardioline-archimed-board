"use client";

import type { CSSProperties } from "react";
import { useSlideActive } from "@/components/deck/DeckContext";
import type { ExamRef } from "@/lib/synthetic";
import styles from "./PatientTimeline.module.css";

/**
 * Histórico longitudinal do paciente.
 *
 * O eixo é o "trace" na função de linha do tempo: a mesma linha de 1px que bate
 * como ECG na abertura vira aqui a espinha do histórico.
 */
export function PatientTimeline({ entries }: { entries: readonly ExamRef[] }) {
  const active = useSlideActive();
  return (
    <div className={styles.timeline}>
      <span
        aria-hidden
        className={`${styles.axis} ${active ? styles.axisOn : ""}`}
      />
      {entries.map((e, i) => (
        <div
          key={`${e.year}-${e.kind}`}
          className={`${styles.entry} ${active ? styles.entryOn : ""}`}
          style={{ "--entry-delay": `${300 + i * 120}ms` } as CSSProperties}
        >
          <span className={`${styles.dot} ${e.note ? styles.dotMarked : ""}`}>
            {e.note && <span className={styles.dotInner} />}
          </span>
          <span className={styles.year} data-numeric>
            {e.year}
          </span>
          <span className={styles.kind}>{e.kind}</span>
          {e.note && <span className={styles.note}>{e.note}</span>}
        </div>
      ))}
    </div>
  );
}
