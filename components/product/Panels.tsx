import { EcgTrace } from "./EcgTrace";
import { Symbol } from "@/components/brand/Logo";
import styles from "./Panels.module.css";

export type ComparisonRow = { when: string; kind: string; seed: number; anomalyAt?: number };

/**
 * Dois exames do mesmo paciente, um sobre o outro.
 *
 * O texto do rodapé descreve uma diferença observada, não uma conclusão — é o
 * tipo de coisa que o produto levanta para o profissional olhar.
 */
export function ExamComparison({
  rows,
  delta,
  traceWidth = 620,
}: {
  rows: ComparisonRow[];
  delta: string;
  traceWidth?: number;
}) {
  return (
    <div className={styles.compare}>
      {rows.map((r, i) => (
        <div className={styles.row} key={r.when}>
          <span className={styles.rowLabel}>
            <span className={styles.rowWhen}>{r.when}</span>
            <span className={styles.rowKind}>{r.kind}</span>
          </span>
          <EcgTrace
            width={traceWidth}
            height={64}
            beats={6}
            seed={r.seed}
            amplitude={0.72}
            noise={0.12}
            anomalyAt={r.anomalyAt}
            strokeWidth={1.8}
            stroke={i === 0 ? "var(--cl-mute)" : "var(--cl-orange)"}
          />
        </div>
      ))}
      <div className={styles.delta}>
        <span className={styles.deltaDot} aria-hidden />
        {delta}
      </div>
    </div>
  );
}

/** Rascunho estruturado de laudo — gerado para revisão, nunca assinado sozinho. */
export function ReportComposer({
  title = "Report draft",
  sections,
}: {
  title?: string;
  sections: { name: string; lines: number[] }[];
}) {
  return (
    <div className={styles.report}>
      <div className={styles.reportHead}>
        <span className={styles.reportTitle}>{title}</span>
        <span className={styles.draft}>Draft for review</span>
      </div>
      {sections.map((s) => (
        <div className={styles.section} key={s.name}>
          <span className={styles.sectionName}>{s.name}</span>
          <span className={styles.lines}>
            {s.lines.map((w, i) => (
              <span key={i} className={styles.line} style={{ width: `${w}%` }} />
            ))}
          </span>
        </div>
      ))}
    </div>
  );
}

export function DeviceSync({
  device,
  state = "synced",
}: {
  device: string;
  state?: "pairing" | "synced";
}) {
  return (
    <div className={styles.sync}>
      <span className={styles.syncIcon} aria-hidden>
        <Symbol size={22} />
      </span>
      <span className={styles.syncText}>
        <span className={styles.syncName}>{device}</span>
        <span className={styles.syncState}>
          {state === "synced" ? "Connected to Anchor" : "Pairing"}
        </span>
      </span>
      <span className={styles.pulse} aria-hidden />
    </div>
  );
}
