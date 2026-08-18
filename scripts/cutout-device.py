"""Recorta o fundo dos renders do VIREO AM preservando o hardware real.

Por que em código e não com geração de imagem: o gpt-image só gera a partir de
texto, não edita. Um "VIREO AM" descrito em prompt seria um aparelho inventado,
com proporções e conectores que não existem. Aqui os pixels do dispositivo são
exatamente os do render oficial; só o fundo sai.

Por que flood fill a partir da borda e não threshold de branco: a carcaça do
aparelho TAMBÉM é branca. Um threshold global comeria o corpo do produto. O
fundo é a região branca conectada à borda da imagem, e é só ela que sai — o
branco interno da carcaça não é alcançado pela busca.

Uso:
    python3 scripts/cutout-device.py <entrada> <saida.png> [--drop-cables]
"""

import sys
from collections import deque

from PIL import Image, ImageFilter

# Um pixel só é candidato a fundo se for quase branco em todos os canais. A
# carcaça clara do aparelho tem sombreado e fica abaixo disso.
WHITE_FLOOR = 244
# Diferença máxima entre canais: fundo de estúdio é neutro, reflexos coloridos não.
MAX_CHROMA = 6


def crop_to_body(img: "Image.Image", min_fill: float = 0.34) -> "Image.Image":
    """Corta o feixe de cabos acima do corpo do aparelho.

    Os cabos de derivação são brancos sobre fundo branco e não sobrevivem ao
    recorte: a erosão que limpa a franja da carcaça também parte os fios em
    tracinhos. Para o hero isso é pior do que não ter cabo, e um cabo cortado na
    borda do quadro já ficava estranho de qualquer forma.

    O corpo é detectado pela primeira linha cujo trecho opaco cobre uma fração
    significativa da largura: a tampa do aparelho é larga, os fios são finos.
    """
    alpha = img.getchannel("A")
    w, h = img.size
    px = alpha.load()
    body_top = 0
    for y in range(h):
        run = sum(1 for x in range(w) if px[x, y] > 24)
        if run >= w * min_fill:
            body_top = y
            break
    if body_top <= 0:
        return img
    return img.crop((0, body_top, w, h))


def cutout(
    src_path: str,
    out_path: str,
    feather: float = 0.8,
    margin: int = 8,
    drop_cables: bool = False,
) -> None:
    img = Image.open(src_path).convert("RGB")
    w, h = img.size
    px = img.load()

    def is_background_candidate(x: int, y: int) -> bool:
        r, g, b = px[x, y]
        if min(r, g, b) < WHITE_FLOOR:
            return False
        return max(r, g, b) - min(r, g, b) <= MAX_CHROMA

    # Flood fill 4-conexo a partir de todas as bordas.
    bg = bytearray(w * h)
    q: deque[tuple[int, int]] = deque()

    def seed(x: int, y: int) -> None:
        if not bg[y * w + x] and is_background_candidate(x, y):
            bg[y * w + x] = 1
            q.append((x, y))

    for x in range(w):
        seed(x, 0)
        seed(x, h - 1)
    for y in range(h):
        seed(0, y)
        seed(w - 1, y)

    while q:
        x, y = q.popleft()
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h:
                seed(nx, ny)

    alpha = Image.frombytes("L", (w, h), bytes(255 if not v else 0 for v in bg))

    # Erode 1 px antes de suavizar. Os cabos de derivação são brancos sobre fundo
    # branco: o flood fill entra nos vãos entre eles e deixa uma franja clara
    # serrilhada na borda. Contrair o alpha puxa essa franja para dentro do
    # objeto, onde ela desaparece contra o próprio produto.
    alpha = alpha.filter(ImageFilter.MinFilter(3))

    # Suaviza a borda: o recorte binário deixa serrilhado nas curvas do produto.
    if feather > 0:
        alpha = alpha.filter(ImageFilter.GaussianBlur(feather))

    out = img.convert("RGBA")
    out.putalpha(alpha)

    # Recorta para o conteúdo: sobra transparente atrapalha o dimensionamento em CSS.
    box = out.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
    if box:
        ow, oh = out.size
        x0, y0, x1, y1 = box
        out = out.crop(
            (max(0, x0 - margin), max(0, y0 - margin), min(ow, x1 + margin), min(oh, y1 + margin))
        )

    # Só agora: a detecção do corpo compara a largura opaca com a largura do
    # OBJETO. Rodando antes, ela comparava com a largura do quadro quadrado
    # original, onde o aparelho ocupa uma faixa estreita, e a primeira linha
    # "larga" acabava sendo a sombra no rodapé.
    if drop_cables:
        out = crop_to_body(out)
        box2 = out.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
        if box2:
            out = out.crop(box2)

    out.save(out_path, "PNG", optimize=True)
    covered = sum(bg) / (w * h)
    print(f"{out_path}  {out.size[0]}x{out.size[1]}  fundo removido: {covered * 100:.1f}%")


if __name__ == "__main__":
    flags = [a for a in sys.argv[1:] if a.startswith("--")]
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if len(args) < 2:
        raise SystemExit(__doc__)
    cutout(args[0], args[1], drop_cables="--drop-cables" in flags)
