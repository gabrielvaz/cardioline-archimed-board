import { Reveal } from "@/components/deck/Reveal";
import { Display, Kicker, Lede } from "@/components/primitives/Type";
import { EcgTrace } from "@/components/product/EcgTrace";
import shared from "./slides.module.css";
import styles from "./S02Legacy.module.css";

const TRACE_W = 380;
const BOX_H = 96;
const BEATS = 6;
const BEAT_W = TRACE_W / BEATS;
const FLAGGED_BEAT = 3;
/** Posição da onda T da batida marcada — 0.55 do ciclo, onde o gerador altera. */
const MARK_X = BEAT_W * (FLAGGED_BEAT + 0.55);
const MARK_Y = BOX_H / 2 + 4;

/**
 * Legado.
 *
 * O mesmo traçado muda de caráter da esquerda para a direita: analógico e
 * ruidoso, depois limpo, depois lido por inteligência. A evolução aparece no
 * próprio sinal, não numa régua de datas.
 *
 * O fecho é deliberado: a Cardioline nunca deixou de fazer software. O que muda
 * em 2028 não é passar a fazê-lo, é para quem ele é feito.
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
              <div className={styles.flagRow} />
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
              <div className={styles.flagRow} />
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
              <div className={styles.flagRow}>
                <span className={styles.flag}>
                  <span className={styles.flagDot} aria-hidden />
                  Change detected
                </span>
              </div>
              <div className={styles.traceBox}>
                <EcgTrace
                  width={380}
                  height={80}
                  beats={6}
                  seed={2031}
                  amplitude={0.76}
                  noise={0.06}
                  anomalyAt={FLAGGED_BEAT}
                  strokeWidth={1.8}
                />
                {/* A marcação é geométrica, derivada da mesma batida que o
                    gerador alterou — não é um enfeite posto por cima. */}
                <svg
                  className={styles.overlay}
                  viewBox={`0 0 ${TRACE_W} ${BOX_H}`}
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  <rect
                    className={styles.band}
                    x={BEAT_W * FLAGGED_BEAT}
                    y={0}
                    width={BEAT_W}
                    height={BOX_H}
                    rx={6}
                  />
                  <line
                    className={styles.leader}
                    x1={MARK_X}
                    y1={0}
                    x2={MARK_X}
                    y2={MARK_Y - 11}
                  />
                  <circle className={styles.ringOuter} cx={MARK_X} cy={MARK_Y} r={9} />
                  <circle className={styles.ringInner} cx={MARK_X} cy={MARK_Y} r={3.5} />
                </svg>
              </div>
              <span className={styles.label}>
                <span className={styles.when}>2028</span>
                <span className={styles.what}>Understood signal</span>
              </span>
            </div>
          </div>
        </Reveal>
      </div>

      <Reveal delay={800}>
        <Lede mute>
          Six decades of hardware and software. What changes is who they are
          built around.
        </Lede>
      </Reveal>
    </div>
  );
}
