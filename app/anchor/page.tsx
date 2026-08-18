"use client";

import Link from "next/link";
import { SlideActiveContext } from "@/components/deck/DeckContext";
import { AnchorWordmark } from "@/components/brand/AnchorWordmark";
import { Logo } from "@/components/brand/Logo";
import { Body, Caption, Display, Kicker, Lede } from "@/components/primitives/Type";
import { Flow, FlowNode } from "@/components/primitives/Flow";
import { ExamViewer } from "@/components/product/ExamViewer";
import { BrowserFrame } from "@/components/product/Frames";
import { PATIENTS } from "@/lib/synthetic";
import styles from "./page.module.css";

const STEPS = ["Device purchase", "Anchor Free", "Daily usage", "Continuous relationship"];

/**
 * Landing do Anchor.
 *
 * Compartilha tokens, tipografia, logo e componentes com /vision — os dois
 * precisam parecer partes do mesmo sistema, porque o slide 14 embute esta
 * página dentro da apresentação.
 *
 * A fronteira comercial é a mesma do slide 13 e não pode ser afrouxada: tudo
 * que a plataforma já entrega hoje permanece no Free.
 */
export default function AnchorPage() {
  return (
    <SlideActiveContext.Provider value={true}>
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.bar}>
            <Logo width={132} />
            <Link href="/vision" className={styles.back}>
              ← 2028 Product Vision
            </Link>
          </div>

          <section className={styles.hero}>
            <AnchorWordmark size={96} />
            <Display size="display" as="h1" className={styles.heroClaim}>
              The digital home of Cardioline.
            </Display>
            <Body mute className={styles.heroNote}>
              One place for devices, exams, patients, history and clinical
              intelligence — connected from the moment a Cardioline device is
              switched on.
            </Body>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <Kicker accent>The model</Kicker>
              <Display size="headline">Software comes with the device.</Display>
            </div>
            <Flow>
              {STEPS.map((s) => (
                <FlowNode key={s} variant={s === "Anchor Free" ? "solid" : "outline"}>
                  {s}
                </FlowNode>
              ))}
            </Flow>
            <Lede mute>
              Not a limited tier. The default state of owning a Cardioline.
            </Lede>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <Kicker accent>Three layers</Kicker>
              <Display size="headline">One platform, three commitments.</Display>
            </div>
            <div className={styles.layers}>
              {[
                {
                  role: "The ecosystem layer",
                  name: "Anchor Free",
                  what: "Included with compatible Cardioline devices. Everything the platform does today stays here.",
                  weight: 1,
                },
                {
                  role: "The intelligence layer",
                  name: "Anchor Pro",
                  what: "For cardiologists who want deeper insight and greater productivity. Depth, not access.",
                  weight: 2,
                },
                {
                  role: "The organization layer",
                  name: "Anchor Enterprise",
                  what: "For hospitals and networks operating cardiology at scale. Governance, administration and service.",
                  weight: 4,
                },
              ].map((l) => (
                <div className={styles.layer} key={l.name}>
                  <span className={styles.layerRule} style={{ height: l.weight }} />
                  <span className={styles.layerRole}>{l.role}</span>
                  <span className={styles.layerName}>{l.name}</span>
                  <span className={styles.layerWhat}>{l.what}</span>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <Kicker accent>The workspace</Kicker>
              <Display size="headline">Built to be used every day.</Display>
            </div>
            <BrowserFrame url="anchor.cardioline.com" className={styles.preview}>
              <ExamViewer patient={PATIENTS[0]} seed={7} traceWidth={900} />
            </BrowserFrame>
            <Caption tone="illustrative" />
          </section>

          <footer className={styles.footer}>
            <Logo width={148} />
            <p className={styles.disclaimer}>
              Conceptual product vision prototype. Not a Cardioline product page and
              not a commercial offer. All patients, exams and traces are synthetic.
            </p>
          </footer>
        </div>
      </main>
    </SlideActiveContext.Provider>
  );
}
