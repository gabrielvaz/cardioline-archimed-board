"""Vetoriza o logo PNG oficial da Cardioline para SVG.

Pipeline: alpha -> marching squares sub-pixel (iso 0.5) -> Douglas-Peucker
-> deteccao de cantos -> ajuste de Beziers cubicas. Nao redesenha o logo:
extrai o contorno real do asset oficial com precisao sub-pixel.
"""
import struct, zlib, math, sys

# ---------- PNG decode (RGBA8) ----------
def load_png(path):
    d = open(path, 'rb').read()
    pos, idat, w, h, ct, bd = 8, b'', 0, 0, 0, 0
    while pos < len(d):
        ln = struct.unpack('>I', d[pos:pos + 4])[0]
        typ = d[pos + 4:pos + 8]
        data = d[pos + 8:pos + 8 + ln]
        if typ == b'IHDR':
            w, h, bd, ct = struct.unpack('>IIBB', data[:10])
        elif typ == b'IDAT':
            idat += data
        pos += 12 + ln
    assert ct == 6 and bd == 8, f'esperava RGBA8, veio ct={ct} bd={bd}'
    raw = zlib.decompress(idat)
    bpp, stride = 4, w * 4
    prev = bytearray(stride)
    rows = []
    i = 0
    for _ in range(h):
        f = raw[i]; i += 1
        line = bytearray(raw[i:i + stride]); i += stride
        for x in range(stride):
            a = line[x - bpp] if x >= bpp else 0
            b = prev[x]
            c = prev[x - bpp] if x >= bpp else 0
            if f == 1: line[x] = (line[x] + a) & 255
            elif f == 2: line[x] = (line[x] + b) & 255
            elif f == 3: line[x] = (line[x] + (a + b) // 2) & 255
            elif f == 4:
                p = a + b - c
                pa, pb, pc = abs(p - a), abs(p - b), abs(p - c)
                pr = a if (pa <= pb and pa <= pc) else (b if pb <= pc else c)
                line[x] = (line[x] + pr) & 255
        rows.append(bytes(line)); prev = line
    return w, h, rows

# ---------- campo de alpha com borda zero ----------
def alpha_field(w, h, rows, pad=1):
    W, H = w + 2 * pad, h + 2 * pad
    fld = [[0.0] * W for _ in range(H)]
    for y in range(h):
        r = rows[y]
        fy = fld[y + pad]
        for x in range(w):
            fy[x + pad] = r[x * 4 + 3] / 255.0
    return W, H, fld

# ---------- marching squares sub-pixel ----------
ISO = 0.5
def interp(p1, v1, p2, v2):
    t = 0.5 if v1 == v2 else (ISO - v1) / (v2 - v1)
    t = max(0.0, min(1.0, t))
    return (p1[0] + (p2[0] - p1[0]) * t, p1[1] + (p2[1] - p1[1]) * t)

def marching_squares(W, H, fld):
    segs = []
    for y in range(H - 1):
        for x in range(W - 1):
            tl, tr = fld[y][x], fld[y][x + 1]
            bl, br = fld[y + 1][x], fld[y + 1][x + 1]
            code = (1 if tl >= ISO else 0) | (2 if tr >= ISO else 0) | \
                   (4 if br >= ISO else 0) | (8 if bl >= ISO else 0)
            if code in (0, 15):
                continue
            P = lambda a, b: (float(a), float(b))
            top    = lambda: interp(P(x, y),   tl, P(x + 1, y),     tr)
            right  = lambda: interp(P(x+1, y), tr, P(x + 1, y + 1), br)
            bottom = lambda: interp(P(x, y+1), bl, P(x + 1, y + 1), br)
            left   = lambda: interp(P(x, y),   tl, P(x, y + 1),     bl)
            # orientacao: interior (>=ISO) sempre a esquerda do sentido do segmento
            if code == 1:    segs.append((left(), top()))
            elif code == 2:  segs.append((top(), right()))
            elif code == 3:  segs.append((left(), right()))
            elif code == 4:  segs.append((right(), bottom()))
            elif code == 5:
                if (tl + tr + bl + br) / 4.0 >= ISO:   # sela conectada tl-br
                    segs.append((right(), top())); segs.append((left(), bottom()))
                else:
                    segs.append((left(), top())); segs.append((right(), bottom()))
            elif code == 6:  segs.append((top(), bottom()))
            elif code == 7:  segs.append((left(), bottom()))
            elif code == 8:  segs.append((bottom(), left()))
            elif code == 9:  segs.append((bottom(), top()))
            elif code == 10:
                if (tl + tr + bl + br) / 4.0 >= ISO:   # sela conectada tr-bl
                    segs.append((top(), left())); segs.append((bottom(), right()))
                else:
                    segs.append((top(), right())); segs.append((bottom(), left()))
            elif code == 11: segs.append((bottom(), right()))
            elif code == 12: segs.append((right(), left()))
            elif code == 13: segs.append((right(), top()))
            elif code == 14: segs.append((top(), left()))
    return segs

def key(p, q=1e6):
    return (round(p[0] * q), round(p[1] * q))

def stitch(segs):
    """Junta segmentos orientados em polilinhas fechadas."""
    nxt = {}
    for a, b in segs:
        nxt.setdefault(key(a), []).append((a, b))
    loops = []
    used = set()
    for i, (a0, b0) in enumerate(segs):
        if i in used:
            continue
        # constroi seguindo encadeamento
        pts = [a0]
        cur = b0
        used.add(i)
        guard = 0
        while guard < len(segs) + 5:
            guard += 1
            k = key(cur)
            cands = nxt.get(k)
            if not cands:
                break
            pick = None
            for a, b in cands:
                idx = None
                # localiza indice ainda nao usado
                for j, s in enumerate(segs):
                    if j in used: continue
                    if s[0] is a and s[1] is b:
                        idx = j; break
                if idx is not None:
                    pick = (idx, b); break
            if pick is None:
                break
            used.add(pick[0])
            pts.append(cur)
            cur = pick[1]
            if key(cur) == key(a0):
                break
        if len(pts) >= 3:
            loops.append(pts)
    return loops

# ---------- Douglas-Peucker ----------
def dp(pts, tol):
    if len(pts) < 3:
        return pts
    def rec(lo, hi, keep):
        ax, ay = pts[lo]; bx, by = pts[hi]
        dx, dy = bx - ax, by - ay
        n = math.hypot(dx, dy)
        worst, wi = -1.0, -1
        for i in range(lo + 1, hi):
            px, py = pts[i]
            d = abs(dy * (px - ax) - dx * (py - ay)) / n if n > 1e-12 else math.hypot(px - ax, py - ay)
            if d > worst:
                worst, wi = d, i
        if worst > tol:
            rec(lo, wi, keep); keep.add(wi); rec(wi, hi, keep)
    keep = {0, len(pts) - 1}
    sys.setrecursionlimit(20000)
    rec(0, len(pts) - 1, keep)
    return [pts[i] for i in sorted(keep)]

# ---------- cantos + Beziers ----------
def turn_deg(prev, cur, nxt_):
    v1 = (cur[0] - prev[0], cur[1] - prev[1])
    v2 = (nxt_[0] - cur[0], nxt_[1] - cur[1])
    n1, n2 = math.hypot(*v1), math.hypot(*v2)
    if n1 < 1e-9 or n2 < 1e-9:
        return 180.0
    cos = max(-1.0, min(1.0, (v1[0]*v2[0] + v1[1]*v2[1]) / (n1*n2)))
    return math.degrees(math.acos(cos))

# Vertices fora da faixa de arco nao recebem tangente: giro pequeno = trecho
# reto (suavizar ali gera ondulacao), giro grande = canto real do desenho.
ARC_MIN, ARC_MAX = 6.0, 52.0

def is_corner(prev, cur, nxt_):
    t = turn_deg(prev, cur, nxt_)
    return t <= ARC_MIN or t > ARC_MAX

def f(v):
    s = f'{v:.2f}'.rstrip('0').rstrip('.')
    return '0' if s in ('-0', '') else s

def loop_to_path(pts, smooth=True, tension=1/3):
    n = len(pts)
    if n < 3:
        return ''
    corner = [is_corner(pts[(i-1) % n], pts[i], pts[(i+1) % n]) for i in range(n)] if smooth \
             else [True] * n
    # tangentes Catmull-Rom (zeradas em cantos)
    tan = []
    for i in range(n):
        if corner[i]:
            tan.append((0.0, 0.0))
        else:
            p0, p1 = pts[(i-1) % n], pts[(i+1) % n]
            tan.append(((p1[0]-p0[0]) * 0.5, (p1[1]-p0[1]) * 0.5))
    d = [f'M{f(pts[0][0])} {f(pts[0][1])}']
    for i in range(n):
        a, b = pts[i], pts[(i+1) % n]
        ta, tb = tan[i], tan[(i+1) % n]
        if ta == (0.0, 0.0) and tb == (0.0, 0.0):
            d.append(f'L{f(b[0])} {f(b[1])}')
        else:
            c1 = (a[0] + ta[0] * tension * 3 * 0.5, a[1] + ta[1] * tension * 3 * 0.5)
            c2 = (b[0] - tb[0] * tension * 3 * 0.5, b[1] - tb[1] * tension * 3 * 0.5)
            d.append(f'C{f(c1[0])} {f(c1[1])} {f(c2[0])} {f(c2[1])} {f(b[0])} {f(b[1])}')
    d.append('Z')
    return ''.join(d)

# ---------- main ----------
src, out_orange, out_white = sys.argv[1], sys.argv[2], sys.argv[3]
w, h, rows = load_png(src)
pad = 1
W, H, fld = alpha_field(w, h, rows, pad)
segs = marching_squares(W, H, fld)
loops = stitch(segs)
loops.sort(key=len, reverse=True)
paths = []
for lp in loops:
    if len(lp) < 6:
        continue
    s = dp(lp, 0.2)
    if len(s) < 3:
        continue
    # translada removendo o pad
    s = [(p[0] - pad, p[1] - pad) for p in s]
    paths.append(loop_to_path(s))
d = ''.join(paths)
tmpl = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" '
        'role="img" aria-label="Cardioline">'
        '<title>Cardioline</title>'
        '<path fill="{c}" fill-rule="evenodd" d="{d}"/></svg>')
open(out_orange, 'w').write(tmpl.format(w=w, h=h, c='#F66201', d=d))
open(out_white, 'w').write(tmpl.format(w=w, h=h, c='#FFFFFF', d=d))
print(f'origem {w}x{h}  contornos={len(loops)}  emitidos={len(paths)}  bytes_d={len(d)}')
