"""Extrai os renders oficiais embutidos no PDF da Cardioline.

O PDF assets/device-source/VIREO-AM-renders-1.pdf traz 85 renders CAD em JPEG.
A primeira versão do modelo usava seis recortes feitos à mão; o resto — inclusive
a VISTA LATERAL, que dá a espessura exata, e o conjunto completo com o módulo
superior — estava dentro do arquivo o tempo todo.

Extrai por varredura de marcadores JPEG (FFD8...FFD9) em vez de biblioteca de PDF:
sem dependência para instalar, e os streams de imagem do PDF não estão
comprimidos por cima do JPEG.

Uso: python3 scripts/extract-vireo-renders.py
"""

from __future__ import annotations

import io
import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PDF = ROOT / "assets" / "device-source" / "VIREO-AM-renders-1.pdf"
OUT = ROOT / "assets" / "device-source" / "renders"

# Renders usados pelo modelo, com o nome que o measure-vireo.py espera. O índice
# é a ordem de aparição no PDF, estável para um mesmo arquivo.
NAMED = {
    1: "front-with-docks",  # frente do corpo, docks vazios nas duas pontas
    2: "side",  # VISTA LATERAL: a espessura sai daqui
    5: "back",  # traseira do corpo, etiqueta e parafusos
    15: "assembly-cable",  # conjunto com módulo de cabo de paciente embaixo
    16: "assembly-air",  # conjunto com módulo Air embaixo: a referência principal
    17: "module-cable",  # módulo de cabo isolado
    22: "module-air",  # módulo Air isolado
    50: "exploded-three-quarter",  # explodida em três quartos: referência de material e pose
}


def main() -> None:
    data = PDF.read_bytes()
    OUT.mkdir(parents=True, exist_ok=True)
    for old in OUT.glob("*.png"):
        old.unlink()

    found: list[tuple[int, int, int]] = []
    pos = 0
    n = 0
    while True:
        i = data.find(b"\xff\xd8\xff", pos)
        if i < 0:
            break
        j = data.find(b"\xff\xd9", i)
        if j < 0:
            break
        blob = data[i : j + 2]
        pos = j + 2
        try:
            im = Image.open(io.BytesIO(blob))
            im.load()
        except Exception:
            continue
        if im.width < 120 or im.height < 120:
            continue
        n += 1
        name = NAMED.get(n)
        stem = f"{n:02d}-{name}" if name else f"{n:02d}"
        im.convert("RGB").save(OUT / f"{stem}.png")
        found.append((n, im.width, im.height))

    manifest = {
        "source": str(PDF.relative_to(ROOT)),
        "count": len(found),
        "named": {f"{k:02d}": v for k, v in NAMED.items()},
        "images": [{"n": a, "w": b, "h": c} for a, b, c in found],
    }
    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
    print(f"{len(found)} renders em {OUT.relative_to(ROOT)}")
    for k, v in sorted(NAMED.items()):
        w, h = next((b, c) for a, b, c in found if a == k)
        print(f"  {k:02d}-{v}  {w}x{h}")


if __name__ == "__main__":
    main()
