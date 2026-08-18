import { Logo } from "@/components/brand/Logo";
import { Reveal } from "@/components/deck/Reveal";
import { Display } from "@/components/primitives/Type";
import { EcgTrace } from "@/components/product/EcgTrace";
import shared from "./slides.module.css";
import styles from "./S22Closing.module.css";

/**
 * Fechamento.
 *
 * O traçado volta uma última vez, agora com uma batida só: a apresentação
 * abriu com o sinal nascendo e fecha com ele em repouso.
 */
export function S22Closing() {
  return (
    <div className={shared.full}>
      <div className={styles.body}>
        <Reveal>
          <Logo width={260} />
        </Reveal>

        <Reveal delay={300}>
          <Display size="display" as="h2" className={styles.claim}>
            The world&rsquo;s best cardiology deserves the world&rsquo;s best digital
            products.
          </Display>
        </Reveal>

        <Reveal delay={1100}>
          <Display size="subhead" className={styles.build}>
            Let&rsquo;s build them.
          </Display>
        </Reveal>
      </div>

      <div className={styles.trace}>
        <EcgTrace
          width={900}
          height={72}
          beats={3}
          seed={1962}
          amplitude={0.6}
          strokeWidth={2}
          draw
          drawDuration={1800}
          delay={1500}
        />
      </div>

      <div className={shared.footer}>
        <span>Cardioline 2028</span>
      </div>
    </div>
  );
}
