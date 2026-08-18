"""Monta a sequência de frames do showcase do VIREO AM.

TODO PIXEL DO PRODUTO VEM DE RENDER OFICIAL. Nada aqui é gerado nem
redesenhado: as camadas em assets/vireo-layers/ foram recortadas dos renders
CAD do PDF oficial (assets/device-source/VIREO-AM-renders-1.pdf) pelo
scripts/cutout-device.py, e este script apenas as compõe e move.

Por que composição em código e não geração de imagem: um gerador texto-para-imagem
não recebe o produto como referência, então cada chamada devolve um aparelho
diferente — proporções, conectores e encaixes mudam de frame para frame. Isso
falha justamente no critério principal, que é parecer UM único VIREO AM em
movimento. Compondo, a geometria é literalmente a mesma em todos os frames.

ETAPAS (cada uma com contagem de frames configurável em STAGES):
  1 hold      aparelho montado com o módulo de cabo, tela acesa
  2 undock    o módulo de cabo desce e se separa; o encaixe fica visível
  3 rotate    revelação da traseira e volta, por dissolução entre ângulos reais
  4 dock      o módulo Air sobe e acopla no encaixe
  5 power     a tela acende e a composição assenta

Uso:
    python3 scripts/build-vireo-frames.py            # resolução desktop
    python3 scripts/build-vireo-frames.py --mobile   # metade da resolução
"""

from __future__ import annotations

import json
import math
import shutil
import sys
from dataclasses import dataclass
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
LAYERS = ROOT / "assets" / "vireo-layers"
# A vista frontal oficial tem a tela apagada. O conteúdo aceso vem de uma FOTO
# real do aparelho, tirada quase de frente, então não há perspectiva a corrigir:
# é a tela real do produto real.
SCREEN_SRC = (
    ROOT / "assets" / "device-source" / "2A1A7BDC-BA78-451D-9C9F-9A8F17502FDB.jpeg"
)

# ---------------------------------------------------------------- configuração

# Canvas de composição. O aparelho é retrato, então o quadro é retrato.
CANVAS = (1000, 1250)
CANVAS_MOBILE = (620, 775)

# Altura do corpo dentro do quadro, como fração da altura do canvas.
BODY_SCALE = 0.52

# Topo do corpo, como fração da altura do canvas. O aparelho não fica centrado:
# a metade de baixo é reservada ao curso do módulo, senão ele sai do quadro ao se
# separar e o estado 2 aparece como uma tira escura cortada na borda.
BODY_TOP = 0.05

# Deslocamento do módulo quando totalmente separado, em fração da altura do corpo.
UNDOCK_TRAVEL = 0.20

# Sobreposição do conector quando acoplado, em fração da altura do módulo.
CONNECTOR_BITE = 0.16


@dataclass(frozen=True)
class Stage:
    name: str
    frames: int


# Mexer aqui muda a duração relativa de cada etapa na rolagem. O componente lê a
# mesma lista do manifest, então nada precisa ser ajustado em dois lugares.
STAGES: tuple[Stage, ...] = (
    Stage("hold", 6),
    Stage("undock", 26),
    Stage("rotate", 34),
    Stage("dock", 26),
    Stage("power", 14),
)


def ease_in_out(t: float) -> float:
    """Suaviza início e fim. O módulo não parte nem chega em velocidade máxima."""
    return t * t * (3 - 2 * t)


def load(name: str) -> Image.Image:
    p = LAYERS / f"{name}.png"
    if not p.exists():
        raise SystemExit(f"camada ausente: {p}\nrode antes o cutout-device.py")
    return Image.open(p).convert("RGBA")


def fit_height(im: Image.Image, height: int) -> Image.Image:
    w = max(1, round(im.width * height / im.height))
    return im.resize((w, height), Image.LANCZOS)


def paste_center_x(base: Image.Image, layer: Image.Image, top: int, dx: int = 0) -> None:
    x = (base.width - layer.width) // 2 + dx
    base.alpha_composite(layer, (x, top))


def find_screen(body: Image.Image) -> tuple[int, int, int, int]:
    """Localiza o retângulo da tela apagada na vista frontal, medindo.

    Medir em vez de fixar frações: se a camada frontal for substituída por outro
    render, a área da tela continua correta sem ninguém precisar recalibrar
    números à mão. Foi um par de frações erradas aqui que fez o conteúdo da tela
    aparecer deslocado para cima, cobrindo o wordmark.

    A tela desligada é o único retângulo de cinza médio neutro no terço superior.
    """
    w, h = body.size
    px = body.load()

    def is_screen(x: int, y: int) -> bool:
        r, g, b, a = px[x, y]
        return a > 200 and 70 < r < 130 and abs(r - g) < 10 and abs(g - b) < 12

    x_from, x_to = int(w * 0.08), int(w * 0.92)
    y_from, y_to = int(h * 0.05), int(h * 0.60)

    # Perfis de linha e coluna, e não a caixa de todos os pixels que casam. Um
    # bbox global é inflado por qualquer cinza solto fora do retângulo (o anel do
    # botão, um reflexo na lateral), e foi isso que fez o conteúdo da tela
    # transbordar o bezel e cobrir o wordmark.
    rows = [sum(1 for x in range(x_from, x_to) if is_screen(x, y)) for y in range(y_from, y_to)]
    if not any(rows):
        raise SystemExit("não localizei a tela na camada frontal")
    row_gate = max(rows) * 0.55
    ys = [y_from + i for i, c in enumerate(rows) if c >= row_gate]

    cols = [sum(1 for y in ys if is_screen(x, y)) for x in range(x_from, x_to)]
    col_gate = max(cols) * 0.55
    xs = [x_from + i for i, c in enumerate(cols) if c >= col_gate]

    return (min(xs), min(ys), max(xs) + 1, max(ys) + 1)


def screen_content(size: tuple[int, int]) -> Image.Image:
    """Recorta o conteúdo da tela de uma foto real do aparelho ligado."""
    src = Image.open(SCREEN_SRC).convert("RGBA")
    # Região da tela na foto, medida uma vez e fixada aqui.
    box = (
        int(src.width * 0.285),
        int(src.height * 0.375),
        int(src.width * 0.625),
        int(src.height * 0.585),
    )
    return src.crop(box).resize(size, Image.LANCZOS)


def build(mobile: bool = False) -> None:
    canvas_size = CANVAS_MOBILE if mobile else CANVAS
    out_dir = ROOT / "public" / "vireo-am-scroll" / ("mobile" if mobile else "desktop")
    if out_dir.exists():
        shutil.rmtree(out_dir)
    out_dir.mkdir(parents=True)

    front = load("front-off")
    back = load("back")
    three_q = load("three-quarter")
    mod_cable = load("module-cable")
    mod_air = load("module-air")

    body_h = round(canvas_size[1] * BODY_SCALE)
    front = fit_height(front, body_h)
    # A traseira e o 3/4 entram na MESMA altura de corpo, senão a rotação muda de
    # tamanho no meio do caminho e deixa de parecer o mesmo objeto.
    back = fit_height(back, body_h)
    three_q = fit_height(three_q, round(body_h * 0.82))

    mod_w = round(front.width * 0.94)
    mod_cable = mod_cable.resize(
        (mod_w, max(1, round(mod_cable.height * mod_w / mod_cable.width))), Image.LANCZOS
    )
    mod_air = mod_air.resize(
        (mod_w, max(1, round(mod_air.height * mod_w / mod_air.width))), Image.LANCZOS
    )

    body_top = round(canvas_size[1] * BODY_TOP)
    dock_top = body_top + body_h - round(mod_cable.height * CONNECTOR_BITE)
    travel = round(body_h * UNDOCK_TRAVEL)

    screen_box = find_screen(front)
    screen_on = screen_content(
        (screen_box[2] - screen_box[0], screen_box[3] - screen_box[1])
    )

    def frame() -> Image.Image:
        return Image.new("RGBA", canvas_size, (255, 255, 255, 255))

    def with_screen(body: Image.Image, amount: float) -> Image.Image:
        """Acende a tela misturando o conteúdo real sobre a tela apagada."""
        if amount <= 0.001:
            return body
        out = body.copy()
        lit = screen_on.copy()
        if amount < 1:
            alpha = lit.getchannel("A").point(lambda v: int(v * amount))
            lit.putalpha(alpha)
        out.alpha_composite(lit, (screen_box[0], screen_box[1]))
        return out

    frames: list[Image.Image] = []

    # ---- 1 hold: montado com o módulo de cabo, tela acesa
    for _ in range(STAGES[0].frames):
        f = frame()
        paste_center_x(f, mod_cable, dock_top)
        paste_center_x(f, with_screen(front, 1.0), body_top)
        frames.append(f)

    # ---- 2 undock: o módulo de cabo desce e se separa
    for i in range(STAGES[1].frames):
        t = ease_in_out((i + 1) / STAGES[1].frames)
        f = frame()
        paste_center_x(f, mod_cable, dock_top + round(travel * t))
        paste_center_x(f, with_screen(front, 1.0), body_top)
        frames.append(f)

    # ---- 3 rotate: frente -> 3/4 -> traseira -> 3/4 espelhado -> frente
    #
    # Compressão horizontal entre ângulos REAIS. Os renders oficiais não incluem
    # as laterais em 90 graus, então esta etapa é uma revelação da traseira e
    # volta, no registro de um cartão girando, e não um turntable fotorreal.
    # Trocar por um turntable real é só substituir esta lista de ângulos.
    key = [
        (0.00, front, False),
        (0.22, three_q, False),
        (0.50, back, False),
        (0.78, three_q, True),
        (1.00, front, False),
    ]
    for i in range(STAGES[2].frames):
        t = (i + 1) / STAGES[2].frames
        seg = next(n for n in range(len(key) - 1) if key[n + 1][0] >= t or n == len(key) - 2)
        t0, a, ma = key[seg]
        t1, b, mb = key[seg + 1]
        local = 0.0 if t1 == t0 else (t - t0) / (t1 - t0)
        local = min(1.0, max(0.0, local))

        # Sem dissolução cruzada: o ângulo que sai é comprimido até quase zero de
        # largura e só então o que entra se abre. Sobrepor os dois com alpha
        # produzia dupla exposição, que lê como fantasma e não como giro.
        if local < 0.5:
            img, mirror, k = a, ma, 1.0 - local * 2
        else:
            img, mirror, k = b, mb, (local - 0.5) * 2
        # Mínimo de 18% e não zero: visto de perfil o aparelho continua sendo um
        # slab com espessura. Comprimir até quase nada fazia o produto desaparecer
        # por vários frames, o que lê como piscada e não como giro.
        k = max(0.18, ease_in_out(k))

        im = img.transpose(Image.FLIP_LEFT_RIGHT) if mirror else img
        w = max(1, round(im.width * k))
        im = im.resize((w, im.height), Image.LANCZOS)

        f = frame()
        paste_center_x(f, im, body_top + (body_h - im.height) // 2)
        frames.append(f)

    # ---- 4 dock: o módulo Air sobe e acopla
    for i in range(STAGES[3].frames):
        t = ease_in_out((i + 1) / STAGES[3].frames)
        f = frame()
        paste_center_x(f, mod_air, dock_top + round(travel * (1 - t)))
        paste_center_x(f, front, body_top)
        frames.append(f)

    # ---- 5 power: a tela acende
    for i in range(STAGES[4].frames):
        t = ease_in_out((i + 1) / STAGES[4].frames)
        f = frame()
        paste_center_x(f, mod_air, dock_top)
        paste_center_x(f, with_screen(front, t), body_top)
        frames.append(f)

    for i, f in enumerate(frames, start=1):
        f.convert("RGB").save(out_dir / f"frame-{i:03d}.webp", "WEBP", quality=86, method=6)

    manifest = {
        "count": len(frames),
        "width": canvas_size[0],
        "height": canvas_size[1],
        "stages": [{"name": s.name, "frames": s.frames} for s in STAGES],
        "pattern": f"/vireo-am-scroll/{'mobile' if mobile else 'desktop'}/frame-{{n}}.webp",
    }
    (out_dir / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")

    total = sum(p.stat().st_size for p in out_dir.glob("*.webp"))
    print(
        f"{out_dir.relative_to(ROOT)}  {len(frames)} frames  "
        f"{canvas_size[0]}x{canvas_size[1]}  {total / 1024 / 1024:.2f} MB  "
        f"media {total / len(frames) / 1024:.0f} KB"
    )


if __name__ == "__main__":
    build(mobile="--mobile" in sys.argv)
