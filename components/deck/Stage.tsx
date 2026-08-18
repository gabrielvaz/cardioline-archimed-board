import type { ReactNode } from "react";
import styles from "./Stage.module.css";

/** Canvas fixo de 1600x900 onde cada slide é desenhado. */
export function Stage({ children }: { children: ReactNode }) {
  return (
    <div className={styles.stage}>
      <div className={styles.pad}>{children}</div>
    </div>
  );
}
