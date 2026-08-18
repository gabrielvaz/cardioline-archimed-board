import "./v2.css";

/**
 * A v2 é escrita em CSS Modules sobre styles/tokens.css, como o deck. O CSS
 * entra aqui, no layout do segmento, para que a escala tipográfica dela não
 * alcance as outras rotas.
 */
export default function V2Layout({ children }: LayoutProps<"/v2">) {
  return <>{children}</>;
}
