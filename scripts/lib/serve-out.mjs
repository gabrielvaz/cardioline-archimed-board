/**
 * Servidor estático para o diretório `out/`.
 *
 * `next start` NÃO funciona neste projeto: `next.config.ts` usa
 * `output: "export"`, e o Next recusa com "does not work with output: export".
 * O que existe depois do build é `out/`, com `trailingSlash: true`, então
 * `/archimed` mora em `out/archimed/index.html`.
 *
 * Sem dependência nova de propósito: `node:http` resolve, e o harness não deve
 * puxar um pacote só para servir seis tipos de arquivo.
 */
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".glb": "model/gltf-binary",
  ".ico": "image/x-icon",
};

/** Resolve a URL para um arquivo dentro da raiz, ou null se escapar dela. */
async function candidate(root, urlPath) {
  const clean = normalize(decodeURIComponent(urlPath.split("?")[0])).replace(
    /^(\.\.[/\\])+/,
    "",
  );
  const base = resolve(root);
  for (const p of [join(base, clean), join(base, clean, "index.html"), `${join(base, clean)}.html`]) {
    if (!resolve(p).startsWith(base)) continue;
    try {
      const s = await stat(p);
      if (s.isFile()) return p;
    } catch {
      /* tenta o próximo */
    }
  }
  return null;
}

/**
 * Sobe o servidor e espera a rota de sanidade responder 200.
 * Devolve `{ base, close }`.
 */
export async function serveOut({ root = "out", port = 0, probe = "/" } = {}) {
  const server = createServer(async (req, res) => {
    const file = await candidate(root, req.url ?? "/");
    if (!file) {
      res.writeHead(404, { "content-type": "text/plain" });
      res.end("not found");
      return;
    }
    res.writeHead(200, {
      "content-type": TYPES[extname(file).toLowerCase()] ?? "application/octet-stream",
      "cache-control": "no-store",
    });
    createReadStream(file).pipe(res);
  });

  await new Promise((ok, err) => {
    server.once("error", err);
    server.listen(port, "127.0.0.1", ok);
  });

  const base = `http://127.0.0.1:${server.address().port}`;
  const res = await fetch(`${base}${probe}`);
  if (!res.ok) {
    server.close();
    throw new Error(
      `${probe} respondeu ${res.status} em ${root}/ — rodou \`pnpm build\` antes?`,
    );
  }

  return { base, close: () => new Promise((ok) => server.close(ok)) };
}
