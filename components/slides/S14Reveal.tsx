"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/deck/Reveal";
import { Display, Kicker } from "@/components/primitives/Type";
import { BrowserFrame } from "@/components/product/Frames";
import shared from "./slides.module.css";
import styles from "./S14Reveal.module.css";
import { asset } from "@/lib/asset";

/**
 * Alvo do "Explore prototype".
 *
 * Mantido como constante única porque existe um protótipo do Anchor mais
 * completo no projeto irmão (dev-apps/cardioline-anchor): trocar este valor
 * repõe o destino sem mexer em mais nada.
 */
/*
 * Barra no fim de propósito: o export estático gera anchor/index.html, e com
 * trailingSlash o caminho canônico é com barra. Sem ela o GitHub Pages responde um
 * redirecionamento, e dentro de um iframe isso aparece como um piscar.
 */
export const PROTOTYPE_URL = "/anchor/";

/**
 * O reveal.
 *
 * A landing embutida é a página real de /anchor num iframe, não um screenshot:
 * o que a plateia vê é o produto de verdade, e o CTA leva para ele.
 */
export function S14Reveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Monta o iframe antes de o slide chegar, para não haver carregamento à vista.
  useEffect(() => {
    const el = ref.current;
    if (!el || mounted) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMounted(true);
          io.disconnect();
        }
      },
      { rootMargin: "150% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [mounted]);

  return (
    <div className={shared.full}>
      <div className={shared.top}>
        <Reveal>
          <Kicker accent>A glimpse of that future</Kicker>
        </Reveal>
      </div>

      <div className={styles.body} ref={ref}>
        <Reveal delay={140} className={styles.frame}>
          <BrowserFrame url="anchor.cardioline.com" style={{ height: "100%" }}>
            <div className={styles.viewport}>
              {mounted ? (
                <iframe
                  src={asset(PROTOTYPE_URL)}
                  title="Anchor by Cardioline — prototype"
                  className={styles.iframe}
                  tabIndex={-1}
                  scrolling="no"
                />
              ) : (
                <span className={styles.placeholder} />
              )}
            </div>
          </BrowserFrame>
        </Reveal>

        <Reveal delay={520} className={styles.foot}>
          <Display size="subhead">Meet the future Anchor.</Display>
          <Link href={PROTOTYPE_URL} className={styles.cta}>
            Explore prototype
            <span aria-hidden>→</span>
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
