import { Reveal } from "@/components/deck/Reveal";
import { Caption, Display, Kicker } from "@/components/primitives/Type";
import { BASE_SCENARIO, EV_MULTIPLES, FX, usdShort } from "@/lib/archimed";
import shared from "../slides.module.css";
import styles from "./A7WhatItChanges.module.css";

/**
 * O único slide navy, e o único escrito para este público em particular.
 *
 * O board da Archimed não compra receita, compra múltiplo. O argumento é
 * estrutural e não precisa de comparável: US$ 1 recorrente e US$ 1 de hardware não
 * valem o mesmo na saída. O múltiplo em si é variável de entrada do board, e a
 * legenda diz isso com todas as letras — inventar um comparável aqui seria a
 * forma mais rápida de perder a sala.
 */
export function A7WhatItChanges() {
  return (
    <div className={`${shared.full} ${shared.between}`}>
      <div className={shared.top}>
        <Reveal>
          <Kicker accent>What it changes</Kicker>
        </Reveal>
      </div>

      <div className={styles.body}>
        <Reveal delay={100}>
          <Display size="headline" className={styles.claim}>
            One dollar of recurring revenue is not worth one dollar of hardware
            revenue.
          </Display>
        </Reveal>

        <Reveal delay={300}>
          <p className={styles.lead}>
            Same operation, same clients, same devices. What changes is the
            quality of the revenue line, and that is priced on exit, not on the
            P&amp;L.
          </p>
        </Reveal>
      </div>

      <div className={styles.foot}>
        <Reveal delay={440}>
          <div className={styles.grid}>
            <div className={styles.cell}>
              <span className={styles.label}>ARR, base case</span>
              <span className={styles.value} data-numeric>
                {usdShort(BASE_SCENARIO.arrBrl)}
              </span>
              <span className={styles.note}>
                At month 24, from clients we already have
              </span>
            </div>
            {EV_MULTIPLES.map((m) => (
              <div key={m} className={styles.cell}>
                <span className={styles.label}>{`Enterprise value at ${m}×`}</span>
                <span className={`${styles.value} ${styles.accent}`} data-numeric>
                  {usdShort(BASE_SCENARIO.arrBrl * m)}
                </span>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={580}>
          <Caption>
            The multiple is an input from the board, not an estimate of ours, and
            no comparable set sits behind these three columns. The claim on this
            slide is the structure, not the number.{" "}
          Converted at {FX.label}.
        </Caption>
        </Reveal>
      </div>
    </div>
  );
}
