import { EcgTrace } from "@/components/product/EcgTrace";
import { EXAM } from "@/lib/v2/copy";
import styles from "./AnchorMobile.module.css";

/**
 * O Anchor no telefone.
 *
 * Não é a landing encolhida: é a tarefa que realmente acontece no celular, que é
 * ler um exame já adquirido e assinar o laudo. Por isso a tela abre no traçado e
 * nas medidas, e a ação principal é assinar.
 *
 * Interface real em HTML e CSS, não uma imagem de mockup: continua nítida em
 * qualquer densidade de tela e é reutilizável nas próximas etapas do protótipo.
 */
export function AnchorMobile() {
  return (
    <div className={styles.app}>
      <div className={styles.bar}>
        <span>09:26</span>
        <span>ANCHOR</span>
      </div>

      <div className={styles.head}>
        {/* Mesmo exame do workspace: a tese é um registro só, em três telas. */}
        <p className={styles.patient}>{EXAM.patient}</p>
        <p className={styles.meta}>{EXAM.metaShort}</p>
        <span className={styles.status}>
          <span className={styles.dot} />
          Ready to review
        </span>
      </div>

      <div className={styles.trace}>
        <div className={styles.paper} />
        <EcgTrace
          className={styles.traceSvg}
          fluid
          width={520}
          height={168}
          beats={7}
          seed={4211}
          amplitude={0.78}
          anomalyAt={4}
          stroke="var(--cl-ink)"
          strokeWidth={2.2}
        />
      </div>

      <div className={styles.grid}>
        {/* Mesmos valores do workspace: é o mesmo exame visto noutra tela. */}
        {EXAM.measures.slice(0, 6).map((m) => (
          <div key={m.k} className={styles.cell}>
            <p className={styles.k}>{m.k}</p>
            <p className={`${styles.v} ${m.flag ? styles.alert : ""}`}>
              {m.v}
              {m.unit ? <span className={styles.unit}>{m.unit}</span> : null}
            </p>
          </div>
        ))}
      </div>

      <div className={styles.assist}>
        <p className={styles.assistTitle}>Anchor Pro · AI-assisted</p>
        <p className={styles.assistBody}>
          Lateral ST changes in V5 and V6, and a QTc 16 ms longer than June
          2024.
        </p>
      </div>

      <div className={styles.actions}>
        <span className={styles.sign}>Sign report</span>
        <span className={styles.ghost}>Compare</span>
      </div>
    </div>
  );
}
