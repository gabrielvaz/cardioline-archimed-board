"use client";

import type { CSSProperties } from "react";
import { useSlideActive } from "@/components/deck/DeckContext";
import { Reveal } from "@/components/deck/Reveal";
import { Display, Kicker, Lede } from "@/components/primitives/Type";
import shared from "./slides.module.css";
import styles from "./S12BusinessModel.module.css";
import { asset } from "@/lib/asset";

const STEPS = [
  { label: "Device", key: false },
  { label: "Anchor Free", key: true },
  { label: "Daily workflow", key: false },
  { label: "Data & habit", key: false },
  { label: "Anchor Pro", key: true },
  { label: "Enterprise", key: true },
  { label: "More devices", key: false },
];

const CX = 320;
const CY = 258;
const R = 162;
const LABEL_R = 190;

/** Ângulo do passo i, começando no topo e girando no sentido horário. */
const angleOf = (i: number) => (i / STEPS.length) * Math.PI * 2 - Math.PI / 2;

/**
 * O flywheel.
 *
 * Hardware cria adoção, software cria relação — e a relação vende mais
 * hardware. O anel desenha uma volta completa uma única vez: o movimento
 * mostra o sentido do ciclo e para, em vez de girar como enfeite.
 */
export function S12BusinessModel() {
  const active = useSlideActive();
  const arcLength = 2 * Math.PI * R * 0.93;

  return (
    <div className={shared.full}>
      <div className={shared.top}>
        <Reveal>
          <Kicker accent>Business model</Kicker>
        </Reveal>
      </div>

      <div className={styles.body}>
        <div className={styles.left}>
          <Reveal delay={100}>
            <Display size="headline">
              Hardware creates adoption. Software creates relationship.
            </Display>
          </Reveal>
          <Reveal delay={340} className={styles.close}>
            <span className={styles.bar} aria-hidden />
            <Lede>From transactional revenue to continuous value.</Lede>
          </Reveal>
        </div>

        <Reveal delay={200} className={styles.wheelWrap}>
          <svg
            className={styles.wheel}
            viewBox="0 0 640 540"
            role="img"
            aria-label="Cycle: device, Anchor Free, daily workflow, data and habit, Anchor Pro, Enterprise, more devices"
          >
            <circle className={styles.ring} cx={CX} cy={CY} r={R} />

            <circle
              className={`${styles.arc} ${active ? styles.arcOn : ""}`}
              cx={CX}
              cy={CY}
              r={R}
              transform={`rotate(-90 ${CX} ${CY})`}
              style={{ "--arc-len": arcLength } as CSSProperties}
              pathLength={arcLength}
              strokeDasharray={`${arcLength * 0.93} ${arcLength}`}
            />

            {/* Símbolo da marca no centro, bem apagado: ancora o anel sem
                competir com os rótulos. */}
            <image
              className={styles.hubMark}
              href={asset("/brand/cardioline-symbol.svg")}
              x={CX - 44}
              y={CY - 44}
              width={88}
              height={88}
            />

            {/* Ponta da seta indicando o sentido horário, posta no vão do anel
                para não encostar no rótulo "Device". */}
            <path
              className={`${styles.head} ${active ? styles.headOn : ""}`}
              d={`M${CX - 11} ${CY - R - 10}L${CX + 6} ${CY - R}L${CX - 11} ${CY - R + 10}Z`}
              transform={`rotate(-13 ${CX} ${CY})`}
            />

            {STEPS.map((s, i) => {
              const a = angleOf(i);
              const x = CX + Math.cos(a) * R;
              const y = CY + Math.sin(a) * R;
              const lx = CX + Math.cos(a) * LABEL_R;
              const ly = CY + Math.sin(a) * LABEL_R;
              const cos = Math.cos(a);
              const anchor =
                cos > 0.25 ? "start" : cos < -0.25 ? "end" : "middle";
              const dy = Math.sin(a) > 0.6 ? 18 : Math.sin(a) < -0.6 ? -12 : 6;
              return (
                <g key={s.label}>
                  <circle
                    className={`${styles.node} ${s.key ? styles.nodeKey : ""}`}
                    cx={x}
                    cy={y}
                    r={9}
                  />
                  <text
                    className={`${styles.label} ${s.key ? styles.labelKey : ""}`}
                    x={lx}
                    y={ly + dy}
                    textAnchor={anchor}
                  >
                    {s.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </Reveal>
      </div>
    </div>
  );
}
