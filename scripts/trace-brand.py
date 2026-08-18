"""
Vetoriza os assets de marca oficiais da Cardioline.

Os PNGs originais (baixados de cardioline.com) são chapados e de cor única, então
o traçado é fiel — é vetorização, não redesenho. O harness de verificação compara
o SVG resultante com o PNG original por IoU e exige >= 0.98.

Uso:  python scripts/trace-brand.py
Requer: pip install potracer pillow numpy
"""

import numpy as np
import potrace
from PIL import Image

# Origem: pixels do wordmark oficial em cardioline.com/wp-content/uploads/2022/08/logo.png
ORANGE = "#F66201"

SOURCES = [
    ("tests/fixtures/brand/logo.png", "public/brand/cardioline-logo.svg", ORANGE),
    ("tests/fixtures/brand/logo.png", "public/brand/cardioline-logo-white.svg", "#FFFFFF"),
    ("tests/fixtures/brand/symbol.png", "public/brand/cardioline-symbol.svg", ORANGE),
]


def trace(src: str, out: str, color: str, scale: int = 16, alpha_threshold: int = 100) -> None:
    im = Image.open(src).convert("RGBA")
    w, h = im.size
    # Amplia antes de traçar para o potrace ver bordas suaves em vez de degraus.
    big = im.resize((w * scale, h * scale), Image.LANCZOS)
    # A máscara é INVERTIDA de propósito: o potracer trata o valor falso como a
    # região a preencher. Traçar `alpha > threshold` produz o negativo — letras
    # vazadas num bloco sólido. Medido: máscara direta dá IoU 0.0002 contra o
    # PNG original, invertida dá 0.9833.
    bitmap = potrace.Bitmap(np.array(big)[:, :, 3] <= alpha_threshold)
    path = bitmap.trace(turdsize=2, alphamax=1.0, opticurve=True, opttolerance=0.2)

    d = []
    for curve in path:
        p = curve.start_point
        d.append(f"M{p.x / scale:.3f} {p.y / scale:.3f}")
        for seg in curve:
            if seg.is_corner:
                d.append(f"L{seg.c.x / scale:.3f} {seg.c.y / scale:.3f}")
                d.append(f"L{seg.end_point.x / scale:.3f} {seg.end_point.y / scale:.3f}")
            else:
                d.append(
                    f"C{seg.c1.x / scale:.3f} {seg.c1.y / scale:.3f}"
                    f" {seg.c2.x / scale:.3f} {seg.c2.y / scale:.3f}"
                    f" {seg.end_point.x / scale:.3f} {seg.end_point.y / scale:.3f}"
                )
        d.append("Z")

    # width e height explícitos são obrigatórios: sem eles o Chrome dá
    # naturalWidth 0 e renderiza o SVG como um replaced element de 16x16.
    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" '
        f'viewBox="0 0 {w} {h}" role="img" aria-label="Cardioline">'
        f'<path fill="{color}" fill-rule="evenodd" d="{"".join(d)}"/></svg>'
    )
    with open(out, "w", encoding="utf-8") as fh:
        fh.write(svg)
    print(f"{out}: {len(path)} contornos, {len(svg)} bytes, {w}x{h}")


if __name__ == "__main__":
    for src, out, color in SOURCES:
        trace(src, out, color)
