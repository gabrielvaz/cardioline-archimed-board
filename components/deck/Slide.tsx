"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { SlideActiveContext } from "./DeckContext";
import type { SlideTheme } from "@/lib/slides";
import { Stage } from "./Stage";
import styles from "./Slide.module.css";

type Props = {
  n: number;
  theme: SlideTheme;
  title: string;
  children: ReactNode;
};

/**
 * Uma section de 100vh com snap, contendo a stage.
 *
 * Marca-se como revelada na primeira vez que fica visível e permanece assim:
 * numa reunião o apresentador volta e avança o tempo todo, e re-animar a cada
 * retorno seria ruído em vez de narrativa.
 */
export function Slide({ n, theme, title, children }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.55 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen]);

  return (
    <section
      ref={ref}
      id={`slide-${String(n).padStart(2, "0")}`}
      className={styles.slide}
      data-theme={theme}
      data-slide={n}
      aria-label={`${n}. ${title}`}
    >
      <SlideActiveContext.Provider value={seen}>
        <Stage>{children}</Stage>
      </SlideActiveContext.Provider>
    </section>
  );
}
