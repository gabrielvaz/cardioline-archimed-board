"use client";

import { SLIDES, type SlideMeta } from "@/lib/slides";
import styles from "./Deck.module.css";

type Props = {
  active: number;
  onPick: (n: number) => void;
  slides?: readonly SlideMeta[];
};

/** Um tracinho por slide, à direita. Clicáveis, mas discretos: somem quando o mouse para. */
export function ProgressRail({ active, onPick, slides = SLIDES }: Props) {
  return (
    <nav className={styles.rail} aria-label="Slides">
      {slides.map((s) => (
        <button
          key={s.id}
          type="button"
          onClick={() => onPick(s.n)}
          aria-label={`${s.n}. ${s.title}`}
          aria-current={s.n === active ? "true" : undefined}
          className={`${styles.tick} ${s.n === active ? styles.tickActive : ""}`}
        />
      ))}
    </nav>
  );
}
