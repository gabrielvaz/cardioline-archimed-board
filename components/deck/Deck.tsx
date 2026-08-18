"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SLIDES, TOTAL_SLIDES, slideHash } from "@/lib/slides";
import { DeckContext } from "./DeckContext";
import { GridOverview } from "./GridOverview";
import { ProgressRail } from "./ProgressRail";
import styles from "./Deck.module.css";

const IDLE_MS = 2000;

export function Deck({ children }: { children: ReactNode }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(1);
  const [overview, setOverview] = useState(false);
  const [idle, setIdle] = useState(false);

  // O alvo da navegação vive num ref, não no state: durante um scroll suave o
  // `active` ainda mostra o slide antigo, e derivar o próximo dele faria o deck
  // engasgar e perder teclas quando alguém avança rápido.
  const target = useRef(1);
  // Distingue scroll do usuário de scroll programático: só o primeiro pode
  // redefinir o alvo, senão teclas rápidas se perdem no meio da animação.
  const userScrolled = useRef(false);

  // Sem isto o Chrome restaura a posição de scroll ao recarregar, e o R não
  // voltaria ao primeiro slide.
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  const anim = useRef(0);

  /**
   * Animação própria em rAF em vez de scrollTo({behavior:"smooth"}).
   *
   * Medido: sob scroll-snap mandatório o Chrome cancela um smooth scroll quando
   * ele é re-alvejado antes de terminar — com teclas a cada 120ms, 21 avanços
   * chegavam ao slide 20 em vez do 22. O tween próprio é re-alvejável: cada
   * chamada continua da posição atual em vez de disputar com a anterior.
   */
  const scrollToSlide = useCallback((slide: number) => {
    const el = scroller.current;
    if (!el) return;
    cancelAnimationFrame(anim.current);
    const to = (slide - 1) * el.clientHeight;
    const from = el.scrollTop;
    const distance = to - from;
    if (Math.abs(distance) < 1) return;

    // Salto longo é instantâneo: atravessar 19 slides em animação mostraria a
    // apresentação inteira num borrão.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || Math.abs(distance) > el.clientHeight * 1.5) {
      el.scrollTop = to;
      return;
    }

    const started = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - started) / 420);
      el.scrollTop = from + distance * (1 - (1 - t) ** 3);
      if (t < 1) anim.current = requestAnimationFrame(step);
    };
    anim.current = requestAnimationFrame(step);
  }, []);

  const goTo = useCallback(
    (n: number) => {
      const clamped = Math.min(TOTAL_SLIDES, Math.max(1, n));
      target.current = clamped;
      userScrolled.current = false;
      setActive(clamped);
      scrollToSlide(clamped);
      setOverview(false);
    },
    [scrollToSlide],
  );

  useEffect(() => () => cancelAnimationFrame(anim.current), []);

  const next = useCallback(() => goTo(target.current + 1), [goTo]);
  const prev = useCallback(() => goTo(target.current - 1), [goTo]);

  // Slide ativo vem da posição de scroll: cada slide tem exatamente 100vh e o
  // snap garante alinhamento, então a divisão é exata e mais barata que um
  // IntersectionObserver por slide.
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    let frame = 0;
    let settle: ReturnType<typeof setTimeout>;
    const current = () =>
      Math.min(TOTAL_SLIDES, Math.max(1, Math.round(el.scrollTop / el.clientHeight) + 1));
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setActive(current()));
      // Só depois que o scroll para é que a posição real vira o novo alvo —
      // durante um scroll programático ela é apenas um estado intermediário.
      clearTimeout(settle);
      settle = setTimeout(() => {
        if (userScrolled.current) {
          target.current = current();
          userScrolled.current = false;
        }
      }, 150);
    };
    const onUser = () => {
      userScrolled.current = true;
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("wheel", onUser, { passive: true });
    el.addEventListener("touchmove", onUser, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("wheel", onUser);
      el.removeEventListener("touchmove", onUser);
      cancelAnimationFrame(frame);
      clearTimeout(settle);
    };
  }, []);

  // Deep-link. Roda num rAF para o contêiner já ter altura, e levanta uma
  // trava: enquanto ele não terminar, a sincronização de hash fica quieta —
  // senão o primeiro render escreveria #01 por cima do #14 pedido na URL.
  const linked = useRef(false);
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const raf = requestAnimationFrame(() => {
      const n = Number(window.location.hash.replace("#", ""));
      if (Number.isInteger(n) && n >= 1 && n <= TOTAL_SLIDES) {
        target.current = n;
        setActive(n);
        el.scrollTop = (n - 1) * el.clientHeight;
      }
      linked.current = true;
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const onHash = () => {
      const n = Number(window.location.hash.replace("#", ""));
      if (Number.isInteger(n) && n >= 1 && n <= TOTAL_SLIDES && n !== target.current) {
        goTo(n);
      }
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [goTo]);

  useEffect(() => {
    if (!linked.current) return;
    const hash = slideHash(active);
    if (window.location.hash !== hash) {
      window.history.replaceState(null, "", hash);
    }
  }, [active]);

  // Fallback caso tan(atan2()) não exista: calcula a escala em JS.
  useEffect(() => {
    const supported =
      typeof CSS !== "undefined" &&
      CSS.supports("width", "calc(tan(atan2(1px, 1px)) * 1px)");
    if (supported) return;
    const el = scroller.current;
    if (!el) return;
    const apply = () => {
      el.style.setProperty(
        "--stage-scale",
        String(Math.min(window.innerWidth / 1600, window.innerHeight / 900)),
      );
    };
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);

  // Teclado.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target?.tagName ?? "")) {
        return;
      }
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
        case "PageDown":
        case " ":
          e.preventDefault();
          next();
          break;
        case "ArrowLeft":
        case "ArrowUp":
        case "PageUp":
          e.preventDefault();
          prev();
          break;
        case "Home":
          e.preventDefault();
          goTo(1);
          break;
        case "End":
          e.preventDefault();
          goTo(TOTAL_SLIDES);
          break;
        case "f":
        case "F":
          e.preventDefault();
          if (document.fullscreenElement) document.exitFullscreen();
          else document.documentElement.requestFullscreen().catch(() => {});
          break;
        case "g":
        case "G":
          e.preventDefault();
          setOverview((v) => !v);
          break;
        case "r":
        case "R":
          // Recomeça a apresentação: tira o hash e recarrega, para voltar ao
          // slide 1 com todas as animações no estado inicial.
          e.preventDefault();
          window.history.replaceState(null, "", window.location.pathname);
          window.location.reload();
          break;
        default:
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo, next, prev]);

  // Chrome some depois de 2s parado.
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const wake = () => {
      setIdle(false);
      clearTimeout(timer);
      timer = setTimeout(() => setIdle(true), IDLE_MS);
    };
    wake();
    window.addEventListener("mousemove", wake);
    window.addEventListener("keydown", wake);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", wake);
      window.removeEventListener("keydown", wake);
    };
  }, []);

  const theme = SLIDES[active - 1]?.theme ?? "white";

  const value = useMemo(
    () => ({ active, total: TOTAL_SLIDES, goTo, next, prev, overview, setOverview }),
    [active, goTo, next, prev, overview],
  );

  return (
    <DeckContext.Provider value={value}>
      <div className={styles.deck} ref={scroller} data-deck>
        {children}
      </div>

      <div
        className={`${styles.chrome} ${idle && !overview ? styles.chromeIdle : ""}`}
        data-theme={theme}
      >
        <ProgressRail active={active} onPick={goTo} />
        <span className={styles.hint}>← → navigate · F fullscreen · G overview · R restart</span>
        <span className={styles.counter} data-numeric data-testid="counter">
          {String(active).padStart(2, "0")} / {TOTAL_SLIDES}
        </span>
      </div>

      {overview && (
        <GridOverview active={active} onPick={goTo} onClose={() => setOverview(false)} />
      )}
    </DeckContext.Provider>
  );
}
