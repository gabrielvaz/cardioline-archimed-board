"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Revelação na entrada em viewport.
 *
 * Justificativa do movimento: sequência narrativa. Cada variação apresenta uma
 * ideia por momento de scroll, e a entrada escalonada diz ao leitor a ordem de
 * leitura. Não há loop infinito, não há parallax e nada se move sem motivo.
 *
 * Colapsa para estático sob prefers-reduced-motion.
 */
export function Reveal({
  children,
  delay = 0,
  y = 20,
  className,
  once = true,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.25 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Entrada imediata, para conteúdo acima da dobra que não espera scroll. */
export function Enter({
  children,
  delay = 0,
  y = 16,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
