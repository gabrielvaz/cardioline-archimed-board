"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  MODEL_ASPECT,
  createStudioEnvironment,
  createVireoDevice,
  createVireoModule,
} from "./model";
import { createScreenTexture } from "./textures";
import {
  BODY_UNITS,
  FRAME_LIFT,
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
    renderer.toneMappingExposure = 1;
    el.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    scene.environment = createStudioEnvironment(renderer);

    const camera = new THREE.PerspectiveCamera(26, 0.8, 0.1, 100);
    /*
     * Câmera levemente acima e apontada um pouco abaixo do centro. Enquadramento
     * frontal puro deixava o perfil a 90° sem nenhuma face superior visível, e
     * nesse ângulo o produto lia como recorte de papel. Meio grau de topo à vista
     * basta para o volume aparecer em todos os ângulos.
     */
    camera.position.set(0, 0.62, 6.35);
    camera.lookAt(0, 0.1, 0);

    // O ambiente faz quase tudo. Esta direcional existe só para o plástico escuro
    // da face ganhar um gradiente próprio — com ambiente puro ele lê como papel.
    const key = new THREE.DirectionalLight(0xffffff, 0.9);
    key.position.set(-2.2, 3.6, 4);
    scene.add(key);

    let disposed = false;
    let trigger: ScrollTrigger | null = null;
    let cleanupResize: (() => void) | null = null;
    const loader = new THREE.TextureLoader();

    const resize = () => {
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return;
      renderer.setSize(r.width, r.height, false);
      camera.aspect = r.width / r.height;
      camera.updateProjectionMatrix();
    };

    Promise.all([
      loader.loadAsync("/device/model/face-front.png"),
      loader.loadAsync("/device/model/face-back.png"),
      loader.loadAsync("/device/model/face-air.png"),
      loader.loadAsync("/device/model/face-cable.png"),
    ]).then(([front, back, airArt, cableArt]) => {
      if (disposed) return;
      for (const t of [front, back, airArt, cableArt]) {
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = renderer.capabilities.getMaxAnisotropy();
      }

      /*
       * O aparelho gira dentro de um pivô; os módulos ficam FORA dele. Um módulo
       * acoplado precisa girar com o corpo e um solto não — nós separados deixam
       * isso explícito, em vez de depender da ordem das transformações.
       */
      const world = new THREE.Group();
      const pivot = new THREE.Group();
      const device = createVireoDevice({
        front,
        back,
        screen: createScreenTexture(),
      });
      pivot.add(device.group);
      world.add(pivot);

      const air = createVireoModule("air", airArt);
      const cable = createVireoModule("cable", cableArt);
      // A origem do módulo é o topo do bloco, então acoplado é a base do corpo.
      const DOCKED_Y = -MODEL_ASPECT / 2;
      air.group.position.y = DOCKED_Y;
      cable.group.position.y = DOCKED_Y;
      world.add(air.group, cable.group);

      world.scale.setScalar(BODY_UNITS / MODEL_ASPECT);
      world.position.y = FRAME_LIFT;
      scene.add(world);

      resize();
      setReady(true);

      const setOpacity = (mats: THREE.Material[], v: number) => {
        for (const m of mats) {
          m.transparent = v < 0.999;
          m.opacity = v;
        }
      };

      const apply = (progress: number) => {
        const s = stageAt(progress);
        const t = easeInOut(localProgress(progress, s));

        // Estado de cada etapa, escrito como switch e não como timeline do GSAP:
        // cada etapa depende só do próprio progresso local, então fica mais fácil
        // de ler e de reordenar em stages.ts.
        let cableY = DOCKED_Y;
        let cableOpacity = 1;
        let airY = DOCKED_Y - MODULE_TRAVEL;
        let airOpacity = 0;
        let yaw = 0;
        let lit = 1;

        switch (s.key) {
          case "hold":
            break;
          case "undock":
            cableY = DOCKED_Y - MODULE_TRAVEL * t;
            cableOpacity = 1 - Math.max(0, (t - 0.72) / 0.28);
            break;
          case "rotate":
            cableOpacity = 0;
            cableY = DOCKED_Y - MODULE_TRAVEL;
            yaw = Math.PI * 2 * TURNS * t;
            // A tela apaga na saída da frente e não volta: o aparelho está
            // desmontado, e uma tela acesa sem módulo seria mentira.
            lit = 1 - Math.min(1, t / 0.22);
            break;
          case "dock":
            cableOpacity = 0;
            cableY = DOCKED_Y - MODULE_TRAVEL;
            airOpacity = Math.min(1, t / 0.22);
            airY = DOCKED_Y - MODULE_TRAVEL * (1 - t);
            lit = 0;
            break;
          case "power":
            cableOpacity = 0;
            cableY = DOCKED_Y - MODULE_TRAVEL;
            airOpacity = 1;
            airY = DOCKED_Y;
            lit = t;
            break;
        }

        pivot.rotation.y = yaw;
        cable.group.position.y = cableY;
        air.group.position.y = airY;
        setOpacity(cable.fades, cableOpacity);
        setOpacity(air.fades, airOpacity);
        device.screen.material.opacity = lit;
        cable.group.visible = cableOpacity > 0.01;
        air.group.visible = airOpacity > 0.01;

        renderer.render(scene, camera);

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
        resize();
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
