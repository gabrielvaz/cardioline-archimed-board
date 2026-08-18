import styles from "./ClinicalInsight.module.css";

/**
 * Um achado que o sistema levanta para o profissional revisar.
 *
 * A linguagem é deliberadamente de observação, nunca de diagnóstico: o produto
 * observa, compara e destaca; quem interpreta e decide é o cardiologista.
 */
export function ClinicalInsight({
  label = "For review",
  title,
  body,
  tone = "neutral",
}: {
  label?: string;
  title: string;
  body: string;
  tone?: "neutral" | "attention";
}) {
  return (
    <div className={`${styles.card} ${tone === "attention" ? styles.attention : ""}`}>
      <span className={styles.head}>
        {tone === "attention" && <span className={styles.dot} aria-hidden />}
        <span className={styles.label}>{label}</span>
      </span>
      <span className={styles.title}>{title}</span>
      <span className={styles.body}>{body}</span>
    </div>
  );
}
