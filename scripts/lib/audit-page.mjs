/**
 * Auditor de página do deck, extraído de `verify-slides.mjs` para ser usado
 * também por `verify-archimed.mjs`. Roda DENTRO do browser via
 * `page.evaluate`, então não pode fechar sobre nada do escopo do Node: todos
 * os helpers vivem dentro da própria função, de propósito.
 */
/**
 * Overflow, tamanho de fonte e contraste, medidos no DOM real.
 *
 * Roda tanto por slide quanto numa página inteira: os componentes de produto
 * moram fora do deck e precisam obedecer às mesmas regras. Foi exatamente por
 * não auditar a galeria que um kicker laranja de 16px (3.45:1) e uma tag
 * "Synthetic" sobre tint (2.98:1) passaram despercebidos.
 */
export const auditPage = ({ stageW, stageH, minFont, orangeMinPx, regionSelector }) => {
  const out = { overflow: [], small: [], contrast: [], outside: [], collide: [] };

  const parseColor = (c) => {
    const m = c.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const [r, g, b, a = "1"] = m[1].split(",").map((v) => parseFloat(v));
    return { r, g, b, a: Number(a) };
  };

  const lum = ({ r, g, b }) => {
    const f = (v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };

  const ratio = (a, b) => {
    const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
  };

  /** Fundo efetivo: sobe a árvore até achar uma cor opaca. */
  const bgOf = (el) => {
    let node = el;
    while (node && node !== document.documentElement) {
      const c = parseColor(getComputedStyle(node).backgroundColor);
      if (c && c.a > 0.85) return c;
      node = node.parentElement;
    }
    return { r: 255, g: 255, b: 255, a: 1 };
  };

  const isOrange = ({ r, g, b }) => r > 200 && g > 60 && g < 140 && b < 60;

  const regions = regionSelector
    ? [...document.querySelectorAll(regionSelector)]
    : [document.body];

  for (const section of regions) {
    const n = section.dataset?.slide ?? "page";
    const stage = section.querySelector("[class*='stage']");
    if (stage) {
      if (stage.scrollWidth > stageW + 1 || stage.scrollHeight > stageH + 1) {
        out.overflow.push({
          n,
          msg: `stage ${stage.scrollWidth}x${stage.scrollHeight} excede ${stageW}x${stageH}`,
        });
      }
    } else if (regionSelector) {
      out.overflow.push({ n, msg: "stage não encontrada" });
      continue;
    }

    // scrollHeight só enxerga o que vaza para baixo e para a direita. Conteúdo
    // que transborda para CIMA não mexe nele — e é assim que dois elementos
    // acabam sobrepostos sem nenhum alarme. Comparar caixas resolve.
    if (stage) {
      const box = stage.getBoundingClientRect();
      const scale = box.width / stageW || 1;
      for (const el of stage.querySelectorAll("*")) {
        const cs = getComputedStyle(el);
        if (cs.visibility === "hidden" || cs.display === "none" || cs.opacity === "0") continue;
        if (cs.position === "fixed") continue;
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        const over = Math.max(
          (box.top - r.top) / scale,
          (r.bottom - box.bottom) / scale,
          (box.left - r.left) / scale,
          (r.right - box.right) / scale,
        );
        if (over > 2) {
          out.outside.push({
            n,
            over: Math.round(over),
            tag: el.tagName.toLowerCase(),
            text: (el.textContent || "").trim().slice(0, 36),
          });
          break; // um por slide basta para apontar o problema
        }
      }
    }

    // Texto sobre texto é inequivocamente errado, e nem scrollHeight nem os
    // limites da stage enxergam isso: um bloco centrado que cresce demais
    // invade o vizinho sem sair da caixa do slide.
    if (stage) {
      const scale = stage.getBoundingClientRect().width / stageW || 1;
      const painted = [];
      for (const el of stage.querySelectorAll("*")) {
        const cs = getComputedStyle(el);
        if (cs.visibility === "hidden" || cs.display === "none" || cs.opacity === "0") continue;
        // Elementos posicionados podem se sobrepor de propósito.
        if (cs.position !== "static" && cs.position !== "relative") continue;
        // Camada declarada como deliberada (ex.: substrato atrás de um cartão).
        if (el.closest("[data-layer]")) continue;
        const own = [...el.childNodes]
          .filter((c) => c.nodeType === 3)
          .map((c) => c.textContent.trim())
          .join("");
        if (!own) continue;
        const r = el.getBoundingClientRect();
        if (r.width < 2 || r.height < 2) continue;
        painted.push({ el, r, own });
      }
      outer: for (let i = 0; i < painted.length; i++) {
        for (let j = i + 1; j < painted.length; j++) {
          const a = painted[i];
          const b = painted[j];
          if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
          const dx = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left);
          const dy = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top);
          if (dx > 2 * scale && dy > 2 * scale) {
            out.collide.push({
              n,
              overlap: Math.round(Math.min(dx, dy) / scale),
              a: a.own.slice(0, 28),
              b: b.own.slice(0, 28),
            });
            break outer;
          }
        }
      }
    }

    for (const el of section.querySelectorAll("*")) {
      const text = [...el.childNodes]
        .filter((c) => c.nodeType === 3)
        .map((c) => c.textContent.trim())
        .join("");
      if (!text) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || cs.display === "none") continue;
      const size = parseFloat(cs.fontSize);
      const weight = Number(cs.fontWeight) || 400;

      if (size < minFont) {
        out.small.push({ n, size, text: text.slice(0, 40) });
      }

      const fg = parseColor(cs.color);
      const bg = bgOf(el);
      if (!fg) continue;
      const r = ratio(fg, bg);
      const large = size >= 24 || (size >= 18.66 && weight >= 700);
      const required = large ? 3 : 4.5;
      if (r < required) {
        out.contrast.push({
          n,
          size,
          ratio: Number(r.toFixed(2)),
          required,
          text: text.slice(0, 40),
        });
      }
      // Regra da marca: laranja nunca em texto pequeno sobre fundo claro.
      if (isOrange(fg) && lum(bg) > 0.4 && size < orangeMinPx) {
        out.contrast.push({
          n,
          size,
          ratio: Number(r.toFixed(2)),
          required: `laranja só >= ${orangeMinPx}px`,
          text: text.slice(0, 40),
        });
      }
    }
  }
  return out;
};
