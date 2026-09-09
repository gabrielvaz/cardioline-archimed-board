/**
 * Harness das versões Archimed.
 *
 * Mesmas regras do deck de 22 slides — overflow da stage, elemento que escapa,
 * texto sobre texto, fonte mínima, contraste e a regra do laranja — aplicadas a
 * `/archimed`. Reusa o auditor de `lib/audit-page.mjs` de propósito: duplicar as
 * checagens é como as duas versões passam a ter padrões diferentes.
 *
 * Um slide só passa quando o harness aprova E o screenshot foi olhado.
 *
 * Uso: pnpm build && pnpm verify:archimed
 */
import { existsSync, mkdirSync, rmSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";
import puppeteer from "puppeteer";
import { auditPage } from "./lib/audit-page.mjs";
import { serveOut } from "./lib/serve-out.mjs";

/*
 * Rota e contagem vêm por argumento, para o mesmo harness servir as duas versões
 * do deck sem duplicar as checagens:
 *   node scripts/verify-archimed.mjs                       -> /archimed/, 10 slides
 *   node scripts/verify-archimed.mjs archimed-group 10     -> /archimed-group/
 *
 * trailingSlash: true no next.config, então a rota exportada tem barra no fim.
 */
const NAME = process.argv[2] ?? "archimed";
const EXPECTED = Number(process.argv[3] ?? 10);
const ROUTE = `/${NAME}/`;
const OUT = `artifacts/${NAME}`;
const STAGE_W = 1600;
const STAGE_H = 900;
const MIN_FONT_PX = 16;
const ORANGE_MIN_PX = 32;
const VIEWPORTS = [
  { w: 1920, h: 1080, name: "1920x1080" },
  { w: 1600, h: 900, name: "1600x900" },
  { w: 1440, h: 900, name: "1440x900" },
];

/**
 * Chrome. O Chrome que o puppeteer baixa não está instalado nesta máquina, e
 * baixar 150 MB para tirar oito screenshots é desnecessário quando existe um
 * Chrome de sistema. Mesma convenção de `CHROME_PATH` usada pela skill de
 * slides; sem a variável, tenta o caminho padrão do macOS e depois o do
 * puppeteer.
 */
const CHROME =
  process.env.CHROME_PATH ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const failures = [];
const fail = (where, msg) => failures.push(`${where}: ${msg}`);
const log = (m) => process.stdout.write(`${m}\n`);

async function main() {
  rmSync(OUT, { recursive: true, force: true });
  mkdirSync(OUT, { recursive: true });

  const server = await serveOut({ probe: ROUTE });
  const BASE = server.base;
  const browser = await puppeteer.launch({
    headless: true,
    ...(existsSync(CHROME) ? { executablePath: CHROME } : {}),
  });

  try {
    const page = await browser.newPage();

    for (const vp of VIEWPORTS) {
      await page.setViewport({ width: vp.w, height: vp.h, deviceScaleFactor: 1 });
      await page.goto(`${BASE}${ROUTE}`, { waitUntil: "networkidle0" });
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
      log(`  ${vp.name} · auditado`);
    }

    /* ---- o mapa (G) tem que listar todos, senão a reunião não navega ---- */
    await page.setViewport({ width: 1600, height: 900, deviceScaleFactor: 1 });
    await page.goto(`${BASE}${ROUTE}`, { waitUntil: "networkidle0" });
    await page.evaluate(() => document.fonts.ready);
    const total = await page.evaluate(
      () => document.querySelectorAll("section[data-slide]").length,
    );
    if (total !== EXPECTED) fail(ROUTE, `${total} slides no DOM, esperado ${EXPECTED}`);

    await page.keyboard.press("g");
    await sleep(300);
    const tiles = await page.evaluate(
      () => document.querySelectorAll('[role="dialog"] button').length,
    );
    if (tiles !== EXPECTED) fail(ROUTE, `mapa (G) mostra ${tiles} slides, esperado ${EXPECTED}`);
    await page.keyboard.press("Escape");
    await sleep(200);

    /* ---- deep-link: o último tem que abrir no último, não no primeiro ---- */
    const lastHash = String(EXPECTED).padStart(2, "0");
    await page.goto(`${BASE}${ROUTE}#${lastHash}`, { waitUntil: "networkidle0" });
    await sleep(800);
    const counter = await page.evaluate(
      () => document.querySelector('[data-testid="counter"]')?.textContent?.trim(),
    );
    if (counter !== `${lastHash} / ${EXPECTED}`)
      fail(ROUTE, `deep-link #${lastHash} mostra "${counter}"`);

    /* ---- screenshots ---- */
    await page.goto(`${BASE}${ROUTE}`, { waitUntil: "networkidle0" });
    await page.evaluate(() => document.fonts.ready);
    for (let n = 1; n <= EXPECTED; n++) {
      await page.evaluate((i) => {
        const deck = document.querySelector("[data-deck]");
        deck.scrollTo({ top: (i - 1) * deck.clientHeight, behavior: "auto" });
      }, n);
      // Espera o reveal mais lento (740ms de delay + 480ms de duração) terminar.
      await sleep(1800);
      await page.screenshot({ path: `${OUT}/${String(n).padStart(2, "0")}.png` });
    }
    log(`  ${EXPECTED} screenshots em ${OUT}/`);
  } finally {
    await browser.close();
    await server.close();
  }

  if (failures.length) {
    log(`\n✗ ${failures.length} violações:\n`);
    for (const f of failures) log(`  · ${f}`);
    process.exit(1);
  }
  log(`\n✓ ${ROUTE} verificada`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
