/**
 * Números da CARDIOLINE — fonte única.
 *
 * Cardioline é o grupo, com sede na Itália e alcance mundial. Cardios é a
 * operação brasileira, adquirida em 2025. Os dois conjuntos de dados medem
 * coisas diferentes e NUNCA devem ser somados sem dizer:
 *
 * - `lib/archimed.ts` é Cardios, Brasil: base instalada de aparelhos vinda do
 *   Protheus, e volume de exame MEDIDO nos rollups do portal CardioNet.
 * - este arquivo é Cardioline, mundial: uso real do WebApp em nuvem, exame por
 *   exame, MEDIDO.
 *
 * Fonte: `_dados/SpazioCloudAruba_08.09.2026.xlsx`, extração da nuvem Aruba de
 * 08/09/2026, cobrindo setembro de 2025 a agosto de 2026. Quatro abas:
 * `GlobalExamData` (tenant, units, exames por modalidade, notas escritas à mão),
 * `MonthlyUsage` (ECG mês a mês), `Storage` (armazenamento por tenant) e
 * `ExamsDetails` (119.460 linhas, uma por exame, com aquisição, commit,
 * modalidade e normalidade).
 *
 * REVISÃO DE 09/09/2026. Três critérios que a análise em
 * `analises/2026-09-09-cardioline-webapp-uso/` fixou e que este arquivo passou a
 * seguir, porque sem eles os números contradizem a nota do próprio arquivo:
 *
 * 1. Período: só exames com aquisição entre 2025-09 e 2026-08, que é o que o
 *    arquivo declara. Ficam de fora 154 linhas anteriores; o total cai de 119.460
 *    para 119.306.
 * 2. ClickSalute é PharmaRoom. A nota do arquivo diz que o primeiro parou em
 *    03/05/2026 e virou o segundo, e a série mensal mostra isso: o ClickSalute vai
 *    de 3.939 exames em abril a zero em junho, e o PharmaRoom sobe de 1.174 para
 *    5.173 em maio. Contar separado inventa um churn e uma aquisição, e corta pela
 *    metade a concentração real: o maior cliente faz 62% da nuvem, não 41%.
 * 3. Tenant é um subdomínio `.cardiolinewebapp.it`; `demo` e `cardio4you` são
 *    ambiente interno e não têm exame no período.
 *
 * LIMITE IMPORTANTE: isto é o WebApp em nuvem, não a base instalada mundial da
 * Cardioline. São os clientes que já estão conectados. Quem usa o software
 * local, sem nuvem, não aparece aqui. Então o número é piso de uso, não tamanho
 * de mercado.
 */

/** Janela medida. */
export const CL_WINDOW = {
  fromLabel: "September 2025",
  toLabel: "August 2026",
  months: 12,
} as const;

/** APURADO. Tenants do WebApp e licenças conectadas. */
export const CL_TENANTS = {
  /** Tenants provisionados na nuvem. */
  total: 49,
  /**
   * Tenants com pelo menos um exame na janela, com o ClickSalute somado ao
   * PharmaRoom. Os outros 15 são demo, recém-ativados ou zerados, e a nota do
   * arquivo diz qual é qual.
   */
  withExams: 33,
  /** Licenças de aparelho provisionadas no WebApp, somadas (`Unit` em GlobalExamData). */
  units: 1_407,
  /** Mediana de licenças por tenant. */
  unitsMedian: 3,
} as const;

/** APURADO. Exames na janela de 12 meses, por modalidade. */
export const CL_EXAMS = {
  total: 119_306,
  perMonth: 9_942,
  ecg: 78_526,
  holter: 22_719,
  abpm: 10_399,
  /** Ergometria, single lead, espirometria, dermatoscopia, NIBP e os 24 códigos de laboratório. */
  other: 7_662,
} as const;

/**
 * APURADO. Uso recorrente, medido tenant por tenant e mês a mês.
 *
 * É o espelho de `USAGE` em `archimed.ts`, e o valor de ter os dois é que são
 * duas medições independentes, em dois continentes, chegando na mesma casa: 89%
 * de retenção de coorte aqui em onze meses, 87% de retenção de logo ao ano no
 * Brasil em seis pares de anos.
 */
export const CL_USAGE = {
  /** Tenants que usaram em todos os 12 meses. */
  everyMonth: 23,
  everyMonthShare: 0.7,
  /** Usaram em 10 meses ou mais: 26 de 33. */
  tenPlusShare: 0.79,
  /**
   * Coorte de setembro ainda ativa em agosto: 24 de 27. Os três que saíram são
   * Banook, CSRhodense e Amicodentista. O ClickSalute não conta como saída porque
   * continua como PharmaRoom.
   */
  cohortStart: 27,
  cohortEnd: 24,
  cohortRetention11m: 0.89,
  /** Tenants ativos por mês, faixa observada. */
  activePerMonthMin: 26,
  activePerMonthMax: 31,
  /**
   * Churn de logo ao ano implícito na coorte: 0,89^(12/11) = 0,880, logo 12%.
   * No Brasil os seis pares de anos dão 13%. Os 15% do modelo ficam acima dos dois.
   */
  impliedAnnualChurn: 0.12,
} as const;

/**
 * APURADO. Concentração, e ela é ainda mais extrema que no Brasil.
 *
 * Um único cliente, o PharmaRoom com o ClickSalute somado, faz 62% de todo o
 * volume da nuvem. É o oposto da forma brasileira, que carrega o volume no meio
 * da base, e é o que sustenta a estratégia de conta nomeada em vez de campanha.
 */
export const CL_CONCENTRATION = {
  topShare: 0.622,
  top3Share: 0.779,
  top5Share: 0.852,
  top10Share: 0.945,
  /** Volume mensal médio do maior cliente. */
  topPerMonth: 6_189,
} as const;

/**
 * APURADO. Tempo entre a aquisição do exame e o commit do laudo, das 108.790
 * linhas do período em que os dois carimbos existem e o commit vem depois da
 * aquisição. Outros 10.089 exames (8,5%) nunca foram fechados e ficam fora.
 *
 * A mediana é dominada pelo ECG (0,19 h); o Holter leva 47 h e o MAPA 24 h na
 * mediana. Serve para uma coisa só no deck: provar que o produto em nuvem não é
 * protótipo, é operação.
 */
export const CL_TURNAROUND = {
  medianHours: 0.5,
  under24hShare: 0.66,
  under48hShare: 0.86,
  samples: 108_790,
} as const;

export type ClBucket = {
  name: string;
  /** APURADO. Tenants cuja mediana mensal cai nesta faixa. */
  tenants: number;
  /** APURADO. Soma das medianas mensais da faixa. */
  examsPerMonth: number;
  medianExams: number;
};

/**
 * APURADO. Os mesmos buckets de exame usados no Brasil, aqui medidos.
 *
 * Cada tenant entra na faixa da mediana dos seus doze meses, com zero nos meses
 * sem exame, e o corte é o mesmo do Brasil, pela parte inteira. O valor deste
 * bloco é a comparação de forma: no Brasil o volume está no meio, aqui está num
 * cliente só. Quatro tenants usam o produto mas têm mediana mensal abaixo de 1, e
 * ficam fora das faixas.
 */
export const CL_BUCKETS: readonly ClBucket[] = [
  { name: "1 to 5", tenants: 4, examsPerMonth: 10, medianExams: 2 },
  { name: "6 to 20", tenants: 6, examsPerMonth: 54, medianExams: 8 },
  { name: "21 to 100", tenants: 9, examsPerMonth: 450, medianExams: 52 },
  { name: "101 to 400", tenants: 7, examsPerMonth: 1_573, medianExams: 193 },
  { name: "401 to 1,500", tenants: 2, examsPerMonth: 1_606, medianExams: 803 },
  { name: "1,500+", tenants: 1, examsPerMonth: 5_642, medianExams: 5_642 },
] as const;

/** Tenants que usam mas com mediana mensal abaixo de 1 exame. */
export const CL_BUCKETS_BELOW_ONE = 4;

/** Formatação de porcentagem, locale fixo para o render ser determinístico. */
export const pctCl = (n: number) =>
  `${(n * 100).toLocaleString("en-US", { maximumFractionDigits: 0 })}%`;
