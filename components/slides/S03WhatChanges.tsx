import { Reveal } from "@/components/deck/Reveal";
import { Display, Kicker } from "@/components/primitives/Type";
import { FlowNode } from "@/components/primitives/Flow";
import shared from "./slides.module.css";
import styles from "./S03WhatChanges.module.css";

const STATES = [
  { when: "Yesterday", parts: ["Devices"] },
  { when: "Today", parts: ["Devices", "Software"] },
  { when: "Tomorrow", parts: ["Devices", "Software", "Intelligence"] },
];

/**
 * O que muda.
 *
 * Os três estados acumulam em vez de se substituírem: a leitura de cima para
 * baixo mostra que nada é descartado, só somado. O último termo é o único em
 * laranja, porque é o único novo.
 */
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
              {s.parts.map((p) => (
                <FlowNode
                  key={p}
                  variant={p === "Intelligence" ? "solid" : "outline"}
                >
                  {p}
                </FlowNode>
              ))}
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
