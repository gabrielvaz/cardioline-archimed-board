/**
 * Números da CARDIOS (Brasil) — fonte única.
 *
 * REVISÃO DE 09/09/2026. Até esta revisão o volume de exame por cliente era
 * DERIVADO do tamanho do parque, calibrado contra "14.000 exames por dia" que
 * vinham de uma transcrição de reunião. Isso acabou: os rollups do portal
 * CardioNet em `_dados/csv_export/` medem exame por exame, mês a mês, cliente a
 * cliente. A medição desmentiu o modelo derivado em dois pontos que mudam a
 * estratégia comercial, e os dois estão documentados em `BUCKETS` abaixo.
 *
 * As três fontes, e o que cada uma é:
 *
 * 1. `_dados/csv_export/` — rollups do portal CardioNet, 19,03 milhões de exames.
 *    Fonte primária de tudo que envolve uso e volume. A série confiável começa
 *    em 2019-01: o histórico de 2006 a 2018 foi perdido numa migração de MySQL, e
 *    o que sobra antes disso é remanescente e não registro. Nunca calcular
 *    crescimento contra 2009-2017.
 * 2. `_dados/Clientese base.xlsx` — Protheus. Única fonte de quem COMPROU o quê.
 * 3. `_dados/Dinamica2026.xlsx` — exames de um único centro de telemedicina.
 *    Superado pelos rollups; não alimenta mais nada neste arquivo.
 *
 * Cardioline, o grupo mundial, vive em `lib/cardioline.ts`. Os dois nunca são
 * somados sem que o slide diga.
 */

/**
 * APURADO. Duas contagens de cliente que medem coisas diferentes.
 *
 * `entities` vem do Protheus e conta quem comprou aparelho. `portalActiveYear`
 * vem do CardioNet e conta quem transmitiu exame. O vão entre os dois não é
 * erro: é a diferença entre ter comprado e estar conectado.
 *
 * A unidade do portal é a CONTA. 11.579 das 12.101 contas trazem o `customer_id`
 * do ERP, e ele vem em dois formatos (`8120` e `008120`); normalizado com zeros à
 * esquerda, são 5.437 códigos distintos. Contar sem normalizar dava 6.311, que é
 * o número que este arquivo trazia até 09/09/2026.
 */
export const BASE = {
  /** Protheus: entidades com ao menos uma compra, sem revendas nem a Cardios. */
  entities: 11_925,
  /** Protheus: entidades que compraram nos últimos 24 meses. */
  active: 3_257,
  /**
   * Aparelhos comprados nos ÚLTIMOS 10 ANOS pelas entidades ativas. A escada:
   * 161.586 registros no arquivo, 96.649 só aparelhos, 87.354 sem revendas,
   * 45.099 nos últimos 10 anos, 29.619 desses de entidades ativas.
   */
  devices: 29_619,
  devicesEverSold: 87_354,
  serials: 161_586,
  /** CardioNet: contas de cliente no portal. */
  portalAccounts: 12_101,
  /** CardioNet: contas que transmitiram ao menos um exame em 2025. */
  portalActiveYear: 5_322,
  /** CardioNet: média de contas ativas por mês nos 12 meses fechados. */
  portalActivePerMonth: 4_214,
  /** Códigos de cliente do ERP distintos entre as contas do portal. */
  portalCustomerIds: 5_437,
} as const;

/**
 * APURADO. Volume de exame, medido no portal.
 *
 * `perMonthTotal` é a média dos doze meses fechados de setembro de 2025 a agosto
 * de 2026, com faixa de 213.609 a 308.435. São 3.220.296 exames contados no
 * período, não estimados.
 */
export const EXAMS = {
  perMonthTotal: 268_358,
  windowLabel: "September 2025 to August 2026",
  windowTotal: 3_220_296,
  monthMin: 213_609,
  monthMax: 308_435,
  /** Histórico no portal, desde que a série é confiável. */
  lifetime: 19_032_503,
  /** Centrais de análise ativas por mês. */
  providersPerMonth: 810,
  reportedShare: 0.718,
  /** Mix de 2025: Holter domina, e é o que o produto tem que servir primeiro. */
  holterShare: 0.795,
  abpmShare: 0.197,
  ecgShare: 0.009,
} as const;

/**
 * INFORMADO, não apurado. Nenhum destes valores existe nas planilhas de `_dados`:
 * o Protheus não traz preço nem receita, e o portal não traz dinheiro. Eles vêm
 * de dois lugares, e o slide que os usa tem que dizer isso:
 *
 * - Receita de hardware ("~R$ 40 M"), de software (R$ 2,7 M), a fatia de 6%, o
 *   preço de tabela do CardioNet Client (R$ 1.200) e a receita realizada por
 *   licença (~R$ 670): `_estrategia/2026-08-19-empacotamento-e-monetizacao/
 *   cardios_modelo_negocio_software.html`, que registra o que a gestão informou.
 * - Os R$ 30 por laudo terceirizado: reunião de 19/08/2026 (Luis Meireles: "paga
 *   normalmente 30 reais de laudo por cada exame") e o glossário, que dá a faixa
 *   de R$ 30 a 40. A referência italiana citada na mesma reunião é outra coisa:
 *   7,20 € por exame ou 108 € por aparelho por mês, no MindBeat.
 *
 * Verificar com o financeiro antes do board. Até lá, o deck os rotula como
 * informados pela gestão, nunca como medidos.
 */
export const REVENUE = {
  hardwareBrl: 40_000_000,
  softwareBrl: 2_700_000,
  /** 2,7 / (40 + 2,7) = 6,3%. */
  softwareShare: 0.06,
  licenceRealisedBrl: 670,
  licenceListBrl: 1_200,
  /** O que o cliente paga hoje por laudo terceirizado. É a âncora de preço. */
  outsourcedReportBrl: 30,
  /** Onde os números acima foram informados, para a legenda do slide. */
  source: "management figures, August 2026",
} as const;

/** INFORMADO na reunião de 19/08/2026: como a Cardioline cobra o MindBeat na Itália. */
export const ITALIAN_REFERENCE = {
  perExamEur: 7.2,
  perDevicePerMonthEur: 108,
} as const;

/**
 * APURADO. Uso recorrente e retenção, medidos no portal.
 *
 * Isto substitui a coorte de 47 clientes e seis meses que vinha do
 * `Dinamica2026`. Agora são seis pares de anos consecutivos, cada um com cerca
 * de cinco mil clientes, de 2019 a 2025: retenção de logo entre 84,1% e 88,8%,
 * média de 87,0%, logo 13,0% de churn ao ano.
 *
 * O modelo assume 15%, o que passou a ser levemente CONSERVADOR em vez de
 * otimista. Foi a terceira vez que este número mudou de dono, e é a primeira em
 * que ele vem de uma série de seis anos em vez de uma coorte de sete meses.
 */
export const USAGE = {
  yearPairs: 6,
  retentionAnnual: 0.87,
  retentionMin: 0.841,
  retentionMax: 0.888,
  /** Churn de logo ao ano, medido. */
  impliedAnnualChurn: 0.13,
  /** Mediana de meses ativos por conta no histórico do portal. */
  medianActiveMonths: 34,
  accountsWithHistory: 8_785,
  accountsActiveNow: 7_308,
  /** Clientes novos por ano, e a tendência é de queda. */
  newClients2025: 442,
  newClients2024: 497,
} as const;

/**
 * APURADO. Turnaround do laudo, 2025.
 *
 * Contraste com a nuvem italiana, onde 66% sai em menos de 24 horas: aqui são
 * 31,5%, e 11,4% passa de uma semana. É o problema que o Inbox priorizado
 * atende, agora com número em vez de anedota.
 */
export const TURNAROUND = {
  under4hShare: 0.073,
  under24hShare: 0.315,
  under72hShare: 0.615,
  over168hShare: 0.114,
  reported: 2_198_372,
} as const;

export type Bucket = {
  /** Faixa de exames por mês. */
  name: string;
  /** APURADO. Contas ativas em 2025 cuja média por mês ativo cai na faixa. */
  entities: number;
  /** APURADO. Soma dos exames/mês da faixa. */
  exams: number;
  /** APURADO. Mediana de exames/mês na faixa. */
  medianExams: number;
  /** PREMISSA. Assinatura mensal por cliente, em BRL. */
  priceBrl: number;
  /** PREMISSA. Teto de conversão em 24 meses. */
  ceiling: number;
  /** Resultado: fração convertida no mês 24, já líquida de churn. */
  conversion: number;
  /**
   * Resultado: clientes pagando no mês 24, vindo do modelo e não de
   * `entities × conversion` na tela, porque a conversão exibida é arredondada.
   */
  payers: number;
  /** Resultado: MRR do bucket no mês 24, em BRL. */
  mrrBrl: number;
};

/**
 * Seis buckets por volume de exame, agora MEDIDOS.
 *
 * Cada conta ativa em 2025 entrou na faixa da sua média por mês ativo
 * (`avg_exams_per_active_month` em `stats_v_client_yearly`, ano 2025). O corte é
 * pela parte inteira da média: menos de 6 é "1 to 5", menos de 21 é "6 to 20", e
 * assim por diante. Só esse corte reproduz as contagens abaixo; arredondar a média
 * dá 1.487 / 1.703 / 1.533 / 514 / 76 / 9. `exams` é a soma dessas médias, e por
 * isso os seis buckets somam 269.406 e não os 268.358 da janela de doze meses:
 * uma coisa é a média de 2025 por conta, outra é a média mensal de set/25 a ago/26.
 * A coluna de participação divide pela soma dos buckets, `BUCKETS_EXAMS_TOTAL`.
 *
 * A distribuição real desmentiu a derivada em dois pontos:
 *
 * 1. O topo é muito menor. Nove contas passam de 1.500 exames/mês, não 32, e
 *    fazem 8,8% do volume em vez de 44%.
 * 2. O meio é muito maior. 2.017 contas entre 21 e 400 exames/mês carregam
 *    63,5% do volume.
 *
 * Isso muda a operação comercial que o pedido tem que financiar: deixa de ser
 * cobrir trinta contas gigantes e passa a ser cobrir dois mil clientes médios.
 *
 * O preço segue ancorado no que o cliente já gasta, a mediana da faixa vezes os
 * R$ 30 do laudo terceirizado, e nos dois buckets pequenos a assinatura tem que
 * sair abaixo desse gasto. Há teste garantindo.
 */
export const BUCKETS: readonly Bucket[] = [
  { name: "1 to 5", entities: 1_574, exams: 4_426, medianExams: 3, priceBrl: 59, ceiling: 0.03, conversion: 0.0255, payers: 40, mrrBrl: 2_366 },
  { name: "6 to 20", entities: 1_646, exams: 19_640, medianExams: 11, priceBrl: 129, ceiling: 0.05, conversion: 0.0425, payers: 70, mrrBrl: 9_014 },
  { name: "21 to 100", entities: 1_505, exams: 72_456, medianExams: 42, priceBrl: 449, ceiling: 0.08, conversion: 0.0679, payers: 102, mrrBrl: 45_901 },
  { name: "101 to 400", entities: 512, exams: 98_516, medianExams: 166, priceBrl: 1_090, ceiling: 0.14, conversion: 0.1189, payers: 61, mrrBrl: 66_340 },
  { name: "401 to 1,500", entities: 76, exams: 50_764, medianExams: 561, priceBrl: 2_490, ceiling: 0.18, conversion: 0.1528, payers: 12, mrrBrl: 28_923 },
  { name: "1,500+", entities: 9, exams: 23_604, medianExams: 2_351, priceBrl: 6_900, ceiling: 0.22, conversion: 0.1868, payers: 2, mrrBrl: 11_600 },
] as const;

/** Soma das médias mensais dos seis buckets: o denominador da coluna de participação. */
export const BUCKETS_EXAMS_TOTAL = BUCKETS.reduce((acc, b) => acc + b.exams, 0);

/**
 * APURADO. Onde o volume está de verdade.
 *
 * Também aqui a medição desmentiu a intuição: não existe a conta única que decide
 * o negócio. A maior central de análise responde por 6,6% do histórico, e são
 * 1.180 centrais ativas.
 */
export const CONCENTRATION = {
  /** Contas nos dois buckets do meio, de 21 a 400 exames/mês. */
  middleEntities: 2_017,
  middleShareOfExams: 0.635,
  middleShareOfMrr: 0.68,
  topEntities: 9,
  topShareOfExams: 0.088,
  /** Metade de baixo das 5.322 contas de 2025 (2.661) e sua fatia dos exames do ano. */
  bottomHalfShareOfExams: 0.042,
  /** O 1% de cima, 54 contas, e sua fatia dos exames de 2025. */
  top1PctShareOfExams: 0.233,
  /** Centrais de análise ativas, e a fatia da maior no histórico. */
  providers: 1_180,
  topProviderShare: 0.066,
  top100ProvidersShare: 0.606,
} as const;

export type Scenario = {
  label: string;
  conversion: number;
  price: number;
  churn: number;
  mrrBrl: number;
  arrBrl: number;
  payers: number;
  vsSoftwareToday: number;
};

export const SCENARIOS: readonly Scenario[] = [
  { label: "Conservative", conversion: 0.6, price: 0.8, churn: 0.30, mrrBrl: 65_220, arrBrl: 782_638, payers: 142, vsSoftwareToday: 0.29 },
  { label: "Base", conversion: 1.0, price: 1.0, churn: 0.15, mrrBrl: 164_144, arrBrl: 1_969_725, payers: 286, vsSoftwareToday: 0.73 },
  { label: "Aggressive", conversion: 1.5, price: 1.2, churn: 0.08, mrrBrl: 319_763, arrBrl: 3_837_158, payers: 465, vsSoftwareToday: 1.42 },
] as const;

export const BASE_SCENARIO = SCENARIOS[1];

/**
 * Sensibilidade do slide de premissas, saída do mesmo modelo. "Triplo do churn"
 * é o triplo dos 15% ASSUMIDOS, logo 45% ao ano, e dá R$ 1,30 M; o triplo dos 13%
 * medidos seria 39% e daria R$ 1,43 M. O slide diz "assumed", não "measured".
 */
export const STRESS = {
  tripleChurnPct: 0.45,
  tripleChurnArrBrl: 1_300_000,
  halfConversionArrBrl: 985_000,
} as const;

/**
 * Pico de ativações líquidas por mês no cenário base, do modelo.
 *
 * 23 por mês é o teto que a operação precisa sustentar, e é abaixo do que o
 * piloto de 60 clientes já exigiria. Não é a curva que limita, é a criação
 * manual de conta.
 */
export const ACTIVATIONS = {
  peakPerMonth: 23,
} as const;

/**
 * Múltiplos de EV sobre ARR.
 *
 * Não são estimativa nossa e não há comparável nenhum atrás deles: são a
 * variável que o board preenche. O que o slide afirma é a estrutura, que R$ 1
 * recorrente e R$ 1 de hardware não valem o mesmo na saída, e não o número.
 */
export const EV_MULTIPLES = [4, 6, 8] as const;

/**
 * O pedido.
 *
 * `amountBrl` está NULO de propósito e o último slide renderiza um marcador
 * visível em vez de um número. O valor não saiu de nenhuma conta deste trabalho,
 * e inventá-lo seria pior do que deixar em branco: quem preenche é quem responde
 * pelo orçamento.
 */
export const ASK = {
  amountBrl: null as number | null,
  items: [
    {
      head: "The product layer",
      body: "The four pillars of the next version: ranked exam inbox, an interface that reads as finished, one role per persona, one journey into MindBeat.",
    },
    {
      head: "Coverage of 2,000 accounts",
      body: "The two middle volume bands carry 68% of the recurring revenue. Measured, this is a coverage machine, not thirty phone calls.",
    },
    {
      head: "Billing and provisioning",
      body: "There is no subscription billing and account creation is manual. Without this there is no recurring revenue, whatever the product does.",
    },
  ],
} as const;

/**
 * Câmbio.
 *
 * PREMISSA, e a única do arquivo que muda todo número de dinheiro do deck ao
 * mesmo tempo. Fica aqui sozinha de propósito: trocar a taxa é editar uma linha,
 * e o rodapé de cada slide com valor declara qual taxa foi usada.
 *
 * Toda fonte deste arquivo é em BRL, porque a operação é brasileira. A conversão
 * acontece na exibição e nunca no dado: guardar dólar convertido seria perder a
 * fonte e ter que reconverter na próxima vez que a taxa mudar.
 */
export const FX = {
  brlPerUsd: 5.5,
  label: "R$ 5.50 / US$ 1",
} as const;

/** Converte um valor em BRL para USD. */
export const toUsd = (brlAmount: number) => brlAmount / FX.brlPerUsd;

/**
 * Valor curto em dólar, a partir de um valor em BRL.
 *
 * Abaixo de um milhão sai em mil e não em milhão: "US$ 358 k" se lê num board,
 * "US$ 0.36 M" faz o número parecer menor do que é e obriga a contar zeros.
 * Locale fixo para o render ser determinístico.
 */
export const usdShort = (brlAmount: number) => {
  const v = toUsd(brlAmount);
  return v < 1_000_000
    ? `US$ ${Math.round(v / 1_000).toLocaleString("en-US")} k`
    : `US$ ${(v / 1_000_000).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} M`;
};

/** US$ 29,844, a partir de um valor em BRL. */
export const usd = (brlAmount: number) =>
  `US$ ${Math.round(toUsd(brlAmount)).toLocaleString("en-US")}`;

/** Só o número, sem prefixo, para dentro de tabela onde a coluna já diz US$. */
export const usdNum = (brlAmount: number) =>
  Math.round(toUsd(brlAmount)).toLocaleString("en-US");

/**
 * Valor unitário pequeno, como preço por exame: duas casas, porque arredondar
 * US$ 0,54 para US$ 1 muda a leitura da escada de preço.
 */
export const usdUnit = (brlAmount: number) =>
  toUsd(brlAmount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const int = (n: number) => n.toLocaleString("en-US");

export const pct = (n: number) =>
  `${(n * 100).toLocaleString("en-US", { maximumFractionDigits: 1 })}%`;

/** Porcentagem inteira, para título. */
export const pct0 = (n: number) => `${Math.round(n * 100)}%`;
