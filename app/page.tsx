import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

/**
 * Hub de navegação do repositório.
 *
 * Existe porque há vários materiais paralelos sobre a mesma tese e a liderança
 * precisa alternar entre eles numa reunião: o deck, e as versões sucessivas da
 * landing. Cada versão fica viva na main, em vez de sobrescrita, para que a
 * evolução do argumento seja demonstrável.
 */

type Entry = {
  href: string;
  kicker: string;
  name: string;
  body: string;
  /** marca qual versão é a atual, para a reunião não abrir a errada */
  current?: boolean;
};

const ENTRIES: Entry[] = [
  {
    href: "/vision",
    kicker: "Deck · 22 slides",
    name: "Product Vision 2028",
    body: "A apresentação. O horizonte de 2028, a tese sobre software e as três camadas do modelo de negócio.",
  },
  {
    href: "/v2",
    kicker: "Landing · v2",
    name: "Anchor",
    body: "A versão atual. VIREO AM e o software Anchor em destaque, com o dispositivo e a interface se movendo com a rolagem.",
    current: true,
  },
  {
    href: "/v1",
    kicker: "Landing · v1",
    name: "Anchor, reverência ao produto",
    body: "Uma ideia por viewport, sem cards e sem bordas: o agrupamento é feito por vazio. Foi onde o posicionamento de porta de entrada foi acertado.",
  },
  {
    href: "/v0",
    kicker: "Landing · v0",
    name: "Anchor, primeiro rascunho",
    body: "A primeira tentativa, guardada como base de comparação. Serve para ver o que foi corrigido: ritmo templatizado, cards em excesso e copy terminal.",
  },
  {
    href: "/anchor",
    kicker: "Protótipo de tela",
    name: "Anchor, dentro do produto",
    body: "A tela do workspace usada como material de apoio dentro do deck.",
  },
];

export default function Hub() {
  return (
    <main className={styles.wrap}>
      <Image
        src="/brand/cardioline-logo.svg"
        alt="Cardioline"
        width={600}
        height={38}
        priority
        className={styles.logo}
      />

      <h1 className={styles.title}>Cardioline Vision 2028</h1>
      <p className={styles.lede}>
        Materiais de visão de produto sobre uma única tese: o dispositivo é a porta de entrada de
        uma relação contínua com o software, e não a conclusão da venda. Todos compartilham a mesma
        identidade extraída das fontes oficiais da Cardioline.
      </p>

      <ul className={styles.list}>
        {ENTRIES.map((e) => (
          <li key={e.href} className={styles.item}>
            <Link href={e.href} className={styles.link}>
              <div>
                <span className={styles.kicker}>{e.kicker}</span>
                <p className={styles.name}>
                  {e.name}
                  {e.current ? <span className={styles.current}>Atual</span> : null}
                </p>
              </div>
              <div>
                <p className={styles.body}>{e.body}</p>
                <p className={styles.go}>Abrir &rsaquo;</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <p className={styles.note}>
        Protótipo de Product Design para discussão interna. Não é material oficial da Cardioline e
        não constitui oferta comercial. Preços são ilustrativos. Todo paciente, exame, medida e
        traçado de ECG mostrado é sintético.
      </p>
    </main>
  );
}
