/**
 * Harness de verificação do deck.
 *
 * Construído antes dos slides de propósito: é ele que decide se um slide está
 * pronto. Um slide só passa quando o harness aprova E o screenshot foi olhado.
 *
 * Uso: pnpm build && pnpm verify
 */
import { spawn } from "node:child_process";
import { mkdirSync, readFileSync, rmSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";
import puppeteer from "puppeteer";

const PORT = 4321;
const BASE = `http://127.0.0.1:${PORT}`;
const OUT = "artifacts/slides";
const STAGE_W = 1600;
const STAGE_H = 900;
const MIN_FONT_PX = 16;
const ORANGE_MIN_PX = 32;
const VIEWPORTS = [
  { w: 1920, h: 1080, name: "1920x1080" },
  { w: 1600, h: 900, name: "1600x900" },
  { w: 1440, h: 900, name: "1440x900" },
];

const failures = [];
const fail = (where, msg) => failures.push(`${where}: ${msg}`);
const log = (m) => process.stdout.write(`${m}\n`);

/* ------------------------------------------------------------------ server */

async function startServer() {
  const proc = spawn("npx", ["next", "start", "-p", String(PORT)], {
    stdio: ["ignore", "pipe", "pipe"],
  });
  const deadline = Date.now() + 45_000;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${BASE}/vision`);
      if (res.ok) return proc;
    } catch {
      /* ainda subindo */
    }
    await sleep(400);
  }
  proc.kill();
  throw new Error("next start não respondeu em 45s");
}

/* ------------------------------------------------- checagens dentro da page */

/** Overflow, tamanho de fonte e contraste, medidos no DOM real. */
const auditPage = ({ stageW, stageH, minFont, orangeMinPx }) => {
  const out = { overflow: [], small: [], contrast: [] };

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

  for (const section of document.querySelectorAll("section[data-slide]")) {
    const n = section.dataset.slide;
    const stage = section.querySelector("[class*='stage']");
    if (!stage) {
      out.overflow.push({ n, msg: "stage não encontrada" });
      continue;
    }
    if (stage.scrollWidth > stageW + 1 || stage.scrollHeight > stageH + 1) {
      out.overflow.push({
        n,
        msg: `stage ${stage.scrollWidth}x${stage.scrollHeight} excede ${stageW}x${stageH}`,
      });
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

/** IoU entre um SVG servido e o PNG original, rasterizados pelo próprio browser. */
const compareBrand = async ([svgUrl, pngDataUrl, w, h]) => {
  const load = (src) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`falha ao carregar ${src.slice(0, 40)}`));
      img.src = src;
    });
  const alpha = async (src) => {
    const img = await load(src);
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d");
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);
    const d = ctx.getImageData(0, 0, w, h).data;
    const mask = new Uint8Array(w * h);
    for (let i = 0; i < mask.length; i++) mask[i] = d[i * 4 + 3] > 128 ? 1 : 0;
    return mask;
  };
  const a = await alpha(svgUrl);
  const b = await alpha(pngDataUrl);
  let inter = 0;
  let union = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] && b[i]) inter++;
    if (a[i] || b[i]) union++;
  }
  return union === 0 ? 0 : inter / union;
};

/* -------------------------------------------------------------------- main */

async function main() {
  rmSync(OUT, { recursive: true, force: true });
  mkdirSync(OUT, { recursive: true });

  const server = await startServer();
  const browser = await puppeteer.launch({ headless: true });

  try {
    const page = await browser.newPage();

    for (const vp of VIEWPORTS) {
      await page.setViewport({ width: vp.w, height: vp.h, deviceScaleFactor: 1 });
      await page.goto(`${BASE}/vision`, { waitUntil: "networkidle0" });
      await page.evaluate(() => document.fonts.ready);
      await sleep(600);

      const audit = await page.evaluate(auditPage, {
        stageW: STAGE_W,
        stageH: STAGE_H,
        minFont: MIN_FONT_PX,
        orangeMinPx: ORANGE_MIN_PX,
      });

      for (const o of audit.overflow) fail(`${vp.name} slide ${o.n}`, o.msg);
      for (const s of audit.small) {
        fail(`${vp.name} slide ${s.n}`, `fonte ${s.size}px < ${MIN_FONT_PX}px em "${s.text}"`);
      }
      for (const c of audit.contrast) {
        fail(
          `${vp.name} slide ${c.n}`,
          `contraste ${c.ratio} (exige ${c.required}) em ${c.size}px "${c.text}"`,
        );
      }

      // A stage fica centrada e o letterbox usa o fundo do slide.
      const geo = await page.evaluate((h) => {
        const stage = document.querySelector("section[data-slide] [class*='stage']");
        const r = stage.getBoundingClientRect();
        const scale = r.width / 1600;
        return {
          scale,
          centered: Math.abs(r.left + r.width / 2 - window.innerWidth / 2) < 1.5,
          fitsHeight: r.height <= h + 1,
        };
      }, vp.h);

      if (!geo.centered) fail(vp.name, "stage não está centrada");
      if (!geo.fitsHeight) fail(vp.name, `stage renderizada com ${geo.scale} não cabe na altura`);
      const expected = Math.min(vp.w / STAGE_W, vp.h / STAGE_H);
      if (Math.abs(geo.scale - expected) > 0.01) {
        fail(vp.name, `escala ${geo.scale.toFixed(3)} != esperada ${expected.toFixed(3)}`);
      }
      log(`  ${vp.name} · escala ${geo.scale.toFixed(3)} · ok`);
    }

    /* ---- navegação por teclado ---- */
    await page.setViewport({ width: 1600, height: 900, deviceScaleFactor: 1 });
    await page.goto(`${BASE}/vision`, { waitUntil: "networkidle0" });
    await sleep(400);
    for (let i = 0; i < 21; i++) {
      await page.keyboard.press("ArrowRight");
      await sleep(120);
    }
    await sleep(700);
    let hash = await page.evaluate(() => location.hash);
    if (hash !== "#22") fail("teclado", `21x ArrowRight levou a ${hash || "(vazio)"}, esperado #22`);

    await page.keyboard.press("Home");
    await sleep(900);
    hash = await page.evaluate(() => location.hash);
    if (hash !== "#01") fail("teclado", `Home levou a ${hash || "(vazio)"}, esperado #01`);

    /* ---- deep-link ---- */
    await page.goto(`${BASE}/vision#14`, { waitUntil: "networkidle0" });
    await sleep(600);
    const counter = await page.$eval('[data-testid="counter"]', (e) => e.textContent.trim());
    if (!counter.startsWith("14")) fail("deep-link", `#14 abriu no contador "${counter}"`);

    /* ---- fidelidade dos assets de marca ---- */
    const brand = [
      ["/brand/cardioline-logo.svg", "tests/fixtures/brand/logo.png", 600, 38],
      ["/brand/cardioline-symbol.svg", "tests/fixtures/brand/symbol.png", 270, 270],
    ];
    for (const [svg, png, w, h] of brand) {
      const dataUrl = `data:image/png;base64,${readFileSync(png).toString("base64")}`;
      const iou = await page.evaluate(compareBrand, [`${BASE}${svg}`, dataUrl, w, h]);
      if (iou < 0.99) fail("marca", `${svg} IoU ${iou.toFixed(4)} < 0.99 vs original`);
      else log(`  ${svg} · IoU ${iou.toFixed(4)} · ok`);
    }

    /* ---- screenshots ---- */
    await page.setViewport({ width: 1600, height: 900, deviceScaleFactor: 1 });
    await page.goto(`${BASE}/vision`, { waitUntil: "networkidle0" });
    await page.evaluate(() => document.fonts.ready);
    for (let n = 1; n <= 22; n++) {
      await page.evaluate((i) => {
        const deck = document.querySelector("[data-deck]");
        deck.scrollTo({ top: (i - 1) * deck.clientHeight, behavior: "auto" });
      }, n);
      await sleep(700);
      await page.screenshot({ path: `${OUT}/${String(n).padStart(2, "0")}.png` });
    }
    log(`  22 screenshots em ${OUT}/`);
  } finally {
    await browser.close();
    server.kill();
  }

  if (failures.length) {
    log(`\n✗ ${failures.length} violações:\n`);
    for (const f of failures) log(`  · ${f}`);
    process.exit(1);
  }
  log("\n✓ deck verificado");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
