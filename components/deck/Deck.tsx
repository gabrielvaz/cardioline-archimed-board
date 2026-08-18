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

  const goTo = useCallback((n: number) => {
    const el = scroller.current;
    if (!el) return;
    const clamped = Math.min(TOTAL_SLIDES, Math.max(1, n));
    el.scrollTo({ top: (clamped - 1) * el.clientHeight, behavior: "smooth" });
    setOverview(false);
  }, []);

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  // Slide ativo vem da posição de scroll: cada slide tem exatamente 100vh e o
  // snap garante alinhamento, então a divisão é exata e mais barata que um
  // IntersectionObserver por slide.
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const n = Math.round(el.scrollTop / el.clientHeight) + 1;
        setActive(Math.min(TOTAL_SLIDES, Math.max(1, n)));
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Deep-link: entra no slide do hash, e mantém o hash em dia ao navegar.
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const n = Number(window.location.hash.replace("#", ""));
    if (Number.isInteger(n) && n >= 1 && n <= TOTAL_SLIDES) {
      el.scrollTo({ top: (n - 1) * el.clientHeight, behavior: "auto" });
      setActive(n);
    }
  }, []);

  useEffect(() => {
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
        <span className={styles.hint}>← → navigate · F fullscreen · G overview</span>
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
