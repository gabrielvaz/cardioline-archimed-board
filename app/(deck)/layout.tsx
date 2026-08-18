import "../../styles/deck.css";

/**
 * Route group do deck. Não altera nenhuma URL: /vision e /anchor continuam nos
 * mesmos caminhos. Existe só para dar às rotas da apresentação um lugar onde
 * carregar a tipografia dela sem afetar o hub nem as landings.
 */
export default function DeckLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
