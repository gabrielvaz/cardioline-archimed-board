import { describe, expect, it } from "vitest";
import { PATIENTS } from "@/lib/synthetic";
import { SLIDES } from "@/lib/slides";

describe("pacientes sintéticos", () => {
  it("todos são marcados como sintéticos", () => {
    expect(PATIENTS.every((p) => p.synthetic === true)).toBe(true);
    expect(PATIENTS.length).toBeGreaterThanOrEqual(5);
  });

  it("nenhum nome real do contexto do projeto vaza para os dados", () => {
    const proibidos = ["gabriel", "luis", "meireles", "vaz", "ruini", "generale", "amico"];
    for (const p of PATIENTS) {
      for (const n of proibidos) expect(p.name.toLowerCase()).not.toContain(n);
    }
  });

  it("tem ids únicos", () => {
    expect(new Set(PATIENTS.map((p) => p.id)).size).toBe(PATIENTS.length);
  });
});

describe("registry de slides", () => {
  it("tem exatamente 22 slides", () => {
    expect(SLIDES).toHaveLength(22);
  });

  it("numera de 1 a 22 sem buraco", () => {
    expect(SLIDES.map((s) => s.n)).toEqual([...Array(22)].map((_, i) => i + 1));
  });

  it("tem ids únicos e em kebab-case", () => {
    expect(new Set(SLIDES.map((s) => s.id)).size).toBe(22);
    for (const s of SLIDES) expect(s.id).toMatch(/^[a-z0-9-]+$/);
  });

  it("usa só os dois temas do spec", () => {
    for (const s of SLIDES) expect(["white", "ink"]).toContain(s.theme);
  });

  it("põe em navy exatamente os slides 5, 14 e 20", () => {
    expect(SLIDES.filter((s) => s.theme === "ink").map((s) => s.n)).toEqual([5, 14, 20]);
  });

  it("todo slide tem título em inglês, não em português", () => {
    const pt = /\b(de|da|do|para|com|uma|não|que|dos)\b/i;
    for (const s of SLIDES) expect(s.title).not.toMatch(pt);
  });
});
