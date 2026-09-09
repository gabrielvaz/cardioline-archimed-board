import { Reveal } from "@/components/deck/Reveal";
import { Caption, Display, Kicker } from "@/components/primitives/Type";
import { BASE, BASE_SCENARIO, EXAMS, USAGE, int, pct } from "@/lib/archimed";
import { CL_EXAMS, CL_TENANTS, CL_USAGE, CL_WINDOW, pctCl } from "@/lib/cardioline";
import shared from "../slides.module.css";
import { Source } from "./Source";
import styles from "./G4RecurringUse.module.css";

/**
 * A retenção medida duas vezes, em dois continentes, com métodos diferentes.
 *
 * O Brasil agora mede seis pares de anos consecutivos sobre cerca de cinco mil
 * contas, e dá 87% de retenção de logo ao ano. A nuvem italiana mede uma coorte
 * de onze meses sobre 27 tenants, e dá 89%. Amostras de ordens de grandeza
 * diferentes, janelas diferentes, e o mesmo resultado.
 *
 * É a evidência mais forte do deck, e ela não estava aqui até os rollups do
 * CardioNet chegarem: antes o lado brasileiro eram 47 clientes de um único centro
 * de telemedicina.
 */
export function G4RecurringUse() {
  return (
    <div className={`${shared.full} ${shared.between}`}>
      <div className={shared.top}>
        <Reveal>
          <Kicker accent>Recurring use</Kicker>
        </Reveal>
        <Reveal delay={80}>
          <Source kind="both" />
        </Reveal>
      </div>

      <div className={styles.body}>
        <Reveal delay={100}>
          <Display size="headline" className={styles.claim}>
            The software is already used every month, on two continents.
          </Display>
        </Reveal>

        <div className={styles.grid}>
          <div className={styles.rowHead}>
            <span />
            <span className={styles.opHead}>
              <span className={`${styles.mark} ${styles.br}`} aria-hidden />
              Cardios · Brazil
            </span>
            <span className={styles.opHead}>
              <span className={`${styles.mark} ${styles.it}`} aria-hidden />
              Cardioline · worldwide
            </span>
          </div>

          <Reveal delay={280} className={styles.row}>
            <span className={styles.label}>Exams a month</span>
            <span className={styles.val}>
              {int(EXAMS.perMonthTotal)}
              <em>{int(EXAMS.lifetime)} on record since 2019</em>
            </span>
            <span className={styles.val}>
              {int(CL_EXAMS.perMonth)}
              <em>{int(CL_EXAMS.total)} over twelve months</em>
            </span>
          </Reveal>

          <Reveal delay={360} className={styles.row}>
            <span className={styles.label}>Accounts transmitting monthly</span>
            <span className={styles.val}>
              {int(BASE.portalActivePerMonth)}
              <em>of {int(BASE.portalAccounts)} on the portal</em>
            </span>
            <span className={styles.val}>
              {CL_USAGE.activePerMonthMin} to {CL_USAGE.activePerMonthMax}
              <em>of {CL_TENANTS.total} cloud tenants</em>
            </span>
          </Reveal>

          <Reveal delay={440} className={`${styles.row} ${styles.rowKey}`}>
            <span className={styles.label}>Logo retention</span>
            <span className={styles.valBig}>
              {pct(USAGE.retentionAnnual)}
              <em>
                a year, across {USAGE.yearPairs} year pairs, 2019 to 2025
              </em>
            </span>
            <span className={styles.valBig}>
              {pctCl(CL_USAGE.cohortRetention11m)}
              <em>
                {CL_USAGE.cohortEnd} of {CL_USAGE.cohortStart} tenants, over
                eleven months
              </em>
            </span>
          </Reveal>

          <Reveal delay={520} className={styles.row}>
            <span className={styles.label}>Implied annual logo churn</span>
            <span className={styles.val}>{pct(USAGE.impliedAnnualChurn)}</span>
            <span className={styles.val}>{pctCl(CL_USAGE.impliedAnnualChurn)}</span>
          </Reveal>
        </div>
      </div>

      <div className={styles.foot}>
        <Reveal delay={620} className={styles.honest}>
          <p className={styles.honestText}>
            <strong>Two operations, two methods, one answer.</strong> Six year
            pairs over five thousand accounts in Brazil, one cohort of{" "}
            {CL_USAGE.cohortStart} tenants over eleven months in the cloud: samples
            orders of magnitude apart, both landing near{" "}
            {pct(USAGE.retentionAnnual)}. The model assumes{" "}
            {pct(BASE_SCENARIO.churn)} churn, above both, so it is conservative.
            Neither measures renewal at a price, because nobody has been asked.
          </p>
        </Reveal>
        <Reveal delay={720}>
          <Caption>
            Brazil: CardioNet portal rollups, {EXAMS.windowLabel} for volume and
            2019 to 2025 for retention. The trustworthy series starts in January
            2019, because the 2006 to 2018 history was lost in a database
            migration. Worldwide: WebApp cloud, {CL_WINDOW.fromLabel} to{" "}
            {CL_WINDOW.toLabel}, every exam counted. The two exam counts are not
            added.
          </Caption>
        </Reveal>
      </div>
    </div>
  );
}
