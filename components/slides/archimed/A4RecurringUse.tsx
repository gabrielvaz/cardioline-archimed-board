import { Reveal } from "@/components/deck/Reveal";
import { Caption, Display, Kicker } from "@/components/primitives/Type";
import { BASE, BASE_SCENARIO, EXAMS, USAGE, int, pct } from "@/lib/archimed";
import shared from "../slides.module.css";
import { Stat, StatRow } from "./Stat";
import styles from "./A4RecurringUse.module.css";

/**
 * O uso do software já é recorrente, e agora isso é medido em escala.
 *
 * Duas versões anteriores deste slide morreram. A primeira argumentava por
 * recompra de hardware, que não diz nada sobre assinar software. A segunda usava
 * uma coorte de 47 clientes e sete meses, tirada de um único centro de
 * telemedicina. Os rollups do CardioNet substituem as duas: seis pares de anos
 * consecutivos, cerca de cinco mil clientes cada, de 2019 a 2025.
 *
 * O número que importa é o terceiro. Retenção de logo medida em 87% ao ano
 * significa 13% de churn, e o modelo assume 15%: a premissa passou a ser
 * levemente conservadora, o que é a posição confortável para defender num board.
 */
export function A4RecurringUse() {
  return (
    <div className={`${shared.full} ${shared.between}`}>
      <div className={shared.top}>
        <Reveal>
          <Kicker accent>Recurring use</Kicker>
        </Reveal>
        <Reveal delay={80}>
          <Kicker>CardioNet portal · measured since 2019</Kicker>
        </Reveal>
      </div>

      <div className={styles.body}>
        <Reveal delay={100}>
          <Display size="headline" className={styles.claim}>
            The software is already used every month.
          </Display>
        </Reveal>

        <Reveal delay={280}>
          <StatRow>
            <Stat
              label="Exams through the software"
              value={int(EXAMS.perMonthTotal)}
              note={`Every month, on devices the client already owns. ${int(EXAMS.lifetime)} exams on record, and nobody pays a subscription for any of them.`}
            />
            <Stat
              label="Accounts transmitting monthly"
              value={int(BASE.portalActivePerMonth)}
              note={`Out of ${int(BASE.portalAccounts)} accounts on the portal. Median account has been active ${USAGE.medianActiveMonths} months.`}
            />
            <Stat
              label="Logo retention, year over year"
              value={pct(USAGE.retentionAnnual)}
              tone="accent"
              note={`Measured across ${USAGE.yearPairs} consecutive year pairs, 2019 to 2025, never below ${pct(USAGE.retentionMin)}.`}
            />
          </StatRow>
        </Reveal>
      </div>

      <div className={styles.foot}>
        <Reveal delay={460} className={styles.honest}>
          <p className={styles.honestText}>
            <strong>The churn line is no longer an assumption.</strong> Retention
            of {pct(USAGE.retentionAnnual)} a year is {pct(USAGE.impliedAnnualChurn)}{" "}
            logo churn, and this model assumes {pct(BASE_SCENARIO.churn)}, so the
            projection is now mildly conservative rather than optimistic. What
            none of this measures is renewal at a price: no account in the series
            has ever been asked to pay one, and that is the pilot&rsquo;s job.
          </p>
        </Reveal>
        <Reveal delay={580}>
          <Caption>
            Source: CardioNet portal rollups, {EXAMS.windowLabel} for the monthly
            figures and 2019 to 2025 for retention. The trustworthy series starts
            in January 2019: the 2006 to 2018 history was lost in a database
            migration, so earlier years are remnants and no growth rate is
            computed against them.
          </Caption>
        </Reveal>
      </div>
    </div>
  );
}
