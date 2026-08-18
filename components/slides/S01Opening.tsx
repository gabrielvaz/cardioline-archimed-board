import { Logo } from "@/components/brand/Logo";
import { Reveal } from "@/components/deck/Reveal";
import { Display } from "@/components/primitives/Type";
import { EcgTrace } from "@/components/product/EcgTrace";
import shared from "./slides.module.css";
import styles from "./S01Opening.module.css";

/**
 * Abertura.
 *
 * A negação é dita em voz baixa e a afirmação chega grande: o contraste de
 * escala é o argumento. O traçado nasce desenhando sob os olhos de quem assiste
 * — é a primeira aparição do "trace", que atravessa a apresentação inteira.
 */
export function S01Opening() {
  return (
    <div className={shared.full}>
      <div className={shared.top}>
        <Reveal>
          <Logo width={148} />
        </Reveal>
      </div>

      <div className={styles.body}>
        <Reveal delay={200}>
          <Display size="headline" as="h1" className={styles.negation}>
            The future of cardiology is not another device.
          </Display>
        </Reveal>
        <Reveal delay={1100}>
          <Display size="hero" className={styles.payoff}>
            It&rsquo;s intelligence.
          </Display>
        </Reveal>
      </div>

      <div className={styles.trace}>
        <EcgTrace
          width={1360}
          height={90}
          beats={9}
          seed={2031}
          amplitude={0.62}
          strokeWidth={2}
          draw
          drawDuration={2600}
          delay={400}
        />
      </div>

      <div className={shared.footer}>
        <span>Cardioline — 2031 Product Vision</span>
      </div>
    </div>
  );
}
