/**
 * Prefixo de caminho do site.
 *
 * O GitHub Pages serve o projeto em /<repositório>/, não na raiz. O Next prefixa
 * sozinho o que passa por ele — `next/image`, `next/link`, `url()` em CSS —, mas
 * NÃO o que o código monta à mão: o `loadAsync` das texturas 3D, o `href` de um
 * `<image>` dentro de SVG, o `src` de um iframe. Esses precisam de `asset()`, ou
 * dão 404 exatamente no ambiente publicado e em nenhum outro.
 *
 * Vazio por padrão, então o desenvolvimento local continua na raiz.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Caminho absoluto do site, já com o prefixo de publicação.
 *
 * Tolerante de propósito: URL externa e data URI passam intactas. Assim a função
 * pode ser aplicada em qualquer `src`, inclusive nos que vêm de dados, sem que cada
 * ponto de uso precise saber a origem do caminho.
 */
export function asset(path: string): string {
  if (/^[a-z][a-z0-9+.-]*:|^\/\//i.test(path)) return path;
  /*
   * Idempotente. A regra é aplicar o prefixo UMA vez, onde a URL vira atributo do
   * DOM — nunca numa prop de componente próprio, porque o componente aplica de
   * novo. Isso já aconteceu e o caminho saiu com o prefixo duplicado; a guarda
   * evita que volte a acontecer sem ninguém notar até a publicação.
   */
  if (BASE_PATH && path.startsWith(`${BASE_PATH}/`)) return path;
  return `${BASE_PATH}${path}`;
}
