import type { CSSProperties } from "react";
import styles from "./Rule.module.css";

/** Hairline divisor. `weight` marca hierarquia sem precisar de card. */
export function Rule({
  weight = 1,
  tone = "line",
  style,
}: {
  weight?: number;
  tone?: "line" | "orange";
  style?: CSSProperties;
}) {
  return (
    <hr
      className={`${styles.rule} ${tone === "orange" ? styles.orange : ""}`}
      style={{ height: weight, ...style }}
    />
  );
}
