"use client";

import { useSlideActive } from "@/components/deck/DeckContext";
import { Reveal } from "@/components/deck/Reveal";
import { Caption, Display, Kicker } from "@/components/primitives/Type";
import { EcgTrace } from "@/components/product/EcgTrace";
import shared from "./slides.module.css";
import styles from "./S16Depth.module.css";

/** Camadas de leitura sobre um único traçado. Tudo conceitual. */
const LAYERS = [
  { x: 0.1, above: true, label: "Subtle morphology change" },
  { x: 0.27, above: false, label: "Comparison with previous exam" },
  { x: 0.43, above: true, label: "Longitudinal variation" },
  { x: 0.59, above: false, label: "Medication context" },
  { x: 0.75, above: true, label: "Historical abnormalities" },
  { x: 0.91, above: false, label: "Patient risk profile" },
];

const W = 1360;
const TRACE_TOP = 140;
const TRACE_H = 150;
const MID = TRACE_TOP + TRACE_H / 2;

/**
 * Profundidade.
 *
 * Um traçado só, lido por camadas. As chamadas não afirmam achado nenhum —
 * nomeiam o tipo de leitura que o sistema faz e entrega ao profissional.
 */
export function S16Depth() {
  const active = useSlideActive();

  return (
    <div className={shared.full}>
      <div className={shared.top}>
        <Reveal>
          <Kicker accent>Depth</Kicker>
        </Reveal>
      </div>

      <div className={styles.body}>
        <Reveal delay={100}>
          <Display size="headline">See what would otherwise be missed.</Display>
        </Reveal>

        <div className={styles.scene}>
          <div className={styles.traceLayer}>
            <EcgTrace
              width={W}
              height={TRACE_H - 20}
              beats={11}
              seed={860}
              amplitude={0.78}
              noise={0.14}
              anomalyAt={7}
              strokeWidth={2}
              draw
              drawDuration={2000}
              delay={300}
            />
          </div>

          <svg className={styles.leaders} viewBox={`0 0 ${W} 430`} aria-hidden>
            {LAYERS.map((l) => {
              const x = l.x * W;
              const y2 = l.above ? 108 : 322;
              return (
                <g key={l.label}>
                  <line className={styles.leader} x1={x} y1={MID} x2={x} y2={y2} />
                  <circle className={styles.dot} cx={x} cy={MID} r={5} />
                </g>
              );
            })}
          </svg>

          {LAYERS.map((l, i) => (
            <Reveal
              key={l.label}
              delay={1400 + i * 200}
              className={`${styles.note} ${l.above ? styles.noteAbove : styles.noteBelow}`}
              style={{
                left: Math.min(W - 110, Math.max(110, l.x * W)),
                top: l.above ? 100 : 330,
              }}
            >
              {l.label}
            </Reveal>
          ))}
        </div>

        <Reveal delay={2700}>
          <Caption tone="conceptual" />
        </Reveal>
      </div>
    </div>
  );
}
