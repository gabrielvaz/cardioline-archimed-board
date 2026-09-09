import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { asset } from "@/lib/asset";

/**
 * Home do repositório: escolher o fluxo antes de entrar nele.
 *
 * Existe porque há vários materiais paralelos sobre a mesma tese e a liderança
 * precisa alternar entre eles numa reunião. Agrupados por FLUXO — apresentar,
 * navegar o site, mostrar o aparelho, mostrar o produto — porque é assim que a
 * escolha se apresenta na hora: primeiro se decide o que mostrar, e só depois qual
 * versão. Uma lista corrida obrigava a ler cinco descrições para achar a certa.
 *
 * As versões antigas da landing continuam vivas na main, em vez de sobrescritas,
 * para que a evolução do argumento seja demonstrável.
 */

type Entry = {
  href: string;
  kicker: string;
  name: string;
  body: string;
  /** Marca a versão atual, para a reunião não abrir a errada. */
  current?: boolean;
};

type Group = {
  id: string;
  title: string;
  lede: string;
  entries: Entry[];
};

const GROUPS: Group[] = [
  {
    id: "apresentacao",
    title: "Apresentação",
    lede: "Para conduzir a reunião. Três versões do mesmo argumento, para públicos e bases de dados diferentes.",
    entries: [
      {
        href: "/archimed-group",
        kicker: "Deck · 10 slides",
        name: "Archimed board · grupo",
        body: "A versão melhor embasada: o mesmo argumento sustentado pelos dados da Cardios e da Cardioline, com marcador de procedência em cada slide dizendo se o número é do Brasil, do mundo, ou dos dois.",
        current: true,
      },
      {
        href: "/archimed",
        kicker: "Deck · 10 slides",
        name: "Archimed board · só Brasil",
        body: "A versão anterior, com dados apenas da Cardios. Guardada como base de comparação: é onde o argumento foi construído antes de a nuvem italiana entrar na conta.",
      },
      {
        href: "/vision",
        kicker: "Deck · 22 slides",
        name: "Product Vision 2028",
        body: "O horizonte de 2028, a tese sobre software e as três camadas do modelo de negócio.",
      },
    ],
  },
  {
    id: "site",
    title: "Site",
    lede: "A landing do Anchor, em três versões. A evolução do argumento é parte do material.",
    entries: [
      {
        href: "/v2",
        kicker: "Landing · v2",
        name: "Anchor",
        body: "A versão atual. O VIREO AM em 3D se desmonta e remonta com a rolagem, e o software aparece em perspectiva.",
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
        body: "A primeira tentativa, guardada como base de comparação: ritmo templatizado, cards em excesso e copy terminal.",
      },
    ],
  },
  {
    id: "dispositivo",
    title: "Mockup do dispositivo",
    lede: "O VIREO AM modelado em 3D a partir dos renders CAD e das fotos oficiais.",
    entries: [
      {
        href: "/showcase",
        kicker: "3D · rolagem",
        name: "VIREO AM em transformação",
        body: "A sequência isolada: o módulo de cabo sai de cena, o aparelho gira, o módulo Air encaixa e o LED pisca. A mesma que está na v2.",
        current: true,
      },
      {
        href: "/lab/vireo",
        kicker: "3D · conferência",
        name: "Folha de contato do modelo",
        body: "O modelo em vários ângulos e nas três combinações de módulo. É a ferramenta usada para julgar o 3D, não material de apresentação.",
      },
    ],
  },
  {
    id: "produto",
    title: "Dentro do produto",
    lede: "A interface, sem a moldura do site.",
    entries: [
      {
        href: "/anchor",
        kicker: "Protótipo de tela",
        name: "Anchor, o workspace",
        body: "A tela de leitura do exame, usada também como material de apoio dentro do deck.",
      },
    ],
  },
];

export default function Hub() {
  return (
    <main className={styles.wrap}>
      <Image
        src={asset("/brand/cardioline-logo.svg")}
        alt="Cardioline"
        width={600}
        height={38}
        priority
        className={styles.logo}
      />

      <h1 className={styles.title}>Cardioline Vision 2028</h1>
      <p className={styles.lede}>
        Materiais de visão de produto sobre uma única tese: o dispositivo é a
        porta de entrada de uma relação contínua com o software, e não a
        conclusão da venda. Todos compartilham a mesma identidade extraída das
        fontes oficiais da Cardioline.
      </p>

      {GROUPS.map((g) => (
        <section key={g.id} className={styles.group} aria-labelledby={g.id}>
          <div className={styles.groupHead}>
            <h2 id={g.id} className={styles.groupTitle}>
              {g.title}
            </h2>
            <p className={styles.groupLede}>{g.lede}</p>
          </div>

          <ul className={styles.list}>
            {g.entries.map((e) => (
              <li key={e.href} className={styles.item}>
                <Link href={e.href} className={styles.link}>
                  <div>
                    <span className={styles.kicker}>{e.kicker}</span>
                    <p className={styles.name}>
                      {e.name}
                      {e.current ? (
                        <span className={styles.current}>Atual</span>
                      ) : null}
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
        </section>
      ))}

      <p className={styles.note}>
        Protótipo de Product Design para discussão interna. Não é material
        oficial da Cardioline e não constitui oferta comercial. Preços são
        ilustrativos. Todo paciente, exame, medida e traçado de ECG mostrado é
        sintético.
      </p>
    </main>
  );
}
