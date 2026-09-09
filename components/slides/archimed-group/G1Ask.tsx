import { Reveal } from "@/components/deck/Reveal";
import { Caption, Display, Kicker, Lede } from "@/components/primitives/Type";
import { BASE, FX, REVENUE, int, usdShort } from "@/lib/archimed";
import shared from "../slides.module.css";
import { Source } from "./Source";
import { Stat, StatRow } from "./Stat";
import styles from "./G1Ask.module.css";

/**
 * O pedido, no primeiro slide.
 *
 * Num board de quinze minutos que interrompe, guardar o pedido para o fim é
 * apostar que se chega ao fim. Aqui ele abre o conteúdo, logo depois da capa, e
 * os seis slides do meio são a evidência de que ele se paga. O slide 9 repete o
 * pedido com o detalhe.
 */
export function G1Ask() {
  return (
    <div className={`${shared.full} ${shared.between}`}>
      <div className={shared.top}>
        <Reveal>
          <Kicker accent>The ask</Kicker>
        </Reveal>
        <Reveal delay={80}>
          <Source kind="cardios" />
        </Reveal>
      </div>

      <div className={styles.body}>
        <Reveal delay={120}>
          <Display size="display" as="h1" className={styles.claim}>
            Fund the layer that makes the installed base recur.
          </Display>
        </Reveal>

        <Reveal delay={340} className={styles.close}>
          <span className={styles.bar} aria-hidden />
          <Lede>
            {int(BASE.entities)} clients have paid once, for hardware or a
            licence, and nothing recurring since.
          </Lede>
        </Reveal>
      </div>

      <div className={styles.foot}>
        <Reveal delay={480}>
          <StatRow>
            <Stat
              label="Hardware, last year"
              value={usdShort(REVENUE.hardwareBrl)}
              tone="mute"
              note="Management figure, not in the sales database"
            />
            <Stat
              label="Software, last year"
              value={usdShort(REVENUE.softwareBrl)}
              note={`${Math.round(REVENUE.softwareShare * 100)}% of revenue, none of it recurring. Management figure`}
            />
            <Stat
              label="Recurring revenue today"
              value="Zero"
              tone="accent"
              note="Every licence is a one-time payment with lifetime use"
            />
          </StatRow>
        </Reveal>
        <Reveal delay={620}>
          <Caption>
            Revenue figures are {REVENUE.source}, for the Brazil operation.
            They are not in the sales database, which carries no prices.
            Everything after this slide is measured on the sales database and
            the CardioNet portal, except where marked as an assumption or as a
            management figure.{" "}
          Converted at {FX.label}.
        </Caption>
        </Reveal>
      </div>
    </div>
  );
}
