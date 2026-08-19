import { VireoAnimation } from "@/components/v2/vireo3d/VireoAnimation";
import { DEVICE } from "@/lib/v2/copy";
import styles from "./Sections.module.css";
import own from "./DeviceShowcase.module.css";

/**
 * A seção do aparelho na landing: cabeçalho normal, e em seguida o VIREO AM em 3D
 * conduzido pela rolagem.
 *
 * O cabeçalho fica FORA da seção fixada, então ele rola e sai como qualquer outro
 * texto; a animação prende só a si mesma quando encosta no topo. Colocar o
 * cabeçalho dentro do trecho fixado o deixaria congelado durante toda a
 * transformação, competindo com as legendas de etapa.
 *
 * Substitui o trilho lateral com o render 2D: o aparelho de verdade gira, o módulo
 * de verdade encaixa, e não há mais duas representações do mesmo produto na página.
 */
export function DeviceShowcase() {
  return (
    <>
      <section id="device" className={`${styles.section} ${own.tight}`}>
        <p className={styles.kicker}>It starts with your device</p>
        <div className={styles.head}>
          <h2 className={styles.h2}>
            One dock. Two modules. The same record either way.
          </h2>
        </div>
        <p className={styles.lede}>
          {DEVICE.name} acquires twelve leads in the hand and hands the exam to
          Anchor. Scroll to take it apart.
        </p>
      </section>
      <VireoAnimation />
    </>
  );
}
