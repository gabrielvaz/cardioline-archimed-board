import { Reveal } from "@/components/deck/Reveal";
import { Caption, Display, Kicker } from "@/components/primitives/Type";
import {
  BUCKETS,
  BUCKETS_EXAMS_TOTAL,
  EXAMS,
  FX,
  REVENUE,
  int,
  pct,
  usdNum,
} from "@/lib/archimed";
import { CL_BUCKETS, CL_BUCKETS_BELOW_ONE, CL_EXAMS, CL_WINDOW } from "@/lib/cardioline";
import shared from "../slides.module.css";
import { Source } from "./Source";
import styles from "./G5Buckets.module.css";

/**
 * Os mesmos buckets, nas duas operações, e é isso que valida o método.
 *
 * Depois dos rollups do CardioNet os dois lados são MEDIDOS, e a comparação
 * ficou mais interessante do que quando um era derivado: as formas NÃO são
 * iguais. O Brasil carrega o volume no meio da base, 2.017 contas entre 21 e 400
 * exames/mês fazendo 63,5% do total. A nuvem carrega num único cliente, o
 * PharmaRoom com o ClickSalute somado, que faz 62% dela sozinho. Duas operações,
 * duas formas, e cada uma pede uma
 * cobertura comercial diferente.
 *
 * As colunas de preço só existem no lado brasileiro, porque é onde o modelo de
 * assinatura está sendo proposto. Inventar preço para a nuvem italiana seria
 * inventar duas coisas: o preço e o direito de propô-lo.
 */
export function G5Buckets() {
  const clTotal = CL_BUCKETS.reduce((a, b) => a + b.examsPerMonth, 0);

  return (
    <div className={`${shared.full} ${styles.wrap}`}>
      <div className={shared.top}>
        <Reveal>
          <Kicker accent>Exam volume</Kicker>
        </Reveal>
        <Reveal delay={80}>
          <Source kind="both" />
        </Reveal>
      </div>

      <Reveal delay={100}>
        <Display size="subhead" className={styles.claim}>
          Brazil carries its volume in the middle. The cloud carries it in one
          tenant.
        </Display>
      </Reveal>

      <Reveal delay={240} className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th rowSpan={2}>Band</th>
              <th colSpan={3} className={styles.groupBr}>
                Cardios · Brazil · measured
              </th>
              <th colSpan={2} className={styles.groupIt}>
                Cardioline · cloud · measured
              </th>
              <th colSpan={2} className={styles.groupPrice}>
                Proposed for Brazil
              </th>
            </tr>
            <tr>
              <th className={styles.num}>Clients</th>
              <th className={styles.num}>Exams</th>
              <th className={styles.num}>Share</th>
              <th className={styles.num}>Tenants</th>
              <th className={styles.num}>Share</th>
              <th className={styles.num}>US$ / mo</th>
              <th className={styles.num}>Conv.</th>
            </tr>
          </thead>
          <tbody>
            {BUCKETS.map((b, i) => {
              const cl = CL_BUCKETS[i];
              return (
                <tr key={b.name} className={i >= 4 ? styles.rowKey : undefined}>
                  <td>{b.name}</td>
                  <td className={styles.num}>{int(b.entities)}</td>
                  <td className={styles.num}>{int(b.exams)}</td>
                  <td className={styles.num}>
                    {pct(b.exams / BUCKETS_EXAMS_TOTAL)}
                  </td>
                  <td className={styles.num}>{cl.tenants}</td>
                  <td className={styles.num}>
                    {pct(cl.examsPerMonth / clTotal)}
                  </td>
                  <td className={styles.num}>{usdNum(b.priceBrl)}</td>
                  <td className={styles.num}>{pct(b.ceiling)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Reveal>

      <Reveal delay={520}>
        <Caption>
          Both sides measured, neither derived. Brazil,{" "}
          {int(EXAMS.perMonthTotal)} exams a month: every active account in 2025
          placed in the band of its own average per active month, from the
          CardioNet portal rollups. Worldwide, {int(CL_EXAMS.perMonth)} exams a
          month, {CL_WINDOW.fromLabel} to {CL_WINDOW.toLabel}, tenant placed by its
          median month; {CL_BUCKETS_BELOW_ONE} more tenants use the product below
          one exam a month and sit outside the bands. ClickSalute is counted
          inside PharmaRoom, because the file&rsquo;s own note says it became that
          tenant in May 2026. Price is the only assumption here, anchored on the
          R$ {REVENUE.outsourcedReportBrl} per outsourced report the client
          already pays, a management figure, and it is proposed for Brazil only.
          Nothing is priced for the cloud tenants, and the two exam counts are not
          added.{" "}
          All figures converted at {FX.label}.
        </Caption>
      </Reveal>
    </div>
  );
}
