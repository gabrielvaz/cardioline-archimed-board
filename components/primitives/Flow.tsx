"use client";

import { Children, Fragment, type CSSProperties, type ReactNode } from "react";
import { useSlideActive } from "@/components/deck/DeckContext";
import styles from "./Flow.module.css";

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

/**
 * Cadeia de nós ligados por hairlines que desenham em sequência.
 *
 * O conector é o "trace" na função de ligação: a mesma linha de 1px que bate
 * como ECG na abertura vira aqui a estrutura do argumento.
 */
export function Flow({
  children,
  direction = "row",
  gap = 0,
  className,
  style,
}: {
  children: ReactNode;
  direction?: "row" | "column";
  gap?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const active = useSlideActive();
  const items = Children.toArray(children);

  return (
    <div
      className={cx(styles.flow, direction === "column" && styles.column, className)}
      style={{ gap, ...style }}
    >
      {items.map((child, i) => (
        <Fragment key={i}>
          {child}
          {i < items.length - 1 && (
            <span
              aria-hidden
              className={cx(
                styles.link,
                direction === "row" ? styles.linkRow : styles.linkColumn,
                active && styles.linkOn,
              )}
              style={{ "--link-delay": `${240 + i * 130}ms` } as CSSProperties}
            />
          )}
        </Fragment>
      ))}
    </div>
  );
}

export function FlowNode({
  children,
  variant = "outline",
  className,
}: {
  children: ReactNode;
  variant?: "outline" | "solid" | "tinted" | "plain";
  className?: string;
}) {
  return (
    <span className={cx(styles.node, styles[variant], className)}>{children}</span>
  );
}
