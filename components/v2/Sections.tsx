import { EcgTrace } from "@/components/product/EcgTrace";
import {
  AI_NOTE,
  DEVICE,
  HERO,
  LADDER,
  PROTOTYPE_NOTICE,
  SURFACES,
} from "@/lib/v2/copy";
import styles from "./Sections.module.css";

const MARKS = [styles.markFree, styles.markPro, styles.markEnterprise];

/** Três superfícies, e o aparelho real que abre a primeira delas. */
export function Surfaces() {
  return (
    <section id="surfaces" className={styles.section}>
      <p className={styles.kicker}>One workspace, three surfaces</p>
      <div className={styles.head}>
        <h2 className={styles.h2}>The exam follows the work, not the room.</h2>
      </div>
      <p className={styles.lede}>
        Acquisition happens at the bedside, reading happens at a desk, and the
        signature often happens somewhere else entirely. Anchor is the same
        record in all three places.
      </p>

      <ul className={styles.surfaces}>
        {SURFACES.map((s) => (
          <li key={s.label} className={styles.surface}>
            <p className={styles.surfaceLabel}>{s.label}</p>
            <p className={styles.surfaceBody}>{s.body}</p>
          </li>
        ))}
      </ul>

      {/* Sem foto do aparelho aqui: ele já aparece em 3D na seção anterior, e as
          duas juntas eram a mesma coisa duas vezes — com o agravante de o render
          antigo ser cinza técnico, enquanto o 3D usa as cores das fotos. */}
      <div className={styles.deviceCard}>
        <h3 className={styles.h3}>{DEVICE.name}</h3>
        <p className={styles.lede}>{DEVICE.blurb}</p>
      </div>
      <div className={styles.specs}>
        {[
          ["Acquisition", "12-lead resting ECG"],
          ["On-screen guidance", "Electrode placement C1 to C6"],
          ["Transmission", `${DEVICE.module} module, wireless`],
          ["Opens in", "Anchor, no installation"],
        ].map(([k, v]) => (
          <div key={k} className={styles.spec}>
            <p className={styles.specK}>{k}</p>
            <p className={styles.specV}>{v}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * A escada. Fecha o argumento do desbloqueio apontando para cima em vez de
 * declarar gratuidade: o degrau incluído é o começo, não o fim.
 */
export function Ladder() {
  return (
    <section id="platform" className={styles.section}>
      <p className={styles.kicker}>Hardware opens software</p>
      <div className={styles.head}>
        <h2 className={styles.h2}>
          Included with your device. Extended when you need it.
        </h2>
      </div>

      <div className={styles.ladder}>
        {LADDER.map((rung, i) => (
          <div key={rung.plan} className={styles.rung}>
            <div>
              <span aria-hidden className={`${styles.mark} ${MARKS[i]}`} />
              <p className={styles.when}>{rung.when}</p>
              <p className={styles.plan}>{rung.plan}</p>
            </div>
            <p className={styles.rungBody}>{rung.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/** O que o Pro entrega: a diferença medida entre dois exames do mesmo paciente. */
export function Comparison() {
  const strips = [
    {
      label: "Previous, June 2024",
      seed: 1907,
      anomalyAt: undefined,
      dim: true,
    },
    { label: "Current, today", seed: 4211, anomalyAt: 4, dim: false },
  ];

  return (
    <section id="pricing" className={styles.section}>
      <p className={styles.kicker}>Anchor Pro</p>
      <div className={styles.head}>
        <h2 className={styles.h2}>For the cardiologist behind the report.</h2>
      </div>
      <p className={styles.lede}>
        The base workspace organises the work. Pro is about the minutes spent
        reading and writing, and about what the previous exam already told you.
      </p>

      <div className={styles.compare}>
        <div>
          {strips.map((s) => (
            <div key={s.label} className={styles.strip}>
              <div className={styles.stripHead}>
                <span className={s.dim ? undefined : styles.stripNow}>
                  {s.label}
                </span>
                <span>Lead V5</span>
              </div>
              <div className={`${styles.stripBox} ${s.dim ? styles.dim : ""}`}>
                <div className={styles.paper} />
                <EcgTrace
                  className={styles.stripSvg}
                  fluid
                  width={760}
                  height={192}
                  beats={9}
                  seed={s.seed}
                  amplitude={0.74}
                  anomalyAt={s.anomalyAt}
                  stroke="var(--cl-ink)"
                  strokeWidth={2.2}
                />
              </div>
            </div>
          ))}
        </div>

        <div className={styles.deltas}>
          <p className={styles.deltaHead}>Change since previous exam</p>
          {[
            ["Heart rate", "+15 bpm"],
            ["QTc", "+16 ms"],
            ["ST segment", "New depression"],
            ["Interval", "14 months"],
          ].map(([k, v]) => (
            <div key={k} className={styles.deltaRow}>
              <span className={styles.deltaK}>{k}</span>
              <span className={styles.deltaV}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      <p className={styles.note}>{AI_NOTE}</p>
    </section>
  );
}

export function Close() {
  return (
    <>
      <section className={styles.close}>
        <h2 className={styles.closeTitle}>
          Connect the device you already trust.
        </h2>
        <div className={styles.closeActions}>
          <a href="#top" className={styles.cta}>
            {HERO.primary}
          </a>
          <a href="#platform" className={styles.textLink}>
            Compare the plans <span aria-hidden>&rsaquo;</span>
          </a>
        </div>
      </section>
      <footer className={styles.footer}>
        <p className={styles.footerNote}>{PROTOTYPE_NOTICE}</p>
      </footer>
    </>
  );
}
