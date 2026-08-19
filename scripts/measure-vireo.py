"""Mede o VIREO AM nos renders oficiais e recorta as faces para o modelo 3D.

Fonte: assets/device-source/renders/, extraídos do PDF CAD oficial por
scripts/extract-vireo-renders.py. Saída: lib/v2/vireo-metrics.json e os recortes
de face em public/device/model/.

QUATRO COISAS QUE ESTE SCRIPT CORRIGE em relação à primeira versão, e que só
apareceram quando o PDF inteiro foi aberto em vez de seis recortes feitos à mão:

  espessura   — a VISTA LATERAL existe (02-side). 158 px de perfil contra 554 px
                de largura de corpo, na mesma escala ortográfica: 0,285. Estava em
                0,33, chutado da espessura aparente do render em três quartos.
  três blocos — o aparelho é módulo superior + corpo + módulo inferior. O que a
                vista frontal isolada mostra como "abas cinzas" nas pontas são os
                DOCKS VAZIOS. O corpo sozinho tem aspecto 1,478, não 1,556.
  largura     — corpo e módulos têm a MESMA largura. O 0,989 anterior vinha de
                comparar recortes de renders em escalas diferentes.
  uma escala  — todas as faces do conjunto saem do MESMO render (16-assembly-air),
                então enquadramento e escala são coerentes por construção.

Unidade de tudo: LARGURA DO CORPO = 1. Y das medidas em unidade de corpo tem
origem no centro do corpo e cresce para cima, como na cena 3D.

Uso: python3 scripts/measure-vireo.py
"""

from __future__ import annotations

import json
from collections import deque
from dataclasses import dataclass
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "device-source" / "renders"
FACES = ROOT / "public" / "device" / "model"

# Fronteira da face escura em fração da largura. O trilho claro termina em 0,069 e
# a faixa escura começa em 0,081 nos renders medidos; 0,0745 é a fronteira
# geométrica entre os dois, com a linha de junção caindo em cima dela.
FACE_X0 = 0.0745
FACE_X1 = 0.9255

WHITE = 244

# ---------------------------------------------------------------- gradação
#
# Os renders CAD são cinza técnico: a face escura sai em luminância 53 e o metal
# em 179. O produto FOTOGRAFADO é outro: a face é vidro PRETO (luminância de
# albedo por volta de 14) e o casco é branco (232). Agrupando as cores das fotos
# em assets/device-source por k-means, os três aglomerados neutros aparecem em 46
# a 58, 74 a 88 e 211 a 215 nas três fotos — consistentes entre elas.
#
# A curva abaixo leva os NEUTROS do render para esses alvos e deixa os pixels
# saturados em paz. Sem a ressalva de croma, o laranja do wordmark e os arcos
# verde e azul do botão iam junto e o produto perdia a marca.

GRADE_DARK = 0.27  # fator nos escuros: 53 -> 14
GRADE_LIGHT_GAIN = 1.18  # ganho nos claros: 179 -> 233
GRADE_LIGHT_LIFT = 22
CHROMA_KEEP = 38  # croma a partir do qual a cor é preservada por inteiro
CHROMA_FADE = 18  # abaixo disto a gradação é total


def _grade_lut() -> list[float]:
    """Fator de escala por luminância de entrada, suavizado na transição."""
    lut = []
    for L in range(256):
        if L <= 70:
            out = GRADE_DARK * L
        elif L >= 150:
            out = min(255.0, GRADE_LIGHT_GAIN * L + GRADE_LIGHT_LIFT)
        else:
            # Smoothstep entre as duas pontas. Uma rampa reta deixava um halo
            # visível na borda entre a face e o metal.
            t = (L - 70) / 80
            t = t * t * (3 - 2 * t)
            a = GRADE_DARK * 70
            b = GRADE_LIGHT_GAIN * 150 + GRADE_LIGHT_LIFT
            out = a + (b - a) * t
        lut.append(out / max(1, L) if L else 0.0)
    return lut


LUT = _grade_lut()


def grade(im: Image.Image) -> Image.Image:
    """Aproxima um recorte de render CAD às cores do produto fotografado."""
    out = im.copy()
    px = out.load()
    w, h = out.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            croma = max(r, g, b) - min(r, g, b)
            if croma >= CHROMA_KEEP:
                continue
            lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
            k = LUT[min(255, int(lum))]
            # Croma intermediário recebe gradação parcial, senão a borda entre o
            # laranja e o preto ganha um contorno cinza.
            if croma > CHROMA_FADE:
                mix = (CHROMA_KEEP - croma) / (CHROMA_KEEP - CHROMA_FADE)
                k = 1 + (k - 1) * mix
            px[x, y] = (
                min(255, round(r * k)),
                min(255, round(g * k)),
                min(255, round(b * k)),
                a,
            )
    return out

# Proporção língua/bloco na peça isolada do módulo, medida por varredura de
# opacidade em 22-module-air: até 0,42 da altura a peça tem só a largura da língua.
TONGUE_FRAC = 0.42
TONGUE_W = 0.573


# --------------------------------------------------------------------- imagem


def load(stem: str) -> Image.Image:
    """Abre um render e transforma o fundo branco em alpha.

    Preenchimento a partir da borda, e não limiar global: o produto tem brancos
    internos — a etiqueta da traseira, o alívio de tensão, o feixe de cabos — que
    um limiar apagaria junto com o fundo.
    """
    im = Image.open(SRC / f"{stem}.png").convert("RGBA")
    w, h = im.size
    px = im.load()

    def is_bg(x: int, y: int) -> bool:
        r, g, b, _ = px[x, y]
        return r >= WHITE and g >= WHITE and b >= WHITE

    seen = bytearray(w * h)
    q: deque[tuple[int, int]] = deque()

    def push(x: int, y: int) -> None:
        if not seen[y * w + x] and is_bg(x, y):
            seen[y * w + x] = 1
            q.append((x, y))

    for x in range(w):
        push(x, 0)
        push(x, h - 1)
    for y in range(h):
        push(0, y)
        push(w - 1, y)
    while q:
        x, y = q.popleft()
        px[x, y] = (255, 255, 255, 0)
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h:
                push(nx, ny)
    return im


@dataclass(frozen=True)
class Box:
    x0: int
    y0: int
    x1: int
    y1: int

    @property
    def w(self) -> int:
        return self.x1 - self.x0

    @property
    def h(self) -> int:
        return self.y1 - self.y0


def bbox(im: Image.Image) -> Box:
    px = im.load()
    w, h = im.size

    def op(x: int, y: int) -> bool:
        return px[x, y][3] > 160

    xs = [x for x in range(w) if any(op(x, y) for y in range(0, h, 2))]
    ys = [y for y in range(h) if any(op(x, y) for x in range(0, w, 2))]
    return Box(min(xs), min(ys), max(xs) + 1, max(ys) + 1)


def row_width(im: Image.Image, b: Box, y: int) -> int:
    px = im.load()
    r = [x for x in range(b.x0, b.x1) if px[x, y][3] > 160]
    return (max(r) - min(r) + 1) if r else 0


def full_width_span(im: Image.Image, b: Box) -> tuple[int, int]:
    """Faixa vertical onde a peça está na largura cheia."""
    ys = [y for y in range(b.y0, b.y1) if row_width(im, b, y) >= b.w - 2]
    return min(ys), max(ys) + 1


def part_span(im: Image.Image, b: Box) -> tuple[int, int]:
    """Faixa vertical do CORPO da peça, incluindo as pontas arredondadas.

    Cresce a partir da faixa de largura cheia até a largura cair abaixo de 55%.
    É o que separa o aparelho do cabo que sai dele.
    """
    y0, y1 = full_width_span(im, b)
    while y0 > b.y0 and row_width(im, b, y0 - 1) > b.w * 0.55:
        y0 -= 1
    while y1 < b.y1 and row_width(im, b, y1) > b.w * 0.55:
        y1 += 1
    return y0, y1


def seams(im: Image.Image, b: Box, y_from: int, y_to: int) -> list[int]:
    """Junções entre blocos: linhas escuras atravessando o trilho metálico."""
    px = im.load()
    band = range(b.x0 + int(b.w * 0.012), b.x0 + int(b.w * 0.055))
    vals: list[tuple[int, float]] = []
    for y in range(y_from, y_to):
        lit = [sum(px[x, y][:3]) / 3 for x in band if px[x, y][3] > 160]
        vals.append((y, sum(lit) / len(lit) if lit else 255.0))
    ref = sorted(v for _, v in vals)[len(vals) // 2]
    hits = [y for y, v in vals if v < ref - 26]
    if not hits:
        return []
    out: list[int] = []
    run = [hits[0]]
    for y in hits[1:]:
        if y - run[-1] <= 12:
            run.append(y)
        else:
            out.append(sum(run) // len(run))
            run = [y]
    out.append(sum(run) // len(run))
    return out


def region(im: Image.Image, b: Box, test) -> Box:
    px = im.load()
    pts = [
        (x, y)
        for y in range(b.y0, b.y1)
        for x in range(b.x0, b.x1)
        if px[x, y][3] > 160 and test(*px[x, y][:3])
    ]
    if not pts:
        raise SystemExit("região não encontrada; o render mudou?")
    return Box(
        min(p[0] for p in pts),
        min(p[1] for p in pts),
        max(p[0] for p in pts) + 1,
        max(p[1] for p in pts) + 1,
    )


# ------------------------------------------------------- conjunto de referência

asm = load("16-assembly-air")
A = bbox(asm)
UNIT = A.w  # largura do conjunto = largura do corpo = 1 unidade
ASM_TOP, ASM_BOTTOM = part_span(asm, A)
ASM_H = ASM_BOTTOM - ASM_TOP

found = seams(asm, A, ASM_TOP + int(ASM_H * 0.05), ASM_BOTTOM - int(ASM_H * 0.05))
inner = [y for y in found if ASM_H * 0.12 < (y - ASM_TOP) < ASM_H * 0.88]
if len(inner) < 2:
    raise SystemExit(f"esperava 2 junções entre os blocos, achei {found}")
SEAM_TOP, SEAM_BOTTOM = min(inner), max(inner)

BODY_H = (SEAM_BOTTOM - SEAM_TOP) / UNIT
TOP_H = (SEAM_TOP - ASM_TOP) / UNIT
BOTTOM_H = (ASM_BOTTOM - SEAM_BOTTOM) / UNIT
BODY_MID = (SEAM_TOP + SEAM_BOTTOM) / 2


def body_y(y: float) -> float:
    return round((BODY_MID - y) / UNIT, 5)


# --------------------------------------------------------------- vista lateral
#
# As duas vistas ortográficas saem do PDF na mesma escala: a frontal tem 860 px de
# altura de aparelho e a lateral 857. O perfil pode ser lido direto contra a
# largura da frontal.
front = load("01-front-with-docks")
F = bbox(front)
side = load("02-side")
S = bbox(side)
if abs(F.h - S.h) > F.h * 0.02:
    raise SystemExit("frontal e lateral não estão na mesma escala")
DEPTH = round(S.w / F.w, 5)


# ------------------------------------------------------------- tela e botão
#
# A tela apagada é (61,68,61) e a face é (50,54,57): quase o mesmo cinza. O que
# separa as duas é o VERDE — a tela puxa para o verde, a face para o azul. Um
# limiar de luminância pega as duas e devolve a face inteira como tela.
body_box = Box(A.x0 + int(UNIT * 0.16), SEAM_TOP, A.x1 - int(UNIT * 0.16), SEAM_BOTTOM)


def is_screen(x: int, y: int) -> bool:
    r, g, b, a = asm.load()[x, y]
    return a > 160 and 45 < g < 95 and g - r >= 4 and g - b >= 4


def grow_screen() -> Box:
    """Cresce a tela a partir de uma semente, em vez de coletar por cor na face.

    Coletar por cor devolvia a face inteira: ela é (50,54,57) e a tela apagada é
    (61,68,61) — o único sinal é o desvio para o verde, e o antialiasing das
    letras e do botão produz pixels isolados que passam no mesmo teste e esticam
    a caixa. Crescimento contíguo ignora esses pixels soltos.
    """
    cx = (A.x0 + A.x1) // 2
    seed = next(
        (y for y in range(SEAM_TOP, SEAM_BOTTOM) if is_screen(cx, y)),
        None,
    )
    if seed is None:
        raise SystemExit("não achei a tela na coluna central")
    y0 = seed
    while y0 > SEAM_TOP and is_screen(cx, y0 - 1):
        y0 -= 1
    y1 = seed
    while y1 + 1 < SEAM_BOTTOM and is_screen(cx, y1 + 1):
        y1 += 1
    mid = (y0 + y1) // 2
    x0 = cx
    while x0 > body_box.x0 and is_screen(x0 - 1, mid):
        x0 -= 1
    x1 = cx
    while x1 + 1 < body_box.x1 and is_screen(x1 + 1, mid):
        x1 += 1
    return Box(x0, y0, x1 + 1, y1 + 1)


screen = grow_screen()
arcs = region(
    asm,
    body_box,
    lambda r, g, b: (g > 140 and g - r > 55 and g - b > 55)
    or (b > 140 and b - r > 55 and b - g > 35),
)


# ------------------------------------------------------------ recorte de faces

faces: dict[str, dict[str, float]] = {}


def dim_led(piece: Image.Image, cx: float, cy: float, r: float) -> None:
    """Apaga os arcos verde e azul do botão na arte base.

    No aparelho aquilo é uma LUZ, não pintura. Se ela fica acesa na textura, o LED
    da animação não tem como apagar: a cor continuaria ali com o aparelho
    desmontado. Escurecido, o anel lê como LED apagado e a sobreposição aditiva o
    acende quando deve.
    """
    px = piece.load()
    x0, y0 = int(cx - r), int(cy - r)
    x1, y1 = int(cx + r) + 1, int(cy + r) + 1
    for y in range(max(0, y0), min(piece.height, y1)):
        for x in range(max(0, x0), min(piece.width, x1)):
            d = ((x - cx) ** 2 + (y - cy) ** 2) ** 0.5
            if d > r:
                continue
            # Borda suave nos 12% externos, senão aparece um disco recortado.
            k = 0.2 if d < r * 0.88 else 0.2 + 0.8 * ((d - r * 0.88) / (r * 0.12))
            rr, gg, bb, aa = px[x, y]
            px[x, y] = (round(rr * k), round(gg * k), round(bb * k), aa)


def crop(im: Image.Image, unit: int, b: Box, out: str, key: str) -> None:
    piece = grade(im.crop((b.x0, b.y0, b.x1, b.y1)))
    FACES.mkdir(parents=True, exist_ok=True)
    piece.save(FACES / out)
    faces[key] = {
        "file": f"/device/model/{out}",
        "w": round(piece.width / unit, 5),
        "h": round(piece.height / unit, 5),
    }


def face_x(x_left: int, unit: int) -> tuple[int, int]:
    return x_left + round(unit * FACE_X0), x_left + round(unit * FACE_X1)


fx0, fx1 = face_x(A.x0, UNIT)
crop(asm, UNIT, Box(fx0, SEAM_TOP, fx1, SEAM_BOTTOM), "face-body.png", "bodyFront")

# O botão fica na arte da frente do corpo; apaga o LED nela.
_body = Image.open(FACES / "face-body.png").convert("RGBA")
dim_led(
    _body,
    cx=(0.5 - FACE_X0) * UNIT,
    cy=(arcs.y0 + arcs.y1) / 2 - SEAM_TOP,
    r=arcs.w / 2 * 1.6,
)
_body.save(FACES / "face-body.png")
crop(asm, UNIT, Box(fx0, ASM_TOP, fx1, SEAM_TOP), "face-top.png", "moduleTop")

# Módulos inferiores: dos renders ISOLADOS, que trazem o badge. O conjunto mostra
# um módulo liso, sem marcação. A escala vem da largura própria de cada render —
# módulo e corpo têm a mesma largura, então normalizar por ela basta.
for stem, out, key in (
    ("22-module-air", "face-air.png", "air"),
    ("17-module-cable", "face-cable.png", "cable"),
):
    mod = load(stem)
    M = bbox(mod)
    m_top, _ = full_width_span(mod, M)
    _, m_bottom = part_span(mod, M)
    mfx0, mfx1 = face_x(M.x0, M.w)
    crop(mod, M.w, Box(mfx0, m_top, mfx1, m_bottom), out, key)

# Alívio de tensão: mede a faixa acima do módulo onde a peça afina, para o modelo
# saber onde o feixe começa. O feixe em si é GEOMETRIA — doze tubos em curva —, então
# não há decalque a recortar aqui.
harness = Box(A.x0, A.y0, A.x1, ASM_TOP)
hw = [row_width(asm, A, y) for y in range(harness.y0, harness.y1)]
strain_h = 0
for i, v in enumerate(reversed(hw)):
    if v < UNIT * 0.46:
        strain_h = i
        break
CABLE_TOP = harness.y1 - strain_h
cable_row = CABLE_TOP - 4
cpx = asm.load()
cxs = [x for x in range(A.x0, A.x1) if cpx[x, cable_row][3] > 160]

# Módulos inferiores: dos renders ISOLADOS, que trazem o badge. O conjunto mostra
# um módulo liso, sem marcação. A escala vem da largura própria de cada render —
# módulo e corpo têm a mesma largura, então normalizar por ela basta.
for stem, out, key in (
    ("22-module-air", "face-air.png", "air"),
    ("17-module-cable", "face-cable.png", "cable"),
):
    mod = load(stem)
    M = bbox(mod)
    m_top, _ = full_width_span(mod, M)
    _, m_bottom = part_span(mod, M)
    mfx0, mfx1 = face_x(M.x0, M.w)
    crop(mod, M.w, Box(mfx0, m_top, mfx1, m_bottom), out, key)

# Módulo de cabo: do conjunto com cabo, na escala DELE.
cable_asm = load("15-assembly-cable")
C = bbox(cable_asm)
C_TOP, C_BOTTOM = part_span(cable_asm, C)
c_found = seams(
    cable_asm, C, C_TOP + int((C_BOTTOM - C_TOP) * 0.05), C_BOTTOM - int((C_BOTTOM - C_TOP) * 0.05)
)
c_inner = [y for y in c_found if (C_BOTTOM - C_TOP) * 0.12 < (y - C_TOP) < (C_BOTTOM - C_TOP) * 0.88]
# Cabo de paciente abaixo do módulo, medido no mesmo render.
cpx2 = cable_asm.load()
lead = []
for y in range(C_BOTTOM, C.y1):
    r = [x for x in range(C.x0, C.x1) if cpx2[x, y][3] > 160]
    if r:
        lead.append((y, (max(r) - min(r) + 1) / C.w))
lead_top_w = lead[2][1] if len(lead) > 2 else 0.16
lead_bottom_w = lead[-3][1] if len(lead) > 3 else 0.06

back = load("05-back")
B = bbox(back)
B_TOP, B_BOTTOM = full_width_span(back, B)
bfx0, bfx1 = face_x(B.x0, B.w)
crop(back, B.w, Box(bfx0, B_TOP, bfx1, B_BOTTOM), "face-body-back.png", "bodyBack")


metrics = {
    "note": "Tudo em unidades de LARGURA DO CORPO. Medido nos renders CAD oficiais.",
    "source": "assets/device-source/renders/ (extraídos do PDF oficial)",
    "body": {"aspect": round(BODY_H, 5), "depth": DEPTH, "corner": 0.06},
    "rail": {"w": FACE_X0},
    "face": {"x0": FACE_X0, "x1": FACE_X1, "w": round(FACE_X1 - FACE_X0, 5)},
    "screen": {
        "w": round(screen.w / UNIT, 5),
        "h": round(screen.h / UNIT, 5),
        "cy": body_y((screen.y0 + screen.y1) / 2),
    },
    "button": {
        "cy": body_y((arcs.y0 + arcs.y1) / 2),
        "r": round(arcs.w / 2 / UNIT, 5),
    },
    "module": {
        "topH": round(TOP_H, 5),
        "bottomH": round(BOTTOM_H, 5),
        # Raio da ponta externa: ajustado às larguras medidas a 0,04 e 0,08 da
        # altura do conjunto. É o U metálico das extremidades.
        "corner": 0.23,
        "tongue": {
            "w": TONGUE_W,
            "h": round(BOTTOM_H / (1 - TONGUE_FRAC) * TONGUE_FRAC, 5),
        },
    },
    "harness": {
        "strain": {"h": round(strain_h / UNIT, 5), "wTop": 0.453, "wBottom": 0.621},
        "cableW": round((max(cxs) + 1 - min(cxs)) / UNIT, 5),
        "cableH": round((CABLE_TOP - A.y0) / UNIT, 5),
    },
    "lead": {
        "coneTop": round(lead_top_w / 2, 5),
        "coneBottom": round(lead_bottom_w / 2, 5),
        "h": round((C.y1 - C_BOTTOM) / C.w, 5),
    },
    "faces": faces,
    "assembly": {"aspect": round(ASM_H / UNIT, 5)},
}

(ROOT / "lib" / "v2" / "vireo-metrics.json").write_text(
    json.dumps(metrics, indent=2) + "\n"
)
print(json.dumps(metrics, indent=2))
