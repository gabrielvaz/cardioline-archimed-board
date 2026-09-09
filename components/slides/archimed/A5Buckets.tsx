import { Reveal } from "@/components/deck/Reveal";
import { Caption, Display, Kicker } from "@/components/primitives/Type";
import {
  BUCKETS,
  BUCKETS_EXAMS_TOTAL,
  CONCENTRATION,
  EXAMS,
  FX,
  REVENUE,
  int,
  pct,
  usdNum,
  usdUnit,
} from "@/lib/archimed";
import shared from "../slides.module.css";
import styles from "./A5Buckets.module.css";

/**
 * A base fatiada por volume de exames, com preço e conversão por faixa.
 *
 * Este slide existe porque o MRR não faz sentido sem ele: uma assinatura por
 * cliente só se sustenta se o preço acompanhar o volume, e o volume varia por
 * três ordens de grandeza dentro da mesma base. A barra mostra a distorção que
 * decide a estratégia comercial, medida no portal em 2025: a metade de baixo das
 * contas faz 4,2% dos exames, os dois buckets do meio fazem 63,5%, e o 1% de cima
 * (54 contas) faz 23,3%. O título dizia "1% faz 44%": era o modelo derivado.
 *
 * A coluna do teto se chama "Ceiling" e não "Conv.": o slide seguinte tem uma
 * coluna "Conv." com a conversão líquida de churn, que é um número menor, e o
 * mesmo rótulo para os dois convidava a comparação errada.
 *
 * A coluna "vs. today" é a que responde a objeção de preço antes dela ser feita:
 * a assinatura é uma fração do que o cliente já gasta em laudo terceirizado.
 * Nos buckets grandes ela deixa de valer, porque quem tem esse volume lauda por
 * conta própria e não paga laudo a ninguém — e aí a âncora passa a ser o preço
 * por exame, na legenda.
 */
export function A5Buckets() {
  const maxExams = Math.max(...BUCKETS.map((b) => b.exams));

  return (
    <div className={`${shared.full} ${styles.wrap}`}>
      <div className={shared.top}>
        <Reveal>
          <Kicker accent>Exam volume</Kicker>
        </Reveal>
        <Reveal delay={80}>
          <Kicker>{int(EXAMS.perMonthTotal)} exams a month</Kicker>
        </Reveal>
      </div>

      <Reveal delay={100}>
        <Display size="subhead" className={styles.claim}>
          Half the base does {pct(CONCENTRATION.bottomHalfShareOfExams)} of the
          exams. The middle two bands do {pct(CONCENTRATION.middleShareOfExams)}.
        </Display>
      </Reveal>

      <Reveal delay={240} className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Band</th>
              <th className={styles.num}>Clients</th>
              <th className={styles.num}>Exams</th>
              <th className={styles.share}>Share</th>
              <th className={styles.num}>Median</th>
              <th className={styles.num}>US$ / mo</th>
              <th className={styles.num}>US$ / exam</th>
              <th className={styles.num}>vs. today</th>
              <th className={styles.num}>Ceiling</th>
            </tr>
          </thead>
          <tbody>
            {BUCKETS.map((b, i) => {
              const spendToday = b.medianExams * REVENUE.outsourcedReportBrl;
              return (
                <tr key={b.name} className={i >= 4 ? styles.rowKey : undefined}>
                  <td>{b.name}</td>
                  <td className={styles.num}>{int(b.entities)}</td>
                  <td className={styles.num}>{int(b.exams)}</td>
                  <td className={styles.share}>
                    <span className={styles.shareInner}>
                      <span className={styles.barTrack}>
                        <span
                          className={styles.barFill}
                          style={{ width: `${(b.exams / maxExams) * 100}%` }}
                        />
                      </span>
                      <span className={styles.barNum}>
                        {pct(b.exams / BUCKETS_EXAMS_TOTAL)}
                      </span>
                    </span>
                  </td>
                  <td className={styles.num}>{int(b.medianExams)}</td>
                  <td className={styles.num}>{usdNum(b.priceBrl)}</td>
                  <td className={styles.num}>
                    {usdUnit(b.priceBrl / b.medianExams)}
                  </td>
                  <td className={styles.num}>{pct(b.priceBrl / spendToday)}</td>
                  <td className={styles.num}>{pct(b.ceiling)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Reveal>

      <Reveal delay={520}>
        <Caption>
          All of it measured, not derived: every active account in 2025 placed in
          the band of its own average per active month, from the CardioNet portal
          rollups. Price is the assumption, anchored on the R${" "}
          {REVENUE.outsourcedReportBrl} per outsourced report the client already
          pays, a figure reported by management and not in the portal data, and
          the two small bands have to come in under that. Conversion is
          an assumption too. The nine accounts above 1,500 exams a month are
          negotiated one at a time, so the top price is a floor. The middle two
          bands, {int(CONCENTRATION.middleEntities)} accounts, carry{" "}
          {pct(CONCENTRATION.middleShareOfExams)} of the volume.{" "}
          All figures converted at {FX.label}.
        </Caption>
      </Reveal>
    </div>
  );
}
