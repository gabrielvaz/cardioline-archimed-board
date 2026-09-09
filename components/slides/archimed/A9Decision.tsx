import { Reveal } from "@/components/deck/Reveal";
import { Caption, Display, Kicker } from "@/components/primitives/Type";
import { ASK, BASE_SCENARIO, CONCENTRATION, FX, int, usdShort } from "@/lib/archimed";
import shared from "../slides.module.css";
import styles from "./A9Decision.module.css";

/**
 * O pedido outra vez, com o detalhe, e o custo de não decidir.
 *
 * Este slide fica projetado durante as perguntas, então ele tem que se ler como
 * a decisão e não como resumo — é o slide 2 outra vez, com o detalhe. O valor do
 * pedido é um marcador visível: ver `ASK` em `lib/archimed.ts`.
 */
export function A9Decision() {
  return (
    <div className={`${shared.full} ${shared.between}`}>
      <div className={shared.top}>
        <Reveal>
          <Kicker accent>The decision</Kicker>
        </Reveal>
        <Reveal delay={80}>
          <Kicker>Product and team</Kicker>
        </Reveal>
      </div>

      <div className={styles.body}>
        <Reveal delay={100}>
          <Display size="subhead" className={styles.claim}>
            Three things to fund, and one number that appears only if all three
            are funded.
          </Display>
        </Reveal>

        <div className={styles.grid}>
          {ASK.items.map((it, i) => (
            <Reveal key={it.head} delay={260 + i * 130} className={styles.cell}>
              <span className={styles.num} data-numeric>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={styles.head}>{it.head}</span>
              <span className={styles.text}>{it.body}</span>
            </Reveal>
          ))}
        </div>
      </div>

      <div className={styles.foot}>
        <Reveal delay={620} className={styles.askRow}>
          <div className={styles.ask}>
            <span className={styles.askLabel}>The ask</span>
            {ASK.amountBrl === null ? (
              <span className={styles.askBlank}>to be set before the meeting</span>
            ) : (
              <span className={styles.askValue} data-numeric>
                {usdShort(ASK.amountBrl)}
              </span>
            )}
          </div>
          <div className={styles.ask}>
            <span className={styles.askLabel}>Against</span>
            <span className={styles.askValue} data-numeric>
              {usdShort(BASE_SCENARIO.arrBrl)}
            </span>
            <span className={styles.askNote}>
              of ARR at month 24, from clients we already have and{" "}
              {int(CONCENTRATION.middleEntities)} middle-band accounts to cover
            </span>
          </div>
          <div className={styles.ask}>
            <span className={styles.askLabel}>If we do not</span>
            <span className={styles.askPlain}>
              The per-exam AI cost keeps accruing against revenue that was
              collected once, and the installed base keeps growing with no
              revenue line attached to it.
            </span>
          </div>
        </Reveal>
        <Reveal delay={740}>
          <Caption>
            Product Design proposal for internal discussion. Not official
            Cardioline material and not a commercial offer.{" "}
          Converted at {FX.label}.
        </Caption>
        </Reveal>
      </div>
    </div>
  );
}
