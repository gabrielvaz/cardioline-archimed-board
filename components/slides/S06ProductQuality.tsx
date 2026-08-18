import { Reveal } from "@/components/deck/Reveal";
import { Display, Kicker } from "@/components/primitives/Type";
import shared from "./slides.module.css";
import styles from "./S06ProductQuality.module.css";

const OLD = ["Complicated", "Fragmented", "Slow", "Intimidating", "Training-dependent"];
const NEW = ["Intuitive", "Contextual", "Fast", "Calm", "Intelligent"];

/**
 * Qualidade de produto.
 *
 * Em vez de dois cartões simétricos, as duas colunas são desenhadas com o
 * caráter do que descrevem: a do software médico tradicional é apertada,
 * pequena e cinza; a nossa respira. A forma é o argumento.
 */
export function S06ProductQuality() {
  return (
    <div className={shared.full}>
      <div className={shared.top}>
        <Reveal>
          <Kicker accent>Product quality</Kicker>
        </Reveal>
      </div>

      <div className={styles.body}>
        <Reveal delay={100}>
          <Display size="headline">
            Clinical software doesn&rsquo;t have to feel clinical.
          </Display>
        </Reveal>

        <div className={styles.columns}>
          <Reveal delay={280} className={`${styles.col} ${styles.old}`}>
            <Kicker>Medical software today</Kicker>
            {OLD.map((t) => (
              <span key={t} className={styles.oldItem}>
                {t}
              </span>
            ))}
          </Reveal>

          <Reveal delay={520} className={styles.col}>
            <Kicker accent>Cardioline 2028</Kicker>
            {NEW.map((t) => (
              <span key={t} className={styles.newItem}>
                {t}
              </span>
            ))}
          </Reveal>
        </div>

        <Reveal delay={900} className={styles.close}>
          <span className={styles.bar} aria-hidden />
          <Display size="subhead">Powerful without feeling complicated.</Display>
        </Reveal>
      </div>
    </div>
  );
}
