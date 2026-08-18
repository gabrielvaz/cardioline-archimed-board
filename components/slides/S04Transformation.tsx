"use client";

import type { CSSProperties } from "react";
import { useSlideActive } from "@/components/deck/DeckContext";
import { Logo } from "@/components/brand/Logo";
import { Reveal } from "@/components/deck/Reveal";
import { Display, Kicker, Lede } from "@/components/primitives/Type";
import shared from "./slides.module.css";
import styles from "./S04Transformation.module.css";

const INPUTS = ["Resting ECG", "Stress ECG", "Continuous monitoring"];
const OUTPUTS = ["Patients", "Exams", "History", "Reports", "Data", "Intelligence"];

const W = 1360;
const H = 396;
const HUB_HALF = 150;
const COL = 300;

/** Posição vertical do item i de n, distribuído uniformemente na altura. */
const at = (i: number, n: number) => ((i + 0.5) * H) / n;

/**
 * A transformação.
 *
 * Quatro modalidades convergem num único centro e voltam a se abrir como
 * capacidades. A forma diz o argumento: a Cardioline deixa de ser uma coleção
 * de produtos independentes e passa a ser um lugar por onde tudo passa.
 */
export function S04Transformation() {
  const active = useSlideActive();

  const wires: { d: string; delay: number }[] = [
    ...INPUTS.map((_, i) => ({
      d: `M${COL} ${at(i, INPUTS.length)}C${COL + 110} ${at(i, INPUTS.length)} ${
        W / 2 - HUB_HALF - 110
      } ${H / 2} ${W / 2 - HUB_HALF} ${H / 2}`,
      delay: 320 + i * 90,
    })),
    ...OUTPUTS.map((_, j) => ({
      d: `M${W / 2 + HUB_HALF} ${H / 2}C${W / 2 + HUB_HALF + 110} ${H / 2} ${
        W - COL - 110
      } ${at(j, OUTPUTS.length)} ${W - COL} ${at(j, OUTPUTS.length)}`,
      delay: 760 + j * 80,
    })),
  ];

  return (
    <div className={shared.full}>
      <div className={shared.top}>
        <Reveal>
          <Kicker accent>The transformation</Kicker>
        </Reveal>
      </div>

      <div className={styles.body}>
        <Reveal delay={100}>
          <Display size="headline">
            From a device company to a cardiology platform.
          </Display>
        </Reveal>

        <div className={styles.diagram}>
          <svg className={styles.wires} viewBox={`0 0 ${W} ${H}`} aria-hidden>
            {wires.map((w, i) => (
              <path
                key={i}
                d={w.d}
                className={`${styles.wire} ${active ? styles.wireOn : ""}`}
                style={{ "--len": 700, "--wire-delay": `${w.delay}ms` } as CSSProperties}
              />
            ))}
          </svg>

          {INPUTS.map((label, i) => (
            <Reveal
              key={label}
              delay={200 + i * 90}
              className={`${styles.item} ${styles.left}`}
              style={{ top: at(i, INPUTS.length) - 22 }}
            >
              {label}
            </Reveal>
          ))}

          <Reveal delay={620} className={styles.hub}>
            <Logo width={196} variant="white" className={styles.hubLogo} />
          </Reveal>

          {OUTPUTS.map((label, j) => (
            <Reveal
              key={label}
              delay={860 + j * 80}
              className={`${styles.item} ${styles.right}`}
              style={{ top: at(j, OUTPUTS.length) - 22 }}
            >
              {label}
            </Reveal>
          ))}
        </div>

        <Reveal delay={1300}>
          <Lede mute className={styles.caption}>
            No longer a collection of separate products.
          </Lede>
        </Reveal>
      </div>
    </div>
  );
}
