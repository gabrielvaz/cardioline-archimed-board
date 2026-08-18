"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BrowserFrame, DeviceFrame } from "@/components/product/Frames";
import { HERO } from "@/lib/v2/copy";
import { AnchorWorkspace } from "./AnchorWorkspace";
import { AnchorMobile } from "./AnchorMobile";
import styles from "./Hero.module.css";

gsap.registerPlugin(ScrollTrigger);

/**
 * Hero com coreografia de rolagem.
 *
 * O que o movimento comunica: a montagem do produto. O workspace começa em
 * perspectiva, como um objeto visto de lado, e se endireita até encarar o
 * leitor; o VIREO AM sobe para a frente; o telefone entra por último. É a
 * sequência "o aparelho adquire, o navegador lê, o bolso assina" contada como
 * gesto em vez de como lista. O aparelho em si vive no DeviceRail, que o mantém
 * visível durante a página inteira.
 *
 * Por que GSAP e não CSS puro: a rolagem precisa ser o parâmetro da animação
 * (scrub), o que keyframes de CSS não fazem.
 *
 * Sem pin: um pin cria pin-spacer e muda a altura do documento, o que obriga os
 * outros triggers da página, inclusive o do trilho do dispositivo, a
 * recalcularem em cima de um layout móvel. Com scrub puro há uma origem de
 * verdade só, a rolagem real.
 *
 * Regras respeitadas: nenhum listener de scroll manual, cleanup por
 * gsap.context().revert(), e colapso total sob prefers-reduced-motion.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const workspace = useRef<HTMLDivElement>(null);
  const phone = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce || !root.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom 30%",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // O workspace se endireita e cresce enquanto o hero sai de cena.
      tl.to(
        workspace.current,
        { rotationY: 0, rotationX: 0, scale: 1, xPercent: 0, ease: "none" },
        0,
      )
        // O telefone entra depois, quando já há o que ler nele.
        .to(phone.current, { yPercent: 0, rotation: 0, ease: "none" }, 0.3);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className={styles.hero} id="top">
      <div className={styles.inner}>
        <div>
          <p className={styles.kicker}>{HERO.kicker}</p>
          <h1 className={styles.title}>{HERO.thesis}</h1>
          <p className={styles.lede}>{HERO.supporting}</p>
          <div className={styles.actions}>
            <a href="#pricing" className={styles.cta}>
              {HERO.primary}
            </a>
            <a href="#platform" className={styles.textLink}>
              {HERO.secondary} <span aria-hidden>&rsaquo;</span>
            </a>
          </div>
        </div>

        <div className={styles.stage}>
          <div ref={workspace} className={styles.workspace}>
            <BrowserFrame url="anchor.cardioline.com/exams/EX-48213">
              <AnchorWorkspace />
            </BrowserFrame>
          </div>

          <div ref={phone} className={styles.phone}>
            <DeviceFrame kind="phone" className={styles.phoneFrame}>
              <AnchorMobile />
            </DeviceFrame>
          </div>
        </div>
      </div>
    </section>
  );
}
