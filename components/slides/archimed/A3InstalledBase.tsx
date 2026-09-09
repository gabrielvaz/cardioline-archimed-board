import { Reveal } from "@/components/deck/Reveal";
import { Caption, Display, Kicker } from "@/components/primitives/Type";
import { BASE, EXAMS, int } from "@/lib/archimed";
import shared from "../slides.module.css";
import { Stat, StatRow } from "./Stat";
import styles from "./A3InstalledBase.module.css";

/**
 * A base instalada como ativo.
 *
 * Aqui o slide para no tamanho e no volume: quem está dentro e quanto exame
 * passa por eles. A concentração vem no slide 6, medida em exames, porque medi-la
 * em aparelhos dava um recorte errado: 498 entidades pareciam centrais e, por
 * volume de exame, acima de 1.500 por mês existem 9.
 *
 * O título dizia "we just never charged for it", e estava errado de um jeito que
 * enfraquecia o pedido: sugeria que basta emitir fatura. Não basta. O ativo é a
 * base; o que não existe é um motivo para pagar todo mês, e construí-lo é
 * exatamente o que os slides 7 a 10 pedem orçamento para fazer. Um board que sai
 * deste slide pensando "então só cobrem" não aprova investimento nenhum.
 */
export function A3InstalledBase() {
  return (
    <div className={`${shared.full} ${shared.between}`}>
      <div className={shared.top}>
        <Reveal>
          <Kicker accent>Installed base</Kicker>
        </Reveal>
      </div>

      <div className={styles.body}>
        <Reveal delay={100}>
          <Display size="headline" className={styles.claim}>
            The clients are already ours. The reason to pay monthly is not.
          </Display>
        </Reveal>

        <Reveal delay={280}>
          <StatRow>
            <Stat
              label="Client entities"
              value={int(BASE.entities)}
              note="With at least one purchase since 1991"
            />
            <Stat
              label="Active in 24 months"
              value={int(BASE.active)}
              note="Bought in the last 24 months. Not the same set as the accounts sending exams; see the next slide."
            />
            <Stat
              label="Devices bought in 10 years"
              value={int(BASE.devices)}
              note={`By those active clients. Not the whole park: ${int(BASE.devicesEverSold)} were sold since 1991, and the ten-year cut leaves the oldest recorders out.`}
            />
          </StatRow>
        </Reveal>
      </div>

      <div className={styles.foot}>
        <Reveal delay={460} className={styles.punch}>
          <span className={styles.bar} aria-hidden />
          <p className={styles.punchText}>
            <strong>{int(EXAMS.perMonthTotal)} exams a month</strong> run through
            that fleet, counted one by one in the portal, {int(EXAMS.lifetime)} of
            them on record. Nobody pays anything recurring for the software that
            moves them, and the next two slides are about who those exams belong
            to.
          </p>
        </Reveal>
        <Reveal delay={580}>
          <Caption>
            Source: Cardios sales database, {int(BASE.serials)} sales records
            between January 1991 and September 2026. Client means legal entity,
            with branches consolidated, and four reseller entities are out of
            every count on this deck. Exam volume is measured in the CardioNet
            portal, {EXAMS.windowLabel}; see slide 6.
          </Caption>
        </Reveal>
      </div>
    </div>
  );
}
