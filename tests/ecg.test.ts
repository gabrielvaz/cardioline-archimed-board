import { describe, expect, it } from "vitest";
import { ecgPath, ecgPathLength } from "@/lib/ecg";

const base = { width: 1200, height: 200, beats: 8, seed: 42 };

const points = (d: string) =>
  d
    .slice(1)
    .split("L")
    .map((p) => p.trim().split(/[\s,]+/).map(Number) as [number, number]);

describe("ecgPath", () => {
  it("é determinístico — mesma seed, mesmo path", () => {
    expect(ecgPath(base)).toBe(ecgPath({ ...base }));
  });

  it("seeds diferentes produzem traçados diferentes quando há ruído", () => {
    const noisy = { ...base, noise: 0.3 };
    expect(ecgPath(noisy)).not.toBe(ecgPath({ ...noisy, seed: 7 }));
  });

  it("começa com moveto e só contém comandos válidos", () => {
    const d = ecgPath(base);
    expect(d.startsWith("M")).toBe(true);
    expect(d).toMatch(/^[ML0-9.\s-]+$/);
  });

  it("mantém todo o traçado dentro da caixa pedida", () => {
    for (const [x, y] of points(ecgPath({ ...base, noise: 0.5 }))) {
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThanOrEqual(base.width);
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y).toBeLessThanOrEqual(base.height);
    }
  });

  it("produz exatamente um pico R por batida", () => {
    const pts = points(ecgPath(base));
    const mid = base.height / 2;
    let peaks = 0;
    for (let i = 1; i < pts.length - 1; i++) {
      const isPeak = pts[i][1] < pts[i - 1][1] && pts[i][1] <= pts[i + 1][1];
      if (isPeak && mid - pts[i][1] > base.height * 0.25) peaks++;
    }
    expect(peaks).toBe(base.beats);
  });

  it("avança sempre para a direita", () => {
    const xs = points(ecgPath(base)).map(([x]) => x);
    for (let i = 1; i < xs.length; i++) expect(xs[i]).toBeGreaterThanOrEqual(xs[i - 1]);
  });

  it("anomalyAt altera só a batida indicada", () => {
    const normal = points(ecgPath(base));
    const anomalous = points(ecgPath({ ...base, anomalyAt: 4 }));
    expect(anomalous.length).toBe(normal.length);
    const differing = normal.filter((p, i) => p[1] !== anomalous[i][1]);
    expect(differing.length).toBeGreaterThan(0);
    const beatWidth = base.width / base.beats;
    for (const [x] of differing) {
      expect(x).toBeGreaterThanOrEqual(4 * beatWidth);
      expect(x).toBeLessThanOrEqual(5 * beatWidth);
    }
  });

  it("amplitude maior levanta mais o pico R", () => {
    const low = Math.min(...points(ecgPath({ ...base, amplitude: 0.4 })).map(([, y]) => y));
    const high = Math.min(...points(ecgPath({ ...base, amplitude: 0.9 })).map(([, y]) => y));
    expect(high).toBeLessThan(low);
  });
});

describe("ecgPathLength", () => {
  it("cresce com a largura", () => {
    expect(ecgPathLength({ ...base, width: 2400 })).toBeGreaterThan(ecgPathLength(base));
  });
  it("é pelo menos a largura, porque o traçado atravessa a caixa", () => {
    expect(ecgPathLength(base)).toBeGreaterThanOrEqual(base.width);
  });
});
