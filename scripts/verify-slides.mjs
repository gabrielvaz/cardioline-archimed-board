/**
 * Harness de verificação do deck.
 *
 * Construído antes dos slides de propósito: é ele que decide se um slide está
 * pronto. Um slide só passa quando o harness aprova E o screenshot foi olhado.
 *
 * Uso: pnpm build && pnpm verify
 */
import { existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";
import puppeteer from "puppeteer";
import { auditPage } from "./lib/audit-page.mjs";
import { serveOut } from "./lib/serve-out.mjs";

/* trailingSlash: true no next.config, então a rota exportada tem barra no fim. */
const VISION = "/vision/";
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

/** Mesmo Chrome de sistema usado por verify-archimed.mjs. */
const CHROME =
  process.env.CHROME_PATH ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const failures = [];
const fail = (where, msg) => failures.push(`${where}: ${msg}`);
const log = (m) => process.stdout.write(`${m}\n`);

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

  const server = await serveOut({ probe: VISION });
  const BASE = server.base;
  const browser = await puppeteer.launch({
    headless: true,
    ...(existsSync(CHROME) ? { executablePath: CHROME } : {}),
  });

  try {
    const page = await browser.newPage();

    for (const vp of VIEWPORTS) {
      await page.setViewport({ width: vp.w, height: vp.h, deviceScaleFactor: 1 });
      await page.goto(`${BASE}${VISION}`, { waitUntil: "networkidle0" });
      await page.evaluate(() => document.fonts.ready);
      await sleep(600);

      const audit = await page.evaluate(auditPage, {
        stageW: STAGE_W,
        stageH: STAGE_H,
        minFont: MIN_FONT_PX,
        orangeMinPx: ORANGE_MIN_PX,
        regionSelector: "section[data-slide]",
      });

      for (const o of audit.overflow) fail(`${vp.name} slide ${o.n}`, o.msg);
      for (const c of audit.collide) {
        fail(
          `${vp.name} slide ${c.n}`,
          `textos sobrepostos em ${c.overlap}px — "${c.a}" e "${c.b}"`,
        );
      }
      for (const o of audit.outside) {
        fail(
          `${vp.name} slide ${o.n}`,
          `<${o.tag}> escapa ${o.over}px da stage — "${o.text}"`,
        );
      }
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

    /* ---- demais rotas: mesmas regras de fonte e contraste ---- */
    const EXTRA_ROUTES = ["/anchor/"];
    await page.setViewport({ width: 1600, height: 1000, deviceScaleFactor: 1 });
    for (const route of EXTRA_ROUTES) {
      const res = await page.goto(`${BASE}${route}`, { waitUntil: "networkidle0" });
      if (!res || res.status() === 404) {
        log(`  ${route} · ainda não existe, pulando`);
        continue;
      }
      await page.evaluate(() => document.fonts.ready);
      await sleep(400);
      const a = await page.evaluate(auditPage, {
        stageW: STAGE_W,
        stageH: STAGE_H,
        minFont: MIN_FONT_PX,
        orangeMinPx: ORANGE_MIN_PX,
        regionSelector: null,
      });
      for (const x of a.small) fail(route, `fonte ${x.size}px < ${MIN_FONT_PX}px em "${x.text}"`);
      for (const c of a.contrast) {
        fail(route, `contraste ${c.ratio} (exige ${c.required}) em ${c.size}px "${c.text}"`);
      }
      if (!a.small.length && !a.contrast.length) log(`  ${route} · ok`);
    }

    /* ---- navegação por teclado ---- */
    await page.setViewport({ width: 1600, height: 900, deviceScaleFactor: 1 });
    await page.goto(`${BASE}${VISION}`, { waitUntil: "networkidle0" });
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
    await page.goto(`${BASE}${VISION}#14`, { waitUntil: "networkidle0" });
    await sleep(600);
    const counter = await page.$eval('[data-testid="counter"]', (e) => e.textContent.trim());
    if (!counter.startsWith("14")) fail("deep-link", `#14 abriu no contador "${counter}"`);

    /* ---- R reinicia a apresentação ---- */
    await page.goto(`${BASE}${VISION}`, { waitUntil: "networkidle0" });
    await sleep(400);
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press("ArrowRight");
      await sleep(140);
    }
    await sleep(600);
    const beforeRestart = await page.evaluate(() => location.hash);
    await page.keyboard.press("r");
    await page.waitForNavigation({ waitUntil: "networkidle0" }).catch(() => {});
    await sleep(700);
    const after = await page.evaluate(() => {
      const deck = document.querySelector("[data-deck]");
      return { hash: location.hash, top: deck ? deck.scrollTop : -1 };
    });
    if (beforeRestart === "#01") fail("restart", "as setas não saíram do slide 1");
    if (after.hash !== "" && after.hash !== "#01") {
      fail("restart", `R deixou o hash em ${after.hash}, esperado vazio ou #01`);
    }
    if (after.top !== 0) fail("restart", `R deixou o scroll em ${after.top}, esperado 0`);
    if (after.top === 0) log(`  R reinicia · ${beforeRestart} -> slide 1 · ok`);

    /* ---- grid overview ---- */
    await page.goto(`${BASE}${VISION}`, { waitUntil: "networkidle0" });
    await sleep(400);
    await page.keyboard.press("g");
    await sleep(350);
    const openedTiles = await page.$$eval('[role="dialog"] button', (b) => b.length);
    if (openedTiles !== 22) fail("overview", `G abriu ${openedTiles} tiles, esperado 22`);
    await page.keyboard.press("Escape");
    await sleep(350);
    if (await page.$('[role="dialog"]')) fail("overview", "Escape não fechou o overview");
    if (openedTiles === 22) log("  overview (G) · 22 tiles · ok");

    /* ---- prefers-reduced-motion ---- */
    await page.emulateMediaFeatures([
      { name: "prefers-reduced-motion", value: "reduce" },
    ]);
    await page.goto(`${BASE}${VISION}`, { waitUntil: "networkidle0" });
    await page.evaluate(() => document.fonts.ready);
    await sleep(500);
    const hidden = await page.evaluate(() => {
      const first = document.querySelector("section[data-slide='1']");
      return [...first.querySelectorAll("[class*='reveal']")].filter(
        (el) => Number(getComputedStyle(el).opacity) < 0.9,
      ).length;
    });
    if (hidden > 0) {
      fail("reduced-motion", `${hidden} elementos ficaram invisíveis sem animação`);
    } else {
      log("  prefers-reduced-motion · conteúdo visível sem animar · ok");
    }
    const rmAudit = await page.evaluate(auditPage, {
      stageW: STAGE_W,
      stageH: STAGE_H,
      minFont: MIN_FONT_PX,
      orangeMinPx: ORANGE_MIN_PX,
      regionSelector: "section[data-slide]",
    });
    for (const c of rmAudit.collide) {
      fail("reduced-motion", `slide ${c.n}: "${c.a}" e "${c.b}" sobrepostos`);
    }
    await page.emulateMediaFeatures([]);

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
    await page.goto(`${BASE}${VISION}`, { waitUntil: "networkidle0" });
    await page.evaluate(() => document.fonts.ready);
    for (let n = 1; n <= 22; n++) {
      await page.evaluate((i) => {
        const deck = document.querySelector("[data-deck]");
        deck.scrollTo({ top: (i - 1) * deck.clientHeight, behavior: "auto" });
      }, n);
      // Espera o reveal mais lento terminar (o desenho do ECG leva 400+2600ms).
      // Fotografar antes disso faria a revisão visual julgar um meio-termo.
      await sleep(3200);
      await page.screenshot({ path: `${OUT}/${String(n).padStart(2, "0")}.png` });
    }
    log(`  22 screenshots em ${OUT}/`);
  } finally {
    await browser.close();
    await server.close();
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
