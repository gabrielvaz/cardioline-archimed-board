import { Reveal } from "@/components/deck/Reveal";
import { Display } from "@/components/primitives/Type";
import shared from "./slides.module.css";
import styles from "./S05Ambition.module.css";

/**
 * A ambição.
 *
 * Primeiro dos três slides navy. Tipografia pura, centrada: o slide não tem
 * nada para olhar além da frase, que é o ponto.
 *
 * O contraste "not the best healthcare software / the best software" é o
 * argumento inteiro — a régua deixa de ser a categoria e passa a ser software.
 */
export function S05Ambition() {
  return (
    <div className={shared.full}>
      <div className={styles.body}>
        <Reveal>
          <Display size="subhead" className={styles.lead}>
            By 2028,
          </Display>
        </Reveal>
        <Reveal delay={320}>
          <Display size="display" as="h2" className={styles.claim}>
            Cardioline will build the best digital cardiology products in the world.
          </Display>
        </Reveal>
        <div className={styles.contrast}>
          <Reveal delay={1000}>
            <span className={styles.no}>Not the best healthcare software.</span>
          </Reveal>
          <Reveal delay={1300}>
            <span className={styles.yes}>The best software.</span>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
