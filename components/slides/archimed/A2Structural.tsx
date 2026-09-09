import { Reveal } from "@/components/deck/Reveal";
import { Display, Kicker } from "@/components/primitives/Type";
import { REVENUE, usd } from "@/lib/archimed";
import shared from "../slides.module.css";
import styles from "./A2Structural.module.css";

/**
 * O problema estrutural, em três linhas.
 *
 * A objeção que o board levanta aqui é "o software é 6% da receita, por que
 * mexer". A resposta está na terceira linha: o custo de IA por exame é perpétuo,
 * então a margem se degrada a cada ano de uso do cliente. Não é uma oportunidade
 * que se pode adiar sem preço.
 */
const FACTS = [
  {
    n: "01",
    head: "Revenue happens once",
    body: `A CardioNet Client licence lists at ${usd(REVENUE.licenceListBrl)} and realises about ${usd(REVENUE.licenceRealisedBrl)}, by management's own account. Paid once, used forever.`,
  },
  {
    n: "02",
    head: "Software has no lever of its own",
    body: "New software revenue exists only when a new device is sold. The installed base grows every year and software revenue does not follow it.",
  },
  {
    n: "03",
    head: "The cost happens every month",
    body: "Every exam processed with AI carries a per-exam cost. One-time revenue against a recurring cost is a margin that erodes with use.",
  },
];

export function A2Structural() {
  return (
    <div className={shared.full}>
      <div className={shared.top}>
        <Reveal>
          <Kicker accent>Structural problem</Kicker>
        </Reveal>
      </div>

      <div className={styles.body}>
        <Reveal delay={100}>
          <Display size="headline" className={styles.claim}>
            We sell once. We pay to serve every month.
          </Display>
        </Reveal>

        <div className={styles.rows}>
          {FACTS.map((f, i) => (
            <Reveal key={f.n} delay={280 + i * 140} className={styles.row}>
              <span className={styles.num} data-numeric>
                {f.n}
              </span>
              <span className={styles.head}>{f.head}</span>
              <span className={styles.text}>{f.body}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
