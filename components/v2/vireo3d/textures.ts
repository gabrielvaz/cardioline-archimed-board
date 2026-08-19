import * as THREE from "three";

/**
 * Texturas desenhadas em código para o modelo do VIREO AM.
 *
 * O que é arte oficial da Cardioline vem de recorte de render (public/device/model/
 * face-*.png). Aqui ficam só as duas coisas que NENHUM render oficial tem: a tela
 * acesa e a sombra de contato. A tela é interface nossa, com paciente sintético.
 */

const ORANGE = "#f66201";

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
 * Traçado de ECG sintético. Um batimento por ciclo, com P, QRS e T em proporções
 * plausíveis — o suficiente para ler como derivação real a esse tamanho, e nada
 * além disso: não é laudo nem dado de paciente.
 */
function beat(phase: number): number {
  const p = phase % 1;
  const gauss = (c: number, w: number, a: number) =>
    a * Math.exp(-(((p - c) / w) ** 2));
  return (
    gauss(0.16, 0.035, 0.16) + // P
    gauss(0.3, 0.012, -0.22) + // Q
    gauss(0.34, 0.014, 1) + // R
    gauss(0.39, 0.016, -0.3) + // S
    gauss(0.62, 0.06, 0.28) // T
  );
}

/** Tela do aparelho em aquisição. Paciente sintético, sem interpretação. */
export function createScreenTexture(): THREE.CanvasTexture {
  const W = 1024;
  const H = 763; // 1024 / 1,3417, a proporção medida da tela no render
  const { el, ctx } = canvas(W, H);

  ctx.fillStyle = "#07090c";
  ctx.fillRect(0, 0, W, H);

  // Grade de ECG: 1 mm fino, 5 mm forte, como papel milimetrado.
  const mm = W / 46;
  for (let i = 0; i * mm <= W; i++) {
    ctx.strokeStyle =
      i % 5 === 0 ? "rgba(246,98,1,0.30)" : "rgba(246,98,1,0.12)";
    ctx.lineWidth = i % 5 === 0 ? 2 : 1;
    ctx.beginPath();
    ctx.moveTo(Math.round(i * mm) + 0.5, 0);
    ctx.lineTo(Math.round(i * mm) + 0.5, H);
    ctx.stroke();
  }
  for (let i = 0; i * mm <= H; i++) {
    ctx.strokeStyle =
      i % 5 === 0 ? "rgba(246,98,1,0.30)" : "rgba(246,98,1,0.12)";
    ctx.lineWidth = i % 5 === 0 ? 2 : 1;
    ctx.beginPath();
    ctx.moveTo(0, Math.round(i * mm) + 0.5);
    ctx.lineTo(W, Math.round(i * mm) + 0.5);
    ctx.stroke();
  }

  // Duas derivações, para a tela ler como aquisição e não como um traço solto.
  const lanes = [
    { label: "II", y: H * 0.46, amp: H * 0.2, cycles: 2.4 },
    { label: "V5", y: H * 0.79, amp: H * 0.15, cycles: 2.4 },
  ];
  for (const lane of lanes) {
    ctx.beginPath();
    for (let x = 0; x <= W; x += 1) {
      const y = lane.y - beat((x / W) * lane.cycles) * lane.amp;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = "#eef3f8";
    ctx.lineWidth = 7;
    ctx.lineJoin = "round";
    ctx.shadowColor = "rgba(238,243,248,0.55)";
    ctx.shadowBlur = 14;
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.font = `600 ${Math.round(H * 0.085)}px ui-sans-serif, system-ui, sans-serif`;
    ctx.fillStyle = "rgba(238,243,248,0.7)";
    ctx.textBaseline = "middle";
    ctx.fillText(lane.label, W * 0.03, lane.y - lane.amp * 1.3);
  }

  // Cabeçalho: estado e frequência. Os números batem com lib/v2/copy.ts.
  ctx.fillStyle = "rgba(7,9,12,0.86)";
  ctx.fillRect(0, 0, W, H * 0.2);

  ctx.font = `700 ${Math.round(H * 0.1)}px ui-sans-serif, system-ui, sans-serif`;
  ctx.fillStyle = ORANGE;
  ctx.textBaseline = "middle";
  ctx.fillText("ACQUIRING", W * 0.03, H * 0.1);

  ctx.textAlign = "right";
  ctx.font = `700 ${Math.round(H * 0.15)}px ui-sans-serif, system-ui, sans-serif`;
  ctx.fillStyle = "#eef3f8";
  ctx.fillText("68", W * 0.86, H * 0.098);
  ctx.font = `600 ${Math.round(H * 0.075)}px ui-sans-serif, system-ui, sans-serif`;
  ctx.fillStyle = "rgba(238,243,248,0.62)";
  ctx.fillText("bpm", W * 0.985, H * 0.108);
  ctx.textAlign = "left";

  return finish(el);
}

/**
 * Fundo do encaixe: fileira de contatos dourados sobre plástico escuro, como no
 * render explodido oficial. Só aparece nos poucos instantes em que o módulo está
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
