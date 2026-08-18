import { Deck } from "@/components/deck/Deck";
import { Slide } from "@/components/deck/Slide";
import { SLIDES } from "@/lib/slides";
import styles from "./stub.module.css";

export default function VisionPage() {
  return (
    <Deck>
      {SLIDES.map((s) => (
        <Slide key={s.id} n={s.n} theme={s.theme} title={s.title}>
          <div className={styles.stub}>
            <span className={styles.n} data-numeric>
              {String(s.n).padStart(2, "0")}
            </span>
            <span className={styles.t}>{s.title}</span>
          </div>
        </Slide>
      ))}
    </Deck>
  );
}
