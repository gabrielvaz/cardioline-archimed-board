import { Deck } from "@/components/deck/Deck";
import { Slide } from "@/components/deck/Slide";
import { ARCHIMED_GROUP_SLIDE_COMPONENTS } from "@/components/slides/archimed-group";
import {
  ARCHIMED_GROUP_LABEL,
  SLIDES_ARCHIMED_GROUP,
} from "@/lib/slides-archimed-group";

/*
 * noindex nas duas rotas do board.
 *
 * O resto do `cardioline-product-vision` é indexável e continua sendo. Estas duas
 * trazem projeção de ARR, múltiplo de EV e pedido de investimento, e isso não
 * tem por que aparecer em busca. Fica no `metadata` da rota e não numa cópia
 * publicada à mão: o App Router emite as metas no HTML exportado, e assim a
 * regra viaja com o código em vez de depender de alguém lembrar de reinjetar.
 * O `robots.txt` em `public/` bloqueia os mesmos dois caminhos.
 */
export const metadata = {
  robots: { index: false, follow: false, nocache: true },
  title: "Cardioline · Archimed board · group",
  description:
    "Recurring revenue on the installed base, with Cardios and Cardioline data separated slide by slide.",
};

/**
 * A versão de grupo para o board da Archimed.
 *
 * Não substitui `/archimed`: aquela é a versão só-Brasil e continua viva. Aqui o
 * mesmo argumento é sustentado pelos dois conjuntos de dados, e cada slide diz
 * de onde vem o número.
 */
export default function ArchimedGroupPage() {
  return (
    <Deck slides={SLIDES_ARCHIMED_GROUP} label={ARCHIMED_GROUP_LABEL}>
      {SLIDES_ARCHIMED_GROUP.map((s) => {
        const Component = ARCHIMED_GROUP_SLIDE_COMPONENTS[s.id];
        if (!Component) return null;
        return (
          <Slide key={s.id} n={s.n} theme={s.theme} title={s.title}>
            <Component />
          </Slide>
        );
      })}
    </Deck>
  );
}
