import type { ReactNode } from "react";
import styles from "./Stat.module.css";

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

/**
 * Um número grande com rótulo em cima e nota embaixo.
 *
 * Existe porque quatro dos oito slides desta versão são feitos de número, e
 * repetir a mesma escala à mão em quatro CSS modules é como as escalas
 * divergem. `tone="accent"` põe o valor em laranja; use no número que carrega o
 * slide, nunca em dois ao mesmo tempo.
 */
export function Stat({
  label,
  value,
  note,
  tone = "ink",
  size = "md",
}: {
  label: string;
  value: ReactNode;
  note?: ReactNode;
  tone?: "ink" | "accent" | "mute";
  size?: "md" | "lg";
}) {
  return (
    <div className={styles.stat}>
      <span className={styles.label}>{label}</span>
      <span
        className={cx(styles.value, styles[size], tone !== "ink" && styles[tone])}
        data-numeric
      >
        {value}
      </span>
      {note ? <span className={styles.note}>{note}</span> : null}
    </div>
  );
}

/** Fileira de Stat separados por hairline vertical. */
export function StatRow({ children }: { children: ReactNode }) {
  return <div className={styles.row}>{children}</div>;
}
