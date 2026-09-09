import { Reveal } from "@/components/deck/Reveal";
import { Caption, Display, Kicker } from "@/components/primitives/Type";
import {
  BASE,
  BASE_SCENARIO,
  BUCKETS,
  CONCENTRATION,
  FX,
  REVENUE,
  SCENARIOS,
  int,
  pct,
  usd,
  usdNum,
  usdShort,
} from "@/lib/archimed";
import shared from "../slides.module.css";
import { Source } from "./Source";
import styles from "./G6Recurring.module.css";

/**
 * O MRR que sai dos buckets do slide anterior.
 *
 * Aqui só entra o que o slide anterior não mostrou: quantos clientes de cada
 * faixa realmente pagam no mês 24, depois do churn, e quanto isso vira. O título
 * diz a verdade desconfortável em vez de escondê-la: R$ 1,97 M é 73% da receita
 * de software de hoje, não o dobro dela. O que sustenta o pedido não é o tamanho
 * absoluto, é que essa receita não existe hoje e não depende de vender aparelho.
 *
 * A versão anterior deste slide segmentava por aparelho e dizia que 14% da base
 * dobrava a receita de software. Estava errado: chamava de central toda entidade
 * com 50+ aparelhos, o que dava 498 clientes de alto volume onde, por exame,
 * existem 32.
 *
 * A versão com sliders, para mexer nas premissas ao vivo, é o slide avulso em
 * `_estrategia/2026-09-08-mrr-arr-base-instalada/`.
 */
export function G6Recurring() {
  return (
    <div className={`${shared.full} ${styles.wrap}`}>
      <div className={shared.top}>
        <Reveal>
          <Kicker accent>Recurring model</Kicker>
        </Reveal>
        <Reveal delay={80}>
          <Source kind="cardios" note="24 months, current clients" />
        </Reveal>
      </div>

      <Reveal delay={100}>
        <Display size="subhead" className={styles.claim}>
          {int(BASE_SCENARIO.payers)} clients, {pct(BASE_SCENARIO.payers / BASE.portalActiveYear)} of
          the base, is {usdShort(BASE_SCENARIO.arrBrl)} of ARR.
        </Display>
      </Reveal>

      <div className={styles.split}>
        <Reveal delay={240} className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Band</th>
                <th className={styles.num}>Clients</th>
                <th className={styles.num}>US$ / mo</th>
                <th className={styles.num}>Conv.</th>
                <th className={styles.num}>Payers</th>
                <th className={styles.num}>MRR, US$</th>
              </tr>
            </thead>
            <tbody>
              {BUCKETS.map((b, i) => (
                <tr key={b.name} className={i >= 4 ? styles.rowKey : undefined}>
                  <td>{b.name}</td>
                  <td className={styles.num}>{int(b.entities)}</td>
                  <td className={styles.num}>{usdNum(b.priceBrl)}</td>
                  <td className={styles.num}>{pct(b.conversion)}</td>
                  <td className={styles.num}>{b.payers}</td>
                  <td className={styles.num}>{usdNum(b.mrrBrl)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <Reveal delay={520} className={styles.caption}>
            <Caption>
              Conversion is net of churn at {pct(BASE_SCENARIO.churn)} a year, so
              it is below the ceiling on the previous slide. Base case is{" "}
              {usd(BASE_SCENARIO.mrrBrl)} of MRR. No new hardware sale is in this
              model, and the base already owns its lifetime licence, so none of
              this revenue is cannibalised: it is{" "}
              {pct(BASE_SCENARIO.arrBrl / REVENUE.softwareBrl)} of today&rsquo;s
              software revenue, created without selling a single device.{" "}
          All figures converted at {FX.label}.
        </Caption>
          </Reveal>
        </Reveal>

        <Reveal delay={400} className={styles.side}>
          <span className={styles.sideLabel}>ARR at month 24</span>
          <div className={styles.scenarios}>
            {SCENARIOS.map((s) => (
              <div
                key={s.label}
                className={`${styles.scenario} ${s.label === "Base" ? styles.scenarioKey : ""}`}
              >
                <span className={styles.scLabel}>{s.label}</span>
                <span className={styles.scArr} data-numeric>
                  {usdShort(s.arrBrl)}
                </span>
                <span className={styles.scNote}>
                  {s.payers} payers ·{" "}
                  {s.vsSoftwareToday.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  × software today
                </span>
              </div>
            ))}
          </div>
          <span className={styles.sideFoot}>
            The two middle bands, {int(CONCENTRATION.middleEntities)} accounts,
            carry {pct(CONCENTRATION.middleShareOfMrr)} of it.
          </span>
        </Reveal>
      </div>
    </div>
  );
}
