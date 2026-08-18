import { Reveal } from "@/components/deck/Reveal";
import { Body, Caption, Display, Kicker } from "@/components/primitives/Type";
import { ExamViewer } from "@/components/product/ExamViewer";
import { ClinicalInsight } from "@/components/product/ClinicalInsight";
import { DeviceSync } from "@/components/product/Panels";
import { DeviceFrame } from "@/components/product/Frames";
import { PATIENTS } from "@/lib/synthetic";
import shared from "./slides.module.css";
import styles from "./S07InTheirHands.module.css";

/** O workspace clínico acompanha o cardiologista, em qualquer tela. */
export function S07InTheirHands() {
  return (
    <div className={shared.full}>
      <div className={shared.top}>
        <Reveal>
          <Kicker accent>In their hands</Kicker>
        </Reveal>
      </div>

      <div className={styles.body}>
        <div className={styles.head}>
          <Reveal delay={100}>
            <Display size="headline">Cardioline. Always within reach.</Display>
          </Reveal>
          <Reveal delay={260} className={styles.note}>
            <Body mute>
              In a clinic, a hospital, a diagnostic centre, or between appointments —
              the clinical workspace follows them.
            </Body>
          </Reveal>
        </div>

        <div className={styles.devices}>
          <Reveal delay={380}>
            <DeviceFrame kind="desktop" style={{ width: 690, height: 404 }}>
              <ExamViewer patient={PATIENTS[0]} seed={7} traceWidth={560} />
            </DeviceFrame>
          </Reveal>

          <Reveal delay={480}>
            <DeviceFrame kind="tablet" style={{ width: 340, height: 430 }}>
              <div
                style={{
                  padding: 22,
                  display: "flex",
                  flexDirection: "column",
                  gap: 26,
                  height: "100%",
                }}
              >
                <ClinicalInsight
                  label="For review"
                  title="Change since the last recording"
                  body="Lead V2 differs from the three previous exams."
                  tone="attention"
                />
                <DeviceSync device="ECG100L · Room 4" />
              </div>
            </DeviceFrame>
          </Reveal>

          <Reveal delay={580}>
            <DeviceFrame kind="phone" style={{ width: 230, height: 430 }}>
              <ExamViewer
                compact
                patient={PATIENTS[1]}
                seed={31}
                leads={["II", "V5"]}
                traceWidth={170}
                measures={[{ label: "HR", value: "72", unit: "bpm" }]}
              />
            </DeviceFrame>
          </Reveal>
        </div>

        <Caption tone="illustrative" />
      </div>
    </div>
  );
}
