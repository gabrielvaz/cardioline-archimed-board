import { Reveal } from "@/components/deck/Reveal";
import { Caption, Display, Kicker } from "@/components/primitives/Type";
import { EcgTrace } from "@/components/product/EcgTrace";
import { EXAM_SEQUENCE } from "@/lib/synthetic";
import shared from "./slides.module.css";
import styles from "./S15Intelligence.module.css";

const OUTPUTS = ["Change", "Trend", "Risk", "Context", "Prediction"];

/**
 * Inteligência.
 *
 * Sem linha do tempo: o histórico é mostrado pelos próprios registros
 * acumulados, e o argumento é a acumulação, não o calendário. Só o último
 * traçado é marcado, porque é onde a diferença aparece.
 *
 * O movimento repete o do slide 04 de propósito — tudo converge num centro e
 * volta a se abrir —, agora aplicado ao paciente em vez da empresa.
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
            <span className={styles.was}>One exam</span>
            <span className={styles.arrow} aria-hidden>
              &rarr;
            </span>
            <span className={styles.is}>Every exam of the same patient</span>
          </Reveal>
        </div>

        <div className={styles.records}>
          {EXAM_SEQUENCE.map((e, i) => (
            <Reveal
              key={e.index}
              delay={420 + i * 120}
              className={`${styles.record} ${e.note ? styles.recordMarked : ""}`}
            >
              <EcgTrace
                width={240}
                height={58}
                beats={4}
                seed={e.seed}
                amplitude={0.7}
                noise={0.12}
                anomalyAt={e.note ? 2 : undefined}
                strokeWidth={1.6}
                stroke={e.note ? "var(--cl-orange)" : "var(--cl-mute)"}
              />
              {e.note && <span className={styles.recordNote}>{e.note}</span>}
            </Reveal>
          ))}
        </div>

        <Reveal delay={1000}>
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

        <Reveal delay={1100}>
          <div className={styles.engine}>Cardioline Intelligence</div>
        </Reveal>

        <div className={styles.outputs}>
          {OUTPUTS.map((o, i) => (
            <Reveal key={o} delay={1300 + i * 110} className={styles.output}>
              {o}
            </Reveal>
          ))}
        </div>

        <Caption tone="illustrative" />
      </div>
    </div>
  );
}
