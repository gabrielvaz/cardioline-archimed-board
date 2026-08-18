import { Reveal } from "@/components/deck/Reveal";
import { Body, Caption, Display, Kicker } from "@/components/primitives/Type";
import { RiskTrend } from "@/components/product/RiskTrend";
import shared from "./slides.module.css";
import styles from "./S17Prediction.module.css";

const TERMS = [
  "Risk estimation",
  "Trends over time",
  "Possible deterioration",
  "Signals requiring attention",
];

/**
 * Previsão.
 *
 * A linguagem é toda condicional e o gráfico é um cone que se abre, nunca uma
 * seta apontando para um desfecho. Previsão apresentada como certeza seria
 * desonesta, e num material clínico seria pior do que isso.
 */
export function S17Prediction() {
  return (
    <div className={shared.full}>
      <div className={shared.top}>
        <Reveal>
          <Kicker accent>Prediction</Kicker>
        </Reveal>
      </div>

      <div className={styles.body}>
        <div className={styles.head}>
          <Reveal delay={100}>
            <Display size="headline">From diagnosis to anticipation.</Display>
          </Reveal>
          <Reveal delay={280} className={styles.note}>
            <Body mute>
              Software should not only explain what happened. It should help
              professionals understand what may happen next.
            </Body>
          </Reveal>
        </div>

        <Reveal delay={420} className={styles.chart}>
          <RiskTrend width={1360} height={330} />
        </Reveal>

        <div className={styles.terms}>
          {TERMS.map((t, i) => (
            <Reveal key={t} delay={1500 + i * 120} className={styles.term}>
              {t}
            </Reveal>
          ))}
        </div>

        <Caption tone="conceptual" />
      </div>
    </div>
  );
}
