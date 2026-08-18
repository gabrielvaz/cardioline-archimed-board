import Image from "next/image";
import { Reveal } from "@/components/deck/Reveal";
import { Body, Display, Kicker } from "@/components/primitives/Type";
import { Flow } from "@/components/primitives/Flow";
import shared from "./slides.module.css";
import styles from "./S09DigitalLayer.module.css";

/**
 * A camada digital.
 *
 * O equipamento no topo é a foto real do ECG100L, não uma ilustração: o
 * argumento é justamente que a porta de entrada é o hardware que já existe.
 */
export function S09DigitalLayer() {
  return (
    <div className={shared.full}>
      <div className={shared.top}>
        <Reveal>
          <Kicker accent>The digital layer</Kicker>
        </Reveal>
      </div>

      <div className={styles.body}>
        <div className={styles.left}>
          <Reveal delay={100}>
            <Display size="headline">Every Cardioline device becomes a doorway.</Display>
          </Reveal>
          <Reveal delay={300}>
            <Body mute>
              The relationship doesn&rsquo;t end when the device ships. It starts there.
            </Body>
          </Reveal>
        </div>

        <div className={styles.chain}>
          <Reveal delay={220} className={styles.device}>
            <Image
              src="/product/ecg100l-cover-02.png"
              alt="Cardioline ECG100L"
              width={660}
              height={495}
              className={styles.photo}
              priority
            />
          </Reveal>

          <Flow direction="column">
            <span className={`${styles.step} ${styles.anchor}`}>Anchor</span>
            <span className={styles.step}>Patient</span>
            <span className={styles.step}>Clinical intelligence</span>
          </Flow>
        </div>
      </div>
    </div>
  );
}
