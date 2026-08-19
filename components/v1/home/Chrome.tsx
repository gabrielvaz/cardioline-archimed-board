"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { CaretRight } from "@phosphor-icons/react/dist/ssr";
import { CardiolineLogo } from "@/components/v1/ui/Logo";
import { NAV } from "@/lib/v1/copy";
import { cn } from "@/lib/v1/cn";
import { asset } from "@/lib/asset";

/**
 * LINGUAGEM VISUAL DA HOME
 *
 * Uma ideia por viewport. Tipografia grande em pesos contidos, tracking
 * apertado, e ausência deliberada de cards, bordas e divisores: o agrupamento é
 * feito por vazio, não por caixa.
 *
 * O laranja aparece pouco, e por isso significa algo: links de ação, um traço
 * de destaque, um preço. Se aparecesse em tudo, deixaria de ser assinatura.
 */

/** Barra global discreta: alta o suficiente para navegar, baixa o suficiente para desaparecer. */
export function SiteNav() {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 h-12 transition-colors duration-300",
        solid ? "bg-white/80 backdrop-blur-xl" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-full max-w-[1000px] items-center gap-8 px-6">
        <a href="#top" aria-label="Anchor by Cardioline, home">
          <CardiolineLogo className="w-[104px]" priority />
        </a>
        <nav
          aria-label="Main"
          className="hidden flex-1 items-center justify-center gap-9 sm:flex"
        >
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[12.5px] font-normal text-ink-2 transition-opacity hover:opacity-60"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <a
          href="#pricing"
          className="ml-auto text-[12.5px] font-medium text-brand-ink transition-opacity hover:opacity-70 sm:ml-0"
        >
          Get Anchor
        </a>
      </div>
    </header>
  );
}

/** Link de ação no registro Apple: texto e chevron, sem botão preenchido. */
export function ActionLink({
  href = "#pricing",
  children,
  className,
}: {
  href?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={cn(
        "group inline-flex items-center gap-1 text-[1.0625rem] font-normal text-brand-ink transition-opacity hover:opacity-70",
        className,
      )}
    >
      {children}
      <CaretRight
        size={14}
        weight="bold"
        className="mt-px transition-transform duration-300 group-hover:translate-x-0.5"
      />
    </a>
  );
}

/*
 * Retorna false durante o SSR e o primeiro render do cliente, true depois.
 *
 * Necessário porque useScroll não tem o que medir no servidor: o style inline
 * que vai no HTML difere do que o cliente calcula, e o React acusa hydration
 * mismatch. Fazer isso com useState mais useEffect também funciona, mas é
 * exatamente o padrão que a regra react-hooks/set-state-in-effect proíbe.
 * useSyncExternalStore expressa a mesma ideia como o que ela é: uma leitura
 * com valor de servidor distinto do valor de cliente.
 */
const neverChanges = () => () => {};

function useHydrated() {
  return useSyncExternalStore(
    neverChanges,
    () => true,
    () => false,
  );
}

/**
 * Dispositivo tratado como escultura: sem moldura, sem sombra, sem card, em
 * branco infinito. Cresce levemente com o scroll, que é o convite para descer.
 * Movimento justificado: hierarquia. A escala diz onde olhar primeiro.
 */
export function DeviceSculpture({
  src,
  alt,
  className,
  priority = false,
  /**
   * Proporção da caixa. O VIREO AM é um aparelho de mão em retrato: numa caixa
   * 4/3 ele apareceria pequeno no meio de vazio lateral.
   */
  ratio = "portrait",
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  ratio?: "portrait" | "landscape";
}) {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 0.18], [0.94, 1.04]);

  const hydrated = useHydrated();

  return (
    <motion.div
      style={reduce || !hydrated ? undefined : { scale }}
      className={cn(
        "relative mx-auto w-full",
        ratio === "portrait"
          ? "aspect-[3/4] max-w-[400px]"
          : "aspect-[4/3] max-w-[860px]",
        className,
      )}
    >
      <Image
        src={asset(src)}
        alt={alt}
        fill
        sizes="(max-width: 900px) 80vw, 400px"
        priority={priority}
        className="object-contain"
      />
    </motion.div>
  );
}

/**
 * Rodapé mínimo. Nenhuma coluna de links inventada: só o que a página precisa
 * declarar sobre si mesma.
 */
export function SiteFooter() {
  return (
    <footer className="bg-white pb-16 pt-20">
      <div className="mx-auto max-w-[1000px] px-6">
        <CardiolineLogo className="w-[120px]" />
        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[13px] text-ink-2 transition-opacity hover:opacity-60"
            >
              {item.label}
            </a>
          ))}
        </div>
        <p className="mt-10 max-w-2xl text-[11.5px] leading-relaxed text-ink-3">
          Anchor by Cardioline. Trento, Italy, since 1962. The Cardioline name
          and logo are property of Cardioline S.p.A.
        </p>
      </div>
    </footer>
  );
}
