import type { ReactNode } from "react";
import { CONCEPTUAL_NOTE, SYNTHETIC_NOTE } from "@/lib/synthetic";
import styles from "./Type.module.css";

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

/**
 * Rótulo pequeno em caixa alta com tracking largo — a assinatura do wordmark.
 *
 * `accent` põe uma régua laranja antes do texto. O laranja nunca vai no texto
 * em si: a 16px ele reprova AA sobre branco (3.45:1), então entra como
 * elemento gráfico, onde não há requisito de contraste.
 */
export function Kicker({
  children,
  accent = false,
  className,
}: {
  children: ReactNode;
  accent?: boolean;
  className?: string;
}) {
  return (
    <span className={cx(styles.kicker, styles.kickerWrap, className)}>
      {accent && <span className={styles.accentRule} aria-hidden />}
      <span className={styles.kickerText}>{children}</span>
    </span>
  );
}

type DisplaySize = "hero" | "display" | "headline" | "subhead";

const SIZE: Record<DisplaySize, string> = {
  hero: styles.hero,
  display: styles.displaySize,
  headline: styles.headline,
  subhead: styles.subhead,
};

export function Display({
  children,
  size = "display",
  as: Tag = "h2",
  className,
}: {
  children: ReactNode;
  size?: DisplaySize;
  as?: "h1" | "h2" | "p" | "div" | "span";
  className?: string;
}) {
  return <Tag className={cx(styles.display, SIZE[size], className)}>{children}</Tag>;
}

/** Trecho em laranja dentro de um display. Só use em tamanhos >= 32px. */
export function Accent({ children }: { children: ReactNode }) {
  return <span className={styles.accent}>{children}</span>;
}

export function Lede({
  children,
  mute,
  className,
}: {
  children: ReactNode;
  mute?: boolean;
  className?: string;
}) {
  return <p className={cx(styles.lede, mute && styles.mute, className)}>{children}</p>;
}

export function Body({
  children,
  mute,
  className,
}: {
  children: ReactNode;
  mute?: boolean;
  className?: string;
}) {
  return <p className={cx(styles.body, mute && styles.mute, className)}>{children}</p>;
}

/**
 * Nota de ressalva.
 *
 * `illustrative` para qualquer slide com valor clínico; `conceptual` acrescenta
 * que nada ali é alegação clínica — obrigatório nos slides 16 e 17.
 */
export function Caption({
  children,
  tone,
  className,
}: {
  children?: ReactNode;
  tone?: "illustrative" | "conceptual";
  className?: string;
}) {
  const note =
    tone === "conceptual"
      ? `${SYNTHETIC_NOTE}. ${CONCEPTUAL_NOTE}.`
      : tone === "illustrative"
        ? `${SYNTHETIC_NOTE}.`
        : null;
  return (
    <p className={cx(styles.caption, className)}>
      {children}
      {children && note ? " " : null}
      {note}
    </p>
  );
}

export function BigNumber({ children }: { children: ReactNode }) {
  return (
    <span className={styles.bigNumber} data-numeric>
      {children}
    </span>
  );
}
