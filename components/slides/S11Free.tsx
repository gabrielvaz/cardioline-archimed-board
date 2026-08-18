import { Reveal } from "@/components/deck/Reveal";
import { Display, Kicker, Lede } from "@/components/primitives/Type";
import { Flow, FlowNode } from "@/components/primitives/Flow";
import shared from "./slides.module.css";
import styles from "./S11Free.module.css";

const STEPS = ["Device purchase", "Anchor Free", "Daily usage", "Continuous relationship"];

/**
 * O gratuito muda tudo.
 *
 * Free aqui não é um degrau limitado de freemium: é o estado padrão de possuir
 * um equipamento Cardioline. Tudo que o ECGWebApp já entrega hoje permanece no
 * plano gratuito — nada existente foi movido para trás de um pagamento.
 */
export function S11Free() {
  return (
    <div className={shared.full}>
      <div className={shared.top}>
        <Reveal>
          <Kicker accent>Free changes everything</Kicker>
        </Reveal>
      </div>

      <div className={styles.body}>
        <Reveal delay={100}>
          <Display size="display" className={styles.claim}>
            Software comes with the device.
          </Display>
        </Reveal>

        <div className={styles.steps}>
          <Reveal delay={340}>
            <Flow>
              {STEPS.map((s) => (
                <FlowNode key={s} variant={s === "Anchor Free" ? "solid" : "outline"}>
                  {s}
                </FlowNode>
              ))}
            </Flow>
          </Reveal>

          <Reveal delay={1000} className={styles.note}>
            <span className={styles.bar} aria-hidden />
            <Lede>Not a limited tier. The default state of owning a Cardioline.</Lede>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
