import { Deck } from "@/components/deck/Deck";
import { Slide } from "@/components/deck/Slide";
import { ARCHIMED_SLIDE_COMPONENTS } from "@/components/slides/archimed";
import { ARCHIMED_LABEL, SLIDES_ARCHIMED } from "@/lib/slides-archimed";

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
  title: "Cardioline · Archimed board",
  description:
    "Recurring revenue on the installed base. Eight slides for a fifteen-minute board meeting.",
};

/**
 * A versão para o board da Archimed.
 *
 * Não substitui `/vision`: os 22 slides continuam lá, e a evolução do argumento
 * é parte do material. Aqui o argumento é o mesmo, cortado para quinze minutos e
 * reescrito para quem decide investimento, não roadmap.
 */
export default function ArchimedPage() {
  return (
    <Deck slides={SLIDES_ARCHIMED} label={ARCHIMED_LABEL}>
      {SLIDES_ARCHIMED.map((s) => {
        const Component = ARCHIMED_SLIDE_COMPONENTS[s.id];
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
