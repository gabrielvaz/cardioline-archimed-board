import type { NextConfig } from "next";

/**
 * Configuração para publicação no GitHub Pages.
 *
 * O Pages serve arquivos estáticos, então o build precisa ser `output: "export"`.
 * Isso exclui qualquer coisa de servidor — rewrites, headers, revalidação, route
 * handlers. O projeto é um protótipo de visão, todas as páginas são estáticas, e o
 * relatório de build confirma: onze rotas, todas prerenderizadas.
 *
 * O prefixo de caminho vem de variável de ambiente e não fixo no arquivo: em
 * desenvolvimento o site roda na raiz, e no Pages ele roda em /<repositório>/. Fixar
 * o prefixo aqui obrigaria a rodar o dev sob o mesmo caminho.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  // assetPrefix vazio ficaria "" e o Next reclama; undefined é o default correto.
  assetPrefix: basePath || undefined,
  /*
   * Barra no fim: o export gera v2/index.html, e sem trailingSlash os links
   * apontariam para /v2, que no Pages responde um redirecionamento. Dentro de um
   * iframe — a página do deck embute o protótipo — o redirecionamento aparece como
   * um piscar.
   */
  trailingSlash: true,
  /*
   * O otimizador de imagens do Next é um serviço; num site estático ele não existe.
   * Sem isto o build de export falha ao encontrar o primeiro next/image.
   */
  images: { unoptimized: true },
};

export default nextConfig;
