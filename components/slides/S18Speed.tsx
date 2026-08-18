import { Reveal } from "@/components/deck/Reveal";
import { Display, Kicker } from "@/components/primitives/Type";
import shared from "./slides.module.css";
import styles from "./S18Speed.module.css";

const STEPS = ["Find patient", "Review", "Compare", "Understand", "Report"];

// Deslocamentos fixos: a bagunça é desenhada, não sorteada, para o slide ser
// idêntico em toda apresentação.
const WINDOWS = [
  [0, 4, -3], [124, 0, 2], [248, 14, -1.5], [40, 46, 1.8],
  [166, 40, -2.4], [290, 56, 1.2], [12, 90, 2.6], [138, 84, -1],
  [268, 98, 2], [58, 128, -2.2], [186, 124, 1.4], [306, 140, -1.8],
];

/** Doze sistemas contra um. A assimetria visual é o argumento inteiro. */
export function S18Speed() {
  return (
    <div className={shared.full}>
      <div className={shared.top}>
        <Reveal>
          <Kicker accent>Speed</Kicker>
        </Reveal>
      </div>

      <div className={styles.body}>
        <Reveal delay={100}>
          <Display size="headline">More insight. Less work.</Display>
        </Reveal>

        <div className={styles.split}>
          <Reveal delay={280} className={styles.side}>
            <Kicker>Before</Kicker>
            <div className={styles.mess} aria-hidden>
              {WINDOWS.map(([x, y, r], i) => (
                <div
                  key={i}
                  className={styles.win}
                  style={{ left: x, top: y, transform: `rotate(${r}deg)` }}
                >
                  <div className={styles.winBar} />
                </div>
              ))}
            </div>
            <span className={styles.legend}>
              Twelve systems. Multiple screens. Manual comparison. Manual reports.
            </span>
          </Reveal>

          <Reveal delay={560} className={styles.side}>
            <Kicker accent>After</Kicker>
            <div className={styles.one}>
              <div className={styles.oneFrame}>
                <div className={styles.oneBar}>One Cardioline workspace</div>
                <div className={styles.oneSteps}>
                  {STEPS.map((s, i) => (
                    <span key={s} style={{ display: "contents" }}>
                      <span className={styles.step}>{s}</span>
                      {i < STEPS.length - 1 && (
                        <span className={styles.sep} aria-hidden>
                          →
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <span className={styles.legend}>
              One place. One history. One report.
            </span>
          </Reveal>
        </div>

        <Reveal delay={900} className={styles.close}>
          <span className={styles.bar} aria-hidden />
          <Display size="subhead">Seconds instead of minutes.</Display>
        </Reveal>
      </div>
    </div>
  );
}
