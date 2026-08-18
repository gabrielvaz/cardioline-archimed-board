"use client";

import { SlideActiveContext } from "@/components/deck/DeckContext";
import { Logo, Symbol } from "@/components/brand/Logo";
import { AnchorWordmark } from "@/components/brand/AnchorWordmark";
import { Body, Caption, Display, Kicker, Lede, Accent } from "@/components/primitives/Type";
import { Flow, FlowNode } from "@/components/primitives/Flow";
import { Rule } from "@/components/primitives/Rule";
import { EcgTrace } from "@/components/product/EcgTrace";
import { ExamViewer } from "@/components/product/ExamViewer";
import { BrowserFrame, DeviceFrame } from "@/components/product/Frames";
import { PatientTimeline } from "@/components/product/PatientTimeline";
import { ClinicalInsight } from "@/components/product/ClinicalInsight";
import { RiskTrend } from "@/components/product/RiskTrend";
import { ExamComparison, ReportComposer, DeviceSync } from "@/components/product/Panels";
import { LONGITUDINAL, PATIENTS } from "@/lib/synthetic";

export default function Gallery() {
  return (
    // A galeria força o estado "slide ativo" para os componentes aparecerem
    // no estado final, em vez de esperarem uma entrada que nunca vem.
    <SlideActiveContext.Provider value={true}>
      <main style={{ padding: 64, display: "grid", gap: 56, background: "#fff" }}>
      <section style={{ display: "flex", gap: 48, alignItems: "center" }}>
        <Logo width={220} />
        <Symbol size={72} />
        <AnchorWordmark />
      </section>
      <Rule />
      <section style={{ display: "grid", gap: 20 }}>
        <Kicker accent>Kicker with accent rule</Kicker>
        <Display size="hero">The future of cardiology</Display>
        <Display size="display">
          is not another device. <Accent>It&rsquo;s intelligence.</Accent>
        </Display>
        <Display size="headline">More than 60 years inside cardiology.</Display>
        <Display size="subhead">From a device company to a cardiology platform.</Display>
        <Lede>Powerful without feeling complicated.</Lede>
        <Body mute>
          Whether in a clinic, hospital or diagnostic center, the clinical workspace
          follows the cardiologist.
        </Body>
        <Caption tone="conceptual" />
      </section>
      <Rule />
      <section>
        <EcgTrace width={1200} height={120} beats={9} seed={11} />
      </section>
      <Rule />
      <section>
        <Flow>
          <FlowNode>Device purchase</FlowNode>
          <FlowNode>Anchor Free</FlowNode>
          <FlowNode variant="solid">Daily usage</FlowNode>
          <FlowNode variant="tinted">Continuous relationship</FlowNode>
        </Flow>
      </section>
      <Rule />
      <section style={{ display: "flex", gap: 40, alignItems: "flex-start" }}>
        <BrowserFrame url="anchor.cardioline.com" style={{ width: 900, height: 420 }}>
          <ExamViewer patient={PATIENTS[0]} seed={7} traceWidth={700} />
        </BrowserFrame>
        <DeviceFrame kind="phone" style={{ width: 260, height: 420 }}>
          <ExamViewer
            compact
            patient={PATIENTS[1]}
            seed={31}
            leads={["II", "V5"]}
            traceWidth={200}
            traceHeight={60}
            measures={[{ label: "HR", value: "72", unit: "bpm" }]}
          />
        </DeviceFrame>
      </section>
      <Rule />
      <section style={{ display: "grid", gap: 40 }}>
        <PatientTimeline entries={LONGITUDINAL} />
        <div style={{ display: "flex", gap: 28, alignItems: "flex-start" }}>
          <ClinicalInsight
            title="T-wave morphology differs from 2030"
            body="Lead V2 shows a change not present in the two prior recordings. Flagged for your review."
            tone="attention"
          />
          <DeviceSync device="ECG100L · Room 4" />
        </div>
        <div style={{ display: "flex", gap: 28, alignItems: "flex-start" }}>
          <ExamComparison
            traceWidth={520}
            rows={[
              { when: "18 Nov 2030", kind: "12-lead ECG", seed: 5 },
              { when: "14 Mar 2031", kind: "12-lead ECG", seed: 5, anomalyAt: 3 },
            ]}
            delta="Change detected in lead V2 — surfaced for review"
          />
          <ReportComposer
            sections={[
              { name: "Findings", lines: [100, 88, 64] },
              { name: "Comparison", lines: [92, 70] },
            ]}
          />
        </div>
        <RiskTrend />
      </section>
      </main>
    </SlideActiveContext.Provider>
  );
}
