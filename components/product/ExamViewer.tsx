import { EcgTrace } from "./EcgTrace";
import type { Patient } from "@/lib/synthetic";
import styles from "./ExamViewer.module.css";

export type Measure = { label: string; value: string; unit?: string };

type Props = {
  patient: Patient;
  seed: number;
  date?: string;
  kind?: string;
  leads?: string[];
  measures?: Measure[];
  traceWidth?: number;
  traceHeight?: number;
  draw?: boolean;
  anomalyAt?: number;
  /** Layout apertado para frames pequenos: sem tag, tipografia menor. */
  compact?: boolean;
};

const DEFAULT_MEASURES: Measure[] = [
  { label: "Heart rate", value: "68", unit: "bpm" },
  { label: "PR", value: "156", unit: "ms" },
  { label: "QRS", value: "94", unit: "ms" },
  { label: "QTc", value: "412", unit: "ms" },
];

/**
 * Visualizador de exame.
 *
 * Todos os valores são ilustrativos e o paciente é sintético — a tag no canto
 * diz isso na própria interface, não só numa legenda embaixo do slide.
 */
export function ExamViewer({
  patient,
  seed,
  date = "14 Mar 2028 · 09:12",
  kind = "12-lead ECG",
  leads = ["II", "V2", "V5"],
  measures = DEFAULT_MEASURES,
  traceWidth = 780,
  traceHeight = 74,
  draw = false,
  anomalyAt,
  compact = false,
}: Props) {
  return (
    <div className={`${styles.viewer} ${compact ? styles.compact : ""}`}>
      <header className={styles.head}>
        <div className={styles.who}>
          <span className={styles.name}>{patient.name}</span>
          <span className={styles.meta}>
            {patient.age} · {patient.sex} · {kind} · {date}
          </span>
        </div>
        {!compact && (
          <span className={styles.tag}>
            <span className={styles.tagDot} aria-hidden />
            Synthetic
          </span>
        )}
      </header>

      <div className={styles.leads}>
        <span className={styles.grid} aria-hidden />
        {leads.map((lead, i) => (
          <div className={styles.lead} key={lead}>
            <span className={styles.leadName}>{lead}</span>
            <EcgTrace
              fluid
              className={styles.leadTrace}
              width={traceWidth}
              height={traceHeight}
              beats={compact ? 5 : 7}
              seed={seed + i * 17}
              amplitude={0.78 - i * 0.08}
              noise={0.18}
              anomalyAt={i === 0 ? anomalyAt : undefined}
              strokeWidth={1.8}
              draw={draw}
              delay={i * 220}
            />
          </div>
        ))}
      </div>

      <div className={styles.measures}>
        {measures.map((m) => (
          <div className={styles.measure} key={m.label}>
            <span className={styles.measureLabel}>{m.label}</span>
            <span className={styles.measureValue}>
              {m.value}
              {m.unit && <span className={styles.unit}>{m.unit}</span>}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
