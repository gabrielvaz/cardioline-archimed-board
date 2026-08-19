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

/**
 * Mapas de superfície procedurais.
 *
 * Sem eles, cada material tem UM valor de rugosidade para toda a peça, e é isso
 * que dá o aspecto de plástico de CG: superfície perfeita demais. O produto real
 * tem micro-textura de injeção no casco branco, direção de usinagem no trilho e
 * vidro com pequenas variações — nenhuma delas visível de perto, todas visíveis no
 * conjunto.
 *
 * Gerados em código e não baixados: são padrões de ruído, não fotografia.
 */

/** Ruído com semente fixa. Mesma superfície em todo carregamento. */
function noise(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

function tile(
  t: THREE.CanvasTexture,
  x: number,
  y: number,
): THREE.CanvasTexture {
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(x, y);
  t.colorSpace = THREE.NoColorSpace;
  return t;
}

/** Rugosidade do plástico injetado: grão fino, variação de poucos por cento. */
export function createPlasticRoughness(): THREE.CanvasTexture {
  const S = 256;
  const { el, ctx } = canvas(S, S);
  const rnd = noise(20260819);
  const img = ctx.createImageData(S, S);
  for (let i = 0; i < S * S; i++) {
    // Média alta e desvio pequeno: é micro-textura, não superfície corroída.
    const v = 176 + Math.round((rnd() - 0.5) * 30);
    img.data[i * 4] = v;
    img.data[i * 4 + 1] = v;
    img.data[i * 4 + 2] = v;
    img.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return tile(finish(el), 7, 11);
}

/**
 * Normal do alumínio escovado: estrias finíssimas numa direção só. Codifica a
 * inclinação em X, com Y neutro — as linhas correm ao longo da peça.
 */
export function createBrushedNormal(): THREE.CanvasTexture {
  const W = 256;
  const H = 8;
  const { el, ctx } = canvas(W, H);
  const rnd = noise(77712);
  const img = ctx.createImageData(W, H);
  const lane = new Float32Array(W);
  for (let x = 0; x < W; x++) lane[x] = rnd() - 0.5;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      // Derivada da faixa: a estria é a MUDANÇA de altura entre vizinhos.
      const d = lane[(x + 1) % W] - lane[x];
      const i = (y * W + x) * 4;
      img.data[i] = Math.max(0, Math.min(255, 128 + d * 90));
      img.data[i + 1] = 128;
      img.data[i + 2] = 255;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return tile(finish(el), 1, 1);
}

/** Rugosidade do verniz: manchas largas e fracas, para o reflexo não ser espelho. */
export function createGlassRoughness(): THREE.CanvasTexture {
  const S = 128;
  const { el, ctx } = canvas(S, S);
  const rnd = noise(4242);
  ctx.fillStyle = "#0f0f0f";
  ctx.fillRect(0, 0, S, S);
  for (let i = 0; i < 90; i++) {
    const r = S * (0.06 + rnd() * 0.18);
    const cx = rnd() * S;
    const cy = rnd() * S;
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, "rgba(90,90,90,0.32)");
    g.addColorStop(1, "rgba(90,90,90,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }
  return tile(finish(el), 3, 4);
}
