"use client";

import { useSlideActive } from "@/components/deck/DeckContext";
import { Reveal } from "@/components/deck/Reveal";
import { Caption, Display, Kicker } from "@/components/primitives/Type";
import shared from "./slides.module.css";
import styles from "./S19Invisible.module.css";

const SUBSTRATE = [
  "AI models", "Longitudinal data", "Devices", "Signal algorithms", "Cloud",
  "Interoperability", "HL7 FHIR", "DICOM", "Access control", "Audit trail",
  "MDR", "GDPR", "Device registry", "Sync", "Versioning", "Encryption",
];

/**
 * Complexidade invisível.
 *
 * O substrato sobe até ficar bem visível e depois recua para quase nada,
 * enquanto o cartão simples permanece. A animação é a tese do slide: a
 * complexidade não desaparece, ela deixa de ser problema de quem usa.
 */
export function S19Invisible() {
  const active = useSlideActive();

  return (
    <div className={shared.full}>
      <div className={shared.top}>
        <Reveal>
          <Kicker accent>Invisible complexity</Kicker>
        </Reveal>
      </div>

      <div className={styles.body}>
        <div className={styles.heads}>
          <Reveal delay={100}>
            <Display size="headline">The technology gets more sophisticated.</Display>
          </Reveal>
          <Reveal delay={420}>
            <Display size="headline" className={styles.second}>
              The experience gets simpler.
            </Display>
          </Reveal>
        </div>

        <div className={styles.scene}>
          <div
            className={`${styles.substrate} ${active ? styles.substrateOn : ""}`}
            data-layer="behind"
            aria-hidden
          >
            {SUBSTRATE.map((s) => (
              <span key={s} className={styles.chip}>
                {s}
              </span>
            ))}
          </div>

          <Reveal delay={900} className={styles.card}>
            <span className={styles.cardLabel}>Today</span>
            <span className={styles.cardText}>
              Nothing has changed since the last recording.
            </span>
            <span className={styles.cardMeta}>
              <span className={styles.cardNumber} data-numeric>
                3
              </span>
              exams compared
            </span>
          </Reveal>
        </div>

        <Caption tone="illustrative" />
      </div>
    </div>
  );
}
