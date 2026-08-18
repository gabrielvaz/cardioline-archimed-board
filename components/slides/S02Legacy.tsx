import { Reveal } from "@/components/deck/Reveal";
import { Display, Kicker, Lede } from "@/components/primitives/Type";
import { EcgTrace } from "@/components/product/EcgTrace";
import shared from "./slides.module.css";
import styles from "./S02Legacy.module.css";

/**
 * Legado.
 *
 * Sem timeline detalhada: o mesmo traçado muda de caráter da esquerda para a
 * direita — analógico e ruidoso, depois limpo, depois lido por inteligência.
 * A evolução é mostrada no próprio sinal, não numa régua de datas.
 */
export function S02Legacy() {
  return (
    <div className={shared.full}>
      <div className={shared.top}>
        <Reveal>
          <Kicker accent>Legacy</Kicker>
        </Reveal>
      </div>

      <div className={styles.body}>
        <Reveal delay={120}>
          <Display size="headline">More than 60 years inside cardiology.</Display>
        </Reveal>

        <Reveal delay={300}>
          <div className={styles.era}>
            <div className={styles.segment}>
              <div className={styles.traceBox}>
                <EcgTrace
                  width={380}
                  height={80}
                  beats={4}
                  seed={1961}
                  amplitude={0.5}
                  noise={0.9}
                  strokeWidth={1.4}
                  stroke="var(--cl-mute)"
                />
              </div>
              <span className={styles.label}>
                <span className={styles.when}>1960s</span>
                <span className={styles.what}>Analogue signal</span>
              </span>
            </div>

            <div className={styles.segment}>
              <div className={styles.traceBox}>
                <EcgTrace
                  width={380}
                  height={80}
                  beats={6}
                  seed={2026}
                  amplitude={0.72}
                  noise={0.1}
                  strokeWidth={1.8}
                />
              </div>
              <span className={styles.label}>
                <span className={styles.when}>Today</span>
                <span className={styles.what}>Digital record</span>
              </span>
            </div>

            <div className={styles.segment}>
              <span className={styles.markers} aria-hidden>
                <span className={styles.marker} />
                <span className={styles.marker} />
                <span className={styles.marker} />
              </span>
              <div className={styles.traceBox}>
                <EcgTrace
                  width={380}
                  height={80}
                  beats={6}
                  seed={2031}
                  amplitude={0.76}
                  noise={0.06}
                  anomalyAt={3}
                  strokeWidth={1.8}
                />
              </div>
              <span className={styles.label}>
                <span className={styles.when}>2031</span>
                <span className={styles.what}>Understood signal</span>
              </span>
            </div>
          </div>
        </Reveal>
      </div>

      <Reveal delay={800}>
        <Lede mute>Six decades of cardiac diagnosis. Now it becomes software.</Lede>
      </Reveal>
    </div>
  );
}
