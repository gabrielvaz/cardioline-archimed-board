"""Retifica a tela do VIREO AM a partir de uma foto do aparelho ligado.

A tela em uso mostra um gráfico de tórax com os eletrodos C1 a C6 — não um
traçado de ECG. Isso não existe em nenhum render CAD: os renders têm a tela
apagada. A única fonte é a foto.

Por que retificar em vez de desenhar: o gráfico é arte do produto, com anatomia e
posições de eletrodo próprias. Redesenhar seria reinterpretar justamente a parte
que precisa ser fiel.

O quadrilátero de origem foi lido na foto com uma grade de coordenadas e está
fixado abaixo. A saída vai para public/device/model/screen-torso.png, na proporção
medida da tela (lib/v2/vireo-metrics.json).

Uso: python3 scripts/extract-screen.py
"""

from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageEnhance

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "device-source" / "2A1A7BDC-BA78-451D-9C9F-9A8F17502FDB.jpeg"
OUT = ROOT / "public" / "device" / "model" / "screen-torso.png"
METRICS = json.loads((ROOT / "lib" / "v2" / "vireo-metrics.json").read_text())

# Cantos da área da tela na foto, em ordem: topo-esq, topo-dir, base-dir, base-esq.
CORNERS = [(383, 757), (859, 707), (861, 1061), (385, 1111)]

# O vidro reflete o ambiente, então o preto da tela na foto não é preto: fica por
# volta de 20. Subtrair esse piso e ganhar o resto devolve o traçado sobre preto
# de verdade, que é o que o produto mostra.
BLACK_FLOOR = 48
GAIN = 1.8


def perspective_coeffs(src, dst):
    """Coeficientes para Image.transform PERSPECTIVE, resolvendo o sistema 8x8."""
    a = []
    b = []
    for (sx, sy), (dx, dy) in zip(src, dst):
        a.append([dx, dy, 1, 0, 0, 0, -sx * dx, -sx * dy])
        b.append(sx)
        a.append([0, 0, 0, dx, dy, 1, -sy * dx, -sy * dy])
        b.append(sy)
    # Eliminação de Gauss sem numpy: matriz 8x8, custo irrelevante.
    n = 8
    m = [a[i] + [b[i]] for i in range(n)]
    for col in range(n):
        piv = max(range(col, n), key=lambda r: abs(m[r][col]))
        m[col], m[piv] = m[piv], m[col]
        pv = m[col][col]
        for j in range(col, n + 1):
            m[col][j] /= pv
        for r in range(n):
            if r == col:
                continue
            f = m[r][col]
            if f:
                for j in range(col, n + 1):
                    m[r][j] -= f * m[col][j]
    return [m[i][n] for i in range(n)]


def main() -> None:
    src = Image.open(SRC).convert("RGB")
    w = 640
    h = round(w * METRICS["screen"]["h"] / METRICS["screen"]["w"])
    dst = [(0, 0), (w, 0), (w, h), (0, h)]
    coeffs = perspective_coeffs(CORNERS, dst)
    flat = src.transform((w, h), Image.PERSPECTIVE, coeffs, Image.BICUBIC)

    # Piso de preto e ganho, por canal.
    px = flat.load()
    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y]
            px[x, y] = (
                min(255, round(max(0, r - BLACK_FLOOR) * GAIN)),
                min(255, round(max(0, g - BLACK_FLOOR) * GAIN)),
                min(255, round(max(0, b - BLACK_FLOOR) * GAIN)),
            )
    # Vinheta nas bordas: a tela do produto não tem moldura, ela se funde ao vidro
    # preto. Sem isso o retângulo da textura aparecia desenhado na face.
    edge = max(2, round(min(w, h) * 0.055))
    for y in range(h):
        for x in range(w):
            d = min(x, y, w - 1 - x, h - 1 - y)
            if d >= edge:
                continue
            k = (d / edge) ** 1.4
            r, g, b = px[x, y]
            px[x, y] = (round(r * k), round(g * k), round(b * k))

    flat = ImageEnhance.Color(flat).enhance(1.25)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    flat.save(OUT)
    print(f"{OUT.relative_to(ROOT)}  {w}x{h}")


if __name__ == "__main__":
    main()
