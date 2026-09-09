import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { SLIDES_ARCHIMED } from "@/lib/slides-archimed";
import {
  ARCHIMED_GROUP_LABEL,
  SLIDES_ARCHIMED_GROUP,
  TOTAL_SLIDES_ARCHIMED_GROUP,
} from "@/lib/slides-archimed-group";
import { BASE, EXAMS, USAGE, BASE_SCENARIO, BUCKETS } from "@/lib/archimed";
import {
  CL_BUCKETS,
  CL_BUCKETS_BELOW_ONE,
  CL_CONCENTRATION,
  CL_EXAMS,
  CL_TENANTS,
  CL_TURNAROUND,
  CL_USAGE,
  CL_WINDOW,
} from "@/lib/cardioline";

describe("registry da versão de grupo", () => {
  it("tem 10 slides e não altera a versão só-Brasil", () => {
    expect(SLIDES_ARCHIMED_GROUP).toHaveLength(10);
    expect(TOTAL_SLIDES_ARCHIMED_GROUP).toBe(10);
    expect(SLIDES_ARCHIMED).toHaveLength(10);
  });

  it("segue o mesmo arco da versão só-Brasil, id por id", () => {
    expect(SLIDES_ARCHIMED_GROUP.map((s) => s.id)).toEqual(
      SLIDES_ARCHIMED.map((s) => s.id),
    );
  });

  it("mantém o ritmo de cor: um único navy, o oitavo", () => {
    const ink = SLIDES_ARCHIMED_GROUP.filter((s) => s.theme === "ink");
    expect(ink.map((s) => s.n)).toEqual([8]);
  });

  it("o rótulo do mapa distingue a versão", () => {
    expect(ARCHIMED_GROUP_LABEL).toContain("group");
  });

  /**
   * Toda tela com dado tem que dizer de onde ele vem. A regra do usuário é
   * explícita e é a mais fácil de violar quando alguém acrescenta um slide: um
   * marcador que aparece só às vezes não é lido como regra.
   */
  it("todo slide da versão de grupo renderiza o marcador de procedência", () => {
    for (const s of SLIDES_ARCHIMED_GROUP) {
      const arquivo = ARQUIVO[s.id];
      const src = readFileSync(
        new URL(`../components/slides/archimed-group/${arquivo}`, import.meta.url),
        "utf8",
      );
      expect(src, `${s.id} sem <Source>`).toContain("<Source");
    }
  });

  it("nenhum slide do registry fica sem componente", () => {
    const src = readFileSync(
      new URL("../components/slides/archimed-group/index.tsx", import.meta.url),
      "utf8",
    );
    const bloco = src.slice(src.indexOf("ARCHIMED_GROUP_SLIDE_COMPONENTS"));
    const chaves = [...bloco.matchAll(/^\s{2}"?([a-z0-9-]+)"?:/gm)].map((m) => m[1]);
    expect(chaves.sort()).toEqual(SLIDES_ARCHIMED_GROUP.map((s) => s.id).sort());
  });
});

const ARQUIVO: Record<string, string> = {
  cover: "G0Cover.tsx",
  "the-ask": "G1Ask.tsx",
  "structural-problem": "G2Structural.tsx",
  "installed-base": "G3InstalledBase.tsx",
  "recurring-use": "G4RecurringUse.tsx",
  "exam-volume": "G5Buckets.tsx",
  "recurring-model": "G6Recurring.tsx",
  "what-it-changes": "G7WhatItChanges.tsx",
  "what-must-be-true": "G8MustBeTrue.tsx",
  decision: "G9Decision.tsx",
};

describe("números da Cardioline", () => {
  it("as modalidades somam o total de exames da janela", () => {
    const soma = CL_EXAMS.ecg + CL_EXAMS.holter + CL_EXAMS.abpm + CL_EXAMS.other;
    expect(soma).toBe(CL_EXAMS.total);
  });

  it("exames por mês são o total dividido pela janela", () => {
    expect(CL_EXAMS.perMonth).toBeCloseTo(CL_EXAMS.total / CL_WINDOW.months, -1);
  });

  it("tenants com exame são um subconjunto dos provisionados", () => {
    expect(CL_TENANTS.withExams).toBeLessThan(CL_TENANTS.total);
    expect(CL_USAGE.everyMonth).toBeLessThanOrEqual(CL_TENANTS.withExams);
  });

  it("os buckets da nuvem cobrem os tenants com exame", () => {
    const soma = CL_BUCKETS.reduce((a, b) => a + b.tenants, 0);
    expect(soma + CL_BUCKETS_BELOW_ONE).toBe(CL_TENANTS.withExams);
  });

  it("a coorte da nuvem fecha com a fração de retenção", () => {
    expect(CL_USAGE.cohortEnd / CL_USAGE.cohortStart).toBeCloseTo(
      CL_USAGE.cohortRetention11m,
      2,
    );
  });

  it("a concentração da nuvem é monotônica", () => {
    const c = CL_CONCENTRATION;
    expect(c.topShare).toBeLessThan(c.top3Share);
    expect(c.top3Share).toBeLessThan(c.top5Share);
    expect(c.top5Share).toBeLessThan(c.top10Share);
    expect(c.top10Share).toBeLessThanOrEqual(1);
  });

  it("o turnaround é coerente: mais rápido em 24h que em 48h", () => {
    expect(CL_TURNAROUND.under24hShare).toBeLessThan(CL_TURNAROUND.under48hShare);
    expect(CL_TURNAROUND.medianHours).toBeLessThan(24);
  });

  /**
   * O slide 5 afirma que o modelo é conservador porque assume churn ACIMA das
   * duas medições. Com os rollups do CardioNet o lado brasileiro caiu de 17%
   * para 13%, então a premissa deixou de ficar no meio e passou a ficar acima
   * das duas. O teste trava esse sinal: se o churn do modelo cair abaixo de
   * qualquer uma das medições, o slide passa a afirmar o que o dado não sustenta.
   */
  it("o churn do modelo é conservador nas duas operações", () => {
    expect(BASE_SCENARIO.churn).toBeGreaterThan(CL_USAGE.impliedAnnualChurn);
    expect(BASE_SCENARIO.churn).toBeGreaterThan(USAGE.impliedAnnualChurn);
  });

  it("as duas medições de retenção caem na mesma casa", () => {
    const dif = Math.abs(USAGE.retentionAnnual - CL_USAGE.cohortRetention11m);
    expect(dif).toBeLessThan(0.05);
  });

  /**
   * As duas operações medem coisas diferentes e o deck nunca as soma. O teste
   * trava a ordem de grandeza que justifica o slide 4: o Brasil tem muito mais
   * volume, a nuvem tem a prova de que o modelo roda.
   */
  it("o volume brasileiro é ordens de grandeza maior que o da nuvem", () => {
    expect(EXAMS.perMonthTotal / CL_EXAMS.perMonth).toBeGreaterThan(10);
  });

  it("os buckets das duas operações usam as mesmas faixas", () => {
    expect(CL_BUCKETS.map((b) => b.name)).toEqual(BUCKETS.map((b) => b.name));
  });

  it("a base brasileira segue maior que a nuvem em clientes", () => {
    expect(BASE.active).toBeGreaterThan(CL_TENANTS.total);
  });
});
