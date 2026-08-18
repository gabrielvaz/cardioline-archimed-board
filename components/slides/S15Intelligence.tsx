import { Reveal } from "@/components/deck/Reveal";
import { Caption, Display, Kicker } from "@/components/primitives/Type";
import { PatientTimeline } from "@/components/product/PatientTimeline";
import { LONGITUDINAL } from "@/lib/synthetic";
import shared from "./slides.module.css";
import styles from "./S15Intelligence.module.css";

const OUTPUTS = ["Change", "Trend", "Risk", "Context", "Prediction"];

/**
 * Inteligência.
 *
 * O histórico inteiro converge num único ponto e volta a se abrir como
 * entendimento. É o mesmo movimento do slide 04, agora aplicado ao paciente em
 * vez da empresa — a repetição da forma é proposital.
 */
export function S15Intelligence() {
  return (
    <div className={shared.full}>
      <div className={shared.top}>
        <Reveal>
          <Kicker accent>Intelligence</Kicker>
        </Reveal>
      </div>

      <div className={styles.body}>
        <div className={styles.head}>
          <Reveal delay={100}>
            <Display size="headline" className={styles.claim}>
              From displaying exams to understanding patients.
            </Display>
          </Reveal>
          <Reveal delay={280} className={styles.shift}>
            <span className={styles.was}>Single exam</span>
            <span className={styles.arrow} aria-hidden>
              →
            </span>
            <span className={styles.is}>Longitudinal understanding</span>
          </Reveal>
        </div>

        <Reveal delay={400}>
          <PatientTimeline entries={LONGITUDINAL} />
        </Reveal>

        <Reveal delay={900}>
          <svg className={styles.funnel} viewBox="0 0 1360 44" aria-hidden>
            {[136, 408, 680, 952, 1224].map((x) => (
              <path
                key={x}
                className={styles.wire}
                d={`M${x} 0C${x} 26 680 20 680 44`}
              />
            ))}
          </svg>
        </Reveal>

        <Reveal delay={1000}>
          <div className={styles.engine}>Cardioline Intelligence</div>
        </Reveal>

        <div className={styles.outputs}>
          {OUTPUTS.map((o, i) => (
            <Reveal key={o} delay={1200 + i * 110} className={styles.output}>
              {o}
            </Reveal>
          ))}
        </div>

        <Caption tone="illustrative" />
      </div>
    </div>
  );
}
