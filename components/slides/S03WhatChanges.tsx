import { Reveal } from "@/components/deck/Reveal";
import { Display, Kicker } from "@/components/primitives/Type";
import { FlowNode } from "@/components/primitives/Flow";
import shared from "./slides.module.css";
import styles from "./S03WhatChanges.module.css";

/**
 * O eixo NÃO é "a empresa ganha software" — ela sempre teve. O eixo é para quem
 * o software é feito: primeiro para o aparelho, depois para o exame, agora para
 * o profissional. É o que torna a virada user-centered em vez de tecnológica.
 */
const STATES = [
  { when: "Yesterday", what: "Software that ran the device" },
  { when: "Today", what: "Software that records the exam" },
  { when: "Tomorrow", what: "Software built around the cardiologist" },
];
export function S03WhatChanges() {
  return (
    <div className={shared.full}>
      <div className={shared.top}>
        <Reveal>
          <Kicker accent>What changes</Kicker>
        </Reveal>
      </div>

      <div className={styles.body}>
        {STATES.map((s, i) => (
          <Reveal
            key={s.when}
            delay={140 + i * 180}
            className={`${styles.state} ${i === STATES.length - 1 ? styles.now : ""}`}
          >
            <span className={styles.when}>{s.when}</span>
            <span className={styles.parts}>
              <FlowNode variant={i === STATES.length - 1 ? "solid" : "outline"}>
                {s.what}
              </FlowNode>
            </span>
          </Reveal>
        ))}

        <Reveal delay={860} className={styles.conclusion}>
          <span className={styles.bar} aria-hidden />
          <Display size="subhead">One connected cardiology ecosystem.</Display>
        </Reveal>
      </div>
    </div>
  );
}
