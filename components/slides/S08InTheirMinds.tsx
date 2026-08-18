"use client";

import type { CSSProperties } from "react";
import { useSlideActive } from "@/components/deck/DeckContext";
import { Logo } from "@/components/brand/Logo";
import { Reveal } from "@/components/deck/Reveal";
import { Display, Kicker } from "@/components/primitives/Type";
import shared from "./slides.module.css";
import styles from "./S08InTheirMinds.module.css";

const TERMS = ["ECG", "Cardiac monitoring", "Cardiology software", "Clinical intelligence"];

/**
 * Na cabeça deles.
 *
 * A repetição é o argumento: quatro termos diferentes, sempre a mesma resposta.
 * O logo real aparece quatro vezes, não uma ilustração dele. Sem marcas de
 * concorrentes em nenhum momento.
 */
export function S08InTheirMinds() {
  const active = useSlideActive();
  return (
    <div className={shared.full}>
      <div className={shared.top}>
        <Reveal>
          <Kicker accent>In their minds</Kicker>
        </Reveal>
      </div>

      <div className={styles.body}>
        {TERMS.map((term, i) => (
          <div className={styles.pair} key={term}>
            <Reveal delay={140 + i * 160} as="span" className={styles.term}>
              {term}
            </Reveal>
            <span
              aria-hidden
              className={`${styles.link} ${active ? styles.linkOn : ""}`}
              style={{ "--l-delay": `${300 + i * 160}ms` } as CSSProperties}
            />
            <Reveal delay={620 + i * 160} className={styles.mark}>
              <Logo width={200} />
            </Reveal>
          </div>
        ))}

        <Reveal delay={1320} className={styles.close}>
          <Display size="subhead">
            Cardioline becomes synonymous with digital cardiology.
          </Display>
        </Reveal>
      </div>
    </div>
  );
}
