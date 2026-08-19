import Image from "next/image";
import { EcgTrace } from "@/components/product/EcgTrace";
import { EXAM } from "@/lib/v2/copy";
import styles from "./AnchorWorkspace.module.css";

const NAV = ["Home", "Exams", "Patients", "Reports", "Devices"] as const;
const LEADS = [
  { name: "II", seed: 4211, anomalyAt: undefined as number | undefined },
  { name: "V2", seed: 4212, anomalyAt: undefined as number | undefined },
  { name: "V5", seed: 4213, anomalyAt: 4 },
];

/**
 * O workspace do Anchor no navegador.
 *
 * Interface real em HTML e CSS, não imagem: continua nítida em qualquer
 * densidade e é reutilizável nas próximas etapas do protótipo.
 */
export function AnchorWorkspace() {
  return (
    <div className={styles.app}>
      <aside className={styles.side}>
        <Image
          src="/brand/cardioline-logo.svg"
          alt="Cardioline"
          width={600}
          height={38}
          className={styles.logo}
        />
        <nav className={styles.nav}>
          {NAV.map((n, i) => (
            <span
              key={n}
              className={`${styles.navItem} ${i === 1 ? styles.navOn : ""}`}
            >
              {n}
            </span>
          ))}
        </nav>
      </aside>

      <div className={styles.main}>
        <div className={styles.head}>
          <div>
            <p className={styles.patient}>{EXAM.patient}</p>
            <p className={styles.meta}>{EXAM.meta}</p>
          </div>
          <span className={styles.state}>
            <span className={styles.dot} />
            Ready to review
          </span>
        </div>

        <div className={styles.leads}>
          {LEADS.map((lead) => (
            <div key={lead.name} className={styles.lead}>
              <span className={styles.leadName}>{lead.name}</span>
              <div className={styles.box}>
                <div className={styles.paper} />
                <EcgTrace
                  className={styles.svg}
                  fluid
                  width={880}
                  height={120}
                  beats={9}
                  seed={lead.seed}
                  amplitude={0.72}
                  anomalyAt={lead.anomalyAt}
                  stroke="var(--cl-ink)"
                  strokeWidth={2}
                />
              </div>
            </div>
          ))}
        </div>

        <div className={styles.measures}>
          {EXAM.measures.map((m) => (
            <div key={m.k}>
              <p className={styles.k}>{m.k}</p>
              <p className={`${styles.v} ${m.flag ? styles.flag : ""}`}>
                {m.v}
                {m.unit ? <span className={styles.unit}>{m.unit}</span> : null}
              </p>
            </div>
          ))}
        </div>

        <p className={styles.synthetic}>{EXAM.synthetic}</p>
      </div>
    </div>
  );
}
