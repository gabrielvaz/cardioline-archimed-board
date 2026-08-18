import "./v1.css";

/**
 * As versões v0 e v1 foram construídas em Tailwind, antes da consolidação neste
 * repositório. O CSS delas é importado AQUI, no layout do segmento, e não no
 * layout raiz: no App Router o CSS de um segmento entra apenas no chunk das
 * rotas daquele segmento, então o reset do Tailwind não alcança o deck nem a
 * v2. É o que permite três mundos de CSS convivendo num único app.
 */
export default function V1Layout({ children }: LayoutProps<"/v1">) {
  return <>{children}</>;
}
