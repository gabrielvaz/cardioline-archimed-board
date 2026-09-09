import { Reveal } from "@/components/deck/Reveal";
import { Display, Kicker } from "@/components/primitives/Type";
import {
  ACTIVATIONS,
  ITALIAN_REFERENCE,
  REVENUE,
  STRESS,
  USAGE,
  pct,
  usd,
  usdShort,
} from "@/lib/archimed";
import shared from "../slides.module.css";
import styles from "./A8MustBeTrue.module.css";

/**
 * As premissas, com o que cada uma custa se for falsa.
 *
 * Num board que interrompe, este slide é onde as interrupções vão aterrissar, e
 * é por isso que ele traz o risco escrito em vez de escondido. A coluna da
 * direita é a que importa: não é "risco", é o que acontece com o número do
 * slide anterior se a linha não se sustentar.
 */
const RISKS = [
  {
    head: "Price is a hypothesis",
    what: `Segment pricing is anchored on the ${usd(REVENUE.outsourcedReportBrl)} per exam that clients pay analysis centres today, with the Italian MindBeat list as reference: ${ITALIAN_REFERENCE.perExamEur.toLocaleString("en-US")} € per exam or ${ITALIAN_REFERENCE.perDevicePerMonthEur} € per device a month. Nobody in Brazil has been asked to pay it yet.`,
    cost: "The pilot with 60 direct Cardios clients settles it in 15 days of use.",
  },
  {
    head: "Volume is measured. Willingness to pay is not",
    what: "19 million exams on record, every one counted. No dataset anywhere contains a client who was offered a price and said yes.",
    cost: "The pilot with the direct Cardios clients answers it in 15 days of use.",
  },
  {
    head: "Provisioning is manual",
    what: "Creating an account on the AI side is still done by hand. That, not demand, capped the pilot.",
    cost: `Base case peaks at ${ACTIVATIONS.peakPerMonth} activations a month. Below that, month 24 slips.`,
  },
  {
    head: "Churn is measured for use, not for paying",
    what: `Logo retention held at ${pct(USAGE.retentionAnnual)} a year across ${USAGE.yearPairs} year pairs. But holding an account that pays nothing is not the same as renewing one that pays.`,
    cost: `At triple the assumed churn, ${pct(STRESS.tripleChurnPct)} a year, the base case still returns ${usdShort(STRESS.tripleChurnArrBrl)} of ARR.`,
  },
];

export function A8MustBeTrue() {
  return (
    <div className={shared.full}>
      <div className={shared.top}>
        <Reveal>
          <Kicker accent>What must be true</Kicker>
        </Reveal>
      </div>

      <div className={styles.body}>
        <Reveal delay={100}>
          <Display size="subhead" className={styles.claim}>
            Four things are assumption, not measurement.
          </Display>
        </Reveal>

        <div className={styles.grid}>
          {RISKS.map((r, i) => (
            <Reveal key={r.head} delay={260 + i * 120} className={styles.cell}>
              <span className={styles.num} data-numeric>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={styles.head}>{r.head}</span>
              <span className={styles.what}>{r.what}</span>
              <span className={styles.cost}>{r.cost}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
