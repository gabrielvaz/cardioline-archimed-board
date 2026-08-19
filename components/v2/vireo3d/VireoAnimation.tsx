"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createVireoScene, fitToElement } from "./scene";
import {
  LED_BLINK_HZ,
  LED_BLINK_UNTIL,
  MODULE_EXIT,
  SCROLL_LENGTH,
  STAGES,
  TURNS,
  easeIn,
  easeInOut,
  easeOut,
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
    let stopAnimation: (() => void) | null = null;

    createVireoScene(renderer).then((v) => {
      if (disposed) {
        renderer.dispose();
        return;
      }
      fitToElement(renderer, v.camera, el);
      setReady(true);

      /*
       * Estado do LED do botão. É uma LUZ no aparelho, não um adesivo: acesa
       * enquanto o módulo de aquisição está no lugar, apagada com o aparelho
       * desmontado, e PISCANDO no instante em que o módulo novo encaixa.
       */
      type Led = "off" | "blink" | "on";

      const apply = (progress: number, clockMs: number) => {
        const s = stageAt(progress);
        const t = localProgress(progress, s);

        // Estado de cada etapa, escrito como switch e não como timeline do GSAP:
        // cada etapa depende só do próprio progresso local, então fica mais fácil
        // de ler e de reordenar em stages.ts.
        let cableY = v.dockedY;
        let airY = v.dockedY - MODULE_EXIT;
        let yaw = 0;
        let lit = 1;
        let led: Led = "on";

        switch (s.key) {
          case "hold":
            break;
          case "undock":
            // Sai de cena descendo, sem esmaecer. easeIn deixa a separação do
            // encaixe visível antes de o módulo ganhar velocidade e deixar o
            // quadro — antes ele simplesmente desaparecia no meio do caminho.
            cableY = v.dockedY - MODULE_EXIT * easeIn(t);
            led = t < 0.25 ? "on" : "off";
            break;
          case "rotate":
            cableY = v.dockedY - MODULE_EXIT;
            yaw = Math.PI * 2 * TURNS * easeInOut(t);
            // A tela apaga na saída da frente e não volta: o aparelho está sem
            // módulo de aquisição, e uma tela acesa ali seria mentira.
            lit = 1 - Math.min(1, t / 0.22);
            led = "off";
            break;
          case "dock":
            cableY = v.dockedY - MODULE_EXIT;
            // Entra do fundo do quadro e desacelera ao encostar no aparelho.
            airY = v.dockedY - MODULE_EXIT * (1 - easeOut(t));
            lit = 0;
            led = t > 0.94 ? "blink" : "off";
            break;
          case "power":
            cableY = v.dockedY - MODULE_EXIT;
            airY = v.dockedY;
            lit = easeInOut(t);
            led = t < LED_BLINK_UNTIL ? "blink" : "on";
            break;
        }

        v.pivot.rotation.y = yaw;
        v.cable.group.position.y = cableY;
        v.air.group.position.y = airY;
        v.device.screen.material.opacity = lit;

        const pulse =
          led === "on"
            ? 1
            : led === "off"
              ? 0
              : // Onda quase quadrada: um LED pisca, não respira. O smoothstep
                // sobre o seno tira o degrau sem transformar em pulsação.
                (() => {
                  const phase = Math.sin(
                    (clockMs / 1000) * Math.PI * 2 * LED_BLINK_HZ,
                  );
                  const k = Math.min(1, Math.max(0, phase * 3 + 0.5));
                  return 0.06 + 0.94 * (k * k * (3 - 2 * k));
                })();
        v.device.led.material.opacity = pulse;

        renderer.render(v.scene, v.camera);

        /*
         * Estado aplicado, exposto no DOM. O canvas é WebGL, então não há como ler
         * um pixel de fora com getContext("2d"); estes atributos deixam a animação
         * verificável por medição, e não só por inspeção visual.
         */
        el.dataset.progress = progress.toFixed(4);
        el.dataset.stage = s.key;
        el.dataset.yaw = ((yaw * 180) / Math.PI).toFixed(1);
        el.dataset.cableY = cableY.toFixed(3);
        el.dataset.airY = airY.toFixed(3);
        el.dataset.lit = lit.toFixed(3);
        el.dataset.led = led;
        el.dataset.ledLevel = pulse.toFixed(3);

        setStage((prev) => (prev === s.key ? prev : s.key));
        return led;
      };

      /*
       * O pisca do LED corre no TEMPO, não na rolagem: um LED pisca mesmo com o
       * dedo parado. Por isso um laço de quadro que existe SÓ enquanto o LED está
       * piscando — fora disso a cena continua desenhando sob demanda, sem queimar
       * quadro à toa.
       */
      let progressNow = 0;
      let raf = 0;
      const stopLoop = () => {
        if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      };
      const frame = (now: number) => {
        raf = 0;
        if (apply(progressNow, now) === "blink") {
          raf = requestAnimationFrame(frame);
        }
      };
      const draw = (progress: number) => {
        progressNow = progress;
        const led = apply(progress, performance.now());
        if (led === "blink") {
          if (!raf) raf = requestAnimationFrame(frame);
        } else {
          stopLoop();
        }
      };

      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reduce) {
        // Sem movimento: estado final, montado com o Air e a tela acesa.
        draw(1);
      } else {
        draw(0);
        trigger = ScrollTrigger.create({
          trigger: sec,
          start: "top top",
          end: `+=${SCROLL_LENGTH * 100}%`,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => draw(self.progress),
        });
      }

      const onResize = () => {
        fitToElement(renderer, v.camera, el);
        draw(trigger ? trigger.progress : reduce ? 1 : 0);
      };
      window.addEventListener("resize", onResize);
      el.dataset.ready = "1";
      cleanupResize = () => window.removeEventListener("resize", onResize);
      stopAnimation = stopLoop;
    });

    return () => {
      disposed = true;
      stopAnimation?.();
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
