import type { CSSProperties, ReactNode } from "react";
import styles from "./Frames.module.css";

/** Chrome de browser mínimo. O raio vem do squircle do símbolo da marca. */
export function BrowserFrame({
  url,
  children,
  className,
  style,
}: {
  url: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={`${styles.browser} ${className ?? ""}`} style={style}>
      <div className={styles.browserBar}>
        <span className={styles.dots} aria-hidden>
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </span>
        <span className={styles.url}>{url}</span>
      </div>
      <div className={styles.browserBody}>{children}</div>
    </div>
  );
}

export function DeviceFrame({
  kind,
  children,
  className,
  style,
}: {
  kind: "desktop" | "tablet" | "phone";
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={`${styles.device} ${styles[kind]} ${className ?? ""}`} style={style}>
      <div className={styles.screen}>{children}</div>
    </div>
  );
}
