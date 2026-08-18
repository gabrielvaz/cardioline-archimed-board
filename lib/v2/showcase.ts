/**
 * Configuração do showcase do VIREO AM.
 *
 * Este arquivo é o único lugar para mexer na experiência. As contagens de frame
 * vêm do manifest gerado por scripts/build-vireo-frames.py, então etapa e
 * duração ficam definidas num lugar só e não podem divergir.
 *
 * Para trocar um frame: substitua o .webp em public/vireo-am-scroll/.
 * Para mudar o número de frames ou a duração de uma etapa: edite STAGES no
 *   script e rode-o de novo.
 * Para mudar a distância total de rolagem: SCROLL_LENGTH abaixo.
 * Para mudar onde cada legenda aparece: STAGE_CAPTIONS abaixo.
 */

import desktopManifest from "@/public/vireo-am-scroll/desktop/manifest.json";
import mobileManifest from "@/public/vireo-am-scroll/mobile/manifest.json";

export type Manifest = {
  count: number;
  width: number;
  height: number;
  stages: { name: string; frames: number }[];
  pattern: string;
};

export const MANIFESTS: Record<"desktop" | "mobile", Manifest> = {
  desktop: desktopManifest as Manifest,
  mobile: mobileManifest as Manifest,
};

/**
 * Distância de rolagem que a seção consome enquanto está fixada, em alturas de
 * viewport. Maior = transformação mais lenta e mais controlável; menor = mais
 * rápida. Três é o suficiente para 106 frames sem parecer arrastado.
 */
export const SCROLL_LENGTH = 3;

/** Abaixo desta largura usamos a sequência de menor resolução. */
export const MOBILE_BREAKPOINT = 900;

/**
 * Legenda de cada etapa. Aparece discreta, fora do caminho do produto, e sai
 * durante os momentos em que a transformação é o assunto.
 */
export const STAGE_CAPTIONS: Record<string, { title: string; body: string } | null> = {
  hold: { title: "VIREO AM", body: "Twelve leads in the hand, acquiring." },
  undock: { title: "One dock", body: "The lead cable module releases." },
  // Durante o giro nada compete com o produto.
  rotate: null,
  dock: { title: "Air module", body: "Wireless transmission clicks into the same dock." },
  power: { title: "Ready", body: "The exam opens in Anchor before the patient stands up." },
};

/** Índice do frame (base 0) a partir de um progresso de 0 a 1. */
export function frameAt(progress: number, count: number): number {
  const i = Math.round(progress * (count - 1));
  return Math.min(count - 1, Math.max(0, i));
}

/** Nome da etapa em que um índice de frame cai. */
export function stageAt(index: number, stages: Manifest["stages"]): string {
  let acc = 0;
  for (const s of stages) {
    acc += s.frames;
    if (index < acc) return s.name;
  }
  return stages[stages.length - 1]?.name ?? "";
}

export function frameUrl(pattern: string, index: number): string {
  return pattern.replace("{n}", String(index + 1).padStart(3, "0"));
}
