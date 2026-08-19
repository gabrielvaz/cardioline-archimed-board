"""Mede o VIREO AM nos renders oficiais e recorta as faces para o modelo 3D.

Existe para que a geometria não seja chutada: cada número sai de uma medição em
assets/vireo-layers/ (recortes dos renders CAD oficiais), normalizado pela
LARGURA DO CORPO, e vai para lib/v2/vireo-metrics.json. O modelo 3D lê de lá.

Também recorta a área de FACE de cada render — só a parte escura chapada, sem os
trilhos metálicos. Os trilhos passam a ser geometria de verdade (é o que faz a
rotação ler como objeto); as faces continuam sendo a arte oficial.

Uso: python3 scripts/measure-vireo.py
"""

from __future__ import annotations

import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
LAYERS = ROOT / "assets" / "vireo-layers"
FACES = ROOT / "public" / "device" / "model"

# Fronteiras da face, em fração da largura do corpo. Medido em três renders
# independentes (corpo, módulo Air, módulo de cabo): o trilho claro termina em
# 0,069..0,079 e a faixa escura começa em 0,081, o que confirma que trilho e face
# são contínuos entre corpo e módulo — por isso um único par de números serve aos
# três.
FACE_X0 = 0.0745
FACE_X1 = 0.9255

# Profundidade do corpo em larguras de corpo. ESTIMATIVA, lida da espessura
# aparente do render em três quartos; os renders oficiais não incluem vista
# lateral a 90°, então a espessura exata precisaria do CAD da Cardioline.
DEPTH = 0.33

# Largura do módulo em larguras de corpo: 544 px de módulo contra 550 do corpo,
# no mesmo render do PDF.
MODULE_W = 544 / 550

# O render do módulo de cabo é mais alto (inclui o cabo pendurado), mas a peça é
# a mesma: língua e bloco têm a mesma altura em pixels nos dois renders. Daí as
# frações do bloco no render do cabo.
CABLE_BODY = (153.7 / 650, 366.0 / 650)

# Cabo abaixo do bloco, em unidades de corpo: cone de alívio e depois o cabo.
CABLE_CONE = {"rTop": 0.079, "rBottom": 0.059, "h": 0.384}
CABLE_LEAD = {"r": 0.029, "h": 1.2}

# Fração da altura do render do módulo ocupada pela língua do conector, medida na
# varredura de opacidade: até 0,42 a peça tem só a largura da língua.
TONGUE_FRAC = 0.42


def body_box(im: Image.Image) -> tuple[int, int, int, int]:
    w, h = im.size
    px = im.load()

    def opaque(x: int, y: int) -> bool:
        return px[x, y][3] > 200

    xs = [x for x in range(w) if any(opaque(x, y) for y in range(0, h, 3))]
    ys = [y for y in range(h) if any(opaque(x, y) for x in range(0, w, 3))]
    return min(xs), min(ys), max(xs) + 1, max(ys) + 1


def load(name: str) -> tuple[Image.Image, tuple[int, int, int, int]]:
    im = Image.open(LAYERS / f"{name}.png").convert("RGBA")
    return im, body_box(im)


def crop_face(
    name: str,
    out: str,
    width_in_body_units: float,
    pad_top: int = 0,
    y_from: float = 0.0,
    y_to: float = 1.0,
) -> dict[str, float]:
    """Recorta a faixa de face e devolve seu tamanho em unidades de corpo.

    Cada render tem a própria escala em pixels — a traseira sai do PDF com 421 px
    de largura de corpo e a frente com 550 —, então a normalização é sempre pelo
    bbox DA PRÓPRIA imagem, multiplicado pela largura da peça em unidades de
    corpo. Normalizar tudo pela largura da frente esticava a traseira em 30%.

    pad_top acrescenta linhas transparentes no topo: o render da traseira está
    4 px curto e, sem isso, frente e traseira não casam na rotação.

    y_from e y_to cortam o recorte na vertical. Nos módulos ele descarta a língua do conector,
    que passa a ser geometria: ela entra dentro do corpo quando acoplada, então
    não pode ser uma textura chapada no mesmo plano da face.
    """
    im, (x0, y0, x1, y1) = load(name)
    w = x1 - x0
    fx0 = x0 + round(w * FACE_X0)
    fx1 = x0 + round(w * FACE_X1)
    ih = y1 - y0
    face = im.crop((fx0, y0 + round(ih * y_from), fx1, y0 + round(ih * y_to)))
    if pad_top:
        padded = Image.new("RGBA", (face.width, face.height + pad_top), (0, 0, 0, 0))
        padded.alpha_composite(face, (0, pad_top))
        face = padded
    FACES.mkdir(parents=True, exist_ok=True)
    face.save(FACES / out)
    unit = w / width_in_body_units
    return {
        "file": f"/device/model/{out}",
        "w": round(face.width / unit, 5),
        "h": round(face.height / unit, 5),
    }


body, (bx0, by0, bx1, by1) = load("front-off")
BW = bx1 - bx0
BH = by1 - by0
px = body.load()


def frac_x(x: int) -> float:
    return (x - bx0) / BW


def frac_y(y: int) -> float:
    return (y - by0) / BH


def grey(x: int, y: int) -> bool:
    r, g, b, a = px[x, y]
    return a > 200 and 70 < r < 140 and abs(r - g) < 10 and abs(g - b) < 14


# --- tela apagada: cresce a partir de uma semente no terço superior da face.
cx = (bx0 + bx1) // 2
seed = by0 + int(BH * 0.35)
if not grey(cx, seed):
    raise SystemExit("não achei a tela na semente; o render mudou?")
sy0 = seed
while grey(cx, sy0 - 1):
    sy0 -= 1
sy1 = seed
while grey(cx, sy1 + 1):
    sy1 += 1
mid = (sy0 + sy1) // 2
sx0 = cx
while grey(sx0 - 1, mid):
    sx0 -= 1
sx1 = cx
while grey(sx1 + 1, mid):
    sx1 += 1


def arc(pred) -> tuple[int, int, int, int]:
    pts = [
        (x, y)
        for y in range(by0, by1)
        for x in range(bx0, bx1)
        if px[x, y][3] > 200 and pred(*px[x, y][:3])
    ]
    return (
        min(p[0] for p in pts),
        min(p[1] for p in pts),
        max(p[0] for p in pts) + 1,
        max(p[1] for p in pts) + 1,
    )


gx0, gy0, gx1, gy1 = arc(lambda r, g, b: g > 150 and g - r > 60 and g - b > 60)
bx0b, by0b, bx1b, by1b = arc(lambda r, g, b: b > 150 and b - r > 60 and b - g > 40)
btn_x = (min(gx0, bx0b) + max(gx1, bx1b)) / 2
btn_y = (min(gy0, by0b) + max(gy1, by1b)) / 2

ASPECT = BH / BW

metrics = {
    "note": "Tudo em unidades de LARGURA DO CORPO. Y cresce para baixo nas frações de render.",
    "source": "assets/vireo-layers/ (recortes dos renders CAD oficiais)",
    "aspect": round(ASPECT, 5),
    "depth": DEPTH,
    "face": {"x0": FACE_X0, "x1": FACE_X1, "w": round(FACE_X1 - FACE_X0, 5)},
    # Tela em unidades de corpo, com origem no centro do corpo e Y para cima.
    "screen": {
        "w": round((sx1 + 1 - sx0) / BW, 5),
        "h": round((sy1 + 1 - sy0) / BW, 5),
        "cy": round((0.5 - (frac_y(sy0) + frac_y(sy1 + 1)) / 2) * ASPECT, 5),
    },
    "button": {
        "cy": round((0.5 - frac_y(int(btn_y))) * ASPECT, 5),
        "r": round((max(gx1, bx1b) - min(gx0, bx0b)) / 2 / BW, 5),
    },
    # Abas cinzas: uma faixa no topo e um ressalto no centro da base.
    "tabTop": {"x0": 0.2436, "x1": 0.7564, "h": round(0.032 * ASPECT, 5)},
    "tabBottom": {"x0": 0.4127, "x1": 0.5855, "h": round(0.022 * ASPECT, 5)},
    "faces": {
        "front": crop_face("front-off", "face-front.png", 1.0),
        "back": crop_face("back", "face-back.png", 1.0, pad_top=4),
        "air": crop_face("module-air", "face-air.png", MODULE_W, y_from=TONGUE_FRAC),
        "cable": crop_face(
            "module-cable",
            "face-cable.png",
            MODULE_W,
            y_from=CABLE_BODY[0],
            y_to=CABLE_BODY[1],
        ),
    },
    # Módulo: a língua entra no corpo, o bloco fica visível abaixo dele.
    "module": {
        "w": round(MODULE_W, 5),
        "tongue": {"w": round(0.579 * MODULE_W, 5), "h": round(TONGUE_FRAC * 366 / 544 * MODULE_W, 5)},
        "body": {"h": round((1 - TONGUE_FRAC) * 366 / 544 * MODULE_W, 5), "radius": 0.17},
        # Centro do badge na altura do BLOCO (não do render inteiro), fração a partir
        # do topo do bloco.
        "badgeCy": round((0.646 - TONGUE_FRAC) / (1 - TONGUE_FRAC), 4),
        "cableCone": CABLE_CONE,
        "cableLead": CABLE_LEAD,
    },
}

(ROOT / "lib" / "v2" / "vireo-metrics.json").write_text(
    json.dumps(metrics, indent=2) + "\n"
)
print(json.dumps(metrics, indent=2))
