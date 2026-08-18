import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { contrastRatio } from "@/lib/contrast";

const css = readFileSync("styles/tokens.css", "utf8");
const token = (name: string) => {
  const m = css.match(new RegExp(`--cl-${name}:\\s*(#[0-9A-Fa-f]{6})`));
  if (!m) throw new Error(`token --cl-${name} não existe em tokens.css`);
  return m[1].toUpperCase();
};

describe("contrastRatio", () => {
  it("dá 21 para preto sobre branco", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 1);
  });
  it("dá 1 para uma cor contra ela mesma", () => {
    expect(contrastRatio("#F66201", "#F66201")).toBeCloseTo(1, 5);
  });
  it("é simétrico", () => {
    expect(contrastRatio("#F66201", "#040A2A")).toBeCloseTo(
      contrastRatio("#040A2A", "#F66201"), 6);
  });
});

describe("tokens da marca", () => {
  it("usa o laranja real do wordmark, não o fallback do briefing", () => {
    expect(token("orange")).toBe("#F66201");
    expect(token("orange")).not.toBe("#F36C21");
  });

  it("usa o laranja de UI real do tema oficial", () => {
    expect(token("orange-ui")).toBe("#EE5B00");
  });

  it("texto ink sobre branco passa AAA", () => {
    expect(contrastRatio(token("ink"), "#FFFFFF")).toBeGreaterThanOrEqual(7);
  });

  it("o laranja de texto passa AA sobre branco, sem sair da matiz da marca", () => {
    expect(contrastRatio(token("orange-ink"), "#FFFFFF")).toBeGreaterThanOrEqual(4.5);
  });

  it("o laranja de superfície comporta texto branco", () => {
    expect(contrastRatio("#FFFFFF", token("orange-strong"))).toBeGreaterThanOrEqual(4.5);
  });

  it("branco sobre ink passa AAA", () => {
    expect(contrastRatio("#FFFFFF", token("ink"))).toBeGreaterThanOrEqual(7);
  });

  it("laranja sobre ink passa AA em qualquer tamanho", () => {
    expect(contrastRatio(token("orange"), token("ink"))).toBeGreaterThanOrEqual(4.5);
  });

  it("laranja sobre branco só passa em texto grande — a regra existe por isso", () => {
    const r = contrastRatio(token("orange-ui"), "#FFFFFF");
    expect(r).toBeGreaterThanOrEqual(3);
    expect(r).toBeLessThan(4.5);
  });

  it("mute sobre branco passa AA para texto normal", () => {
    expect(contrastRatio(token("mute"), "#FFFFFF")).toBeGreaterThanOrEqual(4.5);
  });

  it("define a stage em exatamente 1600x900", () => {
    expect(css).toMatch(/--stage-w:\s*1600px/);
    expect(css).toMatch(/--stage-h:\s*900px/);
  });

  it("não tem nenhum tamanho de fonte abaixo de 16px na escala", () => {
    const sizes = [...css.matchAll(/--cl-fs-[a-z]+:\s*(\d+)px/g)].map((m) => Number(m[1]));
    expect(sizes.length).toBeGreaterThan(0);
    expect(sizes.filter((s) => s < 16)).toEqual([]);
  });
});
