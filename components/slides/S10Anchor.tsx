import { AnchorWordmark } from "@/components/brand/AnchorWordmark";
import { Reveal } from "@/components/deck/Reveal";
import { Display, Kicker, Lede } from "@/components/primitives/Type";
import { Flow, FlowNode } from "@/components/primitives/Flow";
import shared from "./slides.module.css";
import styles from "./S10Anchor.module.css";

const CHAIN = ["Devices", "Anchor", "Exams", "Patients", "Reports", "Intelligence"];

/** Anchor como a camada digital que liga o ecossistema. */
export function S10Anchor() {
  return (
    <div className={shared.full}>
      <div className={shared.top}>
        <Reveal>
          <Kicker accent>Anchor</Kicker>
        </Reveal>
      </div>

      <div className={styles.body}>
        <div className={styles.head}>
          <Reveal delay={100}>
            <Display size="headline" className={styles.claim}>
              Anchor becomes the digital home of Cardioline.
            </Display>
          </Reveal>
          <Reveal delay={300}>
            <AnchorWordmark size={86} />
          </Reveal>
        </div>

        <div className={styles.chainWrap}>
          <Reveal delay={480}>
            <Flow>
              {CHAIN.map((c) => (
                <FlowNode key={c} variant={c === "Anchor" ? "solid" : "outline"}>
                  {c}
                </FlowNode>
              ))}
            </Flow>
          </Reveal>
          <Reveal delay={1100}>
            <Lede mute>The digital layer connecting the Cardioline ecosystem.</Lede>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
