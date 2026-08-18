import { Reveal } from "@/components/deck/Reveal";
import { Display, Kicker } from "@/components/primitives/Type";
import shared from "./slides.module.css";
import styles from "./S13ThreeLayers.module.css";

/**
 * Os três layers.
 *
 * Sem preços, por decisão do briefing.
 *
 * A fronteira comercial é deliberada e não pode ser afrouxada: tudo que o
 * ECGWebApp já entrega hoje — multi-site, gestão de usuários com permissões,
 * integração PACS/EMR/HIS — permanece no Free. O Enterprise se diferencia por
 * escala, administração centralizada, governança e serviço, nunca por bloquear
 * o que o cliente já tinha.
 */
const LAYERS = [
  {
    name: "Anchor Free",
    role: "The ecosystem layer",
    what: "Included with compatible Cardioline devices.",
    foot: "Everything the platform does today",
    weight: 1,
  },
  {
    name: "Anchor Pro",
    role: "The intelligence layer",
    what: "For cardiologists who want deeper insight and greater productivity.",
    foot: "Depth, not access",
    weight: 2,
  },
  {
    name: "Anchor Enterprise",
    role: "The organization layer",
    what: "For hospitals and networks operating cardiology at scale.",
    foot: "Scale, governance, service",
    weight: 4,
  },
];

export function S13ThreeLayers() {
  return (
    <div className={shared.full}>
      <div className={shared.top}>
        <Reveal>
          <Kicker accent>Three layers</Kicker>
        </Reveal>
      </div>

      <div className={styles.body}>
        {LAYERS.map((l, i) => (
          <Reveal key={l.name} delay={140 + i * 200} className={styles.col}>
            <span className={styles.rule} style={{ height: l.weight }} aria-hidden />
            <span className={styles.role}>{l.role}</span>
            <Display size="subhead" as="div" className={styles.name}>
              {l.name}
            </Display>
            <span className={styles.what}>{l.what}</span>
            <span className={styles.foot}>{l.foot}</span>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
