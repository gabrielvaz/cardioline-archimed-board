import styles from "./Source.module.css";

export type SourceKind = "cardios" | "cardioline" | "both";

const LABEL: Record<SourceKind, string> = {
  cardios: "Cardios · Brazil",
  cardioline: "Cardioline · worldwide",
  both: "Cardios + Cardioline",
};

/**
 * Marcador de procedência do dado, no alto de cada slide.
 *
 * Existe porque este deck mistura duas operações que medem coisas diferentes:
 * Cardios é a base instalada brasileira, com exame medido no portal CardioNet;
 * Cardioline é o WebApp em nuvem mundial, com exame medido um por um. Somar sem dizer é o erro mais fácil de cometer aqui, e o mais
 * difícil de defender quando alguém do board perguntar de onde veio o número.
 *
 * Fica em TODOS os slides com dado, inclusive quando a resposta é "só Brasil".
 * Um marcador que aparece só às vezes não é lido como regra.
 */
export function Source({ kind, note }: { kind: SourceKind; note?: string }) {
  return (
    <span className={styles.source}>
      <span className={`${styles.dot} ${styles[kind]}`} aria-hidden />
      <span className={styles.text}>
        {LABEL[kind]}
        {note ? ` · ${note}` : ""}
      </span>
    </span>
  );
}
