import * as THREE from "three";

/**
 * Texturas desenhadas em código para o modelo do VIREO AM.
 *
 * A arte oficial vem de recorte de render (public/device/model/face-*.png) e a
 * tela em uso vem de foto retificada (scripts/extract-screen.py). Aqui ficam só os
 * dois elementos que são LUZ, e por isso precisam ser controláveis em vez de
 * pintados: o LED do botão e os contatos do encaixe.
 */

function canvas(w: number, h: number) {
  const el = document.createElement("canvas");
  el.width = w;
  el.height = h;
  const ctx = el.getContext("2d");
  if (!ctx) throw new Error("canvas 2d indisponível");
  return { el, ctx };
}

function finish(el: HTMLCanvasElement): THREE.CanvasTexture {
  const t = new THREE.CanvasTexture(el);
  t.colorSpace = THREE.SRGBColorSpace;
  t.needsUpdate = true;
  return t;
}

/**
 * LED do botão, para sobrepor à arte da face com mistura ADITIVA.
 *
 * O anel verde e azul do render é arte chapada; no aparelho é uma LUZ. Esta
 * textura é só o brilho — o anel em si continua vindo do render oficial —, então
 * variar a opacidade dela acende e apaga a luz sem tocar na arte.
 */
export function createLedTexture(): THREE.CanvasTexture {
  const S = 512;
  const { el, ctx } = canvas(S, S);
  const c = S / 2;
  // Raio do anel dentro da textura. A moldura sobra para o halo caber.
  const r = S * 0.3;

  const arc = (from: number, to: number, color: string) => {
    // Halo primeiro, traço depois: o halo largo e fraco é o que faz ler como luz
    // difundindo no vidro, e não como risco desenhado.
    for (const [width, alpha, blur] of [
      [S * 0.085, 0.16, S * 0.06],
      [S * 0.05, 0.34, S * 0.03],
      [S * 0.028, 1, 0],
    ] as const) {
      ctx.beginPath();
      ctx.arc(c, c, r, from, to);
      ctx.strokeStyle = color;
      ctx.globalAlpha = alpha;
      ctx.lineWidth = width;
      ctx.lineCap = "round";
      ctx.shadowColor = color;
      ctx.shadowBlur = blur;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  };

  // Ângulos lidos no render: verde em cima, azul embaixo, com folga nos lados.
  arc(Math.PI * 1.16, Math.PI * 1.84, "#2fd44f");
  arc(Math.PI * 0.16, Math.PI * 0.84, "#2f8bff");
  return finish(el);
}

/**
 * Fundo do encaixe: fileira de contatos dourados sobre plástico escuro, como no
 * render explodido oficial. Só aparece nos instantes em que o módulo está
 * separado, e é justamente o que mostra que ali existe um conector.
 */
export function createDockTexture(): THREE.CanvasTexture {
  const W = 512;
  const H = 64;
  const { el, ctx } = canvas(W, H);
  ctx.fillStyle = "#15181b";
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "#0b0d0f";
  ctx.fillRect(W * 0.06, H * 0.16, W * 0.88, H * 0.68);

  const pins = 12;
  const span = W * 0.76;
  const pw = (span / pins) * 0.52;
  for (let i = 0; i < pins; i++) {
    const x = W * 0.12 + (span / pins) * (i + 0.5) - pw / 2;
    const g = ctx.createLinearGradient(0, H * 0.28, 0, H * 0.72);
    g.addColorStop(0, "#f0c874");
    g.addColorStop(0.5, "#c9973f");
    g.addColorStop(1, "#8a6522");
    ctx.fillStyle = g;
    ctx.fillRect(x, H * 0.28, pw, H * 0.44);
  }
  return finish(el);
}
