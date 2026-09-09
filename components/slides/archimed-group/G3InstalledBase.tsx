import { Reveal } from "@/components/deck/Reveal";
import { Caption, Display, Kicker } from "@/components/primitives/Type";
import { BASE, EXAMS, int } from "@/lib/archimed";
import {
  CL_EXAMS,
  CL_TENANTS,
  CL_TURNAROUND,
  CL_WINDOW,
  pctCl,
} from "@/lib/cardioline";
import shared from "../slides.module.css";
import { Source } from "./Source";
import styles from "./G3InstalledBase.module.css";

/**
 * O que o grupo já tem, nas duas metades, e por que as duas metades importam.
 *
 * A versão só-Brasil deste slide mostrava escala sem prova. Com a Cardioline ele
 * ganha a metade que faltava: a Itália já opera um produto em nuvem multi-tenant,
 * com laudo em mediana de meia hora, o que prova que o modelo funciona; o Brasil
 * tem trinta vezes o volume e nenhum produto em nuvem. É o argumento de sandbox
 * do plano de três anos, agora com número dos dois lados.
 *
 * As duas colunas NÃO se somam, e o slide diz isso: uma conta base instalada de
 * aparelho, a outra conta licença conectada em nuvem.
 */
export function G3InstalledBase() {
  return (
    <div className={`${shared.full} ${shared.between}`}>
      <div className={shared.top}>
        <Reveal>
          <Kicker accent>What the group already has</Kicker>
        </Reveal>
        <Reveal delay={80}>
          <Source kind="both" />
        </Reveal>
      </div>

      <div className={styles.body}>
        <Reveal delay={100}>
          <Display size="headline" className={styles.claim}>
One side has the volume. The other already charges for the cloud.
          </Display>
        </Reveal>

        <div className={styles.cols}>
          <Reveal delay={280} className={styles.col}>
            <span className={styles.colHead}>
              <span className={`${styles.mark} ${styles.br}`} aria-hidden />
              Cardios · Brazil
            </span>
            <span className={styles.colSub}>Installed base of devices</span>
            <dl className={styles.rows}>
              <div>
                <dt>Client entities</dt>
                <dd data-numeric>{int(BASE.entities)}</dd>
              </div>
              <div>
                <dt>Active in 24 months</dt>
                <dd data-numeric>{int(BASE.active)}</dd>
              </div>
              <div>
                <dt>Devices bought in 10 years</dt>
                <dd data-numeric>{int(BASE.devices)}</dd>
              </div>
              <div className={styles.hl}>
                <dt>Exams a month</dt>
                <dd data-numeric>{int(EXAMS.perMonthTotal)}</dd>
              </div>
            </dl>
            <span className={styles.colNote}>
              {int(EXAMS.lifetime)} exams on record since 2019, every one counted.
              No cloud product, no subscription, no recurring revenue.
            </span>
          </Reveal>

          <Reveal delay={420} className={styles.col}>
            <span className={styles.colHead}>
              <span className={`${styles.mark} ${styles.it}`} aria-hidden />
              Cardioline · worldwide
            </span>
            <span className={styles.colSub}>WebApp cloud, already live</span>
            <dl className={styles.rows}>
              <div>
                <dt>Cloud tenants</dt>
                <dd data-numeric>{CL_TENANTS.total}</dd>
              </div>
              <div>
                <dt>Of those, sending exams</dt>
                <dd data-numeric>{CL_TENANTS.withExams}</dd>
              </div>
              <div>
                <dt>Licences connected</dt>
                <dd data-numeric>{int(CL_TENANTS.units)}</dd>
              </div>
              <div className={styles.hl}>
                <dt>Exams a month</dt>
                <dd data-numeric>{int(CL_EXAMS.perMonth)}</dd>
              </div>
            </dl>
            <span className={styles.colNote}>
              Every exam measured, one by one. Median {CL_TURNAROUND.medianHours} h
              from acquisition to report, {pctCl(CL_TURNAROUND.under24hShare)} inside
              24 h. This is operation, not a pilot.
            </span>
          </Reveal>
        </div>
      </div>

      <Reveal delay={580} className={styles.caption}>
        <Caption>
          The two columns do not add up and are not meant to: the left counts
          devices ever bought, the right counts licences connected to the cloud.
          Brazil: device counts from the Cardios sales database,{" "}
          {int(BASE.serials)} sales records since 1991; exam volume from the
          CardioNet portal rollups, {EXAMS.windowLabel}. Worldwide: WebApp cloud
          extract of 08/09/2026, {CL_WINDOW.fromLabel} to {CL_WINDOW.toLabel}. The
          cloud figure is a floor on usage, not a market size: whoever runs the
          software locally, without the cloud, is not in it.
        </Caption>
      </Reveal>
    </div>
  );
}
