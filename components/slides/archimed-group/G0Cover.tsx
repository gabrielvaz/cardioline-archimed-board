import { Logo } from "@/components/brand/Logo";
import { Reveal } from "@/components/deck/Reveal";
import { Accent, Display } from "@/components/primitives/Type";
import shared from "../slides.module.css";
import { Source } from "./Source";
import styles from "./G0Cover.module.css";

/**
 * Capa.
 *
 * Branca com o wordmark laranja, como a capa dos 22 slides: no ritmo de cor
 * deste sistema o navy marca alta de narrativa, e capa não é alta de narrativa.
 *
 * Dois elementos: marca e título. O título toma posição em vez de nomear o
 * assunto, mas não entrega número nenhum — a tese aparece no slide 2 e os dados
 * do 4 em diante, onde há argumento por baixo deles.
 *
 * "recurring" sai em laranja: são 72px, bem acima do piso de 32px que a regra da
 * marca exige para laranja em texto.
 */
export function G0Cover() {
  return (
    <div className={shared.full}>
      <div className={shared.top}>
        <Reveal>
          <Logo width={168} />
        </Reveal>
        <Reveal delay={80}>
          <Source kind="both" note="every slide labelled" />
        </Reveal>
      </div>

      <div className={styles.body}>
        <Reveal delay={220}>
          <Display size="headline" as="h1" className={styles.title}>
            Stop selling boxes.
            <br />
            Sell <Accent>recurring</Accent> value.
          </Display>
        </Reveal>
      </div>
    </div>
  );
}
