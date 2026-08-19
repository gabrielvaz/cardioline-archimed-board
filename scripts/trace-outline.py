"""Extrai o contorno da silhueta de uma camada com alpha, como polígono.

Serve para construir a geometria 3D do VIREO AM por extrusão: a silhueta é a do
render ortográfico oficial, não uma aproximação desenhada com primitivas. Assim o
contorno do produto no modelo é literalmente o contorno do produto.

Marching squares sub-pixel no canal alpha em iso 0.5, depois Douglas-Peucker.
Mesma técnica do scripts/trace-brand-anchor.py, aqui devolvendo pontos
normalizados em vez de um path SVG.

Uso:
    python3 scripts/trace-outline.py <entrada.png> <saida.json> [--tol 1.2]
"""

from __future__ import annotations

import json
import math
import sys
from pathlib import Path

from PIL import Image

ISO = 0.5


def marching_squares(alpha: list[list[float]], w: int, h: int) -> list[tuple]:
    segs: list[tuple] = []

    def interp(p1, v1, p2, v2):
        t = 0.5 if v1 == v2 else (ISO - v1) / (v2 - v1)
        t = max(0.0, min(1.0, t))
        return (p1[0] + (p2[0] - p1[0]) * t, p1[1] + (p2[1] - p1[1]) * t)

    for y in range(h - 1):
        for x in range(w - 1):
            tl, tr = alpha[y][x], alpha[y][x + 1]
            bl, br = alpha[y + 1][x], alpha[y + 1][x + 1]
            code = (
                (1 if tl >= ISO else 0)
                | (2 if tr >= ISO else 0)
                | (4 if br >= ISO else 0)
                | (8 if bl >= ISO else 0)
            )
            if code in (0, 15):
                continue
            top = lambda: interp((x, y), tl, (x + 1, y), tr)
            right = lambda: interp((x + 1, y), tr, (x + 1, y + 1), br)
            bottom = lambda: interp((x, y + 1), bl, (x + 1, y + 1), br)
            left = lambda: interp((x, y), tl, (x, y + 1), bl)
            center = (tl + tr + bl + br) / 4
            if code == 1:
                segs.append((left(), top()))
            elif code == 2:
                segs.append((top(), right()))
            elif code == 3:
                segs.append((left(), right()))
            elif code == 4:
                segs.append((right(), bottom()))
            elif code == 5:
                if center >= ISO:
                    segs += [(right(), top()), (left(), bottom())]
                else:
                    segs += [(left(), top()), (right(), bottom())]
            elif code == 6:
                segs.append((top(), bottom()))
            elif code == 7:
                segs.append((left(), bottom()))
            elif code == 8:
                segs.append((bottom(), left()))
            elif code == 9:
                segs.append((bottom(), top()))
            elif code == 10:
                if center >= ISO:
                    segs += [(top(), left()), (bottom(), right())]
                else:
                    segs += [(top(), right()), (bottom(), left())]
            elif code == 11:
                segs.append((bottom(), right()))
            elif code == 12:
                segs.append((right(), left()))
            elif code == 13:
                segs.append((right(), top()))
            elif code == 14:
                segs.append((top(), left()))
    return segs


def stitch(segs: list[tuple]) -> list[list[tuple]]:
    """Junta segmentos orientados em polilinhas fechadas."""
    key = lambda p: (round(p[0] * 1e6), round(p[1] * 1e6))
    starts: dict = {}
    for i, (a, b) in enumerate(segs):
        starts.setdefault(key(a), []).append(i)
    used = [False] * len(segs)
    loops: list[list[tuple]] = []
    for i in range(len(segs)):
        if used[i]:
            continue
        used[i] = True
        pts = [segs[i][0]]
        cur = segs[i][1]
        guard = 0
        while guard < len(segs) + 5:
            guard += 1
            nxt = None
            for j in starts.get(key(cur), []):
                if not used[j]:
                    nxt = j
                    break
            if nxt is None:
                break
            used[nxt] = True
            pts.append(cur)
            cur = segs[nxt][1]
            if key(cur) == key(pts[0]):
                break
        if len(pts) >= 3:
            loops.append(pts)
    return loops


def dp(pts: list[tuple], tol: float) -> list[tuple]:
    if len(pts) < 3:
        return pts
    sys.setrecursionlimit(20000)
    keep = {0, len(pts) - 1}

    def rec(lo: int, hi: int) -> None:
        ax, ay = pts[lo]
        bx, by = pts[hi]
        dx, dy = bx - ax, by - ay
        n = math.hypot(dx, dy)
        worst, wi = -1.0, -1
        for i in range(lo + 1, hi):
            px, py = pts[i]
            d = (
                abs(dy * (px - ax) - dx * (py - ay)) / n
                if n > 1e-12
                else math.hypot(px - ax, py - ay)
            )
            if d > worst:
                worst, wi = d, i
        if worst > tol:
            rec(lo, wi)
            keep.add(wi)
            rec(wi, hi)

    rec(0, len(pts) - 1)
    return [pts[i] for i in sorted(keep)]


def main() -> None:
    flags = [a for a in sys.argv[1:] if a.startswith("--")]
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if len(args) < 2:
        raise SystemExit(__doc__)
    tol = 1.2
    for f in flags:
        if f.startswith("--tol"):
            tol = float(f.split("=", 1)[1]) if "=" in f else tol

    im = Image.open(args[0]).convert("RGBA")
    w, h = im.size
    a = im.getchannel("A").load()
    # Borda transparente para o contorno externo fechar.
    pad = 1
    W, H = w + pad * 2, h + pad * 2
    field = [[0.0] * W for _ in range(H)]
    for y in range(h):
        for x in range(w):
            field[y + pad][x + pad] = a[x, y] / 255.0

    loops = stitch(marching_squares(field, W, H))
    loops.sort(key=len, reverse=True)
    if not loops:
        raise SystemExit("nenhum contorno encontrado")

    outer = dp(loops[0], tol)
    # Normaliza para largura 1, centrado na origem, Y para cima (convenção 3D).
    xs = [p[0] for p in outer]
    ys = [p[1] for p in outer]
    x0, x1 = min(xs), max(xs)
    y0, y1 = min(ys), max(ys)
    span = x1 - x0
    norm = [
        [round((p[0] - x0) / span - 0.5, 5), round(-((p[1] - y0) / span - (y1 - y0) / span / 2), 5)]
        for p in outer
    ]

    out = {
        "source": Path(args[0]).name,
        "pixels": {"w": w, "h": h},
        "aspect": round((y1 - y0) / span, 5),
        "points": norm,
        "count": len(norm),
    }
    Path(args[1]).write_text(json.dumps(out) + "\n")
    print(f"{args[1]}  {len(norm)} pontos  proporcao altura/largura {out['aspect']}")


if __name__ == "__main__":
    main()
