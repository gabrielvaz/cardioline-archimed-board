import { EcgTrace } from "@/components/product/EcgTrace";
import { PATIENTS } from "@/lib/synthetic";
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
        {/* Mesmo paciente do workspace: a tese é um registro só, em três telas. */}
        <p className={styles.patient}>{PATIENTS[0].name}</p>
        <p className={styles.meta}>
          {PATIENTS[0].sex} {PATIENTS[0].age} · VIREO AM
        </p>
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
        {[
          ["HR", "68 bpm", false],
          ["QTc", "412 ms", true],
          ["QRS", "94 ms", false],
          ["PR", "156 ms", false],
          ["Axis", "41°", false],
          ["Leads", "12", false],
        ].map(([k, v, alert]) => (
          <div key={k as string} className={styles.cell}>
            <p className={styles.k}>{k}</p>
            <p className={`${styles.v} ${alert ? styles.alert : ""}`}>{v}</p>
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
