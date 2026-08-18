"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  MANIFESTS,
  MOBILE_BREAKPOINT,
  SCROLL_LENGTH,
  STAGE_CAPTIONS,
  frameAt,
  frameUrl,
  stageAt,
  type Manifest,
} from "@/lib/v2/showcase";
import styles from "./VireoShowcase.module.css";

gsap.registerPlugin(ScrollTrigger);

/**
 * True quando a viewport é estreita. Escrito com useSyncExternalStore em vez de
 * useState mais useEffect por dois motivos: é uma leitura externa com valor de
 * servidor distinto do de cliente, e chamar setState dentro de um efeito é
 * exatamente o que a regra react-hooks/set-state-in-effect proíbe. De brinde,
 * a subscription no matchMedia faz a escolha reagir a resize.
 */
function useNarrowViewport(): boolean {
  const subscribe = useCallback((onChange: () => void) => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`).matches,
    () => false,
  );
}

/**
 * Showcase do VIREO AM: uma transformação contínua do produto conduzida pela
 * rolagem.
 *
 * NÃO é vídeo. É uma sequência de imagens desenhada em canvas, com o índice do
 * frame amarrado à posição da rolagem por ScrollTrigger em modo scrub. Por isso o
 * usuário avança e volta livremente, e a transformação obedece: rolar para cima
 * desmonta o aparelho na ordem inversa. Um vídeo com autoplay não faria isso.
 *
 * Por que canvas e não uma pilha de <img>: 106 elementos com opacidade alternando
 * obriga o compositor a recalcular camadas a cada frame. Um canvas único faz um
 * drawImage por frame, sem tocar no layout, o que mantém a rolagem fluida.
 *
 * Todos os frames vêm de renders oficiais compostos offline
 * (scripts/build-vireo-frames.py). Nenhum pixel do produto foi gerado.
 */
export function VireoShowcase() {
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [stage, setStage] = useState<string>("hold");

  // A sequência é escolhida antes de baixar qualquer frame: no telefone a de
  // menor resolução é ~7 KB por frame em vez de 13 KB.
  const narrow = useNarrowViewport();
  const manifest: Manifest = narrow ? MANIFESTS.mobile : MANIFESTS.desktop;

  useEffect(() => {
    if (!canvas.current || !section.current) return;

    const ctx2d = canvas.current.getContext("2d", { alpha: false });
    if (!ctx2d) return;

    canvas.current.width = manifest.width;
    canvas.current.height = manifest.height;

    const images: HTMLImageElement[] = [];
    let disposed = false;
    let current = -1;

    const draw = (index: number) => {
      const img = images[index];
      if (!img?.complete || img.naturalWidth === 0 || index === current) return;
      current = index;
      ctx2d.drawImage(img, 0, 0, manifest.width, manifest.height);
    };

    /*
     * Preload em duas ondas. O primeiro frame vem sozinho para a seção nunca
     * aparecer vazia; o resto entra em paralelo depois. Sem isso, 106 pedidos
     * simultâneos competem com o restante da página no primeiro carregamento.
     */
    const loadOne = (index: number) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.decoding = "async";
        img.src = frameUrl(manifest.pattern, index);
        img.onload = img.onerror = () => resolve();
        images[index] = img;
      });

    let trigger: ScrollTrigger | null = null;

    loadOne(0).then(() => {
      if (disposed) return;
      draw(0);
      setReady(true);

      const rest = Array.from({ length: manifest.count - 1 }, (_, i) =>
        loadOne(i + 1),
      );
      Promise.all(rest).then(() => {
        if (!disposed) ScrollTrigger.refresh();
      });

      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reduce) {
        // Sem movimento: mostra o estado final, montado e ligado.
        Promise.all(rest).then(() => {
          if (!disposed) draw(manifest.count - 1);
        });
        setStage(manifest.stages[manifest.stages.length - 1].name);
        return;
      }

      trigger = ScrollTrigger.create({
        trigger: section.current,
        start: "top top",
        end: `+=${SCROLL_LENGTH * 100}%`,
        pin: true,
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const index = frameAt(self.progress, manifest.count);
          draw(index);
          const next = stageAt(index, manifest.stages);
          setStage((prev) => (prev === next ? prev : next));
        },
      });
    });

    return () => {
      disposed = true;
      trigger?.kill();
      images.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [manifest]);

  const caption = STAGE_CAPTIONS[stage] ?? null;

  return (
    <section ref={section} className={styles.section} id="device">
      <div className={styles.viewport}>
        <div className={styles.stage}>
          <canvas
            ref={canvas}
            className={styles.canvas}
            role="img"
            aria-label="Cardioline VIREO AM: the lead cable module releases, the device turns to show its back, and the Air module docks in its place."
          />
          {!ready ? <p className={styles.loading}>Loading</p> : null}
        </div>

        <div className={`${styles.caption} ${caption ? styles.captionOn : ""}`}>
          {caption ? (
            <>
              <p className={styles.captionTitle}>{caption.title}</p>
              <p className={styles.captionBody}>{caption.body}</p>
            </>
          ) : null}
        </div>

        <div className={styles.rail} aria-hidden>
          {manifest.stages.map((s) => (
            <span
              key={s.name}
              className={`${styles.tick} ${s.name === stage ? styles.tickOn : ""}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
