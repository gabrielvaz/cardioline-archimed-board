"use client";

import { createContext, useContext } from "react";

export type DeckState = {
  active: number;
  total: number;
  goTo: (n: number) => void;
  next: () => void;
  prev: () => void;
  overview: boolean;
  setOverview: (open: boolean) => void;
};

export const DeckContext = createContext<DeckState | null>(null);

export function useDeck(): DeckState {
  const ctx = useContext(DeckContext);
  if (!ctx) throw new Error("useDeck precisa estar dentro de <Deck>");
  return ctx;
}

/** Um slide informa aos seus Reveal se já esteve visível. */
export const SlideActiveContext = createContext(false);
export const useSlideActive = () => useContext(SlideActiveContext);
