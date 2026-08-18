"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Entrada escalonada dos filhos diretos ao entrar no viewport.
 *
 * Movimento justificado: sequência de leitura. Cada seção diz, pela ordem em que
 * seus blocos aparecem, o que ler primeiro. Roda uma vez e para, sem loop.
 *
 * Sem listener de scroll manual: ScrollTrigger com once. Cleanup por
 * gsap.context().revert(). Sob prefers-reduced-motion nada é animado e o
 * conteúdo já nasce visível, porque o estado final é o padrão do CSS.
 */
export function Reveal({
  children,
  stagger = 0.08,
  y = 22,
  className,
}: {
  children: ReactNode;
  stagger?: number;
  y?: number;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const targets = Array.from(el.children);
      if (!targets.length) return;
      gsap.from(targets, {
        opacity: 0,
        y,
        duration: 0.7,
        stagger,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 82%", once: true },
      });
    }, el);

    return () => ctx.revert();
  }, [stagger, y]);

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
