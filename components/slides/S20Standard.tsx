import { Reveal } from "@/components/deck/Reveal";
import { Display } from "@/components/primitives/Type";
import shared from "./slides.module.css";
import styles from "./S20Standard.module.css";

const NOTS = ["Not through marketing.", "Not through lock-in.", "Not through fear."];

/**
 * O padrão.
 *
 * A pergunta é posta na boca do profissional, nunca da marca — e a resposta
 * imediata é que essa posição precisa ser conquistada. Em nenhum momento se diz
 * que quem não usa é irresponsável: isso seria agressivo e, num material
 * clínico, indefensável.
 */
export function S20Standard() {
  return (
    <div className={shared.full}>
      <div className={styles.body}>
        <Reveal>
          <Display size="hero" as="h2" className={styles.quote}>
            &ldquo;Why aren&rsquo;t you using Cardioline?&rdquo;
          </Display>
        </Reveal>

        <Reveal delay={700}>
          <span className={styles.earn}>That is the position we want to earn.</span>
        </Reveal>

        <div className={styles.nots}>
          {NOTS.map((n, i) => (
            <Reveal key={n} delay={1200 + i * 320}>
              <span className={styles.not}>{n}</span>
            </Reveal>
          ))}
        </div>

        <Reveal delay={2300}>
          <span className={styles.rule} />
        </Reveal>

        <Reveal delay={2450}>
          <p className={styles.because}>
            But because the product consistently helps professionals see more,
            understand faster and make better-informed decisions.
          </p>
        </Reveal>
      </div>
    </div>
  );
}
