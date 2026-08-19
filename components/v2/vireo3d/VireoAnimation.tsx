"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createVireoScene, fitToElement } from "./scene";
import {
  MODULE_TRAVEL,
  SCROLL_LENGTH,
  STAGES,
  TURNS,
  easeInOut,
  localProgress,
  stageAt,
  type StageKey,
} from "./stages";
import styles from "./VireoAnimation.module.css";

gsap.registerPlugin(ScrollTrigger);

/**
 * Animação do VIREO AM conduzida pela rolagem, em 3D real.
 *
 * A rotação é rotação: o modelo gira em torno do próprio eixo, em ângulos
 * contínuos. Não há sequência de frames — nada de salto entre imagens nem
 * megabytes de assets.
 *
 * A rolagem é o parâmetro (ScrollTrigger em scrub), então avançar e voltar
 * percorre a transformação nos dois sentidos. Renderiza sob demanda, só quando o
 * progresso muda: parado, não queima frame.
 */
export function VireoAnimation() {
  const section = useRef<HTMLElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState<StageKey>("hold");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = host.current;
    const sec = section.current;
    if (!el || !sec) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    renderer.setClearColor(0xffffff, 1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.98;
    el.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";

    let disposed = false;
    let trigger: ScrollTrigger | null = null;
    let cleanupResize: (() => void) | null = null;

    createVireoScene(renderer).then((v) => {
      if (disposed) {
        renderer.dispose();
        return;
      }
      fitToElement(renderer, v.camera, el);
      setReady(true);

      const setOpacity = (mats: THREE.Material[], value: number) => {
        for (const m of mats) {
          m.transparent = value < 0.999;
          m.opacity = value;
        }
      };

      const apply = (progress: number) => {
        const s = stageAt(progress);
        const t = easeInOut(localProgress(progress, s));

        // Estado de cada etapa, escrito como switch e não como timeline do GSAP:
        // cada etapa depende só do próprio progresso local, então fica mais fácil
        // de ler e de reordenar em stages.ts.
        let cableY = v.dockedY;
        let cableOpacity = 1;
        let airY = v.dockedY - MODULE_TRAVEL;
        let airOpacity = 0;
        let yaw = 0;
        let lit = 1;

        switch (s.key) {
          case "hold":
            break;
          case "undock":
            cableY = v.dockedY - MODULE_TRAVEL * t;
            cableOpacity = 1 - Math.max(0, (t - 0.72) / 0.28);
            break;
          case "rotate":
            cableOpacity = 0;
            cableY = v.dockedY - MODULE_TRAVEL;
            yaw = Math.PI * 2 * TURNS * t;
            // A tela apaga na saída da frente e não volta: o aparelho está sem
            // módulo de aquisição, e uma tela acesa ali seria mentira.
            lit = 1 - Math.min(1, t / 0.22);
            break;
          case "dock":
            cableOpacity = 0;
            cableY = v.dockedY - MODULE_TRAVEL;
            airOpacity = Math.min(1, t / 0.22);
            airY = v.dockedY - MODULE_TRAVEL * (1 - t);
            lit = 0;
            break;
          case "power":
            cableOpacity = 0;
            cableY = v.dockedY - MODULE_TRAVEL;
            airOpacity = 1;
            airY = v.dockedY;
            lit = t;
            break;
        }

        v.pivot.rotation.y = yaw;
        v.cable.group.position.y = cableY;
        v.air.group.position.y = airY;
        setOpacity(v.cable.fades, cableOpacity);
        setOpacity(v.air.fades, airOpacity);
        v.device.screen.material.opacity = lit;
        v.cable.group.visible = cableOpacity > 0.01;
        v.air.group.visible = airOpacity > 0.01;

        renderer.render(v.scene, v.camera);

        /*
         * Estado aplicado, exposto no DOM. O canvas é WebGL, então não há como
         * ler um pixel de fora com getContext("2d"); estes atributos deixam a
         * animação verificável por medição, e não só por inspeção visual.
         */
        el.dataset.progress = progress.toFixed(4);
        el.dataset.stage = s.key;
        el.dataset.yaw = ((yaw * 180) / Math.PI).toFixed(1);
        el.dataset.cableY = cableY.toFixed(3);
        el.dataset.airY = airY.toFixed(3);
        el.dataset.lit = lit.toFixed(3);

        setStage((prev) => (prev === s.key ? prev : s.key));
      };

      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reduce) {
        // Sem movimento: estado final, montado com o Air e a tela acesa.
        apply(1);
      } else {
        apply(0);
        trigger = ScrollTrigger.create({
          trigger: sec,
          start: "top top",
          end: `+=${SCROLL_LENGTH * 100}%`,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => apply(self.progress),
        });
      }

      const onResize = () => {
        fitToElement(renderer, v.camera, el);
        apply(trigger ? trigger.progress : reduce ? 1 : 0);
      };
      window.addEventListener("resize", onResize);
      el.dataset.ready = "1";
      cleanupResize = () => window.removeEventListener("resize", onResize);
    });

    return () => {
      disposed = true;
      cleanupResize?.();
      trigger?.kill();
      renderer.dispose();
      el.replaceChildren();
    };
  }, []);

  const caption = STAGES.find((s) => s.key === stage)?.caption ?? null;

  return (
    <section ref={section} className={styles.section} id="vireo-animation">
      <div className={styles.viewport}>
        <div ref={host} className={styles.stage} />

        <div className={`${styles.caption} ${caption ? styles.captionOn : ""}`}>
          {caption ? (
            <>
              <p className={styles.captionTitle}>{caption.title}</p>
              <p className={styles.captionBody}>{caption.body}</p>
            </>
          ) : null}
        </div>

        <div className={styles.rail} aria-hidden>
          {STAGES.map((s) => (
            <span
              key={s.key}
              className={`${styles.tick} ${s.key === stage ? styles.tickOn : ""}`}
            />
          ))}
        </div>

        {!ready ? <p className={styles.loading}>Loading</p> : null}
      </div>
    </section>
  );
}
