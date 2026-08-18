import { Logo } from "./Logo";
import styles from "./AnchorWordmark.module.css";

/**
 * Anchor não tem logo — é um produto que ainda não existe.
 *
 * Então o nome é TIPOGRAFADO em Inter, herdando a assinatura do wordmark
 * Cardioline (uppercase, peso 600, tracking largo), e o logo real da Cardioline
 * assenta abaixo como endosso. Em nenhum momento o logo é recriado com texto.
 */
export function AnchorWordmark({
  size = 72,
  variant = "orange",
}: {
  size?: number;
  variant?: "orange" | "white";
}) {
  return (
    <span className={styles.wrap}>
      <span className={styles.name} style={{ fontSize: size }}>
        Anchor
      </span>
      <span className={styles.by}>
        <span>by</span>
        <Logo width={104} variant={variant} />
      </span>
    </span>
  );
}
