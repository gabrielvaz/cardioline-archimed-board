import { Reveal } from "@/components/deck/Reveal";
import { Display, Kicker } from "@/components/primitives/Type";
import shared from "./slides.module.css";
import styles from "./S21MustBeTrue.module.css";

const PILLARS = [
  { name: "Product", what: "World-class experiences." },
  { name: "Design", what: "Radical simplicity." },
  { name: "Data", what: "One longitudinal cardiac record." },
  { name: "AI", what: "Deep clinical intelligence." },
  { name: "Platform", what: "One ecosystem across devices." },
  { name: "Organization", what: "Product thinking throughout Cardioline." },
];

export function S21MustBeTrue() {
  return (
    <div className={shared.full}>
      <div className={shared.top}>
        <Reveal>
          <Kicker accent>What must be true</Kicker>
        </Reveal>
      </div>

      <div className={styles.body}>
        <Reveal delay={100}>
          <Display size="headline">To earn that position, everything changes.</Display>
        </Reveal>

        <div className={styles.grid}>
          {PILLARS.map((p, i) => (
            <Reveal key={p.name} delay={280 + i * 120} className={styles.cell}>
              <span className={styles.num} data-numeric>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={styles.name}>{p.name}</span>
              <span className={styles.what}>{p.what}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
