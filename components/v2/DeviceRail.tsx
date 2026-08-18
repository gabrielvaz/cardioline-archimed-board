"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./DeviceRail.module.css";

gsap.registerPlugin(ScrollTrigger);

/**
 * O VIREO AM presente durante toda a rolagem, com o módulo Air encaixando.
 *
 * O que o movimento comunica: a montagem do aparelho. O módulo sobe da base e
 * acopla, que é literalmente como o produto funciona, e é o único momento em que
 * o rótulo do encaixe acende. Depois disso o aparelho recua de escala e passa a
 * acompanhar a leitura em vez de disputar com ela.
 *
 * Corpo e módulo são dois recortes do MESMO render oficial, separados pela faixa
 * transparente entre eles (scripts/cutout-device.py, split_module). Nada foi
 * redesenhado nem regerado: as abas do conector caem na base porque as duas
 * peças mantêm a proporção original.
 *
 * Uma única timeline com scrub sobre a rolagem do documento, em vez de pin: sem
 * pin-spacer não há altura de documento mudando por baixo dos outros triggers.
 */
export function DeviceRail() {
  const rail = useRef<HTMLDivElement>(null);
  const group = useRef<HTMLDivElement>(null);
  const moduleRef = useRef<HTMLImageElement>(null);
  const hint = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(max-width: 1099px)").matches) return;

    const ctx = gsap.context(() => {
      // Estado inicial: grande, e o módulo separado abaixo do corpo.
      gsap.set(group.current, { scale: 0.88 });
      // Solto, bem abaixo da base: é preciso ver que está separado.
      gsap.set(moduleRef.current, { yPercent: 52, opacity: 1 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // 0 a 0.16 — o aparelho segura a escala do hero.
      tl.to(group.current, { scale: 0.88, duration: 0.16, ease: "none" }, 0);

      // 0.16 a 0.34 — o módulo Air sobe e acopla.
      tl.to(hint.current, { opacity: 1, duration: 0.04, ease: "none" }, 0.16)
        .to(moduleRef.current, { yPercent: 0, duration: 0.18, ease: "power1.inOut" }, 0.16)
        .to(hint.current, { opacity: 0, duration: 0.05, ease: "none" }, 0.34);

      // 0.34 ao fim — recua de escala e acompanha a leitura.
      tl.to(group.current, { scale: 0.56, duration: 0.3, ease: "power1.out" }, 0.34);
    }, rail);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rail} className={styles.rail} aria-hidden>
      <div ref={group} className={styles.group}>
        <Image
          src="/device/vireo-am-body.png"
          alt=""
          width={452}
          height={754}
          priority
          data-part="body"
          className={styles.body}
        />
        <Image
          ref={moduleRef}
          src="/device/vireo-am-module.png"
          alt=""
          width={407}
          height={296}
          priority
          data-part="module"
          className={styles.module}
        />
        <p ref={hint} data-part="hint" className={styles.hint}>
          Air module, docking
        </p>
      </div>
    </div>
  );
}
