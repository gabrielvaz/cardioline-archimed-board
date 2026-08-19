import Image from "next/image";
import { VireoAnimation } from "@/components/v2/vireo3d/VireoAnimation";
import styles from "./page.module.css";
import { asset } from "@/lib/asset";

export const metadata = { title: "VIREO AM · Showcase" };

/**
 * Rota independente da landing, de propósito.
 *
 * A animação é desenvolvida e julgada aqui, isolada, e depois movida para dentro da
 * v2 quando aprovada. Assim a landing não fica instável durante o ajuste.
 */
export default function Showcase() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Image
          src={asset("/brand/cardioline-logo.svg")}
          alt="Cardioline"
          width={600}
          height={38}
          priority
          className={styles.logo}
        />
        <p className={styles.kicker}>VIREO AM · scroll to transform</p>
      </header>

      <VireoAnimation />

      <footer className={styles.footer}>
        <p className={styles.note}>
          Modelo 3D construído por extrusão da silhueta traçada dos renders
          ortográficos oficiais da Cardioline. Protótipo de Product Design para
          discussão interna.
        </p>
      </footer>
    </div>
  );
}
