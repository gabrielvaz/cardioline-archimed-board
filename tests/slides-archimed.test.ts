import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { SLIDES } from "@/lib/slides";
import { SLIDES_ARCHIMED, TOTAL_SLIDES_ARCHIMED } from "@/lib/slides-archimed";
import {
  ACTIVATIONS,
  ASK,
  BASE,
  BASE_SCENARIO,
  BUCKETS,
  EXAMS,
  SCENARIOS,
  STRESS,
  USAGE,
} from "@/lib/archimed";

describe("registry da versão Archimed", () => {
  it("tem 10 slides, numerados de 1 a 10 sem buraco", () => {
    expect(SLIDES_ARCHIMED).toHaveLength(10);
    expect(TOTAL_SLIDES_ARCHIMED).toBe(10);
    expect(SLIDES_ARCHIMED.map((s) => s.n)).toEqual([...Array(10)].map((_, i) => i + 1));
  });

  it("abre com a capa", () => {
    expect(SLIDES_ARCHIMED[0].id).toBe("cover");
  });

  it("mostra os buckets antes do MRR que sai deles", () => {
    const ids = SLIDES_ARCHIMED.map((s) => s.id);
    expect(ids.indexOf("exam-volume")).toBeLessThan(ids.indexOf("recurring-model"));
  });

  /**
   * O argumento de recompra de hardware foi trocado por uso recorrente do
   * software. Se o id voltar, é sinal de que alguém reintroduziu o argumento
   * errado: comprar aparelho de novo não diz nada sobre assinar software.
   */
  it("argumenta por uso recorrente, não por recompra", () => {
    const ids = SLIDES_ARCHIMED.map((s) => s.id);
    expect(ids).toContain("recurring-use");
    expect(ids).not.toContain("base-behaviour");
  });

  it("tem ids únicos em kebab-case", () => {
    expect(new Set(SLIDES_ARCHIMED.map((s) => s.id)).size).toBe(10);
    for (const s of SLIDES_ARCHIMED) expect(s.id).toMatch(/^[a-z0-9-]+$/);
  });

  /**
   * Lido como texto, e não importado: o registry de componentes arrasta CSS
   * modules, e este Vitest roda sem PostCSS — é o mesmo motivo pelo qual
   * `tests/slides.test.ts` só toca em `lib/`. O que se quer garantir aqui é
   * estrutural: nenhum slide do registry fica sem componente, e nenhum
   * componente fica órfão depois de um corte de slide.
   */
  it("todo slide do registry tem componente, e nenhum componente sobra", () => {
    const src = readFileSync(
      new URL("../components/slides/archimed/index.tsx", import.meta.url),
      "utf8",
    );
    const bloco = src.slice(src.indexOf("ARCHIMED_SLIDE_COMPONENTS"));
    const chaves = [...bloco.matchAll(/^\s{2}"?([a-z0-9-]+)"?:/gm)].map((m) => m[1]);
    expect(chaves.sort()).toEqual(SLIDES_ARCHIMED.map((s) => s.id).sort());
    for (const s of SLIDES_ARCHIMED) {
      expect(chaves, `sem componente para ${s.id}`).toContain(s.id);
    }
  });

  it("mantém o ritmo de cor: um único slide navy", () => {
    const ink = SLIDES_ARCHIMED.filter((s) => s.theme === "ink");
    expect(ink.map((s) => s.n)).toEqual([8]);
  });

  it("tem título em inglês, como o deck de origem", () => {
    const pt = /\b(de|da|do|para|com|uma|não|que|dos)\b/i;
    for (const s of SLIDES_ARCHIMED) expect(s.title).not.toMatch(pt);
  });

  it("não altera o deck de 22 slides", () => {
    expect(SLIDES).toHaveLength(22);
    expect(SLIDES[0].id).toBe("opening");
  });
});

describe("números do deck da Archimed", () => {
  it("a soma do MRR por bucket fecha com o cenário base", () => {
    const soma = BUCKETS.reduce((acc, b) => acc + b.mrrBrl, 0);
    // Tolerância de R$ 100: os valores por bucket são arredondados.
    expect(Math.abs(soma - BASE_SCENARIO.mrrBrl)).toBeLessThanOrEqual(100);
  });

  it("a soma dos exames por bucket fecha com o total nacional", () => {
    const soma = BUCKETS.reduce((acc, b) => acc + b.exams, 0);
    // 0,4% de diferença real: os buckets somam as médias de 2025 por conta
    // (269.406); o total é a média mensal da janela set/25 a ago/26 (268.358).
    expect(Math.abs(soma - EXAMS.perMonthTotal) / EXAMS.perMonthTotal).toBeLessThan(0.01);
  });

  /**
   * Agora que o volume é medido no portal, o denominador é a conta ativa do
   * CardioNet e não a entidade que comprou aparelho no ERP. Todo cliente ativo
   * cai em alguma faixa: não existe mais o resíduo "sem parque".
   */
  it("as contas por bucket somam a base ativa do portal", () => {
    const soma = BUCKETS.reduce((acc, b) => acc + b.entities, 0);
    expect(soma).toBe(BASE.portalActiveYear);
  });

  it("o preço sobe e o preço por exame cai conforme o volume", () => {
    for (let i = 1; i < BUCKETS.length; i++) {
      expect(BUCKETS[i].priceBrl).toBeGreaterThan(BUCKETS[i - 1].priceBrl);
      expect(BUCKETS[i].medianExams).toBeGreaterThan(BUCKETS[i - 1].medianExams);
      const antes = BUCKETS[i - 1].priceBrl / BUCKETS[i - 1].medianExams;
      const agora = BUCKETS[i].priceBrl / BUCKETS[i].medianExams;
      expect(agora, `bucket ${BUCKETS[i].name}`).toBeLessThan(antes);
    }
  });

  /**
   * O achado do Dinamica2026: 49% dos cliente-mês medidos ficam entre 1 e 5
   * exames. Se a assinatura custar mais que o laudo terceirizado que eles já
   * compram, o slide morre na primeira pergunta.
   */
  it("nos dois buckets pequenos a assinatura custa menos que terceirizar o laudo", () => {
    for (const b of BUCKETS.slice(0, 2)) {
      const gastoHoje = b.medianExams * 30;
      expect(b.priceBrl, `bucket ${b.name}`).toBeLessThan(gastoHoje);
    }
  });

  it("a conversão é menor que o teto, porque o churn come a diferença", () => {
    for (const b of BUCKETS) {
      expect(b.conversion).toBeLessThan(b.ceiling);
      expect(b.conversion).toBeGreaterThan(b.ceiling * 0.7);
    }
  });

  it("o teto de conversão sobe com o volume e para em 22%", () => {
    const tetos = BUCKETS.map((b) => b.ceiling);
    expect([...tetos].sort((a, b) => a - b)).toEqual(tetos);
    expect(Math.max(...tetos)).toBe(0.22);
  });

  it("ARR é doze vezes o MRR em todos os cenários", () => {
    for (const s of SCENARIOS) {
      expect(Math.abs(s.arrBrl - s.mrrBrl * 12)).toBeLessThanOrEqual(12);
    }
  });

  it("os pagantes do cenário base cabem na base ativa", () => {
    expect(BASE_SCENARIO.payers).toBeLessThan(BASE.portalActiveYear);
    expect(BASE_SCENARIO.payers / BASE.portalActiveYear).toBeCloseTo(0.054, 2);
  });

  /**
   * O título do slide 7 diz um número de pagantes e a coluna da tabela diz
   * outro se ela for recalculada na tela a partir da conversão arredondada.
   * Foi o que aconteceu: 162 na coluna contra 163 no título.
   *
   * Tolerância de 1 na soma: cada faixa é arredondada uma a uma, e a soma dos
   * arredondados não tem obrigação de bater com o total arredondado. São 286,4
   * pagantes no modelo, e 287 se cada faixa for arredondada antes de somar.
   */
  it("os pagantes por bucket somam os pagantes do cenário base", () => {
    const soma = BUCKETS.reduce((acc, b) => acc + b.payers, 0);
    expect(Math.abs(soma - BASE_SCENARIO.payers)).toBeLessThanOrEqual(1);
  });

  it("os pagantes de cada bucket fecham com entidades vezes conversão", () => {
    for (const b of BUCKETS) {
      expect(b.payers, `bucket ${b.name}`).toBe(Math.round(b.entities * b.conversion));
    }
  });

  it("o MRR de cada bucket fecha com pagantes vezes preço", () => {
    for (const b of BUCKETS) {
      const esperado = b.entities * b.conversion * b.priceBrl;
      // 0,5% de folga: conversão e MRR são arredondados a partir do modelo.
      expect(Math.abs(b.mrrBrl - esperado) / esperado, `bucket ${b.name}`).toBeLessThan(0.005);
    }
  });

  /**
   * O pico de ativações vinha do modelo anterior, que tinha 464 pagantes. Com
   * 163 ele não pode passar de uma fração disso, e ~40 não passava perto.
   */
  it("o pico de ativações é compatível com o total de pagantes", () => {
    expect(ACTIVATIONS.peakPerMonth).toBeLessThan(BASE_SCENARIO.payers / 8);
    expect(ACTIVATIONS.peakPerMonth).toBeLessThan(30);
  });

  it("os cenários estão em ordem crescente de ARR", () => {
    const arrs = SCENARIOS.map((s) => s.arrBrl);
    expect([...arrs].sort((a, b) => a - b)).toEqual(arrs);
  });

  /**
   * A retenção medida é o que tira o churn do campo da premissa. Se o modelo
   * ficar mais otimista que a medição por uma margem grande, o slide de uso
   * recorrente passa a mentir por omissão.
   */
  /**
   * Com a retenção medida em seis pares de anos, a premissa passou a ser
   * conservadora. O teste trava o sinal: se alguém puser o churn do modelo
   * ABAIXO do medido, a projeção fica otimista sem dizer.
   */
  it("o churn do modelo é conservador em relação ao medido", () => {
    expect(BASE_SCENARIO.churn).toBeGreaterThan(USAGE.impliedAnnualChurn);
    expect(USAGE.retentionAnnual + USAGE.impliedAnnualChurn).toBeCloseTo(1, 2);
    expect(USAGE.retentionMin).toBeLessThan(USAGE.retentionAnnual);
    expect(USAGE.retentionMax).toBeGreaterThan(USAGE.retentionAnnual);
  });

  /**
   * O `customer_id` vem em dois formatos e só normalizado dá a contagem certa.
   * Se alguém voltar a contar sem normalizar, o número sobe para 6.311 e a
   * relação conta/cliente do README passa a mentir.
   */
  it("há menos códigos de cliente do ERP que contas no portal", () => {
    expect(BASE.portalCustomerIds).toBeLessThan(BASE.portalAccounts);
    expect(BASE.portalCustomerIds).toBeLessThan(6_311);
  });

  it("o estresse de churn do slide de premissas é o triplo do churn assumido", () => {
    expect(STRESS.tripleChurnPct).toBeCloseTo(BASE_SCENARIO.churn * 3, 5);
    expect(STRESS.tripleChurnArrBrl).toBeLessThan(BASE_SCENARIO.arrBrl);
    expect(STRESS.halfConversionArrBrl).toBeLessThan(BASE_SCENARIO.arrBrl);
  });

  it("o valor do pedido segue em branco, para ser preenchido antes da reunião", () => {
    // Este teste falha de propósito no dia em que alguém puser um número aqui.
    expect(ASK.amountBrl).toBeNull();
    expect(ASK.items).toHaveLength(3);
  });
});
